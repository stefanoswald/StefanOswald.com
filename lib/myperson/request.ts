import "server-only";

const MAX_BODY = 20_000;
const MAX_ANSWERS = 60;

/** Reads a small JSON body. Anything too big or not JSON comes back as null. */
export async function readJson(request: Request): Promise<unknown> {
  const text = await request.text();
  if (text.length > MAX_BODY) return null;
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

/**
 * The answers object, if it has a sane shape: question ids mapped to a choice id,
 * or a short list of choice ids. The engine checks each answer against the
 * questionnaire after this.
 */
export function answersFrom(raw: unknown): Record<string, unknown> | null {
  if (typeof raw !== "object" || raw === null || Array.isArray(raw)) return null;
  const entries = Object.entries(raw);
  if (entries.length > MAX_ANSWERS) return null;
  for (const [key, value] of entries) {
    if (key.length > 60) return null;
    if (typeof value === "string" && value.length <= 60) continue;
    if (
      Array.isArray(value) &&
      value.length <= 20 &&
      value.every((item) => typeof item === "string" && item.length <= 60)
    ) {
      continue;
    }
    return null;
  }
  return raw as Record<string, unknown>;
}
