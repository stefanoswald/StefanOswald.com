import type { QuestionnaireConfig } from "./types";

const ID_PATTERN = /^[a-z0-9_]+$/;

/**
 * Catches mistakes in lib/myperson/questionnaire.ts. The questionnaire page runs
 * this while the site builds, so a broken edit fails the build on Vercel and the
 * site that is already live stays up.
 */
export function checkQuestionnaire(config: QuestionnaireConfig): string[] {
  const errors: string[] = [];
  const { thresholds, weights } = config;

  for (const [level, weight] of Object.entries(weights)) {
    if (!(weight >= 0)) errors.push(`weights.${level} must be 0 or more.`);
  }
  if (!(thresholds.compatibleScore >= 0 && thresholds.compatibleScore <= 100)) {
    errors.push("thresholds.compatibleScore must be 0 to 100.");
  }
  if (!(Number.isInteger(thresholds.maxFlags) && thresholds.maxFlags >= 0)) {
    errors.push("thresholds.maxFlags must be a whole number, 0 or more.");
  }

  const sectionIds = new Set<string>();
  for (const s of config.sections) {
    if (sectionIds.has(s.id)) errors.push(`Section "${s.id}" is listed twice.`);
    sectionIds.add(s.id);
  }

  const seen = new Map<string, number>();
  config.questions.forEach((q, index) => {
    const where = `Question "${q.id}"`;
    if (!ID_PATTERN.test(q.id)) errors.push(`${where}: ids may only use a-z, 0-9, and _.`);
    if (seen.has(q.id)) errors.push(`${where} is listed twice.`);
    seen.set(q.id, index);
    if (!sectionIds.has(q.section)) errors.push(`${where}: unknown section "${q.section}".`);
    if (!q.prompt?.trim()) errors.push(`${where}: prompt is empty.`);
    if (!["single", "scale", "multi"].includes(q.type)) errors.push(`${where}: unknown type "${q.type}".`);
    if (!["dealbreaker", "strong", "nice", "info"].includes(q.importance)) {
      errors.push(`${where}: unknown importance "${q.importance}".`);
    }
    if (q.weight !== undefined && !(q.weight >= 0)) errors.push(`${where}: weight must be 0 or more.`);

    if (!Array.isArray(q.choices) || q.choices.length < 2) {
      errors.push(`${where}: needs at least 2 choices.`);
      return;
    }
    const choiceIds = new Set<string>();
    for (const c of q.choices) {
      const cw = `${where}, choice "${c.id}"`;
      if (!ID_PATTERN.test(c.id)) errors.push(`${cw}: ids may only use a-z, 0-9, and _.`);
      if (choiceIds.has(c.id)) errors.push(`${cw} is listed twice.`);
      choiceIds.add(c.id);
      if (!c.label?.trim()) errors.push(`${cw}: label is empty.`);
      if (q.importance === "info") continue;
      if (c.dealbreaker) {
        if (q.importance !== "dealbreaker") {
          errors.push(`${cw}: dealbreaker answers only work on questions with importance "dealbreaker".`);
        }
        continue;
      }
      if (c.score === undefined) errors.push(`${cw}: needs a score from 0 to 1.`);
      else if (!(c.score >= 0 && c.score <= 1)) errors.push(`${cw}: score must be from 0 to 1.`);
    }

    if (q.type === "scale") {
      if (!q.scaleLabels || q.scaleLabels.length !== 2) errors.push(`${where}: scale questions need 2 scaleLabels.`);
      if (q.choices.length < 3 || q.choices.length > 7) errors.push(`${where}: scale questions need 3 to 7 choices.`);
    }
    if (q.type === "multi" && (!q.maxPicks || q.maxPicks < 1 || q.maxPicks > q.choices.length)) {
      errors.push(`${where}: maxPicks must be between 1 and the number of choices.`);
    }
    if (q.showIf) {
      const targetIndex = seen.get(q.showIf.question);
      const target = config.questions.find((x) => x.id === q.showIf!.question);
      if (!target) errors.push(`${where}: showIf points to unknown question "${q.showIf.question}".`);
      else if (targetIndex === undefined || targetIndex >= index) {
        errors.push(`${where}: showIf must point to an earlier question.`);
      } else {
        for (const id of q.showIf.anyOf) {
          if (!target.choices.some((c) => c.id === id)) {
            errors.push(`${where}: showIf uses unknown choice "${id}" of "${target.id}".`);
          }
        }
      }
    }
  });

  const byId = new Map(config.questions.map((q) => [q.id, q]));
  const final = byId.get(config.flow.finalQuestion);
  if (!final) errors.push(`flow.finalQuestion points to unknown question "${config.flow.finalQuestion}".`);
  else if (final.importance === "dealbreaker") {
    errors.push("flow.finalQuestion cannot be a dealbreaker question. Those are asked first.");
  }
  for (const id of config.flow.afterDealbreaker) {
    const q = byId.get(id);
    if (!q) errors.push(`flow.afterDealbreaker points to unknown question "${id}".`);
    else if (q.importance === "dealbreaker") {
      errors.push(`flow.afterDealbreaker: "${id}" is a dealbreaker question, which is always asked first.`);
    }
  }

  for (const rule of config.combos) {
    const where = `Combo rule "${rule.id}"`;
    if (!["dealbreaker", "flag"].includes(rule.effect)) errors.push(`${where}: unknown effect "${rule.effect}".`);
    if (!rule.when?.length) errors.push(`${where}: needs at least one condition.`);
    for (const cond of rule.when ?? []) {
      const target = byId.get(cond.question);
      if (!target) {
        errors.push(`${where}: unknown question "${cond.question}".`);
        continue;
      }
      for (const id of cond.anyOf) {
        if (!target.choices.some((c) => c.id === id)) {
          errors.push(`${where}: unknown choice "${id}" of "${cond.question}".`);
        }
      }
    }
  }

  return errors;
}
