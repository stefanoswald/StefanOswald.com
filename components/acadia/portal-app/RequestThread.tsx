import { addRequestNoteAction } from "@/app/Acadia/portal/actions";
import { Chip, Panel } from "@/components/acadia/portal/ui";
import { inputClass } from "@/components/acadia/portal-app/parts";
import { SubmitButton } from "@/components/acadia/portal-app/SubmitButton";
import { requestStatusLabels, type RequestNoteRow, type RequestRow, type RequestStatus } from "@/lib/acadia-portal/data";
import { formatDateTime } from "@/lib/acadia-portal/format";

const statusTones: Record<RequestStatus, "amber" | "blue" | "slate"> = {
  open: "amber",
  in_progress: "blue",
  closed: "slate"
};

export function StatusChip({ status }: { status: RequestStatus }) {
  return <Chip tone={statusTones[status]}>{requestStatusLabels[status]}</Chip>;
}

/** One request with its notes and a box to add a note. Used by both the owner and the board pages. */
export function RequestThread({ request, notes, view }: { request: RequestRow; notes: RequestNoteRow[]; view: "owner" | "board" }) {
  return (
    <div className="space-y-5">
      <Panel>
        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600">
          <StatusChip status={request.status} />
          <Chip tone="sky">{request.category}</Chip>
          <span>
            Home {request.house_number}. Sent by {request.person_name} on {formatDateTime(request.created_at)}.
          </span>
        </div>
        <p className="mt-4 whitespace-pre-wrap text-base leading-7 text-acadia-ink">{request.body}</p>
      </Panel>

      {notes.length > 0 ? (
        <ol className="space-y-3" aria-label="Notes on this request">
          {notes.map((note) => (
            <li
              key={note.id}
              className={`rounded-xl border p-4 ${note.board_only ? "border-purple-200 bg-purple-50" : note.author_is_board ? "border-acadia-moss/30 bg-acadia-sky" : "border-acadia-moss/20 bg-white"}`}
            >
              <p className="flex flex-wrap items-center gap-2 text-xs text-slate-600">
                <span className="font-bold text-acadia-ink">{note.author_name}</span>
                {note.author_is_board ? <Chip tone="green">Board</Chip> : null}
                {note.board_only ? <Chip tone="purple">Board only. The owner cannot see this.</Chip> : null}
                <span>{formatDateTime(note.created_at)}</span>
              </p>
              <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-acadia-ink">{note.body}</p>
            </li>
          ))}
        </ol>
      ) : null}

      <Panel title={view === "board" ? "Reply or add a note" : "Add a note"}>
        <form action={addRequestNoteAction} className="space-y-3">
          <input type="hidden" name="requestId" value={request.id} />
          <input type="hidden" name="view" value={view} />
          <label className="block text-sm font-bold text-acadia-ink">
            Your note
            <textarea name="body" required rows={4} maxLength={4000} className={inputClass} />
          </label>
          {view === "board" ? (
            <label className="flex items-center gap-2 text-sm text-slate-700">
              <input type="checkbox" name="boardOnly" className="h-4 w-4 rounded border-acadia-moss/50" />
              Board only. Do not show this note to the owner.
            </label>
          ) : request.status === "closed" ? (
            <p className="text-xs text-slate-600">This request is closed. Adding a note opens it again.</p>
          ) : null}
          <SubmitButton>{view === "board" ? "Post note" : "Send note"}</SubmitButton>
        </form>
      </Panel>
    </div>
  );
}
