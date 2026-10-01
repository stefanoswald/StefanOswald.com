import type { Answers, FlowStep } from "./types";

/** What the browser gets back at the end. The number only comes with "compatible". */
export type ResultResponse =
  | { outcome: "compatible"; contact: { display: string; sms: string } | null }
  | { outcome: "not_compatible" };

/** Thrown when the request never reached the server. */
export const OFFLINE = "offline";

async function post<T>(url: string, body: unknown): Promise<T> {
  let response: Response;
  try {
    response = await fetch(url, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body)
    });
  } catch {
    // No connection, airplane mode, a dropped signal in an elevator.
    throw new Error(OFFLINE);
  }
  const data = (await response.json().catch(() => ({}))) as T & { error?: string };
  if (!response.ok) throw new Error(data.error || "Something went wrong.");
  return data;
}

/** Which question comes next. Only a question id and a progress fraction come back. */
export const nextQuestion = (answers: Answers) => post<FlowStep>("/api/myperson/next", { answers });

/** Scores the finished questionnaire. Nothing is saved. */
export const checkAnswers = (answers: Answers) => post<ResultResponse>("/api/myperson/result", { answers });

/** Where the "Save contact" form posts her answers, so the server can check them once more. */
export const CONTACT_CARD_URL = "/api/myperson/contact-card";
