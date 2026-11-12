import Link from "next/link";
import { notFound } from "next/navigation";
import { PrintButton } from "@/components/acadia/portal-app/PrintButton";
import { requireViewer } from "@/lib/acadia-portal/auth";
import { getLedgerEntry } from "@/lib/acadia-portal/data";
import { formatCents, formatDate, formatDateTime, receiptNumber } from "@/lib/acadia-portal/format";

export default async function ReceiptPage({ params }: { params: Promise<{ id: string }> }) {
  const viewer = await requireViewer();
  const { id } = await params;
  const entryId = Number(id);
  if (!Number.isInteger(entryId) || entryId <= 0) notFound();

  const entry = await getLedgerEntry(entryId);
  // An owner can only open receipts for their own home. A board member can open any receipt.
  if (!entry || entry.kind !== "payment" || (!viewer.isBoard && entry.home_id !== viewer.homeId)) notFound();

  const backHref = viewer.isBoard && entry.home_id !== viewer.homeId ? `/Acadia/portal/board/homes/${entry.home_id}` : "/Acadia/portal/home/ledger";

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3 print:hidden">
        <Link href={backHref} className="text-sm font-bold text-acadia-leaf underline">
          Back to the ledger
        </Link>
        <PrintButton />
      </div>

      <article className="rounded-xl border border-acadia-moss/30 bg-white p-8">
        <header className="flex flex-wrap items-start justify-between gap-4 border-b border-acadia-moss/20 pb-5">
          <div>
            <p className="text-xl font-bold text-acadia-ink">Acadia Estates Homeowners Association</p>
            <p className="text-sm text-slate-600">Payment receipt</p>
          </div>
          <p className="text-right text-sm text-slate-700">
            <span className="block text-lg font-bold text-acadia-ink">{receiptNumber(entry.id)}</span>
            {formatDate(entry.effective_date)}
          </p>
        </header>

        {entry.reversed_by !== null ? (
          <p className="mt-5 rounded-lg border border-amber-300 bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-950">
            This payment was later reversed. See the ledger for the reversal line.
          </p>
        ) : null}

        <dl className="mt-6 grid gap-x-8 gap-y-4 text-sm sm:grid-cols-2">
          <div>
            <dt className="font-bold text-slate-600">Received from</dt>
            <dd className="mt-1 text-acadia-ink">
              Home {entry.house_number}
              {entry.street ? `, ${entry.street}` : ""}
            </dd>
          </div>
          <div>
            <dt className="font-bold text-slate-600">Amount received</dt>
            <dd className="mt-1 text-2xl font-bold tabular-nums text-acadia-ink">{formatCents(-entry.amount_cents)}</dd>
          </div>
          <div>
            <dt className="font-bold text-slate-600">For</dt>
            <dd className="mt-1 text-acadia-ink">{entry.memo}</dd>
          </div>
          <div>
            <dt className="font-bold text-slate-600">Paid by</dt>
            <dd className="mt-1 text-acadia-ink">{[entry.method, entry.reference].filter(Boolean).join(" ") || "Not recorded"}</dd>
          </div>
        </dl>

        <p className="mt-8 border-t border-acadia-moss/20 pt-4 text-xs leading-5 text-slate-600">
          Recorded {formatDateTime(entry.created_at)}
          {entry.created_by_name ? ` by ${entry.created_by_name}` : ""}. This receipt comes from the association&apos;s ledger.
        </p>
      </article>
    </div>
  );
}
