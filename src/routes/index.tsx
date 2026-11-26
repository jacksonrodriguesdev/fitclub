import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Truck, MessageCircle, CreditCard, RefreshCw } from "lucide-react";
import { homeModaFn } from "@/lib/catalogo-moda";
import { LOJA, linkWhatsapp } from "@/lib/loja";
import { LojaHeader, Vitrine, VERDE } from "@/components/moda/Loja";
import { seoInicio } from "@/lib/seo-uy";
import { BANNERS, CarruselBanners, BannerFaixa, Modalidades } from "@/components/moda/Banners";

// Inicio de FITCLUBUY: misma estructura de una tienda deportiva grande
// (carrusel, pilares por deporte, vitrina con pestañas, editorial, cajas y vitrinas)
export const Route = createFileRoute("/")({
  loader: () => homeModaFn(),
  head: () => seoInicio(),
  component: Home,
});

type Datos = Awaited<ReturnType<typeof homeModaFn>>;

function Pestanas({ pestanas }: { pestanas: Datos["pestanas"] }) {
  const [a, setA] = useState(0);
  return (
    <section className="mt-16">
      <div className="mx-auto max-w-7xl px-4">
        <h2 className="text-2xl font-bold tracking-tight mb-4">Lo más elegido</h2>
        <div className="flex items-center gap-6 border-b overflow-x-auto whitespace-nowrap [scrollbar-width:none]">
          {pestanas.map((p, k) => (
            <button key={p.titulo} onClick={() => setA(k)}
              className={`pb-3 -mb-px text-base font-bold border-b-2 ${k === a ? "border-black text-black" : "border-transparent text-neutral-400 hover:text-neutral-700"}`}>
              {p.titulo}
            </button>
          ))}
          <a href={pestanas[a].link} className="ml-auto pb-3 text-sm underline underline-offset-4">Ver todo</a>
        </div>
      </div>
      <div className="-mt-8">
        <Vitrine titulo="" produtos={pestanas[a].productos} />
      </div>
    </section>
  );
}

