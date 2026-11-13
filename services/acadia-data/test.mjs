// Tests for the Acadia data service. Run with: node --test services/acadia-data/test.mjs
// They start the real service on a spare port with a throwaway folder and a made-up key.

import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { mkdtempSync, readdirSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const KEY = "test-key-test-key-test-key-test-key-0123456789";
const PORT = 18000 + Math.floor(Math.random() * 1000);
const BASE = `http://127.0.0.1:${PORT}`;
const dataDir = mkdtempSync(join(tmpdir(), "acadia-data-test-"));
let child;

async function call(path, { method = "POST", body, key = KEY } = {}) {
  const response = await fetch(`${BASE}${path}`, {
    method,
    headers: { "Content-Type": "application/json", ...(key ? { Authorization: `Bearer ${key}` } : {}) },
    body: body === undefined ? undefined : JSON.stringify(body)
  });
  return { status: response.status, json: await response.json() };
}

const batch = (statements, options) => call("/v1/batch", { body: { statements }, ...options });

before(async () => {
  child = spawn(process.execPath, [join(here, "server.mjs")], {
    env: { ...process.env, ACADIA_DATA_KEY: KEY, ACADIA_DATA_DIR: dataDir, PORT: String(PORT), HOST: "127.0.0.1" },
    stdio: "ignore"
  });
  for (let attempt = 0; attempt < 50; attempt += 1) {
    try {
      const response = await fetch(`${BASE}/health`);
      if (response.ok) return;
    } catch {
      // Not up yet.
    }
    await new Promise((done) => setTimeout(done, 100));
  }
  throw new Error("The data service did not start.");
});

after(() => {
  child?.kill("SIGTERM");
  rmSync(dataDir, { recursive: true, force: true });
});

test("health needs no key and says little", async () => {
  const { status, json } = await call("/health", { method: "GET", key: "" });
  assert.equal(status, 200);
  assert.deepEqual(json, { ok: true, service: "acadia-data" });
});

test("a missing or wrong key is refused", async () => {
  assert.equal((await batch([{ sql: "SELECT 1" }], { key: "" })).status, 401);
  assert.equal((await batch([{ sql: "SELECT 1" }], { key: "wrong-key-wrong-key-wrong-key-wrong-key" })).status, 401);
  assert.equal((await call("/v1/status", { method: "GET", key: "" })).status, 401);
});

test("statements run, bind values, and report changes", async () => {
  const created = await batch([{ sql: "CREATE TABLE things (id INTEGER PRIMARY KEY, name TEXT NOT NULL UNIQUE, cents INTEGER NOT NULL)" }]);
  assert.equal(created.status, 200);

  const inserted = await batch([
    { sql: "INSERT INTO things (name, cents) VALUES (?, ?)", params: ["dues", 103500] },
    { sql: "INSERT INTO things (name, cents) VALUES (?, ?)", params: ["fee", 2500] },
    { sql: "SELECT name, cents, typeof(cents) AS kind FROM things ORDER BY id" }
  ]);
  assert.equal(inserted.status, 200);
  assert.equal(inserted.json.results[0].changes, 1);
  assert.equal(inserted.json.results[0].lastInsertRowid, 1);
  assert.equal(inserted.json.results[1].lastInsertRowid, 2);
  assert.deepEqual(inserted.json.results[2].rows, [
    { name: "dues", cents: 103500, kind: "integer" },
    { name: "fee", cents: 2500, kind: "integer" }
  ]);
  assert.equal(inserted.json.results[2].changes, 0);
});

test("a failed statement rolls back the whole batch", async () => {
  const failed = await batch([
    { sql: "INSERT INTO things (name, cents) VALUES (?, ?)", params: ["rolled back", 1] },
    { sql: "INSERT INTO things (name, cents) VALUES (?, ?)", params: ["dues", 2] }
  ]);
  assert.equal(failed.status, 409);
  assert.equal(failed.json.error.code, "constraint");

  const check = await batch([{ sql: "SELECT count(*) AS total FROM things" }]);
  assert.equal(check.json.results[0].rows[0].total, 2);
});

test("an unmet expectation rolls back the whole batch", async () => {
  const failed = await batch([
    { sql: "INSERT INTO things (name, cents) VALUES (?, ?)", params: ["should vanish", 1] },
    { sql: "UPDATE things SET cents = 0 WHERE name = ?", params: ["nobody"], expect: { changes: 1 } }
  ]);
  assert.equal(failed.status, 409);
  assert.equal(failed.json.error.code, "expectation_failed");

  const check = await batch([{ sql: "SELECT count(*) AS total FROM things WHERE name = 'should vanish'" }]);
  assert.equal(check.json.results[0].rows[0].total, 0);
});

test("statements that could reach other files are refused", async () => {
  for (const sql of [
    "ATTACH DATABASE '/tmp/other.db' AS other",
    "PRAGMA journal_mode = DELETE",
    "VACUUM INTO '/tmp/copy.db'",
    "  -- comment first\n ATTACH DATABASE '/tmp/other.db' AS other",
    "/* comment */ PRAGMA writable_schema = 1",
    "DETACH DATABASE main"
  ]) {
    const result = await batch([{ sql }]);
    assert.equal(result.status, 400, sql);
    assert.equal(result.json.error.code, "not_allowed", sql);
  }
});

test("only the first statement in a string runs", async () => {
  await batch([{ sql: "SELECT 1; DROP TABLE things" }]);
  const check = await batch([{ sql: "SELECT count(*) AS total FROM things" }]);
  assert.equal(check.status, 200);
});

test("bad input is refused", async () => {
  assert.equal((await batch([])).status, 400);
  assert.equal((await batch([{ sql: "" }])).status, 400);
  assert.equal((await batch([{ sql: "SELECT ?", params: [{ nested: true }] }])).status, 400);
  assert.equal((await batch([{ sql: "SELEC oops" }])).status, 400);
  assert.equal((await call("/v1/nothing", { body: {} })).status, 404);
});

test("triggers can make a table append-only", async () => {
  await batch([
    { sql: "CREATE TABLE log (id INTEGER PRIMARY KEY, note TEXT NOT NULL)" },
    { sql: "CREATE TRIGGER log_no_update BEFORE UPDATE ON log BEGIN SELECT RAISE(ABORT, 'log rows cannot be changed'); END" },
    { sql: "CREATE TRIGGER log_no_delete BEFORE DELETE ON log BEGIN SELECT RAISE(ABORT, 'log rows cannot be deleted'); END" },
    { sql: "INSERT INTO log (note) VALUES ('first')" }
  ]);
  assert.equal((await batch([{ sql: "UPDATE log SET note = 'changed'" }])).status, 409);
  assert.equal((await batch([{ sql: "DELETE FROM log" }])).status, 409);
  const check = await batch([{ sql: "SELECT note FROM log" }]);
  assert.deepEqual(check.json.results[0].rows, [{ note: "first" }]);
});

test("status and backup work", async () => {
  const backup = await call("/v1/backup", { body: {} });
  assert.equal(backup.status, 200);
  assert.match(backup.json.backup, /^acadia-\d{4}-\d{2}-\d{2}\.db$/);
  assert.ok(readdirSync(join(dataDir, "backups")).includes(backup.json.backup));

  const status = await call("/v1/status", { method: "GET" });
  assert.equal(status.status, 200);
  assert.equal(status.json.lastBackup, backup.json.backup);
  assert.ok(status.json.databaseBytes > 0);
});
