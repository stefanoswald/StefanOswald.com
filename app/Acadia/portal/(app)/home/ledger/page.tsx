import { Panel } from "@/components/acadia/portal/ui";
import { LedgerTable } from "@/components/acadia/portal-app/LedgerTable";
import { balanceWords, PageTitle, StatTile } from "@/components/acadia/portal-app/parts";
import { PrintButton } from "@/components/acadia/portal-app/PrintButton";
import { requireHome } from "@/lib/acadia-portal/auth";
import { getHomeLedger } from "@/lib/acadia-portal/data";

export default async function OwnerLedgerPage() {
  const viewer = await requireHome();
  const rows = await getHomeLedger(viewer.homeId);
  const balance = balanceWords(rows.reduce((sum, row) => sum + row.amount_cents, 0));

  return (
    <>
      <PageTitle eyebrow={`Home ${viewer.houseNumber}`} title="Ledger">
        Every charge, payment, and credit for your home. Lines are never erased. A mistake is fixed with a reversal line, so
        you can always see what happened.
      </PageTitle>
      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <StatTile label={balance.label} value={balance.value} tone={balance.tone} />
      </div>
      <Panel title="All activity" action={<PrintButton />}>
        <LedgerTable rows={rows} />
      </Panel>
    </>
  );
}
