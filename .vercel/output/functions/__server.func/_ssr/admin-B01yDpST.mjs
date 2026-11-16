import { o as __toESM } from "../_runtime.mjs";
import { J as require_react, x as require_jsx_runtime, y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { r as useOracleAuth } from "./router-DoDF-ZC9.mjs";
import { n as fetchAdmin, t as ADMIN_EMAIL } from "./types-71MtVtj7.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin-B01yDpST.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function naira(value) {
	return `₦${Number(value || 0).toLocaleString("en-NG")}`;
}
function when(iso) {
	if (!iso) return "—";
	const date = new Date(iso);
	if (Number.isNaN(date.getTime())) return "—";
	return date.toLocaleString("en-GB", {
		day: "numeric",
		month: "short",
		hour: "2-digit",
		minute: "2-digit",
		timeZone: "Africa/Lagos"
	});
}
function PrizeBlock({ title, prize, empty }) {
	const [copied, setCopied] = (0, import_react.useState)(false);
	if (!prize) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [title, ": nobody yet."] });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: title }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: prize.name }),
			" · ",
			prize.points,
			" pts · ",
			prize.average,
			"% · ",
			prize.tests,
			" tests"
		] }),
		prize.code ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "oracle-admin-code",
			children: prize.code
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			className: "btn btn-clay",
			onClick: () => {
				navigator.clipboard?.writeText(prize.code || "");
				setCopied(true);
			},
			children: copied ? "Copied" : "Copy code"
		})] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: empty })
	] });
}
function AdminPage() {
	const auth = useOracleAuth();
	const [data, setData] = (0, import_react.useState)(null);
	const [error, setError] = (0, import_react.useState)("");
	const [tab, setTab] = (0, import_react.useState)("prizes");
	const allowed = auth.user?.email.toLowerCase() === ADMIN_EMAIL;
	(0, import_react.useEffect)(() => {
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
				setData(await fetchAdmin(token));
			} catch (err) {
				setError(err instanceof Error ? err.message : "The admin dashboard could not be loaded.");
			}
		});
	}, [
		auth,
		auth.confirmed,
		auth.user,
		allowed
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "theme-ink oracle-page",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
			className: "nav-shell fixed top-0 left-0 w-full z-[65]",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-[76px] flex items-center justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/",
					className: "site-brand",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["BURHAN ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "TUTORS" })] })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
					className: "flex items-center gap-5 text-[13px] text-white/70",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/exam-oracle",
						className: "hover:text-white",
						children: "Exam Oracle"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/leaderboard",
						className: "hover:text-white",
						children: "Leaderboard"
					})]
				})]
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
			className: "pt-[76px] oracle-admin",
			children: !data ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "oracle-admin-gate",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "eyebrow text-clay",
						children: "Exam Oracle"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "font-display text-3xl font-bold",
						children: error ? "Not available" : "Checking your account"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: error || "Using the sign-in already saved in this browser." }),
					error && !auth.user ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-4",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							className: "btn btn-clay",
							to: "/exam-oracle",
							children: "Open Exam Oracle"
						})
					}) : null
				]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "eyebrow text-clay mb-3",
						children: "Private"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "font-display text-3xl sm:text-5xl font-bold text-white",
						children: "Admin dashboard"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-white/55 text-sm mt-3 max-w-2xl",
						children: "Live counts from sign-ins, payments and completed tests. Times are Lagos."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "oracle-admin-note mt-3",
						children: [
							data.authNote,
							data.truncated ? "Account count stops at 3,000." : "",
							data.scoresTruncated ? "Practice figures use the latest 800 scored tests." : "",
							`${data.promo?.active ? "Free access is on until " : "Free access ended "}${data.promo?.until || ""}. Paid access is ${naira(data.priceNaira || 1e3)}. ${data.profiles || 0} student profiles. ${data.newThisWeek || 0} new accounts this week. ${data.pendingPayments || 0} payments still pending. ${data.groqKeys || 0} Groq keys connected.`
						].filter(Boolean).join(" ")
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "oracle-admin-stats",
						children: [
							["Accounts", data.accounts],
							["Paid access now", data.paidNow],
							["Revenue", naira(data.revenueNaira)],
							["Completed tests", data.tests],
							["Active today", data.activeToday],
							["Tests today", data.testsToday],
							["Tests this week", data.testsThisWeek],
							["Average score", `${data.average}%`]
						].map(([label, value]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
							className: "oracle-admin-stat",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: label }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: value })]
						}, String(label)))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "oracle-admin-tabs oracle-board-tabs",
						role: "tablist",
						children: [
							"prizes",
							"courses",
							"accounts",
							"payments"
						].map((name) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: tab === name ? "is-active" : "",
							onClick: () => setTab(name),
							children: name[0].toUpperCase() + name.slice(1)
						}, name))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "oracle-admin-panels",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
								className: `oracle-admin-panel${tab === "prizes" ? " is-active" : ""}`,
								"data-admin-panel": "prizes",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "eyebrow text-clay",
										children: "Prizes"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PrizeBlock, {
										title: "Last week's winner",
										prize: data.prize?.lastWeek,
										empty: ""
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PrizeBlock, {
										title: "This week, still locked",
										prize: data.prize?.thisWeek,
										empty: "No code yet. It stays locked until Monday 00:00, including for this leader."
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PrizeBlock, {
										title: "This month's leader",
										prize: data.prize?.thisMonth,
										empty: ""
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
								className: `oracle-admin-panel${tab === "courses" ? " is-active" : ""}`,
								"data-admin-panel": "courses",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "eyebrow text-clay",
										children: "Practice"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "Tests by course" }),
									(data.courses || []).map((course) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "oracle-admin-course",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: course.course }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { style: { width: `${Math.max(8, Math.round(course.tests / Math.max(...(data.courses || []).map((item) => item.tests), 1) * 100))}%` } }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("b", { children: [
												course.tests,
												" · ",
												course.average,
												"%"
											] })
										]
									}, course.course))
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
								className: `oracle-admin-panel${tab === "accounts" ? " is-active" : ""}`,
								"data-admin-panel": "accounts",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "eyebrow text-clay",
										children: "Sign-ins"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "Newest accounts" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "oracle-table-wrap",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
											className: "oracle-table w-full",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Email" }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Joined" }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Access" })
											] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: (data.recentAccounts || []).map((account) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: account.email }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: when(account.joined) }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: account.paid ? "Paid" : "Free" })
											] }, account.email)) })]
										})
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
								className: `oracle-admin-panel${tab === "payments" ? " is-active" : ""}`,
								"data-admin-panel": "payments",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "eyebrow text-clay",
										children: "Paystack"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "Recent payments" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "oracle-table-wrap",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
											className: "oracle-table w-full",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Email" }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Amount" }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Status" })
											] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: (data.recentPayments || []).map((payment) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: payment.email }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: naira(payment.amount || 0) }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", { children: [
													payment.status,
													" · ",
													when(payment.at)
												] })
											] }, `${payment.email}-${payment.at}`)) })]
										})
									})
								]
							})
						]
					})
				]
			})
		})]
	});
}
var SplitComponent = AdminPage;
//#endregion
export { SplitComponent as component };
