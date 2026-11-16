import { o as __toESM } from "../_runtime.mjs";
import { J as require_react, x as require_jsx_runtime, y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { c as Play, d as Lightbulb, g as ArrowRight, o as RotateCcw, p as CreditCard, r as Trophy, t as X } from "../_libs/lucide-react.mjs";
import { r as useOracleAuth } from "./router-DoDF-ZC9.mjs";
import { a as fetchLeaderboard, c as saveHistory, i as fetchHistory, o as fetchQuestions, r as fetchConfig, s as postActivity, u as verifyPayment } from "./types-71MtVtj7.mjs";
import { n as PrizeCard, r as SiteNav, t as AccountDialog } from "./SiteNav-CJdhrt0y.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/exam-oracle-D20pQKYG.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function normalizeAnswer(value) {
	return value.toLowerCase().replace(/√/g, "sqrt").replace(/sqrt\(([^)]+)\)/g, "sqrt$1").replace(/±/g, "+-").replace(/×/g, "*").replace(/[−–]/g, "-").replace(/\s+/g, "");
}
function bareNumber(value) {
	let text = value.trim();
	if (/[±√]|sqrt|\+\/-/.test(text)) return null;
	text = text.replace(/\s*[a-z][a-z0-9/.^]*$/i, "");
	if (!/^-?\d+(?:\.\d+)?$/.test(text)) return null;
	const number = Number(text);
	return Number.isFinite(number) ? number : null;
}
function sameAnswer(left, right) {
	const a = normalizeAnswer(left);
	const b = normalizeAnswer(right);
	if (!a || !b) return false;
	if (a === b) return true;
	const leftNumber = bareNumber(left);
	const rightNumber = bareNumber(right);
	return leftNumber != null && rightNumber != null && leftNumber === rightNumber;
}
function looksLikeAnswer(value) {
	const text = value.trim();
	if (!text || text.length > 48) return false;
	if (/^(the|a|an|not|because|when|this|that|which|where)\b/i.test(text)) return false;
	return /\d|√|sqrt|±/.test(text);
}
/** The last result the explanation actually reaches decides the marked option. */
function lockAnswerToExplanation(question) {
	if (!Array.isArray(question.options) || question.options.length !== 4) return question;
	const steps = Array.isArray(question.steps) ? question.steps.map((step) => String(step)) : [];
	const text = steps.join("\n");
	const body = text.replace(/(?:the correct(?:\s+[a-z0-9/^]+){0,6}\s+is|the result is|so the answer is|choose option)\s+(?!not\b)(?![^.]*?=)[^.]*(?:\.|$)/gi, " ");
	const found = [];
	for (const match of body.matchAll(/=\s*((?:(?!\.\s|\.$)[^\n]){1,80})|\b(?:is|equals)\s+((?:(?!\.\s|\.$)[^\n]){1,40})/gi)) {
		const rhs = (match[1] || match[2] || "").split("=").pop()?.trim().replace(/[,;].*$/, "").trim() || "";
		if (looksLikeAnswer(rhs)) found.push(rhs);
	}
	const lead = /(?:the correct(?:\s+[a-z0-9/^]+){0,6}\s+is|the result is|so the answer is)\s+(?!not\b)/gi;
	const claims = [];
	for (const match of text.matchAll(lead)) {
		const rest = text.slice((match.index ?? 0) + match[0].length);
		const end = rest.search(/\.(?!\d)/);
		const claim = (end === -1 ? rest : rest.slice(0, end)).trim();
		if (claim) claims.push(claim);
	}
	const result = found[found.length - 1] || claims[claims.length - 1];
	if (!result) return question;
	let options = question.options.slice();
	let answer = options.findIndex((option) => sameAnswer(option, result));
	if (answer < 0) {
		const slot = question.answer >= 0 && question.answer < options.length ? question.answer : 0;
		options = options.slice();
		options[slot] = result.trim();
		answer = slot;
	}
	const marked = options[answer];
	const cleaned = steps.map((step) => step.split(/(?<=[.?!])\s+/).filter((sentence) => {
		const hit = sentence.match(/(?:the correct(?:\s+[a-z0-9/^]+){0,6}\s+is|the result is|so the answer is)\s+(?!not\b)([^.]+)/i);
		return !hit || sameAnswer(hit[1], marked);
	}).join(" ").trim()).filter(Boolean);
	return {
		...question,
		options,
		answer,
		steps: cleaned.length ? cleaned : steps
	};
}
var SEEN_KEY = "oracle-seen-prompts";
var HISTORY_TTL = 12e4;
function readSeen() {
	try {
		return JSON.parse(localStorage.getItem(SEEN_KEY) || "[]");
	} catch {
		return [];
	}
}
function rememberSeen(prompts) {
	const next = [...readSeen(), ...prompts].slice(-40);
	try {
		localStorage.setItem(SEEN_KEY, JSON.stringify(next));
	} catch {}
}
function historyKey(uid) {
	return `oracle_history_v1_${uid}`;
}
function usePractice() {
	const auth = useOracleAuth();
	const [config, setConfig] = (0, import_react.useState)(null);
	const [courseId, setCourseId] = (0, import_react.useState)("");
	const [selectedTopics, setSelectedTopics] = (0, import_react.useState)([]);
	const [count, setCount] = (0, import_react.useState)(10);
	const [notice, setNotice] = (0, import_react.useState)("");
	const [phase, setPhase] = (0, import_react.useState)("build");
	const [questions, setQuestions] = (0, import_react.useState)([]);
	const [index, setIndex] = (0, import_react.useState)(0);
	const [answers, setAnswers] = (0, import_react.useState)([]);
	const [picked, setPicked] = (0, import_react.useState)(null);
	const [showSteps, setShowSteps] = (0, import_react.useState)(false);
	const [loading, setLoading] = (0, import_react.useState)(false);
	const [loadNote, setLoadNote] = (0, import_react.useState)("");
	const [history, setHistory] = (0, import_react.useState)([]);
	const [historyNote, setHistoryNote] = (0, import_react.useState)("");
	const [premiumUntil, setPremiumUntil] = (0, import_react.useState)("");
	const [usageText, setUsageText] = (0, import_react.useState)("");
	const [courseUsageText, setCourseUsageText] = (0, import_react.useState)("");
	const [weeklyPrize, setWeeklyPrize] = (0, import_react.useState)(null);
	const [monthlyPrize, setMonthlyPrize] = (0, import_react.useState)(null);
	const [whatsapp, setWhatsapp] = (0, import_react.useState)("2348165689362");
	const [registerOpen, setRegisterOpen] = (0, import_react.useState)(false);
	const testId = (0, import_react.useRef)("");
	const cancelled = (0, import_react.useRef)(false);
	const solutions = (0, import_react.useRef)(0);
	const target = (0, import_react.useRef)(0);
	const generating = (0, import_react.useRef)(false);
	const seenDuringTest = (0, import_react.useRef)([]);
	const course = config?.courses.find((item) => item.id === courseId) ?? config?.courses[0];
	const paid = Boolean(config?.paid);
	const used = course ? Number(config?.used?.[course.id] || 0) : 0;
	const remaining = Math.max(0, (config?.freeDaily || 10) - used);
	const maxCount = paid ? config?.maxPerTest || 60 : Math.max(1, remaining);
	const refreshConfig = (0, import_react.useCallback)(async () => {
		const token = await auth.getToken();
		const next = await fetchConfig(token);
		setConfig(next);
		setCourseId((current) => current || next.courses[0]?.id || "");
	}, [auth]);
	(0, import_react.useEffect)(() => {
		if (!auth.confirmed) return;
		refreshConfig().catch(() => setNotice("The practice room could not be loaded. Refresh and try again."));
	}, [
		auth.confirmed,
		auth.user,
		refreshConfig
	]);
	(0, import_react.useEffect)(() => {
		if (!course) return;
		setSelectedTopics(course.topics);
	}, [course?.id]);
	const loadPrizes = (0, import_react.useCallback)(async () => {
		try {
			const token = await auth.getToken();
			const board = await fetchLeaderboard(token);
			setWeeklyPrize(board.prizes.weekly);
			setMonthlyPrize(board.prizes.monthly);
			if (board.whatsapp) setWhatsapp(board.whatsapp);
		} catch {}
	}, [auth]);
	const loadHistory = (0, import_react.useCallback)(async () => {
		if (!auth.user || !auth.confirmed) {
			setHistory([]);
			return;
		}
		const key = historyKey(auth.user.uid);
		let cached = null;
		try {
			cached = JSON.parse(sessionStorage.getItem(key) || "null");
		} catch {
			cached = null;
		}
		if (cached?.tests) {
			setHistory(cached.tests);
			setPremiumUntil(cached.premiumUntil || "");
			setUsageText(cached.usageText || "");
			setCourseUsageText(cached.courseUsageText || "");
			if (Date.now() - cached.savedAt < HISTORY_TTL) return;
		}
		try {
			const token = await auth.getToken();
			if (!token) return;
			const data = await fetchHistory(token);
			const tests = data.tests || [];
			const until = data.premiumUntil ? `Until ${new Date(data.premiumUntil).toLocaleDateString()}` : "";
			const usage = data.usage || {};
			const today = new Date(Date.now() + 36e5).toISOString().slice(0, 10);
			const usageLine = `${Number(usage.paidQuestionsTotal || 0)} paid questions total · ${Number(usage.paidQuestionsByDay?.[today] || 0)} today`;
			const byCourse = usage.paidQuestionsByCourse || {};
			const courseLine = Object.keys(byCourse).length ? `By course: ${Object.keys(byCourse).map((name) => `${name} ${Number(byCourse[name] || 0)}`).join(" · ")}` : "";
			setHistory(tests);
			setPremiumUntil(until);
			setUsageText(usageLine);
			setCourseUsageText(courseLine);
			sessionStorage.setItem(key, JSON.stringify({
				tests,
				savedAt: Date.now(),
				premiumUntil: until,
				usageText: usageLine,
				courseUsageText: courseLine
			}));
		} catch {
			if (!cached) setHistoryNote("Could not load your saved tests. Refresh to try again.");
		}
	}, [auth]);
	(0, import_react.useEffect)(() => {
		if (!auth.confirmed) return;
		loadHistory();
		loadPrizes();
	}, [
		auth.confirmed,
		auth.user?.uid,
		loadHistory,
		loadPrizes
	]);
	const startTest = (0, import_react.useCallback)(async () => {
		if (!auth.confirmed) {
			setNotice("Checking the saved sign-in…");
			return false;
		}
		if (!auth.user) {
			setNotice("Sign in before starting a test.");
			return false;
		}
		if (!course || !selectedTopics.length) {
			setNotice("Choose a course and at least one topic.");
			return false;
		}
		const size = Math.min(Math.max(1, count), maxCount);
		setNotice("");
		cancelled.current = false;
		generating.current = true;
		solutions.current = 0;
		target.current = size;
		seenDuringTest.current = [];
		testId.current = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
		setQuestions([]);
		setAnswers([]);
		setIndex(0);
		setPicked(null);
		setShowSteps(false);
		setPhase("test");
		setLoading(true);
		setLoadNote("Writing your first questions…");
		const token = await auth.getToken();
		if (token) postActivity(token, {
			action: "start",
			id: testId.current,
			course: course.label,
			topics: selectedTopics,
			total: size
		}).catch(() => void 0);
		let got = 0;
		let requests = 0;
		const maxRequests = Math.ceil(size / 3) + 6;
		while (!cancelled.current && got < size && requests < maxRequests) {
			const batchNo = requests++;
			try {
				const fresh = await auth.getToken(requests > 1);
				if (!fresh) throw new Error("Sign in to continue.");
				const body = await fetchQuestions(fresh, {
					course: course.id,
					topics: [selectedTopics[batchNo % selectedTopics.length], selectedTopics[(batchNo + 1) % selectedTopics.length]].filter((topic, topicIndex, list) => list.indexOf(topic) === topicIndex),
					count: Math.min(3, size - got),
					batch: batchNo,
					avoid: [...readSeen(), ...seenDuringTest.current].slice(-24)
				});
				const locked = (Array.isArray(body.questions) ? body.questions : []).map(lockAnswerToExplanation);
				if (!locked.length) continue;
				seenDuringTest.current.push(...locked.map((item) => item.prompt.slice(0, 140)));
				rememberSeen(locked.map((item) => item.prompt));
				got += locked.length;
				setQuestions((current) => [...current, ...locked].slice(0, size));
				setLoading(false);
			} catch (error) {
				if (got === 0) {
					generating.current = false;
					setNotice(error instanceof Error ? error.message : "Questions could not be written.");
					setPhase("build");
					setLoading(false);
					return false;
				}
				break;
			}
		}
		setLoading(false);
		generating.current = false;
		if (got === 0) {
			setNotice("Oracle couldn't write a usable set. Please try again.");
			setPhase("build");
			return false;
		}
		return true;
	}, [
		auth,
		course,
		selectedTopics,
		count,
		maxCount
	]);
	const answer = (0, import_react.useCallback)((selected) => {
		const question = questions[index];
		if (!question || picked !== null) return;
		const locked = lockAnswerToExplanation(question);
		const correct = selected === locked.answer;
		setQuestions((current) => current.map((item, itemIndex) => itemIndex === index ? locked : item));
		setPicked(selected);
		setAnswers((current) => [...current, {
			question: locked,
			selected,
			correct
		}]);
		auth.getToken().then((liveToken) => {
			if (!liveToken) return;
			postActivity(liveToken, {
				action: "answer",
				id: testId.current,
				index,
				answer: {
					topic: locked.topic,
					prompt: locked.prompt,
					options: locked.options,
					selected,
					correctAnswer: locked.answer,
					correct
				}
			}).catch(() => void 0);
		});
	}, [
		questions,
		index,
		picked,
		auth
	]);
	const revealSteps = (0, import_react.useCallback)(() => {
		setShowSteps(true);
		solutions.current += 1;
		if (!paid && solutions.current === 2) setRegisterOpen(true);
		const question = questions[index];
		auth.getToken().then((liveToken) => {
			if (!liveToken || !question) return;
			postActivity(liveToken, {
				action: "solution",
				id: testId.current,
				index,
				topic: question.topic
			}).catch(() => void 0);
		});
	}, [
		auth,
		index,
		paid,
		questions
	]);
	const finish = (0, import_react.useCallback)(async (graded) => {
		setPhase("results");
		if (!auth.user || !course || !graded.length) return;
		const correct = graded.filter((item) => item.correct).length;
		const topicMap = /* @__PURE__ */ new Map();
		graded.forEach((item) => {
			const row = topicMap.get(item.question.topic) || {
				correct: 0,
				total: 0
			};
			row.total += 1;
			if (item.correct) row.correct += 1;
			topicMap.set(item.question.topic, row);
		});
		const entry = {
			id: testId.current,
			course: course.label,
			topics: selectedTopics,
			total: graded.length,
			correct,
			score: Math.round(correct / graded.length * 100),
			topicResults: [...topicMap.entries()].map(([name, row]) => ({
				name,
				...row
			})),
			date: Date.now()
		};
		setHistoryNote("Saving your result to your account…");
		try {
			const liveToken = await auth.getToken();
			if (!liveToken) throw new Error("Sign in to save.");
			await saveHistory(liveToken, {
				id: entry.id,
				course: entry.course,
				topics: entry.topics,
				total: entry.total,
				correct: entry.correct,
				topicResults: entry.topicResults,
				answers: graded.map((item) => ({
					topic: item.question.topic,
					prompt: item.question.prompt,
					options: item.question.options,
					selected: item.selected,
					correctAnswer: item.question.answer,
					correct: item.correct
				})),
				name: auth.user.displayName || ""
			});
			setHistory((current) => [entry, ...current.filter((item) => item.id !== entry.id)].slice(0, 20));
			setHistoryNote("Saved to your account.");
			sessionStorage.removeItem(historyKey(auth.user.uid));
			refreshConfig().catch(() => void 0);
			loadPrizes();
		} catch {
			setHistoryNote("This result could not sync. Stay on this page and try again.");
		}
	}, [
		auth,
		course,
		selectedTopics,
		refreshConfig,
		loadPrizes
	]);
	const next = (0, import_react.useCallback)(() => {
		if (picked === null) return;
		const upcoming = index + 1;
		if (upcoming >= target.current || upcoming >= questions.length && !generating.current) {
			finish(answers);
			return;
		}
		if (upcoming >= questions.length) {
			setLoadNote("The next question is still being written…");
			setLoading(true);
			return;
		}
		setIndex(upcoming);
		setPicked(null);
		setShowSteps(false);
	}, [
		picked,
		index,
		questions.length,
		loading,
		answers,
		finish
	]);
	const endTest = (0, import_react.useCallback)(() => {
		cancelled.current = true;
		auth.getToken().then((liveToken) => {
			if (!liveToken) return;
			postActivity(liveToken, {
				action: "abandon",
				id: testId.current
			}).catch(() => void 0);
		});
		if (answers.length) finish(answers);
		else setPhase("build");
	}, [
		answers,
		auth,
		finish
	]);
	const learningMap = (0, import_react.useMemo)(() => {
		const totals = /* @__PURE__ */ new Map();
		history.forEach((test) => {
			(test.topicResults || []).forEach((result) => {
				const row = totals.get(result.name) || {
					correct: 0,
					total: 0
				};
				row.correct += result.correct;
				row.total += result.total;
				totals.set(result.name, row);
			});
		});
		return [...totals.entries()].filter(([, row]) => row.total > 0).map(([name, row]) => ({
			name,
			correct: row.correct,
			total: row.total,
			score: Math.round(row.correct / row.total * 100)
		})).sort((a, b) => a.score - b.score || b.total - a.total);
	}, [history]);
	return {
		auth,
		config,
		course,
		courseId,
		setCourseId,
		selectedTopics,
		setSelectedTopics,
		count,
		setCount,
		notice,
		phase,
		questions,
		index,
		answers,
		picked,
		showSteps,
		loading,
		loadNote,
		history,
		historyNote,
		premiumUntil,
		usageText,
		courseUsageText,
		weeklyPrize,
		monthlyPrize,
		whatsapp,
		registerOpen,
		setRegisterOpen,
		paid,
		remaining,
		maxCount,
		learningMap,
		mapSummary: (0, import_react.useMemo)(() => {
			if (!learningMap.length) return auth.user ? "Complete a test to see your personal strengths and focus areas." : "Sign in to sync your learning map, or take a test to start one on this device.";
			const needsWork = learningMap.filter((item) => item.score < 70);
			return needsWork.length ? `Your next focus: ${needsWork.slice(0, 2).map((item) => item.name).join(" and ")}.` : "Strong work. Your recent results are at least 70% across every tracked topic.";
		}, [auth.user, learningMap]),
		startTest,
		answer,
		revealSteps,
		next,
		endTest,
		setPhase,
		refreshConfig
	};
}
function QuestionCard({ question, index, total, loading, loadNote, picked, showSteps, onAnswer, onReveal, onNext, onExit }) {
	(0, import_react.useEffect)(() => {
		function onKey(event) {
			const tag = event.target?.tagName.toLowerCase();
			if (tag === "input" || tag === "textarea" || event.metaKey || event.ctrlKey || event.altKey) return;
			const key = event.key.toLowerCase();
			if ("abcd".includes(key) && key.length === 1 && picked === null && question) onAnswer(key.charCodeAt(0) - 97);
			if ((event.key === "Enter" || event.key === "ArrowRight") && picked !== null) onNext();
		}
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, [
		onAnswer,
		onNext,
		picked,
		question
	]);
	const progress = total ? Math.round((index + (picked === null ? 0 : 1)) / total * 100) : 0;
	const correct = question && picked !== null && picked === question.answer;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "oracle-test-panel",
		"aria-live": "polite",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "oracle-test-top",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "eyebrow text-clay",
						children: [
							"Question ",
							Math.min(index + 1, total),
							" of ",
							total
						]
					}),
					loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "or-load-status",
						children: loadNote
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "oracle-text-button",
						onClick: onExit,
						children: "End test"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "or-progress",
				role: "progressbar",
				"aria-valuemin": 0,
				"aria-valuemax": 100,
				"aria-valuenow": progress,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { style: { ["--score"]: `${progress}%` } })
			}),
			!question ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "or-loading",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "or-spinner",
						"aria-hidden": "true"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: loadNote || "Writing your first questions…" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "or-skeleton",
						"aria-hidden": "true",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", {}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", {}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", {})
						]
					})
				]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "oracle-question-body",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "oracle-topic-tag",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: `oracle-origin-badge${question.origin === "pq" || question.source === "PQ" ? " is-pq" : ""}`,
								children: question.source || (question.origin === "pq" ? "PQ" : "Oracle Question")
							}),
							" · ",
							question.topic
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "font-display text-2xl sm:text-3xl font-semibold text-ink leading-snug",
						children: question.prompt
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "oracle-answer-options",
						role: "group",
						"aria-label": "Answer options",
						children: question.options.map((option, optionIndex) => {
							const classes = ["oracle-answer-option"];
							if (picked !== null && optionIndex === question.answer) classes.push("is-correct");
							if (picked === optionIndex && optionIndex !== question.answer) classes.push("is-wrong");
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								className: classes.join(" "),
								disabled: picked !== null,
								onClick: () => onAnswer(optionIndex),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "oracle-option-key",
									children: String.fromCharCode(65 + optionIndex)
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: option })]
							}, option);
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "or-hint or-kbd",
						children: "Tip: press A, B, C or D to answer, then Enter for the next question."
					}),
					picked !== null ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: `oracle-answer-feedback ${correct ? "is-correct" : "is-wrong"}`,
						children: correct ? "Correct. Nice work." : `Not quite. The correct answer is ${String.fromCharCode(65 + question.answer)}: ${question.options[question.answer]}`
					}) : null,
					picked !== null && !showSteps ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						className: "btn btn-ghost-light mt-5",
						onClick: onReveal,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lightbulb, { className: "w-4 h-4" }), "Show step-by-step solution"]
					}) : null,
					showSteps ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "oracle-step-solution",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-semibold text-ink mb-3",
							children: "Step-by-step"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", { children: question.steps.map((step) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: step }, step)) })]
					}) : null
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				className: "btn btn-ink px-6 py-3.5 mt-8",
				disabled: picked === null,
				onClick: onNext,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: index + 1 >= total ? "See my report" : "Next question" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "w-4 h-4" })]
			})
		]
	});
}
function ResultsPanel({ answers, note, onAgain, onWeak }) {
	const correct = answers.filter((item) => item.correct).length;
	const score = answers.length ? Math.round(correct / answers.length * 100) : 0;
	const topics = /* @__PURE__ */ new Map();
	answers.forEach((item) => {
		const row = topics.get(item.question.topic) || {
			correct: 0,
			total: 0
		};
		row.total += 1;
		if (item.correct) row.correct += 1;
		topics.set(item.question.topic, row);
	});
	const ranked = [...topics.entries()].map(([name, row]) => ({
		name,
		score: Math.round(row.correct / row.total * 100)
	}));
	const weak = ranked.filter((item) => item.score < 70).map((item) => item.name);
	const missed = answers.filter((item) => !item.correct);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "oracle-results",
		"aria-live": "polite",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "eyebrow text-clay",
				children: "Your report"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
				className: "font-display text-4xl font-bold text-ink",
				children: [score, "%"]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
				correct,
				" of ",
				answers.length,
				" answers correct"
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "oracle-results-grid",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "font-display font-bold text-ink",
					children: "Topic strengths"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "oracle-result-topics",
					children: ranked.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: item.name }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("b", { children: [item.score, "%"] })] }, item.name))
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "font-display font-bold text-ink",
					children: "Review"
				}), missed.length ? missed.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
					className: "oracle-review-item",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", { children: item.question.prompt }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "oracle-correct-answer",
							children: [
								"Correct answer: ",
								String.fromCharCode(65 + item.question.answer),
								". ",
								item.question.options[item.question.answer]
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", { children: item.question.steps.map((step) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: step }, step)) })
					]
				}, item.question.prompt)) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "oracle-all-correct",
					children: "All correct. Nothing to review this time."
				})] })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-ink/60 mt-4",
				role: "status",
				children: note
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4 flex flex-wrap gap-3",
				children: [weak.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "btn btn-clay px-6 py-3.5",
					onClick: () => onWeak(weak),
					children: "Practise weak topics"
				}) : null, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					className: "btn btn-ink px-6 py-3.5",
					onClick: onAgain,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, { className: "w-4 h-4" }), "Build another test"]
				})]
			})
		]
	});
}
var WELCOME = [
	"Choose a course, then pick the topics you want to practise.",
	"Each question is marked PQ or Oracle Question. Review the explanation after your choice.",
	"Your report shows strong areas and what to work on next.",
	"Weekly and monthly prizes go to the top student. The weekly code stays locked until Monday 00:00, even for the current leader, then opens for the winner of the finished week."
];
function testDateLabel(test) {
	const raw = test.completedAt ?? test.date;
	let ms = null;
	if (typeof raw === "number") ms = raw < 0xe8d4a51000 ? raw * 1e3 : raw;
	else if (typeof raw === "string") ms = Date.parse(raw);
	else if (raw && typeof raw === "object") {
		const seconds = raw.seconds ?? raw._seconds;
		if (typeof seconds === "number") ms = seconds * 1e3;
	}
	if (!ms || Number.isNaN(ms)) return "Just completed";
	const date = new Date(ms);
	return Number.isNaN(date.getTime()) ? "Just completed" : date.toLocaleDateString();
}
function PracticePage() {
	const practice = usePractice();
	const [accountOpen, setAccountOpen] = (0, import_react.useState)(false);
	const [welcome, setWelcome] = (0, import_react.useState)(null);
	const welcomeRef = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		const node = welcomeRef.current;
		if (welcome === null || !node) return;
		if (!node.open) node.showModal();
	}, [welcome]);
	(0, import_react.useEffect)(() => {
		if (localStorage.getItem("oracle_welcome_seen_v2") === "true") return;
		setWelcome(0);
	}, []);
	(0, import_react.useEffect)(() => {
		const params = new URLSearchParams(window.location.search);
		const reference = params.get("reference") || params.get("trxref");
		if (params.get("payment") !== "paystack" || !reference || !practice.auth.confirmed || !practice.auth.user) return;
		practice.auth.getToken().then(async (token) => {
			if (!token) return;
			await verifyPayment(token, reference).catch(() => void 0);
			window.history.replaceState({}, "", window.location.pathname);
			practice.refreshConfig().catch(() => void 0);
		});
	}, [practice.auth.confirmed, practice.auth.user]);
	const promoUntil = practice.config?.promoUntil ? (/* @__PURE__ */ new Date(`${practice.config.promoUntil}T00:00:00`)).toLocaleDateString("en-GB", {
		day: "numeric",
		month: "long",
		year: "numeric"
	}) : "20 November 2026";
	const quota = practice.paid ? "Paid access. Up to 60 questions in a test." : `${practice.remaining} free questions left in this course today.`;
	function closeWelcome() {
		localStorage.setItem("oracle_welcome_seen_v2", "true");
		setWelcome(null);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "theme-ink oracle-page",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
				className: "abuad-skip",
				href: "#setup",
				children: "Skip to practice room"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteNav, {
				paid: practice.paid,
				promo: Boolean(practice.config?.sitewidePremium),
				onAccount: () => setAccountOpen(true),
				onUpgrade: () => document.getElementById("upgrade")?.scrollIntoView({ behavior: "smooth" })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
					className: "oracle-intro pt-[76px]",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "oracle-intro-copy",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "eyebrow text-clay mb-4",
									children: "Burhan Tutors · Exam Oracle"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
									className: "font-display text-4xl sm:text-5xl md:text-[58px] font-extrabold leading-[1.02] text-white",
									children: [
										"Know what you know.",
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-clay",
											children: "Find what to fix."
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-5 max-w-xl text-[16px] leading-relaxed text-white/65",
									children: "Practise CBT-style questions for your ABUAD 100-level courses. Get tested instantly, see your strengths, then work through every gap."
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-7 flex flex-wrap gap-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
										className: "btn btn-clay px-6 py-3.5",
										href: "#setup",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, { className: "w-4 h-4" }), "Start a free test"]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
										className: "btn btn-ghost-dark px-6 py-3.5",
										to: "/leaderboard",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trophy, { className: "w-4 h-4" }), "View leaderboard"]
									})]
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "oracle-score-preview",
							"aria-label": "Your personal topic progress",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "eyebrow text-white/45",
									children: "Your learning map"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "oracle-map-summary",
									children: practice.mapSummary
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "oracle-map-topics",
									children: practice.learningMap.length ? practice.learningMap.slice(0, 4).map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: `oracle-map-row${item.score < 70 ? " is-focus" : ""}`,
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
												item.name,
												" · ",
												item.correct,
												"/",
												item.total
											] }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("strong", { children: [
												item.score < 70 ? "Focus" : "Strong",
												" · ",
												item.score,
												"%"
											] }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { style: { ["--score"]: `${item.score}%` } })
										]
									}, item.name)) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "oracle-map-empty",
										children: "Your topic progress will appear after your first completed test."
									})
								})
							]
						})]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
					id: "prize-desk",
					className: "oracle-prize-desk",
					"aria-label": "Prize claim",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "oracle-prize-desk-inner",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "eyebrow text-clay",
									children: "Prizes"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "font-display text-2xl font-bold mt-1",
									children: "Weekly and monthly"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-2 text-sm text-white",
									children: "The top student each week wins cash prizes. The top student each month gets the next month free. The claim code opens only for the winner."
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									className: "oracle-welcome-board",
									to: "/leaderboard",
									children: "Open the leaderboard"
								})
							] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PrizeCard, {
								prize: practice.weeklyPrize,
								whatsapp: practice.whatsapp
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PrizeCard, {
								prize: practice.monthlyPrize,
								whatsapp: practice.whatsapp
							})
						]
					})
				}),
				practice.paid && !practice.config?.sitewidePremium ? null : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
					id: "upgrade",
					className: "oracle-upgrade",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "oracle-upgrade-inner",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "eyebrow",
								children: "Paid access · One semester"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "More room to practise." }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								id: "upgrade-copy",
								children: [
									"Full access is free through ",
									promoUntil,
									". After that, the free plan is 10 questions per course across up to 3 courses a day. Paid access is ₦1,000 for six months."
								]
							})
						] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "oracle-upgrade-action",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("strong", { children: ["₦1,000 ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "/ semester" })] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "This payment helps keep the service running. Pay with Paystack. Access stays on your account for six months." }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									className: "btn btn-clay px-6 py-3.5",
									onClick: () => setAccountOpen(true),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CreditCard, { "aria-hidden": "true" }), practice.paid ? "Premium access active" : "Get paid access · ₦1,000"]
								})
							]
						})]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
					id: "setup",
					className: "oracle-workspace py-12 md:py-16",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "oracle-section-heading",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "eyebrow text-clay mb-2",
									children: "Practice room"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "font-display text-3xl sm:text-4xl font-bold text-ink",
									children: "Build your test"
								})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "or-plan-badge",
									children: practice.config?.sitewidePremium ? "Free through 20 Nov" : practice.paid ? "Premium" : "Free plan"
								})]
							}),
							practice.notice ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "oracle-notice",
								role: "status",
								children: practice.notice
							}) : null,
							practice.phase === "build" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "or-layout",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "or-form",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "or-step",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
												className: "or-step-title",
												htmlFor: "course-select",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "1" }), "Choose a course"]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
												id: "course-select",
												className: "oracle-select",
												value: practice.course?.id || "",
												onChange: (event) => practice.setCourseId(event.target.value),
												children: (practice.config?.courses || []).map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
													value: item.id,
													children: [
														item.label,
														" · ",
														item.name
													]
												}, item.id))
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("fieldset", {
											className: "or-step",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("legend", {
													className: "or-step-title",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "2" }), "Choose topics"]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "or-step-tools",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
														type: "button",
														className: "oracle-text-button",
														onClick: () => practice.setSelectedTopics(practice.course?.topics || []),
														children: "Select all"
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
														type: "button",
														className: "oracle-text-button",
														onClick: () => practice.setSelectedTopics([]),
														children: "Clear"
													})]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "oracle-topic-options",
													children: (practice.course?.topics || []).map((topic) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
														className: "oracle-topic-choice",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
															type: "checkbox",
															checked: practice.selectedTopics.includes(topic),
															onChange: (event) => practice.setSelectedTopics((current) => event.target.checked ? [...current, topic] : current.filter((item) => item !== topic))
														}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: topic })]
													}, topic))
												})
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "or-step",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
													className: "or-step-title",
													htmlFor: "question-count",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "3" }), "Number of questions"]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
													id: "question-count",
													className: "oracle-select or-count",
													type: "number",
													min: 1,
													max: practice.maxCount,
													value: practice.count,
													onChange: (event) => practice.setCount(Number(event.target.value))
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "or-hint",
													children: quota
												})
											]
										})
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
									className: "or-summary",
									"aria-label": "Test summary",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "eyebrow text-white/45",
											children: "Your test"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", { children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", { children: "Course" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", { children: practice.course?.label || "–" })] }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", { children: "Topics" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", { children: practice.selectedTopics.length || "–" })] }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", { children: "Questions" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", { children: practice.count })] })
										] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "or-meter",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: quota }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { style: { ["--score"]: practice.paid ? "100%" : `${Math.min(100, practice.remaining / (practice.config?.freeDaily || 10) * 100)}%` } })]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											type: "button",
											className: "btn btn-clay w-full py-4 mt-5",
											onClick: () => practice.startTest().then((ok) => {
												if (!ok && !practice.auth.user) setAccountOpen(true);
											}),
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "w-4 h-4" }), "Start test"]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "or-summary-note",
											children: "Questions load in the background, so you can start after the first few arrive."
										})
									]
								})]
							}) : null,
							practice.phase === "test" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(QuestionCard, {
								question: practice.questions[practice.index],
								index: practice.index,
								total: practice.count,
								loading: practice.loading && !practice.questions[practice.index],
								loadNote: practice.loadNote,
								picked: practice.picked,
								showSteps: practice.showSteps,
								onAnswer: practice.answer,
								onReveal: practice.revealSteps,
								onNext: practice.next,
								onExit: practice.endTest
							}) : null,
							practice.phase === "results" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResultsPanel, {
								answers: practice.answers,
								note: practice.historyNote,
								onAgain: () => practice.setPhase("build"),
								onWeak: (topics) => {
									practice.setSelectedTopics(topics);
									practice.setPhase("build");
								}
							}) : null
						]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
					className: "oracle-progress-section",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "oracle-progress-inner",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "oracle-progress-heading",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "eyebrow text-clay",
								children: "Your practice record"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "Recent tests" })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: practice.auth.user ? `Synced to ${practice.auth.user.email || "your account"}.` : "Saved on this device. Sign in to sync across devices." })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "oracle-recent-tests",
							children: practice.history.length ? practice.history.slice(0, 6).map((test) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
								className: "oracle-recent-item",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: test.course }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
										testDateLabel(test),
										" · ",
										test.correct,
										"/",
										test.total,
										" correct"
									] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("b", { children: [test.score ?? Math.round(test.correct / Math.max(1, test.total) * 100), "%"] })
								]
							}, test.id || `${test.course}-${test.date}`)) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "oracle-recent-empty",
								children: practice.historyNote || "Complete a test and your score will appear here."
							})
						})]
					})
				})
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("footer", {
				className: "theme-ink2 py-8",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-wrap justify-between gap-4 text-xs text-white/45",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Burhan Tutors · Exam Oracle" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
							href: "#upgrade",
							className: "hover:text-white",
							children: "Upgrade to paid access"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/",
							className: "hover:text-white",
							children: "Back to academy"
						})
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AccountDialog, {
				open: accountOpen,
				onClose: () => setAccountOpen(false),
				paid: practice.paid,
				promo: Boolean(practice.config?.sitewidePremium),
				premiumUntil: practice.premiumUntil,
				usageText: practice.usageText,
				courseUsageText: practice.courseUsageText
			}),
			welcome !== null ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dialog", {
				ref: welcomeRef,
				className: "oracle-welcome",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "oracle-skip",
						onClick: closeWelcome,
						children: "Skip"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "eyebrow text-clay",
						children: [
							"Exam Oracle · 0",
							welcome + 1,
							" / 04"
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-3xl font-bold text-ink mt-4",
						children: WELCOME[welcome]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "oracle-welcome-dots",
						"aria-hidden": "true",
						children: WELCOME.map((_, dot) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", { className: dot === welcome ? "is-active" : "" }, dot))
					}),
					welcome < WELCOME.length - 1 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "btn btn-ink w-full py-3.5 mt-5",
						onClick: () => setWelcome(welcome + 1),
						children: "Next"
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						className: "oracle-welcome-board",
						to: "/leaderboard",
						children: "See the leaderboard"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "btn btn-clay w-full py-3.5 mt-3",
						onClick: () => {
							closeWelcome();
							document.getElementById("setup")?.scrollIntoView({ behavior: "smooth" });
						},
						children: "Start practising"
					})] })
				]
			}) : null,
			practice.registerOpen ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "oracle-register",
				role: "dialog",
				"aria-modal": "true",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "oracle-register-panel",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "oracle-register-close",
							"aria-label": "Close",
							onClick: () => practice.setRegisterOpen(false),
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "w-5 h-5" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "eyebrow text-clay",
							children: "Keep your momentum"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-display text-2xl font-bold text-ink mt-3",
							children: "Understood it? Now master it."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-ink/65 mt-3 leading-relaxed",
							children: "Register for live classes and never miss this type of question again."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							className: "btn btn-clay w-full py-3.5 mt-6",
							to: "/",
							hash: "fees",
							children: "See plans and register"
						})
					]
				})
			}) : null
		]
	});
}
var SplitComponent = PracticePage;
//#endregion
export { SplitComponent as component };
