import Link from "next/link";
import { Panel } from "@/components/acadia/portal/ui";
import { LedgerTable } from "@/components/acadia/portal-app/LedgerTable";
import { balanceWords, EmptyNote, Flash, LinkButton, PageTitle, StatTile } from "@/components/acadia/portal-app/parts";
import { StatusChip } from "@/components/acadia/portal-app/RequestThread";
import { requireHome } from "@/lib/acadia-portal/auth";
import { getOwnerOverview, pastDueCents } from "@/lib/acadia-portal/data";
import { formatCents, formatDate, formatDateTime } from "@/lib/acadia-portal/format";

export default async function OwnerHomePage({ searchParams }: { searchParams: Promise<{ ok?: string; error?: string }> }) {
  const viewer = await requireHome();
  const { ok, error } = await searchParams;
  const overview = await getOwnerOverview(viewer.homeId);
  const balance = balanceWords(overview.balance);
  const pastDue = pastDueCents(overview.balance, overview.notDue);
  // With nothing owed there is nothing due, even if a charge with a later due date is on the ledger.
  const nextDueValue =
    overview.balance <= 0 ? "Nothing due" : pastDue >= overview.balance || !overview.nextDue ? "Due now" : formatDate(overview.nextDue.due_date);
  // The latest lines only. The balance before them is the total minus what they add up to.
  const recentTotal = overview.recent.reduce((sum, row) => sum + row.amount_cents, 0);

  return (
    <>
      <Flash ok={ok} error={error} />
      <PageTitle eyebrow={`Home ${viewer.houseNumber}`} title={`Hello, ${viewer.name.split(" ")[0]}`} />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatTile label={balance.label} value={balance.value} tone={balance.tone} note={overview.balance > 0 && pastDue === 0 ? "Nothing is past due." : undefined} />
        <StatTile
          label="Past due"
          value={pastDue > 0 ? formatCents(pastDue) : "None"}
          tone={pastDue > 0 ? "text-red-700" : "text-emerald-700"}
          note={pastDue > 0 ? "Please pay this amount as soon as you can." : undefined}
        />
        <StatTile
          label="Next due date"
          value={nextDueValue}
          note={overview.balance > 0 && overview.nextDue ? `${overview.nextDue.memo}.` : undefined}
        />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="min-w-0 space-y-6 lg:col-span-2">
          <Panel title="Recent activity" action={<LinkButton href="/Acadia/portal/home/ledger" quiet>See the full ledger</LinkButton>}>
            <LedgerTable rows={[...overview.recent].reverse()} openingBalance={overview.balance - recentTotal} />
          </Panel>

          <Panel title="Your open requests" action={<LinkButton href="/Acadia/portal/home/requests" quiet>All requests</LinkButton>}>
            {overview.openRequests.length === 0 ? (
              <EmptyNote>You have no open requests. Use Requests to ask the board for something.</EmptyNote>
            ) : (
              <ul className="divide-y divide-acadia-moss/15">
                {overview.openRequests.map((request) => (
                  <li key={request.id} className="flex flex-wrap items-center justify-between gap-2 py-3">
                    <Link href={`/Acadia/portal/home/requests/${request.id}`} className="font-bold text-acadia-leaf underline">
                      {request.subject}
                    </Link>
                    <span className="flex items-center gap-2 text-xs text-slate-600">
                      <StatusChip status={request.status} />
                      Updated {formatDateTime(request.updated_at)}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </Panel>
        </div>

        <div className="min-w-0 space-y-6">
          <Panel title="How to pay">
            <p className="whitespace-pre-wrap text-sm leading-6 text-slate-700">{overview.paymentNote}</p>
          </Panel>

          <Panel title="Notices from the board">
            {overview.notices.length === 0 ? (
              <p className="text-sm text-slate-600">No notices right now.</p>
            ) : (
              <ul className="space-y-4">
                {overview.notices.map((notice) => (
                  <li key={notice.id}>
                    <p className="font-bold text-acadia-ink">{notice.title}</p>
                    <p className="text-xs text-slate-600">{formatDateTime(notice.created_at)}</p>
                    <p className="mt-1 whitespace-pre-wrap text-sm leading-6 text-slate-700">{notice.body}</p>
                  </li>
                ))}
              </ul>
            )}
          </Panel>

          <Panel title="Documents">
            <p className="text-sm leading-6 text-slate-700">The governing documents and the document helper are open to everyone on the Acadia site.</p>
            <Link href="/Acadia/documents" className="mt-2 inline-block text-sm font-bold text-acadia-leaf underline">
              Open the documents page
            </Link>
          </Panel>
        </div>
      </div>
    </>
  );
}
