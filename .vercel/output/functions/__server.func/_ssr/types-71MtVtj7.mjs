//#region node_modules/.nitro/vite/services/ssr/assets/types-71MtVtj7.js
async function readJson(res) {
	const data = await res.json().catch(() => ({}));
	if (!res.ok) {
		const error = new Error(String(data.error || "Request failed."));
		error.status = res.status;
		error.code = typeof data.code === "string" ? data.code : void 0;
		throw error;
	}
	return data;
}
async function fetchConfig(token) {
	const headers = {};
	if (token) headers.Authorization = `Bearer ${token}`;
	return await readJson(await fetch("/api/generate-questions", { headers }));
}
async function fetchQuestions(token, body) {
	return readJson(await fetch("/api/generate-questions", {
		method: "POST",
		headers: {
			Authorization: `Bearer ${token}`,
			"content-type": "application/json"
		},
		body: JSON.stringify(body)
	}));
}
async function postActivity(token, payload) {
	await fetch("/api/test-history", {
		method: "POST",
		headers: {
			Authorization: `Bearer ${token}`,
			"content-type": "application/json"
		},
		body: JSON.stringify(payload)
	});
}
async function fetchHistory(token) {
	return readJson(await fetch("/api/test-history", { headers: { Authorization: `Bearer ${token}` } }));
}
async function saveHistory(token, body) {
	if (!(await fetch("/api/test-history", {
		method: "POST",
		headers: {
			Authorization: `Bearer ${token}`,
			"content-type": "application/json"
		},
		body: JSON.stringify(body)
	})).ok) throw new Error("History save failed.");
}
async function fetchLeaderboard(token) {
	const headers = {};
	if (token) headers.Authorization = `Bearer ${token}`;
	return await readJson(await fetch("/api/leaderboard", { headers }));
}
async function fetchAdmin(token) {
	return readJson(await fetch("/api/admin", { headers: { Authorization: `Bearer ${token}` } }));
}
async function startPayment(token) {
	const data = await readJson(await fetch("/api/paystack-initialize", {
		method: "POST",
		headers: {
			Authorization: `Bearer ${token}`,
			"content-type": "application/json"
		},
		body: JSON.stringify({})
	}));
	return String(data.authorizationUrl || "");
}
async function verifyPayment(token, reference) {
	return readJson(await fetch("/api/paystack-verify", {
		method: "POST",
		headers: {
			Authorization: `Bearer ${token}`,
			"content-type": "application/json"
		},
		body: JSON.stringify({ reference })
	}));
}
var ADMIN_EMAIL = "burhantutors@gmail.com";
//#endregion
export { fetchLeaderboard as a, saveHistory as c, fetchHistory as i, startPayment as l, fetchAdmin as n, fetchQuestions as o, fetchConfig as r, postActivity as s, ADMIN_EMAIL as t, verifyPayment as u };
