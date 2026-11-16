import { o as __toESM } from "../_runtime.mjs";
import { G as redirect, J as require_react, _ as createFileRoute, b as useRouter, d as Scripts, f as HeadContent, g as lazyRouteComponent, h as Outlet, m as createRouter, v as createRootRoute, x as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { i as TriangleAlert } from "../_libs/lucide-react.mjs";
import { a as union, i as string, n as number, r as object, t as literal } from "../_libs/zod.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/router-DoDF-ZC9.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var __defProp = Object.defineProperty;
var __exportAll = (all, no_symbols) => {
	let target = {};
	for (var name in all) __defProp(target, name, {
		get: all[name],
		enumerable: true
	});
	if (!no_symbols) __defProp(target, Symbol.toStringTag, { value: "Module" });
	return target;
};
var FALLBACK_MESSAGE = "An unexpected error occurred. Try reloading the page.";
function errorMessage(error) {
	if (error instanceof Error && error.message) return error.message;
	if (typeof error === "string" && error) return error;
	return FALLBACK_MESSAGE;
}
function AppErrorComponent({ error }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "flex min-h-screen flex-col items-center justify-center gap-3 px-6 text-center bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-red-500",
				"aria-hidden": "true",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, {
					className: "size-10",
					strokeWidth: 2
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-lg font-semibold",
				children: "Something went wrong"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "max-w-md text-sm break-words text-zinc-500 dark:text-zinc-400",
				children: errorMessage(error)
			})
		]
	});
}
/**
* Path-based preview hosts serve the dev server under `/{port_id}/` and strip
* that prefix before forwarding, so SSR sees `/` while the browser URL keeps the
* prefix. TanStack Start resets `basepath` on hydration, so a `rewrite` keeps
* client routing and generated links aligned with the public URL.
*/
var PATH_BASED_PREVIEW_HOSTS = /* @__PURE__ */ new Set([
	"preview.grok.genai.mil",
	"preview.grok.mil",
	"preview.grokgsac.com"
]);
var PORT_ID_PREFIX = /^\/hds-[a-z0-9]+-\d+-[a-z0-9]+(?=\/|$)/i;
function previewPathPrefix(hostname, pathname) {
	if (!PATH_BASED_PREVIEW_HOSTS.has(hostname.toLowerCase())) return void 0;
	return PORT_ID_PREFIX.exec(pathname)?.[0];
}
function prefixRewrite(prefix) {
	return {
		input: ({ url }) => {
			if (url.pathname === prefix) url.pathname = "/";
			else if (url.pathname.startsWith(`${prefix}/`)) url.pathname = url.pathname.slice(prefix.length);
			return url;
		},
		output: ({ url }) => {
			url.pathname = `${prefix}${url.pathname}`;
			return url;
		}
	};
}
function previewPathRewrite() {
	if (typeof window === "undefined") return void 0;
	const prefix = previewPathPrefix(window.location.hostname, window.location.pathname);
	return prefix ? prefixRewrite(prefix) : void 0;
}
/**
* App-wide client provider mounted once near the root (in `src/routes/__root.tsx`):
*
*   <AuthProvider><Outlet /></AuthProvider>
*
* Better Auth's React client (`@/lib/auth/client`) needs NO context provider —
* its `useSession()` works standalone — so this is a passthrough today. It's
* kept as the single, stable mount point for any future client-side providers
* (e.g. a toast or theme provider) without churning the root shell.
*/
function AuthProvider({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children });
}
var CONNECTOR_TOKEN_READY_EVENT = "grok:connector-token-ready";
function isGrokEmbedderOrigin(origin) {
	try {
		const url = new URL(origin);
		if (url.protocol !== "https:" && url.protocol !== "http:") return false;
		const host = url.hostname.toLowerCase();
		if (host === "grok.com" || host.endsWith(".grok.com")) return true;
		if (host === "localhost" || host === "127.0.0.1" || host === "[::1]") return true;
		return false;
	} catch {
		return false;
	}
}
function isSandboxPreviewGuestHost(hostname) {
	const host = hostname.toLowerCase();
	return host === "grok-sandbox.com" || host.endsWith(".grok-sandbox.com");
}
function isRemintPreviewPair(guestHost, parentHost) {
	const guest = guestHost.toLowerCase();
	const parent = parentHost.toLowerCase();
	const i = guest.indexOf(".preview.");
	if (i <= 0) return false;
	const label = guest.slice(0, i);
	const rest = guest.slice(i + 9);
	if (label.includes(".") || !rest.includes(".")) return false;
	return parent === rest || parent === `grok.${rest}`;
}
function resolveParentEmbedderOrigin(parentIsSelf, referrer, ancestorOrigin, guestHostname = "") {
	if (parentIsSelf) return null;
	for (const candidate of [referrer, ancestorOrigin ?? ""].filter(Boolean)) try {
		const url = new URL(candidate.includes("://") ? candidate : `https://${candidate}`);
		if (url.protocol !== "https:" && url.protocol !== "http:") continue;
		if (isGrokEmbedderOrigin(url.origin)) return url.origin;
		if (isSandboxPreviewGuestHost(guestHostname) || isRemintPreviewPair(guestHostname, url.hostname)) return url.origin;
	} catch {}
	return null;
}
/**
* Guest side of the grok-web ↔ sandbox preview postMessage bridge.
*
* Activates only when this page is framed by an allowlisted Grok embedder.
* Top-level runs (download/export, local `npm run dev`, deployed sites) noop.
*/
var PREVIEW_BRIDGE_CHANNEL = "grok-preview-bridge";
var EnvelopeSchema = object({
	channel: literal(PREVIEW_BRIDGE_CHANNEL),
	version: number().int().positive(),
	type: string().min(1)
});
var HelloSchema = EnvelopeSchema.extend({ type: literal("hello") });
var NavigateSchema = EnvelopeSchema.extend({
	type: literal("navigate"),
	path: string().min(1)
});
var HistorySchema = EnvelopeSchema.extend({
	type: literal("history"),
	delta: union([literal(-1), literal(1)])
});
var ConnectorTokenReadySchema = EnvelopeSchema.extend({ type: literal("connector-token-ready") });
function isSafeBridgePath(path) {
	if (!path.startsWith("/") || path.startsWith("//") || path.includes("\\")) return false;
	try {
		return new URL(path, "https://preview.invalid").origin === "https://preview.invalid";
	} catch {
		return false;
	}
}
/**
* Origin of the Grok embedder framing this page, or null when the page runs
* top-level (download/export, local `npm run dev`, deployed sites) or under a
* non-Grok parent. Client-only; null during SSR.
*/
function resolveCurrentEmbedderOrigin() {
	if (typeof window === "undefined") return null;
	const ancestorOrigin = typeof location.ancestorOrigins !== "undefined" && location.ancestorOrigins.length > 0 ? location.ancestorOrigins[0] : null;
	return resolveParentEmbedderOrigin(window.parent === window, document.referrer, ancestorOrigin, window.location.hostname);
}
/**
* Install host↔guest messaging. Returns a dispose function.
* Noops (returns a no-op dispose) when not embedded under a Grok parent.
*/
function installPreviewHostBridge(options = {}) {
	const parentOrigin = resolveCurrentEmbedderOrigin();
	if (parentOrigin === null) return () => {};
	const ROOT_STATE_KEY = "__grokPreviewBridgeRoot";
	const originalPushState = window.history.pushState.bind(window.history);
	const originalReplaceState = window.history.replaceState.bind(window.history);
	const isAtHistoryRoot = () => {
		const state = window.history.state;
		return Boolean(state && typeof state === "object" && state[ROOT_STATE_KEY] === true);
	};
	try {
		const current = window.history.state;
		if (!(current !== null && typeof current === "object" && Object.prototype.hasOwnProperty.call(current, ROOT_STATE_KEY))) {
			const isRoot = window.history.length <= 1;
			originalReplaceState(current && typeof current === "object" ? {
				...current,
				[ROOT_STATE_KEY]: isRoot
			} : { [ROOT_STATE_KEY]: isRoot }, "", window.location.href);
		}
	} catch {}
	const post = (message) => {
		window.parent.postMessage(message, parentOrigin);
	};
	const reportLocation = () => {
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "location",
			path: window.location.pathname || "/",
			search: window.location.search,
			hash: window.location.hash
		});
	};
	const reportRoutes = () => {
		const paths = options.getRoutePaths?.() ?? [];
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "routes",
			paths
		});
	};
	const defaultNavigate = (path) => {
		if (!isSafeBridgePath(path)) return;
		try {
			const url = new URL(path, window.location.origin);
			if (url.origin !== window.location.origin) return;
			const next = `${url.pathname}${url.search}${url.hash}`;
			window.history.pushState(window.history.state, "", next);
			window.dispatchEvent(new PopStateEvent("popstate", { state: window.history.state }));
		} catch {}
	};
	const navigate = (path) => {
		if (!isSafeBridgePath(path)) return;
		if (options.navigate) {
			options.navigate(path);
			return;
		}
		defaultNavigate(path);
	};
	const announce = () => {
		reportLocation();
		reportRoutes();
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "ready"
		});
	};
	const onHello = (data) => {
		if (!HelloSchema.safeParse(data).success) return;
		announce();
	};
	const onNavigate = (data) => {
		const parsed = NavigateSchema.safeParse(data);
		if (!parsed.success) return;
		navigate(parsed.data.path);
		queueMicrotask(reportLocation);
	};
	const onHistory = (data) => {
		const parsed = HistorySchema.safeParse(data);
		if (!parsed.success) return;
		if (parsed.data.delta === -1 && isAtHistoryRoot()) return;
		window.history.go(parsed.data.delta);
	};
	const onConnectorTokenReady = (data) => {
		if (!ConnectorTokenReadySchema.safeParse(data).success) return;
		window.dispatchEvent(new Event(CONNECTOR_TOKEN_READY_EVENT));
	};
	const hostMessageHandlers = /* @__PURE__ */ new Map([
		["hello", onHello],
		["navigate", onNavigate],
		["history", onHistory],
		["connector-token-ready", onConnectorTokenReady]
	]);
	const onMessage = (event) => {
		if (event.source !== window.parent) return;
		if (event.origin !== parentOrigin) return;
		const envelope = EnvelopeSchema.safeParse(event.data);
		if (!envelope.success || envelope.data.version !== 1) return;
		hostMessageHandlers.get(envelope.data.type)?.(event.data);
	};
	const onPopState = () => {
		reportLocation();
	};
	const onHashChange = () => {
		reportLocation();
	};
	window.history.pushState = (data, unused, url) => {
		const next = data && typeof data === "object" ? {
			...data,
			[ROOT_STATE_KEY]: false
		} : data;
		originalPushState(next, unused, url);
		reportLocation();
	};
	window.history.replaceState = (data, unused, url) => {
		const next = isAtHistoryRoot() ? {
			...data && typeof data === "object" ? data : {},
			[ROOT_STATE_KEY]: true
		} : data;
		originalReplaceState(next, unused, url);
		reportLocation();
	};
	window.addEventListener("message", onMessage);
	window.addEventListener("popstate", onPopState);
	window.addEventListener("hashchange", onHashChange);
	announce();
	return () => {
		window.removeEventListener("message", onMessage);
		window.removeEventListener("popstate", onPopState);
		window.removeEventListener("hashchange", onHashChange);
		window.history.pushState = originalPushState;
		window.history.replaceState = originalReplaceState;
	};
}
/** Collect static path patterns from a TanStack route tree (best-effort). */
function collectRoutePathsFromTree(routeTree) {
	const paths = /* @__PURE__ */ new Set();
	const walk = (node) => {
		if (!node || typeof node !== "object") return;
		const record = node;
		const full = typeof record.fullPath === "string" ? record.fullPath : typeof record.path === "string" ? record.path : null;
		if (full !== null && full !== "") paths.add(full.startsWith("/") ? full : `/${full}`);
		else if (full === "") paths.add("/");
		const children = record.children;
		if (Array.isArray(children)) for (const child of children) walk(child);
		else if (children && typeof children === "object") for (const child of Object.values(children)) walk(child);
	};
	walk(routeTree);
	return [...paths];
}
/**
* Mount once in `__root.tsx` so the Grok preview chrome can drive navigation
* (and later receive registered routes). Noops when the app is not embedded.
*/
function PreviewHostBridge() {
	const router = useRouter();
	(0, import_react.useEffect)(() => {
		return installPreviewHostBridge({
			navigate: (path) => {
				router.history.push(path);
			},
			getRoutePaths: () => collectRoutePathsFromTree(router.routeTree)
		});
	}, [router]);
	return null;
}
var firebaseConfig = {
	apiKey: "AIzaSyDaIbNnFoxs43TSmfAleFK3oQPuQKog2DU",
	authDomain: "burhan-tutors-website.firebaseapp.com",
	projectId: "burhan-tutors-website",
	storageBucket: "burhan-tutors-website.firebasestorage.app",
	messagingSenderId: "359861270073",
	appId: "1:359861270073:web:516d9da8eb4e8c46613fe8"
};
async function loadAuth() {
	const { getApps, initializeApp } = await import("../_libs/firebase.mjs").then((n) => n.n);
	const { browserLocalPersistence, getAuth, setPersistence } = await import("../_libs/firebase.mjs").then((n) => n.t);
	const auth = getAuth(getApps()[0] ?? initializeApp(firebaseConfig));
	await setPersistence(auth, browserLocalPersistence).catch(() => void 0);
	return auth;
}
var CACHE_KEY = "oracle-auth-cache-v1";
var AuthContext = (0, import_react.createContext)(null);
function readCache() {
	if (typeof window === "undefined") return null;
	try {
		const parsed = JSON.parse(localStorage.getItem(CACHE_KEY) || "null");
		return parsed?.uid ? parsed : null;
	} catch {
		return null;
	}
}
function writeCache(user) {
	try {
		if (!user) localStorage.removeItem(CACHE_KEY);
		else localStorage.setItem(CACHE_KEY, JSON.stringify(user));
	} catch {}
}
function toSession(user) {
	return {
		uid: user.uid,
		email: user.email || "",
		displayName: user.displayName || ""
	};
}
var AUTH_COPY = {
	"auth/email-already-in-use": "An account already uses this email. Sign in instead.",
	"auth/invalid-email": "Enter a valid email address.",
	"auth/weak-password": "Choose a password with at least 6 characters.",
	"auth/invalid-credential": "Email or password is incorrect.",
	"auth/operation-not-allowed": "That sign-in method is not enabled yet.",
	"auth/popup-closed-by-user": "Google sign-in was closed before it finished."
};
function authMessage(error) {
	return AUTH_COPY[typeof error === "object" && error && "code" in error ? String(error.code) : ""] || "Couldn't complete sign-in. Please try again.";
}
function OracleAuthProvider({ children }) {
	const [user, setUser] = (0, import_react.useState)(null);
	const [confirmed, setConfirmed] = (0, import_react.useState)(false);
	const authRef = (0, import_react.useRef)(null);
	const liveRef = (0, import_react.useRef)(null);
	(0, import_react.useLayoutEffect)(() => {
		const cached = readCache();
		if (cached) setUser(cached);
	}, []);
	(0, import_react.useLayoutEffect)(() => {
		let stop = () => {};
		let cancelled = false;
		loadAuth().then(async (auth) => {
			if (cancelled) return;
			authRef.current = auth;
			const { onAuthStateChanged } = await import("../_libs/firebase.mjs").then((n) => n.t);
			stop = onAuthStateChanged(auth, (next) => {
				liveRef.current = next;
				const session = next ? toSession(next) : null;
				writeCache(session);
				setUser(session);
				setConfirmed(true);
			});
		});
		return () => {
			cancelled = true;
			stop();
		};
	}, []);
	const getToken = (0, import_react.useCallback)(async (force = false) => {
		const current = liveRef.current;
		if (!current) return null;
		return current.getIdToken(force);
	}, []);
	const signInEmail = (0, import_react.useCallback)(async (email, password) => {
		const auth = authRef.current ?? await loadAuth();
		authRef.current = auth;
		const { signInWithEmailAndPassword } = await import("../_libs/firebase.mjs").then((n) => n.t);
		await signInWithEmailAndPassword(auth, email.trim(), password);
	}, []);
	const createAccount = (0, import_react.useCallback)(async (email, password) => {
		const auth = authRef.current ?? await loadAuth();
		authRef.current = auth;
		const { createUserWithEmailAndPassword } = await import("../_libs/firebase.mjs").then((n) => n.t);
		await createUserWithEmailAndPassword(auth, email.trim(), password);
	}, []);
	const signInGoogle = (0, import_react.useCallback)(async () => {
		const auth = authRef.current ?? await loadAuth();
		authRef.current = auth;
		const { GoogleAuthProvider, signInWithPopup } = await import("../_libs/firebase.mjs").then((n) => n.t);
		await signInWithPopup(auth, new GoogleAuthProvider());
	}, []);
	const signOutUser = (0, import_react.useCallback)(async () => {
		const auth = authRef.current ?? await loadAuth();
		const { signOut } = await import("../_libs/firebase.mjs").then((n) => n.t);
		writeCache(null);
		await signOut(auth);
	}, []);
	const value = (0, import_react.useMemo)(() => ({
		user,
		confirmed,
		getToken,
		signInEmail,
		createAccount,
		signInGoogle,
		signOutUser
	}), [
		user,
		confirmed,
		getToken,
		signInEmail,
		createAccount,
		signInGoogle,
		signOutUser
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthContext.Provider, {
		value,
		children
	});
}
function useOracleAuth() {
	const value = (0, import_react.useContext)(AuthContext);
	if (!value) throw new Error("useOracleAuth must be used inside OracleAuthProvider");
	return value;
}
var styles_default = "/assets/styles-BogCKaKI.css";
var Route$9 = createRootRoute({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			},
			{ title: "Exam Oracle" },
			{
				name: "description",
				content: "ABUAD 100-level practice with Exam Oracle."
			},
			{
				name: "theme-color",
				content: "#081423"
			}
		],
		links: [
			{
				rel: "icon",
				type: "image/png",
				href: "/images/burhan-dark.png"
			},
			{
				rel: "preconnect",
				href: "https://fonts.googleapis.com"
			},
			{
				rel: "preconnect",
				href: "https://fonts.gstatic.com",
				crossOrigin: "anonymous"
			},
			{
				rel: "stylesheet",
				href: "https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&family=JetBrains+Mono:wght@500;700&display=swap"
			},
			{
				rel: "stylesheet",
				href: styles_default
			},
			{
				rel: "manifest",
				href: "/__grok/manifest.webmanifest"
			},
			{
				rel: "apple-touch-icon",
				href: "/__grok/icon-180.png"
			}
		]
	}),
	component: () => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "en",
		suppressHydrationWarning: true,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("head", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PreviewHostBridge, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthProvider, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(OracleAuthProvider, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {}) }) }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})
		] })]
	})
});
var $$splitComponentImporter$3 = () => import("./routes-MAPt5-B8.mjs");
var Route$8 = createFileRoute("/")({
	component: lazyRouteComponent($$splitComponentImporter$3, "component"),
	head: () => ({ meta: [{ title: "Exam Oracle for ABUAD Students | Burhan Tutors" }, {
		name: "description",
		content: "Prepare smarter with Exam Oracle, the ABUAD 100-level practice tool."
	}] })
});
var $$splitComponentImporter$2 = () => import("./admin-B01yDpST.mjs");
var Route$7 = createFileRoute("/admin")({
	component: lazyRouteComponent($$splitComponentImporter$2, "component"),
	head: () => ({ meta: [{ title: "Admin | Exam Oracle" }, {
		name: "robots",
		content: "noindex"
	}] })
});
var Route$6 = createFileRoute("/admin.html")({ beforeLoad: () => {
	throw redirect({ to: "/admin" });
} });
var $$splitComponentImporter$1 = () => import("./exam-oracle-D20pQKYG.mjs");
var Route$5 = createFileRoute("/exam-oracle")({
	component: lazyRouteComponent($$splitComponentImporter$1, "component"),
	head: () => ({ meta: [{ title: "Practice | Exam Oracle" }] })
});
var Route$4 = createFileRoute("/exam-oracle.html")({ beforeLoad: () => {
	throw redirect({ to: "/exam-oracle" });
} });
var $$splitComponentImporter = () => import("./leaderboard-CoFgT1Fl.mjs");
var Route$3 = createFileRoute("/leaderboard")({
	component: lazyRouteComponent($$splitComponentImporter, "component"),
	head: () => ({ meta: [{ title: "Leaderboard | Exam Oracle" }] })
});
var Route$2 = createFileRoute("/leaderboard.html")({ beforeLoad: () => {
	throw redirect({ to: "/leaderboard" });
} });
async function handle$1({ request, params }) {
	const { dispatchOracle } = await import("./dispatch-CF1h7G48.mjs");
	return dispatchOracle(params.name, request);
}
var Route$1 = createFileRoute("/api/$name")({ server: { handlers: {
	GET: handle$1,
	POST: handle$1
} } });
async function handle({ request, params }) {
	const { dispatchOracle } = await import("./dispatch-CF1h7G48.mjs");
	return dispatchOracle(params.name, request);
}
var Route = createFileRoute("/.netlify/functions/$name")({ server: { handlers: {
	GET: handle,
	POST: handle
} } });
var rootRouteChildren = {
	IndexRoute: Route$8.update({
		id: "/",
		path: "/",
		getParentRoute: () => Route$9
	}),
	AdminRoute: Route$7.update({
		id: "/admin",
		path: "/admin",
		getParentRoute: () => Route$9
	}),
	AdminDothtmlRoute: Route$6.update({
		id: "/admin.html",
		path: "/admin.html",
		getParentRoute: () => Route$9
	}),
	ExamOracleRoute: Route$5.update({
		id: "/exam-oracle",
		path: "/exam-oracle",
		getParentRoute: () => Route$9
	}),
	ExamOracleDothtmlRoute: Route$4.update({
		id: "/exam-oracle.html",
		path: "/exam-oracle.html",
		getParentRoute: () => Route$9
	}),
	LeaderboardRoute: Route$3.update({
		id: "/leaderboard",
		path: "/leaderboard",
		getParentRoute: () => Route$9
	}),
	LeaderboardDothtmlRoute: Route$2.update({
		id: "/leaderboard.html",
		path: "/leaderboard.html",
		getParentRoute: () => Route$9
	}),
	ApiNameRoute: Route$1.update({
		id: "/api/$name",
		path: "/api/$name",
		getParentRoute: () => Route$9
	}),
	DotnetlifyFunctionsNameRoute: Route.update({
		id: "/.netlify/functions/$name",
		path: "/.netlify/functions/$name",
		getParentRoute: () => Route$9
	})
};
var routeTree = Route$9._addFileChildren(rootRouteChildren)._addFileTypes();
var router_exports = /* @__PURE__ */ __exportAll({ getRouter: () => getRouter });
function getRouter() {
	return createRouter({
		routeTree,
		rewrite: previewPathRewrite(),
		defaultErrorComponent: AppErrorComponent
	});
}
//#endregion
export { authMessage as n, useOracleAuth as r, router_exports as t };
