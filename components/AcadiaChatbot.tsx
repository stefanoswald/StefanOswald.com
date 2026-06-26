"use client";

import { FormEvent, useMemo, useRef, useState } from "react";
import { acadiaGoverningDocuments } from "@/data/acadiaGoverningDocuments";
import acadiaOcrIndex from "@/data/acadiaOcrIndex.json";
import type { AcadiaGoverningDocument } from "@/types/acadia";

type ChatMessage = {
  id: number;
  role: "assistant" | "resident";
  text: string;
  documents?: AcadiaGoverningDocument[];
  sources?: ChatSource[];
};

type ChatSource = {
  id: string;
  documentTitle: string;
  href: string;
  page: number;
  excerpt: string;
  score: number;
};

type OcrChunk = {
  id: string;
  documentId: string;
  documentTitle: string;
  href: string;
  page: number;
  text: string;
  excerpt: string;
  topicTags: string[];
  vector: number[];
  topTerms: string[];
};

const introMessage: ChatMessage = {
  id: 1,
  role: "assistant",
  text:
    "Hi, I can search the OCR text from the HOA governing PDFs and point you to the most relevant pages. This is informational only, not legal advice."
};

const quickPrompts = ["Parking rules", "Bylaws", "Covenants", "Assessments"];
const ocrChunks = acadiaOcrIndex.chunks as OcrChunk[];
const vectorVocabulary = acadiaOcrIndex.vocabulary as string[];

export function AcadiaChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([introMessage]);
  const [input, setInput] = useState("");
  const nextId = useRef(2);

  const hasUnreadHint = useMemo(
    () => !isOpen && messages.length === 1,
    [isOpen, messages.length]
  );

  function askQuestion(question: string) {
    const trimmedQuestion = question.trim();

    if (!trimmedQuestion) {
      return;
    }

    const answer = buildDocumentAnswer(trimmedQuestion);
    setMessages((currentMessages) => [
      ...currentMessages,
      {
        id: nextId.current++,
        role: "resident",
        text: trimmedQuestion
      },
      {
        id: nextId.current++,
        role: "assistant",
        text: answer.text,
        documents: answer.documents,
        sources: answer.sources
      }
    ]);
    setInput("");
    setIsOpen(true);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    askQuestion(input);
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 flex max-w-[calc(100vw-2rem)] flex-col items-end gap-3 sm:bottom-6 sm:right-6">
      {isOpen ? (
        <section
          className="w-[min(24rem,calc(100vw-2rem))] overflow-hidden rounded-lg border border-acadia-moss/30 bg-white shadow-2xl"
          aria-label="Acadia HOA document helper"
        >
          <div className="flex items-start justify-between gap-4 bg-acadia-ink px-4 py-3 text-white">
            <div>
              <h2 className="text-base font-bold">HOA document helper</h2>
              <p className="mt-1 text-xs leading-5 text-white/75">Informational only, not legal advice.</p>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="rounded-md px-2 py-1 text-xl leading-none text-white/85 transition hover:bg-white/10 hover:text-white"
              aria-label="Close HOA document helper"
            >
              x
            </button>
          </div>

          <div className="max-h-[26rem] space-y-3 overflow-y-auto bg-acadia-cream px-4 py-4">
            {messages.map((message) => (
              <MessageBubble key={message.id} message={message} />
            ))}
          </div>

          <div className="border-t border-acadia-moss/20 bg-white p-4">
            <div className="mb-3 flex flex-wrap gap-2">
              {quickPrompts.map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  onClick={() => askQuestion(prompt)}
                  className="rounded-md bg-acadia-sky px-3 py-2 text-sm font-bold text-acadia-ink transition hover:bg-acadia-moss/20"
                >
                  {prompt}
                </button>
              ))}
            </div>
            <form onSubmit={handleSubmit} className="flex gap-2">
              <label className="sr-only" htmlFor="acadia-chat-question">
                Ask about HOA documents
              </label>
              <input
                id="acadia-chat-question"
                value={input}
                onChange={(event) => setInput(event.target.value)}
                placeholder="Ask about rules, bylaws, covenants..."
                className="min-w-0 flex-1 rounded-md border border-acadia-moss/30 px-3 py-3 text-sm text-acadia-ink outline-none transition placeholder:text-slate-400 focus:border-acadia-leaf focus:ring-2 focus:ring-acadia-leaf/20"
              />
              <button
                type="submit"
                className="rounded-md bg-acadia-leaf px-4 py-3 text-sm font-bold text-white transition hover:bg-acadia-ink"
              >
                Ask
              </button>
            </form>
          </div>
        </section>
      ) : null}

      <button
        type="button"
        onClick={() => setIsOpen((current) => !current)}
        className="relative rounded-full bg-acadia-leaf px-5 py-4 text-base font-bold text-white shadow-2xl transition hover:bg-acadia-ink"
        aria-expanded={isOpen}
        aria-label="Open Acadia HOA document helper"
      >
        Ask HOA docs
        {hasUnreadHint ? (
          <span className="absolute -right-1 -top-1 h-3 w-3 rounded-full bg-amber-300 ring-2 ring-white" />
        ) : null}
      </button>
    </div>
  );
}

