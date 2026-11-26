import { createFileRoute } from "@tanstack/react-router";
import { SITE } from "@/lib/seo-uy";

// Buscadores: indexar la tienda, no el panel, la API, la cuenta ni las búsquedas internas
export const Route = createFileRoute("/robots.txt")({
  server: {
    handlers: {
      GET: () =>
        new Response(
          ["User-agent: *", "Allow: /", "Disallow: /admin", "Disallow: /api/", "Disallow: /_serverFn/",
            "Disallow: /login", "Disallow: /cadastro", "Disallow: /cuenta", "Disallow: /buscar", "",
            `Sitemap: ${SITE}/sitemap.xml`, ""].join("\n"),
          { headers: { "Content-Type": "text/plain; charset=utf-8" } },
        ),
    },
  },
});
