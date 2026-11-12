"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { ACADIA_OPEN_CHAT_EVENT } from "@/components/AcadiaChatbot";
import { acadiaGoverningDocuments } from "@/data/acadiaGoverningDocuments";
import {
  requestKinds,
  sampleAnnouncements,
  sampleAssessment,
  sampleBudgetShares,
  sampleCalendar,
  samplePaymentMethods,
  type LedgerEntry,
  type OwnerRequest,
  type PaymentMethodId,
  type RequestStatus
} from "./sampleData";
import { Chip, Panel, PrimaryButton, QuietButton, SampleTag, Toggle, money } from "./ui";

export type OwnerTab = "overview" | "payments" | "requests" | "documents" | "community";

export type AutopayState = {
  on: boolean;
  method: PaymentMethodId;
  timing: "due" | "early";
  cap: string;
};

type Shared = {
  balance: number;
  goToTab: (tab: OwnerTab) => void;
  notify: (message: string) => void;
};

// ---------------------------------------------------------------- Overview

export function OwnerOverview({
  balance,
  autopay,
  setAutopay,
  requests,
  openPay,
  goToTab,
  notify
}: Shared & {
  autopay: AutopayState;
  setAutopay: (next: AutopayState) => void;
  requests: OwnerRequest[];
  openPay: () => void;
}) {
  const paidUp = balance <= 0;
  const methodDetail = samplePaymentMethods.find((item) => item.id === autopay.method)?.detail || "";

  return (
    <div className="grid gap-5 lg:grid-cols-3">
      <section className="rounded-xl bg-acadia-ink p-6 text-white lg:col-span-2">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-acadia-gold">
            {paidUp ? "Account status" : "Balance due"}
          </p>
          <SampleTag />
        </div>
        <p className="mt-3 text-5xl font-bold tracking-tight">{money(Math.max(balance, 0))}</p>
        <p className="mt-2 text-sm leading-6 text-white/75">
          {paidUp
            ? "You are paid in full. Thank you. The next assessment will post before its due date."
            : `${sampleAssessment.label}. Due ${sampleAssessment.dueDate}.`}
        </p>
        {!paidUp && autopay.on ? (
          <p className="mt-3 inline-flex rounded-md bg-white/10 px-3 py-1.5 text-sm font-semibold text-white">
            Autopay will handle this on {autopay.timing === "due" ? "the due date" : "December 27, 2026"}.
          </p>
        ) : null}
        <div className="mt-6 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={openPay}
            disabled={paidUp}
            className="inline-flex min-h-12 items-center justify-center rounded-md bg-acadia-gold px-6 py-3 text-base font-bold text-acadia-ink transition hover:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            Pay now
          </button>
          <button
            type="button"
            onClick={() => goToTab("payments")}
            className="inline-flex min-h-12 items-center justify-center rounded-md border border-white/40 px-5 py-3 text-base font-bold text-white transition hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            View ledger and receipts
          </button>
        </div>
      </section>

      <Panel
        eyebrow="Never miss a due date"
        title="Autopay"
        action={<Toggle checked={autopay.on} onChange={(on) => setAutopay({ ...autopay, on })} label="Autopay" />}
      >
        {autopay.on ? (
          <div className="space-y-3 text-sm">
            <label className="block">
              <span className="font-bold text-acadia-ink">Pay from</span>
              <select
                value={autopay.method}
                onChange={(event) => setAutopay({ ...autopay, method: event.target.value as PaymentMethodId })}
                className="mt-1 w-full rounded-md border border-acadia-moss/30 bg-white px-3 py-2.5 text-base text-acadia-ink sm:text-sm"
              >
                {samplePaymentMethods.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.detail}
                  </option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="font-bold text-acadia-ink">When</span>
              <select
                value={autopay.timing}
                onChange={(event) => setAutopay({ ...autopay, timing: event.target.value as AutopayState["timing"] })}
                className="mt-1 w-full rounded-md border border-acadia-moss/30 bg-white px-3 py-2.5 text-base text-acadia-ink sm:text-sm"
              >
                <option value="due">On the due date</option>
                <option value="early">Five days before the due date</option>
              </select>
            </label>
            <label className="block">
              <span className="font-bold text-acadia-ink">Never pay more than</span>
              <span className="relative mt-1 block">
                <span aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">$</span>
                <input
                  inputMode="decimal"
                  value={autopay.cap}
                  onChange={(event) => setAutopay({ ...autopay, cap: event.target.value })}
                  className="w-full rounded-md border border-acadia-moss/30 py-2.5 pl-7 pr-3 text-base text-acadia-ink sm:text-sm"
                />
              </span>
            </label>
            <p className="rounded-md bg-emerald-50 px-3 py-2 leading-6 text-emerald-900">
              Autopay is on. Each assessment is paid from {methodDetail}. A reminder email goes out
              three days before. Anything above your limit waits for your approval.
            </p>
          </div>
        ) : (
          <p className="text-sm leading-6 text-slate-700">
            Turn on autopay and each assessment is paid for you on time. You choose the account, the
            timing, and a spending limit. You can turn it off any time.
          </p>
        )}
      </Panel>

      <Panel eyebrow="Coming up" title="Dates that matter" className="lg:col-span-1">
        <ol className="space-y-4">
          {sampleCalendar.map((item) => (
            <li key={item.label} className="flex gap-3">
              <span className="flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-lg bg-acadia-sky text-acadia-ink">
                <span className="text-[10px] font-bold uppercase leading-none">{item.date.split(" ")[0]}</span>
                <span className="text-lg font-bold leading-tight">{item.date.split(" ")[1]}</span>
              </span>
              <span>
                <span className="block text-sm font-bold text-acadia-ink">{item.label}</span>
                <span className="block text-sm text-slate-600">{item.detail}</span>
              </span>
            </li>
          ))}
        </ol>
      </Panel>

      <Panel eyebrow="Shortcuts" title="What do you need today?" className="lg:col-span-2">
        <div className="grid gap-3 sm:grid-cols-2">
          <ActionTile
            title="Download a statement"
            text="Year-to-date charges and payments in one PDF."
            onClick={() => notify("Preview only. The real portal would download your statement as a PDF.")}
          />
          <ActionTile title="Start a request" text="Paint, fences, repairs, or a question for the board." onClick={() => goToTab("requests")} />
          <ActionTile title="Find a document" text="Bylaws, budgets, minutes, and your receipts." onClick={() => goToTab("documents")} />
          <ActionTile
            title="Ask the HOA documents"
            text="Get an answer with the page it came from. This one works today."
            onClick={() => window.dispatchEvent(new CustomEvent(ACADIA_OPEN_CHAT_EVENT))}
            live
          />
        </div>
      </Panel>

      <Panel
        eyebrow="Your requests"
        title="Open with the board"
        className="lg:col-span-3"
        action={<QuietButton onClick={() => goToTab("requests")}>See all requests</QuietButton>}
      >
        <div className="grid gap-3 md:grid-cols-2">
          {requests.slice(0, 2).map((request) => (
            <div key={request.id} className="rounded-lg border border-acadia-moss/20 bg-acadia-cream px-4 py-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-sm font-bold text-acadia-ink">{request.title}</p>
                <StatusChip status={request.status} />
              </div>
              <p className="mt-1 text-xs text-slate-600">
                {request.kind} · Submitted {request.submitted}
              </p>
            </div>
          ))}
        </div>
      </Panel>
    </div>
  );
}

