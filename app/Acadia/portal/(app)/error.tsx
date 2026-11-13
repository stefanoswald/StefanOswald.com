"use client";

import Link from "next/link";

export default function PortalError({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="mx-auto max-w-xl rounded-xl border border-amber-300 bg-amber-50 p-6">
      <h1 className="text-xl font-bold text-amber-950">The portal could not load this page</h1>
      <p className="mt-2 text-sm leading-6 text-amber-950">
        The records server may be offline for a moment. Your records are safe. Nothing was changed.
      </p>
      <div className="mt-4 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={reset}
          className="inline-flex min-h-11 items-center rounded-md bg-acadia-leaf px-4 py-2.5 text-sm font-bold text-white hover:bg-acadia-ink"
        >
          Try again
        </button>
        <Link href="/Acadia" className="inline-flex min-h-11 items-center rounded-md border border-acadia-moss/40 bg-white px-4 py-2.5 text-sm font-bold text-acadia-ink">
          Back to the Acadia site
        </Link>
      </div>
    </div>
  );
}
