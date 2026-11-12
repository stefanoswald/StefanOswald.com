"use client";

import { FormEvent, useCallback, useEffect, useRef, useState } from "react";
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
  isError?: boolean;
};

type ChatResponse = {
  answer: string;
  details?: string;
  confidence: "High" | "Medium" | "Low";
  confidenceReason?: string;
  citations: AcadiaChatCitation[];
  debug?: AcadiaChatDebug;
};

/** Other parts of the site can open the helper with: window.dispatchEvent(new CustomEvent(ACADIA_OPEN_CHAT_EVENT)) */
export const ACADIA_OPEN_CHAT_EVENT = "acadia:open-chat";

const introMessage: ChatMessage = {
  id: 1,
  role: "assistant",
  text:
    "Hi. I can answer questions from the Acadia Estates governing documents and the current HOA items on this site. I show the pages I used so you can check them. This is information, not legal advice."
};

const quickPrompts = [
  "Can I park a boat or RV at my home?",
  "How are assessments set and when are they late?",
  "Do I need approval to change my exterior?",
  "What is the status of the fence project?"
];

const confidenceStyles: Record<NonNullable<ChatMessage["confidence"]>, string> = {
  High: "bg-emerald-100 text-emerald-800",
  Medium: "bg-amber-100 text-amber-800",
  Low: "bg-slate-200 text-slate-700"
};

