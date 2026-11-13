import Link from "next/link";
import { createRequestAction } from "@/app/Acadia/portal/actions";
import { Panel } from "@/components/acadia/portal/ui";
import { EmptyNote, Field, Flash, inputClass, PageTitle } from "@/components/acadia/portal-app/parts";
import { StatusChip } from "@/components/acadia/portal-app/RequestThread";
import { SubmitButton } from "@/components/acadia/portal-app/SubmitButton";
import { requireHome } from "@/lib/acadia-portal/auth";
import { getHomeRequests, REQUEST_CATEGORIES } from "@/lib/acadia-portal/data";
import { formatDateTime } from "@/lib/acadia-portal/format";

export default async function OwnerRequestsPage({ searchParams }: { searchParams: Promise<{ ok?: string; error?: string }> }) {
  const viewer = await requireHome();
  const { ok, error } = await searchParams;
  const requests = await getHomeRequests(viewer.homeId);

  return (
    <>
      <Flash ok={ok} error={error} />
      <PageTitle eyebrow={`Home ${viewer.houseNumber}`} title="Requests">
        Ask the board for something and follow it to the end. Each request keeps its own thread of notes.
      </PageTitle>

      <div className="grid gap-6 lg:grid-cols-5">
        <div className="min-w-0 lg:col-span-3">
          <Panel title="Your requests">
            {requests.length === 0 ? (
              <EmptyNote>You have not sent any requests yet.</EmptyNote>
            ) : (
              <ul className="divide-y divide-acadia-moss/15">
                {requests.map((request) => (
                  <li key={request.id} className="py-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <Link href={`/Acadia/portal/home/requests/${request.id}`} className="font-bold text-acadia-leaf underline">
                        {request.subject}
                      </Link>
                      <StatusChip status={request.status} />
                    </div>
                    <p className="mt-1 text-xs text-slate-600">
                      {request.category}. Sent {formatDateTime(request.created_at)}.
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </Panel>
        </div>

        <div className="min-w-0 lg:col-span-2">
          <Panel title="Send a new request">
            <form action={createRequestAction} className="space-y-4">
              <Field label="Category">
                <select name="category" required defaultValue="" className={inputClass}>
                  <option value="" disabled>
                    Pick one
                  </option>
                  {REQUEST_CATEGORIES.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Subject">
                <input name="subject" required minLength={3} maxLength={120} className={inputClass} />
              </Field>
              <Field label="Details" hint="Say what you need and where. The board sees this and can reply here.">
                <textarea name="body" required rows={5} maxLength={4000} className={inputClass} />
              </Field>
              <SubmitButton>Send request</SubmitButton>
            </form>
          </Panel>
        </div>
      </div>
    </>
  );
}
