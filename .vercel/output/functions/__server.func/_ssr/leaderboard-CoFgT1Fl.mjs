import { o as __toESM } from "../_runtime.mjs";
import { J as require_react, x as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { s as Radio } from "../_libs/lucide-react.mjs";
import { r as useOracleAuth } from "./router-DoDF-ZC9.mjs";
import { a as fetchLeaderboard } from "./types-71MtVtj7.mjs";
import { n as PrizeCard, r as SiteNav, t as AccountDialog } from "./SiteNav-CJdhrt0y.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/leaderboard-CoFgT1Fl.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var PERIODS = [
	["daily", "Today"],
	["weekly", "This week"],
	["monthly", "This month"]
];
function LeaderboardPage() {
	const auth = useOracleAuth();
	const [board, setBoard] = (0, import_react.useState)(null);
	const [period, setPeriod] = (0, import_react.useState)("weekly");
	const [status, setStatus] = (0, import_react.useState)("Loading");
	const [error, setError] = (0, import_react.useState)("");
	const [accountOpen, setAccountOpen] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
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
	}, [
		auth.confirmed,
		auth.user,
		auth
	]);
	const active = board?.periods[period];
	const podium = active?.rows.slice(0, 3) || [];
	const ordered = [
		podium[1],
		podium[0],
		podium[2]
	].filter(Boolean);
	const max = Math.max(1, ...active?.chart.map((bar) => bar.tests) || [1]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "theme-ink oracle-page",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteNav, {
				paid: true,
				promo: false,
				onAccount: () => setAccountOpen(true),
				onUpgrade: () => void 0
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
				className: "pt-[76px]",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
					className: "oracle-board theme-ink py-12 md:py-16 min-h-[70vh]",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "max-w-6xl mx-auto px-4 sm:px-6 lg:px-8",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "oracle-leaderboard-heading",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "eyebrow text-clay mb-3",
										children: "Live from completed tests"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
										className: "font-display text-3xl sm:text-5xl font-bold text-white",
										children: "Oracle leaderboard"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-white/55 text-sm mt-3 max-w-xl",
										children: board?.ranking || "Ranked from signed-in tests."
									})
								] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "oracle-view-only",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Radio, { className: "w-4 h-4" }), status]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
								className: "oracle-board-rules",
								"aria-label": "How points are counted",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "eyebrow text-clay",
										children: "Scoring"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "How your points are counted" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Sign in and finish a test. The score saved is your percentage correct." }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Today starts at midnight. The week starts Monday 00:00. The month starts on the 1st. Times are Lagos." }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Only your first 3 tests each day count. A later test that day is saved, but it does not change your rank." }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Points = average × 10 + improvement × 4 + days × 15." }) }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Average is the mean of the tests that counted." }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Improvement is the later half of those tests minus the earlier half. It starts once 4 tests have counted. A drop does not take points away." }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Days is how many different days those counted tests fell on." }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "If points are tied, the higher average is ahead, then the student with more counted tests." }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "The chart counts every finished test. The rank does not count past 3 a day." })
									] })
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "oracle-board-tabs mt-6",
								role: "tablist",
								"aria-label": "Ranking period",
								children: PERIODS.map(([id, label]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									className: period === id ? "is-active" : "",
									onClick: () => setPeriod(id),
									children: label
								}, id))
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "oracle-board-grid",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "oracle-podium",
									children: ordered.length ? ordered.map((row) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
										className: `oracle-podium-card is-rank-${row.rank}${row.you ? " is-you" : ""}`,
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("b", { children: ["0", row.rank] }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("strong", { children: [row.name, row.you ? " · You" : ""] }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [row.average, "%"] })
										]
									}, row.rank)) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "oracle-board-empty",
										children: "No ranked tests in this period yet."
									})
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "oracle-table-wrap",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
										className: "oracle-table",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Rank" }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Student" }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Avg" }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Change" }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Tests" }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Days" })
										] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											colSpan: 6,
											children: error
										}) }) : active?.rows.length ? active.rows.map((row) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
											className: row.rank === 1 ? "oracle-winner" : row.you ? "is-you" : "",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: String(row.rank).padStart(2, "0") }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", { children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: row.name }),
													row.rank === 1 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "oracle-winner-tag",
														children: "Prize leader"
													}) : null,
													row.you ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "oracle-you-tag",
														children: "You"
													}) : null
												] }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", { children: [row.average, "%"] }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: row.improvement > 0 ? `+${row.improvement}` : row.improvement }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: row.tests }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: row.days })
											]
										}, row.rank)) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											colSpan: 6,
											children: "Complete a test while signed in and the board will update."
										}) }) })]
									})
								})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
									className: "oracle-board-side",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
											className: "oracle-chart-card",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "eyebrow text-clay",
													children: "Statistics"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
													className: "font-display text-xl font-bold text-white mt-1",
													children: active?.label || "This week"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "oracle-chart",
													children: (active?.chart || []).map((bar) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "oracle-bar",
														children: [
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { style: { height: `${Math.max(8, Math.round(bar.tests / max * 100))}%` } }),
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: bar.tests ? `${bar.average}%` : "–" }),
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: bar.label })
														]
													}, bar.label))
												})
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PrizeCard, {
											prize: board?.prizes.weekly || null,
											whatsapp: board?.whatsapp || "2348165689362"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PrizeCard, {
											prize: board?.prizes.monthly || null,
											whatsapp: board?.whatsapp || "2348165689362"
										})
									]
								})]
							})
						]
					})
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AccountDialog, {
				open: accountOpen,
				onClose: () => setAccountOpen(false),
				paid: false,
				promo: false,
				premiumUntil: "",
				usageText: "",
				courseUsageText: ""
			})
		]
	});
}
var SplitComponent = LeaderboardPage;
//#endregion
export { SplitComponent as component };
