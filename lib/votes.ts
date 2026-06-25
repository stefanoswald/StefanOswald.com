"use client";

import type { ProjectVoteCounts, Vote, VoteType } from "@/types/acadia";

const STORAGE_KEY = "acadia-estates-votes";
const HOUSE_MIN = 8000;
const HOUSE_MAX = 8037;

export function isValidHouseNumber(value: string) {
  if (!/^\d+$/.test(value.trim())) {
    return false;
  }

  const houseNumber = Number(value);
  return houseNumber >= HOUSE_MIN && houseNumber <= HOUSE_MAX;
}

export function readVotes(): Vote[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Vote[]) : [];
  } catch {
    return [];
  }
}

export function writeVote(projectId: string, houseNumber: number, voteType: VoteType) {
  const votes = readVotes();
  const timestamp = new Date().toISOString();
  const existingIndex = votes.findIndex(
    (vote) => vote.projectId === projectId && vote.houseNumber === houseNumber
  );

  const nextVote: Vote = {
    projectId,
    houseNumber,
    voteType,
    timestamp
  };

  if (existingIndex >= 0) {
    votes[existingIndex] = nextVote;
  } else {
    votes.push(nextVote);
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(votes));
  return votes;
}

export function getProjectVoteCounts(projectId: string, votes: Vote[]): ProjectVoteCounts {
  const projectVotes = votes.filter((vote) => vote.projectId === projectId);
  const up = projectVotes.filter((vote) => vote.voteType === "up").length;
  const down = projectVotes.filter((vote) => vote.voteType === "down").length;

  return {
    up,
    down,
    net: up - down
  };
}
