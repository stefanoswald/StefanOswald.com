// Acadia data service.
//
// This small program keeps the Acadia Estates portal records in one SQLite file on a machine the
// board runs itself. The website (on Vercel) cannot hold a database file, so it sends its
// questions here over HTTPS. Every request must carry the shared key.
//
// It has no dependencies. It needs Node 22.13 or newer (Node 24 is best).
//
//   ACADIA_DATA_KEY   required. A long random secret, at least 32 characters.
//   ACADIA_DATA_DIR   folder for the database and backups. Default: ./data
//   HOST              address to listen on. Default: 127.0.0.1
//   PORT              port to listen on. Default: 8787
//   BACKUP_KEEP_DAYS  how many daily backups to keep. Default: 30
//
// Endpoints:
//   GET  /health      no key needed. Says only that the service is up.
//   GET  /v1/status   database size, last backup, uptime.
//   POST /v1/batch    { statements: [{ sql, params, expect }] }. Runs them in one transaction.
//   POST /v1/backup   writes a backup copy now.

import { createServer } from "node:http";
import { DatabaseSync } from "node:sqlite";
import { createHash, timingSafeEqual } from "node:crypto";
import { existsSync, mkdirSync, readdirSync, statSync, unlinkSync } from "node:fs";
import { join, resolve } from "node:path";

const KEY = process.env.ACADIA_DATA_KEY || "";
const DATA_DIR = resolve(process.env.ACADIA_DATA_DIR || "./data");
const HOST = process.env.HOST || "127.0.0.1";
const PORT = Number(process.env.PORT || 8787);
const BACKUP_KEEP_DAYS = Math.max(1, Number(process.env.BACKUP_KEEP_DAYS || 30));

const MAX_BODY_BYTES = 1024 * 1024;
const MAX_STATEMENTS = 250;
const MAX_ROWS = 5000;
const MAX_PARAMS = 200;

// Only everyday statements are allowed. ATTACH, PRAGMA, and VACUUM are refused, so a request can
// never reach a file outside the one database.
const ALLOWED_KEYWORDS = new Set(["SELECT", "INSERT", "UPDATE", "DELETE", "REPLACE", "WITH", "CREATE", "ALTER", "DROP"]);

if (KEY.length < 32) {
  console.error("ACADIA_DATA_KEY is missing or shorter than 32 characters. The service will not start without it.");
  process.exit(1);
}

const keyDigest = createHash("sha256").update(KEY).digest();

mkdirSync(DATA_DIR, { recursive: true });
mkdirSync(join(DATA_DIR, "backups"), { recursive: true });

const DB_PATH = join(DATA_DIR, "acadia.db");
const db = new DatabaseSync(DB_PATH);
db.exec("PRAGMA journal_mode = WAL");
db.exec("PRAGMA synchronous = FULL");
db.exec("PRAGMA foreign_keys = ON");
db.exec("PRAGMA busy_timeout = 5000");

const totalChangesStatement = db.prepare("SELECT total_changes() AS total");
const lastRowStatement = db.prepare("SELECT last_insert_rowid() AS lastInsertRowid");
const startedAt = Date.now();

class RequestError extends Error {
  constructor(status, code, message, extra) {
    super(message);
    this.status = status;
    this.code = code;
    this.extra = extra;
  }
}

function keyMatches(header) {
  const match = /^Bearer\s+(.+)$/i.exec(header || "");
  if (!match) return false;
  const given = createHash("sha256").update(match[1].trim()).digest();
  return timingSafeEqual(given, keyDigest);
}

function leadingKeyword(sql) {
  let rest = sql;
  // Skip spaces and comments at the start.
  for (;;) {
    const before = rest;
    rest = rest.replace(/^\s+/, "");
    if (rest.startsWith("--")) {
      const end = rest.indexOf("\n");
      rest = end === -1 ? "" : rest.slice(end + 1);
    } else if (rest.startsWith("/*")) {
      const end = rest.indexOf("*/");
      rest = end === -1 ? "" : rest.slice(end + 2);
    }
    if (rest === before) break;
  }
  const match = /^[A-Za-z]+/.exec(rest);
  return match ? match[0].toUpperCase() : "";
}

