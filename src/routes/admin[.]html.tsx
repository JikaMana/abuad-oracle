import { createFileRoute } from "@tanstack/react-router";
import pageHtml from "../../site/admin.html?raw";

export const Route = createFileRoute("/admin.html")({
  server: {
    handlers: {
      GET: async () =>
        new Response(pageHtml, {
          headers: {
            "content-type": "text/html; charset=utf-8",
            "cache-control": "no-cache",
            "x-robots-tag": "noindex",
          },
        }),
    },
  },
});
