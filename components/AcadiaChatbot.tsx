"use client";

import { FormEvent, useMemo, useRef, useState } from "react";
import { acadiaGoverningDocuments } from "@/data/acadiaGoverningDocuments";
import type { AcadiaGoverningDocument } from "@/types/acadia";

type ChatMessage = {
  id: number;
  role: "assistant" | "resident";
  text: string;
  documents?: AcadiaGoverningDocument[];
};

const introMessage: ChatMessage = {
  id: 1,
  role: "assistant",
  text:
    "Hi, I can help point you to likely HOA governing documents. These PDFs are scanned, so I can match topics and document titles right now, but full text search will need OCR later."
};

const quickPrompts = ["Bylaws", "Covenants", "Amendments", "Plat"];

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
        documents: answer.documents
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
      </div>
    </div>
  );
}

function buildDocumentAnswer(question: string) {
  const normalizedQuestion = normalizeText(question);
  const scoredDocuments = acadiaGoverningDocuments
    .map((document) => ({
      document,
      score: scoreDocument(document, normalizedQuestion)
    }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map(({ document }) => document);

  if (scoredDocuments.length === 0) {
    return {
      text:
        "I am not finding a strong match yet. Try asking about bylaws, covenants, declarations, amendments, articles of incorporation, or the plat. Please confirm official interpretations with the HOA board or recorded documents.",
      documents: acadiaGoverningDocuments.slice(0, 4)
    };
  }

  return {
    text:
      "Here are the most likely documents to start with. Because these are scanned PDFs, please open the PDF to review the original pages and confirm anything important with the HOA board or official recorded documents.",
    documents: scoredDocuments
  };
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

function normalizeText(value: string) {
  return value
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}
