// Small building blocks shared by the real owner portal pages.

import type React from "react";
import Link from "next/link";
import { errorMessages, okMessages } from "@/lib/acadia-portal/messages";
import { formatCents } from "@/lib/acadia-portal/format";

export const inputClass =
  "mt-1 block w-full rounded-md border border-acadia-moss/40 bg-white px-3 py-2.5 text-base text-acadia-ink placeholder:text-slate-400 focus:border-acadia-leaf focus:outline-none focus:ring-2 focus:ring-acadia-gold";

export function Field({
  label,
  hint,
  children,
  className = ""
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <label className={`block text-sm font-bold text-acadia-ink ${className}`}>
      {label}
      {children}
      {hint ? <span className="mt-1 block text-xs font-normal leading-5 text-slate-600">{hint}</span> : null}
    </label>
  );
}

/** The green or red line at the top of a page after an action. */
export function Flash({ ok, error }: { ok?: string; error?: string }) {
  const okText = ok ? okMessages[ok] : "";
  const errorText = error ? errorMessages[error] : "";
  if (!okText && !errorText) return null;

  return errorText ? (
    <p role="alert" className="mb-5 rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-sm font-semibold text-red-900">
      {errorText}
    </p>
  ) : (
    <p role="status" className="mb-5 rounded-lg border border-emerald-300 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-900">
      {okText}
    </p>
  );
}

export function PageTitle({ eyebrow, title, children }: { eyebrow?: string; title: string; children?: React.ReactNode }) {
  return (
    <div className="mb-6">
      {eyebrow ? <p className="text-xs font-bold uppercase tracking-[0.16em] text-acadia-leaf">{eyebrow}</p> : null}
      <h1 className="mt-1 text-3xl font-bold tracking-tight text-acadia-ink">{title}</h1>
      {children ? <div className="mt-2 max-w-3xl text-base leading-7 text-slate-700">{children}</div> : null}
    </div>
  );
}

export function StatTile({ label, value, note, tone = "text-acadia-ink" }: { label: string; value: string; note?: string; tone?: string }) {
  return (
    <div className="rounded-xl border border-acadia-moss/20 bg-white p-4">
      <p className="text-xs font-bold uppercase tracking-[0.12em] text-slate-600">{label}</p>
      <p className={`mt-1 text-2xl font-bold tabular-nums ${tone}`}>{value}</p>
      {note ? <p className="mt-1 text-xs leading-5 text-slate-600">{note}</p> : null}
    </div>
  );
}

/** A balance in words an owner can read at a glance. */
export function balanceWords(balance: number) {
  if (balance > 0) return { label: "Amount owed", value: formatCents(balance), tone: "text-acadia-ink" };
  if (balance < 0) return { label: "Credit on your account", value: formatCents(-balance), tone: "text-emerald-700" };
  return { label: "Balance", value: "Paid up", tone: "text-emerald-700" };
}

export function LinkButton({
  href,
  children,
  quiet = false,
  className = ""
}: {
  href: string;
  children: React.ReactNode;
  quiet?: boolean;
  className?: string;
}) {
  const tone = quiet
    ? "border border-acadia-moss/40 bg-white text-acadia-ink hover:border-acadia-leaf hover:bg-acadia-sky"
    : "bg-acadia-leaf text-white hover:bg-acadia-ink";
  return (
    <Link
      href={href}
      className={`inline-flex min-h-11 items-center justify-center rounded-md px-4 py-2.5 text-sm font-bold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-acadia-gold focus-visible:ring-offset-2 ${tone} ${className}`}
    >
      {children}
    </Link>
  );
}

export function EmptyNote({ children }: { children: React.ReactNode }) {
  return <p className="rounded-lg border border-dashed border-acadia-moss/40 bg-acadia-cream px-4 py-5 text-sm leading-6 text-slate-700">{children}</p>;
}

export const kindLabels: Record<string, string> = {
  charge: "Charge",
  payment: "Payment",
  credit: "Credit",
  reversal: "Reversal"
};
