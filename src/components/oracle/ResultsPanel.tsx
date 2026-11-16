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
    correct: row.correct,
    total: row.total,
    score: Math.round((row.correct / row.total) * 100),
  }));
  const weak = ranked.filter((item) => item.score < 70).map((item) => item.name);
  const missed = answers.filter((item) => !item.correct);

  return (
    <section id="oracle-results" className="oracle-results" aria-live="polite">
      <header className="oracle-results-head">
        <div>
          <p className="eyebrow">Your report</p>
          <p className="oracle-results-line">
            {correct} of {answers.length} answers correct
          </p>
        </div>
        <p className="oracle-results-score">
          {score}
          <span>%</span>
        </p>
      </header>

      <div className="oracle-results-grid">
        <section className="oracle-results-topics">
          <h3>Topic strengths</h3>
          <div className="oracle-result-topics">
            {ranked.map((item) => (
              <div
                key={item.name}
                className={`oracle-result-topic${item.score < 70 ? " is-weak" : " is-strong"}`}
              >
                <span>{item.name}</span>
                <b>
                  {item.correct}/{item.total}
                </b>
                <strong>{item.score}%</strong>
                <i style={{ ["--score" as string]: `${item.score}%` }} />
              </div>
            ))}
          </div>
        </section>

        <section className="oracle-results-review">
          <h3>Review</h3>
          {missed.length ? (
            <div className="oracle-review-list">
              {missed.map((item, index) => (
                <article key={item.question.prompt} className="oracle-review-item">
                  <p className="oracle-review-index">Missed {index + 1}</p>
                  <h4>{item.question.prompt}</h4>
                  <p className="oracle-correct-answer">
                    Correct answer: {String.fromCharCode(65 + item.question.answer)}.{" "}
                    {item.question.options[item.question.answer]}
                  </p>
                  <ol>
                    {item.question.steps.map((step) => (
                      <li key={step}>{step}</li>
                    ))}
                  </ol>
                </article>
              ))}
            </div>
          ) : (
            <p className="oracle-all-correct">All correct. Nothing to review this time.</p>
          )}
        </section>
      </div>

      {note ? (
        <p className="oracle-results-note" role="status">
          {note}
        </p>
      ) : null}
      <div className="oracle-results-actions">
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
