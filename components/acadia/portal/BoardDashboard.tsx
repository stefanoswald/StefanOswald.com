"use client";

import { useState } from "react";
import {
  sampleBank,
  sampleBills,
  sampleBudgetLines,
  sampleCollections,
  sampleDeadlines,
  sampleDrafts,
  type DraftReview
} from "./sampleData";
import { Chip, Panel, PrimaryButton, ProgressBar, QuietButton, SampleTag, money, wholeMoney } from "./ui";

const draftTone: Record<DraftReview, "sky" | "purple" | "blue"> = {
  Board: "sky",
  Attorney: "purple",
  CPA: "blue"
};

export function BoardDashboard({ notify }: { notify: (message: string) => void }) {
  const [approvals, setApprovals] = useState<Record<string, number>>(
    Object.fromEntries(sampleBills.map((bill) => [bill.id, bill.approvals]))
  );
  const [reminded, setReminded] = useState<string[]>([]);

  const collectedPercent = Math.round((sampleCollections.collected / sampleCollections.billed) * 100);
  const autopayPercent = Math.round((sampleCollections.homesOnAutopay / sampleCollections.homes) * 100);
  const outstanding = sampleCollections.billed - sampleCollections.collected;
  const billsWaiting = sampleBills.filter((bill) => (approvals[bill.id] ?? bill.approvals) < 2).length;

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-3 rounded-xl border border-dashed border-amber-500 bg-amber-50 px-4 py-3 text-sm leading-6 text-amber-900">
        <SampleTag />
        <span>
          Board members would sign in to see this view. Owner names and balances would never appear
          on the public site.
        </span>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Kpi label="Collected this quarter" value={`${collectedPercent}%`} detail={`${wholeMoney(sampleCollections.collected)} of ${wholeMoney(sampleCollections.billed)}`} percent={collectedPercent} />
        <Kpi label="Homes on autopay" value={`${sampleCollections.homesOnAutopay} of ${sampleCollections.homes}`} detail={`${autopayPercent}% of homes`} percent={autopayPercent} />
        <Kpi label="Past due" value={wholeMoney(outstanding)} detail={`${sampleCollections.pastDue.length} homes`} />
        <Kpi label="Waiting on the board" value={`${billsWaiting + sampleDrafts.length}`} detail={`${billsWaiting} bills and ${sampleDrafts.length} drafts`} />
      </div>

      <div className="grid items-start gap-5 lg:grid-cols-2">
        <div className="space-y-5">
          <Panel eyebrow="Collections" title="Past-due accounts">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[420px] border-collapse text-left text-sm">
                <thead>
                  <tr className="border-b border-acadia-moss/30 text-xs uppercase tracking-wide text-slate-500">
                    <th scope="col" className="py-2 pr-3 font-bold">Home</th>
                    <th scope="col" className="py-2 pr-3 font-bold">Age</th>
                    <th scope="col" className="py-2 pr-3 text-right font-bold">Owed</th>
                    <th scope="col" className="py-2 text-right font-bold">Next step</th>
                  </tr>
                </thead>
                <tbody>
                  {sampleCollections.pastDue.map((account) => {
                    const sent = reminded.includes(account.home);
                    return (
                      <tr key={account.home} className="border-b border-acadia-moss/15">
                        <th scope="row" className="py-3 pr-3 font-bold text-acadia-ink">{account.home}</th>
                        <td className="py-3 pr-3">
                          <Chip tone={account.daysLate > 60 ? "red" : account.daysLate > 30 ? "amber" : "slate"}>
                            {account.bucket}
                          </Chip>
                        </td>
                        <td className="py-3 pr-3 text-right font-bold text-acadia-ink">{money(account.amount)}</td>
                        <td className="py-3 text-right">
                          <button
                            type="button"
                            disabled={sent}
                            onClick={() => {
                              setReminded((current) => [...current, account.home]);
                              notify("Preview only. A reminder was drafted for a board member to check before it is sent.");
                            }}
                            className="text-sm font-bold text-acadia-leaf underline decoration-acadia-moss/50 underline-offset-4 hover:text-acadia-ink disabled:text-slate-400 disabled:no-underline"
                          >
                            {sent ? "Reminder drafted" : "Draft reminder"}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <p className="mt-3 text-xs leading-5 text-slate-500">
              Late fees and interest would follow the policy the board adopts, applied the same way to
              every home. Anything headed toward a lien goes to the attorney.
            </p>
          </Panel>

          <Panel eyebrow="AI prepares. People decide." title="Drafts waiting for review">
            <ul className="space-y-3">
              {sampleDrafts.map((draft) => (
                <li key={draft.id} className="rounded-lg border border-acadia-moss/20 bg-acadia-cream px-4 py-3">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <p className="text-sm font-bold text-acadia-ink">{draft.title}</p>
                    <Chip tone={draftTone[draft.review]}>{draft.review} review</Chip>
                  </div>
                  <p className="mt-1 text-sm leading-6 text-slate-700">{draft.basis}</p>
                  <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
                    <p className="text-xs font-semibold text-slate-600">{draft.reviewer}</p>
                    <button
                      type="button"
                      onClick={() => notify("Preview only. The real tool would open the draft next to the pages it relied on.")}
                      className="text-sm font-bold text-acadia-leaf underline decoration-acadia-moss/50 underline-offset-4 hover:text-acadia-ink"
                    >
                      Open draft
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </Panel>
        </div>
        <div className="space-y-5">
          <Panel eyebrow="Bank and books" title="Money in the bank">
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-lg bg-acadia-cream px-4 py-3">
                <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Operating account</p>
                <p className="mt-1 text-2xl font-bold tracking-tight text-acadia-ink">{money(sampleBank.operating)}</p>
              </div>
              <div className="rounded-lg bg-acadia-cream px-4 py-3">
                <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Reserve account</p>
                <p className="mt-1 text-2xl font-bold tracking-tight text-acadia-ink">{money(sampleBank.reserve)}</p>
              </div>
            </div>
            <div className="mt-3 flex flex-wrap items-center justify-between gap-3 text-sm">
              <p className="text-slate-600">
                Bank synced: <strong className="text-acadia-ink">{sampleBank.lastSync}</strong>
              </p>
              <Chip tone="amber">{sampleBank.toReview} transactions to review</Chip>
            </div>
            <h4 className="mt-5 text-sm font-bold text-acadia-ink">Budget so far this year</h4>
            <ul className="mt-3 space-y-3">
              {sampleBudgetLines.map((line) => {
                const percent = (line.actual / line.budget) * 100;
                return (
                  <li key={line.label}>
                    <div className="mb-1 flex items-baseline justify-between gap-3 text-sm">
                      <span className="text-slate-700">{line.label}</span>
                      <span className="text-xs text-slate-600">
                        <strong className="text-acadia-ink">{wholeMoney(line.actual)}</strong> of {wholeMoney(line.budget)}
                      </span>
                    </div>
                    <ProgressBar percent={percent} tone={percent > 95 ? "bg-acadia-gold" : "bg-acadia-leaf"} label={`${line.label} spending against budget`} />
                  </li>
                );
              })}
            </ul>
          </Panel>

          <Panel eyebrow="Two-person control" title="Bills waiting for approval">
            <ul className="space-y-3">
              {sampleBills.map((bill) => {
                const count = approvals[bill.id] ?? bill.approvals;
                const ready = count >= 2;
                return (
                  <li key={bill.id} className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-acadia-moss/20 bg-acadia-cream px-4 py-3">
                    <div>
                      <p className="text-sm font-bold text-acadia-ink">
                        {bill.vendor} · {money(bill.amount)}
                      </p>
                      <p className="text-xs text-slate-600">{bill.memo}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Chip tone={ready ? "green" : "amber"}>{ready ? "Ready to pay" : `${count} of 2 approvals`}</Chip>
                      {!ready ? (
                        <QuietButton
                          onClick={() => setApprovals((current) => ({ ...current, [bill.id]: Math.min(count + 1, 2) }))}
                          className="!min-h-9 !px-3 !py-1.5"
                        >
                          Approve
                        </QuietButton>
                      ) : null}
                    </div>
                  </li>
                );
              })}
            </ul>
            <p className="mt-3 text-xs leading-5 text-slate-500">
              No single person can release a payment. A second board member has to approve each bill.
            </p>
          </Panel>
        </div>
      </div>

      <Panel eyebrow="Nothing slips" title="Deadlines on the board calendar">
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {sampleDeadlines.map((deadline) => (
            <li key={deadline.label} className="rounded-lg border border-acadia-moss/20 bg-acadia-cream px-4 py-3">
              <p className="text-sm font-bold text-acadia-ink">{deadline.label}</p>
              <p className="mt-1 text-sm text-slate-700">{deadline.when}</p>
              <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-slate-500">{deadline.owner}</p>
            </li>
          ))}
        </ul>
        <div className="mt-4">
          <PrimaryButton onClick={() => notify("Preview only. The real tool would build the monthly board packet from the books and open items.")}>
            Build the monthly board packet
          </PrimaryButton>
        </div>
      </Panel>
    </div>
  );
}

function Kpi({ label, value, detail, percent }: { label: string; value: string; detail: string; percent?: number }) {
  return (
    <div className="rounded-xl border border-acadia-moss/20 bg-white p-4">
      <p className="text-xs font-bold uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-1 text-3xl font-bold tracking-tight text-acadia-ink">{value}</p>
      <p className="mt-1 text-sm text-slate-600">{detail}</p>
      {typeof percent === "number" ? (
        <div className="mt-3">
          <ProgressBar percent={percent} label={label} />
        </div>
      ) : null}
    </div>
  );
}
