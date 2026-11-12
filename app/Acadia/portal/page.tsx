import Link from "next/link";
import { PortalMockup } from "@/components/acadia/portal/PortalMockup";
import { PAYHOA_FEATURES_URL, PAYHOA_REVIEWED } from "@/data/acadiaSavingsPlan";

export const metadata = {
  title: "Owner Portal Preview | Acadia Estates HOA",
  description:
    "A preview of the online owner portal Acadia Estates could offer: pay dues, set up autopay, track requests, and see where the money goes. Sample data only.",
  robots: { index: false }
};

type FeatureSource = "PayHOA" | "Live" | "Extra";

const featureRows: { feature: string; source: FeatureSource }[] = [
  { feature: "Pay online by bank transfer or card", source: "PayHOA" },
  { feature: "Autopay with a spending limit", source: "PayHOA" },
  { feature: "Automatic late fees on the board's schedule", source: "PayHOA" },
  { feature: "Ledger, receipts, and statements for each home", source: "PayHOA" },
  { feature: "Request forms with approval steps", source: "PayHOA" },
  { feature: "Document storage, calendar, and announcements", source: "PayHOA" },
  { feature: "Bank sync, reconciliation, and budget reports", source: "PayHOA" },
  { feature: "Vendor bills with approval steps", source: "PayHOA" },
  { feature: "Document helper that answers with page links", source: "Live" },
  { feature: "Project tracker with homeowner feedback", source: "Live" },
  { feature: "Source documents with a redaction log", source: "Live" },
  { feature: "Where each dollar goes, shown to every owner", source: "Extra" },
  { feature: "Private payment plan requests", source: "Extra" },
  { feature: "AI drafts routed to attorney or CPA review", source: "Extra" }
];

const sourceStyles: Record<FeatureSource, { label: string; className: string }> = {
  PayHOA: { label: "Included with PayHOA", className: "bg-blue-100 text-blue-800" },
  Live: { label: "Live on this site today", className: "bg-emerald-100 text-emerald-800" },
  Extra: { label: "Acadia extra to build", className: "bg-amber-100 text-amber-900" }
};

export default function AcadiaPortalPreviewPage() {
  return (
    <main className="min-h-screen bg-acadia-cream">
      <div className="border-b border-amber-300 bg-amber-100 text-amber-950">
        <p className="mx-auto max-w-6xl px-4 py-3 text-sm font-semibold leading-6 sm:px-6 lg:px-8">
          This is a preview. Every name, balance, and budget figure on this page is made up. No
          payment can be made here. The board has not approved a payment system.
        </p>
      </div>

      <section className="bg-acadia-sky">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-acadia-leaf">Owner portal preview</p>
          <h1 className="mt-3 max-w-3xl text-4xl font-bold tracking-tight text-acadia-ink sm:text-5xl">
            Pay dues, track requests, and see the books in one place
          </h1>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-700">
            This is a working model of the owner portal Acadia Estates could offer if the board
            moves to HOA software. Click around. Try a sample payment, turn on autopay, send a
            sample request, or switch to the board view.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/Acadia/savings"
              className="inline-flex min-h-12 items-center justify-center rounded-md bg-acadia-leaf px-5 py-3 font-bold text-white shadow-soft transition hover:bg-acadia-ink"
            >
              Read the savings plan
            </Link>
            <Link
              href="/Acadia/projects/self-management-software"
              className="inline-flex min-h-12 items-center justify-center rounded-md border border-acadia-leaf bg-white px-5 py-3 font-bold text-acadia-leaf transition hover:bg-acadia-leaf hover:text-white"
            >
              Vote on the proposal
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8" aria-label="Interactive owner portal preview">
        <PortalMockup />
      </section>

      <section className="border-y border-acadia-moss/20 bg-white" aria-labelledby="real-title">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-acadia-leaf">Behind the preview</p>
          <h2 id="real-title" className="mt-2 text-2xl font-bold text-acadia-ink">
            How this would really work
          </h2>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <div className="rounded-lg border border-acadia-moss/20 bg-acadia-cream p-5">
              <h3 className="font-bold text-acadia-ink">The software runs the secure part</h3>
              <p className="mt-2 text-sm leading-6 text-slate-700">
                Payments, bank details, and owner balances would live inside PayHOA, which processes
                payments through Stripe. This site would never see or store a card or bank number.
              </p>
            </div>
            <div className="rounded-lg border border-acadia-moss/20 bg-acadia-cream p-5">
              <h3 className="font-bold text-acadia-ink">This site stays the front door</h3>
              <p className="mt-2 text-sm leading-6 text-slate-700">
                One Pay dues button here would take owners to their private portal. Project updates,
                source documents, votes, and the document helper would stay on this site.
              </p>
            </div>
            <div className="rounded-lg border border-acadia-moss/20 bg-acadia-cream p-5">
              <h3 className="font-bold text-acadia-ink">The real screens will look different</h3>
              <p className="mt-2 text-sm leading-6 text-slate-700">
                The real portal would use PayHOA&apos;s own screens, so it would not match this
                preview exactly. The table below shows what PayHOA lists as included, what is
                already live here, and what the board would have to build.
              </p>
            </div>
          </div>

          <h3 className="mt-8 text-sm font-bold uppercase tracking-wide text-slate-500">
            Where each feature in the preview would come from
          </h3>
          <ul className="mt-2 divide-y divide-acadia-moss/15 border-y border-acadia-moss/30 text-sm">
            {featureRows.map((row) => (
              <li key={row.feature} className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1.5 py-3">
                <span className="font-semibold text-acadia-ink">{row.feature}</span>
                <span className={`inline-flex rounded-md px-2.5 py-1 text-xs font-bold ${sourceStyles[row.source].className}`}>
                  {sourceStyles[row.source].label}
                </span>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-xs leading-5 text-slate-500">
            PayHOA features read from{" "}
            <a href={PAYHOA_FEATURES_URL} target="_blank" rel="noreferrer" className="font-bold text-acadia-leaf underline underline-offset-4">
              PayHOA&apos;s feature list
            </a>{" "}
            and pricing page on {PAYHOA_REVIEWED}. This page is not affiliated with or endorsed by PayHOA.
          </p>
        </div>
      </section>

      <section className="bg-acadia-ink text-white">
        <div className="mx-auto grid max-w-6xl gap-6 px-4 py-8 sm:px-6 md:grid-cols-[1fr_auto] md:items-center lg:px-8">
          <div>
            <h2 className="text-2xl font-bold">Would you use this?</h2>
            <p className="mt-2 max-w-3xl leading-7 text-white/75">
              Homeowner feedback helps the board understand priorities before anything is
              decided. Give the proposal a thumbs up or thumbs down, and read what it would cost.
            </p>
          </div>
          <Link
            href="/Acadia/projects/self-management-software"
            className="inline-flex min-h-12 items-center justify-center rounded-md bg-white px-5 py-3 font-bold text-acadia-ink transition hover:bg-acadia-sky"
          >
            Share your vote
          </Link>
        </div>
      </section>
    </main>
  );
}
