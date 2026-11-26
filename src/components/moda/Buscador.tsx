// Buscador con sugerencias mientras se escribe (foto, nombre y precio). Enter → página de resultados.
import { useEffect, useRef, useState } from "react";
import { Search, X } from "lucide-react";
import { sugerirFn, type CardProduto } from "@/lib/catalogo-moda";
import { uyu } from "@/lib/loja";

const SUGERIDAS = ["Calzas", "Tops", "Bikinis", "Remeras", "Shorts", "Camperas"];

export function Buscador({ className = "", autoFocus = false }: { className?: string; autoFocus?: boolean }) {
  const [q, setQ] = useState("");
  const [foco, setFoco] = useState(false);
  const [res, setRes] = useState<{ productos: CardProduto[]; total: number } | null>(null);
  const caja = useRef<HTMLFormElement>(null);

  useEffect(() => {
    const t = q.trim();
    if (t.length < 2) return setRes(null);
    let vivo = true;
    const id = setTimeout(() => {
      sugerirFn({ data: t }).then((r) => vivo && setRes(r)).catch(() => {});
    }, 250);
    return () => {
      vivo = false;
      clearTimeout(id);
    };
  }, [q]);

  useEffect(() => {
    const fuera = (e: MouseEvent) => caja.current && !caja.current.contains(e.target as Node) && setFoco(false);
    document.addEventListener("mousedown", fuera);
    return () => document.removeEventListener("mousedown", fuera);
  }, []);

  const abierto = foco && (q.trim().length < 2 || res);
  return (
    <form ref={caja} action="/buscar" className={`relative ${className}`} role="search">
      <div className="flex items-center bg-white/10 rounded-full px-3 h-10">
        <Search className="size-4 text-white/60 shrink-0" />
        <input name="q" value={q} autoFocus={autoFocus} autoComplete="off" onChange={(e) => setQ(e.target.value)} onFocus={() => setFoco(true)}
          placeholder="¿Qué estás buscando?" className="bg-transparent outline-none text-sm ml-2 w-full text-white placeholder:text-white/50" />
        {q && <button type="button" onClick={() => setQ("")} aria-label="Borrar"><X className="size-4 text-white/60" /></button>}
      </div>
      {abierto && (
        <div className="absolute left-0 right-0 top-12 z-50 bg-white text-neutral-900 rounded-md shadow-xl border overflow-hidden min-w-[300px]">
          {q.trim().length < 2 ? (
            <div className="p-4">
              <div className="text-xs font-semibold text-neutral-500 mb-2">Búsquedas populares</div>
              <div className="flex flex-wrap gap-2">
                {SUGERIDAS.map((s) => (
                  <a key={s} href={`/buscar?q=${encodeURIComponent(s)}`} className="px-3 py-1 rounded-full bg-neutral-100 text-sm hover:bg-neutral-200">{s}</a>
                ))}
              </div>
            </div>
          ) : res && res.productos.length === 0 ? (
            <div className="p-4 text-sm text-neutral-500">Sin resultados para “{q}”.</div>
          ) : (
            res && (
              <>
                <ul className="divide-y max-h-[60vh] overflow-y-auto">
                  {res.productos.map((p) => (
                    <li key={p.id}>
                      <a href={`/p/${p.slug}`} className="flex items-center gap-3 p-2.5 hover:bg-neutral-50">
                        <img src={p.foto} alt="" className="w-12 aspect-[3/4] object-cover bg-neutral-100" />
                        <span className="flex-1 text-sm line-clamp-2">{p.nome}</span>
                        <span className="text-sm font-semibold whitespace-nowrap">{uyu(p.preco)}</span>
                      </a>
                    </li>
                  ))}
                </ul>
                <button type="submit" className="block w-full text-center text-sm font-semibold py-3 bg-neutral-50 hover:bg-neutral-100">
                  Ver los {res.total} resultados
                </button>
              </>
            )
          )}
        </div>
      )}
    </form>
  );
}