export function AcadiaChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isAsking, setIsAsking] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([introMessage]);
  const [input, setInput] = useState("");
  const nextId = useRef(2);
  const messagesRef = useRef<ChatMessage[]>(messages);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  messagesRef.current = messages;

  const askQuestion = useCallback(
    async (question: string) => {
      const trimmedQuestion = question.trim();

      if (!trimmedQuestion || isAsking) {
        return;
      }

      // Earlier turns go along so follow-up questions make sense. The intro and errors are left out.
      const history = messagesRef.current
        .filter((message) => message.id !== introMessage.id && !message.isError)
        .slice(-6)
        .map((message) => ({ role: message.role, text: message.text }));

      setMessages((currentMessages) => [
        ...currentMessages,
        { id: nextId.current++, role: "resident", text: trimmedQuestion }
      ]);
      setInput("");
      setIsOpen(true);
      setIsAsking(true);

      try {
        const response = await fetch("/api/acadia/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ question: trimmedQuestion, history })
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
            isError: true,
            text:
              error instanceof Error && error.message && !/fetch|network|json/i.test(error.message)
                ? error.message
                : "The document helper could not answer right now. Please try again in a moment."
          }
        ]);
      } finally {
        setIsAsking(false);
      }
    },
    [isAsking]
  );

  // Let buttons elsewhere on the site open the helper, with or without a starting question.
  useEffect(() => {
    function handleOpen(event: Event) {
      const question = (event as CustomEvent<{ question?: string }>).detail?.question;
      setIsOpen(true);
      if (question) {
        askQuestion(question);
      }
    }

    window.addEventListener(ACADIA_OPEN_CHAT_EVENT, handleOpen);
    return () => window.removeEventListener(ACADIA_OPEN_CHAT_EVENT, handleOpen);
  }, [askQuestion]);

  // Keep the newest message in view, and put the cursor in the box when the panel opens.
  useEffect(() => {
    if (isOpen && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isAsking, isOpen]);

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    function handleKey(event: KeyboardEvent) {
      if (event.key === "Escape") setIsOpen(false);
    }

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isOpen]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    askQuestion(input);
  }

  const showQuickPrompts = messages.length === 1;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex max-w-[calc(100vw-2rem)] flex-col items-end gap-3 print:hidden sm:bottom-6 sm:right-6">
      {isOpen ? (
        <section
          className="flex max-h-[min(40rem,calc(100dvh-6rem))] w-[min(26rem,calc(100vw-2rem))] flex-col overflow-hidden rounded-xl border border-acadia-moss/30 bg-white shadow-2xl"
          aria-label="Acadia HOA document helper"
        >
          <div className="flex items-start justify-between gap-4 bg-acadia-ink px-4 py-3 text-white">
            <div>
              <h2 className="text-base font-bold">Ask the HOA documents</h2>
              <p className="mt-0.5 text-xs leading-5 text-white/75">
                Answers come with page links. Information only, not legal advice.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="-mr-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-md text-white/85 transition hover:bg-white/10 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-acadia-gold"
              aria-label="Close the document helper"
            >
              <svg aria-hidden="true" viewBox="0 0 20 20" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M5 5l10 10M15 5L5 15" />
              </svg>
            </button>
          </div>

          <div
            ref={scrollRef}
            className="min-h-0 flex-1 space-y-3 overflow-y-auto bg-acadia-cream px-4 py-4"
            role="log"
            aria-live="polite"
          >
            {messages.map((message) => (
              <MessageBubble key={message.id} message={message} />
            ))}
            {isAsking ? (
              <div className="flex justify-start">
                <div className="flex items-center gap-2 rounded-lg border border-acadia-moss/20 bg-white px-4 py-3 text-sm text-slate-600">
                  <span className="flex gap-1" aria-hidden="true">
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-acadia-moss [animation-delay:-0.3s]" />
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-acadia-moss [animation-delay:-0.15s]" />
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-acadia-moss" />
                  </span>
                  Reading the governing documents
                </div>
              </div>
            ) : null}
            {showQuickPrompts ? (
              <div className="pt-1">
                <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Try asking</p>
                <div className="mt-2 flex flex-col gap-2">
                  {quickPrompts.map((prompt) => (
                    <button
                      key={prompt}
                      type="button"
                      onClick={() => askQuestion(prompt)}
                      disabled={isAsking}
                      className="rounded-md border border-acadia-moss/25 bg-white px-3 py-2 text-left text-sm font-medium text-acadia-ink transition hover:border-acadia-leaf hover:bg-acadia-sky disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>
            ) : null}
          </div>

          <form onSubmit={handleSubmit} className="flex gap-2 border-t border-acadia-moss/20 bg-white p-3">
            <label className="sr-only" htmlFor="acadia-chat-question">
              Ask about the HOA documents
            </label>
            <input
              ref={inputRef}
              id="acadia-chat-question"
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Ask about rules, bylaws, or projects"
              maxLength={600}
              disabled={isAsking}
              autoComplete="off"
              className="min-w-0 flex-1 rounded-md border border-acadia-moss/30 px-3 py-3 text-base text-acadia-ink outline-none transition placeholder:text-slate-400 focus:border-acadia-leaf focus:ring-2 focus:ring-acadia-leaf/20 disabled:bg-slate-100 sm:text-sm"
            />
            <button
              type="submit"
              disabled={isAsking || !input.trim()}
              className="rounded-md bg-acadia-leaf px-4 py-3 text-sm font-bold text-white transition hover:bg-acadia-ink disabled:cursor-not-allowed disabled:opacity-50"
            >
              Ask
            </button>
          </form>
        </section>
      ) : null}

      <button
        type="button"
        onClick={() => setIsOpen((current) => !current)}
        className="flex min-h-12 items-center gap-2 rounded-full bg-acadia-leaf px-4 py-3 text-sm font-bold text-white shadow-2xl ring-2 ring-white/70 transition hover:bg-acadia-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-acadia-gold sm:px-5 sm:text-base"
        aria-expanded={isOpen}
        aria-label={isOpen ? "Close the HOA document helper" : "Open the HOA document helper"}
      >
        <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12Z" />
        </svg>
        <span>{isOpen ? "Close" : "Ask HOA docs"}</span>
      </button>
    </div>
  );
}

function MessageBubble({ message }: { message: ChatMessage }) {
  const isResident = message.role === "resident";
  const [showDetails, setShowDetails] = useState(false);
  const [showDebug, setShowDebug] = useState(false);
  const hasMore = Boolean(message.details || message.confidenceReason);

  if (isResident) {
    return (
      <div className="flex justify-end">
        <div className="max-w-[85%] rounded-lg bg-acadia-leaf px-4 py-3 text-sm leading-6 text-white">
          <p className="whitespace-pre-line">{message.text}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-start">
      <div
        className={`max-w-[94%] rounded-lg border px-4 py-3 text-sm leading-6 ${
          message.isError
            ? "border-red-200 bg-red-50 text-red-800"
            : "border-acadia-moss/20 bg-white text-slate-700"
        }`}
      >
        <p className="whitespace-pre-line">{message.text}</p>

        {message.citations?.length ? (
          <div className="mt-3">
            <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Check the source</p>
            <div className="mt-1.5 flex flex-wrap gap-1.5">
              {message.citations.map((citation) => (
                <a
                  key={`${citation.chunkId}-${citation.page}`}
                  href={citation.href}
                  target="_blank"
                  rel="noreferrer"
                  title={citation.section || undefined}
                  className="inline-flex max-w-full items-center gap-1 rounded-md border border-acadia-moss/25 bg-acadia-sky px-2 py-1 text-xs font-semibold text-acadia-ink transition hover:border-acadia-leaf hover:bg-white"
                >
                  <span className="truncate">{citation.documentName}</span>
                  {citation.page > 0 ? <span className="shrink-0 text-slate-500">p. {citation.page}</span> : null}
                </a>
              ))}
            </div>
          </div>
        ) : null}

        {message.confidence ? (
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <span className={`rounded-md px-2 py-0.5 text-xs font-bold ${confidenceStyles[message.confidence]}`}>
              {message.confidence} confidence
            </span>
            {hasMore ? (
              <button
                type="button"
                onClick={() => setShowDetails((current) => !current)}
                className="text-xs font-bold text-acadia-leaf underline decoration-acadia-moss/50 underline-offset-4 hover:text-acadia-ink"
                aria-expanded={showDetails}
              >
                {showDetails ? "Hide details" : "More details"}
              </button>
            ) : null}
          </div>
        ) : null}

        {showDetails ? (
          <div className="mt-3 space-y-2 border-t border-acadia-moss/15 pt-3">
            {message.details ? <p className="text-sm leading-6 text-slate-700">{message.details}</p> : null}
            {message.confidenceReason ? (
              <p className="text-xs leading-5 text-slate-600">
                <strong className="text-acadia-ink">Why this confidence:</strong> {message.confidenceReason}
              </p>
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
      <pre className="whitespace-pre-wrap">{JSON.stringify(debug, null, 2)}</pre>
    </div>
  );
}
