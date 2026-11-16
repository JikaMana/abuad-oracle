import test from "node:test";
import assert from "node:assert/strict";
import { isAdmin, summariseAdmin, ADMIN_EMAIL } from "./admin.mjs";
import { claimCode, weekId, startOfLagosWeek } from "./leaderboard.mjs";

const NOW = Date.parse("2026-11-14T10:00:00+01:00");
const WEEK = startOfLagosWeek(NOW);

test("only the admin email can open the dashboard", () => {
  assert.equal(isAdmin({ email: ADMIN_EMAIL, email_verified: true }), true);
  assert.equal(isAdmin({ email: "BurhanTutors@gmail.com" }), true);
  assert.equal(isAdmin({ email: "student@gmail.com" }), false);
  assert.equal(isAdmin({ email: ADMIN_EMAIL, local: true }), false);
  assert.equal(isAdmin(null), false);
});

test("admin figures count users, payments and the finished-week prize", () => {
  const board = summariseAdmin({
    now: NOW,
    authUsers: [
      { uid: "ada", email: "ada@uni.edu", name: "Ada", createdAt: WEEK - 10 * 86400000, lastSignInAt: NOW },
      { uid: "bola", email: "bola@uni.edu", name: "Bola", createdAt: NOW - 86400000, lastSignInAt: NOW },
    ],
    profiles: [
      { uid: "ada", email: "ada@uni.edu", premiumUntilMs: NOW + 86400000 },
      { uid: "bola", email: "bola@uni.edu", premiumUntilMs: 0 },
    ],
    payments: [
      { reference: "pay_ada", uid: "ada", amountKobo: 100000, status: "success", atMs: NOW - 1000 },
      { reference: "pay_wait", uid: "bola", amountKobo: 100000, status: "pending", atMs: NOW },
    ],
    scores: [
      { uid: "ada", name: "Ada Yusuf", score: 90, course: "PHY 101", completedMs: WEEK - 2 * 86400000 },
      { uid: "bola", name: "Bola Ade", score: 70, course: "MTH 101", completedMs: WEEK + 3 * 3600000 },
      { uid: "bola", name: "Bola Ade", score: 80, course: "MTH 101", completedMs: NOW },
    ],
  });

  assert.equal(board.accounts, 2);
  assert.equal(board.newThisWeek, 1);
  assert.equal(board.paidNow, 1);
  assert.equal(board.payments, 1);
  assert.equal(board.pendingPayments, 1);
  assert.equal(board.revenueNaira, 1000);
  assert.equal(board.tests, 3);
  assert.equal(board.testsToday, 1);
  assert.equal(board.activeToday, 1);
  assert.equal(board.prize.thisWeek.name, "Bola Ade");
  assert.equal(board.prize.thisWeek.code, null);
  assert.equal(board.prize.lastWeek.name, "Ada Yusuf");
  assert.equal(board.prize.lastWeek.code, claimCode(weekId(WEEK - 7 * 86400000), "ada"));
  assert.equal(board.recentPayments[0].email, "bola@uni.edu");
  assert.equal(board.courses.find((course) => course.course === "MTH 101").tests, 2);
});