function ActionTile({
  title,
  text,
  onClick,
  live = false
}: {
  title: string;
  text: string;
  onClick: () => void;
  live?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-lg border border-acadia-moss/25 bg-acadia-cream px-4 py-3 text-left transition hover:border-acadia-leaf hover:bg-acadia-sky focus:outline-none focus-visible:ring-2 focus-visible:ring-acadia-gold"
    >
      <span className="flex items-center gap-2 text-sm font-bold text-acadia-ink">
        {title}
        {live ? <Chip tone="green">Live</Chip> : null}
      </span>
      <span className="mt-1 block text-sm leading-6 text-slate-600">{text}</span>
    </button>
  );
}

function StatusChip({ status }: { status: RequestStatus }) {
  const tone = {
    Submitted: "slate",
    "Board review": "amber",
    Scheduled: "blue",
    Approved: "green",
    Complete: "green"
  } as const;

  return <Chip tone={tone[status]}>{status}</Chip>;
}

// ---------------------------------------------------------------- Payments

export function OwnerPayments({
  balance,
  ledger,
  openPay,
  notify
}: Shared & { ledger: LedgerEntry[]; openPay: () => void }) {
  let running = 0;
  const rows = ledger
    .map((entry) => {
      running += (entry.charge || 0) - (entry.payment || 0);
      return { ...entry, balance: running };
    })
    .reverse();
  const charged = ledger.reduce((total, entry) => total + (entry.charge || 0), 0);
  const paid = ledger.reduce((total, entry) => total + (entry.payment || 0), 0);

  return (
    <div className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-3">
        <Stat label="Charged since March" value={money(charged)} />
        <Stat label="Paid since March" value={money(paid)} />
        <Stat label="Balance today" value={money(Math.max(balance, 0))} highlight={balance > 0} />
      </div>

      <Panel
        eyebrow="Account ledger"
        title="Every charge and payment"
        action={
          <div className="flex flex-wrap gap-2">
            <QuietButton onClick={() => notify("Preview only. The real portal would download your statement as a PDF.")}>
              Download statement
            </QuietButton>
            <PrimaryButton onClick={openPay} disabled={balance <= 0}>
              Pay now
            </PrimaryButton>
          </div>
        }
      >
        <div className="overflow-x-auto">
          <table className="w-full min-w-[560px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-acadia-moss/30 text-xs uppercase tracking-wide text-slate-500">
                <th scope="col" className="py-2 pr-3 font-bold">Date</th>
                <th scope="col" className="py-2 pr-3 font-bold">Description</th>
                <th scope="col" className="py-2 pr-3 text-right font-bold">Charge</th>
                <th scope="col" className="py-2 pr-3 text-right font-bold">Payment</th>
                <th scope="col" className="py-2 text-right font-bold">Balance</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id} className="border-b border-acadia-moss/15">
                  <td className="whitespace-nowrap py-3 pr-3 text-slate-600">{row.date}</td>
                  <td className="py-3 pr-3 text-acadia-ink">
                    {row.description}
                    {row.receipt ? (
                      <button
                        type="button"
                        onClick={() => notify(`Preview only. The real portal would open receipt ${row.receipt}.`)}
                        className="ml-2 text-xs font-bold text-acadia-leaf underline decoration-acadia-moss/50 underline-offset-4 hover:text-acadia-ink"
                      >
                        Receipt
                      </button>
                    ) : null}
                  </td>
                  <td className="py-3 pr-3 text-right text-slate-700">{row.charge ? money(row.charge) : ""}</td>
                  <td className="py-3 pr-3 text-right text-emerald-700">{row.payment ? money(row.payment) : ""}</td>
                  <td className="py-3 text-right font-bold text-acadia-ink">{money(row.balance)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>

      <Panel eyebrow="If money is tight" title="Ask for a payment plan">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <p className="max-w-2xl text-sm leading-6 text-slate-700">
            Owners who fall behind could ask the board for a payment plan here, in private, before
            late fees grow. The board would set the rules for plans when it adopts a collection
            policy.
          </p>
          <QuietButton onClick={() => notify("Preview only. The real portal would send a private request to the board.")}>
            Request a plan
          </QuietButton>
        </div>
      </Panel>
    </div>
  );
}

