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

test("only three tests a day count, and the weekly winner alone receives a code", () => {
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
  assert.equal(board.prizes.weekly.yours, true);
  assert.equal(board.prizes.weekly.locked, false);
  assert.equal(board.prizes.weekly.code, claimCode(board.prizes.weekly.code.split("-")[1], "ada"));
  const stranger = assembleBoard(rows, "bola", WEEK + 10 * 3600000);
  assert.equal(stranger.prizes.weekly.locked, true);
  assert.equal(stranger.prizes.weekly.code, null);
  assert.equal(stranger.prizes.weekly.leaderName, "Ada Yusuf");
  assert.equal(stranger.periods.weekly.rows.find((item) => item.name === "Bola Ade").you, true);
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
