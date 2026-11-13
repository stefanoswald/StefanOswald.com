import Link from "next/link";
import { Chip, Panel } from "@/components/acadia/portal/ui";
import { EmptyNote, Flash, LinkButton, PageTitle, StatTile } from "@/components/acadia/portal-app/parts";
import { requireBoard } from "@/lib/acadia-portal/auth";
import { getBoardDashboard, pastDueCents } from "@/lib/acadia-portal/data";
import { formatCents, formatDate, receiptNumber } from "@/lib/acadia-portal/format";

export default async function BoardHomePage({ searchParams }: { searchParams: Promise<{ ok?: string; error?: string }> }) {
  await requireBoard();
  const { ok, error } = await searchParams;
  const { homes, openRequests, recentPayments } = await getBoardDashboard();

  const totalOwed = homes.reduce((sum, home) => sum + Math.max(0, home.balance), 0);
  const totalCredits = homes.reduce((sum, home) => sum + Math.max(0, -home.balance), 0);
  const pastDueHomes = homes.filter((home) => pastDueCents(home.balance, home.not_due) > 0);
  const totalPastDue = pastDueHomes.reduce((sum, home) => sum + pastDueCents(home.balance, home.not_due), 0);

  return (
    <>
      <Flash ok={ok} error={error} />
      <PageTitle eyebrow="Board tools" title="All homes">
        Balances come straight from the ledger. Open a home to record a payment, add a person, or create a sign-in link.
      </PageTitle>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatTile label="Homes" value={String(homes.length)} />
        <StatTile label="Total owed" value={formatCents(totalOwed)} note={totalCredits > 0 ? `Credits held: ${formatCents(totalCredits)}` : undefined} />
        <StatTile
          label="Past due"
          value={formatCents(totalPastDue)}
          tone={totalPastDue > 0 ? "text-red-700" : "text-emerald-700"}
          note={`${pastDueHomes.length} ${pastDueHomes.length === 1 ? "home" : "homes"}`}
        />
        <StatTile label="Open requests" value={String(openRequests)} />
      </div>

      <div className="mt-4 flex flex-wrap gap-3">
        <LinkButton href="/Acadia/portal/board/billing">Post charges and payments</LinkButton>
        <LinkButton href="/Acadia/portal/board/requests" quiet>
          Review requests
        </LinkButton>
        <LinkButton href="/Acadia/portal/board/settings" quiet>
          Add homes and notices
        </LinkButton>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="min-w-0 lg:col-span-2">
          <Panel title="Homes">
            {homes.length === 0 ? (
              <EmptyNote>
                No homes yet. Go to Settings and add the house numbers. Then add each owner and send them a sign-in link.
              </EmptyNote>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[520px] border-collapse text-left text-sm">
                  <thead>
                    <tr className="border-b border-acadia-moss/30 text-xs uppercase tracking-wide text-slate-600">
                      <th scope="col" className="py-2 pr-3 font-bold">Home</th>
                      <th scope="col" className="py-2 pr-3 font-bold">People</th>
                      <th scope="col" className="py-2 pr-3 text-right font-bold">Balance</th>
                      <th scope="col" className="py-2 text-right font-bold">Past due</th>
                    </tr>
                  </thead>
                  <tbody>
                    {homes.map((home) => {
                      const pastDue = pastDueCents(home.balance, home.not_due);
                      return (
                        <tr key={home.id} className="border-b border-acadia-moss/15">
                          <td className="py-2.5 pr-3">
                            <Link href={`/Acadia/portal/board/homes/${home.id}`} className="font-bold text-acadia-leaf underline">
                              {home.house_number}
                            </Link>
                            {home.street ? <span className="ml-2 text-xs text-slate-600">{home.street}</span> : null}
                          </td>
                          <td className="py-2.5 pr-3 text-slate-700">{home.names || <span className="text-slate-500">No one added yet</span>}</td>
                          <td className="whitespace-nowrap py-2.5 pr-3 text-right tabular-nums">
                            {home.balance < 0 ? <Chip tone="green">Credit {formatCents(-home.balance)}</Chip> : formatCents(home.balance)}
                          </td>
                          <td className={`whitespace-nowrap py-2.5 text-right tabular-nums ${pastDue > 0 ? "font-bold text-red-700" : "text-slate-500"}`}>
                            {pastDue > 0 ? formatCents(pastDue) : "None"}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </Panel>
        </div>

        <Panel title="Latest payments">
          {recentPayments.length === 0 ? (
            <p className="text-sm text-slate-600">No payments recorded yet.</p>
          ) : (
            <ul className="divide-y divide-acadia-moss/15">
              {recentPayments.map((payment) => (
                <li key={payment.id} className="py-2.5 text-sm">
                  <div className="flex items-center justify-between gap-2">
                    <Link href={`/Acadia/portal/board/homes/${payment.home_id}`} className="font-bold text-acadia-leaf underline">
                      Home {payment.house_number}
                    </Link>
                    <span className="font-bold tabular-nums text-emerald-800">{formatCents(-payment.amount_cents)}</span>
                  </div>
                  <p className="text-xs text-slate-600">
                    {formatDate(payment.effective_date)}. {payment.method || "Method not recorded"}.{" "}
                    <Link href={`/Acadia/portal/receipt/${payment.id}`} className="underline">
                      {receiptNumber(payment.id)}
                    </Link>
                  </p>
                </li>
              ))}
            </ul>
          )}
        </Panel>
      </div>
    </>
  );
}
