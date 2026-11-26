import { createFileRoute, notFound } from "@tanstack/react-router";
import { listarFn } from "@/lib/catalogo-moda";
import { CardModa, LojaHeader } from "@/components/moda/Loja";
import { CIUDADES, PALABRAS, SITE, ciudadPorSlug, contenidoLocal, palabraPorSlug } from "@/lib/seo-uy";

// Página local de SEO: /uy/calzas-deportivas/montevideo, /uy/bikinis-y-mallas/punta-del-este...
export const Route = createFileRoute("/uy/$palabra/$ciudad")({
  loader: async ({ params }) => {
    const p = palabraPorSlug(params.palabra);
    const c = ciudadPorSlug(params.ciudad);
    if (!p || !c) throw notFound();
    const lista = await listarFn({ data: { cat: p.filtro } });
    return { p, c, productos: lista.itens.slice(0, 16), total: lista.total };
  },
  head: ({ loaderData: d }) => {
    if (!d) return {};
    const t = contenidoLocal(d.p, d.c);
    const url = `${SITE}/uy/${d.p.slug}/${d.c.slug}`;
    return {
      meta: [
        { title: t.metaTitulo },
        { name: "description", content: t.descripcion },
        { name: "keywords", content: [d.p.frase, ...d.p.variantes].map((v) => `${v.toLowerCase()} ${d.c.ciudad}`).join(", ") },
        { property: "og:title", content: t.metaTitulo },
        { property: "og:description", content: t.descripcion },
        ...(d.productos[0] ? [{ property: "og:image", content: d.productos[0].foto }] : []),
        { name: "geo.region", content: "UY" },
        { name: "geo.placename", content: `${d.c.ciudad}, ${d.c.departamento}` },
      ],
      links: [{ rel: "canonical", href: url }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Inicio", item: `${SITE}/` },
              { "@type": "ListItem", position: 2, name: d.p.frase, item: `${SITE}/uy/${d.p.slug}/montevideo` },
              { "@type": "ListItem", position: 3, name: d.c.ciudad, item: url },
            ],
          }),
        },
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: t.preguntas.map((q) => ({ "@type": "Question", name: q.p, acceptedAnswer: { "@type": "Answer", text: q.r } })),
          }),
        },
      ],
    };
  },
  component: PaginaLocal,
});

function PaginaLocal() {
  const { p, c, productos, total } = Route.useLoaderData();
  const t = contenidoLocal(p, c);
  const vecinas = CIUDADES.filter((x) => x.departamento === c.departamento && x.slug !== c.slug);
  const capitales = CIUDADES.filter((x, i, a) => a.findIndex((y) => y.departamento === x.departamento) === i && x.slug !== c.slug);
  return (
    <div className="bg-white text-neutral-900 min-h-screen">
      <LojaHeader />
      <div className="mx-auto max-w-7xl px-4 pt-8">
        <nav className="text-xs text-neutral-500"><a href="/" className="hover:underline">Inicio</a> / {p.frase} / {c.ciudad}</nav>
        <h1 className="mt-2 text-3xl sm:text-4xl font-extrabold tracking-tight">{t.titulo}</h1>
        <div className="mt-3 max-w-3xl space-y-2 text-neutral-600">
          {t.intro.map((x) => <p key={x}>{x}</p>)}
        </div>

        <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-8">
          {productos.map((x) => <CardModa key={x.id} p={x} />)}
        </div>
        <div className="text-center mt-8">
          <a href={`/c/${p.filtro}`} className="inline-block border border-black px-8 py-3 font-semibold hover:bg-black hover:text-white">
            Ver los {total} productos
          </a>
        </div>

        <section className="mt-14 max-w-3xl">
          <h2 className="text-2xl font-bold">Preguntas frecuentes</h2>
          <div className="mt-4 divide-y border-y">
            {t.preguntas.map((q) => (
              <details key={q.p} className="py-4">
                <summary className="font-semibold cursor-pointer">{q.p}</summary>
                <p className="mt-2 text-neutral-600">{q.r}</p>
              </details>
            ))}
          </div>
        </section>

        <section className="mt-12 grid gap-8 md:grid-cols-3 text-sm">
          <div>
            <h2 className="font-bold mb-3">Más en {c.ciudad}</h2>
            <ul className="space-y-1.5">
              {PALABRAS.filter((x) => x.slug !== p.slug).map((x) => (
                <li key={x.slug}><a href={`/uy/${x.slug}/${c.slug}`} className="hover:underline">{x.frase} en {c.ciudad}</a></li>
              ))}
            </ul>
          </div>
          {vecinas.length > 0 && (
            <div>
              <h2 className="font-bold mb-3">{p.frase} en {c.departamento}</h2>
              <ul className="space-y-1.5">
                {vecinas.map((x) => <li key={x.slug}><a href={`/uy/${p.slug}/${x.slug}`} className="hover:underline">{x.ciudad}</a></li>)}
              </ul>
            </div>
          )}
          <div>
            <h2 className="font-bold mb-3">{p.frase} en Uruguay</h2>
            <ul className="space-y-1.5">
              {capitales.map((x) => <li key={x.slug}><a href={`/uy/${p.slug}/${x.slug}`} className="hover:underline">{x.ciudad}</a></li>)}
            </ul>
          </div>
        </section>
      </div>
    </div>
  );
}
