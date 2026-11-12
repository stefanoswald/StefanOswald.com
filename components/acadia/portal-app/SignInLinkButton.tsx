"use client";

import { useActionState, useState } from "react";
import { createLinkAction } from "@/app/Acadia/portal/actions";
import { SubmitButton } from "@/components/acadia/portal-app/SubmitButton";
import type { LinkState } from "@/lib/acadia-portal/messages";

const initialState: LinkState = {};

/** Makes a one-time sign-in link for a person and shows it once so a board member can send it. */
export function SignInLinkButton({ personId, personName, linkDays }: { personId: number; personName: string; linkDays: number }) {
  const [state, formAction] = useActionState(createLinkAction, initialState);
  const [copied, setCopied] = useState(false);

  async function copy() {
    if (!state.url) return;
    try {
      await navigator.clipboard.writeText(state.url);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div>
      <form action={formAction} onSubmit={() => setCopied(false)}>
        <input type="hidden" name="personId" value={personId} />
        <SubmitButton tone="quiet" small>
          {state.url ? "Make another link" : "Create sign-in link"}
        </SubmitButton>
      </form>
      {state.error ? (
        <p role="alert" className="mt-2 text-xs font-semibold text-red-800">
          {state.error}
        </p>
      ) : null}
      {state.url ? (
        <div className="mt-3 rounded-lg border border-acadia-gold/60 bg-amber-50 p-3">
          <p className="text-xs font-bold text-amber-950">
            Send this link to {personName} only. It works one time and expires in {linkDays} days. It is shown here once.
          </p>
          <input
            readOnly
            value={state.url}
            aria-label={`Sign-in link for ${personName}`}
            onFocus={(event) => event.currentTarget.select()}
            className="mt-2 block w-full rounded-md border border-amber-300 bg-white px-2 py-2 font-mono text-xs text-acadia-ink"
          />
          <button
            type="button"
            onClick={copy}
            className="mt-2 inline-flex min-h-9 items-center rounded-md bg-acadia-ink px-3 py-1.5 text-xs font-bold text-white transition hover:bg-acadia-leaf focus:outline-none focus-visible:ring-2 focus-visible:ring-acadia-gold"
          >
            {copied ? "Copied" : "Copy link"}
          </button>
        </div>
      ) : null}
    </div>
  );
}
