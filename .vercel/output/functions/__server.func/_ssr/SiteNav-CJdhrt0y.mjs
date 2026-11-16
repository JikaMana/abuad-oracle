import { o as __toESM } from "../_runtime.mjs";
import { J as require_react, x as require_jsx_runtime, y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as UserRound, t as X, u as Lock } from "../_libs/lucide-react.mjs";
import { n as authMessage, r as useOracleAuth } from "./router-DoDF-ZC9.mjs";
import { l as startPayment, t as ADMIN_EMAIL } from "./types-71MtVtj7.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/SiteNav-CJdhrt0y.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function AccountDialog({ open, onClose, paid, promo, premiumUntil, usageText, courseUsageText }) {
	const auth = useOracleAuth();
	const dialogRef = (0, import_react.useRef)(null);
	const [email, setEmail] = (0, import_react.useState)("");
	const [password, setPassword] = (0, import_react.useState)("");
	const [status, setStatus] = (0, import_react.useState)("");
	const [busy, setBusy] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		const node = dialogRef.current;
		if (!open || !node) return;
		if (!node.open) node.showModal();
		return () => {
			if (node.open) node.close();
		};
	}, [open]);
	if (!open) return null;
	async function run(action, success) {
		setBusy(true);
		setStatus("");
		try {
			await action();
			setStatus(success);
			onClose();
		} catch (error) {
			setStatus(authMessage(error));
		} finally {
			setBusy(false);
		}
	}
	async function pay() {
		setBusy(true);
		setStatus("Opening secure Paystack checkout…");
		try {
			const token = await auth.getToken();
			if (!token) throw new Error("Sign in to continue to Paystack.");
			const url = await startPayment(token);
			if (!url) throw new Error("Payment couldn't be started.");
			window.location.assign(url);
		} catch (error) {
			setStatus(error instanceof Error ? error.message : "Payment couldn't be started.");
			setBusy(false);
		}
	}
	const admin = auth.user?.email.toLowerCase() === ADMIN_EMAIL;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dialog", {
		ref: dialogRef,
		className: "oracle-account-dialog",
		"aria-labelledby": "account-dialog-title",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				className: "oracle-register-close",
				"aria-label": "Close account dialog",
				onClick: onClose,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { "aria-hidden": "true" })
			}),
			auth.user ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "eyebrow text-clay",
					children: "Account profile"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					id: "account-dialog-title",
					className: "font-display text-2xl font-bold text-ink mt-2",
					children: "Your profile"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "or-account-email",
					children: auth.user.email || "Signed in"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "oracle-profile-plan",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: promo ? "Free through 20 Nov" : paid ? "Premium access" : "Free plan" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: premiumUntil })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "oracle-profile-usage",
					children: usageText || "No paid practice recorded yet."
				}),
				courseUsageText ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "oracle-profile-usage-courses",
					children: courseUsageText
				}) : null,
				paid ? null : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "oracle-profile-usage",
					children: "This payment helps keep the service running."
				}),
				paid ? null : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "btn btn-clay w-full py-3 mt-4",
					disabled: busy,
					onClick: pay,
					children: "Get paid access · ₦1,000"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "oracle-text-button mt-5",
					onClick: () => auth.signOutUser().then(onClose),
					children: "Sign out"
				}),
				admin ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/admin",
					className: "oracle-text-button mt-3",
					onClick: onClose,
					children: "Admin dashboard"
				}) : null
			] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "eyebrow text-clay",
					children: "Your Exam Oracle account"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					id: "account-dialog-title",
					className: "font-display text-2xl font-bold text-ink mt-2",
					children: "Sign in or create an account"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "oracle-account-copy",
					children: "Sign in to take tests, sync your results, and manage your access."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "oracle-account-fields",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							htmlFor: "account-email-input",
							children: "Email address"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							id: "account-email-input",
							className: "oracle-select",
							type: "email",
							autoComplete: "email",
							placeholder: "you@example.com",
							value: email,
							onChange: (event) => setEmail(event.target.value)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							htmlFor: "account-password",
							children: "Password"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							id: "account-password",
							className: "oracle-select",
							type: "password",
							autoComplete: "current-password",
							placeholder: "At least 6 characters",
							value: password,
							onChange: (event) => setPassword(event.target.value)
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "or-account-actions",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "btn btn-ink px-5",
							disabled: busy,
							onClick: () => run(() => auth.signInEmail(email, password), "Signed in."),
							children: "Sign in"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "btn btn-clay px-5",
							disabled: busy,
							onClick: () => run(() => auth.createAccount(email, password), "Account created."),
							children: "Create account"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "btn btn-ghost-light px-5",
							disabled: busy,
							onClick: () => run(() => auth.signInGoogle(), "Signed in."),
							children: "Continue with Google"
						})
					]
				})
			] }),
			status ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "or-code-status",
				role: "status",
				children: status
			}) : null
		]
	});
}
function PrizeCard({ prize, whatsapp }) {
	if (!prize) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("article", {
		className: "oracle-claim is-locked",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Prize status is unavailable." })
	});
	const message = `Exam Oracle prize claim. My code is ${prize.code || ""}.`;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
		className: `oracle-claim ${prize.locked ? "is-locked" : "is-open"}`,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "eyebrow text-clay",
				children: prize.title
			}),
			prize.reward ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { children: prize.reward }) : null,
			prize.yours && prize.code ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "oracle-claim-code",
					children: prize.code
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "oracle-claim-help",
					children: prize.note || "Message the admin with this code to confirm the prize."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
					className: "btn btn-clay",
					target: "_blank",
					rel: "noopener",
					href: `https://wa.me/${whatsapp}?text=${encodeURIComponent(message)}`,
					children: "Message admin"
				})
			] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "oracle-claim-lock",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { "aria-hidden": "true" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Locked" })]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: prize.note || "This prize is locked." })] })
		]
	});
}
function SiteNav({ paid, promo, onAccount, onUpgrade }) {
	const { user, confirmed } = useOracleAuth();
	const label = user ? user.displayName || user.email || "Profile" : confirmed ? "Sign in" : "Account";
	const hideCommerce = paid && !promo;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
		className: "nav-shell fixed top-0 left-0 w-full z-[65]",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-[76px] flex items-center justify-between gap-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/",
					className: "site-brand",
					"aria-label": "Burhan Tutors home",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["BURHAN ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "TUTORS" })] })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
					className: "flex items-center gap-5 text-[13px] text-white/70",
					"aria-label": "Main navigation",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/",
							className: "hover:text-white",
							children: "Academy"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/leaderboard",
							className: "hover:text-white",
							children: "Leaderboard"
						}),
						user?.email.toLowerCase() === "burhantutors@gmail.com" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/admin",
							className: "hover:text-white",
							children: "Admin"
						}) : null
					]
				}),
				hideCommerce ? null : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "btn btn-clay oracle-nav-upgrade",
					onClick: onUpgrade,
					children: promo ? "Free through 20 Nov" : "Go Premium"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					className: "oracle-account-trigger",
					onClick: onAccount,
					"aria-haspopup": "dialog",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserRound, {
						className: "w-4 h-4",
						"aria-hidden": "true"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: label })]
				})
			]
		})
	});
}
//#endregion
export { PrizeCard as n, SiteNav as r, AccountDialog as t };
