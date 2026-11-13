// Read queries for the portal pages. Each page asks for what it needs in one trip to the database.

import { batch, query } from "@/lib/acadia-portal/schema";
import { todayInFlorida } from "@/lib/acadia-portal/format";

export type LedgerKind = "charge" | "payment" | "credit" | "reversal";

export type LedgerRow = {
  id: number;
  home_id: number;
  kind: LedgerKind;
  amount_cents: number;
  memo: string;
  effective_date: string;
  due_date: string | null;
  method: string;
  reference: string;
  reverses_id: number | null;
  reversed_by: number | null;
  created_at: string;
  created_by_name: string | null;
};

export type RequestStatus = "open" | "in_progress" | "closed";

export type RequestRow = {
  id: number;
  home_id: number;
  house_number: string;
  person_name: string;
  category: string;
  subject: string;
  body: string;
  status: RequestStatus;
  created_at: string;
  updated_at: string;
};

export type RequestNoteRow = {
  id: number;
  author_name: string;
  author_is_board: number;
  body: string;
  board_only: number;
  created_at: string;
};

export type NoticeRow = { id: number; title: string; body: string; created_at: string; created_by_name: string | null };

export type HomeSummary = {
  id: number;
  house_number: string;
  street: string;
  balance: number;
  not_due: number;
  people: number;
  names: string | null;
};

export type PersonRow = {
  id: number;
  home_id: number | null;
  house_number: string | null;
  name: string;
  email: string;
  phone: string;
  is_board: number;
  disabled_at: string | null;
  last_seen_at: string | null;
  open_links: number;
};

export type AuditRow = { id: number; actor_name: string; action: string; target: string; detail: string; created_at: string };

export const REQUEST_CATEGORIES = [
  "Architectural change",
  "Common-area repair",
  "Gate or access",
  "Billing question",
  "Question for the board"
];

export const requestStatusLabels: Record<RequestStatus, string> = {
  open: "Open",
  in_progress: "In progress",
  closed: "Closed"
};

export const DEFAULT_PAYMENT_NOTE =
  "Online payments are not turned on yet. Please keep paying the way you do today. The treasurer records each payment here once it is received.";

const LEDGER_SELECT = `
  SELECT l.id, l.home_id, l.kind, l.amount_cents, l.memo, l.effective_date, l.due_date, l.method, l.reference,
         l.reverses_id, r.id AS reversed_by, l.created_at, p.name AS created_by_name
  FROM ledger_entries l
  LEFT JOIN ledger_entries r ON r.reverses_id = l.id
  LEFT JOIN people p ON p.id = l.created_by`;

/** The amount owed that is already past its due date. Charges with a later due date are not late yet. */
export function pastDueCents(balance: number, notDue: number) {
  return Math.max(0, balance - Math.max(0, notDue));
}

export async function getOwnerOverview(homeId: number) {
  const today = todayInFlorida();
  const results = await batch([
    {
      sql: `SELECT COALESCE(SUM(amount_cents), 0) AS balance,
                   COALESCE(SUM(CASE WHEN due_date > ? AND kind IN ('charge', 'reversal') THEN amount_cents ELSE 0 END), 0) AS not_due
            FROM ledger_entries WHERE home_id = ?`,
      params: [today, homeId]
    },
    {
      sql: `SELECT l.memo, l.amount_cents, l.due_date FROM ledger_entries l
            WHERE l.home_id = ? AND l.kind = 'charge' AND l.due_date >= ?
              AND NOT EXISTS (SELECT 1 FROM ledger_entries r WHERE r.reverses_id = l.id)
            ORDER BY l.due_date, l.id LIMIT 1`,
      params: [homeId, today]
    },
    { sql: `${LEDGER_SELECT} WHERE l.home_id = ? ORDER BY l.effective_date DESC, l.id DESC LIMIT 6`, params: [homeId] },
    {
      sql: `SELECT q.id, q.home_id, h.house_number, p.name AS person_name, q.category, q.subject, q.body, q.status, q.created_at, q.updated_at
            FROM requests q JOIN homes h ON h.id = q.home_id JOIN people p ON p.id = q.person_id
            WHERE q.home_id = ? AND q.status <> 'closed' ORDER BY q.updated_at DESC LIMIT 5`,
      params: [homeId]
    },
    {
      sql: `SELECT n.id, n.title, n.body, n.created_at, p.name AS created_by_name
            FROM notices n LEFT JOIN people p ON p.id = n.created_by
            WHERE n.removed_at IS NULL ORDER BY n.id DESC LIMIT 5`
    },
    { sql: "SELECT value FROM settings WHERE key = 'payment_note'" }
  ]);

  const totals = results[0].rows[0] as { balance: number; not_due: number };
  return {
    balance: Number(totals.balance),
    notDue: Number(totals.not_due),
    nextDue: (results[1].rows[0] as { memo: string; amount_cents: number; due_date: string } | undefined) || null,
    recent: results[2].rows as LedgerRow[],
    openRequests: results[3].rows as RequestRow[],
    notices: results[4].rows as NoticeRow[],
    paymentNote: ((results[5].rows[0] as { value: string } | undefined)?.value || "").trim() || DEFAULT_PAYMENT_NOTE
  };
}

