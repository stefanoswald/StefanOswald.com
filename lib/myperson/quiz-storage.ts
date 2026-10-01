import type { ResultResponse } from "./api";
import type { Answers } from "./types";

/**
 * Progress is kept in this browser tab only (sessionStorage), so a reload or a
 * quick app switch doesn't lose her place. It is never sent anywhere.
 */

export type QuizStep = { kind: "intro" } | { kind: "name" } | { kind: "question" } | { kind: "checking" } | { kind: "result" };

/** One question on her path, with the progress to show while it is on screen. */
export interface TrailStep {
  id: string;
  /** Null while the progress bar is hidden (the opening block). */
  progress: number | null;
}

export interface QuizSnapshot {
  version: string;
  step: QuizStep;
  trail: TrailStep[];
  answers: Answers;
  name: string;
  result: ResultResponse | null;
}

const KEY = "myperson_quiz";

export function loadSnapshot(version: string): QuizSnapshot | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.sessionStorage.getItem(KEY);
    if (!raw) return null;
    const snapshot = JSON.parse(raw) as QuizSnapshot;
    return snapshot.version === version ? snapshot : null;
  } catch {
    return null;
  }
}

export function saveSnapshot(snapshot: QuizSnapshot): void {
  try {
    window.sessionStorage.setItem(KEY, JSON.stringify(snapshot));
  } catch {
    // Storage can be blocked. The questionnaire still works, it just won't survive a reload.
  }
}
