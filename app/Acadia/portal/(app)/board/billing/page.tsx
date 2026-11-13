import { randomUUID } from "node:crypto";
import { postChargeToAllAction } from "@/app/Acadia/portal/actions";
import { Panel } from "@/components/acadia/portal/ui";
import { EntryForm } from "@/components/acadia/portal-app/EntryForm";
import { Field, Flash, inputClass, PageTitle } from "@/components/acadia/portal-app/parts";
import { SubmitButton } from "@/components/acadia/portal-app/SubmitButton";
import { requireBoard } from "@/lib/acadia-portal/auth";
import { getHomeOptions } from "@/lib/acadia-portal/data";
import { todayInFlorida } from "@/lib/acadia-portal/format";

export default async function BoardBillingPage({ searchParams }: { searchParams: Promise<{ ok?: string; error?: string }> }) {
  await requireBoard();
  const { ok, error } = await searchParams;
  const homes = await getHomeOptions();
  const path = "/Acadia/portal/board/billing";

  return (
    <>
      <Flash ok={ok} error={error} />
      <PageTitle eyebrow="Board tools" title="Billing">
        Post dues to every home at once, or record a payment as it comes in. Every line is saved with your name and the
        time. Lines cannot be edited or erased. A mistake is fixed with a reversal on the home&apos;s page.
      </PageTitle>

      <div className="grid gap-6 lg:grid-cols-2">
        <Panel title={`Post a charge to every home (${homes.length})`}>
          <form action={postChargeToAllAction} className="grid gap-4 sm:grid-cols-2">
            <input type="hidden" name="nonce" value={randomUUID()} />
            <Field label="Amount per home in dollars">
              <input name="amount" required inputMode="decimal" placeholder="0.00" pattern="\$?[0-9,]+(\.[0-9]{1,2})?" title="Dollars, like 1035 or 1035.00" className={inputClass} />
            </Field>
            <Field label="Description" hint="For example: Q1 2027 dues.">
              <input name="memo" required maxLength={200} className={inputClass} />
            </Field>
            <Field label="Date posted">
              <input name="effectiveDate" type="date" required defaultValue={todayInFlorida()} className={inputClass} />
            </Field>
            <Field label="Due date" hint="The charge counts as past due after this date.">
              <input name="dueDate" type="date" className={inputClass} />
            </Field>
            <div className="sm:col-span-2">
              <SubmitButton>Post to all {homes.length} homes</SubmitButton>
            </div>
          </form>
        </Panel>

        <Panel title="Record a payment">
          <EntryForm kind="payment" homes={homes} returnTo={path} />
        </Panel>

        <Panel title="Export for the CPA" className="min-w-0 lg:col-span-2">
          <p className="max-w-3xl text-sm leading-6 text-slate-700">
            Download the whole ledger as a spreadsheet file. It lists every charge, payment, credit, and reversal for every
            home, with dates, check numbers, and who recorded each line.
          </p>
          <a
            href="/Acadia/portal/board/export"
            className="mt-4 inline-flex min-h-11 items-center justify-center rounded-md border border-acadia-moss/40 bg-white px-4 py-2.5 text-sm font-bold text-acadia-ink transition hover:border-acadia-leaf hover:bg-acadia-sky"
          >
            Download the ledger (CSV)
          </a>
        </Panel>
      </div>
    </>
  );
}
