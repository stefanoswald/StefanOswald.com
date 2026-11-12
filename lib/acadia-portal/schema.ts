// The portal's tables, and the helpers every other portal file uses to reach the database.
//
// The data service on the home server knows nothing about these tables. The website creates and
// updates them, so a new feature never needs a change on the home server.
//
// To change the tables, add a new entry to MIGRATIONS with the next version number. Never edit an
// entry that has already run on the real database.

import { dbBatch, PortalDataError, type SqlValue, type Statement, type StatementResult } from "@/lib/acadia-portal/db";

const MIGRATIONS: { version: number; statements: string[] }[] = [
  {
    version: 1,
    statements: [
      `CREATE TABLE homes (
        id INTEGER PRIMARY KEY,
        house_number TEXT NOT NULL UNIQUE,
        street TEXT NOT NULL DEFAULT '',
        created_at TEXT NOT NULL
      )`,
      `CREATE TABLE people (
        id INTEGER PRIMARY KEY,
        home_id INTEGER REFERENCES homes(id),
        name TEXT NOT NULL,
        email TEXT NOT NULL DEFAULT '',
        phone TEXT NOT NULL DEFAULT '',
        is_board INTEGER NOT NULL DEFAULT 0,
        created_at TEXT NOT NULL,
        disabled_at TEXT
      )`,
      `CREATE INDEX people_home ON people(home_id)`,
      // Sign-in links and sessions store only a hash of the secret, never the secret itself.
      `CREATE TABLE sign_in_links (
        id INTEGER PRIMARY KEY,
        person_id INTEGER NOT NULL REFERENCES people(id),
        token_hash TEXT NOT NULL UNIQUE,
        created_by INTEGER REFERENCES people(id),
        created_at TEXT NOT NULL,
        expires_at TEXT NOT NULL,
        used_at TEXT
      )`,
      `CREATE TABLE sessions (
        id INTEGER PRIMARY KEY,
        person_id INTEGER NOT NULL REFERENCES people(id),
        token_hash TEXT NOT NULL UNIQUE,
        created_at TEXT NOT NULL,
        expires_at TEXT NOT NULL,
        last_seen_at TEXT NOT NULL,
        ended_at TEXT
      )`,
      // The ledger. Amounts are whole cents. A charge is positive. A payment or credit is negative.
      // A home's balance is the sum of its rows. Rows are never changed or deleted. A mistake is
      // fixed by adding a reversal row that points at the row it cancels.
      `CREATE TABLE ledger_entries (
        id INTEGER PRIMARY KEY,
        home_id INTEGER NOT NULL REFERENCES homes(id),
        kind TEXT NOT NULL CHECK (kind IN ('charge', 'payment', 'credit', 'reversal')),
        amount_cents INTEGER NOT NULL,
        memo TEXT NOT NULL,
        effective_date TEXT NOT NULL,
        due_date TEXT,
        method TEXT NOT NULL DEFAULT '',
        reference TEXT NOT NULL DEFAULT '',
        reverses_id INTEGER UNIQUE REFERENCES ledger_entries(id),
        client_ref TEXT UNIQUE,
        created_at TEXT NOT NULL,
        created_by INTEGER REFERENCES people(id),
        CHECK (
          (kind = 'charge' AND amount_cents > 0)
          OR (kind IN ('payment', 'credit') AND amount_cents < 0)
          OR (kind = 'reversal' AND amount_cents <> 0 AND reverses_id IS NOT NULL)
        )
      )`,
      `CREATE INDEX ledger_home ON ledger_entries(home_id, effective_date, id)`,
      // One row per processor payment, so a repeated confirmation can never post twice.
      `CREATE UNIQUE INDEX ledger_processor_reference ON ledger_entries(method, reference) WHERE method = 'stripe'`,
      `CREATE TRIGGER ledger_no_update BEFORE UPDATE ON ledger_entries
        BEGIN SELECT RAISE(ABORT, 'ledger entries cannot be changed'); END`,
      `CREATE TRIGGER ledger_no_delete BEFORE DELETE ON ledger_entries
        BEGIN SELECT RAISE(ABORT, 'ledger entries cannot be deleted'); END`,
      `CREATE TABLE requests (
        id INTEGER PRIMARY KEY,
        home_id INTEGER NOT NULL REFERENCES homes(id),
        person_id INTEGER NOT NULL REFERENCES people(id),
        category TEXT NOT NULL,
        subject TEXT NOT NULL,
        body TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'closed')),
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
      )`,
      `CREATE INDEX requests_home ON requests(home_id, created_at)`,
      `CREATE TABLE request_notes (
        id INTEGER PRIMARY KEY,
        request_id INTEGER NOT NULL REFERENCES requests(id),
        author_id INTEGER NOT NULL REFERENCES people(id),
        body TEXT NOT NULL,
        board_only INTEGER NOT NULL DEFAULT 0,
        created_at TEXT NOT NULL
      )`,
      `CREATE INDEX request_notes_request ON request_notes(request_id, id)`,
      `CREATE TABLE notices (
        id INTEGER PRIMARY KEY,
        title TEXT NOT NULL,
        body TEXT NOT NULL,
        created_at TEXT NOT NULL,
        created_by INTEGER REFERENCES people(id),
        removed_at TEXT
      )`,
      `CREATE TABLE settings (
        key TEXT PRIMARY KEY,
        value TEXT NOT NULL,
        updated_at TEXT NOT NULL
      )`,
      // Who did what, and when. Like the ledger, rows are never changed or deleted.
      `CREATE TABLE audit_log (
        id INTEGER PRIMARY KEY,
        actor_id INTEGER,
        actor_name TEXT NOT NULL,
        action TEXT NOT NULL,
        target TEXT NOT NULL DEFAULT '',
        detail TEXT NOT NULL DEFAULT '',
        created_at TEXT NOT NULL
      )`,
      `CREATE TRIGGER audit_no_update BEFORE UPDATE ON audit_log
        BEGIN SELECT RAISE(ABORT, 'log entries cannot be changed'); END`,
      `CREATE TRIGGER audit_no_delete BEFORE DELETE ON audit_log
        BEGIN SELECT RAISE(ABORT, 'log entries cannot be deleted'); END`,
      `CREATE TABLE auth_failures (
        id INTEGER PRIMARY KEY,
        kind TEXT NOT NULL,
        at TEXT NOT NULL
      )`,
      // Informal priority votes on HOA items. One vote per item per house number.
      `CREATE TABLE project_votes (
        project_id TEXT NOT NULL,
        house_number INTEGER NOT NULL,
        vote_type TEXT NOT NULL CHECK (vote_type IN ('up', 'down')),
        voted_at TEXT NOT NULL,
        PRIMARY KEY (project_id, house_number)
      )`
    ]
  }
];

