// Sign-in for the owner portal.
//
// There are no passwords. A board member creates a private sign-in link for a person. The link
// works one time. Opening it starts a session that lasts 30 days on that device. The database
// stores only a hash of each link and session secret, so a copy of the database cannot be used
// to sign in as anyone.
//
// The first board member gets in with the ACADIA_ADMIN_KEY set in Vercel. The same key is the way
// back in if every board member loses access.

import { createHash, randomBytes, timingSafeEqual } from "node:crypto";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { cache } from "react";
import { isPortalConfigured, PortalDataError, PortalUnavailableError } from "@/lib/acadia-portal/db";
import { auditStatement, batch, query } from "@/lib/acadia-portal/schema";

const SESSION_DAYS = 30;
export const LINK_DAYS = 7;
const DAY_MS = 24 * 60 * 60 * 1000;
const ADMIN_FAILURE_LIMIT = 8;
const ADMIN_FAILURE_WINDOW_MS = 15 * 60 * 1000;

export type Viewer = {
  personId: number;
  sessionId: number;
  name: string;
  email: string;
  isBoard: boolean;
  homeId: number | null;
  houseNumber: string | null;
  street: string | null;
};

export type PortalState =
  | { status: "unconfigured" }
  | { status: "offline" }
  | { status: "anonymous" }
  | { status: "signed_in"; viewer: Viewer };

export function newToken() {
  return randomBytes(32).toString("base64url");
}

export function hashToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

function sameSecret(given: string, expected: string) {
  const a = createHash("sha256").update(given).digest();
  const b = createHash("sha256").update(expected).digest();
  return timingSafeEqual(a, b);
}

// On the live site the cookie uses the __Host- prefix, which browsers only accept over https and
// only for this exact site. On a plain http test server the prefix cannot be used.
async function sessionCookie() {
  const requestHeaders = await headers();
  const https = (requestHeaders.get("x-forwarded-proto") || "").split(",")[0].trim() === "https";
  return { name: https ? "__Host-acadia_session" : "acadia_session", secure: https };
}

/** The address of this site, used to build sign-in links. */
export async function siteOrigin() {
  if (process.env.ACADIA_SITE_URL) return process.env.ACADIA_SITE_URL.replace(/\/$/, "");
  const requestHeaders = await headers();
  const proto = (requestHeaders.get("x-forwarded-proto") || "http").split(",")[0].trim();
  const host = requestHeaders.get("x-forwarded-host") || requestHeaders.get("host") || "localhost:3000";
  return `${proto}://${host}`;
}

type SessionRow = {
  session_id: number;
  person_id: number;
  name: string;
  email: string;
  is_board: number;
  home_id: number | null;
  house_number: string | null;
  street: string | null;
};

/** Who is looking at this page. Checked once per request. A visitor with no cookie costs no database call. */
export const getPortalState = cache(async (): Promise<PortalState> => {
  if (!isPortalConfigured()) return { status: "unconfigured" };

  const { name } = await sessionCookie();
  const token = (await cookies()).get(name)?.value;
  if (!token) return { status: "anonymous" };

  const now = new Date();
  const nowIso = now.toISOString();
  const staleIso = new Date(now.getTime() - 60 * 60 * 1000).toISOString();
  const tokenHash = hashToken(token);

  try {
    const results = await batch([
      {
        sql: "UPDATE sessions SET last_seen_at = ? WHERE token_hash = ? AND ended_at IS NULL AND expires_at > ? AND last_seen_at < ?",
        params: [nowIso, tokenHash, nowIso, staleIso]
      },
      {
        sql: `SELECT s.id AS session_id, p.id AS person_id, p.name, p.email, p.is_board, p.home_id, h.house_number, h.street
              FROM sessions s
              JOIN people p ON p.id = s.person_id
              LEFT JOIN homes h ON h.id = p.home_id
              WHERE s.token_hash = ? AND s.ended_at IS NULL AND s.expires_at > ? AND p.disabled_at IS NULL`,
        params: [tokenHash, nowIso]
      }
    ]);
    const row = results[1].rows[0] as SessionRow | undefined;
    if (!row) return { status: "anonymous" };

    return {
      status: "signed_in",
      viewer: {
        personId: row.person_id,
        sessionId: row.session_id,
        name: row.name,
        email: row.email,
        isBoard: row.is_board === 1,
        homeId: row.home_id,
        houseNumber: row.house_number,
        street: row.street
      }
    };
  } catch (error) {
    if (error instanceof PortalUnavailableError) {
      return { status: error.reason === "unconfigured" ? "unconfigured" : "offline" };
    }
    throw error;
  }
});

