// @ts-nocheck
import { createHmac } from "node:crypto";
import {
  firebaseConfigured,
  firebaseServices,
  memoryPremiumUids,
  promoActive,
} from "./account.mjs";

const DAY = 86400000;
const LAGOS = 3600000;
const memoryScores = [];

export function publicName(raw, email) {
  const cleaned = String(raw || "")
    .replace(/<[^>]*>/g, " ")
    .replace(/[^\p{L}\p{N} .'-]/gu, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 28);
  if (cleaned) return cleaned;
  const local = String(email || "")
    .split("@")[0]
    .replace(/[._+-]+/g, " ")
    .trim();
  return local ? local.slice(0, 28) : "Student";
}

export function lagosStamp(ms) {
  return new Date(ms + LAGOS);
}

export function startOfLagosDay(ms) {
  const d = lagosStamp(ms);
  return Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()) - LAGOS;
}

export function startOfLagosWeek(ms) {
  const start = startOfLagosDay(ms);
  const sunday = lagosStamp(start).getUTCDay();
  return start - ((sunday + 6) % 7) * DAY;
}

export function startOfLagosMonth(ms) {
  const d = lagosStamp(ms);
  return Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), 1) - LAGOS;
}

export function weekId(ms) {
  const start = startOfLagosWeek(ms);
  const d = lagosStamp(start);
  const month = String(d.getUTCMonth() + 1).padStart(2, "0");
  const day = String(d.getUTCDate()).padStart(2, "0");
  return `W${d.getUTCFullYear()}${month}${day}`;
}

export function monthId(ms) {
  const d = lagosStamp(startOfLagosMonth(ms));
  return `M${d.getUTCFullYear()}${String(d.getUTCMonth() + 1).padStart(2, "0")}`;
}

export function claimCode(periodId, uid) {
  const salt = process.env.QUOTA_SALT || "exam-oracle-prize";
  const digest = createHmac("sha256", salt).update(`${periodId}:${uid}`).digest("hex");
  return `ORC-${periodId}-${digest.slice(0, 6).toUpperCase()}`;
}

function average(rows) {
  if (!rows.length) return 0;
  return rows.reduce((sum, row) => sum + row.score, 0) / rows.length;
}

function courseAttempts(row) {
  if (Array.isArray(row.courses) && row.courses.length) return row.courses;
  return [{ name: row.course || "Course", score: row.score, total: row.total ?? 10 }];
}

function countsForRank(row) {
  return !Number.isFinite(row.total) || row.total >= 10;
}

/** A gain counts in full. A drop counts at half size. One number per course, then the mean. */
function netImprovement(tests) {
  const byCourse = new Map();
  const ordered = tests.slice().sort((a, b) => a.completedMs - b.completedMs);
  for (const test of ordered) {
    for (const part of courseAttempts(test)) {
      if (Number.isFinite(part.total) && part.total < 5) continue;
      if (!byCourse.has(part.name)) byCourse.set(part.name, []);
      byCourse.get(part.name).push(part.score);
    }
  }
  const improvements = [];
  for (const scores of byCourse.values()) {
    if (scores.length < 2) continue;
    let net = 0;
    for (let i = 1; i < scores.length; i++) {
      const delta = scores[i] - scores[i - 1];
      net += delta >= 0 ? delta : delta / 2;
    }
    improvements.push(net);
  }
  if (!improvements.length) return 0;
  return improvements.reduce((sum, value) => sum + value, 0) / improvements.length;
}

export function rankWindow(rows, from, to, paying = null) {
  const grouped = new Map();
  for (const row of rows) {
    if (row.completedMs < from || row.completedMs >= to) continue;
    if (paying && !paying.has(row.uid)) continue;
    if (!countsForRank(row)) continue;
    if (!grouped.has(row.uid)) grouped.set(row.uid, []);
    grouped.get(row.uid).push(row);
  }
  const students = [];
  for (const [uid, tests] of grouped) {
    const avg = average(tests);
    const improvement = netImprovement(tests);
    const days = new Set(tests.map((row) => startOfLagosDay(row.completedMs))).size;
    const latest = tests
      .slice()
      .sort((a, b) => a.completedMs - b.completedMs)
      .at(-1);
    students.push({
      uid,
      name: latest.name || "Student",
      average: Math.round(avg),
      improvement: Math.round(improvement),
      tests: tests.length,
      days,
      points: Math.round(avg * 10 + improvement * 4 + days * 15),
    });
  }
  students.sort((a, b) => b.points - a.points || b.average - a.average || b.tests - a.tests);
  return students.map((student, index) => ({ ...student, rank: index + 1 }));
}

function bucketSeries(rows, buckets) {
  return buckets.map((bucket) => {
    const inside = rows.filter(
      (row) => row.completedMs >= bucket.from && row.completedMs < bucket.to,
    );
    return {
      label: bucket.label,
      tests: inside.length,
      average: inside.length ? Math.round(average(inside)) : 0,
    };
  });
}

