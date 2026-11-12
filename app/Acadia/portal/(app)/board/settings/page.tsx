import {
  addBoardMemberAction,
  addHomesAction,
  postNoticeAction,
  removeNoticeAction,
  runBackupAction,
  saveSettingsAction,
  setBoardAccessAction
} from "@/app/Acadia/portal/actions";
import { Chip, Panel } from "@/components/acadia/portal/ui";
import { Field, Flash, inputClass, PageTitle } from "@/components/acadia/portal-app/parts";
import { SignInLinkButton } from "@/components/acadia/portal-app/SignInLinkButton";
import { SubmitButton } from "@/components/acadia/portal-app/SubmitButton";
import { LINK_DAYS, requireBoard } from "@/lib/acadia-portal/auth";
import { DEFAULT_PAYMENT_NOTE, getBoardSettings, getHomeOptions } from "@/lib/acadia-portal/data";
import { dbStatus, PortalUnavailableError, type DataServiceStatus } from "@/lib/acadia-portal/db";
import { formatDateTime } from "@/lib/acadia-portal/format";

function megabytes(bytes: number) {
  return bytes < 1024 * 1024 ? `${Math.max(1, Math.round(bytes / 1024))} KB` : `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default async function BoardSettingsPage({ searchParams }: { searchParams: Promise<{ ok?: string; error?: string }> }) {
  const viewer = await requireBoard();
  const { ok, error } = await searchParams;
  const [settings, homes] = await Promise.all([getBoardSettings(), getHomeOptions()]);

  let status: DataServiceStatus | null = null;
  try {
    status = await dbStatus();
  } catch (statusError) {
    if (!(statusError instanceof PortalUnavailableError)) throw statusError;
  }

  return (
    <>
      <Flash ok={ok} error={error} />
      <PageTitle eyebrow="Board tools" title="Settings" />

      <div className="grid gap-6 lg:grid-cols-2">
        <Panel title="Notices to owners">
          <form action={postNoticeAction} className="space-y-3">
            <Field label="Title">
              <input name="title" required minLength={3} maxLength={120} className={inputClass} />
            </Field>
            <Field label="Message">
              <textarea name="body" required rows={4} maxLength={3000} className={inputClass} />
            </Field>
            <SubmitButton>Post notice</SubmitButton>
          </form>
          {settings.notices.length > 0 ? (
            <ul className="mt-5 divide-y divide-acadia-moss/15 border-t border-acadia-moss/20">
              {settings.notices.map((notice) => (
                <li key={notice.id} className="flex flex-wrap items-start justify-between gap-3 py-3">
                  <div className="min-w-0 flex-1">
                    <p className="font-bold text-acadia-ink">{notice.title}</p>
                    <p className="text-xs text-slate-600">
                      {formatDateTime(notice.created_at)}
                      {notice.created_by_name ? ` by ${notice.created_by_name}` : ""}
                    </p>
                  </div>
                  <form action={removeNoticeAction}>
                    <input type="hidden" name="noticeId" value={notice.id} />
                    <SubmitButton tone="danger" small>
                      Remove
                    </SubmitButton>
                  </form>
                </li>
              ))}
            </ul>
          ) : null}
        </Panel>

        <Panel title="How to pay">
          <form action={saveSettingsAction} className="space-y-3">
            <Field
              label="Note shown to owners on their home page"
              hint="Say how owners should pay for now. Leave it blank to show the standard note."
            >
              <textarea name="paymentNote" rows={5} maxLength={1500} defaultValue={settings.paymentNote} placeholder={DEFAULT_PAYMENT_NOTE} className={inputClass} />
            </Field>
            <SubmitButton>Save note</SubmitButton>
          </form>
        </Panel>

        <Panel title={`Homes (${settings.homeCount})`}>
          <form action={addHomesAction} className="space-y-3">
            <Field
              label="Add homes"
              hint="One home per line. Start with the house number. You can add the street after a comma. A house number that is already listed is skipped."
            >
              <textarea name="homes" required rows={5} placeholder={"8001, Sample Street\n8003, Sample Street"} className={`${inputClass} font-mono text-sm`} />
            </Field>
            <SubmitButton>Add homes</SubmitButton>
          </form>
        </Panel>

        <Panel title="Board members">
          <ul className="divide-y divide-acadia-moss/15">
            {settings.boardMembers.map((member) => (
              <li key={member.id} className="py-3">
                <p className="flex flex-wrap items-center gap-2 font-bold text-acadia-ink">
                  {member.name}
                  {member.id === viewer.personId ? <Chip tone="sky">You</Chip> : null}
                  {member.disabled_at ? <Chip tone="red">Sign-in off</Chip> : null}
                </p>
                <p className="text-xs text-slate-600">
                  {member.email || "No email"}
                  {member.house_number ? `. Home ${member.house_number}` : ". No home linked"}.{" "}
                  {member.last_seen_at ? `Last signed in ${formatDateTime(member.last_seen_at)}.` : "Has not signed in yet."}
                </p>
                {member.id !== viewer.personId && !member.disabled_at ? (
                  <div className="mt-2 flex flex-wrap items-start gap-2">
                    <SignInLinkButton personId={member.id} personName={member.name} linkDays={LINK_DAYS} />
                    <form action={setBoardAccessAction}>
                      <input type="hidden" name="personId" value={member.id} />
                      <input type="hidden" name="makeBoard" value="0" />
                      <input type="hidden" name="returnTo" value="/Acadia/portal/board/settings" />
                      <SubmitButton tone="danger" small>
                        Remove board access
                      </SubmitButton>
                    </form>
                  </div>
                ) : null}
              </li>
            ))}
          </ul>
          <details className="mt-4 rounded-lg border border-acadia-moss/25 p-4">
            <summary className="cursor-pointer text-sm font-bold text-acadia-ink">Add a board member</summary>
            <form action={addBoardMemberAction} className="mt-4 space-y-3">
              <Field label="Name">
                <input name="name" required minLength={2} maxLength={80} className={inputClass} />
              </Field>
              <Field label="Email">
                <input name="email" type="email" required maxLength={160} className={inputClass} />
              </Field>
              <Field label="Their home" hint="Optional. To give board access to an owner who is already listed, open their home instead.">
                <select name="homeId" defaultValue="" className={inputClass}>
                  <option value="">No home</option>
                  {homes.map((home) => (
                    <option key={home.id} value={home.id}>
                      {home.house_number}
                    </option>
                  ))}
                </select>
              </Field>
              <SubmitButton>Add board member</SubmitButton>
            </form>
          </details>
        </Panel>

        <Panel title="Records server" className="min-w-0 lg:col-span-2">
          {status ? (
            <dl className="grid gap-4 text-sm sm:grid-cols-4">
              <div>
                <dt className="font-bold text-slate-600">Status</dt>
                <dd className="mt-1">
                  <Chip tone="green">Online</Chip>
                </dd>
              </div>
              <div>
                <dt className="font-bold text-slate-600">Database size</dt>
                <dd className="mt-1 text-acadia-ink">{megabytes(status.databaseBytes)}</dd>
              </div>
              <div>
                <dt className="font-bold text-slate-600">Latest backup</dt>
                <dd className="mt-1 text-acadia-ink">{status.lastBackup || "None yet"}</dd>
              </div>
              <div>
                <dt className="font-bold text-slate-600">Backups kept</dt>
                <dd className="mt-1 text-acadia-ink">{status.backups}</dd>
              </div>
            </dl>
          ) : (
            <p className="text-sm text-amber-900">The records server did not answer the status check.</p>
          )}
          <p className="mt-4 max-w-3xl text-sm leading-6 text-slate-700">
            The records live in one file on the board&apos;s own records server. The server writes a backup copy every day.
            Keep that folder in the machine&apos;s normal backup too.
          </p>
          <form action={runBackupAction} className="mt-3">
            <SubmitButton tone="quiet">Write a backup now</SubmitButton>
          </form>
        </Panel>
      </div>
    </>
  );
}