export async function getHomeLedger(homeId: number) {
  return query<LedgerRow>(`${LEDGER_SELECT} WHERE l.home_id = ? ORDER BY l.effective_date, l.id`, [homeId]);
}

export async function getLedgerEntry(entryId: number) {
  const rows = await query<LedgerRow & { house_number: string; street: string }>(
    `SELECT l.id, l.home_id, l.kind, l.amount_cents, l.memo, l.effective_date, l.due_date, l.method, l.reference,
            l.reverses_id, r.id AS reversed_by, l.created_at, p.name AS created_by_name, h.house_number, h.street
     FROM ledger_entries l
     JOIN homes h ON h.id = l.home_id
     LEFT JOIN ledger_entries r ON r.reverses_id = l.id
     LEFT JOIN people p ON p.id = l.created_by
     WHERE l.id = ?`,
    [entryId]
  );
  return rows[0] || null;
}

const REQUEST_SELECT = `
  SELECT q.id, q.home_id, h.house_number, p.name AS person_name, q.category, q.subject, q.body, q.status, q.created_at, q.updated_at
  FROM requests q JOIN homes h ON h.id = q.home_id JOIN people p ON p.id = q.person_id`;

export async function getHomeRequests(homeId: number) {
  return query<RequestRow>(`${REQUEST_SELECT} WHERE q.home_id = ? ORDER BY q.id DESC`, [homeId]);
}

export async function getAllRequests() {
  return query<RequestRow>(`${REQUEST_SELECT} ORDER BY CASE q.status WHEN 'closed' THEN 1 ELSE 0 END, q.updated_at DESC LIMIT 500`);
}

/** One request with its notes. Owners never receive board-only notes. */
export async function getRequestWithNotes(requestId: number, includeBoardNotes: boolean) {
  const results = await batch([
    { sql: `${REQUEST_SELECT} WHERE q.id = ?`, params: [requestId] },
    {
      sql: `SELECT n.id, p.name AS author_name, p.is_board AS author_is_board, n.body, n.board_only, n.created_at
            FROM request_notes n JOIN people p ON p.id = n.author_id
            WHERE n.request_id = ? ${includeBoardNotes ? "" : "AND n.board_only = 0"} ORDER BY n.id`,
      params: [requestId]
    }
  ]);
  const request = (results[0].rows[0] as RequestRow | undefined) || null;
  return { request, notes: results[1].rows as RequestNoteRow[] };
}

export async function getBoardDashboard() {
  const today = todayInFlorida();
  const results = await batch([
    {
      sql: `SELECT h.id, h.house_number, h.street,
              COALESCE((SELECT SUM(l.amount_cents) FROM ledger_entries l WHERE l.home_id = h.id), 0) AS balance,
              COALESCE((SELECT SUM(l.amount_cents) FROM ledger_entries l
                        WHERE l.home_id = h.id AND l.due_date > ? AND l.kind IN ('charge', 'reversal')), 0) AS not_due,
              (SELECT COUNT(*) FROM people p WHERE p.home_id = h.id AND p.disabled_at IS NULL) AS people,
              (SELECT GROUP_CONCAT(p.name, ', ') FROM people p WHERE p.home_id = h.id AND p.disabled_at IS NULL) AS names
            FROM homes h ORDER BY h.house_number`,
      params: [today]
    },
    { sql: "SELECT COUNT(*) AS total FROM requests WHERE status <> 'closed'" },
    {
      sql: `SELECT l.id, l.amount_cents, l.memo, l.effective_date, l.method, h.house_number, h.id AS home_id
            FROM ledger_entries l JOIN homes h ON h.id = l.home_id
            WHERE l.kind = 'payment' AND NOT EXISTS (SELECT 1 FROM ledger_entries r WHERE r.reverses_id = l.id)
            ORDER BY l.id DESC LIMIT 6`
    }
  ]);

  return {
    homes: results[0].rows as HomeSummary[],
    openRequests: Number((results[1].rows[0] as { total: number }).total),
    recentPayments: results[2].rows as {
      id: number;
      amount_cents: number;
      memo: string;
      effective_date: string;
      method: string;
      house_number: string;
      home_id: number;
    }[]
  };
}

