"use server";

// Every change in the owner portal goes through one of these server actions. Each action checks
// who is signed in before it does anything. It never trusts the form to say who the person is or
// which home they own.

import { redirect } from "next/navigation";
import {
  createSignInLink,
  getPortalState,
  requireBoard,
  requireHome,
  requireViewer,
  signInWithAdminKey,
  signInWithLinkToken,
  signOutCurrentSession,
  siteOrigin,
  type Viewer
} from "@/lib/acadia-portal/auth";
import { REQUEST_CATEGORIES } from "@/lib/acadia-portal/data";
import { dbBackup, PortalDataError, PortalUnavailableError, type Statement } from "@/lib/acadia-portal/db";
import { cleanText, formatCents, isValidDate, parseDollars, todayInFlorida } from "@/lib/acadia-portal/format";
import type { FormState, LinkState } from "@/lib/acadia-portal/messages";
import { auditStatement, batch, query } from "@/lib/acadia-portal/schema";

const SIGN_IN = "/Acadia/portal/sign-in";
const BOARD = "/Acadia/portal/board";
const OFFLINE_TEXT = "The records server is not answering right now. Please try again in a few minutes.";

function go(path: string, kind: "ok" | "error", code: string): never {
  redirect(`${path}${path.includes("?") ? "&" : "?"}${kind}=${code}`);
}

/** Only plain paths inside the board tools are accepted as a place to go back to. */
function boardPath(value: FormDataEntryValue | null, fallback: string) {
  const path = cleanText(value, 200);
  return /^\/Acadia\/portal\/board(\/[A-Za-z0-9_-]+)*$/.test(path) ? path : fallback;
}

function positiveId(value: FormDataEntryValue | null) {
  const id = Number(typeof value === "string" ? value : "");
  return Number.isInteger(id) && id > 0 ? id : null;
}

/** Runs the database work. If the records server is offline, sends the person to a page that says so. */
async function withDatabase<T>(work: () => Promise<T>): Promise<T> {
  try {
    return await work();
  } catch (error) {
    if (error instanceof PortalUnavailableError) redirect(`${SIGN_IN}?error=offline`);
    throw error;
  }
}

function auditForHome(actor: Viewer, action: string, homeId: number, detail: string): Statement {
  return {
    sql: `INSERT INTO audit_log (actor_id, actor_name, action, target, detail, created_at)
          SELECT ?, ?, ?, 'Home ' || house_number, ?, ? FROM homes WHERE id = ?`,
    params: [actor.personId, actor.name, action, detail.slice(0, 500), new Date().toISOString(), homeId]
  };
}

function auditForPerson(actor: Viewer, action: string, personId: number): Statement {
  return {
    sql: `INSERT INTO audit_log (actor_id, actor_name, action, target, detail, created_at)
          SELECT ?, ?, ?, name, '', ? FROM people WHERE id = ?`,
    params: [actor.personId, actor.name, action, new Date().toISOString(), personId]
  };
}

// ---- Signing in and out ----

export async function signInAction(_previous: FormState, formData: FormData): Promise<FormState> {
  const token = cleanText(formData.get("token"), 300);
  const state = await getPortalState();
  if (state.status === "unconfigured") return { error: "The owner portal is not turned on yet." };

  let signedIn = false;
  try {
    signedIn = await signInWithLinkToken(token);
  } catch (error) {
    if (error instanceof PortalUnavailableError) return { error: `${OFFLINE_TEXT} Your link has not been used up.` };
    throw error;
  }

  if (!signedIn) {
    return { error: "This sign-in link has already been used or has expired. Ask a board member for a new one." };
  }
  redirect("/Acadia/portal/home");
}

export async function signOutAction() {
  await signOutCurrentSession();
  go(SIGN_IN, "ok", "signed_out");
}

export async function boardSetupAction(_previous: FormState, formData: FormData): Promise<FormState> {
  const adminKey = cleanText(formData.get("adminKey"), 400);
  const name = cleanText(formData.get("name"), 80);
  const email = cleanText(formData.get("email"), 160);
  const houseNumber = cleanText(formData.get("houseNumber"), 10);
  // Hand back what was typed, except the key, so an error does not empty the form.
  const fail = (error: string): FormState => ({ error, values: { name, email, houseNumber } });

  if (!adminKey || name.length < 2 || !/^\S+@\S+\.\S+$/.test(email)) {
    return fail("Please enter the admin key, your name, and your email.");
  }
  if (houseNumber && !/^[0-9A-Za-z-]{1,10}$/.test(houseNumber)) {
    return fail("The house number should be numbers only, like 8012.");
  }

  let result;
  try {
    result = await signInWithAdminKey({ adminKey, name, email, houseNumber });
  } catch (error) {
    if (error instanceof PortalUnavailableError) {
      return fail(error.reason === "unconfigured" ? "The owner portal is not turned on yet." : OFFLINE_TEXT);
    }
    throw error;
  }

  if (result === "no_key") return fail("Setup is not available. The admin key has not been added to the site settings.");
  if (result === "locked") return fail("Too many wrong tries. Setup is locked for 15 minutes.");
  if (result === "wrong_key") return fail("That admin key is not right.");
  redirect(BOARD);
}

