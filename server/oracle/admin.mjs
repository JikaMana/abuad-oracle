// @ts-nocheck
import { firebaseConfigured, firebaseServices, promoActive, promoUntilDate } from "./account.mjs";
import { groqKeys } from "./groq.mjs";
import {
  claimCode,
  monthId,
  rankWindow,
  startOfLagosDay,
  startOfLagosMonth,
  startOfLagosWeek,
  weekId,
} from "./leaderboard.mjs";

const DAY = 86400000;
export const ADMIN_EMAIL = "burhantutors@gmail.com";

export function isAdmin(user) {
  if (!user || user.local) return false;
  return String(user.email || "").trim().toLowerCase() === ADMIN_EMAIL;
}

function nextMonthStart(ms) {
  const start = startOfLagosMonth(ms);
  const d = new Date(start + 3600000);
  return Date.UTC(d.getUTCFullYear(), d.getUTCMonth() + 1, 1) - 3600000;
}

function winnerCard(rows, from, to, periodId, withCode) {
  const leader = rankWindow(rows, from, to)[0] || null;
  if (!leader) return null;
  return {
    name: leader.name,
    points: leader.points,
    average: leader.average,
    tests: leader.tests,
    code: withCode ? claimCode(periodId, leader.uid) : null,
  };
}

export function summariseAdmin({
  authUsers = [],
  profiles = [],
  payments = [],
  scores = [],
  truncated = false,
  scoresTruncated = false,
  authNote = "",
  firebase = true,
  now = Date.now(),
} = {}) {
  const dayStart = startOfLagosDay(now);
  const weekStart = startOfLagosWeek(now);
  const monthStart = startOfLagosMonth(now);
  const profileByUid = new Map(profiles.map((profile) => [profile.uid, profile]));
  const authByUid = new Map(authUsers.map((user) => [user.uid, user]));
  const successful = payments.filter((payment) => payment.status === "success");
  const todayScores = scores.filter(
    (row) => row.completedMs >= dayStart && row.completedMs < dayStart + DAY,
  );
  const weekScores = scores.filter(
    (row) => row.completedMs >= weekStart && row.completedMs < weekStart + 7 * DAY,
  );
  const courses = new Map();
  for (const row of scores) {
    const name = row.course || "Other";
    const current = courses.get(name) || { course: name, tests: 0, total: 0 };
    current.tests += 1;
    current.total += row.score;
    courses.set(name, current);
  }
  const boardRows = scores.map((row) => ({
    id: `${row.uid}:${row.completedMs}`,
    uid: row.uid,
    name: row.name || "Student",
    score: row.score,
    completedMs: row.completedMs,
  }));
  const emailFor = (uid) =>
    profileByUid.get(uid)?.email || authByUid.get(uid)?.email || "Unknown";

  return {
    generatedAt: new Date(now).toISOString(),
    truncated,
    scoresTruncated,
    authNote,
    firebase,
    promo: { active: promoActive(now), until: promoUntilDate() },
    priceNaira: 1000,
    groqKeys: groqKeys().length,
    accounts: authUsers.length,
    newThisWeek: authUsers.filter((user) => user.createdAt >= now - 7 * DAY).length,
    profiles: profiles.length,
    paidNow: profiles.filter((profile) => profile.premiumUntilMs > now).length,
    payments: successful.length,
    pendingPayments: payments.filter((payment) => payment.status === "pending").length,
    revenueNaira: Math.round(
      successful.reduce((sum, payment) => sum + (Number(payment.amountKobo) || 0), 0) / 100,
    ),
    tests: scores.length,
    testsToday: todayScores.length,
    testsThisWeek: weekScores.length,
    activeToday: new Set(todayScores.map((row) => row.uid)).size,
    average: scores.length
      ? Math.round(scores.reduce((sum, row) => sum + row.score, 0) / scores.length)
      : 0,
    courses: [...courses.values()]
      .map((course) => ({
        course: course.course,
        tests: course.tests,
        average: Math.round(course.total / course.tests),
      }))
      .sort((a, b) => b.tests - a.tests),
    recentAccounts: authUsers
      .slice()
      .sort((a, b) => b.createdAt - a.createdAt)
      .slice(0, 8)
      .map((user) => ({
        email: user.email || "No email",
        name: user.name || "",
        joined: user.createdAt ? new Date(user.createdAt).toISOString() : null,
        lastSignIn: user.lastSignInAt ? new Date(user.lastSignInAt).toISOString() : null,
        paid: Boolean(profileByUid.get(user.uid)?.premiumUntilMs > now),
      })),
    recentPayments: payments
      .slice()
      .sort((a, b) => b.atMs - a.atMs)
      .slice(0, 8)
      .map((payment) => ({
        reference: payment.reference,
        email: emailFor(payment.uid),
        amount: Math.round((Number(payment.amountKobo) || 0) / 100),
        status: payment.status || "unknown",
        at: payment.atMs ? new Date(payment.atMs).toISOString() : null,
      })),
    prize: {
      thisWeek: winnerCard(boardRows, weekStart, weekStart + 7 * DAY, weekId(weekStart), false),
      lastWeek: winnerCard(
        boardRows,
        weekStart - 7 * DAY,
        weekStart,
        weekId(weekStart - 7 * DAY),
        true,
      ),
      thisMonth: winnerCard(boardRows, monthStart, nextMonthStart(now), monthId(now), true),
    },
  };
}

