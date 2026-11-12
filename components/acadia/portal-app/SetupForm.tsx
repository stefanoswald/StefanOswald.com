"use client";

import { useActionState } from "react";
import { boardSetupAction } from "@/app/Acadia/portal/actions";
import { Field, inputClass } from "@/components/acadia/portal-app/parts";
import { SubmitButton } from "@/components/acadia/portal-app/SubmitButton";
import type { FormState } from "@/lib/acadia-portal/messages";

const initialState: FormState = {};

export function SetupForm() {
  const [state, formAction] = useActionState(boardSetupAction, initialState);

  return (
    <form action={formAction} className="space-y-4">
      <Field label="Admin key" hint="The ACADIA_ADMIN_KEY value saved in the site settings on Vercel.">
        <input name="adminKey" type="password" required autoComplete="off" className={inputClass} />
      </Field>
      <Field label="Your name">
        <input name="name" type="text" required maxLength={80} autoComplete="name" defaultValue={state.values?.name} className={inputClass} />
      </Field>
      <Field label="Your email" hint="Used to find your board record if you come back to this page later.">
        <input name="email" type="email" required maxLength={160} autoComplete="email" defaultValue={state.values?.email} className={inputClass} />
      </Field>
      <Field label="Your house number" hint="Optional. Fill it in to see your own home's ledger too.">
        <input name="houseNumber" type="text" inputMode="numeric" maxLength={10} defaultValue={state.values?.houseNumber} className={inputClass} />
      </Field>
      {state.error ? (
        <p role="alert" className="rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-sm font-semibold text-red-900">
          {state.error}
        </p>
      ) : null}
      <SubmitButton>Sign in as a board member</SubmitButton>
    </form>
  );
}
