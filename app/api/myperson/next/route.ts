import { NextResponse } from "next/server";
import { walkFlow } from "@/lib/myperson/engine";
import { questionnaire } from "@/lib/myperson/questionnaire";
import { answersFrom, readJson } from "@/lib/myperson/request";

/**
 * Which question comes next. The browser sends the answers along her path and
 * gets back only a question id and a progress fraction, so why a path gets
 * shorter never leaves the server. Nothing is stored.
 */
export async function POST(request: Request) {
  const body = (await readJson(request)) as { answers?: unknown } | null;
  const answers = answersFrom(body?.answers);
  if (!answers) return NextResponse.json({ error: "Bad request." }, { status: 400 });

  const walk = walkFlow(questionnaire, answers);
  if (!walk.ok) return NextResponse.json({ error: walk.error }, { status: 400 });

  return NextResponse.json(walk.step, { headers: { "cache-control": "no-store" } });
}
