"use client";

import Link from "next/link";
import { useEffect, useState, type ReactNode } from "react";
import { SocialLinks } from "@/components/myperson/SocialLinks";
import { CONTACT_CARD_URL } from "@/lib/myperson/api";
import { fill, site } from "@/lib/myperson/site";
import type { Answers } from "@/lib/myperson/types";

function ResultLayout({ children }: { children: ReactNode }) {
  return (
    <div className="shell flex-1 py-8">
      {children}
      <div className="mt-10">
        <p className="mb-3 text-center text-sm text-mp-sage">{site.results.socialsTitle}</p>
        <SocialLinks />
      </div>
      <p className="mt-8 text-center">
        <Link href={site.path} className="link-quiet text-sm">
          {site.results.startOver}
        </Link>
      </p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Compatible                                                           */
/* ------------------------------------------------------------------ */

type Contact = { display: string; sms: string };

/** Her first text, with whatever she chose to add. Nothing is saved: it goes from her phone to his. */
function textLink(contact: Contact, name: string, know: string, why: string): string {
  const copy = site.results.compatible;
  const lines = [fill(copy.textMessage, { name: name.trim() || "someone you met" })];
  if (know.trim()) lines.push(`Something you should know about me: ${know.trim()}`);
  if (why.trim()) lines.push(`Why I filled this out: ${why.trim()}`);
  // "?&body=" works on both iPhone and Android.
  return `${contact.sms}?&body=${encodeURIComponent(lines.join("\n\n"))}`;
}

export function CompatibleResult({
  name,
  contact,
  answers
}: {
  name: string;
  contact: Contact | null;
  answers: Answers;
}) {
  const copy = site.results.compatible;
  const [flipped, setFlipped] = useState(false);
  const [know, setKnow] = useState("");
  const [why, setWhy] = useState("");

  useEffect(() => {
    const timer = window.setTimeout(() => setFlipped(true), 650);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <ResultLayout>
      <div className="text-center">
        <h1 className="text-[clamp(1.9rem,8vw,2.4rem)] text-mp-mist">{copy.title}</h1>
        <p className="mx-auto mt-3 max-w-[32ch] text-mp-sage">{copy.subtitle}</p>
      </div>

      <div className="flip-stage mx-auto mt-8 w-full max-w-[250px]">
        <div className={`flip-card ${flipped ? "" : "face-down"}`}>
          <div className="flip-face flex flex-col rounded-2xl bg-mp-cream p-4 shadow-mp-lift">
            <CornerIndex />
            <div className="flex flex-1 flex-col items-center justify-center text-center">
              <p className="font-mp-display text-xl text-mp-ink">{site.person.fullName}</p>
              {contact ? (
                <p className="mt-2 font-mp-display text-[1.55rem] tabular-nums tracking-tight text-mp-ember-deep">
                  {contact.display}
                </p>
              ) : (
                <p className="mt-2 text-sm text-mp-ink-muted">{copy.noNumber}</p>
              )}
              <p className="mt-2 text-xs text-mp-ink-muted">{site.person.location}</p>
            </div>
            <CornerIndex flipped />
          </div>

          <div className="flip-face flip-back grid place-items-center rounded-2xl border border-mp-felt-line bg-mp-felt-2">
            <div aria-hidden className="card-back-pattern absolute inset-3 rounded-xl opacity-40" />
            <span className="relative text-3xl text-mp-heart">♥</span>
          </div>
        </div>
      </div>

      {contact ? (
        <>
          <div className="mt-6 grid gap-3">
            <a href={textLink(contact, name, know, why)} className="btn btn-primary">
              {copy.textButton}
            </a>
            <form method="post" action={CONTACT_CARD_URL}>
              <input type="hidden" name="answers" value={JSON.stringify(answers)} />
              <button type="submit" className="btn btn-ghost w-full">
                {copy.saveButton}
              </button>
            </form>
          </div>

          <div className="mt-9 rounded-mp-card border border-mp-felt-line bg-mp-felt-2 p-5">
            <p className="eyebrow text-mp-sage">{copy.notesTitle}</p>
            <label className="mt-3 block">
              <span className="text-sm text-mp-mist">{copy.notesKnow}</span>
              <textarea
                className="field mt-1.5"
                rows={2}
                maxLength={500}
                value={know}
                onChange={(event) => setKnow(event.target.value)}
              />
            </label>
            <label className="mt-3 block">
              <span className="text-sm text-mp-mist">{copy.notesWhy}</span>
              <textarea
                className="field mt-1.5"
                rows={2}
                maxLength={500}
                value={why}
                onChange={(event) => setWhy(event.target.value)}
              />
            </label>
            <a
              href={textLink(contact, name, know, why)}
              className={`btn btn-quiet mt-4 w-full ${know.trim() || why.trim() ? "" : "pointer-events-none opacity-45"}`}
              aria-disabled={!(know.trim() || why.trim())}
            >
              {copy.notesButton}
            </a>
          </div>
        </>
      ) : null}
    </ResultLayout>
  );
}

function CornerIndex({ flipped = false }: { flipped?: boolean }) {
  return (
    <span
      aria-hidden
      className={`flex w-6 flex-col items-center leading-none text-mp-heart ${flipped ? "self-end" : ""}`}
    >
      <span className="font-mp-display text-base">{site.person.firstName[0]}</span>
      <span className="text-xs">♥</span>
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* Not compatible                                                       */
/* ------------------------------------------------------------------ */

export function NotCompatibleResult() {
  const copy = site.results.notCompatible;
  return (
    <ResultLayout>
      <div className="card card-pip p-7 pt-8 text-center">
        <span aria-hidden className="text-2xl">
          🤍
        </span>
        <h1 className="mt-3 text-[1.75rem] text-mp-ink">{copy.title}</h1>
        <p className="mt-4 text-left text-mp-ink">{copy.body}</p>
        <p className="mt-4 text-right font-mp-display text-lg italic text-mp-ember-deep">- {copy.signoff}</p>
      </div>
    </ResultLayout>
  );
}
