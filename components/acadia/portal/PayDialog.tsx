"use client";

import { useEffect, useRef, useState } from "react";
import { processorBankFee, processorCardFee, processorFees } from "@/data/acadiaSavingsPlan";
import { samplePaymentMethods, type PaymentMethodId } from "./sampleData";
import { PrimaryButton, QuietButton, money } from "./ui";

type Step = "choose" | "review" | "done";

/** The payment processor's published fee for one payment. */
export function paymentFee(amount: number, method: PaymentMethodId) {
  return method === "bank" ? processorBankFee(amount) : processorCardFee(amount);
}

export function PayDialog({
  balance,
  onClose,
  onPaid,
  onViewLedger
}: {
  balance: number;
  onClose: () => void;
  onPaid: (amount: number, method: PaymentMethodId, confirmation: string) => void;
  onViewLedger: () => void;
}) {
  const [step, setStep] = useState<Step>("choose");
  const [payFull, setPayFull] = useState(true);
  const [otherAmount, setOtherAmount] = useState("");
  const [method, setMethod] = useState<PaymentMethodId>("bank");
  const [confirmation, setConfirmation] = useState("");
  const [paidAmount, setPaidAmount] = useState(0);
  const dialogRef = useRef<HTMLDivElement>(null);

  const typedAmount = Number(otherAmount.replace(/[^0-9.]/g, "")) || 0;
  const amount = payFull ? balance : Math.min(Math.max(typedAmount, 0), balance);
  const fee = paymentFee(amount, method);
  const methodDetail = samplePaymentMethods.find((item) => item.id === method)?.detail || "";

  useEffect(() => {
    dialogRef.current?.focus();

    function handleKey(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  function submit() {
    const code = `DEMO-${Math.floor(100000 + Math.random() * 900000)}`;
    setConfirmation(code);
    setPaidAmount(amount);
    setStep("done");
    onPaid(amount, method, code);
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center bg-acadia-ink/60 p-0 sm:items-center sm:p-4" onClick={onClose}>
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="pay-dialog-title"
        tabIndex={-1}
        onClick={(event) => event.stopPropagation()}
        className="max-h-[92dvh] w-full overflow-y-auto rounded-t-2xl bg-white shadow-2xl outline-none sm:max-w-lg sm:rounded-2xl"
      >
        <div className="flex items-start justify-between gap-4 border-b border-acadia-moss/20 px-5 py-4">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-amber-700">Preview. No money moves.</p>
            <h2 id="pay-dialog-title" className="text-xl font-bold text-acadia-ink">
              {step === "done" ? "Sample payment recorded" : "Make a payment"}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md text-slate-500 hover:bg-slate-100 hover:text-acadia-ink"
          >
            <svg aria-hidden="true" viewBox="0 0 20 20" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M5 5l10 10M15 5L5 15" />
            </svg>
          </button>
        </div>

        {step === "choose" ? (
          <div className="space-y-5 px-5 py-5">
            <fieldset>
              <legend className="text-sm font-bold text-acadia-ink">Amount</legend>
              <div className="mt-2 space-y-2">
                <label className={`flex cursor-pointer items-center justify-between gap-3 rounded-lg border px-4 py-3 ${payFull ? "border-acadia-leaf bg-acadia-sky" : "border-acadia-moss/30"}`}>
                  <span className="flex items-center gap-3">
                    <input type="radio" name="pay-amount" checked={payFull} onChange={() => setPayFull(true)} className="h-4 w-4 accent-acadia-leaf" />
                    <span className="text-sm font-bold text-acadia-ink">Full balance</span>
                  </span>
                  <span className="font-bold text-acadia-ink">{money(balance)}</span>
                </label>
                <label className={`flex cursor-pointer items-center justify-between gap-3 rounded-lg border px-4 py-3 ${!payFull ? "border-acadia-leaf bg-acadia-sky" : "border-acadia-moss/30"}`}>
                  <span className="flex items-center gap-3">
                    <input type="radio" name="pay-amount" checked={!payFull} onChange={() => setPayFull(false)} className="h-4 w-4 accent-acadia-leaf" />
                    <span className="text-sm font-bold text-acadia-ink">Other amount</span>
                  </span>
                  <span className="relative">
                    <span aria-hidden="true" className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500">$</span>
                    <input
                      aria-label="Other amount in dollars"
                      inputMode="decimal"
                      value={otherAmount}
                      onFocus={() => setPayFull(false)}
                      onChange={(event) => setOtherAmount(event.target.value)}
                      placeholder="0.00"
                      className="w-28 rounded-md border border-acadia-moss/30 py-2 pl-6 pr-2 text-right text-base text-acadia-ink outline-none focus:border-acadia-leaf focus:ring-2 focus:ring-acadia-leaf/20"
                    />
                  </span>
                </label>
              </div>
            </fieldset>

            <fieldset>
              <legend className="text-sm font-bold text-acadia-ink">Pay with</legend>
              <div className="mt-2 space-y-2">
                {samplePaymentMethods.map((item) => (
                  <label
                    key={item.id}
                    className={`flex cursor-pointer items-center justify-between gap-3 rounded-lg border px-4 py-3 ${method === item.id ? "border-acadia-leaf bg-acadia-sky" : "border-acadia-moss/30"}`}
                  >
                    <span className="flex items-center gap-3">
                      <input type="radio" name="pay-method" checked={method === item.id} onChange={() => setMethod(item.id)} className="h-4 w-4 accent-acadia-leaf" />
                      <span>
                        <span className="block text-sm font-bold text-acadia-ink">{item.label}</span>
                        <span className="block text-xs text-slate-600">{item.detail}</span>
                      </span>
                    </span>
                    <span className="text-right text-xs font-semibold text-slate-600">
                      {item.id === "bank"
                        ? `${processorFees.bankPercent}% fee, ${money(processorFees.bankCap)} at most`
                        : `${processorFees.cardPercent}% + ${money(processorFees.cardFixed)} fee`}
                    </span>
                  </label>
                ))}
                <div className="rounded-lg border border-dashed border-acadia-moss/40 px-4 py-3 text-sm leading-6 text-slate-600">
                  <strong className="text-acadia-ink">Prefer a check?</strong> Checks would still be
                  accepted by mail with no fee. Adding a new bank account or card is turned off in
                  this preview.
                </div>
              </div>
            </fieldset>

            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <QuietButton onClick={onClose}>Cancel</QuietButton>
              <PrimaryButton onClick={() => setStep("review")} disabled={amount <= 0}>
                Review payment
              </PrimaryButton>
            </div>
          </div>
        ) : null}

        {step === "review" ? (
          <div className="space-y-5 px-5 py-5">
            <dl className="space-y-3 rounded-lg bg-acadia-cream px-4 py-4 text-sm">
              <div className="flex justify-between gap-4">
                <dt className="text-slate-600">Payment to Acadia Estates HOA</dt>
                <dd className="font-bold text-acadia-ink">{money(amount)}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-slate-600">Online payment fee</dt>
                <dd className="font-bold text-acadia-ink">{money(fee)}</dd>
              </div>
              <div className="flex justify-between gap-4 border-t border-acadia-moss/25 pt-3 text-base">
                <dt className="font-bold text-acadia-ink">Total from {methodDetail}</dt>
                <dd className="font-bold text-acadia-ink">{money(amount + fee)}</dd>
              </div>
            </dl>
            <p className="text-xs leading-5 text-slate-500">
              The fee shown is the payment processor&apos;s published rate. The board would decide
              whether the association absorbs it or the payer covers it. This preview shows the
              payer covering it.
            </p>
            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <QuietButton onClick={() => setStep("choose")}>Back</QuietButton>
              <PrimaryButton onClick={submit}>Submit sample payment</PrimaryButton>
            </div>
          </div>
        ) : null}

        {step === "done" ? (
          <div className="space-y-5 px-5 py-6 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
              <svg aria-hidden="true" viewBox="0 0 24 24" className="h-8 w-8" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12.5l4.5 4.5L19 7.5" />
              </svg>
            </div>
            <div>
              <p className="text-3xl font-bold tracking-tight text-acadia-ink">{money(paidAmount)}</p>
              <p className="mt-1 text-sm text-slate-600">Confirmation {confirmation}</p>
            </div>
            <p className="mx-auto max-w-sm text-sm leading-6 text-slate-700">
              In the real portal, a receipt would arrive by email and the ledger would update right
              away. Here, nothing was charged and nothing was saved.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
              <QuietButton onClick={onViewLedger}>View the ledger</QuietButton>
              <PrimaryButton onClick={onClose}>Done</PrimaryButton>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
