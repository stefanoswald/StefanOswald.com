/**
 * The compatibility engine for Find My Person. Pure functions, no side effects.
 * The questionnaire is passed in, so this file never ships it anywhere by itself.
 *
 * Two jobs:
 *  1. The flow: which question comes next (planNext, walkFlow).
 *  2. The verdict: how a finished set of answers scores (evaluate, assess).
 */
import type {
  AnswerValue,
  Answers,
  ChoiceConfig,
  Evaluation,
  FlowStep,
  Hit,
  PublicQuestionnaire,
  QuestionConfig,
  QuestionnaireConfig
} from "./types";

/** How a path was shortened. "short": a dealbreaker came up. "final": a match became impossible. */
export type CutShort = "short" | "final" | null;

function humanize(id: string): string {
  const text = id.replace(/_/g, " ");
  return text.charAt(0).toUpperCase() + text.slice(1);
}

function weightOf(config: QuestionnaireConfig, q: QuestionConfig): number {
  return q.weight ?? config.weights[q.importance];
}

function isScored(config: QuestionnaireConfig, q: QuestionConfig): boolean {
  return q.importance !== "info" && weightOf(config, q) > 0;
}

function pickedChoices(q: QuestionConfig, value: AnswerValue | undefined): ChoiceConfig[] {
  if (value === undefined) return [];
  const ids = Array.isArray(value) ? value : [value];
  return ids
    .map((id) => q.choices.find((c) => c.id === id))
    .filter((c): c is ChoiceConfig => Boolean(c));
}

/** The best score any single answer to this question can earn. */
function bestScore(q: QuestionConfig): number {
  return q.choices.reduce((best, c) => (c.dealbreaker ? best : Math.max(best, clamp01(c.score ?? 0))), 0);
}

function answerMatches(value: AnswerValue | undefined, anyOf: string[]): boolean {
  if (value === undefined) return false;
  const picked = Array.isArray(value) ? value : [value];
  return picked.some((id) => anyOf.includes(id));
}

/** Questions with a `showIf` are only asked when the earlier answer matches. */
function isActive(q: QuestionConfig, answers: Answers): boolean {
  if (!q.showIf) return true;
  return answerMatches(answers[q.showIf.question], q.showIf.anyOf);
}

/* ------------------------------------------------------------------ */
/* Tally: the raw numbers behind a verdict                              */
/* ------------------------------------------------------------------ */

interface Tally {
  earned: number; // weighted points earned
  answeredWeight: number; // weight of the scored questions she answered
  dealbreakers: Hit[];
  flags: Hit[];
}

/** Only questions that were actually asked (present in `answers`) count. */
function tally(config: QuestionnaireConfig, answers: Answers): Tally {
  const asked = config.questions.filter((q) => answers[q.id] !== undefined && isActive(q, answers));
  const askedIds = new Set(asked.map((q) => q.id));
  const result: Tally = { earned: 0, answeredWeight: 0, dealbreakers: [], flags: [] };

  for (const q of asked) {
    const picked = pickedChoices(q, answers[q.id]);

    for (const choice of picked) {
      const hit = { id: q.id, label: `${humanize(q.id)}: ${choice.label}` };
      if (choice.dealbreaker && q.importance === "dealbreaker") result.dealbreakers.push(hit);
      if (choice.flag && q.importance !== "info") result.flags.push(hit);
    }

    if (!isScored(config, q) || picked.length === 0) continue;
    const weight = weightOf(config, q);
    const points =
      picked.reduce((sum, c) => sum + (c.dealbreaker ? 0 : clamp01(c.score ?? 0)), 0) / picked.length;
    result.earned += weight * points;
    result.answeredWeight += weight;
  }

  for (const rule of config.combos) {
    const fires = rule.when.every(
      (cond) => askedIds.has(cond.question) && answerMatches(answers[cond.question], cond.anyOf)
    );
    if (!fires) continue;
    const hit = { id: rule.id, label: rule.label };
    if (rule.effect === "dealbreaker") result.dealbreakers.push(hit);
    else result.flags.push(hit);
  }

  return result;
}

/* ------------------------------------------------------------------ */
/* The verdict                                                          */
/* ------------------------------------------------------------------ */

