import { createFileRoute } from "@tanstack/react-router";
import { PracticePage } from "@/components/oracle/PracticePage";

export const Route = createFileRoute("/exam-oracle")({
  component: PracticePage,
  head: () => ({ meta: [{ title: "Practice | Exam Oracle" }] }),
});
