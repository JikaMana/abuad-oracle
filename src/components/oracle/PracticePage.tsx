import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, CreditCard, Play, Trophy, X } from "lucide-react";
import { verifyPayment } from "@/lib/oracle/api";
import { usePractice } from "@/lib/oracle/use-practice";
import type { SavedTest } from "@/lib/oracle/types";
import { AccountDialog } from "./AccountDialog";
import { PrizeCard } from "./PrizeCard";
import { QuestionCard } from "./QuestionCard";
import { ResultsPanel } from "./ResultsPanel";
import { SiteNav } from "./SiteNav";

const WELCOME = [
  "Choose a course, then pick the topics you want to practise.",
  "Each question is marked PQ or Oracle Question. Review the explanation after your choice.",
  "Your report shows strong areas and what to work on next.",
  "Weekly and monthly prizes go to the top student. The weekly code stays locked until Monday 00:00, even for the current leader, then opens for the winner of the finished week.",
];

function testDateLabel(test: SavedTest) {
  const raw = test.completedAt ?? test.date;
  let ms: number | null = null;
  if (typeof raw === "number") ms = raw < 1e12 ? raw * 1000 : raw;
  else if (typeof raw === "string") ms = Date.parse(raw);
  else if (raw && typeof raw === "object") {
    const seconds = raw.seconds ?? raw._seconds;
    if (typeof seconds === "number") ms = seconds * 1000;
  }
  if (!ms || Number.isNaN(ms)) return "Just completed";
  const date = new Date(ms);
  return Number.isNaN(date.getTime()) ? "Just completed" : date.toLocaleDateString();
}

