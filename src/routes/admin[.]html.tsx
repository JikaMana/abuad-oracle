import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/admin.html")({
  beforeLoad: () => {
    throw redirect({ to: "/admin" });
  },
});