/** Score the answers she gave. Questions she was never asked do not count either way. */
export function evaluate(config: QuestionnaireConfig, answers: Answers): Evaluation {
  const { thresholds } = config;
  const t = tally(config, answers);
  const score = t.answeredWeight > 0 ? Math.round((100 * t.earned) / t.answeredWeight) : 0;
  const base = { score, dealbreakers: t.dealbreakers, flags: t.flags };

  if (t.dealbreakers.length > 0) return { ...base, result: "not_compatible", reason: "dealbreaker" };
  if (t.flags.length > thresholds.maxFlags) return { ...base, result: "not_compatible", reason: "flags" };
  if (score < thresholds.compatibleScore) return { ...base, result: "not_compatible", reason: "score" };
  return { ...base, result: "compatible", reason: "ok" };
}

/* ------------------------------------------------------------------ */
/* The flow                                                             */
/* ------------------------------------------------------------------ */

/**
 * Could these answers still end in a match if every question left were answered
 * as well as possible? False means there is no point asking the rest.
 */
function matchStillPossible(config: QuestionnaireConfig, t: Tally, open: QuestionConfig[]): boolean {
  if (t.dealbreakers.length > 0) return false;
  if (t.flags.length > config.thresholds.maxFlags) return false;

  let earned = t.earned;
  let weight = t.answeredWeight;
  for (const q of open) {
    if (!isScored(config, q)) continue;
    earned += weightOf(config, q) * bestScore(q);
    weight += weightOf(config, q);
  }
  if (weight === 0) return true;
  return Math.round((100 * earned) / weight) >= config.thresholds.compatibleScore;
}

interface Plan {
  next: QuestionConfig | null;
  /** Still inside the opening block of dealbreaker questions. */
  inBlock: boolean;
  /** Questions left on the current path, counting `next`. */
  remaining: number;
  cutShort: CutShort;
}

/**
 * The next question, given the answers so far.
 *  1. Every dealbreaker question first.
 *  2. Then, if the opening block already rules out a match, only `flow.afterDealbreaker`.
 *  3. Otherwise everything else in order, until a match becomes impossible.
 *  4. Everyone finishes on `flow.finalQuestion`.
 */
export function planNext(config: QuestionnaireConfig, answers: Answers): Plan {
  const eligible = config.questions.filter((q) => isActive(q, answers));

  const block = eligible.filter((q) => q.importance === "dealbreaker");
  const openBlock = block.filter((q) => answers[q.id] === undefined);
  if (openBlock.length > 0) {
    return { next: openBlock[0], inBlock: true, remaining: openBlock.length, cutShort: null };
  }

  const final = eligible.find((q) => q.id === config.flow.finalQuestion) ?? null;
  const rest = eligible.filter((q) => q.importance !== "dealbreaker" && q !== final);
  const afterBlock = [...rest, ...(final ? [final] : [])];
  const unanswered = (q: QuestionConfig) => answers[q.id] === undefined;

  // Judge the opening block on its own answers, so the decision stays put as she
  // answers the questions that follow it.
  const blockAnswers: Answers = {};
  for (const q of block) blockAnswers[q.id] = answers[q.id];
  const ruledOutByBlock = !matchStillPossible(config, tally(config, blockAnswers), afterBlock);

  let path: QuestionConfig[];
  let cutShort: CutShort = null;
  if (ruledOutByBlock) {
    // Ruled out by the opening block: a short, kind exit.
    cutShort = "short";
    path = config.flow.afterDealbreaker
      .map((id) => rest.find((q) => q.id === id))
      .filter((q): q is QuestionConfig => Boolean(q));
  } else if (!matchStillPossible(config, tally(config, answers), afterBlock.filter(unanswered))) {
    // Ruled out part way through: straight to the last question.
    cutShort = "final";
    path = [];
  } else {
    path = rest;
  }
  if (final) path = [...path, final];

  const open = path.filter(unanswered);
  return { next: open[0] ?? null, inBlock: false, remaining: open.length, cutShort };
}

type CleanValue = { ok: true; value: AnswerValue } | { ok: false; error: string };

