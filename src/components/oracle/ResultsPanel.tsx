import { RotateCcw } from "lucide-react";
import type { Graded } from "@/lib/oracle/use-practice";

export function ResultsPanel({
  answers,
  note,
  onAgain,
  onWeak,
}: {
  answers: Graded[];
  note: string;
  onAgain: () => void;
  onWeak: (topics: string[]) => void;
}) {
  const correct = answers.filter((item) => item.correct).length;
  const score = answers.length ? Math.round((correct / answers.length) * 100) : 0;
  const topics = new Map<string, { correct: number; total: number }>();
  answers.forEach((item) => {
    const row = topics.get(item.question.topic) || { correct: 0, total: 0 };
    row.total += 1;
    if (item.correct) row.correct += 1;
    topics.set(item.question.topic, row);
  });
  const ranked = [...topics.entries()].map(([name, row]) => ({
    name,
    score: Math.round((row.correct / row.total) * 100),
  }));
  const weak = ranked.filter((item) => item.score < 70).map((item) => item.name);
  const missed = answers.filter((item) => !item.correct);

  return (
    <section className="oracle-results" aria-live="polite">
      <p className="eyebrow text-clay">Your report</p>
      <h2 className="font-display text-4xl font-bold text-ink">{score}%</h2>
      <p>
        {correct} of {answers.length} answers correct
      </p>
      <div className="oracle-results-grid">
        <section>
          <h3 className="font-display font-bold text-ink">Topic strengths</h3>
          <div className="oracle-result-topics">
            {ranked.map((item) => (
              <p key={item.name}>
                <span>{item.name}</span>
                <b>{item.score}%</b>
              </p>
            ))}
          </div>
        </section>
        <section>
          <h3 className="font-display font-bold text-ink">Review</h3>
          {missed.length ? (
            missed.map((item) => (
              <article key={item.question.prompt} className="oracle-review-item">
                <h4>{item.question.prompt}</h4>
                <p className="oracle-correct-answer">
                  Correct answer: {String.fromCharCode(65 + item.question.answer)}. {item.question.options[item.question.answer]}
                </p>
                <ol>
                  {item.question.steps.map((step) => (
                    <li key={step}>{step}</li>
                  ))}
                </ol>
              </article>
            ))
          ) : (
            <p className="oracle-all-correct">All correct. Nothing to review this time.</p>
          )}
        </section>
      </div>
      <p className="text-sm text-ink/60 mt-4" role="status">
        {note}
      </p>
      <div className="mt-4 flex flex-wrap gap-3">
        {weak.length ? (
          <button type="button" className="btn btn-clay px-6 py-3.5" onClick={() => onWeak(weak)}>
            Practise weak topics
          </button>
        ) : null}
        <button type="button" className="btn btn-ink px-6 py-3.5" onClick={onAgain}>
          <RotateCcw className="w-4 h-4" />
          Build another test
        </button>
      </div>
    </section>
  );
}
