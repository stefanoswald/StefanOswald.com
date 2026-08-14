"use client";

import { useEffect, useState } from "react";
import type { ProjectVoteCounts, VoteType } from "@/types/acadia";
import { fetchProjectVoteCounts, writeVote } from "@/lib/votes";
import { HouseNumberModal } from "@/components/HouseNumberModal";

type VoteButtonsProps = {
  projectId: string;
  projectTitle: string;
  compact?: boolean;
};

export function VoteButtons({ projectId, projectTitle, compact = false }: VoteButtonsProps) {
  const [counts, setCounts] = useState<ProjectVoteCounts | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pendingVote, setPendingVote] = useState<VoteType | null>(null);
  const [confirmation, setConfirmation] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    let isActive = true;

    fetchProjectVoteCounts(projectId)
      .then((nextCounts) => {
        if (!isActive) {
          return;
        }

        setCounts(nextCounts);
        setError("");
      })
      .catch((loadError: unknown) => {
        if (!isActive) {
          return;
        }

        setError("Live vote totals are temporarily unavailable.");
      })
      .finally(() => {
        if (isActive) {
          setIsLoading(false);
        }
      });

    return () => {
      isActive = false;
    };
  }, [projectId]);

  async function submitVote(houseNumber: number) {
    if (!pendingVote) {
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const nextCounts = await writeVote(projectId, houseNumber, pendingVote);
      setCounts(nextCounts);
      setPendingVote(null);
      setConfirmation(`Thank you. Your vote has been recorded for house ${houseNumber}.`);
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Your vote could not be recorded. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
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
          <div className="font-bold">{isLoading || !counts ? "-" : counts.up}</div>
          <div className="text-xs font-medium">Upvotes</div>
        </div>
        <div className="rounded-md bg-red-50 px-3 py-2 text-red-800">
          <div className="font-bold">{isLoading || !counts ? "-" : counts.down}</div>
          <div className="text-xs font-medium">Downvotes</div>
        </div>
        <div className="rounded-md bg-acadia-sky px-3 py-2 text-acadia-ink">
          <div className="font-bold">{isLoading || !counts ? "-" : counts.net}</div>
          <div className="text-xs font-medium">Net score</div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => {
            setPendingVote("up");
            setConfirmation("");
            setError("");
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
            setError("");
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

      {error && pendingVote === null && !compact ? (
        <p className="rounded-md bg-red-50 px-3 py-2 text-sm font-medium text-red-700">
          {error}
        </p>
      ) : null}

      <HouseNumberModal
        isOpen={pendingVote !== null}
        voteType={pendingVote}
        projectTitle={projectTitle}
        isSubmitting={isSubmitting}
        serverError={error}
        onClose={() => setPendingVote(null)}
        onSubmit={submitVote}
      />
    </div>
  );
}