// ---- Owner actions ----

export async function createRequestAction(formData: FormData) {
  const viewer = await requireHome();
  const category = cleanText(formData.get("category"), 60);
  const subject = cleanText(formData.get("subject"), 120);
  const body = cleanText(formData.get("body"), 4000);
  const path = "/Acadia/portal/home/requests";

  if (!REQUEST_CATEGORIES.includes(category)) go(path, "error", "category");
  if (subject.length < 3 || !body) go(path, "error", "missing");

  const now = new Date().toISOString();
  const results = await withDatabase(() =>
    batch([
      {
        sql: `INSERT INTO requests (home_id, person_id, category, subject, body, status, created_at, updated_at)
              VALUES (?, ?, ?, ?, ?, 'open', ?, ?)`,
        params: [viewer.homeId, viewer.personId, category, subject, body, now, now]
      }
    ])
  );
  go(`${path}/${results[0].lastInsertRowid}`, "ok", "request_sent");
}

export async function addRequestNoteAction(formData: FormData) {
  const viewer = await requireViewer();
  const requestId = positiveId(formData.get("requestId"));
  const body = cleanText(formData.get("body"), 4000);
  const asBoard = formData.get("view") === "board" && viewer.isBoard;
  const boardOnly = asBoard && formData.get("boardOnly") === "on";
  const path = asBoard ? `${BOARD}/requests/${requestId}` : `/Acadia/portal/home/requests/${requestId}`;

  if (!requestId) go(asBoard ? `${BOARD}/requests` : "/Acadia/portal/home/requests", "error", "not_found");
  if (!body) go(path, "error", "missing");

  const now = new Date().toISOString();
  try {
    await withDatabase(() =>
      batch([
        {
          // An owner can only add a note to a request from their own home.
          sql: `INSERT INTO request_notes (request_id, author_id, body, board_only, created_at)
                SELECT id, ?, ?, ?, ? FROM requests WHERE id = ? AND (? = 1 OR home_id = ?)`,
          params: [viewer.personId, body, boardOnly ? 1 : 0, now, requestId, viewer.isBoard ? 1 : 0, viewer.homeId],
          expect: { changes: 1 }
        },
        {
          // A reply from the owner reopens a closed request so the board sees it.
          sql: `UPDATE requests SET updated_at = ?,
                  status = CASE WHEN status = 'closed' AND ? = 0 THEN 'open' ELSE status END
                WHERE id = ?`,
          params: [now, asBoard ? 1 : 0, requestId]
        }
      ])
    );
  } catch (error) {
    if (error instanceof PortalDataError) go("/Acadia/portal/home/requests", "error", "not_found");
    throw error;
  }
  go(path, "ok", "note_added");
}

// ---- Board actions: requests ----

export async function setRequestStatusAction(formData: FormData) {
  const viewer = await requireBoard();
  const requestId = positiveId(formData.get("requestId"));
  const status = cleanText(formData.get("status"), 20);
  if (!requestId || !["open", "in_progress", "closed"].includes(status)) go(`${BOARD}/requests`, "error", "not_found");

  await withDatabase(() =>
    batch([
      { sql: "UPDATE requests SET status = ?, updated_at = ? WHERE id = ?", params: [status, new Date().toISOString(), requestId] },
      auditStatement(viewer, "Changed a request status", `Request ${requestId}`, status)
    ])
  );
  go(`${BOARD}/requests/${requestId}`, "ok", "status_saved");
}

// ---- Board actions: homes and people ----

