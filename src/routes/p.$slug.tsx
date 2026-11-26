import { createFileRoute, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { produtoFn } from "@/lib/catalogo-moda";
import { LOJA, uyu, linkWhatsapp } from "@/lib/loja";
import { LojaHeader, Vitrine, VERDE } from "@/components/moda/Loja";
import { useCarrito, mensajePedido, cuponGuardado } from "@/components/moda/Carrito";

// Producto: /p/calza-active-1260 (el número final es el id)
export const Route = createFileRoute("/p/$slug")({
  loader: async ({ params }) => {
    const id = Number(params.slug.split("-").pop());
    const p = id ? await produtoFn({ data: id }) : null;
    if (!p) throw notFound();
    return p;
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData?.nome ?? "Producto"} — ${LOJA.nome}` },
      ...(loaderData ? [{ property: "og:image", content: loaderData.cores[0].fotos[0] }] : []),
    ],
  }),
  component: Produto,
  notFoundComponent: () => (
    <div className="min-h-screen bg-white">
      <LojaHeader />
      <div className="py-32 text-center">
        <h1 className="text-2xl font-bold">Producto no disponible</h1>
        <a href="/" className="underline mt-4 inline-block">Volver al inicio</a>
      </div>
    </div>
  ),
});

function Produto() {
  const p = Route.useLoaderData();
  const { slug } = Route.useParams();
  const { agregar } = useCarrito();
  const [ci, setCi] = useState(0);
  const cor = p.cores[ci];
  const [talle, setTalle] = useState<string | null>(null);
  const [foto, setFoto] = useState(0);
  const [aviso, setAviso] = useState(false);
  const sel = cor.talles.find((t) => t.talle === talle && t.stock);
  const ref = sel ?? cor.talles.find((t) => t.stock)!;
  const desconto = ref.precioOriginal > ref.precio ? Math.round((1 - ref.precio / ref.precioOriginal) * 100) : 0;

  const trocarCor = (i: number) => {
    setCi(i);
    setFoto(0);
    if (talle && !p.cores[i].talles.some((t) => t.talle === talle && t.stock)) setTalle(null);
  };
  const porWhatsapp = () => {
    if (!sel) return setAviso(true);
    const item = { sku: sel.sku, id: p.id, slug, nome: p.nome, cor: cor.nome, talle: sel.talle, foto: cor.fotos[0], precio: sel.precio, qtd: 1 };
    window.open(linkWhatsapp(mensajePedido([item], cuponGuardado())), "_blank");
  };
  const comprar = () => {
    if (!sel) return setAviso(true);
    agregar({ sku: sel.sku, id: p.id, slug, nome: p.nome, cor: cor.nome, talle: sel.talle, foto: cor.fotos[0], precio: sel.precio });
  };

  return (
    <div className="bg-white text-neutral-900 min-h-screen">
      <LojaHeader />
      <div className="mx-auto max-w-7xl px-4 pt-6 grid gap-8 lg:grid-cols-[1fr_420px]">
        {/* Galería */}
        <div className="grid gap-3 sm:grid-cols-[80px_1fr]">
          <div className="order-2 sm:order-1 flex sm:flex-col gap-2 overflow-x-auto sm:overflow-y-auto sm:max-h-[720px] [scrollbar-width:none]">
            {cor.fotos.map((f, i) => (
              <button key={f} onClick={() => setFoto(i)} className={`shrink-0 w-16 sm:w-20 aspect-[3/4] overflow-hidden ring-2 ${i === foto ? "ring-black" : "ring-transparent"}`}>
                <img src={f} alt="" className="size-full object-cover" />
              </button>
            ))}
          </div>
          <div className="order-1 sm:order-2 aspect-[3/4] bg-neutral-100 overflow-hidden">
            <img src={cor.fotos[foto]} alt={p.nome} className="size-full object-cover" />
          </div>
        </div>

        {/* Compra */}
        <div className="lg:sticky lg:top-28 self-start">
          <nav className="text-xs text-neutral-500"><a href="/" className="hover:underline">Inicio</a> / {p.nome}</nav>
          <a href={`/c/${p.linea}`} className="mt-3 inline-block text-[11px] font-bold tracking-[0.2em] bg-black text-white px-2 py-1">{p.linea === "lupo" ? "LÍNEA LUPO" : "LÍNEA LIVE!"}</a>
          <h1 className="mt-2 text-2xl font-extrabold leading-tight">{p.nome}</h1>
          <div className="text-xs text-neutral-500 mt-1">Ref. {p.referencia}</div>

          <div className="mt-4 flex items-baseline gap-3">
            <span className="text-3xl font-bold">{uyu(ref.precio)}</span>
            {desconto > 0 && (
              <>
                <span className="text-neutral-500 line-through">{uyu(ref.precioOriginal)}</span>
                <span className="text-black text-xs font-bold px-2 py-0.5 rounded-sm" style={{ background: VERDE }}>-{desconto}%</span>
              </>
            )}
          </div>

          <div className="mt-6">
            <div className="text-sm"><span className="font-semibold">Color:</span> {cor.nome}</div>
            <div className="mt-2 flex flex-wrap gap-2">
              {p.cores.map((c, i) => (
                <button key={c.id} onClick={() => trocarCor(i)} title={c.nome}
                  className={`size-9 rounded-full overflow-hidden ring-2 ring-offset-2 ${i === ci ? "ring-black" : "ring-transparent hover:ring-neutral-300"}`}>
                  <img src={c.amostra} alt={c.nome} className="size-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          <div className="mt-6">
            <div className="text-sm font-semibold">Talle</div>
            <div className="mt-2 flex flex-wrap gap-2">
              {cor.talles.map((t) => (
                <button key={t.sku} disabled={!t.stock} onClick={() => { setTalle(t.talle); setAviso(false); }}
                  className={`min-w-12 h-11 px-3 border text-sm font-medium ${
                    !t.stock ? "border-neutral-200 text-neutral-300 line-through cursor-not-allowed"
                      : talle === t.talle ? "bg-black text-white border-black" : "border-neutral-300 hover:border-black"}`}>
                  {t.talle}
                </button>
              ))}
            </div>
            {aviso && <div className="text-sm text-red-600 mt-2">Elegí un talle.</div>}
          </div>

          <button onClick={comprar} className="mt-6 w-full bg-black text-white font-bold py-4 hover:bg-neutral-800">
            Agregar al carrito
          </button>
          <button onClick={porWhatsapp} className="mt-3 w-full bg-[#25D366] text-white font-bold py-4 hover:brightness-95">
            Comprar por WhatsApp
          </button>
          <p className="mt-2 text-xs text-neutral-500 text-center">Pagos y envíos coordinados por WhatsApp</p>

          <div className="mt-6 space-y-3 text-sm border-t pt-5">
            {p.incluye.length > 0 && (
              <div>
                <div className="font-semibold">El kit incluye:</div>
                <ul className="mt-1 list-disc pl-5 text-neutral-700">{p.incluye.map((i, k) => <li key={k}>{i}</li>)}</ul>
              </div>
            )}
            {cor.composicion && <div>{cor.composicion}</div>}
            {cor.recomendado.length > 0 && <div><span className="font-semibold">Ideal para:</span> {cor.recomendado.join(", ")}</div>}
            <div className="text-neutral-500">Envíos a todo Uruguay.</div>
          </div>
        </div>
      </div>

      <Vitrine titulo="También te puede gustar" produtos={p.relacionados} />
    </div>
  );
}
