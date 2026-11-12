"use client";

import Link from "next/link";
import { useActionState, useEffect, useState } from "react";
import { signInAction } from "@/app/Acadia/portal/actions";
import { SubmitButton } from "@/components/acadia/portal-app/SubmitButton";
import type { FormState } from "@/lib/acadia-portal/messages";

const initialState: FormState = {};

/**
 * The page a private sign-in link opens. The secret sits after the # in the address, so it is never
 * sent to a server until the person presses the button. That also means a link preview in an email
 * or text app cannot use the link up by accident.
 */
export function EnterForm() {
  const [token, setToken] = useState<string | null>(null);
  const [state, formAction] = useActionState(signInAction, initialState);

  useEffect(() => {
    const fromAddress = window.location.hash.replace(/^#/, "");
    setToken(fromAddress);
    // Take the secret out of the address bar and the browser history.
    if (fromAddress) window.history.replaceState(null, "", window.location.pathname);
  }, []);

  if (token === null) {
    return <p className="text-sm text-slate-600">Checking your link...</p>;
  }

  if (!token) {
    return (
      <div>
        <p className="text-base leading-7 text-slate-700">
          This page needs a private sign-in link from the board. Open the full link you were sent.
        </p>
        <Link href="/Acadia/portal/sign-in" className="mt-4 inline-block font-bold text-acadia-leaf underline">
          How sign-in works
        </Link>
      </div>
    );
  }

  return (
    <form action={formAction}>
      <input type="hidden" name="token" value={token} />
      <p className="text-base leading-7 text-slate-700">
        Your link is ready. Press the button to sign in on this device. The link works one time.
      </p>
      {state.error ? (
        <p role="alert" className="mt-4 rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-sm font-semibold text-red-900">
          {state.error}
        </p>
      ) : null}
      <SubmitButton className="mt-5 w-full sm:w-auto">Sign in to the owner portal</SubmitButton>
    </form>
  );
}