export async function addHomesAction(formData: FormData) {
  const viewer = await requireBoard();
  const lines = cleanText(formData.get("homes"), 6000)
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
  const path = `${BOARD}/settings`;

  if (lines.length === 0 || lines.length > 100) go(path, "error", "homes_format");

  const now = new Date().toISOString();
  const statements: Statement[] = [];
  for (const line of lines) {
    const [number, ...rest] = line.split(",");
    const houseNumber = number.trim();
    if (!/^[0-9A-Za-z-]{1,10}$/.test(houseNumber)) go(path, "error", "homes_format");
    statements.push({
      // A home that is already listed is left alone, except that a missing street gets filled in.
      sql: `INSERT INTO homes (house_number, street, created_at) VALUES (?, ?, ?)
            ON CONFLICT(house_number) DO UPDATE SET street = excluded.street WHERE homes.street = '' AND excluded.street <> ''`,
      params: [houseNumber, rest.join(",").trim().slice(0, 120), now]
    });
  }
  statements.push(auditStatement(viewer, "Added homes", "", `${lines.length} lines entered`));

  await withDatabase(() => batch(statements));
  go(path, "ok", "homes_added");
}

export async function addPersonAction(formData: FormData) {
  const viewer = await requireBoard();
  const homeId = positiveId(formData.get("homeId"));
  const name = cleanText(formData.get("name"), 80);
  const email = cleanText(formData.get("email"), 160);
  const phone = cleanText(formData.get("phone"), 40);
  if (!homeId) go(BOARD, "error", "home");
  const path = `${BOARD}/homes/${homeId}`;
  if (name.length < 2) go(path, "error", "missing");

  try {
    await withDatabase(() =>
      batch([
        {
          sql: "INSERT INTO people (home_id, name, email, phone, is_board, created_at) SELECT id, ?, ?, ?, 0, ? FROM homes WHERE id = ?",
          params: [name, email, phone, new Date().toISOString(), homeId],
          expect: { changes: 1 }
        },
        auditForHome(viewer, "Added a person", homeId, name)
      ])
    );
  } catch (error) {
    if (error instanceof PortalDataError) go(BOARD, "error", "home");
    throw error;
  }
  go(path, "ok", "person_added");
}

export async function addBoardMemberAction(formData: FormData) {
  const viewer = await requireBoard();
  const name = cleanText(formData.get("name"), 80);
  const email = cleanText(formData.get("email"), 160);
  const homeId = positiveId(formData.get("homeId"));
  const path = `${BOARD}/settings`;
  if (name.length < 2 || !/^\S+@\S+\.\S+$/.test(email)) go(path, "error", "missing");

  await withDatabase(() =>
    batch([
      {
        sql: `INSERT INTO people (home_id, name, email, is_board, created_at)
              VALUES ((SELECT id FROM homes WHERE id = ?), ?, ?, 1, ?)`,
        params: [homeId, name, email, new Date().toISOString()]
      },
      auditStatement(viewer, "Added a board member", name, email)
    ])
  );
  go(path, "ok", "board_changed");
}

export async function setBoardAccessAction(formData: FormData) {
  const viewer = await requireBoard();
  const personId = positiveId(formData.get("personId"));
  const makeBoard = formData.get("makeBoard") === "1";
  const path = boardPath(formData.get("returnTo"), `${BOARD}/settings`);

  if (!personId) go(path, "error", "not_found");
  if (personId === viewer.personId && !makeBoard) go(path, "error", "self");

  await withDatabase(() =>
    batch([
      { sql: "UPDATE people SET is_board = ? WHERE id = ?", params: [makeBoard ? 1 : 0, personId], expect: { changes: 1 } },
      auditForPerson(viewer, makeBoard ? "Gave board access" : "Removed board access", personId)
    ])
  );
  go(path, "ok", "board_changed");
}

export async function setPersonDisabledAction(formData: FormData) {
  const viewer = await requireBoard();
  const personId = positiveId(formData.get("personId"));
  const disable = formData.get("disable") === "1";
  const path = boardPath(formData.get("returnTo"), BOARD);

  if (!personId) go(path, "error", "not_found");
  if (personId === viewer.personId) go(path, "error", "self");

  const now = new Date().toISOString();
  const statements: Statement[] = [
    { sql: "UPDATE people SET disabled_at = ? WHERE id = ?", params: [disable ? now : null, personId], expect: { changes: 1 } }
  ];
  if (disable) {
    // Turning off a person also ends their sessions and cancels any unused links.
    statements.push(
      { sql: "UPDATE sessions SET ended_at = ? WHERE person_id = ? AND ended_at IS NULL", params: [now, personId] },
      { sql: "UPDATE sign_in_links SET used_at = ? WHERE person_id = ? AND used_at IS NULL", params: [now, personId] }
    );
  }
  statements.push(auditForPerson(viewer, disable ? "Turned off a person's sign-in" : "Turned a person's sign-in back on", personId));

  await withDatabase(() => batch(statements));
  go(path, "ok", disable ? "person_disabled" : "person_enabled");
}

