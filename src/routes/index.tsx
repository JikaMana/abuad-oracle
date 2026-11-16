import { createFileRoute } from "@tanstack/react-router";
import { HomePage } from "@/components/home/HomePage";

export const Route = createFileRoute("/")({
  component: HomePage,
  head: () => ({
    meta: [
      { title: "Exam Oracle for ABUAD Students | Burhan Tutors" },
      { name: "description", content: "Prepare smarter with Exam Oracle, the ABUAD 100-level practice tool." },
    ],
  }),
});
