import { createFileRoute } from "@tanstack/react-router";
import { AdminPage } from "@/components/oracle/AdminPage";

export const Route = createFileRoute("/admin")({
  component: AdminPage,
  head: () => ({
    meta: [
      { title: "Admin | Exam Oracle" },
      { name: "robots", content: "noindex" },
    ],
  }),
});