function cleanValue(q: QuestionConfig, raw: unknown): CleanValue {
  const validIds = new Set(q.choices.map((c) => c.id));
  if (q.type === "multi") {
    if (!Array.isArray(raw) || raw.length === 0) return { ok: false, error: `Please answer "${q.id}".` };
    const ids = [...new Set(raw)];
    if (!ids.every((id): id is string => typeof id === "string" && validIds.has(id))) {
      return { ok: false, error: `Unknown answer for "${q.id}".` };
    }
    if (q.maxPicks && ids.length > q.maxPicks) return { ok: false, error: `Too many answers for "${q.id}".` };
    return { ok: true, value: ids };
  }
  if (typeof raw !== "string") return { ok: false, error: `Please answer "${q.id}".` };
  if (!validIds.has(raw)) return { ok: false, error: `Unknown answer for "${q.id}".` };
  return { ok: true, value: raw };
}

export type Walk =
  | {
      ok: true;
      /** Only the answers on her actual path, cleaned. */
      answers: Answers;
      /** Question ids in the order she answered them. */
      path: string[];
      /** What to show next. `next: null` means she is finished. */
      step: FlowStep;
      cutShort: CutShort;
    }
  | { ok: false; error: string };

/**
 * Replays the questionnaire against a set of answers, exactly as she experienced it.
 * Stops at the first question on the path without an answer. Answers to questions
 * that were never on her path are dropped. This is how the server both picks the
 * next question and checks a finished questionnaire.
 */
export function walkFlow(config: QuestionnaireConfig, rawAnswers: unknown): Walk {
  if (!isPlainObject(rawAnswers)) return { ok: false, error: "Answers are missing." };
  const input = rawAnswers as Record<string, unknown>;
  const answers: Answers = {};
  const path: string[] = [];

  for (let guard = 0; guard <= config.questions.length; guard += 1) {
    const plan = planNext(config, answers);
    if (!plan.next) {
      return { ok: true, answers, path, step: { next: null, progress: 1 }, cutShort: plan.cutShort };
    }

    const q = plan.next;
    if (input[q.id] === undefined) {
      const progress = plan.inBlock ? null : round2(path.length / (path.length + plan.remaining));
      return { ok: true, answers, path, step: { next: q.id, progress }, cutShort: plan.cutShort };
    }

    const cleaned = cleanValue(q, input[q.id]);
    if (!cleaned.ok) return cleaned;
    answers[q.id] = cleaned.value;
    path.push(q.id);
  }
  return { ok: false, error: "Too many answers." };
}

export type Assessment =
  | { ok: true; complete: boolean; answers: Answers; path: string[]; cutShort: CutShort; evaluation: Evaluation }
  | { ok: false; error: string };

/** Walk the flow, then score what she answered. The one pipeline everything uses. */
export function assess(config: QuestionnaireConfig, rawAnswers: unknown): Assessment {
  const walk = walkFlow(config, rawAnswers);
  if (!walk.ok) return walk;

  let evaluation = evaluate(config, walk.answers);
  // A path that was cut short can never end in a match, whatever the arithmetic says.
  if (walk.cutShort && evaluation.result === "compatible") {
    evaluation = { ...evaluation, result: "not_compatible", reason: "score" };
  }

  return {
    ok: true,
    complete: walk.step.next === null,
    answers: walk.answers,
    path: walk.path,
    cutShort: walk.cutShort,
    evaluation
  };
}

/** Strip everything private. This is the only shape of the questionnaire the browser ever sees. */
export function toPublicQuestionnaire(config: QuestionnaireConfig): PublicQuestionnaire {
  const sectionTitle = new Map(config.sections.map((s) => [s.id, s.title]));
  return {
    version: config.version,
    questions: config.questions.map((q) => ({
      id: q.id,
      sectionTitle: sectionTitle.get(q.section) ?? "",
      type: q.type,
      prompt: q.prompt,
      ...(q.helper ? { helper: q.helper } : {}),
      choices: q.choices.map((c) => ({ id: c.id, label: c.label })),
      ...(q.scaleLabels ? { scaleLabels: q.scaleLabels } : {}),
      ...(q.maxPicks ? { maxPicks: q.maxPicks } : {})
    }))
  };
}

function isPlainObject(value: unknown): boolean {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function clamp01(n: number): number {
  return Math.min(1, Math.max(0, n));
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}
