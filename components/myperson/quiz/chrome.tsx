"use client";

import Link from "next/link";
import type { ReactNode } from "react";

export function QuizShell({ children }: { children?: ReactNode }) {
  return (
    <div className="flex min-h-full flex-1 flex-col pb-[calc(env(safe-area-inset-bottom)+28px)] pt-[calc(env(safe-area-inset-top)+14px)]">
      {children}
    </div>
  );
}

/**
 * Back button and progress bar. The bar stays hidden until the opening block is
 * done, and it never shows a count or a time, only how far along she is.
 */
export function QuizTopBar({
  progress,
  onBack,
  backHref,
  disabled = false
}: {
  progress: number | null;
  onBack?: () => void;
  backHref?: string;
  disabled?: boolean;
}) {
  return (
    <div className="shell flex items-center gap-4">
      {backHref ? (
        <Link
          href={backHref}
          className="-ml-2 grid h-11 w-11 place-items-center rounded-mp-pill text-mp-sage mp-hover:text-mp-mist"
          aria-label="Go back"
        >
          <BackIcon />
        </Link>
      ) : (
        <button
          type="button"
          onClick={onBack}
          disabled={disabled}
          className="-ml-2 grid h-11 w-11 place-items-center rounded-mp-pill text-mp-sage mp-hover:text-mp-mist disabled:opacity-40"
          aria-label="Go back one question"
        >
          <BackIcon />
        </button>
      )}

      {progress === null ? (
        <span className="flex-1" />
      ) : (
        <div className="rise-quick flex-1">
          <div
            className="h-1.5 w-full overflow-hidden rounded-mp-pill bg-mp-felt-3"
            role="progressbar"
            aria-valuenow={Math.round(progress * 100)}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="How far along you are"
          >
            <div
              className="h-full rounded-mp-pill bg-mp-ember transition-[width] duration-300 ease-out"
              style={{ width: `${Math.max(3, Math.round(progress * 100))}%` }}
            />
          </div>
        </div>
      )}

      <span aria-hidden className="w-11" />
    </div>
  );
}

function BackIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M15 5l-7 7 7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function QuizCard({
  children,
  animationKey,
  className = ""
}: {
  children: ReactNode;
  animationKey?: string | number;
  className?: string;
}) {
  return (
    <div className="shell flex flex-1 flex-col justify-center py-6">
      <div key={animationKey} className={`card deal-in p-6 pt-7 ${className}`}>
        {children}
      </div>
    </div>
  );
}

export function SectionLabel({ children }: { children: ReactNode }) {
  return <p className="eyebrow mb-2 text-mp-ember-deep">{children}</p>;
}

export function QuizPrompt({ children }: { children: ReactNode }) {
  return <h1 className="text-[clamp(1.45rem,5.2vw,1.8rem)] text-mp-ink">{children}</h1>;
}
