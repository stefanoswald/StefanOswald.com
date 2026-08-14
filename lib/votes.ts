import type { ProjectVoteCounts, VoteType } from "@/types/acadia";

export const HOUSE_MIN = 8000;
export const HOUSE_MAX = 8039;

type VoteApiResponse = {
  counts?: ProjectVoteCounts;
  countsByProject?: Record<string, ProjectVoteCounts>;
  error?: string;
};

let cachedVoteCounts: Record<string, ProjectVoteCounts> | null = null;
let voteCountsRequest: Promise<Record<string, ProjectVoteCounts>> | null = null;

export function isValidHouseNumber(value: string | number) {
  const normalized = String(value).trim();

  if (!/^\d+$/.test(normalized)) {
    return false;
  }

  const houseNumber = Number(normalized);
  return houseNumber >= HOUSE_MIN && houseNumber <= HOUSE_MAX;
}

export function emptyVoteCounts(): ProjectVoteCounts {
  return { up: 0, down: 0, net: 0 };
}

export async function fetchProjectVoteCounts(projectId: string): Promise<ProjectVoteCounts> {
  if (cachedVoteCounts) {
    return cachedVoteCounts[projectId] || emptyVoteCounts();
  }

  if (!voteCountsRequest) {
    voteCountsRequest = fetch("/api/acadia/votes", { cache: "no-store" })
      .then(async (response) => {
        const payload = (await response.json()) as VoteApiResponse;

        if (!response.ok || !payload.countsByProject) {
          throw new Error(payload.error || "Vote totals are temporarily unavailable.");
        }

        cachedVoteCounts = payload.countsByProject;
        return payload.countsByProject;
      })
      .catch((error) => {
        voteCountsRequest = null;
        throw error;
      });
  }

  const countsByProject = await voteCountsRequest;
  return countsByProject[projectId] || emptyVoteCounts();
}

export async function writeVote(
  projectId: string,
  houseNumber: number,
  voteType: VoteType
): Promise<ProjectVoteCounts> {
  const response = await fetch("/api/acadia/votes", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ projectId, houseNumber, voteType })
  });
  const payload = (await response.json()) as VoteApiResponse;

  if (!response.ok || !payload.counts) {
    throw new Error(payload.error || "Your vote could not be recorded. Please try again.");
  }

  cachedVoteCounts = {
    ...(cachedVoteCounts || {}),
    [projectId]: payload.counts
  };

  return payload.counts;
}