function dayBuckets(now, count) {
  const end = startOfLagosDay(now) + DAY;
  const buckets = [];
  for (let i = count - 1; i >= 0; i--) {
    const from = end - (i + 1) * DAY;
    buckets.push({
      from,
      to: from + DAY,
      label: lagosStamp(from).toLocaleDateString("en-GB", { weekday: "short", timeZone: "UTC" }),
    });
  }
  return buckets;
}

function weekBuckets(now, count) {
  const end = startOfLagosWeek(now) + 7 * DAY;
  const buckets = [];
  for (let i = count - 1; i >= 0; i--) {
    const from = end - (i + 1) * 7 * DAY;
    buckets.push({
      from,
      to: from + 7 * DAY,
      label: lagosStamp(from).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        timeZone: "UTC",
      }),
    });
  }
  return buckets;
}

function monthBuckets(now, count) {
  const start = startOfLagosMonth(now);
  const buckets = [];
  for (let i = count - 1; i >= 0; i--) {
    const d = lagosStamp(start);
    const from = Date.UTC(d.getUTCFullYear(), d.getUTCMonth() - i, 1) - LAGOS;
    const next = lagosStamp(from);
    const to = Date.UTC(next.getUTCFullYear(), next.getUTCMonth() + 1, 1) - LAGOS;
    buckets.push({
      from,
      to,
      label: lagosStamp(from).toLocaleDateString("en-GB", { month: "short", timeZone: "UTC" }),
    });
  }
  return buckets;
}

function prizeView(leader, periodId, viewerUid) {
  if (!leader) {
    return { leaderName: null, yours: false, locked: true, code: null };
  }
  const yours = Boolean(viewerUid && viewerUid === leader.uid);
  return {
    leaderName: leader.name,
    yours,
    locked: !yours,
    code: yours ? claimCode(periodId, leader.uid) : null,
  };
}

function weeklyPrize(rows, viewerUid, now) {
  const weekStart = startOfLagosWeek(now);
  const finishedFrom = weekStart - 7 * DAY;
  const winner = rankWindow(rows, finishedFrom, weekStart)[0] || null;
  const view = prizeView(winner, weekId(finishedFrom), viewerUid);
  const note = view.yours
    ? "You won the finished week. Message the admin with this code."
    : winner
      ? `Locked. ${winner.name} won the finished week. The code opens only for that student, from Monday 00:00.`
      : "Locked until Monday 00:00. Even this week's leader cannot claim until the week has ended.";
  return { ...view, note };
}

export function assembleBoard(rows, viewerUid, now = Date.now(), paying = null) {
  const source = rows.filter((row) => !paying || paying.has(row.uid));
  const counted = source.filter(countsForRank);
  const dayStart = startOfLagosDay(now);
  const weekStart = startOfLagosWeek(now);
  const monthStart = startOfLagosMonth(now);
  const periods = {
    daily: {
      label: "Today",
      from: dayStart,
      to: dayStart + DAY,
      rows: rankWindow(counted, dayStart, dayStart + DAY),
      chart: bucketSeries(counted, dayBuckets(now, 7)),
    },
    weekly: {
      label: "This week",
      from: weekStart,
      to: weekStart + 7 * DAY,
      rows: rankWindow(counted, weekStart, weekStart + 7 * DAY),
      chart: bucketSeries(counted, weekBuckets(now, 8)),
    },
    monthly: {
      label: "This month",
      from: monthStart,
      to:
        Date.UTC(
          lagosStamp(monthStart).getUTCFullYear(),
          lagosStamp(monthStart).getUTCMonth() + 1,
          1,
        ) - LAGOS,
      rows: rankWindow(
        counted,
        monthStart,
        Date.UTC(
          lagosStamp(monthStart).getUTCFullYear(),
          lagosStamp(monthStart).getUTCMonth() + 1,
          1,
        ) - LAGOS,
      ),
      chart: bucketSeries(counted, monthBuckets(now, 6)),
    },
  };
  const present = (list) =>
    list.slice(0, 20).map((row) => ({
      rank: row.rank,
      name: row.name,
      you: Boolean(viewerUid && row.uid === viewerUid),
      average: row.average,
      improvement: row.improvement,
      tests: row.tests,
      days: row.days,
      points: row.points,
    }));
  return {
    updatedAt: new Date(now).toISOString(),
    ranking:
      "Points = average × 10 + net improvement × 4 + days × 15. Only tests of 10 or more questions count. Only paying students are ranked. Times are WAT.",
    periods: {
      daily: { ...periods.daily, rows: present(periods.daily.rows) },
      weekly: { ...periods.weekly, rows: present(periods.weekly.rows) },
      monthly: { ...periods.monthly, rows: present(periods.monthly.rows) },
    },
    prizes: {
      weekly: {
        title: "Weekly prize",
        reward: "",
        ...weeklyPrize(counted, viewerUid, now),
      },
      monthly: {
        title: "Monthly prize",
        reward: "Next month free",
        ...prizeView(periods.monthly.rows[0], monthId(now), viewerUid),
        note:
          periods.monthly.rows[0] && viewerUid === periods.monthly.rows[0].uid
            ? "Message the admin with this code to confirm you won."
            : "This code stays locked because you are not the winner.",
      },
    },
    whatsapp: "2348165689362",
  };
}

