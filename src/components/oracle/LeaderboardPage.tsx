import { useEffect, useState } from "react";
import { Radio } from "lucide-react";
import { fetchLeaderboard } from "@/lib/oracle/api";
import { useOracleAuth } from "@/lib/oracle/auth";
import type { Leaderboard } from "@/lib/oracle/types";
import { PrizeCard } from "./PrizeCard";
import { AccountDialog } from "./AccountDialog";
import { SiteNav } from "./SiteNav";

const PERIODS = [
  ["daily", "Today"],
  ["weekly", "This week"],
  ["monthly", "This month"],
] as const;

export function LeaderboardPage() {
  const auth = useOracleAuth();
  const [board, setBoard] = useState<Leaderboard | null>(null);
  const [period, setPeriod] = useState<(typeof PERIODS)[number][0]>("weekly");
  const [status, setStatus] = useState("Loading");
  const [error, setError] = useState("");
  const [accountOpen, setAccountOpen] = useState(false);

  useEffect(() => {
    if (!auth.confirmed && auth.user) return;
    if (!auth.confirmed) return;
    let cancelled = false;
    setStatus("Updating");
    auth.getToken().then(async (token) => {
      try {
        const data = await fetchLeaderboard(token);
        if (!cancelled) {
          setBoard(data);
          setStatus("Live");
          setError("");
        }
      } catch (err) {
        if (!cancelled) {
          setStatus("Could not load");
          setError(err instanceof Error ? err.message : "Could not load the leaderboard.");
        }
      }
    });
    return () => {
      cancelled = true;
    };
  }, [auth.confirmed, auth.user, auth]);

  const active = board?.periods[period];
  const podium = active?.rows.slice(0, 3) || [];
  const ordered = [podium[1], podium[0], podium[2]].filter(Boolean);
  const max = Math.max(1, ...(active?.chart.map((bar) => bar.tests) || [1]));

  return (
    <div className="theme-ink oracle-page">
      <SiteNav paid promo={false} onAccount={() => setAccountOpen(true)} onUpgrade={() => undefined} />
      <main className="pt-[76px]">
        <section className="oracle-board theme-ink py-12 md:py-16 min-h-[70vh]">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="oracle-leaderboard-heading">
              <div>
                <p className="eyebrow text-clay mb-3">Live from completed tests</p>
                <h1 className="font-display text-3xl sm:text-5xl font-bold text-white">Oracle leaderboard</h1>
                <p className="text-white/55 text-sm mt-3 max-w-xl">{board?.ranking || "Ranked from signed-in tests."}</p>
              </div>
              <span className="oracle-view-only">
                <Radio className="w-4 h-4" />
                {status}
              </span>
            </div>
            <section className="oracle-board-rules" aria-label="How points are counted">
              <p className="eyebrow text-clay">Scoring</p>
              <h2>How your points are counted</h2>
              <ul>
                <li>Sign in and finish a test. The score saved is your percentage correct.</li>
                <li>Today starts at midnight. The week starts Monday 00:00. The month starts on the 1st. Times are Lagos.</li>
                <li>Only your first 3 tests each day count. A later test that day is saved, but it does not change your rank.</li>
                <li>
                  <strong>Points = average × 10 + improvement × 4 + days × 15.</strong>
                </li>
                <li>Average is the mean of the tests that counted.</li>
                <li>Improvement is the later half of those tests minus the earlier half. It starts once 4 tests have counted. A drop does not take points away.</li>
                <li>Days is how many different days those counted tests fell on.</li>
                <li>If points are tied, the higher average is ahead, then the student with more counted tests.</li>
                <li>The chart counts every finished test. The rank does not count past 3 a day.</li>
              </ul>
            </section>
            <div className="oracle-board-tabs mt-6" role="tablist" aria-label="Ranking period">
              {PERIODS.map(([id, label]) => (
                <button key={id} type="button" className={period === id ? "is-active" : ""} onClick={() => setPeriod(id)}>
                  {label}
                </button>
              ))}
            </div>
            <div className="oracle-board-grid">
              <div>
                <div className="oracle-podium">
                  {ordered.length ? (
                    ordered.map((row) => (
                      <article key={row.rank} className={`oracle-podium-card is-rank-${row.rank}${row.you ? " is-you" : ""}`}>
                        <b>0{row.rank}</b>
                        <strong>
                          {row.name}
                          {row.you ? " · You" : ""}
                        </strong>
                        <span>{row.average}%</span>
                      </article>
                    ))
                  ) : (
                    <p className="oracle-board-empty">No ranked tests in this period yet.</p>
                  )}
                </div>
                <div className="oracle-table-wrap">
                  <table className="oracle-table">
                    <thead>
                      <tr>
                        <th>Rank</th>
                        <th>Student</th>
                        <th>Avg</th>
                        <th>Change</th>
                        <th>Tests</th>
                        <th>Days</th>
                      </tr>
                    </thead>
                    <tbody>
                      {error ? (
                        <tr>
                          <td colSpan={6}>{error}</td>
                        </tr>
                      ) : active?.rows.length ? (
                        active.rows.map((row) => (
                          <tr key={row.rank} className={row.rank === 1 ? "oracle-winner" : row.you ? "is-you" : ""}>
                            <td>{String(row.rank).padStart(2, "0")}</td>
                            <td>
                              <strong>{row.name}</strong>
                              {row.rank === 1 ? <span className="oracle-winner-tag">Prize leader</span> : null}
                              {row.you ? <span className="oracle-you-tag">You</span> : null}
                            </td>
                            <td>{row.average}%</td>
                            <td>{row.improvement > 0 ? `+${row.improvement}` : row.improvement}</td>
                            <td>{row.tests}</td>
                            <td>{row.days}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={6}>Complete a test while signed in and the board will update.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
              <aside className="oracle-board-side">
                <section className="oracle-chart-card">
                  <p className="eyebrow text-clay">Statistics</p>
                  <h2 className="font-display text-xl font-bold text-white mt-1">{active?.label || "This week"}</h2>
                  <div className="oracle-chart">
                    {(active?.chart || []).map((bar) => (
                      <div className="oracle-bar" key={bar.label}>
                        <i style={{ height: `${Math.max(8, Math.round((bar.tests / max) * 100))}%` }} />
                        <b>{bar.tests ? `${bar.average}%` : "–"}</b>
                        <span>{bar.label}</span>
                      </div>
                    ))}
                  </div>
                </section>
                <PrizeCard prize={board?.prizes.weekly || null} whatsapp={board?.whatsapp || "2348165689362"} />
                <PrizeCard prize={board?.prizes.monthly || null} whatsapp={board?.whatsapp || "2348165689362"} />
              </aside>
            </div>
          </div>
        </section>
      </main>
      <AccountDialog open={accountOpen} onClose={() => setAccountOpen(false)} paid={false} promo={false} premiumUntil="" usageText="" courseUsageText="" />
    </div>
  );
}
