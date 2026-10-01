"use client";

import { site } from "@/lib/myperson/site";
import { QuizPrompt, SectionLabel } from "./chrome";

export function Intro({ onStart }: { onStart: () => void }) {
  const intro = site.questionnaire.intro;
  return (
    <div>
      <SectionLabel>Before we start</SectionLabel>
      <QuizPrompt>{intro.title}</QuizPrompt>
      <p className="mt-3 text-mp-ink">{intro.body}</p>
      <ul className="mt-4 grid gap-1.5 text-sm text-mp-ink-muted">
        {intro.details.map((detail) => (
          <li key={detail} className="flex gap-2">
            <span aria-hidden className="text-mp-heart">
              ♥
            </span>
            {detail}
          </li>
        ))}
      </ul>
      <button type="button" className="btn btn-primary mt-6 w-full" onClick={onStart}>
        {intro.button}
      </button>
      <p className="mt-4 text-center text-xs text-mp-ink-muted">{site.privacyNote}</p>
    </div>
  );
}

export function NameScreen({
  value,
  onChange,
  onNext,
  busy
}: {
  value: string;
  onChange: (value: string) => void;
  onNext: () => void;
  busy: boolean;
}) {
  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        if (value.trim()) onNext();
      }}
    >
      <SectionLabel>Hello</SectionLabel>
      <QuizPrompt>{site.questionnaire.namePrompt}</QuizPrompt>
      <input
        className="field mt-5"
        type="text"
        name="firstName"
        autoComplete="given-name"
        autoFocus
        maxLength={40}
        placeholder={site.questionnaire.namePlaceholder}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
      <button type="submit" className="btn btn-ink mt-4 w-full" disabled={!value.trim() || busy}>
        Next
      </button>
    </form>
  );
}

export function Checking() {
  return (
    <div role="status" className="py-6 text-center">
      <p className="font-mp-display text-xl text-mp-ink">{site.questionnaire.checking}</p>
      <div className="mx-auto mt-5 h-1.5 w-40 overflow-hidden rounded-mp-pill bg-mp-cream-3">
        <div className="shuffle h-full w-1/3 rounded-mp-pill bg-mp-ember" />
      </div>
    </div>
  );
}
