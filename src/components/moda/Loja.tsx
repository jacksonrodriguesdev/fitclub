// Componentes de la tienda FITCLUBUY: encabezado, pie, tarjeta de producto y vitrina horizontal.
import { Link } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { Search, ShoppingBag, User, Menu, X, ChevronLeft, ChevronRight } from "lucide-react";
import { LOJA, MENU, SUBMENU, uyu } from "@/lib/loja";
import type { CardProduto } from "@/lib/catalogo-moda";
import { useCarrito } from "./Carrito";
import { Buscador } from "./Buscador";

// Verde de la marca (logo)
export const VERDE = "#8CC63F";

export function Logo({ className = "h-8" }: { className?: string }) {
  return <img src={LOJA.logo} alt={LOJA.nome} className={`${className} w-auto object-contain`} />;
}

export function BarraAviso() {
  return (
    <div className="text-black text-center text-xs font-semibold tracking-wide py-2 px-4" style={{ background: VERDE }}>
      Envíos a todo Uruguay · Pagá con tarjeta o transferencia · Cambios fáciles
    </div>
  );
}

export function LojaHeader() {
  const [aberto, setAberto] = useState(false);
  const [buscando, setBuscando] = useState(false);
  const { itens, abrir } = useCarrito();
  const qtd = itens.reduce((s, i) => s + i.qtd, 0);
  return (
    <header className="sticky top-0 z-40 bg-black text-white">
      <BarraAviso />
      <div className="mx-auto max-w-7xl px-4 h-16 flex items-center gap-4">
        <button className="lg:hidden p-2 -ml-2" onClick={() => setAberto(true)} aria-label="Abrir menú">
          <Menu className="size-5" />
        </button>
        <Link to="/" className="shrink-0" aria-label={LOJA.nome}>
          <Logo className="h-7 sm:h-8" />
        </Link>
        <nav className="hidden lg:flex items-center gap-5 xl:gap-6 ml-6 text-sm font-medium whitespace-nowrap">
          {MENU.map((m) =>
            SUBMENU[m.slug] ? (
              <div key={m.slug} className="relative group h-16 flex items-center">
                <a href={`/c/${m.slug}`} className="font-bold group-hover:underline underline-offset-4">{m.rotulo}</a>
                <div className="hidden group-hover:block absolute left-0 top-full -mt-1 w-64 bg-white text-neutral-900 shadow-xl border-t-[3px] p-3" style={{ borderColor: VERDE }}>
                  <a href={`/c/${m.slug}`} className="block px-3 py-2 font-bold hover:bg-neutral-100">Ver todo {m.rotulo.replace("Línea ", "")}</a>
                  <div className="grid grid-cols-1">
                    {SUBMENU[m.slug].map((s) => (
                      <a key={s.slug} href={`/c/${s.slug}?linea=${m.slug}`} className="px-3 py-1.5 text-sm hover:bg-neutral-100">{s.rotulo}</a>
                    ))}
                  </div>
                  <div className="flex gap-2 px-3 pt-2 mt-1 border-t text-xs font-bold">
                    <a href={`/c/${m.slug}?genero=mujer`} className="hover:underline">MUJER</a>·
                    <a href={`/c/${m.slug}?genero=hombre`} className="hover:underline">HOMBRE</a>
                  </div>
                </div>
              </div>
            ) : (
              <a
                key={m.slug}
                href={`/c/${m.slug}`}
                className="hover:underline underline-offset-4"
                style={m.slug === "outlet" ? { color: VERDE } : undefined}
              >
                {m.rotulo}
              </a>
            ),
          )}
        </nav>
        <div className="ml-auto flex items-center gap-1">
          <Buscador className="hidden xl:block w-72" />
          <button className="p-2 xl:hidden" aria-label="Buscar" onClick={() => setBuscando((v) => !v)}><Search className="size-5" /></button>
          <a href="/cuenta" className="p-2" aria-label="Mi cuenta"><User className="size-5" /></a>
          <button className="p-2 relative" aria-label="Carrito" onClick={() => abrir(true)}>
            <ShoppingBag className="size-5" />
            {qtd > 0 && (
              <span className="absolute -top-0.5 -right-0.5 min-w-4 h-4 px-1 rounded-full text-[10px] font-bold text-black grid place-items-center" style={{ background: VERDE }}>
                {qtd}
              </span>
            )}
          </button>
        </div>
      </div>
      {buscando && (
        <div className="xl:hidden px-4 pb-3">
          <Buscador autoFocus />
        </div>
      )}
      {aberto && (
        <div className="fixed inset-0 z-50 bg-black/60 lg:hidden" onClick={() => setAberto(false)}>
          <div className="bg-black text-white w-80 h-full p-6 overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-8">
              <Logo className="h-7" />
              <button onClick={() => setAberto(false)} aria-label="Cerrar menú"><X className="size-5" /></button>
            </div>
            <nav className="flex flex-col gap-4 text-lg font-medium">
              {MENU.map((m) => (
                <div key={m.slug}>
                  <a href={`/c/${m.slug}`} className={SUBMENU[m.slug] ? "font-extrabold" : ""}>{m.rotulo}</a>
                  {SUBMENU[m.slug] && (
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {SUBMENU[m.slug].map((s) => (
                        <a key={s.slug} href={`/c/${s.slug}?linea=${m.slug}`} className="text-xs border border-white/30 rounded-full px-2.5 py-1">{s.rotulo}</a>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}

export function LojaFooter() {
  return (
    <footer className="bg-black text-neutral-300 mt-16">
      <div className="mx-auto max-w-7xl px-4 py-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4 text-sm">
        <div>
          <Logo className="h-9" />
          <p className="mt-4 text-neutral-400">{LOJA.slogan}</p>
        </div>
        <div>
          <div className="text-white font-semibold mb-3">Comprar</div>
          <ul className="space-y-2">{MENU.map((m) => <li key={m.slug}><a href={`/c/${m.slug}`} className="hover:text-white">{m.rotulo}</a></li>)}</ul>
        </div>
        <div>
          <div className="text-white font-semibold mb-3">Ayuda</div>
          <ul className="space-y-2">
            <li>Cambios y devoluciones</li><li>Envíos</li><li>Guía de talles</li><li>Contacto</li>
          </ul>
        </div>
        <div>
          <div className="text-white font-semibold mb-3">Recibí novedades</div>
          <div className="flex">
            <input placeholder="Tu e-mail" className="bg-neutral-900 border border-neutral-700 rounded-l px-3 py-2 w-full outline-none" />
            <button className="text-black font-semibold px-4 rounded-r" style={{ background: VERDE }}>OK</button>
          </div>
        </div>
      </div>
      <div className="border-t border-neutral-800 py-4 text-center text-xs text-neutral-500">
        © {new Date().getFullYear()} {LOJA.nome}. Todos los derechos reservados.
      </div>
    </footer>
  );
}

export function CardModa({ p }: { p: CardProduto }) {
  const desconto = p.precoOriginal > p.preco ? Math.round((1 - p.preco / p.precoOriginal) * 100) : 0;
  return (
    <a href={`/p/${p.slug}`} className="group block">
      <div className="relative aspect-[3/4] overflow-hidden bg-neutral-100 rounded-sm">
        <img src={p.foto} alt={p.nome} loading="lazy" className="absolute inset-0 size-full object-cover transition-opacity duration-300 group-hover:opacity-0" />
        {p.foto2 && <img src={p.foto2} alt="" loading="lazy" className="absolute inset-0 size-full object-cover opacity-0 transition-opacity duration-300 group-hover:opacity-100" />}
        {desconto > 0 && (
          <span className="absolute top-2 left-2 text-black text-[11px] font-bold px-2 py-0.5 rounded-sm" style={{ background: VERDE }}>
            -{desconto}%
          </span>
        )}
      </div>
      <div className="mt-3 space-y-1">
        <div className="flex gap-1">
          {p.cores.filter((c) => c.amostra).slice(0, 6).map((c, k) => (
            <img key={k} src={c.amostra} alt={c.nome} title={c.nome} className="size-4 rounded-full border border-neutral-300 object-cover" />
          ))}
          {p.cores.length > 6 && <span className="text-[11px] text-neutral-500">+{p.cores.length - 6}</span>}
        </div>
        <div className="text-[10px] font-bold tracking-[0.2em] text-neutral-500">{p.marca}</div>
        <div className="text-sm text-neutral-900 line-clamp-2 leading-snug">{p.nome}</div>
        <div className="flex items-baseline gap-2">
          <span className="font-semibold text-neutral-900">{uyu(p.preco)}</span>
          {desconto > 0 && <span className="text-xs text-neutral-500 line-through">{uyu(p.precoOriginal)}</span>}
        </div>
      </div>
    </a>
  );
}

export function Vitrine({ titulo, link, produtos }: { titulo: string; link?: string; produtos: CardProduto[] }) {
  const trilho = useRef<HTMLDivElement>(null);
  const rolar = (d: number) => trilho.current?.scrollBy({ left: d * trilho.current.clientWidth * 0.8, behavior: "smooth" });
  if (!produtos.length) return null;
  return (
    <section className="mx-auto max-w-7xl px-4 mt-14">
      <div className="flex items-end justify-between mb-5">
        <h2 className="text-2xl font-bold tracking-tight">{titulo}</h2>
        <div className="flex items-center gap-2">
          {link && <a href={link} className="text-sm underline underline-offset-4 mr-2">Ver todo</a>}
          <button onClick={() => rolar(-1)} className="hidden sm:grid place-items-center size-9 rounded-full border border-neutral-300 hover:bg-neutral-100" aria-label="Anterior"><ChevronLeft className="size-4" /></button>
          <button onClick={() => rolar(1)} className="hidden sm:grid place-items-center size-9 rounded-full border border-neutral-300 hover:bg-neutral-100" aria-label="Siguiente"><ChevronRight className="size-4" /></button>
        </div>
      </div>
      <div ref={trilho} className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-2 [scrollbar-width:none]">
        {produtos.map((p) => (
          <div key={p.id} className="snap-start shrink-0 w-[46%] sm:w-[31%] lg:w-[23%]">
            <CardModa p={p} />
          </div>
        ))}
      </div>
    </section>
  );
}