export async function createLinkAction(_previous: LinkState, formData: FormData): Promise<LinkState> {
  const viewer = await requireBoard();
  const personId = positiveId(formData.get("personId"));
  if (!personId) return { error: "That person could not be found." };

  try {
    const token = await createSignInLink(personId, viewer);
    // The secret sits after the # so it is never sent to a server log or to another site.
    return { url: `${await siteOrigin()}/Acadia/portal/enter#${token}` };
  } catch (error) {
    if (error instanceof PortalUnavailableError) return { error: OFFLINE_TEXT };
    if (error instanceof PortalDataError) return { error: "That person cannot sign in. Turn their sign-in back on first." };
    throw error;
  }
}

// ---- Board actions: money ----

const METHODS = ["Check", "Cash", "Bank transfer", "Money order", "Other"];

export async function postEntryAction(formData: FormData) {
  const viewer = await requireBoard();
  const homeId = positiveId(formData.get("homeId"));
  const kind = cleanText(formData.get("kind"), 20);
  const cents = parseDollars(cleanText(formData.get("amount"), 20));
  const effectiveDate = cleanText(formData.get("effectiveDate"), 10) || todayInFlorida();
  const dueDate = cleanText(formData.get("dueDate"), 10);
  const method = cleanText(formData.get("method"), 30);
  const reference = cleanText(formData.get("reference"), 60);
  const nonce = cleanText(formData.get("nonce"), 60);
  let memo = cleanText(formData.get("memo"), 200);

  if (!homeId) go(BOARD, "error", "home");
  const path = boardPath(formData.get("returnTo"), `${BOARD}/homes/${homeId}`);

  if (!["charge", "payment", "credit"].includes(kind)) go(path, "error", "missing");
  if (cents === null) go(path, "error", "amount");
  if (!isValidDate(effectiveDate) || (dueDate && !isValidDate(dueDate))) go(path, "error", "date");
  if (!memo && kind === "payment") memo = "Payment received";
  if (!memo) go(path, "error", "missing");
  if (!/^[A-Za-z0-9-]{8,60}$/.test(nonce)) go(path, "error", "missing");

  const isPayment = kind === "payment";
  const amount = kind === "charge" ? cents : -cents;
  const label = kind === "charge" ? "Posted a charge" : isPayment ? "Recorded a payment" : "Posted a credit";
  const detail = [formatCents(cents), memo, isPayment ? [method, reference].filter(Boolean).join(" ") : ""].filter(Boolean).join(". ");

  try {
    await withDatabase(() =>
      batch([
        {
          sql: `INSERT INTO ledger_entries
                  (home_id, kind, amount_cents, memo, effective_date, due_date, method, reference, client_ref, created_at, created_by)
                SELECT id, ?, ?, ?, ?, ?, ?, ?, ?, ?, ? FROM homes WHERE id = ?`,
          params: [
            kind,
            amount,
            memo,
            effectiveDate,
            kind === "charge" && dueDate ? dueDate : null,
            isPayment && METHODS.includes(method) ? method : "",
            isPayment ? reference : "",
            nonce,
            new Date().toISOString(),
            viewer.personId,
            homeId
          ],
          expect: { changes: 1 }
        },
        auditForHome(viewer, label, homeId, detail)
      ])
    );
  } catch (error) {
    if (error instanceof PortalDataError) {
      // The same form sent twice hits the unique mark on the entry. Nothing is posted a second time.
      go(path, error.code === "constraint" ? "ok" : "error", error.code === "constraint" ? "duplicate" : "home");
    }
    throw error;
  }
  go(path, "ok", "entry_posted");
}

