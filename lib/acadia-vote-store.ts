// Stores the informal priority votes in the Acadia portal database (the SQLite file on the
// board's own records server). See docs/acadia-voting.md.

import type { ProjectVoteCounts, VoteType } from "@/types/acadia";
import { batch, query } from "@/lib/acadia-portal/schema";

type CountRow = { project_id: string; up: number; down: number };

const COUNT_SQL = `
  SELECT project_id,
         SUM(CASE WHEN vote_type = 'up' THEN 1 ELSE 0 END) AS up,
         SUM(CASE WHEN vote_type = 'down' THEN 1 ELSE 0 END) AS down
  FROM project_votes`;

// Totals are kept in memory for a short time, so a busy page does not ask the home server for the
// same numbers over and over.
const CACHE_MS = 30 * 1000;
let cachedTotals: { at: number; counts: Record<string, ProjectVoteCounts> } | null = null;

function toCounts(row: CountRow | undefined): ProjectVoteCounts {
  const up = Number(row?.up || 0);
  const down = Number(row?.down || 0);
  return { up, down, net: up - down };
}

// When the home server does not answer, remember that for a short time. Visitors then get the
// "unavailable" note right away, without each one waiting for the same timeout.
let lastFailure: { at: number; error: unknown } | null = null;

export async function getAllStoredVoteCounts(): Promise<Record<string, ProjectVoteCounts>> {
  if (cachedTotals && Date.now() - cachedTotals.at < CACHE_MS) {
    return cachedTotals.counts;
  }
  if (lastFailure && Date.now() - lastFailure.at < CACHE_MS) {
    throw lastFailure.error;
  }

  let rows: CountRow[];
  try {
    rows = await query<CountRow>(`${COUNT_SQL} GROUP BY project_id`);
    lastFailure = null;
  } catch (error) {
    lastFailure = { at: Date.now(), error };
    throw error;
  }
  const counts: Record<string, ProjectVoteCounts> = {};
  for (const row of rows) {
    counts[row.project_id] = toCounts(row);
  }

  cachedTotals = { at: Date.now(), counts };
  return counts;
}

export async function getStoredVoteCounts(projectId: string): Promise<ProjectVoteCounts> {
  const rows = await query<CountRow>(`${COUNT_SQL} WHERE project_id = ? GROUP BY project_id`, [projectId]);
  return toCounts(rows[0]);
}

/** Saves a vote and returns the new totals for that item. A later vote from the same house replaces the earlier one. */
export async function storeVote(projectId: string, houseNumber: number, voteType: VoteType): Promise<ProjectVoteCounts> {
  const results = await batch([
    {
      sql: `INSERT INTO project_votes (project_id, house_number, vote_type, voted_at) VALUES (?, ?, ?, ?)
            ON CONFLICT(project_id, house_number) DO UPDATE SET vote_type = excluded.vote_type, voted_at = excluded.voted_at`,
      params: [projectId, houseNumber, voteType, new Date().toISOString()]
    },
    { sql: `${COUNT_SQL} WHERE project_id = ? GROUP BY project_id`, params: [projectId] }
  ]);

  cachedTotals = null;
  return toCounts(results[1].rows[0] as CountRow | undefined);
}
