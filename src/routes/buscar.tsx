import { createFileRoute } from "@tanstack/react-router";
import { listarFn } from "@/lib/catalogo-moda";
import { LOJA } from "@/lib/loja";
import { Listado, validarBusca } from "@/components/moda/Listado";

// Búsqueda: /buscar?q=calza
export const Route = createFileRoute("/buscar")({
  validateSearch: validarBusca,
  loaderDeps: ({ search }) => search,
  loader: ({ deps }) => listarFn({ data: deps }),
  head: () => ({ meta: [{ title: `Buscar — ${LOJA.nome}` }] }),
  component: () => <Listado d={Route.useLoaderData()} busca={Route.useSearch()} base="/buscar" />,
});