function cleanParams(params, index) {
  if (params === undefined) return [];
  if (!Array.isArray(params) || params.length > MAX_PARAMS) {
    throw new RequestError(400, "bad_request", `Statement ${index + 1}: params must be a short list.`);
  }
  return params.map((value) => {
    if (value === null || typeof value === "string") return value;
    if (typeof value === "boolean") return value ? 1 : 0;
    if (typeof value === "number" && Number.isFinite(value)) return value;
    throw new RequestError(400, "bad_request", `Statement ${index + 1}: params may only hold text, numbers, or null.`);
  });
}

function runStatement(entry, index) {
  if (!entry || typeof entry.sql !== "string" || !entry.sql.trim()) {
    throw new RequestError(400, "bad_request", `Statement ${index + 1}: sql is missing.`);
  }
  const keyword = leadingKeyword(entry.sql);
  if (!ALLOWED_KEYWORDS.has(keyword)) {
    throw new RequestError(400, "not_allowed", `Statement ${index + 1}: ${keyword || "that kind of statement"} is not allowed.`);
  }
  const params = cleanParams(entry.params, index);

  // total_changes() before and after tells exactly how many rows this one statement changed.
  const changesBefore = Number(totalChangesStatement.get().total);

  let rows;
  try {
    rows = db.prepare(entry.sql).all(...params);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    const constraint = /constraint failed|cannot be changed|cannot be deleted/i.test(message);
    throw new RequestError(constraint ? 409 : 400, constraint ? "constraint" : "sql_error", `Statement ${index + 1}: ${message}`, {
      statement: index
    });
  }

  if (rows.length > MAX_ROWS) {
    throw new RequestError(400, "too_many_rows", `Statement ${index + 1}: more than ${MAX_ROWS} rows. Add a LIMIT.`);
  }

  const changes = Number(totalChangesStatement.get().total) - changesBefore;
  const result = {
    rows,
    changes,
    lastInsertRowid: changes > 0 ? Number(lastRowStatement.get().lastInsertRowid) : 0
  };

  if (entry.expect && typeof entry.expect.changes === "number" && result.changes !== entry.expect.changes) {
    throw new RequestError(409, "expectation_failed", `Statement ${index + 1}: expected ${entry.expect.changes} changed rows, got ${result.changes}.`, {
      statement: index
    });
  }

  return result;
}

function runBatch(statements) {
  if (!Array.isArray(statements) || statements.length === 0 || statements.length > MAX_STATEMENTS) {
    throw new RequestError(400, "bad_request", `statements must be a list of 1 to ${MAX_STATEMENTS} items.`);
  }

  db.exec("BEGIN IMMEDIATE");
  try {
    const results = statements.map(runStatement);
    db.exec("COMMIT");
    return results;
  } catch (error) {
    try {
      db.exec("ROLLBACK");
    } catch {
      // The transaction may already be closed. Nothing more to undo.
    }
    throw error;
  }
}

// ---- Backups ----

function backupName(date = new Date()) {
  const pad = (value) => String(value).padStart(2, "0");
  return `acadia-${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}.db`;
}

function listBackups() {
  return readdirSync(join(DATA_DIR, "backups"))
    .filter((name) => /^acadia-\d{4}-\d{2}-\d{2}\.db$/.test(name))
    .sort();
}

function writeBackup() {
  const name = backupName();
  const target = join(DATA_DIR, "backups", name);
  if (existsSync(target)) unlinkSync(target);
  // VACUUM INTO writes a clean, complete copy even while the database is in use.
  db.prepare("VACUUM INTO ?").run(target);

  const backups = listBackups();
  for (const old of backups.slice(0, Math.max(0, backups.length - BACKUP_KEEP_DAYS))) {
    unlinkSync(join(DATA_DIR, "backups", old));
  }
  return name;
}

function backupIfDue() {
  try {
    if (!existsSync(join(DATA_DIR, "backups", backupName()))) {
      const name = writeBackup();
      console.log(`${new Date().toISOString()} backup written: ${name}`);
    }
  } catch (error) {
    console.error(`${new Date().toISOString()} backup failed:`, error instanceof Error ? error.message : error);
  }
}

