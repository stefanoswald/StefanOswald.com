"use client";

import { FormEvent, useMemo, useRef, useState } from "react";
import type { AcadiaChatCitation, AcadiaChatDebug } from "@/types/acadia-rag";

type ChatMessage = {
  id: number;
  role: "assistant" | "resident";
  text: string;
  details?: string;
  confidence?: "High" | "Medium" | "Low";
  confidenceReason?: string;
  citations?: AcadiaChatCitation[];
  debug?: AcadiaChatDebug;
};

type ChatResponse = {
  answer: string;
  details?: string;
  confidence: "High" | "Medium" | "Low";
  confidenceReason?: string;
  citations: AcadiaChatCitation[];
  debug?: AcadiaChatDebug;
};

const introMessage: ChatMessage = {
  id: 1,
  role: "assistant",
  text:
    "Hi, I can search the HOA governing documents and answer only from supported sources. This is informational only, not legal advice."
};

const quickPrompts = ["Parking rules", "Bylaws", "Covenants", "Assessments"];

export function AcadiaChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isAsking, setIsAsking] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([introMessage]);
  const [input, setInput] = useState("");
  const nextId = useRef(2);

  const hasUnreadHint = useMemo(
    () => !isOpen && messages.length === 1,
    [isOpen, messages.length]
  );

  async function askQuestion(question: string) {
    const trimmedQuestion = question.trim();

    if (!trimmedQuestion || isAsking) {
      return;
    }

    const residentMessage: ChatMessage = {
      id: nextId.current++,
      role: "resident",
      text: trimmedQuestion
    };

    setMessages((currentMessages) => [...currentMessages, residentMessage]);
    setInput("");
    setIsOpen(true);
    setIsAsking(true);

    try {
      const response = await fetch("/api/acadia/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: trimmedQuestion })
      });
      const payload = (await response.json()) as Partial<ChatResponse> & { error?: string };

      if (!payload.answer) {
        throw new Error(payload.error || "The document helper could not answer right now.");
      }

      setMessages((currentMessages) => [
        ...currentMessages,
        {
          id: nextId.current++,
          role: "assistant",
          text: payload.answer || "I do not see a clear answer supported by the HOA documents.",
          details: payload.details,
          confidence: payload.confidence || "Low",
          confidenceReason: payload.confidenceReason,
          citations: payload.citations || [],
          debug: payload.debug
        }
      ]);
    } catch (error) {
      setMessages((currentMessages) => [
        ...currentMessages,
        {
          id: nextId.current++,
          role: "assistant",
          text:
            error instanceof Error
              ? error.message
              : "The document helper could not answer right now.",
          confidence: "Low",
          confidenceReason: "The server-side document search did not complete."
        }
      ]);
    } finally {
      setIsAsking(false);
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    askQuestion(input);
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 flex max-w-[calc(100vw-2rem)] flex-col items-end gap-3 sm:bottom-6 sm:right-6">
      {isOpen ? (
        <section
          className="w-[min(25rem,calc(100vw-2rem))] overflow-hidden rounded-lg border border-acadia-moss/30 bg-white shadow-2xl"
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

          <div className="max-h-[28rem] space-y-3 overflow-y-auto bg-acadia-cream px-4 py-4">
            {messages.map((message) => (
              <MessageBubble key={message.id} message={message} />
            ))}
            {isAsking ? (
              <div className="flex justify-start">
                <div className="rounded-lg border border-acadia-moss/20 bg-white px-4 py-3 text-sm text-slate-600">
                  Searching the governing documents...
                </div>
              </div>
            ) : null}
          </div>

          <div className="border-t border-acadia-moss/20 bg-white p-4">
            <div className="mb-3 flex flex-wrap gap-2">
              {quickPrompts.map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  onClick={() => askQuestion(prompt)}
                  disabled={isAsking}
                  className="rounded-md bg-acadia-sky px-3 py-2 text-sm font-bold text-acadia-ink transition hover:bg-acadia-moss/20 disabled:cursor-not-allowed disabled:opacity-60"
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
                disabled={isAsking}
                className="min-w-0 flex-1 rounded-md border border-acadia-moss/30 px-3 py-3 text-sm text-acadia-ink outline-none transition placeholder:text-slate-400 focus:border-acadia-leaf focus:ring-2 focus:ring-acadia-leaf/20 disabled:bg-slate-100"
              />
              <button
                type="submit"
                disabled={isAsking}
                className="rounded-md bg-acadia-leaf px-4 py-3 text-sm font-bold text-white transition hover:bg-acadia-ink disabled:cursor-not-allowed disabled:opacity-60"
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
  const [showDebug, setShowDebug] = useState(false);
  const hasDetails = Boolean(message.details || message.citations?.length || message.confidence);

  return (
    <div className={isResident ? "flex justify-end" : "flex justify-start"}>
      <div
        className={
          isResident
            ? "max-w-[85%] rounded-lg bg-acadia-leaf px-4 py-3 text-sm leading-6 text-white"
            : "max-w-[94%] rounded-lg border border-acadia-moss/20 bg-white px-4 py-3 text-sm leading-6 text-slate-700"
        }
      >
        <p className="whitespace-pre-line">{message.text}</p>
        {!isResident && hasDetails ? (
          <button
            type="button"
            onClick={() => setShowDetails((current) => !current)}
            className="mt-3 rounded-md bg-acadia-sky px-3 py-2 text-xs font-bold text-acadia-leaf transition hover:bg-acadia-moss/20"
            aria-expanded={showDetails}
          >
            {showDetails ? "Hide sources" : "Read more..."}
          </button>
        ) : null}
        {showDetails ? (
          <div className="mt-3 space-y-3">
            {message.details ? (
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Details</p>
                <p className="mt-1 text-sm leading-6 text-slate-700">{message.details}</p>
              </div>
            ) : null}
            {message.citations?.length ? (
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Sources</p>
                <div className="mt-2 space-y-2">
                  {message.citations.map((citation) => (
                    <a
                      key={`${citation.chunkId}-${citation.page}`}
                      href={citation.href}
                      target="_blank"
                      rel="noreferrer"
                      className="block rounded-md border border-acadia-moss/20 bg-acadia-sky px-3 py-2 text-acadia-ink transition hover:border-acadia-leaf hover:bg-white"
                    >
                      <span className="block font-bold">{citation.documentName}</span>
                      <span className="mt-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Page {citation.page}
                      </span>
                      {citation.section ? (
                        <span className="mt-1 block text-xs leading-5 text-slate-700">
                          {citation.section}
                        </span>
                      ) : null}
                    </a>
                  ))}
                </div>
              </div>
            ) : null}
            {message.confidence ? (
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Confidence</p>
                <p className="mt-1 font-bold text-acadia-ink">{message.confidence}</p>
                {message.confidenceReason ? (
                  <p className="mt-1 text-xs leading-5 text-slate-600">{message.confidenceReason}</p>
                ) : null}
              </div>
            ) : null}
            {message.debug ? (
              <div>
                <button
                  type="button"
                  onClick={() => setShowDebug((current) => !current)}
                  className="rounded-md border border-acadia-moss/30 px-3 py-2 text-xs font-bold text-acadia-ink transition hover:bg-acadia-sky"
                  aria-expanded={showDebug}
                >
                  {showDebug ? "Hide debug" : "Show debug"}
                </button>
                {showDebug ? <DebugPanel debug={message.debug} /> : null}
              </div>
            ) : null}
          </div>
        ) : null}
      </div>
    </div>
  );
}

function DebugPanel({ debug }: { debug: AcadiaChatDebug }) {
  return (
    <div className="mt-3 max-h-80 overflow-auto rounded-md bg-slate-950 p-3 text-xs leading-5 text-slate-100">
      <pre className="whitespace-pre-wrap">
        {JSON.stringify(debug, null, 2)}
      </pre>
    </div>
  );
}
