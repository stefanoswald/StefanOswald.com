import Link from "next/link";
import { notFound } from "next/navigation";
import { setRequestStatusAction } from "@/app/Acadia/portal/actions";
import { Panel } from "@/components/acadia/portal/ui";
import { Flash, inputClass, PageTitle } from "@/components/acadia/portal-app/parts";
import { RequestThread } from "@/components/acadia/portal-app/RequestThread";
import { SubmitButton } from "@/components/acadia/portal-app/SubmitButton";
import { requireBoard } from "@/lib/acadia-portal/auth";
import { getRequestWithNotes, requestStatusLabels } from "@/lib/acadia-portal/data";

export default async function BoardRequestPage({
  params,
  searchParams
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ ok?: string; error?: string }>;
}) {
  await requireBoard();
  const { id } = await params;
  const { ok, error } = await searchParams;
  const requestId = Number(id);
  if (!Number.isInteger(requestId) || requestId <= 0) notFound();

  const { request, notes } = await getRequestWithNotes(requestId, true);
  if (!request) notFound();

  return (
    <>
      <Flash ok={ok} error={error} />
      <Link href="/Acadia/portal/board/requests" className="text-sm font-bold text-acadia-leaf underline">
        Back to requests
      </Link>
      <div className="mt-3">
        <PageTitle eyebrow={`Request ${request.id}`} title={request.subject} />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="min-w-0 lg:col-span-2">
          <RequestThread request={request} notes={notes} view="board" />
        </div>
        <div className="min-w-0 space-y-6">
          <Panel title="Status">
            <form action={setRequestStatusAction} className="space-y-3">
              <input type="hidden" name="requestId" value={request.id} />
              <label className="block text-sm font-bold text-acadia-ink">
                Set the status
                <select name="status" defaultValue={request.status} className={inputClass}>
                  {Object.entries(requestStatusLabels).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </label>
              <SubmitButton tone="quiet">Save status</SubmitButton>
            </form>
          </Panel>
          <Panel title="Home">
            <Link href={`/Acadia/portal/board/homes/${request.home_id}`} className="text-sm font-bold text-acadia-leaf underline">
              Open home {request.house_number}
            </Link>
          </Panel>
        </div>
      </div>
    </>
  );
}
