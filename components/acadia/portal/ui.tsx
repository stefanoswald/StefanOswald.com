import type React from "react";

const moneyFormat = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });
const wholeMoneyFormat = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0
});

export function money(value: number) {
  return moneyFormat.format(value);
}

export function wholeMoney(value: number) {
  return wholeMoneyFormat.format(value);
}

export function Panel({
  title,
  eyebrow,
  action,
  children,
  className = ""
}: {
  title?: string;
  eyebrow?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={`rounded-xl border border-acadia-moss/20 bg-white p-5 ${className}`}>
      {title || eyebrow || action ? (
        <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
          <div>
            {eyebrow ? (
              <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-acadia-leaf">{eyebrow}</p>
            ) : null}
            {title ? <h3 className="text-lg font-bold text-acadia-ink">{title}</h3> : null}
          </div>
          {action}
        </div>
      ) : null}
      {children}
    </section>
  );
}

const chipTones = {
  green: "bg-emerald-100 text-emerald-800",
  amber: "bg-amber-100 text-amber-900",
  red: "bg-red-100 text-red-800",
  blue: "bg-blue-100 text-blue-800",
  purple: "bg-purple-100 text-purple-800",
  slate: "bg-slate-100 text-slate-700",
  sky: "bg-acadia-sky text-acadia-ink"
};

export function Chip({ tone = "slate", children }: { tone?: keyof typeof chipTones; children: React.ReactNode }) {
  return (
    <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-bold ${chipTones[tone]}`}>
      {children}
    </span>
  );
}

export function SampleTag() {
  return (
    <span className="inline-flex items-center rounded-md border border-dashed border-amber-500 bg-amber-50 px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide text-amber-900">
      Sample data
    </span>
  );
}

export function PrimaryButton({
  children,
  className = "",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      {...props}
      className={`inline-flex min-h-11 items-center justify-center rounded-md bg-acadia-leaf px-4 py-2.5 text-sm font-bold text-white transition hover:bg-acadia-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-acadia-gold focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
    >
      {children}
    </button>
  );
}

export function QuietButton({
  children,
  className = "",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      {...props}
      className={`inline-flex min-h-11 items-center justify-center rounded-md border border-acadia-moss/40 bg-white px-4 py-2.5 text-sm font-bold text-acadia-ink transition hover:border-acadia-leaf hover:bg-acadia-sky focus:outline-none focus-visible:ring-2 focus-visible:ring-acadia-gold focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
    >
      {children}
    </button>
  );
}

/** A labelled on/off switch. */
export function Toggle({
  checked,
  onChange,
  label
}: {
  checked: boolean;
  onChange: (next: boolean) => void;
  label: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={`relative h-7 w-12 shrink-0 rounded-full transition focus:outline-none focus-visible:ring-2 focus-visible:ring-acadia-gold focus-visible:ring-offset-2 ${
        checked ? "bg-acadia-leaf" : "bg-slate-300"
      }`}
    >
      <span
        aria-hidden="true"
        className={`absolute top-0.5 h-6 w-6 rounded-full bg-white shadow transition-all ${checked ? "left-[22px]" : "left-0.5"}`}
      />
    </button>
  );
}

export function ProgressBar({ percent, tone = "bg-acadia-leaf", label }: { percent: number; tone?: string; label: string }) {
  const clamped = Math.max(0, Math.min(100, percent));

  return (
    <div
      className="h-2.5 w-full overflow-hidden rounded-full bg-slate-200"
      role="progressbar"
      aria-valuenow={Math.round(clamped)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label}
    >
      <div className={`h-full rounded-full ${tone}`} style={{ width: `${clamped}%` }} />
    </div>
  );
}
