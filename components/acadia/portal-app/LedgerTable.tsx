import Link from "next/link";
import { reverseEntryAction } from "@/app/Acadia/portal/actions";
import { Chip } from "@/components/acadia/portal/ui";
import { EmptyNote, inputClass, kindLabels } from "@/components/acadia/portal-app/parts";
import { SubmitButton } from "@/components/acadia/portal-app/SubmitButton";
import type { LedgerRow } from "@/lib/acadia-portal/data";
import { formatCents, formatDate, receiptNumber } from "@/lib/acadia-portal/format";

/**
 * A home's ledger, newest line first, with a running balance. Rows must arrive oldest first.
 * Pass boardHomeId to show the board's "Reverse" control on each line.
 */
export function LedgerTable({
  rows,
  boardHomeId,
  openingBalance = 0
}: {
  rows: LedgerRow[];
  boardHomeId?: number;
  /** The balance before the first row shown. Used when only the latest lines are listed. */
  openingBalance?: number;
}) {
  if (rows.length === 0) {
    return <EmptyNote>Nothing has been posted to this ledger yet.</EmptyNote>;
  }

  // Rows arrive oldest first. Work out the running balance in that order, then show newest first.
  let running = openingBalance;
  const withBalance = rows.map((row) => {
    running += row.amount_cents;
    return { row, balance: running };
  });
  const newestFirst = [...withBalance].reverse();

  return (
    <>
      {/* Phones: one card per line, so nothing is cut off. */}
      <ul className="divide-y divide-acadia-moss/15 sm:hidden">
        {newestFirst.map(({ row, balance }) => (
          <li key={row.id} className="py-3">
            <div className="flex items-start justify-between gap-3">
              <p className={`min-w-0 font-semibold ${isStruck(row) ? "text-slate-500" : "text-acadia-ink"}`}>{row.memo}</p>
              <p className={`shrink-0 font-bold tabular-nums ${row.amount_cents < 0 ? "text-emerald-800" : "text-acadia-ink"}`}>
                {row.amount_cents < 0 ? `-${formatCents(-row.amount_cents)}` : formatCents(row.amount_cents)}
              </p>
            </div>
            <p className="mt-1 text-xs text-slate-600">
              {formatDate(row.effective_date)}. Balance after this line: <span className="font-bold text-acadia-ink">{formatCents(balance)}</span>
            </p>
            <RowDetails row={row} />
            {boardHomeId !== undefined ? <ReverseControl row={row} homeId={boardHomeId} /> : null}
          </li>
        ))}
      </ul>

      {/* Larger screens: a table with a running balance. */}
      <div className="hidden overflow-x-auto sm:block print:block">
        <table className="w-full min-w-[640px] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-acadia-moss/30 text-xs uppercase tracking-wide text-slate-600">
              <th scope="col" className="py-2 pr-3 font-bold">Date</th>
              <th scope="col" className="py-2 pr-3 font-bold">Description</th>
              <th scope="col" className="py-2 pr-3 text-right font-bold">Charges</th>
              <th scope="col" className="py-2 pr-3 text-right font-bold">Payments and credits</th>
              <th scope="col" className="py-2 text-right font-bold">Balance</th>
            </tr>
          </thead>
          <tbody>
            {newestFirst.map(({ row, balance }) => (
              <tr key={row.id} className="border-b border-acadia-moss/15 align-top">
                <td className="whitespace-nowrap py-3 pr-3 text-slate-700">{formatDate(row.effective_date)}</td>
                <td className="py-3 pr-3">
                  <p className={`font-semibold ${isStruck(row) ? "text-slate-500" : "text-acadia-ink"}`}>{row.memo}</p>
                  <RowDetails row={row} />
                  {boardHomeId !== undefined ? <ReverseControl row={row} homeId={boardHomeId} /> : null}
                </td>
                <td className="whitespace-nowrap py-3 pr-3 text-right tabular-nums text-acadia-ink">
                  {row.amount_cents > 0 ? formatCents(row.amount_cents) : ""}
                </td>
                <td className="whitespace-nowrap py-3 pr-3 text-right tabular-nums text-emerald-800">
                  {row.amount_cents < 0 ? formatCents(-row.amount_cents) : ""}
                </td>
                <td className="whitespace-nowrap py-3 text-right font-bold tabular-nums text-acadia-ink">{formatCents(balance)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

function isStruck(row: LedgerRow) {
  return row.reversed_by !== null || row.kind === "reversal";
}

function RowDetails({ row }: { row: LedgerRow }) {
  return (
    <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-600">
      <Chip tone={row.kind === "payment" ? "green" : row.kind === "reversal" ? "slate" : row.kind === "credit" ? "blue" : "sky"}>
        {kindLabels[row.kind]}
      </Chip>
      {row.reversed_by !== null ? <Chip tone="amber">Reversed</Chip> : null}
      {row.due_date && row.kind === "charge" ? <span>Due {formatDate(row.due_date)}</span> : null}
      {row.method ? <span>{[row.method, row.reference].filter(Boolean).join(" ")}</span> : null}
      {row.kind === "payment" ? (
        <Link href={`/Acadia/portal/receipt/${row.id}`} className="font-bold text-acadia-leaf underline">
          Receipt {receiptNumber(row.id)}
        </Link>
      ) : null}
    </div>
  );
}

/** The board's way to cancel a line. It adds a reversal line and leaves the first line in place. */
function ReverseControl({ row, homeId }: { row: LedgerRow; homeId: number }) {
  if (row.kind === "reversal" || row.reversed_by !== null) return null;

  return (
    <details className="mt-2 print:hidden">
      <summary className="cursor-pointer text-xs font-bold text-red-800 underline">Reverse this entry</summary>
      <form action={reverseEntryAction} className="mt-2 flex flex-wrap items-end gap-2 rounded-lg border border-red-200 bg-red-50 p-3">
        <input type="hidden" name="entryId" value={row.id} />
        <input type="hidden" name="homeId" value={homeId} />
        <label className="block min-w-[200px] flex-1 text-xs font-bold text-red-950">
          Why is this being reversed?
          <input name="reason" required minLength={3} maxLength={160} className={`${inputClass} text-sm`} />
        </label>
        <SubmitButton tone="danger" small>
          Post the reversal
        </SubmitButton>
      </form>
    </details>
  );
}