async function readAuthUsers(auth) {
  const users = [];
  let pageToken;
  let truncated = false;
  do {
    const page = await auth.listUsers(1000, pageToken);
    for (const user of page.users) {
      users.push({
        uid: user.uid,
        email: user.email || "",
        name: user.displayName || "",
        createdAt: user.metadata?.creationTime ? Date.parse(user.metadata.creationTime) : 0,
        lastSignInAt: user.metadata?.lastSignInTime ? Date.parse(user.metadata.lastSignInTime) : 0,
      });
    }
    pageToken = page.pageToken;
    if (users.length >= 3000 && pageToken) {
      truncated = true;
      break;
    }
  } while (pageToken);
  return { users, truncated };
}

export async function adminDashboard() {
  if (!firebaseConfigured()) {
    return summariseAdmin({ firebase: false, authNote: "Firebase is not connected on this server." });
  }
  const { auth, db } = await firebaseServices();
  let authUsers = [];
  let truncated = false;
  let authNote = "";
  try {
    const listed = await readAuthUsers(auth);
    authUsers = listed.users;
    truncated = listed.truncated;
  } catch (error) {
    authNote = "Sign-in accounts could not be listed. Profile and payment figures are still shown.";
    console.error("Admin account list failed", error?.message);
  }

  const profiles = [];
  let cursor = null;
  for (let page = 0; page < 4; page++) {
    let query = db.collection("oracleUsers").limit(500);
    if (cursor) query = query.startAfter(cursor);
    const snap = await query.get();
    if (snap.empty) break;
    for (const doc of snap.docs) {
      const data = doc.data() || {};
      profiles.push({
        uid: doc.id,
        email: data.email || "",
        premiumUntilMs: data.premiumUntil?.toMillis?.() || 0,
        updatedAtMs: data.updatedAt?.toMillis?.() || data.lastActivityAt?.toMillis?.() || 0,
      });
    }
    cursor = snap.docs[snap.docs.length - 1];
    if (snap.size < 500) break;
  }

  const payments = [];
  const paySnap = await db.collection("oraclePayments").limit(200).get();
  for (const doc of paySnap.docs) {
    const data = doc.data() || {};
    payments.push({
      reference: doc.id,
      uid: data.uid || "",
      amountKobo: Number(data.amount) || 0,
      status: data.status || "",
      atMs: data.verifiedAt?.toMillis?.() || data.createdAt?.toMillis?.() || 0,
    });
  }

  const scores = [];
  const board = await db.collection("oracleBoard").limit(800).get();
  for (const doc of board.docs) {
    const data = doc.data() || {};
    const score = Number(data.score);
    const completedMs = Number(data.completedMs) || 0;
    if (!data.uid || !Number.isFinite(score) || completedMs <= 0) continue;
    scores.push({
      uid: String(data.uid),
      name: String(data.name || ""),
      score: Math.max(0, Math.min(100, Math.round(score))),
      course: String(data.course || "Other"),
      completedMs,
    });
  }

  return summariseAdmin({
    authUsers,
    profiles,
    payments,
    scores,
    truncated,
    scoresTruncated: board.size >= 800,
    authNote,
    firebase: true,
  });
}