/** For pages and actions that need a signed-in person. Sends everyone else to the sign-in page. */
export async function requireViewer(): Promise<Viewer> {
  const state = await getPortalState();
  if (state.status === "signed_in") return state.viewer;
  redirect("/Acadia/portal/sign-in");
}

export async function requireBoard(): Promise<Viewer> {
  const viewer = await requireViewer();
  if (!viewer.isBoard) redirect("/Acadia/portal/home");
  return viewer;
}

/** For owner pages. A board account with no home goes to the board tools instead. */
export async function requireHome(): Promise<Viewer & { homeId: number; houseNumber: string }> {
  const viewer = await requireViewer();
  if (viewer.homeId === null || viewer.houseNumber === null) redirect("/Acadia/portal/board");
  return viewer as Viewer & { homeId: number; houseNumber: string };
}

async function setSessionCookie(token: string) {
  const { name, secure } = await sessionCookie();
  (await cookies()).set(name, token, {
    httpOnly: true,
    secure,
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_DAYS * 24 * 60 * 60
  });
}

/** Makes a one-time sign-in link for a person. Returns the secret part, which is shown only once. */
export async function createSignInLink(personId: number, createdBy: Viewer) {
  const token = newToken();
  const now = new Date();
  await batch([
    {
      sql: `INSERT INTO sign_in_links (person_id, token_hash, created_by, created_at, expires_at)
            SELECT id, ?, ?, ?, ? FROM people WHERE id = ? AND disabled_at IS NULL`,
      params: [hashToken(token), createdBy.personId, now.toISOString(), new Date(now.getTime() + LINK_DAYS * DAY_MS).toISOString(), personId],
      expect: { changes: 1 }
    },
    {
      sql: `INSERT INTO audit_log (actor_id, actor_name, action, target, detail, created_at)
            SELECT ?, ?, 'Created a sign-in link', name, '', ? FROM people WHERE id = ?`,
      params: [createdBy.personId, createdBy.name, now.toISOString(), personId]
    }
  ]);
  return token;
}

/** Uses up a sign-in link and starts a session. Returns false when the link is used, expired, or unknown. */
export async function signInWithLinkToken(linkToken: string) {
  if (!/^[A-Za-z0-9_-]{20,200}$/.test(linkToken)) return false;

  const sessionToken = newToken();
  const now = new Date();
  const nowIso = now.toISOString();
  const linkHash = hashToken(linkToken);

  try {
    await batch([
      {
        sql: `UPDATE sign_in_links SET used_at = ?
              WHERE token_hash = ? AND used_at IS NULL AND expires_at > ?
                AND person_id IN (SELECT id FROM people WHERE disabled_at IS NULL)`,
        params: [nowIso, linkHash, nowIso],
        expect: { changes: 1 }
      },
      {
        sql: `INSERT INTO sessions (person_id, token_hash, created_at, expires_at, last_seen_at)
              SELECT person_id, ?, ?, ?, ? FROM sign_in_links WHERE token_hash = ?`,
        params: [hashToken(sessionToken), nowIso, new Date(now.getTime() + SESSION_DAYS * DAY_MS).toISOString(), nowIso, linkHash],
        expect: { changes: 1 }
      },
      {
        sql: `INSERT INTO audit_log (actor_id, actor_name, action, target, detail, created_at)
              SELECT p.id, p.name, 'Signed in with a link', '', '', ?
              FROM sign_in_links l JOIN people p ON p.id = l.person_id WHERE l.token_hash = ?`,
        params: [nowIso, linkHash]
      }
    ]);
  } catch (error) {
    if (error instanceof PortalDataError) return false;
    throw error;
  }

  await setSessionCookie(sessionToken);
  return true;
}

