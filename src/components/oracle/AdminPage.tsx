import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { fetchAdmin } from "@/lib/oracle/api";
import { useOracleAuth } from "@/lib/oracle/auth";
import { ADMIN_EMAIL } from "@/lib/oracle/types";

type AdminData = {
  accounts: number;
  paidNow: number;
  revenueNaira: number;
  tests: number;
  activeToday: number;
  testsToday: number;
  testsThisWeek: number;
  average: number;
  authNote?: string;
  truncated?: boolean;
  scoresTruncated?: boolean;
  promo?: { active?: boolean; until?: string };
  priceNaira?: number;
  profiles?: number;
  newThisWeek?: number;
  pendingPayments?: number;
  groqKeys?: number;
  courses?: { course: string; tests: number; average: number }[];
  recentAccounts?: { email: string; joined?: string; paid?: boolean }[];
  recentPayments?: { email: string; amount?: number; status?: string; at?: string }[];
  prize?: {
    lastWeek?: { name?: string; points?: number; average?: number; tests?: number; code?: string };
    thisWeek?: { name?: string; points?: number; average?: number; tests?: number; code?: string };
    thisMonth?: { name?: string; points?: number; average?: number; tests?: number; code?: string };
  };
};

function naira(value: number) {
  return `₦${Number(value || 0).toLocaleString("en-NG")}`;
}

