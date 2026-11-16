import test from "node:test";
import assert from "node:assert/strict";
import {
  assembleBoard,
  claimCode,
  publicName,
  rankWindow,
  recordScore,
  startOfLagosWeek,
} from "./leaderboard.mjs";

const WEEK = startOfLagosWeek(Date.parse("2026-11-14T10:00:00+01:00"));

function row(uid, name, score, offsetHours) {
  return {
    id: `${uid}-${offsetHours}`,
    uid,
    name,
    score,
    completedMs: WEEK + offsetHours * 3600000,
  };
}

test("public names never keep an email address", () => {
  assert.equal(publicName("  Ada  Yusuf ", "ada@example.com"), "Ada Yusuf");
  assert.equal(publicName("", "ada.yusuf@example.com"), "ada yusuf");
  assert.equal(publicName("<script>", ""), "Student");
});

test("only three tests a day count, and this week's leader cannot claim yet", () => {
  const rows = [
    row("ada", "Ada Yusuf", 90, 2),
    row("ada", "Ada Yusuf", 80, 3),
    row("ada", "Ada Yusuf", 70, 4),
    row("ada", "Ada Yusuf", 10, 5),
    row("bola", "Bola Ade", 60, 6),
  ];
  const ranked = rankWindow(rows, WEEK, WEEK + 7 * 86400000);
  assert.equal(ranked[0].name, "Ada Yusuf");
  assert.equal(ranked[0].tests, 3);
  const board = assembleBoard(rows, "ada", WEEK + 10 * 3600000);
  assert.equal(board.periods.weekly.rows[0].you, true);
  assert.equal(board.prizes.weekly.locked, true);
  assert.equal(board.prizes.weekly.yours, false);
  assert.equal(board.prizes.weekly.code, null);
  assert.match(board.prizes.weekly.note, /Monday 00:00/);
});

test("the weekly prize opens on Monday for last week's winner only", () => {
  const rows = [
    row("bola", "Bola Ade", 99, 2),
    row("bola", "Bola Ade", 98, 26),
    row("ada", "Ada Yusuf", 92, -30),
    row("bola", "Bola Ade", 50, -20),
  ];
  const leader = assembleBoard(rows, "bola", WEEK + 30 * 3600000);
  assert.equal(leader.periods.weekly.rows[0].name, "Bola Ade");
  assert.equal(leader.prizes.weekly.locked, true);
  assert.equal(leader.prizes.weekly.code, null);
  const winner = assembleBoard(rows, "ada", WEEK + 30 * 3600000);
  assert.equal(winner.prizes.weekly.leaderName, "Ada Yusuf");
  assert.equal(winner.prizes.weekly.yours, true);
  assert.equal(winner.prizes.weekly.locked, false);
  assert.equal(winner.prizes.weekly.code, claimCode(winner.prizes.weekly.code.split("-")[1], "ada"));
});

test("a recorded local score appears on the board", async () => {
  const stamp = Date.now();
  await recordScore(
    { uid: `local_board_${stamp}`, email: "kemi@example.com" },
    { id: stamp, name: "Kemi Bello", course: "MTH 101", total: 10, correct: 8 },
  );
  const { leaderboardFor } = await import("./leaderboard.mjs");
  const board = await leaderboardFor(`local_board_${stamp}`);
  const mine = board.periods.daily.rows.find((item) => item.you);
  assert.equal(mine.name, "Kemi Bello");
  assert.equal(mine.average, 80);
});
