"use client";

import { useEffect, useRef, useState } from "react";
import { checkAnswers, nextQuestion, OFFLINE, type ResultResponse } from "@/lib/myperson/api";
import { loadSnapshot, saveSnapshot, type QuizStep, type TrailStep } from "@/lib/myperson/quiz-storage";
import { site } from "@/lib/myperson/site";
import type { AnswerValue, Answers, FlowStep, PublicQuestionnaire } from "@/lib/myperson/types";
import { QuizCard, QuizShell, QuizTopBar } from "./chrome";
import { QuestionScreen } from "./QuestionScreen";
import { CompatibleResult, NotCompatibleResult } from "./results";
import { Checking, Intro, NameScreen } from "./screens";

/** A beat after she taps, so the choice she made is visible before the next card. */
const ANSWER_PAUSE = 260;

const pause = (ms: number) => new Promise<void>((resolve) => window.setTimeout(resolve, ms));

/** Keep only the answers to the questions she has actually been shown. */
function onTrail(answers: Answers, trail: TrailStep[]): Answers {
  const kept: Answers = {};
  for (const { id } of trail) if (answers[id] !== undefined) kept[id] = answers[id];
  return kept;
}

export function QuizFlow({ questionnaire }: { questionnaire: PublicQuestionnaire }) {
  const [ready, setReady] = useState(false);
  const [step, setStep] = useState<QuizStep>({ kind: "intro" });
  const [trail, setTrail] = useState<TrailStep[]>([]);
  const [answers, setAnswers] = useState<Answers>({});
  const [name, setName] = useState("");
  const [result, setResult] = useState<ResultResponse | null>(null);
  const [firstStep, setFirstStep] = useState<FlowStep | null>(null);
  const [busy, setBusy] = useState(false);
  const [advancing, setAdvancing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [canRetry, setCanRetry] = useState(false);
  const checking = useRef(false);
  const retry = useRef<(() => void) | null>(null);

  const fail = (problem: unknown, again: () => void) => {
    const message = problem instanceof Error ? problem.message : "";
    setError(!message || message === OFFLINE ? site.questionnaire.offlineMessage : message);
    retry.current = again;
    setCanRetry(true);
  };

  const clearError = () => {
    setError(null);
    setCanRetry(false);
    retry.current = null;
  };

  /* ---------------- pick up where she left off ---------------- */

  useEffect(() => {
    // sessionStorage only exists in the browser, so this has to happen after the first render.
    const saved = loadSnapshot(questionnaire.version);
    if (saved) {
      const savedTrail = Array.isArray(saved.trail) ? saved.trail : [];
      let savedStep = saved.step;
      // A reload in the middle of the final check goes back to the last question.
      if (savedStep.kind === "checking") savedStep = { kind: "question" };
      if (savedStep.kind === "question" && savedTrail.length === 0) savedStep = { kind: "intro" };
      if (savedStep.kind === "result" && !saved.result) savedStep = { kind: "intro" };
      setStep(savedStep);
      setTrail(savedTrail);
      setAnswers(saved.answers ?? {});
      setName(saved.name ?? "");
      setResult(saved.result ?? null);
    }
    setReady(true);
    // Only on mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!ready) return;
    saveSnapshot({ version: questionnaire.version, step, trail, answers, name, result });
  }, [ready, questionnaire.version, step, trail, answers, name, result]);

  /* ---------------- where she is ---------------- */

  const current = step.kind === "question" ? trail[trail.length - 1] : undefined;
  const currentQuestion = current ? questionnaire.questions.find((q) => q.id === current.id) : undefined;
  const progress = current?.progress ?? null;

  // A small encouraging line when she crosses a milestone. Only on ordinary steps,
  // never when the path suddenly gets shorter.
  const progressNote = (() => {
    if (!current || current.progress === null || trail.length < 2) return null;
    const previous = trail[trail.length - 2].progress;
    if (previous === null || current.progress - previous > 0.15) return null;
    for (const [at, message] of Object.entries(site.questionnaire.progressMessages)) {
      const point = Number(at);
      if (previous < point && current.progress >= point) return message;
    }
    return null;
  })();

  /* ---------------- starting ---------------- */

  const begin = () => {
    clearError();
    setStep({ kind: "name" });
    // Fetch the first question while she types her name.
    if (!firstStep && trail.length === 0) {
      nextQuestion({})
        .then(setFirstStep)
        .catch(() => {
          // Fetched again when she taps Next.
        });
    }
  };

  /** Show the first question, or wherever she already was. */
  const enterQuestions = async () => {
    clearError();
    if (trail.length > 0) {
      setStep({ kind: "question" });
      return;
    }
    if (firstStep?.next) {
      setTrail([{ id: firstStep.next, progress: firstStep.progress }]);
      setStep({ kind: "question" });
      return;
    }
    setBusy(true);
    try {
      const first = await nextQuestion({});
      if (first.next) {
        setTrail([{ id: first.next, progress: first.progress }]);
        setStep({ kind: "question" });
      }
    } catch (problem) {
      fail(problem, () => void enterQuestions());
    } finally {
      setBusy(false);
    }
  };

  /* ---------------- answering ---------------- */

  const answerQuestion = async (question: string, value: AnswerValue) => {
    if (advancing) return;
    clearError();

    const nextAnswers: Answers = { ...answers, [question]: value };
    setAnswers(nextAnswers);
    // Only the answers on the path she is on right now. Older answers further down
    // stay in this tab so they are pre-selected if she sees those questions again.
    const pathAnswers = onTrail(nextAnswers, trail);

    setAdvancing(true);
    try {
      const [next] = await Promise.all([nextQuestion(pathAnswers), pause(ANSWER_PAUSE)]);
      if (next.next) {
        setTrail((path) => [...path, { id: next.next as string, progress: next.progress }]);
      } else {
        void finish(pathAnswers);
      }
    } catch (problem) {
      fail(problem, () => void answerQuestion(question, value));
    } finally {
      setAdvancing(false);
    }
  };

  const goBack = () => {
    if (advancing) return;
    clearError();
    if (step.kind === "question") {
      if (trail.length > 1) setTrail((path) => path.slice(0, -1));
      else setStep({ kind: "name" });
      return;
    }
    if (step.kind === "name") setStep({ kind: "intro" });
  };

  /* ---------------- the result ---------------- */

  const finish = async (finalAnswers: Answers) => {
    if (checking.current) return;
    checking.current = true;
    setStep({ kind: "checking" });
    clearError();
    try {
      const response = await checkAnswers(finalAnswers);
      setResult(response);
      setStep({ kind: "result" });
    } catch (problem) {
      setStep({ kind: "question" });
      fail(problem, () => void finish(finalAnswers));
    } finally {
      checking.current = false;
    }
  };

  /* ---------------- render ---------------- */

  if (!ready) return <QuizShell />;

  if (step.kind === "result" && result) {
    return (
      <QuizShell>
        {result.outcome === "compatible" ? (
          <CompatibleResult name={name} contact={result.contact} answers={onTrail(answers, trail)} />
        ) : (
          <NotCompatibleResult />
        )}
      </QuizShell>
    );
  }

  return (
    <QuizShell>
      <QuizTopBar
        progress={progress}
        onBack={goBack}
        backHref={step.kind === "intro" ? site.path : undefined}
        disabled={advancing}
      />

      {step.kind === "intro" ? (
        <QuizCard animationKey="intro">
          <Intro onStart={begin} />
        </QuizCard>
      ) : null}

      {step.kind === "name" ? (
        <QuizCard animationKey="name">
          <NameScreen value={name} onChange={setName} onNext={() => void enterQuestions()} busy={busy} />
        </QuizCard>
      ) : null}

      {step.kind === "question" && currentQuestion ? (
        <>
          <QuizCard animationKey={currentQuestion.id} className={advancing ? "pointer-events-none" : ""}>
            <QuestionScreen
              question={currentQuestion}
              value={answers[currentQuestion.id]}
              onAnswer={(value) => void answerQuestion(currentQuestion.id, value)}
            />
          </QuizCard>
          {progressNote ? (
            <p role="status" className="shell -mt-2 pb-2 text-center text-sm text-mp-sage">
              {progressNote}
            </p>
          ) : null}
        </>
      ) : null}

      {step.kind === "checking" ? (
        <QuizCard animationKey="checking">
          <Checking />
        </QuizCard>
      ) : null}

      {error ? (
        <div className="shell pb-4" role="status">
          <div className="rounded-2xl border border-mp-ember/40 bg-mp-felt-2 p-4 text-center">
            <p className="text-sm text-mp-ember-light">{error}</p>
            {canRetry ? (
              <button
                type="button"
                className="btn btn-quiet mt-3 min-h-11 w-full py-2 text-sm"
                onClick={() => {
                  const again = retry.current;
                  clearError();
                  again?.();
                }}
              >
                {site.questionnaire.retry}
              </button>
            ) : null}
          </div>
        </div>
      ) : null}
    </QuizShell>
  );
}
