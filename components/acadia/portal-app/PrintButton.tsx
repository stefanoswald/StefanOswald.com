"use client";

export function PrintButton({ label = "Print or save as PDF" }: { label?: string }) {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="inline-flex min-h-11 items-center justify-center rounded-md border border-acadia-moss/40 bg-white px-4 py-2.5 text-sm font-bold text-acadia-ink transition hover:border-acadia-leaf hover:bg-acadia-sky focus:outline-none focus-visible:ring-2 focus-visible:ring-acadia-gold focus-visible:ring-offset-2 print:hidden"
    >
      {label}
    </button>
  );
}
