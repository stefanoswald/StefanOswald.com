import { NextResponse } from "next/server";
import { acadiaProjects } from "@/data/acadiaProjects";
import {
  getAllStoredVoteCounts,
  getStoredVoteCounts,
  storeVote
} from "@/lib/acadia-vote-store";
import { visitorKeyFromRequest } from "@/lib/acadia-rag/rate-limit";
import { isValidHouseNumber } from "@/lib/votes";
import type { VoteType } from "@/types/acadia";

export const dynamic = "force-dynamic";

const projectIds = new Set(acadiaProjects.map((project) => project.id));

// A small speed bump so a script cannot flood the home server with votes. It lives in the memory
// of one server instance, like the chat limit.
const VOTE_WINDOW_MS = 5 * 60 * 1000;
const MAX_VOTES_PER_WINDOW = 40;
const recentVotes = new Map<string, number[]>();

function voteAllowed(visitorKey: string, now = Date.now()) {
  const recent = (recentVotes.get(visitorKey) || []).filter((time) => now - time < VOTE_WINDOW_MS);
  if (recent.length >= MAX_VOTES_PER_WINDOW) {
    recentVotes.set(visitorKey, recent);
    return false;
  }
  recent.push(now);
  recentVotes.set(visitorKey, recent);
  if (recentVotes.size > 2000) {
    for (const [key, times] of recentVotes) {
      if (!times.some((time) => now - time < VOTE_WINDOW_MS)) recentVotes.delete(key);
    }
  }
  return true;
}

export async function GET(request: Request) {
  const projectId = new URL(request.url).searchParams.get("projectId") || "";

  if (projectId && !projectIds.has(projectId)) {
    return jsonError("That HOA item could not be found.", 404);
  }

  try {
    return NextResponse.json(
      projectId
        ? { counts: await getStoredVoteCounts(projectId) }
        : { countsByProject: await getAllStoredVoteCounts() },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch (error) {
    console.error("Unable to load Acadia vote totals", error);
    return NextResponse.json(
      {
        error: "Vote totals are temporarily unavailable."
      },
      { status: 503, headers: { "Cache-Control": "no-store" } }
    );
  }
}

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return jsonError("The vote request was not valid.", 400);
  }

  const { projectId, houseNumber, voteType } = parseVoteBody(body);

  if (!projectIds.has(projectId)) {
    return jsonError("That HOA item could not be found.", 404);
  }

  if (!isValidHouseNumber(houseNumber)) {
    return jsonError("That house number is not listed as part of this HOA.", 400);
  }

  if (voteType !== "up" && voteType !== "down") {
    return jsonError("Please choose thumbs up or thumbs down.", 400);
  }

  if (!voteAllowed(visitorKeyFromRequest(request))) {
    return jsonError("That is a lot of votes in a short time. Please wait a few minutes and try again.", 429);
  }

  try {
    return NextResponse.json(
      { counts: await storeVote(projectId, Number(houseNumber), voteType) },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch (error) {
    console.error("Unable to store Acadia vote", error);
    return jsonError("Your vote could not be recorded. Please try again.", 503);
  }
}

function parseVoteBody(body: unknown): {
  projectId: string;
  houseNumber: string | number;
  voteType: VoteType | "";
} {
  if (!body || typeof body !== "object") {
    return { projectId: "", houseNumber: "", voteType: "" };
  }

  const record = body as Record<string, unknown>;

  return {
    projectId: typeof record.projectId === "string" ? record.projectId : "",
    houseNumber:
      typeof record.houseNumber === "string" || typeof record.houseNumber === "number"
        ? record.houseNumber
        : "",
    voteType:
      record.voteType === "up" || record.voteType === "down" ? record.voteType : ""
  };
}

function jsonError(error: string, status: number) {
  return NextResponse.json(
    { error },
    { status, headers: { "Cache-Control": "no-store" } }
  );
}
