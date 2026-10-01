import { QuizFlow } from "@/components/myperson/quiz/QuizFlow";
import { checkQuestionnaire } from "@/lib/myperson/check-questionnaire";
import { toPublicQuestionnaire } from "@/lib/myperson/engine";
import { questionnaire } from "@/lib/myperson/questionnaire";

export const metadata = { title: "The questionnaire · Find Stefan's Person" };

/**
 * The questionnaire. This page is built ahead of time, so a mistake in
 * lib/myperson/questionnaire.ts stops the build (and the live site stays as it was).
 * Only the questions and answer labels reach the browser, never the scoring.
 */
export default function QuestionnairePage() {
  const problems = checkQuestionnaire(questionnaire);
  if (problems.length > 0) {
    throw new Error(`lib/myperson/questionnaire.ts has mistakes:\n- ${problems.join("\n- ")}`);
  }
  return <QuizFlow questionnaire={toPublicQuestionnaire(questionnaire)} />;
}
