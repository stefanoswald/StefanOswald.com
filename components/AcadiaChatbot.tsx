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
  rawText: string;
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
  const [showDetails, setShowDetails] = useState(false);
  const hasDetails = Boolean(message.documents?.length || message.sources?.length);

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
        {hasDetails ? (
          <button
            type="button"
            onClick={() => setShowDetails((current) => !current)}
            className="mt-3 rounded-md bg-acadia-sky px-3 py-2 text-xs font-bold text-acadia-leaf transition hover:bg-acadia-moss/20"
            aria-expanded={showDetails}
          >
            {showDetails ? "Hide sources" : "Read more..."}
          </button>
        ) : null}
        {showDetails && message.documents?.length ? (
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
        {showDetails && message.sources?.length ? (
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
    .map(({ chunk, score }) => mapChunkToSource(chunk, score, queryTerms));

  const prioritySources = getPriorityRuleSources(normalizedQuestion, queryTerms);
  const mergedSources = mergeSources(prioritySources, scoredSources).slice(0, 5);

  if (mergedSources.length === 0) {
    const fallbackDocuments = scoreDocumentsByTitle(normalizedQuestion).slice(0, 4);

    return {
      text:
        "I am not finding a strong OCR match yet. Try asking about parking, assessments, meetings, board powers, bylaws, covenants, easements, restrictions, amendments, or the plat. Please confirm official interpretations with the HOA board or recorded documents.",
      documents: fallbackDocuments,
      sources: []
    };
  }

  return {
    text: buildConciseAnswer(question, mergedSources),
    documents: [],
    sources: mergedSources
  };
}

function mapChunkToSource(chunk: OcrChunk, score: number, queryTerms: string[]) {
  return {
    id: chunk.id,
    documentTitle: chunk.documentTitle,
    href: chunk.href,
    page: chunk.page,
    excerpt: bestExcerpt(chunk.text, queryTerms) || chunk.excerpt,
    rawText: chunk.text,
    score
  };
}

function getPriorityRuleSources(normalizedQuestion: string, queryTerms: string[]) {
  const asksAboutRvParking =
    includesAny(normalizedQuestion, ["rv", "recreational", "camper", "motorhome", "motor home", "trailer", "boat"]) &&
    includesAny(normalizedQuestion, ["park", "parking", "driveway", "stored", "storage"]);
  const asksAboutPartiesOrNoise = isPartyOrNoiseQuestion(normalizedQuestion);

  if (asksAboutPartiesOrNoise) {
    return ocrChunks
      .filter((chunk) => {
        const text = normalizeText(chunk.text);

        return (
          text.includes("personal conduct of the members and their guests") ||
          text.includes("objectionable noise") ||
          text.includes("special gatherings or events") ||
          text.includes("nuisance or unreasonable inconvenience")
        );
      })
      .map((chunk) => mapChunkToSource(chunk, 99, queryTerms));
  }

  if (asksAboutRvParking) {
    return ocrChunks
      .filter((chunk) => {
        const text = normalizeText(chunk.text);

        return (
          text.includes("vehicles and recreational equipment") ||
          text.includes("recreational vehicle") ||
          text.includes("motor home") ||
          (text.includes("camper") && text.includes("four consecutive hours"))
        );
      })
      .map((chunk) => mapChunkToSource(chunk, 99, queryTerms));
  }

  return [];
}

function mergeSources(primarySources: ChatSource[], secondarySources: ChatSource[]) {
  const seenSourceIds = new Set<string>();

  return [...primarySources, ...secondarySources].filter((source) => {
    if (seenSourceIds.has(source.id)) {
      return false;
    }

    seenSourceIds.add(source.id);
    return true;
  });
}

function buildConciseAnswer(question: string, sources: ChatSource[]) {
  const normalizedQuestion = normalizeText(question);
  const directAnswer = buildDirectRuleAnswer(normalizedQuestion, sources);

  if (directAnswer) {
    return directAnswer;
  }

  const bestSource = sources[0];
  const supportingCount = sources.length - 1;
  const answer = compactAnswerText(bestSource.excerpt) || "I found a related section, but the OCR text is not clean enough to summarize confidently.";
  const supportText =
    supportingCount > 0
      ? ` I found ${supportingCount} other related source${supportingCount === 1 ? "" : "s"} you can check.`
      : "";

  return `Short answer: ${answer}${supportText}`;
}

function buildDirectRuleAnswer(normalizedQuestion: string, sources: ChatSource[]) {
  const combinedSourceText = normalizeText(sources.map((source) => source.rawText).join(" "));
  const asksAboutPartiesOrNoise = isPartyOrNoiseQuestion(normalizedQuestion);
  const asksAboutParking =
    includesAny(normalizedQuestion, ["park", "parking", "driveway", "stored", "storage"]) ||
    includesAny(combinedSourceText, ["parked", "parking", "stored"]);
  const asksAboutRv =
    includesAny(normalizedQuestion, ["rv", "recreational", "camper", "motorhome", "motor home", "trailer", "boat"]) ||
    includesAny(combinedSourceText, ["recreational vehicle", "motor home", "camper", "trailer"]);

  if (asksAboutPartiesOrNoise) {
    return "Short answer: I do not see a specific HOA rule in these documents that sets a guest limit or a music cutoff time. The closest language is general: the board can make rules about member and guest conduct, and objectionable noise or nuisance behavior may be an issue. For an actual party, check current board rules and local noise ordinances too.";
  }

  if (asksAboutParking && asksAboutRv && combinedSourceText.includes("consecutive hours")) {
    return "Short answer: No, not as regular driveway parking or storage. RVs and similar recreational vehicles appear to be limited to four consecutive hours unless they are inside a garage or in a specifically approved/designated space. Use Read more... to check the exact source language.";
  }

  if (
    asksAboutParking &&
    combinedSourceText.includes("parking of vehicles within a street is prohibited")
  ) {
    return "Short answer: No, street parking appears to be prohibited except for momentary parking or isolated special circumstances. Vehicles parked against the rule may be removed by the Association. Use Read more... to check the exact source language.";
  }

  return "";
}

function compactAnswerText(excerpt: string) {
  const cleanExcerpt = cleanOcrExcerpt(excerpt);
  const sentences = cleanExcerpt
    .split(/(?<=[.!?])\s+/)
    .filter((sentence) => sentence.length > 12 && !looksLikeRecordingHeader(sentence));
  const selectedText = sentences.slice(0, 2).join(" ") || cleanExcerpt;

  if (selectedText.length <= 360) {
    return selectedText;
  }

  return `${selectedText.slice(0, 360).trim()}...`;
}

function cleanOcrExcerpt(excerpt: string) {
  return excerpt
    .replace(/\s+/g, " ")
    .replace(/\b(CL|ORBK|ORBKI|OR|Bk|P61)\b[\w\s/.-]{0,80}/gi, " ")
    .replace(/\bPrepared by and return to:[\w\s,.-]{0,160}/gi, " ")
    .replace(/\bAMENDMENT TO [A-Z\s()]+DECLARATION[\w\s,.-]{0,160}/g, " ")
    .trim();
}

function looksLikeRecordingHeader(sentence: string) {
  const normalizedSentence = normalizeText(sentence);

  return (
    normalizedSentence.includes("prepared by") ||
    normalizedSentence.includes("return to") ||
    normalizedSentence.includes("file no") ||
    normalizedSentence.includes("official records") ||
    /^[a-z]{0,4}\s?\d{4,}/.test(normalizedSentence)
  );
}

function includesAny(value: string, needles: string[]) {
  return needles.some((needle) => value.includes(needle));
}

function isPartyOrNoiseQuestion(normalizedQuestion: string) {
  return includesAny(normalizedQuestion, [
    "party",
    "parties",
    "music",
    "noise",
    "quiet",
    "loud",
    "guest",
    "guests",
    "people over",
    "how late",
    "throwing a party"
  ]);
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
    music: ["noise", "nuisance", "guest", "guests"],
    noise: ["music", "nuisance", "guest", "guests"],
    parking: ["park", "vehicle", "vehicles"],
    party: ["parties", "guest", "guests", "noise", "nuisance", "gathering"],
    parties: ["party", "guest", "guests", "noise", "nuisance", "gathering"],
    restriction: ["restrictions", "covenant", "covenants"],
    restrictions: ["restriction", "covenant", "covenants"],
    rv: ["recreational", "vehicle", "vehicles", "motor", "home", "camper", "trailer"],
    rule: ["rules", "bylaws", "by-laws"],
    rules: ["rule", "bylaws", "by-laws"],
    trailer: ["recreational", "vehicle", "vehicles", "camper", "rv"],
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