export async function postChargeToAllAction(formData: FormData) {
  const viewer = await requireBoard();
  const cents = parseDollars(cleanText(formData.get("amount"), 20));
  const memo = cleanText(formData.get("memo"), 200);
  const effectiveDate = cleanText(formData.get("effectiveDate"), 10) || todayInFlorida();
  const dueDate = cleanText(formData.get("dueDate"), 10);
  const nonce = cleanText(formData.get("nonce"), 60);
  const path = `${BOARD}/billing`;

  if (cents === null) go(path, "error", "amount");
  if (!memo) go(path, "error", "missing");
  if (!isValidDate(effectiveDate) || (dueDate && !isValidDate(dueDate))) go(path, "error", "date");
  if (!/^[A-Za-z0-9-]{8,60}$/.test(nonce)) go(path, "error", "missing");

  const homes = await withDatabase(() => query<{ total: number }>("SELECT COUNT(*) AS total FROM homes"));
  const homeCount = Number(homes[0]?.total || 0);
  if (homeCount === 0) go(path, "error", "no_homes");

  try {
    await withDatabase(() =>
      batch([
        {
          sql: `INSERT INTO ledger_entries (home_id, kind, amount_cents, memo, effective_date, due_date, client_ref, created_at, created_by)
                SELECT id, 'charge', ?, ?, ?, ?, ? || ':' || id, ?, ? FROM homes`,
          params: [cents, memo, effectiveDate, dueDate || null, nonce, new Date().toISOString(), viewer.personId]
        },
        auditStatement(viewer, "Posted a charge to every home", `${homeCount} homes`, `${formatCents(cents)} each. ${memo}`)
      ])
    );
  } catch (error) {
    if (error instanceof PortalDataError && error.code === "constraint") go(path, "ok", "duplicate");
    throw error;
  }
  go(path, "ok", "charge_all_posted");
}

export async function reverseEntryAction(formData: FormData) {
  const viewer = await requireBoard();
  const entryId = positiveId(formData.get("entryId"));
  const homeId = positiveId(formData.get("homeId"));
  const reason = cleanText(formData.get("reason"), 160);
  if (!entryId || !homeId) go(BOARD, "error", "not_found");
  const path = `${BOARD}/homes/${homeId}`;
  if (reason.length < 3) go(path, "error", "missing");

  try {
    await withDatabase(() =>
      batch([
        {
          // The reversal is a new row with the opposite amount. The first row is never touched.
          sql: `INSERT INTO ledger_entries (home_id, kind, amount_cents, memo, effective_date, due_date, reverses_id, created_at, created_by)
                SELECT home_id, 'reversal', -amount_cents, 'Reversed: ' || memo || '. Reason: ' || ?, ?, due_date, id, ?, ?
                FROM ledger_entries WHERE id = ? AND home_id = ? AND kind <> 'reversal'`,
          params: [reason, todayInFlorida(), new Date().toISOString(), viewer.personId, entryId, homeId],
          expect: { changes: 1 }
        },
        auditForHome(viewer, "Reversed a ledger entry", homeId, `Entry ${entryId}. Reason: ${reason}`)
      ])
    );
  } catch (error) {
    if (error instanceof PortalDataError) go(path, "error", error.code === "constraint" ? "reversed_already" : "not_found");
    throw error;
  }
  go(path, "ok", "entry_reversed");
}

// ---- Board actions: notices and settings ----

export async function postNoticeAction(formData: FormData) {
  const viewer = await requireBoard();
  const title = cleanText(formData.get("title"), 120);
  const body = cleanText(formData.get("body"), 3000);
  const path = `${BOARD}/settings`;
  if (title.length < 3 || !body) go(path, "error", "missing");

  await withDatabase(() =>
    batch([
      { sql: "INSERT INTO notices (title, body, created_at, created_by) VALUES (?, ?, ?, ?)", params: [title, body, new Date().toISOString(), viewer.personId] },
      auditStatement(viewer, "Posted a notice", title)
    ])
  );
  go(path, "ok", "notice_posted");
}

export async function removeNoticeAction(formData: FormData) {
  const viewer = await requireBoard();
  const noticeId = positiveId(formData.get("noticeId"));
  const path = `${BOARD}/settings`;
  if (!noticeId) go(path, "error", "not_found");

  await withDatabase(() =>
    batch([
      { sql: "UPDATE notices SET removed_at = ? WHERE id = ? AND removed_at IS NULL", params: [new Date().toISOString(), noticeId] },
      auditStatement(viewer, "Removed a notice", `Notice ${noticeId}`)
    ])
  );
  go(path, "ok", "notice_removed");
}

export async function saveSettingsAction(formData: FormData) {
  const viewer = await requireBoard();
  const paymentNote = cleanText(formData.get("paymentNote"), 1500);
  const now = new Date().toISOString();

  await withDatabase(() =>
    batch([
      {
        sql: `INSERT INTO settings (key, value, updated_at) VALUES ('payment_note', ?, ?)
              ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = excluded.updated_at`,
        params: [paymentNote, now]
      },
      auditStatement(viewer, "Changed the how-to-pay note")
    ])
  );
  go(`${BOARD}/settings`, "ok", "settings_saved");
}

export async function runBackupAction() {
  const viewer = await requireBoard();
  await withDatabase(async () => {
    const result = await dbBackup();
    await batch([auditStatement(viewer, "Ran a backup", result.backup)]);
  });
  go(`${BOARD}/settings`, "ok", "backup_done");
}
