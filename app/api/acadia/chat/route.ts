import { NextResponse } from "next/server";
import { answerFromChunks, unsupportedAnswer } from "@/lib/acadia-rag/answer";
import {
  ACADIA_CHAT_CONTEXT,
  ACADIA_CHAT_MODEL,
  answerWithClaude,
  isClaudeConfigured,
  type AcadiaChatTurn
} from "@/lib/acadia-rag/claude";
import { isDebugAllowed } from "@/lib/acadia-rag/config";
import { embedText } from "@/lib/acadia-rag/openai";
import { checkChatRateLimit, visitorKeyFromRequest } from "@/lib/acadia-rag/rate-limit";
import { retrieveCandidateChunks } from "@/lib/acadia-rag/supabase";
import { expandQuery } from "@/lib/acadia-rag/text";
import type { AcadiaChatAnswer } from "@/types/acadia-rag";

export const runtime = "nodejs";
export const maxDuration = 60;

type ChatRequest = {
  question?: string;
  history?: AcadiaChatTurn[];
};

export async function POST(request: Request) {
  let body: ChatRequest;

  try {
    body = (await request.json()) as ChatRequest;
  } catch {
    return NextResponse.json({ error: "Please send a valid question." }, { status: 400 });
  }

  const question = typeof body.question === "string" ? body.question.trim() : "";

  if (!question) {
    return NextResponse.json({ error: "Please enter a question." }, { status: 400 });
  }

  if (question.length > 600) {
    return NextResponse.json(
      { error: "Please ask a shorter question so the document search can stay focused." },
      { status: 400 }
    );
  }

  const debugAllowed = isDebugAllowed(request);

  // Preferred path: Claude reads the documents directly. No database is involved.
  if (isClaudeConfigured()) {
    const limit = checkChatRateLimit(visitorKeyFromRequest(request));

    if (!limit.allowed) {
      return NextResponse.json({ error: limit.reason }, { status: 429 });
    }

    try {
      const history = Array.isArray(body.history) ? body.history : [];
      const { result, usage } = await answerWithClaude(question, history);

      return NextResponse.json(
        debugAllowed
          ? { ...result, engine: { model: ACADIA_CHAT_MODEL, context: ACADIA_CHAT_CONTEXT, usage } }
          : result
      );
    } catch (error) {
      console.error("Acadia Claude helper failed", error);
      return NextResponse.json(
        { error: "The document helper could not reach its answer service. Please try again in a moment." },
        { status: 502 }
      );
    }
  }

  // Older path, kept so the helper still works until ANTHROPIC_API_KEY is added in Vercel:
  // OpenAI embeddings, Supabase vector search, then an OpenAI answer.
  try {
    const rewrittenQuery = rewriteQuestion(question);
    const embedding = await embedText(rewrittenQuery);
    const retrievedChunks = await retrieveCandidateChunks(question, rewrittenQuery, embedding);
    const { result, finalChunks, prompt } = await answerFromChunks(
      question,
      rewrittenQuery,
      retrievedChunks
    );
    const payload: AcadiaChatAnswer = debugAllowed
      ? {
          ...result,
          debug: {
            userQuestion: question,
            rewrittenQuery,
            retrievedChunks,
            finalChunks,
            prompt,
            confidenceScore: scoreConfidence(finalChunks)
          }
        }
      : result;

    return NextResponse.json(payload);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown RAG error.";
    const answer = unsupportedAnswer(message);

    return NextResponse.json(answer, {
      status: message.includes("configured") ? 503 : 200
    });
  }
}

function rewriteQuestion(question: string) {
  const expanded = expandQuery(question);

  if (!expanded) {
    return question;
  }

  return `${question}\nSearch terms: ${expanded}`;
}

function scoreConfidence(chunks: { rerankScore: number }[]) {
  return Number(Math.max(...chunks.map((chunk) => chunk.rerankScore), 0).toFixed(3));
}