function Stat({ label, value, highlight = false }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className={`rounded-xl border p-4 ${highlight ? "border-acadia-gold bg-amber-50" : "border-acadia-moss/20 bg-white"}`}>
      <p className="text-xs font-bold uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-1 text-2xl font-bold tracking-tight text-acadia-ink">{value}</p>
    </div>
  );
}

// ---------------------------------------------------------------- Requests

export function OwnerRequests({
  requests,
  addRequest
}: {
  requests: OwnerRequest[];
  addRequest: (kind: string, title: string) => void;
}) {
  const [kind, setKind] = useState(requestKinds[0]);
  const [title, setTitle] = useState("");
  const [details, setDetails] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!title.trim()) return;
    addRequest(kind, title.trim());
    setTitle("");
    setDetails("");
  }

  return (
    <div className="grid gap-5 lg:grid-cols-[1fr_1.3fr]">
      <Panel eyebrow="New request" title="Tell the board what you need">
        <form onSubmit={handleSubmit} className="space-y-4 text-sm">
          <label className="block">
            <span className="font-bold text-acadia-ink">Type</span>
            <select
              value={kind}
              onChange={(event) => setKind(event.target.value)}
              className="mt-1 w-full rounded-md border border-acadia-moss/30 bg-white px-3 py-2.5 text-base text-acadia-ink sm:text-sm"
            >
              {requestKinds.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="font-bold text-acadia-ink">Short title</span>
            <input
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              maxLength={80}
              placeholder="Example: Replace front door"
              className="mt-1 w-full rounded-md border border-acadia-moss/30 px-3 py-2.5 text-base text-acadia-ink placeholder:text-slate-400 sm:text-sm"
            />
          </label>
          <label className="block">
            <span className="font-bold text-acadia-ink">Details</span>
            <textarea
              value={details}
              onChange={(event) => setDetails(event.target.value)}
              rows={4}
              maxLength={600}
              placeholder="Materials, colors, location, and dates"
              className="mt-1 w-full rounded-md border border-acadia-moss/30 px-3 py-2.5 text-base text-acadia-ink placeholder:text-slate-400 sm:text-sm"
            />
          </label>
          <div className="rounded-md border border-dashed border-acadia-moss/40 px-3 py-3 text-slate-600">
            Photos and plans could be attached here. Uploads are turned off in this preview.
          </div>
          <PrimaryButton type="submit" disabled={!title.trim()} className="w-full">
            Submit sample request
          </PrimaryButton>
          <p className="text-xs leading-5 text-slate-500">
            Nothing you type here is sent or saved. It stays in this browser tab.
          </p>
        </form>
      </Panel>

      <Panel eyebrow="Your requests" title="Track every step">
        <ul className="space-y-4">
          {requests.map((request) => (
            <li key={request.id} className="rounded-lg border border-acadia-moss/20 bg-acadia-cream p-4">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <p className="font-bold text-acadia-ink">{request.title}</p>
                  <p className="text-xs text-slate-600">
                    {request.kind} · Submitted {request.submitted}
                  </p>
                </div>
                <StatusChip status={request.status} />
              </div>
              <ol className="mt-4 grid grid-cols-4 gap-1">
                {request.steps.map((step) => (
                  <li key={step.label}>
                    <span
                      className={`block h-1.5 rounded-full ${
                        step.done ? "bg-acadia-leaf" : step.current ? "bg-acadia-gold" : "bg-slate-200"
                      }`}
                    />
                    <span
                      className={`mt-1.5 block text-[11px] font-semibold leading-4 ${
                        step.done || step.current ? "text-acadia-ink" : "text-slate-400"
                      }`}
                    >
                      {step.label}
                    </span>
                  </li>
                ))}
              </ol>
              <p className="mt-3 text-sm leading-6 text-slate-700">{request.note}</p>
            </li>
          ))}
        </ul>
      </Panel>
    </div>
  );
}

