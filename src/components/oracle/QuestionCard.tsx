import { useEffect } from "react";
import { ArrowRight, Lightbulb } from "lucide-react";
import type { OracleQuestion } from "@/lib/oracle/types";

export function QuestionCard({
  question,
  index,
  total,
  loading,
  loadNote,
  picked,
  showSteps,
  onAnswer,
  onReveal,
  onNext,
  onExit,
}: {
  question: OracleQuestion | undefined;
  index: number;
  total: number;
  loading: boolean;
  loadNote: string;
  picked: number | null;
  showSteps: boolean;
  onAnswer: (index: number) => void;
  onReveal: () => void;
  onNext: () => void;
  onExit: () => void;
}) {
  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      const tag = (event.target as HTMLElement | null)?.tagName.toLowerCase();
      if (tag === "input" || tag === "textarea" || event.metaKey || event.ctrlKey || event.altKey) return;
      const key = event.key.toLowerCase();
      if ("abcd".includes(key) && key.length === 1 && picked === null && question) {
        onAnswer(key.charCodeAt(0) - 97);
      }
      if ((event.key === "Enter" || event.key === "ArrowRight") && picked !== null) onNext();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onAnswer, onNext, picked, question]);

  const progress = total ? Math.round(((index + (picked === null ? 0 : 1)) / total) * 100) : 0;
  const correct = question && picked !== null && picked === question.answer;

  return (
    <section className="oracle-test-panel" aria-live="polite">
      <div className="oracle-test-top">
        <span className="eyebrow text-clay">
          Question {Math.min(index + 1, total)} of {total}
        </span>
        {loading ? <span className="or-load-status">{loadNote}</span> : null}
        <button type="button" className="oracle-text-button" onClick={onExit}>
          End test
        </button>
      </div>
      <div className="or-progress" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={progress}>
        <i style={{ ["--score" as string]: `${progress}%` }} />
      </div>
      {!question ? (
        <div className="or-loading">
          <div className="or-spinner" aria-hidden="true" />
          <p>{loadNote || "Writing your first questions…"}</p>
          <div className="or-skeleton" aria-hidden="true">
            <i />
            <i />
            <i />
          </div>
        </div>
      ) : (
        <div className="oracle-question-body">
          <p className="oracle-topic-tag">
            <span className={`oracle-origin-badge${question.origin === "pq" || question.source === "PQ" ? " is-pq" : ""}`}>
              {question.source || (question.origin === "pq" ? "PQ" : "Oracle Question")}
            </span>
            {" · "}
            {question.topic}
          </p>
          <h3 className="font-display text-2xl sm:text-3xl font-semibold text-ink leading-snug">{question.prompt}</h3>
          <div className="oracle-answer-options" role="group" aria-label="Answer options">
            {question.options.map((option, optionIndex) => {
              const classes = ["oracle-answer-option"];
              if (picked !== null && optionIndex === question.answer) classes.push("is-correct");
              if (picked === optionIndex && optionIndex !== question.answer) classes.push("is-wrong");
              return (
                <button
                  key={option}
                  type="button"
                  className={classes.join(" ")}
                  disabled={picked !== null}
                  onClick={() => onAnswer(optionIndex)}
                >
                  <span className="oracle-option-key">{String.fromCharCode(65 + optionIndex)}</span>
                  <span>{option}</span>
                </button>
              );
            })}
          </div>
          <p className="or-hint or-kbd">Tip: press A, B, C or D to answer, then Enter for the next question.</p>
          {picked !== null ? (
            <div className={`oracle-answer-feedback ${correct ? "is-correct" : "is-wrong"}`}>
              {correct
                ? "Correct. Nice work."
                : `Not quite. The correct answer is ${String.fromCharCode(65 + question.answer)}: ${question.options[question.answer]}`}
            </div>
          ) : null}
          {picked !== null && !showSteps ? (
            <button type="button" className="btn btn-ghost-light mt-5" onClick={onReveal}>
              <Lightbulb className="w-4 h-4" />
              Show step-by-step solution
            </button>
          ) : null}
          {showSteps ? (
            <div className="oracle-step-solution">
              <p className="font-semibold text-ink mb-3">Step-by-step</p>
              <ol>
                {question.steps.map((step) => (
                  <li key={step}>{step}</li>
                ))}
              </ol>
            </div>
          ) : null}
        </div>
      )}
      <button type="button" className="btn btn-ink px-6 py-3.5 mt-8" disabled={picked === null} onClick={onNext}>
        <span>{index + 1 >= total ? "See my report" : "Next question"}</span>
        <ArrowRight className="w-4 h-4" />
      </button>
    </section>
  );
}
