import { Panel } from "@/components/acadia/portal/ui";
import { EmptyNote, PageTitle } from "@/components/acadia/portal-app/parts";
import { requireBoard } from "@/lib/acadia-portal/auth";
import { getAuditLog } from "@/lib/acadia-portal/data";
import { formatDateTime } from "@/lib/acadia-portal/format";

export default async function BoardLogPage() {
  await requireBoard();
  const entries = await getAuditLog(200);

  return (
    <>
      <PageTitle eyebrow="Board tools" title="Change log">
        Who did what, and when. The log cannot be edited or erased, even by a board member. The latest 200 entries are
        shown.
      </PageTitle>
      <Panel>
        {entries.length === 0 ? (
          <EmptyNote>Nothing has been logged yet.</EmptyNote>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[620px] border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-acadia-moss/30 text-xs uppercase tracking-wide text-slate-600">
                  <th scope="col" className="py-2 pr-3 font-bold">When</th>
                  <th scope="col" className="py-2 pr-3 font-bold">Who</th>
                  <th scope="col" className="py-2 pr-3 font-bold">What</th>
                  <th scope="col" className="py-2 font-bold">Details</th>
                </tr>
              </thead>
              <tbody>
                {entries.map((entry) => (
                  <tr key={entry.id} className="border-b border-acadia-moss/15 align-top">
                    <td className="whitespace-nowrap py-2.5 pr-3 text-slate-700">{formatDateTime(entry.created_at)}</td>
                    <td className="py-2.5 pr-3 font-semibold text-acadia-ink">{entry.actor_name}</td>
                    <td className="py-2.5 pr-3 text-acadia-ink">{entry.action}</td>
                    <td className="py-2.5 text-slate-700">{[entry.target, entry.detail].filter(Boolean).join(". ")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Panel>
    </>
  );
}