// ---------------------------------------------------------------- Documents

type DocumentItem = { label: string; detail: string; href?: string };

const documentGroups: { title: string; live: boolean; items: DocumentItem[] }[] = [
  {
    title: "Governing documents",
    live: true,
    items: [
      { label: "Bylaws, declarations, and amendments", detail: `${acadiaGoverningDocuments.length} recorded documents`, href: "/Acadia#governing-documents" },
      { label: "Project source documents", detail: "Estimates, agendas, and assessments", href: "/Acadia/documents" }
    ]
  },
  {
    title: "My account",
    live: false,
    items: [
      { label: "2026 year-to-date statement", detail: "PDF" },
      { label: "Receipt R-1163", detail: "October 1, 2026" },
      { label: "Autopay authorization", detail: "On file" }
    ]
  },
  {
    title: "Budget and financial reports",
    live: false,
    items: [
      { label: "2026 approved budget", detail: "PDF" },
      { label: "October treasurer report", detail: "Income, spending, and reserves" },
      { label: "October bank reconciliation", detail: "Reviewed by two board members" }
    ]
  },
  {
    title: "Meetings",
    live: false,
    items: [
      { label: "Annual meeting notice and agenda", detail: "Posted Nov 8, 2026" },
      { label: "Approved minutes", detail: "Most recent meeting" }
    ]
  }
];

