"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import type { VoteType } from "@/types/acadia";
import { isValidHouseNumber } from "@/lib/votes";

type HouseNumberModalProps = {
  isOpen: boolean;
  voteType: VoteType | null;
  projectTitle: string;
  onClose: () => void;
  onSubmit: (houseNumber: number) => void;
};

export function HouseNumberModal({
  isOpen,
  voteType,
  projectTitle,
  onClose,
  onSubmit
}: HouseNumberModalProps) {
  const [houseNumber, setHouseNumber] = useState("");
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setHouseNumber("");
      setError("");
      window.setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  if (!isOpen || !voteType) {
    return null;
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!isValidHouseNumber(houseNumber)) {
      setError("That house number is not listed as part of this HOA.");
      return;
    }

    onSubmit(Number(houseNumber));
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-acadia-ink/60 px-4 py-8"
      role="dialog"
      aria-modal="true"
      aria-labelledby="house-number-title"
    >
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-soft">
        <div className="mb-5">
          <p className="text-sm font-semibold uppercase tracking-wide text-acadia-leaf">
            {voteType === "up" ? "Thumbs up" : "Thumbs down"} for {projectTitle}
          </p>
          <h2 id="house-number-title" className="mt-2 text-2xl font-bold text-acadia-ink">
            What is your house number?
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            House numbers 8000 through 8037 are accepted. Each house can have one
            vote per item, and a new vote updates the previous one.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-700">House number</span>
            <input
              ref={inputRef}
              inputMode="numeric"
              pattern="[0-9]*"
              value={houseNumber}
              onChange={(event) => {
                setHouseNumber(event.target.value);
                setError("");
              }}
              className="w-full rounded-md border border-slate-300 px-4 py-3 text-lg text-acadia-ink outline-none ring-acadia-leaf transition focus:border-acadia-leaf focus:ring-2"
              placeholder="8000"
            />
          </label>

          {error ? (
            <p className="rounded-md bg-red-50 px-3 py-2 text-sm font-medium text-red-700">
              {error}
            </p>
          ) : null}

          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              className="rounded-md border border-slate-300 px-5 py-3 font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-md bg-acadia-leaf px-5 py-3 font-semibold text-white transition hover:bg-acadia-ink"
            >
              Record vote
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
