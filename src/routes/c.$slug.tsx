import { createFileRoute } from "@tanstack/react-router";
import { listarFn } from "@/lib/catalogo-moda";
import { LOJA } from "@/lib/loja";
import { Listado, validarBusca } from "@/components/moda/Listado";

// Categoría: /c/mujer, /c/hombre, /c/playa... (?talle=M&orden=menor&pagina=2)
export const Route = createFileRoute("/c/$slug")({
  validateSearch: validarBusca,
  loaderDeps: ({ search }) => search,
  loader: ({ params, deps }) => listarFn({ data: { ...deps, cat: params.slug } }),
  head: ({ loaderData }) => ({ meta: [{ title: `${loaderData?.titulo ?? "Productos"} — ${LOJA.nome}` }] }),
  component: () => {
    const d = Route.useLoaderData();
    const { slug } = Route.useParams();
    return <Listado d={d} busca={Route.useSearch()} base={`/c/${slug}`} />;
  },
});
