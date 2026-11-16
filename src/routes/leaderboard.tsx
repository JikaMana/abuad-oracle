import { createFileRoute } from "@tanstack/react-router";
import { LeaderboardPage } from "@/components/oracle/LeaderboardPage";

export const Route = createFileRoute("/leaderboard")({
  component: LeaderboardPage,
  head: () => ({ meta: [{ title: "Leaderboard | Exam Oracle" }] }),
});
