import type { Leaderboard, OracleConfig, SavedTest } from "./types";

async function readJson(res: Response) {
  const data = (await res.json().catch(() => ({}))) as Record<string, unknown>;
  if (!res.ok) {
    const error = new Error(String(data.error || "Request failed.")) as Error & { status?: number; code?: string };
    error.status = res.status;
    error.code = typeof data.code === "string" ? data.code : undefined;
    throw error;
  }
  return data;
}

export async function fetchConfig(token: string | null): Promise<OracleConfig> {
  const headers: Record<string, string> = {};
  if (token) headers.Authorization = `Bearer ${token}`;
  const res = await fetch("/api/generate-questions", { headers });
  return (await readJson(res)) as unknown as OracleConfig;
}

export async function fetchQuestions(
  token: string,
  body: { course: string; topics: string[]; count: number; batch: number; avoid: string[] },
) {
  const res = await fetch("/api/generate-questions", {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "content-type": "application/json" },
    body: JSON.stringify(body),
  });
  return readJson(res);
}

export async function postActivity(token: string, payload: Record<string, unknown>) {
  await fetch("/api/test-history", {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "content-type": "application/json" },
    body: JSON.stringify(payload),
  });
}

export async function fetchHistory(token: string) {
  const res = await fetch("/api/test-history", { headers: { Authorization: `Bearer ${token}` } });
  return readJson(res) as Promise<{ tests?: SavedTest[]; premiumUntil?: string; usage?: Record<string, unknown> }>;
}

export async function saveHistory(token: string, body: Record<string, unknown>) {
  const res = await fetch("/api/test-history", {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "content-type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error("History save failed.");
}

export async function fetchLeaderboard(token: string | null): Promise<Leaderboard> {
  const headers: Record<string, string> = {};
  if (token) headers.Authorization = `Bearer ${token}`;
  const res = await fetch("/api/leaderboard", { headers });
  return (await readJson(res)) as unknown as Leaderboard;
}

export async function fetchAdmin(token: string) {
  const res = await fetch("/api/admin", { headers: { Authorization: `Bearer ${token}` } });
  return readJson(res);
}

export async function startPayment(token: string) {
  const res = await fetch("/api/paystack-initialize", {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "content-type": "application/json" },
    body: JSON.stringify({}),
  });
  const data = await readJson(res);
  return String(data.authorizationUrl || "");
}

export async function verifyPayment(token: string, reference: string) {
  const res = await fetch("/api/paystack-verify", {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "content-type": "application/json" },
    body: JSON.stringify({ reference }),
  });
  return readJson(res);
}
