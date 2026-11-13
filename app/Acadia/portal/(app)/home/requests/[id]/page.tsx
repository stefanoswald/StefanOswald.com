import Link from "next/link";
import { notFound } from "next/navigation";
import { Flash, PageTitle } from "@/components/acadia/portal-app/parts";
import { RequestThread } from "@/components/acadia/portal-app/RequestThread";
import { requireHome } from "@/lib/acadia-portal/auth";
import { getRequestWithNotes } from "@/lib/acadia-portal/data";

export default async function OwnerRequestPage({
  params,
  searchParams
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ ok?: string; error?: string }>;
}) {
  const viewer = await requireHome();
  const { id } = await params;
  const { ok, error } = await searchParams;
  const requestId = Number(id);
  if (!Number.isInteger(requestId) || requestId <= 0) notFound();

  const { request, notes } = await getRequestWithNotes(requestId, false);
  // An owner can only open requests from their own home.
  if (!request || request.home_id !== viewer.homeId) notFound();

  return (
    <>
      <Flash ok={ok} error={error} />
      <Link href="/Acadia/portal/home/requests" className="text-sm font-bold text-acadia-leaf underline">
        Back to requests
      </Link>
      <div className="mt-3">
        <PageTitle eyebrow={`Request ${request.id}`} title={request.subject} />
      </div>
      <RequestThread request={request} notes={notes} view="owner" />
    </>
  );
}
