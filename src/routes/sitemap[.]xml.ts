import { createFileRoute } from "@tanstack/react-router";

// Sitemap de FITCLUBUY: inicio, categorías, páginas locales (/uy/<palabra>/<ciudad>) y productos
export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const { slugsProdutos, TITULOS } = await import("@/lib/catalogo-moda.server");
        const { SITE, PALABRAS, CIUDADES } = await import("@/lib/seo-uy");
        const hoy = new Date().toISOString().slice(0, 10);
        const urls: [string, string][] = [
          ["/", "1.0"],
          ...Object.keys(TITULOS).map((c): [string, string] => [`/c/${c}`, "0.8"]),
          ...PALABRAS.flatMap((p) => CIUDADES.map((c): [string, string] => [`/uy/${p.slug}/${c.slug}`, "0.6"])),
          ...slugsProdutos().map((s): [string, string] => [`/p/${s}`, "0.7"]),
        ];
        const xml =
          '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
          urls.map(([u, pr]) => `<url><loc>${SITE}${encodeURI(u)}</loc><lastmod>${hoy}</lastmod><priority>${pr}</priority></url>`).join("\n") +
          "\n</urlset>";
        return new Response(xml, { headers: { "Content-Type": "application/xml; charset=utf-8", "Cache-Control": "public, max-age=3600" } });
      },
    },
  },
});
