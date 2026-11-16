import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/exam-oracle.html")({
  beforeLoad: () => {
    throw redirect({ to: "/exam-oracle" });
  },
});
