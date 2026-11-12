"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { BoardDashboard } from "./BoardDashboard";
import {
  OwnerCommunity,
  OwnerDocuments,
  OwnerOverview,
  OwnerPayments,
  OwnerRequests,
  type AutopayState,
  type OwnerTab
} from "./OwnerTabs";
import { PayDialog } from "./PayDialog";
import {
  sampleLedger,
  sampleOwner,
  sampleRequests,
  type LedgerEntry,
  type OwnerRequest,
  type PaymentMethodId
} from "./sampleData";
import { SampleTag } from "./ui";

type View = "owner" | "board";

const ownerTabs: { id: OwnerTab; label: string }[] = [
  { id: "overview", label: "Overview" },
  { id: "payments", label: "Payments" },
  { id: "requests", label: "Requests" },
  { id: "documents", label: "Documents" },
  { id: "community", label: "Community" }
];

const startingAutopay: AutopayState = { on: false, method: "bank", timing: "due", cap: "500" };

/**
 * The interactive owner portal preview. Everything lives in this browser tab's memory:
 * nothing is sent to a server, nothing is saved, and no payment can be made.
 */
export function PortalMockup() {
  const [view, setView] = useState<View>("owner");
  const [tab, setTab] = useState<OwnerTab>("overview");
  const [ledger, setLedger] = useState<LedgerEntry[]>(sampleLedger);
  const [autopay, setAutopay] = useState<AutopayState>(startingAutopay);
  const [requests, setRequests] = useState<OwnerRequest[]>(sampleRequests);
  const [payOpen, setPayOpen] = useState(false);
  const [toast, setToast] = useState("");
  const toastTimer = useRef<number | null>(null);
  const frameRef = useRef<HTMLDivElement>(null);

  const balance = ledger.reduce((total, entry) => total + (entry.charge || 0) - (entry.payment || 0), 0);

  const notify = useCallback((message: string) => {
    setToast(message);
    if (toastTimer.current) window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToast(""), 6000);
  }, []);

  useEffect(() => {
    return () => {
      if (toastTimer.current) window.clearTimeout(toastTimer.current);
    };
  }, []);

  const closePay = useCallback(() => setPayOpen(false), []);

  function goToTab(next: OwnerTab) {
    setView("owner");
    setTab(next);
    frameRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function recordPayment(amount: number, method: PaymentMethodId, confirmation: string) {
    setLedger((current) => [
      ...current,
      {
        id: `p-${confirmation}`,
        date: "Today",
        description: method === "bank" ? "Sample payment by bank transfer" : "Sample payment by card",
        payment: amount,
        receipt: confirmation
      }
    ]);
  }

  function addRequest(kind: string, title: string) {
    setRequests((current) => [
      {
        id: `req-${current.length + 1}-${title.length}`,
        kind,
        title,
        submitted: "Today",
        status: "Submitted",
        steps: [
          { label: "Submitted", done: false, current: true },
          { label: "Application complete", done: false },
          { label: "Board review", done: false },
          { label: "Decision", done: false }
        ],
        note: "Sample request. In the real portal the board would be notified and you would get an email at each step."
      },
      ...current
    ]);
    notify("Sample request added to your list. Nothing was sent.");
  }

  function reset() {
    setLedger(sampleLedger);
    setAutopay(startingAutopay);
    setRequests(sampleRequests);
    setTab("overview");
    setView("owner");
    notify("The preview is back to its starting point.");
  }

  return (
    <div ref={frameRef} className="scroll-mt-24 overflow-hidden rounded-2xl border border-acadia-moss/30 bg-acadia-cream shadow-soft">
      {/* Portal top bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-acadia-moss/20 bg-white px-4 py-3 sm:px-5">
        <div className="flex items-center gap-3">
          <p className="text-base font-bold text-acadia-ink">Owner portal</p>
          <SampleTag />
        </div>

        <div className="flex rounded-lg bg-acadia-sky p-1" role="group" aria-label="Choose a view">
          {(["owner", "board"] as View[]).map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setView(option)}
              aria-pressed={view === option}
              className={`rounded-md px-3 py-1.5 text-sm font-bold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-acadia-gold ${
                view === option ? "bg-white text-acadia-ink shadow" : "text-slate-600 hover:text-acadia-ink"
              }`}
            >
              {option === "owner" ? "Homeowner view" : "Board view"}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 text-sm">
          <span aria-hidden="true" className="flex h-8 w-8 items-center justify-center rounded-full bg-acadia-leaf text-xs font-bold text-white">
            SH
          </span>
          <span className="leading-tight">
            <span className="block font-bold text-acadia-ink">{view === "owner" ? sampleOwner.name : "Sample Board Member"}</span>
            <span className="block text-xs text-slate-600">{view === "owner" ? sampleOwner.home : "Treasurer"}</span>
          </span>
        </div>
      </div>

      {view === "owner" ? (
        <>
          <div className="overflow-x-auto border-b border-acadia-moss/20 bg-white px-2 sm:px-3" role="tablist" aria-label="Owner portal sections">
            <div className="flex min-w-max gap-1">
              {ownerTabs.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  role="tab"
                  id={`portal-tab-${item.id}`}
                  aria-selected={tab === item.id}
                  aria-controls="portal-panel"
                  onClick={() => setTab(item.id)}
                  className={`border-b-2 px-3 py-3 text-sm font-bold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-acadia-gold ${
                    tab === item.id
                      ? "border-acadia-leaf text-acadia-ink"
                      : "border-transparent text-slate-600 hover:text-acadia-ink"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          <div id="portal-panel" role="tabpanel" aria-labelledby={`portal-tab-${tab}`} className="p-4 sm:p-5">
            {tab === "overview" ? (
              <OwnerOverview
                balance={balance}
                autopay={autopay}
                setAutopay={setAutopay}
                requests={requests}
                openPay={() => setPayOpen(true)}
                goToTab={goToTab}
                notify={notify}
              />
            ) : null}
            {tab === "payments" ? (
              <OwnerPayments balance={balance} ledger={ledger} openPay={() => setPayOpen(true)} goToTab={goToTab} notify={notify} />
            ) : null}
            {tab === "requests" ? <OwnerRequests requests={requests} addRequest={addRequest} /> : null}
            {tab === "documents" ? <OwnerDocuments notify={notify} /> : null}
            {tab === "community" ? <OwnerCommunity /> : null}
          </div>
        </>
      ) : (
        <div className="p-4 sm:p-5">
          <BoardDashboard notify={notify} />
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-acadia-moss/20 bg-white px-4 py-3 text-xs text-slate-600 sm:px-5">
        <p>Preview only. All names, balances, and figures are made up. Nothing is saved or sent.</p>
        <button
          type="button"
          onClick={reset}
          className="font-bold text-acadia-leaf underline decoration-acadia-moss/50 underline-offset-4 hover:text-acadia-ink"
        >
          Reset the preview
        </button>
      </div>

      {payOpen ? (
        <PayDialog
          balance={balance}
          onClose={closePay}
          onPaid={recordPayment}
          onViewLedger={() => {
            setPayOpen(false);
            goToTab("payments");
          }}
        />
      ) : null}

      <div aria-live="polite" role="status" className="pointer-events-none fixed inset-x-4 bottom-20 z-[55] flex justify-center sm:bottom-6 sm:left-6 sm:right-auto">
        {toast ? (
          <p className="pointer-events-auto max-w-md rounded-lg bg-acadia-ink px-4 py-3 text-sm font-medium leading-6 text-white shadow-2xl">
            {toast}
          </p>
        ) : null}
      </div>
    </div>
  );
}
