import type {
  AcadiaChatAnswer,
  AcadiaChatCitation,
  AcadiaConfidence,
  AcadiaRetrievedChunk
} from "@/types/acadia-rag";
import { ACADIA_FINAL_CHUNK_LIMIT } from "./config";
import { generateGroundedAnswer } from "./openai";
import { cleanChunkText } from "./text";

type ModelAnswerPayload = {
  answer?: string;
  details?: string;
  confidence?: AcadiaConfidence;
  confidenceReason?: string;
  citations?: string[];
};

export async function answerFromChunks(question: string, rewrittenQuery: string, chunks: AcadiaRetrievedChunk[]) {
  const finalChunks = selectFinalChunks(chunks);

  if (finalChunks.length === 0) {
    return {
      result: unsupportedAnswer(
        "I could not retrieve a strong supporting section from the HOA documents."
      ),
      finalChunks,
      prompt: ""
    };
  }

  const prompt = buildAnswerPrompt(question, rewrittenQuery, finalChunks);
  const rawAnswer = await generateGroundedAnswer(prompt);
  const parsed = parseModelAnswer(rawAnswer);
  const citations = validateCitations(parsed.citations || [], finalChunks);
  const confidence = normalizeConfidence(parsed.confidence, citations.length, finalChunks);

  return {
    result: {
      answer:
        parsed.answer ||
        "I do not see enough support in the retrieved HOA document sections to answer that confidently.",
      details: parsed.details,
      confidence,
      confidenceReason:
        parsed.confidenceReason || confidenceReason(confidence, citations.length, finalChunks),
      citations
    } satisfies AcadiaChatAnswer,
    finalChunks,
    prompt
  };
}

export function unsupportedAnswer(reason: string): AcadiaChatAnswer {
  return {
    answer:
      "I do not see a clear answer supported by the HOA documents I retrieved.",
    details:
      "Please check the governing documents directly or ask the HOA board for an official interpretation.",
    confidence: "Low",
    confidenceReason: reason,
    citations: []
  };
}

function selectFinalChunks(chunks: AcadiaRetrievedChunk[]) {
  const selected: AcadiaRetrievedChunk[] = [];
  const documentPageSeen = new Set<string>();

  for (const chunk of chunks) {
    const documentPageKey = `${chunk.documentId}:${chunk.page}:${chunk.section || ""}`;

    if (documentPageSeen.has(documentPageKey)) {
      continue;
    }

    selected.push(chunk);
    documentPageSeen.add(documentPageKey);

    if (selected.length >= ACADIA_FINAL_CHUNK_LIMIT) {
      break;
    }
  }

  return selected;
}

function buildAnswerPrompt(question: string, rewrittenQuery: string, chunks: AcadiaRetrievedChunk[]) {
  const evidence = chunks
    .map((chunk, index) => {
      const label = `S${index + 1}`;
      const location = [
        chunk.documentName,
        `Page ${chunk.page}`,
        chunk.article,
        chunk.section,
        chunk.subsection
      ]
        .filter(Boolean)
        .join(" | ");

      return `${label}
Chunk ID: ${chunk.chunkId}
Location: ${location}
OCR quality: ${chunk.ocrQuality}
Text:
${cleanChunkText(chunk.text)}`;
    })
    .join("\n\n---\n\n");

  return `You are answering questions about Acadia Estates HOA governing documents.

Rules:
- Use ONLY the evidence excerpts below.
- Never use model memory or general HOA knowledge.
- Never combine unrelated sections into a rule.
- If the evidence does not directly answer the question, say that clearly.
- If documents disagree, explain the disagreement and set confidence to Low or Medium.
- Keep the Answer short and plain English.
- Details are optional and should be included only if they help.
- Every citation must use a Chunk ID from the evidence.

Return strict JSON only:
{
  "answer": "short human-readable answer",
  "details": "optional explanation or empty string",
  "confidence": "High | Medium | Low",
  "confidenceReason": "why this confidence was chosen",
  "citations": ["chunk-id-1", "chunk-id-2"]
}

User question: ${question}
Rewritten query: ${rewrittenQuery}

Evidence:
${evidence}`;
}

function parseModelAnswer(rawAnswer: string): ModelAnswerPayload {
  const trimmed = rawAnswer.trim();
  const jsonText = trimmed.startsWith("```")
    ? trimmed.replace(/^```(?:json)?/i, "").replace(/```$/, "").trim()
    : trimmed;

  try {
    return JSON.parse(jsonText) as ModelAnswerPayload;
  } catch {
    return {
      answer:
        "I found relevant document text, but I could not format the answer reliably. Please use the listed sources for review.",
      details: rawAnswer.slice(0, 700),
      confidence: "Low",
      confidenceReason: "The answer model did not return the required JSON format.",
      citations: []
    };
  }
}

function validateCitations(citationChunkIds: string[], chunks: AcadiaRetrievedChunk[]): AcadiaChatCitation[] {
  const chunkById = new Map(chunks.map((chunk) => [chunk.chunkId, chunk]));
  const seen = new Set<string>();

  return citationChunkIds
    .map((chunkId) => chunkById.get(chunkId))
    .filter((chunk): chunk is AcadiaRetrievedChunk => Boolean(chunk))
    .filter((chunk) => {
      if (seen.has(chunk.chunkId)) {
        return false;
      }

      seen.add(chunk.chunkId);
      return true;
    })
    .map((chunk) => ({
      chunkId: chunk.chunkId,
      documentName: chunk.documentName,
      href: chunk.href,
      page: chunk.page,
      article: chunk.article,
      section: chunk.section,
      subsection: chunk.subsection
    }));
}

function normalizeConfidence(
  confidence: AcadiaConfidence | undefined,
  citationCount: number,
  chunks: AcadiaRetrievedChunk[]
) {
  const maxScore = Math.max(...chunks.map((chunk) => chunk.rerankScore), 0);

  if (citationCount === 0 || maxScore < 0.25) {
    return "Low";
  }

  if (confidence === "High" && citationCount >= 1 && maxScore >= 0.5) {
    return "High";
  }

  if (confidence === "High") {
    return "Medium";
  }

  return confidence || "Medium";
}

function confidenceReason(
  confidence: AcadiaConfidence,
  citationCount: number,
  chunks: AcadiaRetrievedChunk[]
) {
  if (confidence === "Low") {
    return "The retrieved evidence is limited, weak, or not cited clearly enough.";
  }

  if (confidence === "Medium") {
    return "The answer is supported by retrieved document text, but the relevant language may require board interpretation.";
  }

  return `The answer is directly supported by ${citationCount} cited document section${citationCount === 1 ? "" : "s"} with strong retrieval scores.`;
}
