import Link from "next/link";
import { Panel } from "@/components/acadia/portal/ui";
import { EmptyNote, Flash, PageTitle } from "@/components/acadia/portal-app/parts";
import { StatusChip } from "@/components/acadia/portal-app/RequestThread";
import { requireBoard } from "@/lib/acadia-portal/auth";
import { getAllRequests } from "@/lib/acadia-portal/data";
import { formatDateTime } from "@/lib/acadia-portal/format";

export default async function BoardRequestsPage({ searchParams }: { searchParams: Promise<{ ok?: string; error?: string }> }) {
  await requireBoard();
  const { ok, error } = await searchParams;
  const requests = await getAllRequests();
  const open = requests.filter((request) => request.status !== "closed");
  const closed = requests.filter((request) => request.status === "closed");

  return (
    <>
      <Flash ok={ok} error={error} />
      <PageTitle eyebrow="Board tools" title="Requests">
        Everything owners have asked for, with the newest activity first.
      </PageTitle>

      <Panel title={`Open (${open.length})`}>
        {open.length === 0 ? (
          <EmptyNote>No open requests.</EmptyNote>
        ) : (
          <RequestList requests={open} />
        )}
      </Panel>

      {closed.length > 0 ? (
        <Panel title={`Closed (${closed.length})`} className="mt-6">
          <RequestList requests={closed} />
        </Panel>
      ) : null}
    </>
  );
}

function RequestList({ requests }: { requests: Awaited<ReturnType<typeof getAllRequests>> }) {
  return (
    <ul className="divide-y divide-acadia-moss/15">
      {requests.map((request) => (
        <li key={request.id} className="py-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <Link href={`/Acadia/portal/board/requests/${request.id}`} className="font-bold text-acadia-leaf underline">
              {request.subject}
            </Link>
            <StatusChip status={request.status} />
          </div>
          <p className="mt-1 text-xs text-slate-600">
            Home {request.house_number}. {request.person_name}. {request.category}. Updated {formatDateTime(request.updated_at)}.
          </p>
        </li>
      ))}
    </ul>
  );
}
