import Link from "next/link";
import { notFound } from "next/navigation";
import { addPersonAction, setBoardAccessAction, setPersonDisabledAction } from "@/app/Acadia/portal/actions";
import { Chip, Panel } from "@/components/acadia/portal/ui";
import { EntryForm } from "@/components/acadia/portal-app/EntryForm";
import { LedgerTable } from "@/components/acadia/portal-app/LedgerTable";
import { EmptyNote, Field, Flash, inputClass, PageTitle, StatTile } from "@/components/acadia/portal-app/parts";
import { PrintButton } from "@/components/acadia/portal-app/PrintButton";
import { StatusChip } from "@/components/acadia/portal-app/RequestThread";
import { SignInLinkButton } from "@/components/acadia/portal-app/SignInLinkButton";
import { SubmitButton } from "@/components/acadia/portal-app/SubmitButton";
import { LINK_DAYS, requireBoard } from "@/lib/acadia-portal/auth";
import { getBoardHome } from "@/lib/acadia-portal/data";
import { formatCents, formatDateTime } from "@/lib/acadia-portal/format";

export default async function BoardHomeDetailPage({
  params,
  searchParams
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ ok?: string; error?: string }>;
}) {
  const viewer = await requireBoard();
  const { id } = await params;
  const { ok, error } = await searchParams;
  const homeId = Number(id);
  if (!Number.isInteger(homeId) || homeId <= 0) notFound();

  const { home, people, ledger, requests } = await getBoardHome(homeId);
  if (!home) notFound();

  const balance = ledger.reduce((sum, row) => sum + row.amount_cents, 0);
  const path = `/Acadia/portal/board/homes/${home.id}`;

  return (
    <>
      <Flash ok={ok} error={error} />
      <Link href="/Acadia/portal/board" className="text-sm font-bold text-acadia-leaf underline print:hidden">
        Back to all homes
      </Link>
      <div className="mt-3">
        <PageTitle eyebrow="Board tools" title={`Home ${home.house_number}`}>
          {home.street || null}
        </PageTitle>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatTile
          label={balance < 0 ? "Credit held" : "Balance owed"}
          value={formatCents(Math.abs(balance))}
          tone={balance > 0 ? "text-acadia-ink" : "text-emerald-700"}
        />
        <StatTile label="People" value={String(people.filter((person) => !person.disabled_at).length)} />
        <StatTile label="Open requests" value={String(requests.filter((request) => request.status !== "closed").length)} />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="min-w-0 space-y-6 lg:col-span-2">
          <Panel title="Add to the ledger" className="print:hidden">
            <div className="space-y-3">
              <details className="rounded-lg border border-acadia-moss/25 p-4" open>
                <summary className="cursor-pointer text-sm font-bold text-acadia-ink">Record a payment</summary>
                <div className="mt-4">
                  <EntryForm kind="payment" homeId={home.id} returnTo={path} />
                </div>
              </details>
              <details className="rounded-lg border border-acadia-moss/25 p-4">
                <summary className="cursor-pointer text-sm font-bold text-acadia-ink">Post a charge to this home only</summary>
                <div className="mt-4">
                  <EntryForm kind="charge" homeId={home.id} returnTo={path} />
                </div>
              </details>
              <details className="rounded-lg border border-acadia-moss/25 p-4">
                <summary className="cursor-pointer text-sm font-bold text-acadia-ink">Post a credit</summary>
                <div className="mt-4">
                  <EntryForm kind="credit" homeId={home.id} returnTo={path} />
                </div>
              </details>
            </div>
          </Panel>

          <Panel title="Ledger" action={<PrintButton />}>
            <LedgerTable rows={ledger} boardHomeId={home.id} />
          </Panel>
        </div>

        <div className="min-w-0 space-y-6 print:hidden">
          <Panel title="People">
            {people.length === 0 ? (
              <EmptyNote>No one is linked to this home yet. Add the owner below.</EmptyNote>
            ) : (
              <ul className="space-y-5">
                {people.map((person) => (
                  <li key={person.id} className="border-b border-acadia-moss/15 pb-5 last:border-b-0 last:pb-0">
                    <p className="flex flex-wrap items-center gap-2 font-bold text-acadia-ink">
                      {person.name}
                      {person.is_board ? <Chip tone="green">Board</Chip> : null}
                      {person.disabled_at ? <Chip tone="red">Sign-in off</Chip> : null}
                    </p>
                    <p className="mt-1 text-xs leading-5 text-slate-600">
                      {[person.email, person.phone].filter(Boolean).join(" | ") || "No contact details"}
                      <br />
                      {person.last_seen_at ? `Last signed in ${formatDateTime(person.last_seen_at)}.` : "Has not signed in yet."}
                      {person.open_links > 0 ? " A sign-in link is waiting to be used." : ""}
                    </p>
                    <div className="mt-3 space-y-2">
                      {!person.disabled_at ? <SignInLinkButton personId={person.id} personName={person.name} linkDays={LINK_DAYS} /> : null}
                      {person.id !== viewer.personId ? (
                        <div className="flex flex-wrap gap-2">
                          <form action={setPersonDisabledAction}>
                            <input type="hidden" name="personId" value={person.id} />
                            <input type="hidden" name="disable" value={person.disabled_at ? "0" : "1"} />
                            <input type="hidden" name="returnTo" value={path} />
                            <SubmitButton tone={person.disabled_at ? "quiet" : "danger"} small>
                              {person.disabled_at ? "Turn sign-in back on" : "Turn off sign-in"}
                            </SubmitButton>
                          </form>
                          {!person.disabled_at ? (
                            <form action={setBoardAccessAction}>
                              <input type="hidden" name="personId" value={person.id} />
                              <input type="hidden" name="makeBoard" value={person.is_board ? "0" : "1"} />
                              <input type="hidden" name="returnTo" value={path} />
                              <SubmitButton tone="quiet" small>
                                {person.is_board ? "Remove board access" : "Give board access"}
                              </SubmitButton>
                            </form>
                          ) : null}
                        </div>
                      ) : null}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </Panel>

          <Panel title="Add a person">
            <form action={addPersonAction} className="space-y-3">
              <input type="hidden" name="homeId" value={home.id} />
              <Field label="Name">
                <input name="name" required minLength={2} maxLength={80} className={inputClass} />
              </Field>
              <Field label="Email" hint="Optional. For the board's records.">
                <input name="email" type="email" maxLength={160} className={inputClass} />
              </Field>
              <Field label="Phone" hint="Optional.">
                <input name="phone" type="tel" maxLength={40} className={inputClass} />
              </Field>
              <SubmitButton>Add person</SubmitButton>
            </form>
          </Panel>

          <Panel title="Requests from this home">
            {requests.length === 0 ? (
              <p className="text-sm text-slate-600">None yet.</p>
            ) : (
              <ul className="space-y-2">
                {requests.map((request) => (
                  <li key={request.id} className="flex flex-wrap items-center justify-between gap-2 text-sm">
                    <Link href={`/Acadia/portal/board/requests/${request.id}`} className="font-bold text-acadia-leaf underline">
                      {request.subject}
                    </Link>
                    <StatusChip status={request.status} />
                  </li>
                ))}
              </ul>
            )}
          </Panel>
        </div>
      </div>
    </>
  );
}
