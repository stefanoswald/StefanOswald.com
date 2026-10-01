import { NextResponse } from "next/server";
import type { ResultResponse } from "@/lib/myperson/api";
import { contactDetails } from "@/lib/myperson/contact";
import { assess } from "@/lib/myperson/engine";
import { questionnaire } from "@/lib/myperson/questionnaire";
import { answersFrom, readJson } from "@/lib/myperson/request";

/**
 * Scores a finished questionnaire. Your number goes back only when her answers
 * line up, and nothing about her is saved. The same path is replayed here, so
 * answers that skip ahead or were cut short can't earn the number.
 */
export async function POST(request: Request) {
  const body = (await readJson(request)) as { answers?: unknown } | null;
  const answers = answersFrom(body?.answers);
  if (!answers) return NextResponse.json({ error: "Some answers went missing. Try once more." }, { status: 400 });

  const result = assess(questionnaire, answers);
  if (!result.ok || !result.complete) {
    return NextResponse.json({ error: "Some answers went missing. Try once more." }, { status: 400 });
  }

  const response: ResultResponse =
    result.evaluation.result === "compatible"
      ? { outcome: "compatible", contact: contactDetails() }
      : { outcome: "not_compatible" };

  return NextResponse.json(response, { headers: { "cache-control": "no-store" } });
}
