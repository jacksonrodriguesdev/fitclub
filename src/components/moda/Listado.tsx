// Página de listado (categoría o búsqueda): filtro de talle, orden y "ver más".
import { LojaHeader, CardModa } from "./Loja";
import type { CardProduto } from "@/lib/catalogo-moda";

type Subcat = { slug: string; titulo: string; total: number };
type Dados = {
  titulo: string; total: number; talles: string[]; itens: CardProduto[]; hayMas: boolean;
  linea: "live" | "lupo" | null; cat: string | null; subcats: Subcat[];
};
type Busca = { q?: string; talle?: string; orden?: string; pagina?: number; genero?: string; linea?: string };

const LINEAS = [
  { slug: null, rotulo: "Todas las marcas" },
  { slug: "live", rotulo: "LIVE!" },
  { slug: "lupo", rotulo: "LUPO" },
] as const;

// Navegación por línea (LIVE! / LUPO), categorías de la línea y género
function NavLineas({ d, busca }: { d: Dados; busca: Busca }) {
  const qs = (o: Record<string, string | undefined>) => {
    const p = new URLSearchParams();
    for (const [k, v] of Object.entries(o)) if (v) p.set(k, v);
    const s = p.toString();
    return s ? "?" + s : "";
  };
  const genero = busca.genero;
  // misma categoría en otra línea
  const hrefLinea = (l: string | null) =>
    d.cat ? `/c/${d.cat}${qs({ linea: l ?? undefined, genero })}` : `/c/${l ?? "todos"}${qs({ genero })}`;
  // otra categoría dentro de la línea actual
  const hrefCat = (sc: string | null) =>
    sc ? `/c/${sc}${qs({ linea: d.linea ?? undefined, genero })}` : `/c/${d.linea ?? "todos"}${qs({ genero })}`;
  const hrefGenero = (g?: string) =>
    (d.cat ? `/c/${d.cat}` : `/c/${d.linea ?? "todos"}`) + qs({ linea: d.cat ? d.linea ?? undefined : undefined, genero: g });
  const chip = (activo: boolean) =>
    `shrink-0 px-3.5 py-1.5 rounded-full border text-sm whitespace-nowrap ${activo ? "bg-black text-white border-black" : "border-neutral-300 hover:border-black"}`;
  return (
    <div className="mt-5 space-y-3">
      <div className="flex gap-0 border-b">
        {LINEAS.map((l) => (
          <a key={l.rotulo} href={hrefLinea(l.slug)}
            className={`px-4 sm:px-6 pb-2.5 -mb-px text-sm sm:text-base font-extrabold tracking-wide border-b-[3px] ${d.linea === l.slug ? "border-[#8CC63F] text-black" : "border-transparent text-neutral-400 hover:text-neutral-800"}`}>
            {l.rotulo}
          </a>
        ))}
      </div>
      <div className="flex gap-2 overflow-x-auto pb-1 -mx-4 px-4 sm:mx-0 sm:px-0 sm:flex-wrap">
        <a href={hrefCat(null)} className={chip(!d.cat)}>Todo</a>
        {d.subcats.map((sc) => (
          <a key={sc.slug} href={hrefCat(sc.slug)} className={chip(d.cat === sc.slug)}>
            {sc.titulo} <span className="opacity-60 text-xs">{sc.total}</span>
          </a>
        ))}
      </div>
      <div className="flex gap-2 text-sm">
        {[[undefined, "Todos"], ["mujer", "Mujer"], ["hombre", "Hombre"]].map(([g, r]) => (
          <a key={r} href={hrefGenero(g)} className={`px-3 py-1 rounded ${genero === g ? "bg-neutral-900 text-white" : "bg-neutral-100 hover:bg-neutral-200"}`}>{r}</a>
        ))}
      </div>
    </div>
  );
}

export function Listado({ d, busca, base }: { d: Dados; busca: Busca; base: string }) {
  const url = (cambios: Partial<Busca>) => {
    const s = { ...busca, ...cambios };
    const p = new URLSearchParams();
    for (const [k, v] of Object.entries(s)) if (v !== undefined && v !== "" && !(k === "pagina" && v === 1)) p.set(k, String(v));
    const qs = p.toString();
    return qs ? `${base}?${qs}` : base;
  };
  return (
    <div className="bg-white text-neutral-900 min-h-screen">
      <LojaHeader />
      <div className="mx-auto max-w-7xl px-4 pt-8">
        <nav className="text-xs text-neutral-500 mb-2"><a href="/" className="hover:underline">Inicio</a> / {d.titulo}</nav>
        <h1 className="text-3xl font-extrabold tracking-tight">{d.titulo}</h1>
        <div className="text-sm text-neutral-500 mt-1">{d.total} productos</div>
        {!busca.q && <NavLineas d={d} busca={busca} />}

        <div className="mt-6 flex flex-wrap items-center gap-2 border-y py-3">
          <span className="text-sm font-medium mr-1">Talle:</span>
          <a href={url({ talle: undefined, pagina: 1 })} className={`px-3 py-1 rounded-full border text-sm ${!busca.talle ? "bg-black text-white border-black" : "border-neutral-300"}`}>Todos</a>
          {d.talles.slice(0, 16).map((t) => (
            <a key={t} href={url({ talle: t, pagina: 1 })}
              className={`px-3 py-1 rounded-full border text-sm ${busca.talle === t ? "bg-black text-white border-black" : "border-neutral-300 hover:border-black"}`}>
              {t}
            </a>
          ))}
          <form method="get" action={base} className="ml-auto">
            {busca.q && <input type="hidden" name="q" value={busca.q} />}
            {busca.talle && <input type="hidden" name="talle" value={busca.talle} />}
            {busca.genero && <input type="hidden" name="genero" value={busca.genero} />}
            {busca.linea && <input type="hidden" name="linea" value={busca.linea} />}
            <select name="orden" defaultValue={busca.orden ?? ""} onChange={(e) => e.currentTarget.form?.submit()}
              className="border border-neutral-300 rounded px-2 py-1.5 text-sm bg-white">
              <option value="">Destacados</option>
              <option value="menor">Menor precio</option>
              <option value="mayor">Mayor precio</option>
              <option value="descuento">Mayor descuento</option>
            </select>
          </form>
        </div>

        {d.itens.length === 0 ? (
          <div className="py-24 text-center text-neutral-500">No encontramos productos. Probá con otro talle o búsqueda.</div>
        ) : (
          <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-8">
            {d.itens.map((p) => <CardModa key={p.id} p={p} />)}
          </div>
        )}
        {d.hayMas && (
          <div className="text-center mt-10">
            <a href={url({ pagina: (busca.pagina ?? 1) + 1 })} className="inline-block border border-black px-8 py-3 font-semibold hover:bg-black hover:text-white">
              Ver más productos
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

// Lee los parámetros de la URL (?talle=M&orden=menor&pagina=2&q=calza)
export function validarBusca(s: Record<string, unknown>): Busca {
  const txt = (v: unknown) => (typeof v === "string" && v.trim() ? v.trim().slice(0, 80) : undefined);
  const n = Number(s.pagina);
  return { q: txt(s.q), talle: txt(s.talle), orden: txt(s.orden), genero: txt(s.genero), linea: txt(s.linea), pagina: n > 1 ? Math.min(n, 100) : undefined };
}
