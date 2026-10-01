/**
 * Types for the Find My Person questionnaire (stefanoswald.com/MyPerson).
 *
 * You should not need to edit this file. Edit lib/myperson/questionnaire.ts instead.
 */

/** How much a question matters. */
export type Importance =
  /** Has at least one instant "not compatible" answer. Also counts toward the score. */
  | "dealbreaker"
  /** Counts a lot toward the score. Can have soft red flags. */
  | "strong"
  /** Counts a little toward the score. */
  | "nice"
  /** Never affects the result. */
  | "info";

export type QuestionType =
  /** Pick one answer. */
  | "single"
  /** Pick one point on a scale. Scored the same way as "single". */
  | "scale"
  /** Pick one or more answers (up to maxPicks). */
  | "multi";

export interface ChoiceConfig {
  /** Stable id. Keep it the same if you only change the wording. */
  id: string;
  /** What she sees. */
  label: string;
  /** How well this answer fits, from 0 (not at all) to 1 (perfect). Ignored on "info" questions. */
  score?: number;
  /** Picking this answer is a major incompatibility. Only allowed on "dealbreaker" questions. */
  dealbreaker?: boolean;
  /** A soft red flag. Too many flags means "not compatible" even without a dealbreaker. */
  flag?: boolean;
}

export interface QuestionConfig {
  /** Stable id. Keep it the same if you only change the wording. */
  id: string;
  /** Which section id this question belongs to. */
  section: string;
  type: QuestionType;
  importance: Importance;
  /** The question, written to her. */
  prompt: string;
  /** A small line under the question. */
  helper?: string;
  choices: ChoiceConfig[];
  /** "scale" only: labels for the left and right ends. */
  scaleLabels?: [string, string];
  /** "multi" only: the most answers she can pick. */
  maxPicks?: number;
  /** Only ask this question when an earlier answer is one of these choice ids. */
  showIf?: { question: string; anyOf: string[] };
  /** Replace the default weight for this question's importance level. */
  weight?: number;
  /** A note to yourself about why the question is scored this way. Never sent to her. */
  why?: string;
}

export interface ComboCondition {
  question: string;
  anyOf: string[];
}

/** A rule that looks at two or more answers together. */
export interface ComboRule {
  id: string;
  label: string;
  /** Every condition must match for the rule to fire. */
  when: ComboCondition[];
  effect: "dealbreaker" | "flag";
}

export interface SectionConfig {
  id: string;
  /** Small label shown above each question in this section. */
  title: string;
}

export interface Thresholds {
  /** Lowest score (0 to 100) that counts as compatible. */
  compatibleScore: number;
  /** Most soft red flags allowed. One more than this means "not compatible". */
  maxFlags: number;
}

export interface FlowConfig {
  /**
   * After a dealbreaker answer, the only questions still asked (then the final
   * question), so the goodbye does not arrive abruptly.
   */
  afterDealbreaker: string[];
  /** Everyone finishes on this question, including anyone whose path is cut short. */
  finalQuestion: string;
}

export interface QuestionnaireConfig {
  /** Bump this when you change questions or scoring. Resets any half-finished questionnaire. */
  version: string;
  flow: FlowConfig;
  /** Default weight for each importance level. */
  weights: Record<Importance, number>;
  thresholds: Thresholds;
  sections: SectionConfig[];
  questions: QuestionConfig[];
  combos: ComboRule[];
}

/* ------------------------------------------------------------------ */
/* Answers                                                              */
/* ------------------------------------------------------------------ */

/** One choice id, or several for "multi" questions. */
export type AnswerValue = string | string[];
export type Answers = Record<string, AnswerValue>;

/* ------------------------------------------------------------------ */
/* What the browser is allowed to see                                   */
/* ------------------------------------------------------------------ */

export interface PublicChoice {
  id: string;
  label: string;
}

export interface PublicQuestion {
  id: string;
  sectionTitle: string;
  type: QuestionType;
  prompt: string;
  helper?: string;
  choices: PublicChoice[];
  scaleLabels?: [string, string];
  maxPicks?: number;
}

export interface PublicQuestionnaire {
  version: string;
  questions: PublicQuestion[];
}

/* ------------------------------------------------------------------ */
/* Results (server only)                                                */
/* ------------------------------------------------------------------ */

export interface Hit {
  /** Question id or combo rule id. */
  id: string;
  label: string;
}

export interface Evaluation {
  result: "compatible" | "not_compatible";
  reason: "ok" | "dealbreaker" | "flags" | "score";
  /** 0 to 100. Never shown to her. */
  score: number;
  dealbreakers: Hit[];
  flags: Hit[];
}

/** Where she is in the questionnaire. Decided on the server. */
export interface FlowStep {
  /** The next question to show, or null when she is done. */
  next: string | null;
  /** 0 to 1 for the progress bar, or null while it stays hidden (the opening block). */
  progress: number | null;
}
