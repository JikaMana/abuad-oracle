import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/leaderboard.html")({
  beforeLoad: () => {
    throw redirect({ to: "/leaderboard" });
  },
});