function MessageBubble({ message }: { message: ChatMessage }) {
  const isResident = message.role === "resident";

  return (
    <div className={isResident ? "flex justify-end" : "flex justify-start"}>
      <div
        className={
          isResident
            ? "max-w-[85%] rounded-lg bg-acadia-leaf px-4 py-3 text-sm leading-6 text-white"
            : "max-w-[92%] rounded-lg border border-acadia-moss/20 bg-white px-4 py-3 text-sm leading-6 text-slate-700"
        }
      >
        <p>{message.text}</p>
        {message.documents?.length ? (
          <div className="mt-3 space-y-2">
            {message.documents.map((document) => (
              <a
                key={document.id}
                href={document.href}
                target="_blank"
                rel="noreferrer"
                className="block rounded-md border border-acadia-moss/20 bg-acadia-sky px-3 py-2 text-acadia-ink transition hover:border-acadia-leaf hover:bg-white"
              >
                <span className="block font-bold">{document.title}</span>
                <span className="mt-1 block text-xs leading-5 text-slate-600">{document.summary}</span>
                <span className="mt-1 block text-xs font-bold uppercase tracking-wide text-acadia-leaf">
                  Open PDF
                </span>
              </a>
            ))}
          </div>
        ) : null}
        {message.sources?.length ? (
          <div className="mt-3 space-y-2">
            {message.sources.map((source) => (
              <a
                key={source.id}
                href={source.href}
                target="_blank"
                rel="noreferrer"
                className="block rounded-md border border-acadia-moss/20 bg-acadia-sky px-3 py-2 text-acadia-ink transition hover:border-acadia-leaf hover:bg-white"
              >
                <span className="block font-bold">{source.documentTitle}</span>
                <span className="mt-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Page {source.page}
                </span>
                <span className="mt-2 block text-xs leading-5 text-slate-700">{source.excerpt}</span>
                <span className="mt-2 block text-xs font-bold uppercase tracking-wide text-acadia-leaf">
                  Open source page
                </span>
              </a>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}

function buildDocumentAnswer(question: string) {
  const normalizedQuestion = normalizeText(question);
  const primaryTerms = tokenize(normalizedQuestion);
  const queryTerms = expandQueryTerms(primaryTerms);
  const queryVector = buildQueryVector(queryTerms);
  const scoredSources = ocrChunks
    .map((chunk) => ({
      chunk,
      score: scoreChunk(chunk, primaryTerms, queryTerms, queryVector)
    }))
    .filter(({ score }) => score > 0.08)
    .sort((a, b) => b.score - a.score)
    .slice(0, 5)
    .map(({ chunk, score }) => ({
      id: chunk.id,
      documentTitle: chunk.documentTitle,
      href: chunk.href,
      page: chunk.page,
      excerpt: bestExcerpt(chunk.text, queryTerms) || chunk.excerpt,
      score
    }));

  if (scoredSources.length === 0) {
    const fallbackDocuments = scoreDocumentsByTitle(normalizedQuestion).slice(0, 4);

    return {
      text:
        "I am not finding a strong OCR match yet. Try asking about parking, assessments, meetings, board powers, bylaws, covenants, easements, restrictions, amendments, or the plat. Please confirm official interpretations with the HOA board or recorded documents.",
      documents: fallbackDocuments,
      sources: []
    };
  }

  return {
    text:
      `I found ${scoredSources.length} relevant OCR result${scoredSources.length === 1 ? "" : "s"}. Open the source pages below to review the original document language, and confirm important interpretations with the HOA board or official recorded documents.`,
    documents: [],
    sources: scoredSources
  };
}

function scoreDocumentsByTitle(normalizedQuestion: string) {
  return acadiaGoverningDocuments
    .map((document) => ({
      document,
      score: scoreDocument(document, normalizedQuestion)
    }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .map(({ document }) => document);
}

function scoreDocument(document: AcadiaGoverningDocument, normalizedQuestion: string) {
  const searchableText = normalizeText(
    [document.title, document.summary, ...document.topicTags].join(" ")
  );
  const words = normalizedQuestion.split(" ").filter(Boolean);
  let score = 0;

  for (const word of words) {
    if (word.length < 3) {
      continue;
    }

    if (searchableText.includes(word)) {
      score += document.title.toLowerCase().includes(word) ? 3 : 1;
    }
  }

  if (normalizedQuestion.includes("rule") && searchableText.includes("bylaws")) {
    score += 4;
  }

  if (normalizedQuestion.includes("restriction") && searchableText.includes("restrictions")) {
    score += 4;
  }

  return score;
}

function scoreChunk(
  chunk: OcrChunk,
  primaryTerms: string[],
  queryTerms: string[],
  queryVector: number[]
) {
  const vectorScore = cosineSimilarity(queryVector, chunk.vector);
  const normalizedText = normalizeText(
    [chunk.documentTitle, chunk.text, ...chunk.topicTags, ...chunk.topTerms].join(" ")
  );
  const chunkTerms = new Set(tokenize(normalizedText));
  const primaryMatches = primaryTerms.filter((term) => chunkTerms.has(term)).length;
  const expandedMatches = queryTerms.filter((term) => chunkTerms.has(term)).length;
  const topicMatches = queryTerms.filter((term) =>
    new Set(tokenize(normalizeText(chunk.topicTags.join(" ")))).has(term)
  ).length;

  return vectorScore + primaryMatches * 0.34 + expandedMatches * 0.04 + topicMatches * 0.1;
}

function buildQueryVector(queryTerms: string[]) {
  const counts = new Map<string, number>();

  for (const term of queryTerms) {
    counts.set(term, (counts.get(term) || 0) + 1);
  }

  const values = vectorVocabulary.map((term) => counts.get(term) || 0);
  const length = Math.sqrt(values.reduce((sum, value) => sum + value * value, 0)) || 1;

  return values.map((value) => value / length);
}

function cosineSimilarity(queryVector: number[], chunkVector: number[]) {
  return queryVector.reduce((sum, value, index) => sum + value * (chunkVector[index] || 0), 0);
}

function bestExcerpt(text: string, queryTerms: string[]) {
  const sentences = text
    .replace(/\s+/g, " ")
    .split(/(?<=[.!?])\s+/)
    .filter((sentence) => sentence.length > 24);

  const rankedSentences = sentences
    .map((sentence) => ({
      sentence,
      score: queryTerms.filter((term) => new Set(tokenize(normalizeText(sentence))).has(term)).length
    }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score);

  const excerpt = rankedSentences
    .slice(0, 2)
    .map(({ sentence }) => sentence)
    .join(" ");

  if (!excerpt) {
    return "";
  }

  return excerpt.length > 540 ? `${excerpt.slice(0, 540).trim()}...` : excerpt;
}

function expandQueryTerms(terms: string[]) {
  const expansions: Record<string, string[]> = {
    article: ["articles", "incorporation"],
    articles: ["article", "incorporation"],
    assessment: ["assessments", "fees"],
    assessments: ["assessment", "fees"],
    bylaw: ["bylaws", "by-laws", "rules"],
    bylaws: ["bylaw", "by-laws", "rules"],
    covenant: ["covenants", "restriction", "restrictions"],
    covenants: ["covenant", "restriction", "restrictions"],
    director: ["directors", "board"],
    directors: ["director", "board"],
    easement: ["easements"],
    easements: ["easement"],
    fee: ["fees", "assessment", "assessments"],
    fees: ["fee", "assessment", "assessments"],
    meeting: ["meetings", "notice"],
    meetings: ["meeting", "notice"],
    parking: ["park", "vehicle", "vehicles"],
    restriction: ["restrictions", "covenant", "covenants"],
    restrictions: ["restriction", "covenant", "covenants"],
    rule: ["rules", "bylaws", "by-laws"],
    rules: ["rule", "bylaws", "by-laws"],
    vote: ["votes", "voting", "member", "members"],
    voting: ["vote", "votes", "member", "members"]
  };

  return Array.from(
    new Set(terms.flatMap((term) => [term, ...(expansions[term] || [])]))
  );
}

function tokenize(value: string) {
  return value.split(" ").filter((word) => word.length > 2);
}

function normalizeText(value: string) {
  return value
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}