// ---- HTTP ----

function readBody(request) {
  return new Promise((resolveBody, rejectBody) => {
    let size = 0;
    const chunks = [];
    request.on("data", (chunk) => {
      size += chunk.length;
      if (size > MAX_BODY_BYTES) {
        rejectBody(new RequestError(413, "too_large", "The request is too large."));
        request.destroy();
        return;
      }
      chunks.push(chunk);
    });
    request.on("end", () => {
      try {
        resolveBody(JSON.parse(Buffer.concat(chunks).toString("utf8") || "{}"));
      } catch {
        rejectBody(new RequestError(400, "bad_request", "The request body is not valid JSON."));
      }
    });
    request.on("error", () => rejectBody(new RequestError(400, "bad_request", "The request could not be read.")));
  });
}

function send(response, status, payload) {
  const body = JSON.stringify(payload);
  response.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Content-Length": Buffer.byteLength(body),
    "Cache-Control": "no-store",
    "X-Content-Type-Options": "nosniff"
  });
  response.end(body);
}

const sleep = (ms) => new Promise((done) => setTimeout(done, ms));

async function handle(request, response) {
  const started = Date.now();
  const path = (request.url || "/").split("?")[0];
  let status = 200;
  let detail = "";

  try {
    if (request.method === "GET" && path === "/health") {
      send(response, 200, { ok: true, service: "acadia-data" });
      return;
    }

    if (!keyMatches(request.headers.authorization)) {
      // A short pause makes guessing slow. The key is far too long to guess anyway.
      await sleep(300);
      throw new RequestError(401, "unauthorized", "A valid key is required.");
    }

    if (request.method === "GET" && path === "/v1/status") {
      const backups = listBackups();
      send(response, 200, {
        ok: true,
        sqlite: db.prepare("SELECT sqlite_version() AS version").get().version,
        node: process.version,
        databaseBytes: existsSync(DB_PATH) ? statSync(DB_PATH).size : 0,
        backups: backups.length,
        lastBackup: backups[backups.length - 1] || null,
        uptimeSeconds: Math.round((Date.now() - startedAt) / 1000)
      });
      return;
    }

    if (request.method === "POST" && path === "/v1/batch") {
      const body = await readBody(request);
      const results = runBatch(body.statements);
      detail = `${results.length} statements`;
      send(response, 200, { results });
      return;
    }

    if (request.method === "POST" && path === "/v1/backup") {
      const name = writeBackup();
      detail = name;
      send(response, 200, { ok: true, backup: name });
      return;
    }

    throw new RequestError(404, "not_found", "No such endpoint.");
  } catch (error) {
    if (error instanceof RequestError) {
      status = error.status;
      detail = error.code;
      send(response, error.status, { error: { code: error.code, message: error.message, ...error.extra } });
    } else {
      status = 500;
      detail = "server_error";
      console.error(error);
      send(response, 500, { error: { code: "server_error", message: "The data service hit an unexpected error." } });
    }
  } finally {
    // The log never includes SQL values, since they can hold names and balances.
    if (path !== "/health") {
      console.log(`${new Date().toISOString()} ${request.method} ${path} ${status} ${Date.now() - started}ms ${detail}`);
    }
  }
}

const server = createServer((request, response) => {
  handle(request, response).catch((error) => {
    console.error(error);
    if (!response.headersSent) send(response, 500, { error: { code: "server_error", message: "Unexpected error." } });
  });
});

server.requestTimeout = 30_000;
server.headersTimeout = 15_000;

server.listen(PORT, HOST, () => {
  console.log(`${new Date().toISOString()} acadia-data listening on http://${HOST}:${PORT}`);
  console.log(`${new Date().toISOString()} database file: ${DB_PATH}`);
  backupIfDue();
});

const backupTimer = setInterval(backupIfDue, 60 * 60 * 1000);
backupTimer.unref();

function shutdown() {
  console.log(`${new Date().toISOString()} shutting down`);
  server.close(() => {
    try {
      db.close();
    } finally {
      process.exit(0);
    }
  });
  setTimeout(() => process.exit(0), 5000).unref();
}

process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);