function normaliseStored(data, id) {
  const completedMs = Number(data.completedMs || data.completedAt?.toMillis?.() || 0);
  const score = Number(data.score);
  if (!data.uid || !Number.isFinite(completedMs) || completedMs <= 0) return null;
  if (!Number.isFinite(score)) return null;
  const total = Number(data.total);
  const courses = Array.isArray(data.courses)
    ? data.courses
        .map((part) => ({
          name: String(part.name || part.course || "").trim(),
          score: Math.max(0, Math.min(100, Math.round(Number(part.score)))),
          total: Number(part.total),
        }))
        .filter((part) => part.name && Number.isFinite(part.score))
    : [];
  return {
    id,
    uid: String(data.uid),
    name: publicName(data.name, data.email),
    score: Math.max(0, Math.min(100, Math.round(score))),
    completedMs,
    total: Number.isFinite(total) ? total : null,
    course: String(data.course || courses[0]?.name || ""),
    courses,
  };
}

async function readFirebaseScores() {
  const { db } = await firebaseServices();
  const snap = await db.collection("oracleBoard").limit(800).get();
  const rows = [];
  const seen = new Set();
  for (const doc of snap.docs) {
    const row = normaliseStored(doc.data(), doc.id);
    if (!row || seen.has(row.id)) continue;
    seen.add(row.id);
    rows.push(row);
  }
  try {
    const legacy = await db
      .collectionGroup("tests")
      .where("status", "==", "completed")
      .limit(300)
      .get();
    for (const doc of legacy.docs) {
      const uid = doc.ref.parent?.parent?.id;
      const id = `${uid}_${doc.id}`;
      if (!uid || seen.has(id)) continue;
      const data = doc.data();
      const row = normaliseStored(
        {
          uid,
          name: data.displayName,
          score: data.score,
          completedMs: data.completedAt?.toMillis?.() || 0,
        },
        id,
      );
      if (!row) continue;
      seen.add(id);
      rows.push(row);
    }
  } catch (error) {
    console.error("Older tests were not added to the leaderboard", error?.message);
  }
  return rows;
}

function courseParts(input, score) {
  if (Array.isArray(input.courses) && input.courses.length) {
    return input.courses
      .map((part) => ({
        name: String(part.name || part.course || "").trim(),
        score: Math.max(0, Math.min(100, Math.round(Number(part.score)))),
        total: Number(part.total) || 0,
      }))
      .filter((part) => part.name && Number.isFinite(part.score));
  }
  const name = String(input.course || "Course").trim() || "Course";
  return [{ name, score, total: Number(input.total) || 0 }];
}

export async function recordScore(user, input) {
  const score = Math.round((input.correct / input.total) * 100);
  const courses = courseParts(input, score);
  const row = {
    id: `${user.uid}_${input.id}`,
    uid: user.uid,
    name: publicName(input.name, user.email || user.name),
    score,
    completedMs: Date.now(),
    course: input.course || courses[0]?.name || "",
    total: Number(input.total) || 0,
    courses,
  };
  if (!firebaseConfigured() || String(user.uid).startsWith("local_")) {
    const index = memoryScores.findIndex((item) => item.id === row.id);
    if (index >= 0) memoryScores[index] = row;
    else memoryScores.push(row);
    return;
  }
  try {
    const { db } = await firebaseServices();
    await db.collection("oracleBoard").doc(row.id).set({
      uid: row.uid,
      name: row.name,
      score: row.score,
      course: row.course,
      total: row.total,
      courses: row.courses,
      completedMs: row.completedMs,
    });
  } catch (error) {
    console.error("Could not publish leaderboard score", error?.message);
  }
}

async function payingStudents(now) {
  if (promoActive(now)) return null;
  const paying = new Set(memoryPremiumUids(now));
  if (!firebaseConfigured()) return paying;
  try {
    const { db } = await firebaseServices();
    const { Timestamp } = await import("firebase-admin/firestore");
    const snap = await db
      .collection("oracleUsers")
      .where("premiumUntil", ">", Timestamp.fromMillis(now))
      .get();
    for (const doc of snap.docs) paying.add(doc.id);
  } catch (error) {
    console.error("Paying students could not be read", error?.message);
  }
  return paying;
}

export async function leaderboardFor(viewerUid) {
  const rows = memoryScores.slice();
  const seen = new Set(rows.map((row) => row.id));
  if (firebaseConfigured()) {
    try {
      for (const row of await readFirebaseScores()) {
        if (seen.has(row.id)) continue;
        seen.add(row.id);
        rows.push(row);
      }
    } catch (error) {
      console.error("Leaderboard scores could not be read", error?.message);
    }
  }
  const now = Date.now();
  return assembleBoard(rows, viewerUid || null, now, await payingStudents(now));
}