export function OwnerDocuments({ notify }: { notify: (message: string) => void }) {
  return (
    <div className="grid gap-5 md:grid-cols-2">
      {documentGroups.map((group) => (
        <Panel
          key={group.title}
          title={group.title}
          action={group.live ? <Chip tone="green">Live on this site</Chip> : <SampleTag />}
        >
          <ul className="divide-y divide-acadia-moss/15">
            {group.items.map((item) => (
              <li key={item.label}>
                {item.href ? (
                  <Link href={item.href} className="flex items-center justify-between gap-4 py-3 text-sm hover:text-acadia-leaf">
                    <span>
                      <span className="block font-bold text-acadia-ink">{item.label}</span>
                      <span className="block text-xs text-slate-600">{item.detail}</span>
                    </span>
                    <span className="shrink-0 font-bold text-acadia-leaf">Open</span>
                  </Link>
                ) : (
                  <button
                    type="button"
                    onClick={() => notify(`Preview only. The real portal would open "${item.label}".`)}
                    className="flex w-full items-center justify-between gap-4 py-3 text-left text-sm"
                  >
                    <span>
                      <span className="block font-bold text-acadia-ink">{item.label}</span>
                      <span className="block text-xs text-slate-600">{item.detail}</span>
                    </span>
                    <span className="shrink-0 font-bold text-slate-400">Sample</span>
                  </button>
                )}
              </li>
            ))}
          </ul>
        </Panel>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------- Community

export function OwnerCommunity() {
  return (
    <div className="grid gap-5 lg:grid-cols-3">
      <Panel eyebrow="From the board" title="Announcements" className="lg:col-span-2" action={<SampleTag />}>
        <ul className="space-y-4">
          {sampleAnnouncements.map((item) => (
            <li key={item.title} className="border-l-4 border-acadia-moss pl-4">
              <p className="font-bold text-acadia-ink">{item.title}</p>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{item.date}</p>
              <p className="mt-1 text-sm leading-6 text-slate-700">{item.text}</p>
            </li>
          ))}
        </ul>
      </Panel>

      <Panel eyebrow="Have a say" title="Community priorities" action={<Chip tone="green">Live</Chip>}>
        <p className="text-sm leading-6 text-slate-700">
          Current HOA items are already open for a thumbs up or thumbs down on this site.
        </p>
        <Link
          href="/Acadia"
          className="mt-4 inline-flex min-h-11 items-center justify-center rounded-md border border-acadia-leaf px-4 py-2.5 text-sm font-bold text-acadia-leaf transition hover:bg-acadia-leaf hover:text-white"
        >
          See the current items
        </Link>
      </Panel>

      <Panel eyebrow="Open books" title="Where each dollar goes" className="lg:col-span-3" action={<SampleTag />}>
        <p className="max-w-3xl text-sm leading-6 text-slate-700">
          Owners could see how each dollar of dues is budgeted, updated from the same books the
          board uses. The shares below are made up for this preview.
        </p>
        <div className="mt-4 flex h-5 w-full overflow-hidden rounded-full" role="img" aria-label="Sample budget shares by category">
          {sampleBudgetShares.map((share) => (
            <span key={share.label} className={share.color} style={{ width: `${share.percent}%` }} />
          ))}
        </div>
        <ul className="mt-4 grid gap-x-6 gap-y-2 text-sm sm:grid-cols-2 lg:grid-cols-4">
          {sampleBudgetShares.map((share) => (
            <li key={share.label} className="flex items-center gap-2">
              <span aria-hidden="true" className={`h-3 w-3 shrink-0 rounded-sm ${share.color}`} />
              <span className="text-slate-700">{share.label}</span>
              <span className="ml-auto font-bold text-acadia-ink">{share.percent}%</span>
            </li>
          ))}
        </ul>
      </Panel>
    </div>
  );
}
