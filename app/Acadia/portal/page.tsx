import Link from "next/link";
import { PortalMockup } from "@/components/acadia/portal/PortalMockup";
import {
  PAYHOA_FEATURES_URL,
  PAYHOA_REVIEWED,
  PROCESSOR_PRICING_URL,
  PROCESSOR_REVIEWED,
  portalComparison,
  type ComparisonStatus
} from "@/data/acadiaSavingsPlan";

export const metadata = {
  title: "Owner Portal Preview | Acadia Estates HOA",
  description:
    "A preview of the owner portal being designed for Acadia Estates, on Acadia's own site: pay dues, set up autopay, track requests, and see where the money goes. Sample data only.",
  robots: { index: false }
};

const statusStyles: Record<ComparisonStatus, string> = {
  live: "bg-emerald-100 text-emerald-800",
  planned: "bg-amber-100 text-amber-900",
  later: "bg-slate-100 text-slate-700",
  no: "bg-slate-100 text-slate-700",
  yes: "bg-blue-100 text-blue-800",
  partial: "bg-slate-100 text-slate-700",
  unlisted: "bg-slate-100 text-slate-500"
};

function StatusPill({ status, label }: { status: ComparisonStatus; label: string }) {
  return (
    <span className={`inline-flex rounded-md px-2.5 py-1 text-xs font-bold ${statusStyles[status]}`}>{label}</span>
  );
}

export default function AcadiaPortalPreviewPage() {
  return (
    <main className="min-h-screen bg-acadia-cream">
      <div className="border-b border-amber-300 bg-amber-100 text-amber-950">
        <p className="mx-auto max-w-6xl px-4 py-3 text-sm font-semibold leading-6 sm:px-6 lg:px-8">
          This is a preview. Every name, balance, and budget figure in the portal below is made up.
          No payment can be made here. The board has not approved a payment system.
        </p>
      </div>

      <section className="bg-acadia-sky">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-acadia-leaf">Owner portal preview</p>
          <h1 className="mt-3 max-w-3xl text-4xl font-bold tracking-tight text-acadia-ink sm:text-5xl">
            Pay dues, track requests, and see the books in one place
          </h1>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-700">
            This is a working model of an owner portal designed for Acadia Estates and built into
            Acadia&apos;s own site. The aim is to do more than off-the-shelf HOA software does. Click
            around. Try a sample payment, turn on autopay, send a sample request, or switch to the
            board view.
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
            How the real portal would work
          </h2>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <div className="rounded-lg border border-acadia-moss/20 bg-acadia-cream p-5">
              <h3 className="font-bold text-acadia-ink">It lives on Acadia&apos;s own site</h3>
              <p className="mt-2 text-sm leading-6 text-slate-700">
                Owners would sign in here with a private link sent to their email. Balances,
                receipts, requests, and documents would sit in the association&apos;s own records, not
                in a rented product.
              </p>
            </div>
            <div className="rounded-lg border border-acadia-moss/20 bg-acadia-cream p-5">
              <h3 className="font-bold text-acadia-ink">A payment processor moves the money</h3>
              <p className="mt-2 text-sm leading-6 text-slate-700">
                Card and bank details would go straight to a licensed payment processor such as
                Stripe. This site would never see or store them. Payments would land in the
                association&apos;s bank account.
              </p>
            </div>
            <div className="rounded-lg border border-acadia-moss/20 bg-acadia-cream p-5">
              <h3 className="font-bold text-acadia-ink">It would be built in steps</h3>
              <p className="mt-2 text-sm leading-6 text-slate-700">
                This preview comes first. Owner sign-in and the ledger would follow, then online
                payments and autopay. The board would test each step before owners use it.
              </p>
            </div>
          </div>

          <h3 id="compare" className="mt-10 scroll-mt-24 text-xl font-bold text-acadia-ink">
            How it compares with off-the-shelf software
          </h3>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-700">
            PayHOA is a well-known product for self-managed associations, so it is the yardstick
            here. The list is meant to be fair. It includes the places where PayHOA is ahead.
          </p>

          <div className="mt-4 hidden grid-cols-[1.5fr_1fr_1fr] gap-4 border-b border-acadia-moss/30 pb-2 text-xs font-bold uppercase tracking-wide text-slate-500 md:grid">
            <span>Feature</span>
            <span>Acadia&apos;s own portal</span>
            <span>PayHOA</span>
          </div>
          <ul className="divide-y divide-acadia-moss/15 border-b border-acadia-moss/30 text-sm">
            {portalComparison.map((row) => (
              <li key={row.feature} className="grid gap-2 py-3 md:grid-cols-[1.5fr_1fr_1fr] md:items-center md:gap-4">
                <span className="font-semibold text-acadia-ink">{row.feature}</span>
                <span className="flex items-center gap-2">
                  <span className="w-16 shrink-0 text-xs font-bold uppercase tracking-wide text-slate-500 md:hidden">Acadia</span>
                  <StatusPill status={row.acadia.status} label={row.acadia.label} />
                </span>
                <span className="flex items-center gap-2">
                  <span className="w-16 shrink-0 text-xs font-bold uppercase tracking-wide text-slate-500 md:hidden">PayHOA</span>
                  <StatusPill status={row.payhoa.status} label={row.payhoa.label} />
                </span>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-xs leading-5 text-slate-500">
            PayHOA details read from{" "}
            <a href={PAYHOA_FEATURES_URL} target="_blank" rel="noreferrer" className="font-bold text-acadia-leaf underline underline-offset-4">
              PayHOA&apos;s feature list
            </a>{" "}
            and pricing page on {PAYHOA_REVIEWED}. &quot;Not listed&quot; means the feature was not found
            on those pages. Processor fees are{" "}
            <a href={PROCESSOR_PRICING_URL} target="_blank" rel="noreferrer" className="font-bold text-acadia-leaf underline underline-offset-4">
              Stripe&apos;s published US rates
            </a>{" "}
            as of {PROCESSOR_REVIEWED}. This page is not affiliated with or endorsed by PayHOA or Stripe.
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
