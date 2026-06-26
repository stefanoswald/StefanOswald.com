"use client";

import { useEffect, useMemo, useState } from "react";
import type { ProjectVoteCounts, Vote, VoteType } from "@/types/acadia";
import { getProjectVoteCounts, readVotes, writeVote } from "@/lib/votes";
import { HouseNumberModal } from "@/components/HouseNumberModal";

type VoteButtonsProps = {
  projectId: string;
  projectTitle: string;
  compact?: boolean;
};

export function VoteButtons({ projectId, projectTitle, compact = false }: VoteButtonsProps) {
  const [votes, setVotes] = useState<Vote[]>([]);
  const [pendingVote, setPendingVote] = useState<VoteType | null>(null);
  const [confirmation, setConfirmation] = useState("");

  useEffect(() => {
    setVotes(readVotes());
  }, []);

  const counts: ProjectVoteCounts = useMemo(
    () => getProjectVoteCounts(projectId, votes),
    [projectId, votes]
  );

  function submitVote(houseNumber: number) {
    if (!pendingVote) {
      return;
    }

    const nextVotes = writeVote(projectId, houseNumber, pendingVote);
    setVotes(nextVotes);
    setPendingVote(null);
    setConfirmation(`Thank you. Your vote has been recorded for house ${houseNumber}.`);
  }

  return (
    <div className="space-y-3">
      <div
        className={
          compact
            ? "grid grid-cols-3 gap-2 text-center text-sm"
            : "grid grid-cols-3 gap-3 text-center"
        }
      >
        <div className="rounded-md bg-emerald-50 px-3 py-2 text-emerald-800">
          <div className="font-bold">{counts.up}</div>
          <div className="text-xs font-medium">Upvotes</div>
        </div>
        <div className="rounded-md bg-red-50 px-3 py-2 text-red-800">
          <div className="font-bold">{counts.down}</div>
          <div className="text-xs font-medium">Downvotes</div>
        </div>
        <div className="rounded-md bg-acadia-sky px-3 py-2 text-acadia-ink">
          <div className="font-bold">{counts.net}</div>
          <div className="text-xs font-medium">Net score</div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => {
            setPendingVote("up");
            setConfirmation("");
          }}
          className="flex items-center justify-center gap-2 rounded-md bg-emerald-600 px-4 py-3 text-base font-bold text-white transition hover:bg-emerald-700"
          aria-label={`Thumbs up for ${projectTitle}`}
        >
          <span aria-hidden="true" className="text-2xl leading-none">
            👍
          </span>
          <span>Upvote</span>
        </button>
        <button
          type="button"
          onClick={() => {
            setPendingVote("down");
            setConfirmation("");
          }}
          className="flex items-center justify-center gap-2 rounded-md bg-red-600 px-4 py-3 text-base font-bold text-white transition hover:bg-red-700"
          aria-label={`Thumbs down for ${projectTitle}`}
        >
          <span aria-hidden="true" className="text-2xl leading-none">
            👎
          </span>
          <span>Downvote</span>
        </button>
      </div>

      {confirmation ? (
        <p className="rounded-md bg-acadia-sky px-3 py-2 text-sm font-medium text-acadia-ink">
          {confirmation}
        </p>
      ) : null}

      <HouseNumberModal
        isOpen={pendingVote !== null}
        voteType={pendingVote}
        projectTitle={projectTitle}
        onClose={() => setPendingVote(null)}
        onSubmit={submitVote}
      />
    </div>
  );
}