function when(iso?: string) {
  if (!iso) return "—";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleString("en-GB", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit", timeZone: "Africa/Lagos" });
}

function PrizeBlock({ title, prize, empty }: { title: string; prize?: { name?: string; points?: number; average?: number; tests?: number; code?: string }; empty: string }) {
  const [copied, setCopied] = useState(false);
  if (!prize) return <p>{title}: nobody yet.</p>;
  return (
    <div>
      <h2>{title}</h2>
      <p>
        <strong>{prize.name}</strong> · {prize.points} pts · {prize.average}% · {prize.tests} tests
      </p>
      {prize.code ? (
        <>
          <p className="oracle-admin-code">{prize.code}</p>
          <button
            type="button"
            className="btn btn-clay"
            onClick={() => {
              navigator.clipboard?.writeText(prize.code || "");
              setCopied(true);
            }}
          >
            {copied ? "Copied" : "Copy code"}
          </button>
        </>
      ) : (
        <p>{empty}</p>
      )}
    </div>
  );
}

export function AdminPage() {
  const auth = useOracleAuth();
  const [data, setData] = useState<AdminData | null>(null);
  const [error, setError] = useState("");
  const [tab, setTab] = useState("prizes");
  const allowed = auth.user?.email.toLowerCase() === ADMIN_EMAIL;

  useEffect(() => {
    if (!auth.confirmed) return;
    if (!auth.user) {
      setError("Sign in with the Exam Oracle admin account, then open this page again.");
      return;
    }
    if (!allowed) {
      setError("This dashboard is only for the Exam Oracle admin.");
      return;
    }
    auth.getToken().then(async (token) => {
      if (!token) return;
      try {
        setData((await fetchAdmin(token)) as AdminData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "The admin dashboard could not be loaded.");
      }
    });
  }, [auth, auth.confirmed, auth.user, allowed]);

  return (
    <div className="theme-ink oracle-page">
      <header className="nav-shell fixed top-0 left-0 w-full z-[65]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-[76px] flex items-center justify-between">
          <Link to="/" className="site-brand">
            <span>
              BURHAN <b>TUTORS</b>
            </span>
          </Link>
          <nav className="flex items-center gap-5 text-[13px] text-white/70">
            <Link to="/exam-oracle" className="hover:text-white">
              Exam Oracle
            </Link>
            <Link to="/leaderboard" className="hover:text-white">
              Leaderboard
            </Link>
          </nav>
        </div>
      </header>
      <main className="pt-[76px] oracle-admin">
        {!data ? (
          <section className="oracle-admin-gate">
            <p className="eyebrow text-clay">Exam Oracle</p>
            <h1 className="font-display text-3xl font-bold">{error ? "Not available" : "Checking your account"}</h1>
            <p>{error || "Using the sign-in already saved in this browser."}</p>
            {error && !auth.user ? (
              <p className="mt-4">
                <Link className="btn btn-clay" to="/exam-oracle">
                  Open Exam Oracle
                </Link>
              </p>
            ) : null}
          </section>
        ) : (
          <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <p className="eyebrow text-clay mb-3">Private</p>
            <h1 className="font-display text-3xl sm:text-5xl font-bold text-white">Admin dashboard</h1>
            <p className="text-white/55 text-sm mt-3 max-w-2xl">Live counts from sign-ins, payments and completed tests. Times are Lagos.</p>
            <p className="oracle-admin-note mt-3">
              {[
                data.authNote,
                data.truncated ? "Account count stops at 3,000." : "",
                data.scoresTruncated ? "Practice figures use the latest 800 scored tests." : "",
                `${data.promo?.active ? "Free access is on until " : "Free access ended "}${data.promo?.until || ""}. Paid access is ${naira(data.priceNaira || 1000)}. ${data.profiles || 0} student profiles. ${data.newThisWeek || 0} new accounts this week. ${data.pendingPayments || 0} payments still pending. ${data.groqKeys || 0} Groq keys connected.`,
              ]
                .filter(Boolean)
                .join(" ")}
            </p>
            <div className="oracle-admin-stats">
              {[
                ["Accounts", data.accounts],
                ["Paid access now", data.paidNow],
                ["Revenue", naira(data.revenueNaira)],
                ["Completed tests", data.tests],
                ["Active today", data.activeToday],
                ["Tests today", data.testsToday],
                ["Tests this week", data.testsThisWeek],
                ["Average score", `${data.average}%`],
              ].map(([label, value]) => (
                <article key={String(label)} className="oracle-admin-stat">
                  <span>{label}</span>
                  <b>{value}</b>
                </article>
              ))}
            </div>
            <div className="oracle-admin-tabs oracle-board-tabs" role="tablist">
              {["prizes", "courses", "accounts", "payments"].map((name) => (
                <button key={name} type="button" className={tab === name ? "is-active" : ""} onClick={() => setTab(name)}>
                  {name[0].toUpperCase() + name.slice(1)}
                </button>
              ))}
            </div>
            <div className="oracle-admin-panels">
              <article className={`oracle-admin-panel${tab === "prizes" ? " is-active" : ""}`} data-admin-panel="prizes">
                <p className="eyebrow text-clay">Prizes</p>
                <PrizeBlock title="Last week's winner" prize={data.prize?.lastWeek} empty="" />
                <PrizeBlock title="This week, still locked" prize={data.prize?.thisWeek} empty="No code yet. It stays locked until Monday 00:00, including for this leader." />
                <PrizeBlock title="This month's leader" prize={data.prize?.thisMonth} empty="" />
              </article>
              <article className={`oracle-admin-panel${tab === "courses" ? " is-active" : ""}`} data-admin-panel="courses">
                <p className="eyebrow text-clay">Practice</p>
                <h2>Tests by course</h2>
                {(data.courses || []).map((course) => (
                  <div className="oracle-admin-course" key={course.course}>
                    <span>{course.course}</span>
                    <i style={{ width: `${Math.max(8, Math.round((course.tests / Math.max(...(data.courses || []).map((item) => item.tests), 1)) * 100))}%` }} />
                    <b>
                      {course.tests} · {course.average}%
                    </b>
                  </div>
                ))}
              </article>
              <article className={`oracle-admin-panel${tab === "accounts" ? " is-active" : ""}`} data-admin-panel="accounts">
                <p className="eyebrow text-clay">Sign-ins</p>
                <h2>Newest accounts</h2>
                <div className="oracle-table-wrap">
                  <table className="oracle-table w-full">
                    <thead>
                      <tr>
                        <th>Email</th>
                        <th>Joined</th>
                        <th>Access</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(data.recentAccounts || []).map((account) => (
                        <tr key={account.email}>
                          <td>{account.email}</td>
                          <td>{when(account.joined)}</td>
                          <td>{account.paid ? "Paid" : "Free"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </article>
              <article className={`oracle-admin-panel${tab === "payments" ? " is-active" : ""}`} data-admin-panel="payments">
                <p className="eyebrow text-clay">Paystack</p>
                <h2>Recent payments</h2>
                <div className="oracle-table-wrap">
                  <table className="oracle-table w-full">
                    <thead>
                      <tr>
                        <th>Email</th>
                        <th>Amount</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(data.recentPayments || []).map((payment) => (
                        <tr key={`${payment.email}-${payment.at}`}>
                          <td>{payment.email}</td>
                          <td>{naira(payment.amount || 0)}</td>
                          <td>
                            {payment.status} · {when(payment.at)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </article>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
