import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { VERDE } from "./Loja";

// Banners promocionales (public/banners/<nombre>-d.webp = computadora, -m.webp = celular).
// Se generan con Desktop/live/deploy/ferramentas/banners_fitclub.cjs
type Banner = { nome: string; alt: string; link: string };

export const BANNERS = {
  friday: { nome: "friday", alt: "FITCLUB FRIDAY: 20% OFF en artículos seleccionados", link: "/c/outlet?orden=descuento" },
  fridayFotos: { nome: "friday-fotos", alt: "FITCLUB FRIDAY: 20% OFF en artículos seleccionados", link: "/c/outlet?orden=descuento" },
  pinkCheeks: { nome: "pink-cheeks", alt: "Pink Cheeks: 20% OFF en cuidado para tu piel", link: "/c/pink-cheeks" },
  faixa: { nome: "faixa-friday", alt: "FITCLUB FRIDAY 20% OFF", link: "/c/outlet?orden=descuento" },
} satisfies Record<string, Banner>;

const MODALIDADES: Banner[] = [
  { nome: "running", alt: "Running: 20% OFF", link: "/c/running" },
  { nome: "entrenamiento", alt: "Entrenamiento: 20% OFF", link: "/c/entrenamiento" },
  { nome: "yoga", alt: "Yoga y pilates: 20% OFF", link: "/c/yoga" },
  { nome: "playa", alt: "Playa: 20% OFF", link: "/c/playa" },
];

function Imagem({ b, prioridade, className }: { b: Banner; prioridade?: boolean; className?: string }) {
  return (
    <picture>
      <source media="(max-width: 767px)" srcSet={`/banners/${b.nome}-m.webp`} />
      <img src={`/banners/${b.nome}-d.webp`} alt={b.alt} className={className}
        loading={prioridade ? "eager" : "lazy"} fetchPriority={prioridade ? "high" : undefined} />
    </picture>
  );
}

// Carrusel principal (desktop 1920x700, celular 860x1400)
export function CarruselBanners({ banners }: { banners: Banner[] }) {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((v) => (v + 1) % banners.length), 6000);
    return () => clearInterval(t);
  }, [banners.length, i]);
  return (
    <section className="relative bg-black overflow-hidden" aria-roledescription="carrusel">
      <div className="flex transition-transform duration-700" style={{ transform: `translateX(-${i * 100}%)` }}>
        {banners.map((b, k) => (
          <a key={b.nome} href={b.link} className="block w-full shrink-0" aria-hidden={k !== i} tabIndex={k === i ? 0 : -1}>
            <Imagem b={b} prioridade={k === 0} className="block w-full aspect-[860/1400] md:aspect-[1920/700] object-cover" />
          </a>
        ))}
      </div>
      <button onClick={() => setI((i - 1 + banners.length) % banners.length)} aria-label="Anterior"
        className="absolute left-3 top-1/2 -translate-y-1/2 size-10 grid place-items-center rounded-full bg-black/40 text-white hover:bg-black/60">
        <ChevronLeft className="size-5" />
      </button>
      <button onClick={() => setI((i + 1) % banners.length)} aria-label="Siguiente"
        className="absolute right-3 top-1/2 -translate-y-1/2 size-10 grid place-items-center rounded-full bg-black/40 text-white hover:bg-black/60">
        <ChevronRight className="size-5" />
      </button>
      <div className="absolute bottom-4 inset-x-0 flex justify-center gap-1.5">
        {banners.map((_, k) => (
          <button key={k} onClick={() => setI(k)} aria-label={`Banner ${k + 1}`} className="h-1.5 rounded-full transition-all"
            style={{ width: k === i ? 28 : 12, background: k === i ? VERDE : "rgba(255,255,255,.6)" }} />
        ))}
      </div>
    </section>
  );
}

// Banner ancho único con link (entre secciones)
export function BannerFaixa({ b, className = "mt-16" }: { b: Banner; className?: string }) {
  return (
    <section className={`mx-auto max-w-7xl px-4 ${className}`}>
      <a href={b.link} className="block overflow-hidden group">
        <Imagem b={b} className="block w-full h-auto transition-transform duration-500 group-hover:scale-[1.02]" />
      </a>
    </section>
  );
}

// Franja fina para categorías y productos
export function FaixaPromo() {
  return <BannerFaixa b={BANNERS.faixa} className="pt-4" />;
}

// Cuatro modalidades con 20% OFF
export function Modalidades() {
  return (
    <section className="mx-auto max-w-7xl px-4 mt-12">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {MODALIDADES.map((b) => (
          <a key={b.nome} href={b.link} className="block overflow-hidden group bg-neutral-100">
            <Imagem b={b} className="block w-full aspect-[2/3] object-cover transition-transform duration-500 group-hover:scale-105" />
          </a>
        ))}
      </div>
    </section>
  );
}
