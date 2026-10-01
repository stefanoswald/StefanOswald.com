"use client";

import { useEffect, useRef, useState } from "react";
import type { AnswerValue, PublicQuestion } from "@/lib/myperson/types";
import { SectionLabel } from "./chrome";

const LETTERS = "ABCDEFGHIJ";

interface Props {
  question: PublicQuestion;
  value: AnswerValue | undefined;
  onAnswer: (value: AnswerValue) => void;
}

export function QuestionScreen({ question, value, onAnswer }: Props) {
  const heading = useRef<HTMLHeadingElement>(null);

  // Move focus to the new question so screen readers read it out and the tab order
  // starts at the top of the card.
  useEffect(() => {
    heading.current?.focus();
  }, [question.id]);

  return (
    <div data-question={question.id} data-question-type={question.type}>
      <SectionLabel>{question.sectionTitle}</SectionLabel>
      <h1 ref={heading} tabIndex={-1} className="text-[clamp(1.45rem,5.2vw,1.8rem)] text-mp-ink outline-none">
        {question.prompt}
      </h1>
      {question.helper ? <p className="mt-2 text-sm text-mp-ink-muted">{question.helper}</p> : null}

      <div className="mt-5">
        {question.type === "multi" ? (
          <MultiChoice question={question} value={value} onAnswer={onAnswer} />
        ) : question.type === "scale" ? (
          <ScaleChoice question={question} value={value} onAnswer={onAnswer} />
        ) : (
          <SingleChoice question={question} value={value} onAnswer={onAnswer} />
        )}
      </div>
    </div>
  );
}

function choiceClasses(selected: boolean): string {
  return [
    "flex w-full items-center gap-3 rounded-2xl border-[1.5px] px-4 py-3.5 text-left transition-colors",
    selected
      ? "border-mp-ember bg-mp-ember-soft"
      : "border-mp-cream-3 bg-mp-cream-2 mp-hover:border-mp-ember/60 active:bg-mp-ember-soft/60"
  ].join(" ");
}

function SingleChoice({ question, value, onAnswer }: Props) {
  return (
    <div role="group" aria-label={question.prompt} className="grid gap-2.5">
      {question.choices.map((choice, index) => {
        const selected = value === choice.id;
        return (
          <button
            key={choice.id}
            type="button"
            data-choice={choice.id}
            aria-pressed={selected}
            className={choiceClasses(selected)}
            onClick={() => onAnswer(choice.id)}
          >
            <span
              aria-hidden
              className={`grid h-7 w-7 shrink-0 place-items-center rounded-lg text-xs font-bold ${
                selected ? "bg-mp-ember text-[#221008]" : "bg-mp-cream text-mp-ink-muted"
              }`}
            >
              {LETTERS[index]}
            </span>
            <span className="text-mp-ink">{choice.label}</span>
          </button>
        );
      })}
    </div>
  );
}

function ScaleChoice({ question, value, onAnswer }: Props) {
  const [picked, setPicked] = useState<string | null>(typeof value === "string" ? value : null);
  const current = question.choices.find((choice) => choice.id === picked);
  const [left, right] = question.scaleLabels ?? ["", ""];

  return (
    <div>
      <div role="group" aria-label={question.prompt} className="relative flex items-center justify-between gap-1 px-1">
        <span aria-hidden className="absolute inset-x-4 top-1/2 h-[3px] -translate-y-1/2 rounded-mp-pill bg-mp-cream-3" />
        {question.choices.map((choice) => {
          const selected = picked === choice.id;
          return (
            <button
              key={choice.id}
              type="button"
              data-choice={choice.id}
              aria-pressed={selected}
              aria-label={choice.label}
              onClick={() => setPicked(choice.id)}
              className="relative grid h-12 flex-1 place-items-center"
            >
              <span
                className={`block rounded-full border-2 transition-all ${
                  selected
                    ? "h-7 w-7 border-mp-ember-deep bg-mp-ember-deep ring-4 ring-mp-ember-soft"
                    : "h-5 w-5 border-mp-ink-muted bg-mp-cream mp-hover:border-mp-ember-deep"
                }`}
              />
            </button>
          );
        })}
      </div>
      <div className="mt-1 flex justify-between gap-4 text-xs text-mp-ink-muted">
        <span className="max-w-[45%]">{left}</span>
        <span className="max-w-[45%] text-right">{right}</span>
      </div>

      <p
        aria-live="polite"
        className="mt-4 min-h-12 rounded-2xl border-[1.5px] border-mp-cream-3 bg-mp-cream-2 px-4 py-3 text-center text-mp-ink"
      >
        {current ? current.label : "Pick the spot that feels right."}
      </p>

      <button
        type="button"
        data-next="scale"
        className="btn btn-ink mt-4 w-full"
        disabled={!picked}
        onClick={() => picked && onAnswer(picked)}
      >
        Next
      </button>
    </div>
  );
}

function MultiChoice({ question, value, onAnswer }: Props) {
  const [picked, setPicked] = useState<string[]>(Array.isArray(value) ? value : []);
  const [atLimit, setAtLimit] = useState(false);
  const max = question.maxPicks ?? question.choices.length;

  const toggle = (id: string) => {
    if (picked.includes(id)) {
      setPicked(picked.filter((item) => item !== id));
      setAtLimit(false);
      return;
    }
    if (picked.length >= max) {
      setAtLimit(true);
      return;
    }
    setPicked([...picked, id]);
  };

  return (
    <div>
      <div role="group" aria-label={question.prompt} className="flex flex-wrap gap-2">
        {question.choices.map((choice) => {
          const selected = picked.includes(choice.id);
          return (
            <button
              key={choice.id}
              type="button"
              data-choice={choice.id}
              aria-pressed={selected}
              onClick={() => toggle(choice.id)}
              className={`min-h-11 rounded-mp-pill border-[1.5px] px-3.5 py-2.5 text-[0.95rem] transition-colors ${
                selected
                  ? "border-mp-ember bg-mp-ember-soft text-mp-ink"
                  : "border-mp-cream-3 bg-mp-cream-2 text-mp-ink mp-hover:border-mp-ember/60"
              }`}
            >
              {choice.label}
            </button>
          );
        })}
      </div>

      <p role="status" className="mt-2 min-h-5 text-xs text-mp-ink-muted">
        {atLimit ? `That's ${max}. Tap one again to swap it out.` : ""}
      </p>

      <button
        type="button"
        data-next="multi"
        className="btn btn-ink mt-4 w-full"
        disabled={picked.length === 0}
        onClick={() => onAnswer(picked)}
      >
        Next
      </button>
    </div>
  );
}