export async function signOutCurrentSession() {
  const { name } = await sessionCookie();
  const jar = await cookies();
  const token = jar.get(name)?.value;
  jar.delete(name);
  if (!token || !isPortalConfigured()) return;
  try {
    await batch([
      { sql: "UPDATE sessions SET ended_at = ? WHERE token_hash = ? AND ended_at IS NULL", params: [new Date().toISOString(), hashToken(token)] }
    ]);
  } catch (error) {
    // The cookie is already gone. If the records server is offline the session simply expires later.
    if (!(error instanceof PortalUnavailableError)) throw error;
  }
}

export type AdminSetupResult = "ok" | "no_key" | "locked" | "wrong_key";

/**
 * First-time setup and the way back in. Checks the admin key from Vercel, then signs the person in
 * as a board member. Wrong guesses are counted, and too many in a short time lock the page.
 */
export async function signInWithAdminKey(input: {
  adminKey: string;
  name: string;
  email: string;
  houseNumber: string;
}): Promise<AdminSetupResult> {
  const expected = process.env.ACADIA_ADMIN_KEY || "";
  if (expected.length < 24) return "no_key";

  const now = new Date();
  const nowIso = now.toISOString();
  const windowStart = new Date(now.getTime() - ADMIN_FAILURE_WINDOW_MS).toISOString();

  const failures = await query<{ total: number }>("SELECT COUNT(*) AS total FROM auth_failures WHERE kind = 'admin' AND at > ?", [windowStart]);
  if (Number(failures[0]?.total || 0) >= ADMIN_FAILURE_LIMIT) return "locked";

  if (!sameSecret(input.adminKey, expected)) {
    await batch([
      { sql: "INSERT INTO auth_failures (kind, at) VALUES ('admin', ?)", params: [nowIso] },
      { sql: "DELETE FROM auth_failures WHERE at < ?", params: [new Date(now.getTime() - 7 * DAY_MS).toISOString()] },
      auditStatement({ personId: null, name: "Unknown visitor" }, "Wrong admin key entered on the setup page")
    ]);
    return "wrong_key";
  }

  const sessionToken = newToken();
  const expires = new Date(now.getTime() + SESSION_DAYS * DAY_MS).toISOString();
  const statements = [];

  if (input.houseNumber) {
    statements.push({
      sql: "INSERT INTO homes (house_number, created_at) VALUES (?, ?) ON CONFLICT(house_number) DO NOTHING",
      params: [input.houseNumber, nowIso]
    });
  }

  // Reuse the board member's record when the same email is already on file.
  statements.push(
    {
      sql: `INSERT INTO people (home_id, name, email, is_board, created_at)
            SELECT (SELECT id FROM homes WHERE house_number = ?), ?, ?, 1, ?
            WHERE NOT EXISTS (SELECT 1 FROM people WHERE lower(email) = lower(?) AND is_board = 1 AND disabled_at IS NULL)`,
      params: [input.houseNumber, input.name, input.email, nowIso, input.email]
    },
    {
      sql: `INSERT INTO sessions (person_id, token_hash, created_at, expires_at, last_seen_at)
            SELECT id, ?, ?, ?, ? FROM people
            WHERE lower(email) = lower(?) AND is_board = 1 AND disabled_at IS NULL ORDER BY id LIMIT 1`,
      params: [hashToken(sessionToken), nowIso, expires, nowIso, input.email],
      expect: { changes: 1 }
    },
    auditStatement({ personId: null, name: input.name }, "Signed in as a board member with the admin key", input.email)
  );

  await batch(statements);
  await setSessionCookie(sessionToken);
  return "ok";
}
