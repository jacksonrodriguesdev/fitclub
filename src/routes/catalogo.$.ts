import { createFileRoute } from "@tanstack/react-router";

// Fotos do catálogo de moda baixado (CATALOGO_DIR/fotos/<referencia>/<cor>/<arquivo>)
const TIPOS: Record<string, string> = { jpg: "image/jpeg", jpeg: "image/jpeg", png: "image/png", webp: "image/webp" };

export const Route = createFileRoute("/catalogo/$")({
  server: {
    handlers: {
      GET: async ({ params }) => {
        const path = await import("path");
        const fs = await import("fs/promises");
        // "lupo/..." = fotos de la línea LUPO (CATALOGO_LUPO_DIR/fotos)
        let rel = decodeURIComponent(params._splat ?? "");
        let base = process.env.CATALOGO_DIR || "C:/Users/USER/Desktop/live/produtos";
        if (rel.startsWith("lupo/")) {
          rel = rel.slice(5);
          base = process.env.CATALOGO_LUPO_DIR || "C:/Users/USER/Desktop/lupo/produtos";
        }
        const raiz = path.resolve(base, "fotos");
        const arquivo = path.resolve(raiz, rel);
        const tipo = TIPOS[arquivo.split(".").pop()?.toLowerCase() ?? ""];
        if (!arquivo.startsWith(raiz + path.sep) || !tipo) return new Response("Não encontrado", { status: 404 });
        try {
          return new Response(await fs.readFile(arquivo), {
            headers: { "Content-Type": tipo, "Cache-Control": "public, max-age=604800" },
          });
        } catch {
          return new Response("Não encontrado", { status: 404 });
        }
      },
    },
  },
});