let ready: Promise<void> | null = null;

async function currentVersion() {
  const results = await dbBatch([
    { sql: "CREATE TABLE IF NOT EXISTS schema_migrations (version INTEGER PRIMARY KEY, applied_at TEXT NOT NULL)" },
    { sql: "SELECT COALESCE(MAX(version), 0) AS version FROM schema_migrations" }
  ]);
  return Number(results[1].rows[0].version);
}

async function applyMigrations() {
  let version = await currentVersion();

  for (const migration of MIGRATIONS) {
    if (migration.version <= version) continue;

    try {
      await dbBatch([
        ...migration.statements.map((sql) => ({ sql })),
        {
          sql: "INSERT INTO schema_migrations (version, applied_at) VALUES (?, ?)",
          params: [migration.version, new Date().toISOString()]
        }
      ]);
      version = migration.version;
    } catch (error) {
      // Another copy of the site may have run the same step at the same moment. Check before failing.
      version = await currentVersion();
      if (version < migration.version) throw error;
    }
  }
}

/** Makes sure the tables exist. Checks once per server instance. */
export function ensureSchema() {
  if (!ready) {
    ready = applyMigrations().catch((error) => {
      ready = null;
      throw error;
    });
  }
  return ready;
}

export async function batch(statements: Statement[]): Promise<StatementResult[]> {
  await ensureSchema();
  try {
    return await dbBatch(statements);
  } catch (error) {
    // If the database file was replaced with an empty one while this server instance was running,
    // the tables are gone. Create them again and try once more.
    if (error instanceof PortalDataError && /no such table/i.test(error.message)) {
      ready = null;
      await ensureSchema();
      return dbBatch(statements);
    }
    throw error;
  }
}

export async function query<Row = Record<string, unknown>>(sql: string, params: SqlValue[] = []): Promise<Row[]> {
  const [result] = await batch([{ sql, params }]);
  return result.rows as Row[];
}

export async function run(sql: string, params: SqlValue[] = []): Promise<StatementResult> {
  const [result] = await batch([{ sql, params }]);
  return result;
}

/** A log row to add to the same batch as the change it describes. */
export function auditStatement(
  actor: { personId: number | null; name: string },
  action: string,
  target = "",
  detail = ""
): Statement {
  return {
    sql: "INSERT INTO audit_log (actor_id, actor_name, action, target, detail, created_at) VALUES (?, ?, ?, ?, ?, ?)",
    params: [actor.personId, actor.name, action, target, detail.slice(0, 500), new Date().toISOString()]
  };
}