// Franja de confianza justo debajo del carrusel
function Confianza() {
  const itens = [
    { Icone: Truck, t: "Envíos a todo Uruguay", s: "Montevideo e interior" },
    { Icone: MessageCircle, t: "Atención por WhatsApp", s: "Te asesoramos con el talle" },
    { Icone: CreditCard, t: "Tarjeta o transferencia", s: "Pago seguro" },
    { Icone: RefreshCw, t: "Cambios fáciles", s: "Si no te queda, lo cambiamos" },
  ];
  return (
    <section className="border-b border-neutral-200">
      <div className="mx-auto max-w-7xl px-4 grid grid-cols-2 lg:grid-cols-4">
        {itens.map(({ Icone, t, s }) => (
          <div key={t} className="flex items-center gap-3 py-4 px-2">
            <Icone className="size-6 shrink-0" style={{ color: VERDE }} />
            <div className="leading-tight">
              <div className="text-sm font-bold">{t}</div>
              <div className="text-xs text-neutral-500">{s}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// Círculos con foto para ir directo a cada tipo de prenda
function Categorias({ cats }: { cats: Datos["categorias"] }) {
  return (
    <section className="mx-auto max-w-7xl px-4 mt-10">
      <h2 className="text-2xl font-bold tracking-tight mb-5">Comprá por categoría</h2>
      <div className="flex gap-4 sm:gap-6 overflow-x-auto pb-2 [scrollbar-width:none] lg:justify-between">
        {cats.map((c) => (
          <a key={c.slug} href={`/c/${c.slug}`} className="group shrink-0 w-20 sm:w-24 text-center">
            <div className="size-20 sm:size-24 rounded-full overflow-hidden bg-neutral-100 ring-2 ring-transparent group-hover:ring-[#8CC63F] transition">
              <img src={c.foto!} alt={c.titulo} loading="lazy" className="size-full object-cover object-top transition-transform duration-500 group-hover:scale-110" />
            </div>
            <div className="mt-2 text-xs sm:text-sm font-semibold">{c.titulo}</div>
          </a>
        ))}
      </div>
    </section>
  );
}

function Home() {
  const d = Route.useLoaderData();
  return (
    <div className="bg-white text-neutral-900 overflow-x-clip">
      <LojaHeader />
      <CarruselBanners banners={[BANNERS.friday, BANNERS.fridayFotos, BANNERS.pinkCheeks]} />
      <Confianza />
      <Categorias cats={d.categorias} />

      {/* Las dos líneas de la tienda */}
      <section className="mx-auto max-w-7xl px-4 mt-14">
        <div className="text-center mb-6">
          <div className="text-xs tracking-[0.35em] font-bold text-neutral-500">NUESTRAS LÍNEAS</div>
          <h2 className="mt-1 text-3xl font-extrabold tracking-tight">Dos marcas, un solo club</h2>
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          {d.lineas.map((l) => (
            <div key={l.slug} className="relative aspect-[4/5] sm:aspect-[4/3] overflow-hidden bg-neutral-900 group">
              <a href={`/c/${l.slug}`} aria-label={`Ver línea ${l.titulo}`} className="absolute inset-0 grid grid-cols-2">
                {l.fotos.map((f) => <img key={f} src={f} alt="" loading="lazy" className="size-full object-cover object-top transition-transform duration-500 group-hover:scale-105" />)}
              </a>
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/90 via-black/25 to-transparent" />
              <div className="pointer-events-none absolute inset-x-0 bottom-0 p-6 text-white">
                <div className="text-xs tracking-[0.35em] font-bold" style={{ color: VERDE }}>LÍNEA</div>
                <div className="text-5xl font-extrabold leading-none mt-1">{l.titulo}</div>
                <div className="mt-2 text-white/85 text-sm">{l.sub} · {l.total} modelos</div>
                <div className="pointer-events-auto mt-4 flex flex-wrap gap-2">
                  {d.atajos[l.slug as "live" | "lupo"].map((s) => (
                    <a key={s.slug} href={`/c/${s.slug}?linea=${l.slug}`} className="border border-white/60 bg-black/30 backdrop-blur px-3 py-1.5 text-xs font-semibold hover:bg-white hover:text-black">
                      {s.titulo}
                    </a>
                  ))}
                </div>
                <a href={`/c/${l.slug}`} className="pointer-events-auto mt-4 inline-block font-bold px-6 py-2.5 text-sm text-black hover:brightness-95" style={{ background: VERDE }}>VER LÍNEA {l.titulo}</a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Modalidades con 20% OFF */}
      <Modalidades />

      <Pestanas pestanas={d.pestanas} />

      <BannerFaixa b={BANNERS.fridayFotos} />

      {/* Ofertas: mayores descuentos */}
      {d.ofertas.length > 0 && (
        <section className="mt-16 py-2 pb-12" style={{ background: "#F3F9EC" }}>
          <div className="mx-auto max-w-7xl px-4 pt-10 flex flex-wrap items-end justify-between gap-2">
            <div>
              <div className="text-xs tracking-[0.35em] font-bold text-neutral-500">OUTLET</div>
              <h2 className="text-3xl font-extrabold tracking-tight">
                Hasta {Math.round((1 - d.ofertas[0].preco / d.ofertas[0].precoOriginal) * 100)} % off
              </h2>
            </div>
            <a href="/c/outlet?orden=descuento" className="font-bold px-6 py-2.5 text-sm text-black" style={{ background: VERDE }}>VER TODAS LAS OFERTAS</a>
          </div>
          <div className="-mt-8"><Vitrine titulo="" produtos={d.ofertas} /></div>
        </section>
      )}

      {/* Editorial */}
      <section className="mt-16 bg-black text-white">
        <div className="mx-auto max-w-7xl grid lg:grid-cols-2">
          <div className="grid grid-cols-2 h-[380px] lg:h-[520px]">
            {d.editorial.map((f) => <img key={f} src={f} alt="" loading="lazy" className="size-full object-cover object-top" />)}
          </div>
          <div className="p-8 sm:p-14 flex flex-col justify-center">
            <div className="text-xs tracking-[0.35em] font-bold" style={{ color: VERDE }}>{LOJA.nome}</div>
            <h2 className="mt-3 text-4xl sm:text-5xl font-extrabold leading-tight">Hecho para moverte</h2>
            <p className="mt-4 text-white/75 max-w-md">
              Calzas de alta compresión, tops con soporte y telas que respiran. Ropa pensada para entrenar fuerte y
              para el día a día, con envío a todo Uruguay.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <a href="/c/mujer" className="font-bold px-7 py-3 text-sm text-black" style={{ background: VERDE }}>COMPRAR AHORA</a>
              <a href="/c/novedades" className="border border-white font-bold px-7 py-3 text-sm hover:bg-white hover:text-black">VER NOVEDADES</a>
            </div>
          </div>
        </div>
      </section>

      <Vitrine titulo="Línea LUPO" link="/c/lupo" produtos={d.vitrineLupo} />
      <Vitrine titulo="Calzas y pantalones" link="/c/calzas" produtos={d.calzas} />

      {/* Cajas */}
      <section className="mx-auto max-w-7xl px-4 mt-16 grid gap-3 sm:grid-cols-3">
        {d.cajas.map((c) => (
          <a key={c.titulo} href={c.link} className="relative aspect-[4/5] overflow-hidden bg-neutral-100 group">
            {c.foto && <img src={c.foto} alt={c.titulo} loading="lazy" className="absolute inset-0 size-full object-cover object-top transition-transform duration-500 group-hover:scale-105" />}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
            <div className="absolute bottom-0 p-5 text-white">
              <div className="text-2xl font-extrabold">{c.titulo}</div>
              <div className="text-sm text-white/80">{c.sub}</div>
              <span className="mt-3 inline-block text-xs font-bold underline underline-offset-4">VER MÁS</span>
            </div>
          </a>
        ))}
      </section>

      <BannerFaixa b={BANNERS.pinkCheeks} />

      {/* Pink Cheeks y kits */}
      {d.kits.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 mt-16">
          <div className="grid lg:grid-cols-[1fr_2fr] gap-6 items-center rounded-sm p-6 sm:p-10" style={{ background: "#FCEEF1" }}>
            <div>
              <div className="text-xs tracking-[0.35em] font-bold text-pink-700">PINK CHEEKS</div>
              <h2 className="mt-2 text-3xl sm:text-4xl font-extrabold leading-tight">Kits de belleza y protección solar</h2>
              <p className="mt-3 text-neutral-700 text-sm max-w-sm">Combos listos para regalar o para tu bolso de entrenamiento, con precio especial.</p>
              <div className="mt-5 flex flex-wrap gap-3">
                <a href="/c/kits" className="bg-black text-white font-bold px-6 py-2.5 text-sm hover:bg-neutral-800">VER KITS</a>
                <a href="/c/pink-cheeks" className="border border-black font-bold px-6 py-2.5 text-sm hover:bg-black hover:text-white">TODO PINK CHEEKS</a>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {d.kits.slice(0, 3).map((k) => (
                <a key={k.id} href={`/p/${k.slug}`} className="group block bg-white">
                  <div className="aspect-square overflow-hidden"><img src={k.foto} alt={k.nome} loading="lazy" className="size-full object-cover transition-transform duration-500 group-hover:scale-105" /></div>
                  <div className="p-2 text-xs line-clamp-2 leading-snug">{k.nome}</div>
                </a>
              ))}
            </div>
          </div>
        </section>
      )}

      <Vitrine titulo="Línea LIVE!" link="/c/live" produtos={d.vitrineLive} />
      <Vitrine titulo="Tops" link="/c/tops" produtos={d.tops} />
      <Vitrine titulo="Running" link="/c/running" produtos={d.running} />
      <Vitrine titulo="Playa" link="/c/playa" produtos={d.playa} />

      {/* Cómo comprar */}
      <section className="mt-20 bg-neutral-950 text-white">
        <div className="mx-auto max-w-7xl px-4 py-14">
          <div className="text-center">
            <div className="text-xs tracking-[0.35em] font-bold" style={{ color: VERDE }}>CÓMO COMPRAR</div>
            <h2 className="mt-2 text-3xl font-extrabold">Comprar es fácil</h2>
          </div>
          <div className="mt-10 grid gap-8 sm:grid-cols-3 text-center">
            {[
              ["1", "Elegí tus productos", "Sumá al carrito los modelos, colores y talles que te gusten."],
              ["2", "Confirmá por WhatsApp", "Te enviamos el total con envío y coordinamos el pago."],
              ["3", "Recibilo en tu casa", "Despachamos a Montevideo y a todo el interior."],
            ].map(([n, t, s]) => (
              <div key={n}>
                <div className="mx-auto size-12 grid place-items-center rounded-full text-black text-xl font-extrabold" style={{ background: VERDE }}>{n}</div>
                <div className="mt-4 font-bold text-lg">{t}</div>
                <p className="mt-1 text-sm text-white/70 max-w-xs mx-auto">{s}</p>
              </div>
            ))}
          </div>
          <div className="mt-10 text-center">
            <a href={linkWhatsapp("Hola FITCLUBUY! Quiero hacer una consulta.")} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 font-bold px-7 py-3 text-sm text-black" style={{ background: VERDE }}>
              <MessageCircle className="size-4" /> ESCRIBINOS: {LOJA.whatsappVisible}
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