export function PracticePage() {
  const practice = usePractice();
  const [accountOpen, setAccountOpen] = useState(false);
  const [showAllTests, setShowAllTests] = useState(false);
  const [welcome, setWelcome] = useState<number | null>(null);
  const welcomeRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const node = welcomeRef.current;
    if (welcome === null || !node) return;
    if (!node.open) node.showModal();
  }, [welcome]);

  useEffect(() => {
    if (localStorage.getItem("oracle_welcome_seen_v2") === "true") return;
    setWelcome(0);
  }, []);

  useEffect(() => {
    if (practice.phase !== "results") return;
    document
      .getElementById("oracle-results")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [practice.phase]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const reference = params.get("reference") || params.get("trxref");
    if (
      params.get("payment") !== "paystack" ||
      !reference ||
      !practice.auth.confirmed ||
      !practice.auth.user
    )
      return;
    practice.auth.getToken().then(async (token) => {
      if (!token) return;
      await verifyPayment(token, reference).catch(() => undefined);
      window.history.replaceState({}, "", window.location.pathname);
      practice.refreshConfig().catch(() => undefined);
    });
  }, [practice.auth.confirmed, practice.auth.user]);

  const promoUntil = practice.config?.promoUntil
    ? new Date(`${practice.config.promoUntil}T00:00:00`).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "20 November 2026";
  const quota = practice.paid
    ? "Paid access. Up to 60 questions in a test."
    : `${practice.remaining} free questions left in this course today.`;

  function closeWelcome() {
    localStorage.setItem("oracle_welcome_seen_v2", "true");
    setWelcome(null);
  }

  return (
    <div className="theme-ink oracle-page">
      <a className="abuad-skip" href="#setup">
        Skip to practice room
      </a>
      <SiteNav
        paid={practice.paid}
        promo={Boolean(practice.config?.sitewidePremium)}
        onAccount={() => setAccountOpen(true)}
        onUpgrade={() => document.getElementById("upgrade")?.scrollIntoView({ behavior: "smooth" })}
      />
      <main>
        <section className="oracle-intro pt-[76px]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
            <div className="oracle-intro-copy">
              <p className="eyebrow text-clay mb-4">Burhan Tutors · Exam Oracle</p>
              <h1 className="font-display text-4xl sm:text-5xl md:text-[58px] font-extrabold leading-[1.02] text-white">
                Know what you know.
                <br />
                <span className="text-clay">Find what to fix.</span>
              </h1>
              <p className="mt-5 max-w-xl text-[16px] leading-relaxed text-white/65">
                Practise CBT-style questions for your ABUAD 100-level courses. Get tested instantly,
                see your strengths, then work through every gap.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <a className="btn btn-clay px-6 py-3.5" href="#setup">
                  <Play className="w-4 h-4" />
                  Start a free test
                </a>
                <Link className="btn btn-ghost-dark px-6 py-3.5" to="/leaderboard">
                  <Trophy className="w-4 h-4" />
                  View leaderboard
                </Link>
              </div>
            </div>
            <div className="oracle-score-preview" aria-label="Your personal topic progress">
              <p className="eyebrow text-white/45">Your learning map</p>
              <p className="oracle-map-summary">{practice.mapSummary}</p>
              <div className="oracle-map-topics">
                {practice.learningMap.length ? (
                  practice.learningMap.slice(0, 4).map((item) => (
                    <div
                      key={item.name}
                      className={`oracle-map-row${item.score < 70 ? " is-focus" : ""}`}
                    >
                      <span>
                        {item.name} · {item.correct}/{item.total}
                      </span>
                      <strong>
                        {item.score < 70 ? "Focus" : "Strong"} · {item.score}%
                      </strong>
                      <i style={{ ["--score" as string]: `${item.score}%` }} />
                    </div>
                  ))
                ) : (
                  <p className="oracle-map-empty">
                    Your topic progress will appear after your first completed test.
                  </p>
                )}
              </div>
            </div>
          </div>
        </section>

        <section id="prize-desk" className="oracle-prize-desk" aria-label="Prize claim">
          <div className="oracle-prize-desk-inner">
            <div>
              <p className="eyebrow text-clay">Prizes</p>
              <h2 className="font-display text-2xl font-bold mt-1">Weekly and monthly</h2>
              <p className="mt-2 text-sm text-white">
                The top student each week wins cash prizes. The top student each month gets the next
                month free. The claim code opens only for the winner.
              </p>
              <Link className="oracle-welcome-board" to="/leaderboard">
                Open the leaderboard
              </Link>
            </div>
            <PrizeCard prize={practice.weeklyPrize} whatsapp={practice.whatsapp} />
            <PrizeCard prize={practice.monthlyPrize} whatsapp={practice.whatsapp} />
          </div>
        </section>

        {practice.paid && !practice.config?.sitewidePremium ? null : (
          <section id="upgrade" className="oracle-upgrade">
            <div className="oracle-upgrade-inner">
              <div>
                <p className="eyebrow">Paid access · One semester</p>
                <h2>More room to practise.</h2>
                <p id="upgrade-copy">
                  Full access is free through {promoUntil}. After that, the free plan is 10
                  questions per course across up to 3 courses a day. Paid access is ₦1,000 for six
                  months.
                </p>
              </div>
              <div className="oracle-upgrade-action">
                <strong>
                  ₦1,000 <small>/ semester</small>
                </strong>
                <p>
                  This payment helps keep the service running. Pay with Paystack. Access stays on
                  your account for six months.
                </p>
                <button
                  type="button"
                  className="btn btn-clay px-6 py-3.5"
                  onClick={() => setAccountOpen(true)}
                >
                  <CreditCard aria-hidden="true" />
                  {practice.paid ? "Premium access active" : "Get paid access · ₦1,000"}
                </button>
              </div>
            </div>
          </section>
        )}

        <section id="setup" className="oracle-workspace py-12 md:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="oracle-section-heading">
              <div>
                <p className="eyebrow text-clay mb-2">Practice room</p>
                <h2 className="font-display text-3xl sm:text-4xl font-bold text-ink">
                  Build your test
                </h2>
              </div>
              <span className="or-plan-badge">
                {practice.config?.sitewidePremium
                  ? "Free through 20 Nov"
                  : practice.paid
                    ? "Premium"
                    : "Free plan"}
              </span>
            </div>
            {practice.notice ? (
              <div className="oracle-notice" role="status">
                {practice.notice}
              </div>
            ) : null}

            {practice.phase === "build" ? (
              <div className="or-layout">
                <div className="or-form">
                  <div className="or-step">
                    <label className="or-step-title" htmlFor="course-select">
                      <b>1</b>Choose a course
                    </label>
                    <select
                      id="course-select"
                      className="oracle-select"
                      value={practice.course?.id || ""}
                      onChange={(event) => practice.setCourseId(event.target.value)}
                    >
                      {(practice.config?.courses || []).map((item) => (
                        <option key={item.id} value={item.id}>
                          {item.label} · {item.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  {practice.course && practice.course.topics.length <= 1 ? (
                    <div className="or-step">
                      <p className="or-step-title">
                        <b>2</b>Whole paper
                      </p>
                      <p className="or-hint">
                        {practice.course.label} is taken as one subject. Questions can come from any
                        part of the paper.
                      </p>
                    </div>
                  ) : (
                    <fieldset className="or-step">
                      <legend className="or-step-title">
                        <b>2</b>Choose topics
                      </legend>
                      <div className="or-step-tools">
                        <button
                          type="button"
                          className="oracle-text-button"
                          onClick={() => practice.setSelectedTopics(practice.course?.topics || [])}
                        >
                          Select all
                        </button>
                        <button
                          type="button"
                          className="oracle-text-button"
                          onClick={() => practice.setSelectedTopics([])}
                        >
                          Clear
                        </button>
                      </div>
                      <div className="oracle-topic-options">
                        {(practice.course?.topics || []).map((topic) => (
                          <label key={topic} className="oracle-topic-choice">
                            <input
                              type="checkbox"
                              checked={practice.selectedTopics.includes(topic)}
                              onChange={(event) =>
                                practice.setSelectedTopics((current) =>
                                  event.target.checked
                                    ? [...current, topic]
                                    : current.filter((item) => item !== topic),
                                )
                              }
                            />
                            <span>{topic}</span>
                          </label>
                        ))}
                      </div>
                    </fieldset>
                  )}
                  <div className="or-step">
                    <label className="or-step-title" htmlFor="question-count">
                      <b>3</b>Number of questions
                    </label>
                    <input
                      id="question-count"
                      className="oracle-select or-count"
                      type="number"
                      min={1}
                      max={practice.maxCount}
                      value={practice.count}
                      onChange={(event) => practice.setCount(Number(event.target.value))}
                    />
                    <p className="or-hint">{quota}</p>
                  </div>
                </div>
                <aside className="or-summary" aria-label="Test summary">
                  <p className="eyebrow text-white/45">Your test</p>
                  <dl>
                    <div>
                      <dt>Course</dt>
                      <dd>{practice.course?.label || "–"}</dd>
                    </div>
                    <div>
                      <dt>Topics</dt>
                      <dd>{practice.selectedTopics.length || "–"}</dd>
                    </div>
                    <div>
                      <dt>Questions</dt>
                      <dd>{practice.count}</dd>
                    </div>
                  </dl>
                  <div className="or-meter">
                    <p>{quota}</p>
                    <i
                      style={{
                        ["--score" as string]: practice.paid
                          ? "100%"
                          : `${Math.min(100, (practice.remaining / (practice.config?.freeDaily || 10)) * 100)}%`,
                      }}
                    />
                  </div>
                  <button
                    type="button"
                    className="btn btn-clay w-full py-4 mt-5"
                    onClick={() =>
                      practice.startTest().then((ok) => {
                        if (!ok && !practice.auth.user) setAccountOpen(true);
                      })
                    }
                  >
                    <ArrowRight className="w-4 h-4" />
                    Start test
                  </button>
                  <p className="or-summary-note">
                    Questions load in the background, so you can start after the first few arrive.
                  </p>
                </aside>
              </div>
            ) : null}

            {practice.phase === "test" ? (
              <QuestionCard
                question={practice.questions[practice.index]}
                index={practice.index}
                total={practice.count}
                loading={practice.loading && !practice.questions[practice.index]}
                loadNote={practice.loadNote}
                picked={practice.picked}
                showSteps={practice.showSteps}
                onAnswer={practice.answer}
                onReveal={practice.revealSteps}
                onNext={practice.next}
                onExit={practice.endTest}
              />
            ) : null}

            {practice.phase === "results" ? (
              <ResultsPanel
                answers={practice.answers}
                note={practice.historyNote}
                onAgain={() => practice.setPhase("build")}
                onWeak={(topics) => {
                  practice.setSelectedTopics(topics);
                  practice.setPhase("build");
                }}
              />
            ) : null}
          </div>
        </section>

        <section className="oracle-progress-section">
          <div className="oracle-progress-inner">
            <div className="oracle-progress-heading">
              <div>
                <p className="eyebrow text-clay">Your practice record</p>
                <h2>Recent tests</h2>
              </div>
              <span>
                {practice.auth.user
                  ? `Synced to ${practice.auth.user.email || "your account"}.`
                  : "Saved on this device. Sign in to sync across devices."}
              </span>
            </div>
            <div className="oracle-recent-tests">
              {practice.history.length ? (
                (showAllTests ? practice.history : practice.history.slice(0, 5)).map((test) => (
                  <article
                    key={test.id || `${test.course}-${test.date}`}
                    className="oracle-recent-item"
                  >
                    <strong>{test.course}</strong>
                    <span>
                      {testDateLabel(test)} · {test.correct}/{test.total} correct
                    </span>
                    <b>
                      {test.score ?? Math.round((test.correct / Math.max(1, test.total)) * 100)}%
                    </b>
                  </article>
                ))
              ) : (
                <p className="oracle-recent-empty">
                  {practice.historyNote || "Complete a test and your score will appear here."}
                </p>
              )}
            </div>
            {practice.history.length > 5 ? (
              <button
                type="button"
                className="oracle-recent-more"
                onClick={() => setShowAllTests((open) => !open)}
              >
                {showAllTests ? "Show recent" : `View all ${practice.history.length} tests`}
              </button>
            ) : null}
          </div>
        </section>
      </main>
      <footer className="theme-ink2 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-wrap justify-between gap-4 text-xs text-white/45">
          <span>Burhan Tutors · Exam Oracle</span>
          <a href="#upgrade" className="hover:text-white">
            Upgrade to paid access
          </a>
          <Link to="/" className="hover:text-white">
            Back to academy
          </Link>
        </div>
      </footer>

      <AccountDialog
        open={accountOpen}
        onClose={() => setAccountOpen(false)}
        paid={practice.paid}
        promo={Boolean(practice.config?.sitewidePremium)}
        premiumUntil={practice.premiumUntil}
        usageText={practice.usageText}
        courseUsageText={practice.courseUsageText}
      />

      {welcome !== null ? (
        <dialog ref={welcomeRef} className="oracle-welcome">
          <button type="button" className="oracle-skip" onClick={closeWelcome}>
            Skip
          </button>
          <p className="eyebrow text-clay">Exam Oracle · 0{welcome + 1} / 04</p>
          <h2 className="font-display text-3xl font-bold text-ink mt-4">{WELCOME[welcome]}</h2>
          <div className="oracle-welcome-dots" aria-hidden="true">
            {WELCOME.map((_, dot) => (
              <i key={dot} className={dot === welcome ? "is-active" : ""} />
            ))}
          </div>
          {welcome < WELCOME.length - 1 ? (
            <button
              type="button"
              className="btn btn-ink w-full py-3.5 mt-5"
              onClick={() => setWelcome(welcome + 1)}
            >
              Next
            </button>
          ) : (
            <>
              <Link className="oracle-welcome-board" to="/leaderboard">
                See the leaderboard
              </Link>
              <button
                type="button"
                className="btn btn-clay w-full py-3.5 mt-3"
                onClick={() => {
                  closeWelcome();
                  document.getElementById("setup")?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                Start practising
              </button>
            </>
          )}
        </dialog>
      ) : null}

      {practice.registerOpen ? (
        <div className="oracle-register" role="dialog" aria-modal="true">
          <div className="oracle-register-panel">
            <button
              type="button"
              className="oracle-register-close"
              aria-label="Close"
              onClick={() => practice.setRegisterOpen(false)}
            >
              <X className="w-5 h-5" />
            </button>
            <p className="eyebrow text-clay">Keep your momentum</p>
            <h2 className="font-display text-2xl font-bold text-ink mt-3">
              Understood it? Now master it.
            </h2>
            <p className="text-sm text-ink/65 mt-3 leading-relaxed">
              Register for live classes and never miss this type of question again.
            </p>
            <Link className="btn btn-clay w-full py-3.5 mt-6" to="/" hash="fees">
              See plans and register
            </Link>
          </div>
        </div>
      ) : null}
    </div>
  );
}
