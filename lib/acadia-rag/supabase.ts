import type { AcadiaRetrievedChunk } from "@/types/acadia-rag";
import { ACADIA_RETRIEVAL_LIMIT, getRequiredServerEnv } from "./config";
import { keywordOverlapScore } from "./text";

type SupabaseChunkRow = {
  chunk_id: string;
  document_id: string;
  document_name: string;
  href: string;
  page_number: number;
  article: string | null;
  section: string | null;
  subsection: string | null;
  content: string;
  ocr_quality: "good" | "review" | "poor";
  similarity: number | null;
  keyword_rank: number | null;
};

export async function retrieveCandidateChunks(question: string, query: string, embedding: number[]) {
  const semanticRows = await callSupabaseRpc<SupabaseChunkRow[]>("match_acadia_chunks", {
    query_embedding: embedding,
    query_text: query,
    match_count: ACADIA_RETRIEVAL_LIMIT
  });

  const chunks = dedupeChunks(
    semanticRows.map((row) => mapSupabaseRowToChunk(row, question))
  );

  return rerankChunks(question, chunks);
}

async function callSupabaseRpc<T>(functionName: string, body: unknown): Promise<T> {
  const supabaseUrl = getRequiredServerEnv("SUPABASE_URL");
  const serviceRoleKey = getRequiredServerEnv("SUPABASE_SERVICE_ROLE_KEY");
  const response = await fetch(`${supabaseUrl.replace(/\/$/, "")}/rest/v1/rpc/${functionName}`, {
    method: "POST",
    headers: {
      apikey: serviceRoleKey,
      Authorization: `Bearer ${serviceRoleKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body)
  });

  if (!response.ok) {
    throw new Error(`Supabase retrieval failed: ${await response.text()}`);
  }

  return (await response.json()) as T;
}

function mapSupabaseRowToChunk(row: SupabaseChunkRow, question: string): AcadiaRetrievedChunk {
  const semanticScore = row.similarity || 0;
  const keywordScore = Math.max(row.keyword_rank || 0, keywordOverlapScore(question, row.content));

  return {
    chunkId: row.chunk_id,
    documentId: row.document_id,
    documentName: row.document_name,
    href: row.href,
    page: row.page_number,
    article: row.article,
    section: row.section,
    subsection: row.subsection,
    text: row.content,
    ocrQuality: row.ocr_quality,
    semanticScore,
    keywordScore,
    rerankScore: 0
  };
}

function dedupeChunks(chunks: AcadiaRetrievedChunk[]) {
  const seen = new Map<string, AcadiaRetrievedChunk>();

  for (const chunk of chunks) {
    const existing = seen.get(chunk.chunkId);

    if (!existing || scoreBeforeRerank(chunk) > scoreBeforeRerank(existing)) {
      seen.set(chunk.chunkId, chunk);
    }
  }

  return Array.from(seen.values());
}

function rerankChunks(question: string, chunks: AcadiaRetrievedChunk[]) {
  const normalizedQuestion = question.toLowerCase();

  return chunks
    .map((chunk) => {
      const exactPhraseBonus =
        chunk.text.toLowerCase().includes(normalizedQuestion) ||
        normalizedQuestion.includes(chunk.section?.toLowerCase() || "zzzzzz")
          ? 0.1
          : 0;
      const ocrPenalty = chunk.ocrQuality === "poor" ? 0.35 : chunk.ocrQuality === "review" ? 0.15 : 0;

      return {
        ...chunk,
        rerankScore:
          chunk.semanticScore * 0.58 +
          chunk.keywordScore * 0.34 +
          exactPhraseBonus -
          ocrPenalty
      };
    })
    .filter((chunk) => chunk.ocrQuality !== "poor")
    .filter((chunk) => chunk.rerankScore >= 0.18 || chunk.semanticScore >= 0.72 || chunk.keywordScore >= 0.3)
    .sort((a, b) => b.rerankScore - a.rerankScore);
}

function scoreBeforeRerank(chunk: AcadiaRetrievedChunk) {
  return chunk.semanticScore + chunk.keywordScore;
}
