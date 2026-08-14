import type { ProjectVoteCounts, VoteType } from "@/types/acadia";
import { getRequiredServerEnv } from "@/lib/acadia-rag/config";

type VoteRow = {
  project_id: string;
  vote_type: VoteType;
};

export async function getAllStoredVoteCounts(): Promise<Record<string, ProjectVoteCounts>> {
  const query = new URLSearchParams({ select: "project_id,vote_type" });
  const response = await fetch(`${getSupabaseRestUrl()}/acadia_project_votes?${query}`, {
    headers: getSupabaseHeaders(),
    cache: "no-store"
  });

  if (!response.ok) {
    throw new Error(`Supabase vote lookup failed: ${await response.text()}`);
  }

  const countsByProject: Record<string, ProjectVoteCounts> = {};

  for (const row of (await response.json()) as VoteRow[]) {
    const counts = countsByProject[row.project_id] || { up: 0, down: 0, net: 0 };
    counts[row.vote_type] += 1;
    counts.net = counts.up - counts.down;
    countsByProject[row.project_id] = counts;
  }

  return countsByProject;
}

export async function getStoredVoteCounts(projectId: string): Promise<ProjectVoteCounts> {
  const query = new URLSearchParams({
    select: "project_id,vote_type",
    project_id: `eq.${projectId}`
  });
  const response = await fetch(`${getSupabaseRestUrl()}/acadia_project_votes?${query}`, {
    headers: getSupabaseHeaders(),
    cache: "no-store"
  });

  if (!response.ok) {
    throw new Error(`Supabase vote lookup failed: ${await response.text()}`);
  }

  return countVotes((await response.json()) as VoteRow[]);
}

export async function storeVote(
  projectId: string,
  houseNumber: number,
  voteType: VoteType
): Promise<void> {
  const response = await fetch(
    `${getSupabaseRestUrl()}/acadia_project_votes?on_conflict=project_id,house_number`,
    {
      method: "POST",
      headers: {
        ...getSupabaseHeaders(),
        "Content-Type": "application/json",
        Prefer: "resolution=merge-duplicates,return=minimal"
      },
      body: JSON.stringify({
        project_id: projectId,
        house_number: houseNumber,
        vote_type: voteType,
        voted_at: new Date().toISOString()
      }),
      cache: "no-store"
    }
  );

  if (!response.ok) {
    throw new Error(`Supabase vote update failed: ${await response.text()}`);
  }
}

function countVotes(rows: VoteRow[]): ProjectVoteCounts {
  const up = rows.filter((row) => row.vote_type === "up").length;
  const down = rows.filter((row) => row.vote_type === "down").length;

  return { up, down, net: up - down };
}

function getSupabaseRestUrl() {
  return `${getRequiredServerEnv("SUPABASE_URL").replace(/\/$/, "")}/rest/v1`;
}

function getSupabaseHeaders() {
  const serviceRoleKey = getRequiredServerEnv("SUPABASE_SERVICE_ROLE_KEY");

  return {
    apikey: serviceRoleKey,
    Authorization: `Bearer ${serviceRoleKey}`
  };
}
