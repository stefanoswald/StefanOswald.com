// Talks to the Acadia data service, which keeps the portal records in a SQLite file on a machine
// the board runs itself. See services/acadia-data/README.md.
//
// ACADIA_DATA_URL  the https address of the data service (the tunnel address)
// ACADIA_DATA_KEY  the shared secret, the same value the data service was started with
//
// Server code only. Never import this from a client component.

export type SqlValue = string | number | null;

export type Statement = {
  sql: string;
  params?: SqlValue[];
  /** Roll the whole batch back unless this statement changes exactly this many rows. */
  expect?: { changes: number };
};

export type StatementResult<Row = Record<string, unknown>> = {
  rows: Row[];
  changes: number;
  lastInsertRowid: number;
};

/** The portal has no database address yet, or the home server cannot be reached. */
export class PortalUnavailableError extends Error {
  constructor(public reason: "unconfigured" | "offline", message: string) {
    super(message);
    this.name = "PortalUnavailableError";
  }
}

/** The database refused the request, for example a duplicate house number. */
export class PortalDataError extends Error {
  constructor(public code: string, message: string) {
    super(message);
    this.name = "PortalDataError";
  }
}

const TIMEOUT_MS = Number(process.env.ACADIA_DATA_TIMEOUT_MS || 8000);

let warnedAboutPlainHttp = false;

export function isPortalConfigured() {
  const url = process.env.ACADIA_DATA_URL || "";
  if (!url || !process.env.ACADIA_DATA_KEY) return false;

  // The key must never travel over plain http. The one exception is a test server on this machine.
  if (url.startsWith("https://") || /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?(\/|$)/.test(url)) return true;

  if (!warnedAboutPlainHttp) {
    warnedAboutPlainHttp = true;
    console.error("ACADIA_DATA_URL must start with https://. The portal stays off until it does.");
  }
  return false;
}

function serviceUrl(path: string) {
  return `${(process.env.ACADIA_DATA_URL || "").replace(/\/$/, "")}${path}`;
}

/** Runs the statements in one transaction. All of them succeed or none do. */
export async function dbBatch(statements: Statement[]): Promise<StatementResult[]> {
  if (!isPortalConfigured()) {
    throw new PortalUnavailableError("unconfigured", "The portal database is not set up yet.");
  }

  let response: Response;
  try {
    response = await fetch(serviceUrl("/v1/batch"), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.ACADIA_DATA_KEY}`
      },
      body: JSON.stringify({ statements }),
      cache: "no-store",
      signal: AbortSignal.timeout(TIMEOUT_MS)
    });
  } catch (error) {
    console.error("Acadia data service unreachable", error instanceof Error ? error.message : error);
    throw new PortalUnavailableError("offline", "The records server could not be reached.");
  }

  let payload: { results?: StatementResult[]; error?: { code?: string; message?: string } } | null = null;
  try {
    payload = await response.json();
  } catch {
    payload = null;
  }

  if (response.ok && payload?.results) {
    return payload.results;
  }

  const code = payload?.error?.code || "";
  const message = payload?.error?.message || `The records server answered with status ${response.status}.`;

  // A wrong key, a tunnel error page, or a server fault all mean the portal cannot work right now.
  if (!payload?.error || response.status === 401 || response.status >= 500) {
    console.error("Acadia data service error", response.status, code, message);
    throw new PortalUnavailableError("offline", "The records server could not be used.");
  }

  throw new PortalDataError(code, message);
}

export async function dbQuery<Row = Record<string, unknown>>(sql: string, params: SqlValue[] = []): Promise<Row[]> {
  const [result] = await dbBatch([{ sql, params }]);
  return result.rows as Row[];
}

export async function dbRun(sql: string, params: SqlValue[] = []): Promise<StatementResult> {
  const [result] = await dbBatch([{ sql, params }]);
  return result;
}

export type DataServiceStatus = {
  ok: boolean;
  sqlite: string;
  node: string;
  databaseBytes: number;
  backups: number;
  lastBackup: string | null;
  uptimeSeconds: number;
};

async function serviceCall<T>(path: string, method: "GET" | "POST"): Promise<T> {
  if (!isPortalConfigured()) {
    throw new PortalUnavailableError("unconfigured", "The portal database is not set up yet.");
  }
  try {
    const response = await fetch(serviceUrl(path), {
      method,
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${process.env.ACADIA_DATA_KEY}` },
      body: method === "POST" ? "{}" : undefined,
      cache: "no-store",
      signal: AbortSignal.timeout(TIMEOUT_MS)
    });
    if (!response.ok) throw new Error(`status ${response.status}`);
    return (await response.json()) as T;
  } catch (error) {
    console.error("Acadia data service call failed", path, error instanceof Error ? error.message : error);
    throw new PortalUnavailableError("offline", "The records server could not be reached.");
  }
}

/** Size, uptime, and last backup of the records server. */
export function dbStatus() {
  return serviceCall<DataServiceStatus>("/v1/status", "GET");
}

/** Asks the records server to write a backup copy now. */
export function dbBackup() {
  return serviceCall<{ ok: boolean; backup: string }>("/v1/backup", "POST");
}