const PERSON_SELECT = `
  SELECT p.id, p.home_id, h.house_number, p.name, p.email, p.phone, p.is_board, p.disabled_at,
         (SELECT MAX(s.last_seen_at) FROM sessions s WHERE s.person_id = p.id) AS last_seen_at,
         (SELECT COUNT(*) FROM sign_in_links k WHERE k.person_id = p.id AND k.used_at IS NULL AND k.expires_at > ?) AS open_links
  FROM people p LEFT JOIN homes h ON h.id = p.home_id`;

export async function getBoardHome(homeId: number) {
  const now = new Date().toISOString();
  const results = await batch([
    { sql: "SELECT id, house_number, street FROM homes WHERE id = ?", params: [homeId] },
    { sql: `${PERSON_SELECT} WHERE p.home_id = ? ORDER BY p.disabled_at IS NOT NULL, p.id`, params: [now, homeId] },
    { sql: `${LEDGER_SELECT} WHERE l.home_id = ? ORDER BY l.effective_date, l.id`, params: [homeId] },
    { sql: `${REQUEST_SELECT} WHERE q.home_id = ? ORDER BY q.id DESC LIMIT 20`, params: [homeId] }
  ]);
  return {
    home: (results[0].rows[0] as { id: number; house_number: string; street: string } | undefined) || null,
    people: results[1].rows as PersonRow[],
    ledger: results[2].rows as LedgerRow[],
    requests: results[3].rows as RequestRow[]
  };
}

export async function getBoardSettings() {
  const now = new Date().toISOString();
  const results = await batch([
    { sql: "SELECT value FROM settings WHERE key = 'payment_note'" },
    {
      sql: `SELECT n.id, n.title, n.body, n.created_at, p.name AS created_by_name
            FROM notices n LEFT JOIN people p ON p.id = n.created_by WHERE n.removed_at IS NULL ORDER BY n.id DESC LIMIT 50`
    },
    { sql: `${PERSON_SELECT} WHERE p.is_board = 1 ORDER BY p.disabled_at IS NOT NULL, p.id`, params: [now] },
    { sql: "SELECT COUNT(*) AS total FROM homes" }
  ]);
  return {
    paymentNote: (results[0].rows[0] as { value: string } | undefined)?.value || "",
    notices: results[1].rows as NoticeRow[],
    boardMembers: results[2].rows as PersonRow[],
    homeCount: Number((results[3].rows[0] as { total: number }).total)
  };
}

export async function getAuditLog(limit = 200) {
  return query<AuditRow>("SELECT id, actor_name, action, target, detail, created_at FROM audit_log ORDER BY id DESC LIMIT ?", [limit]);
}

export async function getHomeOptions() {
  return query<{ id: number; house_number: string }>("SELECT id, house_number FROM homes ORDER BY house_number");
}

export type ExportRow = {
  id: number;
  house_number: string;
  kind: string;
  amount_cents: number;
  memo: string;
  effective_date: string;
  due_date: string | null;
  method: string;
  reference: string;
  reverses_id: number | null;
  created_at: string;
  created_by_name: string | null;
};

export async function getLedgerExport() {
  return query<ExportRow>(
    `SELECT l.id, h.house_number, l.kind, l.amount_cents, l.memo, l.effective_date, l.due_date, l.method, l.reference,
            l.reverses_id, l.created_at, p.name AS created_by_name
     FROM ledger_entries l JOIN homes h ON h.id = l.home_id LEFT JOIN people p ON p.id = l.created_by
     ORDER BY l.effective_date, l.id LIMIT 5000`
  );
}
