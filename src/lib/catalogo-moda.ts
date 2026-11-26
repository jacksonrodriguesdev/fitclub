import { createServerFn } from "@tanstack/react-start";

export type { CardProduto } from "./catalogo-moda.server";

export const homeModaFn = createServerFn({ method: "GET" }).handler(async () => {
  const { homeModa } = await import("./catalogo-moda.server");
  return homeModa();
});

type FiltroLista = { cat?: string; q?: string; talle?: string; orden?: string; pagina?: number; genero?: string; linea?: string };
export const listarFn = createServerFn({ method: "GET" })
  .validator((d: FiltroLista) => d)
  .handler(async ({ data }) => {
    const { listar } = await import("./catalogo-moda.server");
    return listar(data);
  });

export const produtoFn = createServerFn({ method: "GET" })
  .validator((id: number) => id)
  .handler(async ({ data }) => {
    const { produto } = await import("./catalogo-moda.server");
    return produto(data);
  });

export const sugerirFn = createServerFn({ method: "GET" })
  .validator((q: string) => String(q ?? "").slice(0, 80))
  .handler(async ({ data }) => {
    const { sugerir } = await import("./catalogo-moda.server");
    return sugerir(data);
  });
