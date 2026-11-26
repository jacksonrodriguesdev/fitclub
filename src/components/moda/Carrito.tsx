// Carrito de FITCLUBUY: guardado en el navegador (localStorage), con panel lateral.
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { X, Minus, Plus, ShoppingBag } from "lucide-react";
import { LOJA, uyu, linkWhatsapp, CUPON_BIENVENIDA } from "@/lib/loja";

export type ItemCarrito = {
  sku: string;
  id: number;
  slug: string;
  nome: string;
  cor: string;
  talle: string;
  foto: string;
  precio: number;
  qtd: number;
};

type Ctx = {
  itens: ItemCarrito[];
  aberto: boolean;
  abrir: (v: boolean) => void;
  agregar: (i: Omit<ItemCarrito, "qtd">) => void;
  mudar: (sku: string, d: number) => void;
  tirar: (sku: string) => void;
};
const C = createContext<Ctx | null>(null);
const CHAVE = "fitclubuy-carrito";

export function CarritoProvider({ children }: { children: ReactNode }) {
  const [itens, setItens] = useState<ItemCarrito[]>([]);
  const [aberto, abrir] = useState(false);
  useEffect(() => {
    try {
      setItens(JSON.parse(localStorage.getItem(CHAVE) || "[]"));
    } catch {
      /* sin carrito guardado */
    }
  }, []);
  const salvar = (n: ItemCarrito[]) => {
    setItens(n);
    try {
      localStorage.setItem(CHAVE, JSON.stringify(n));
    } catch {
      /* navegador sin almacenamiento */
    }
  };
  const ctx: Ctx = {
    itens,
    aberto,
    abrir,
    agregar: (i) => {
      const ja = itens.find((x) => x.sku === i.sku);
      salvar(ja ? itens.map((x) => (x.sku === i.sku ? { ...x, qtd: x.qtd + 1 } : x)) : [...itens, { ...i, qtd: 1 }]);
      abrir(true);
    },
    mudar: (sku, d) => salvar(itens.map((x) => (x.sku === sku ? { ...x, qtd: Math.max(1, x.qtd + d) } : x))),
    tirar: (sku) => salvar(itens.filter((x) => x.sku !== sku)),
  };
  return (
    <C.Provider value={ctx}>
      {children}
      <PanelCarrito />
    </C.Provider>
  );
}

export const useCarrito = () => {
  const c = useContext(C);
  if (!c) throw new Error("useCarrito fuera de CarritoProvider");
  return c;
};

// Cupón de bienvenida guardado por el pop-up (ver PopupCupon.tsx)
export const CHAVE_CUPON = "fitclubuy-cupon";
export function cuponGuardado(): string | null {
  try {
    return localStorage.getItem(CHAVE_CUPON);
  } catch {
    return null;
  }
}

// Mensaje de WhatsApp con el pedido completo (también usado por "Comprar por WhatsApp" en el producto)
export function mensajePedido(itens: ItemCarrito[], cupon: string | null) {
  const origen = typeof window !== "undefined" ? window.location.origin : "";
  const subtotal = itens.reduce((s, i) => s + i.precio * i.qtd, 0);
  const desc = cupon ? Math.min(CUPON_BIENVENIDA, subtotal) : 0;
  const lineas = itens.map(
    (i, n) =>
      `${n + 1}) *${i.nome}*
   Color: ${i.cor} · Talle: ${i.talle}
   Cantidad: ${i.qtd} × ${uyu(i.precio)} = *${uyu(i.precio * i.qtd)}*
   Código: ${i.sku}
   ${origen}/p/${i.slug}`,
  );
  return [
    `¡Hola ${LOJA.nome}! Quiero hacer este pedido:`,
    "",
    ...lineas,
    "",
    `Subtotal: ${uyu(subtotal)}`,
    ...(desc ? [`Cupón de bienvenida ${cupon}: -${uyu(desc)}`] : []),
    `*Total: ${uyu(subtotal - desc)}*`,
    "",
    "¿Cómo coordinamos el pago y el envío?",
  ].join("\n");
}

function PanelCarrito() {
  const { itens, aberto, abrir, mudar, tirar } = useCarrito();
  if (!aberto) return null;
  const cupon = cuponGuardado();
  const subtotal = itens.reduce((s, i) => s + i.precio * i.qtd, 0);
  const desc = cupon ? Math.min(CUPON_BIENVENIDA, subtotal) : 0;
  return (
    <div className="fixed inset-0 z-[60] bg-black/50" onClick={() => abrir(false)}>
      <aside className="absolute right-0 top-0 h-full w-full max-w-md bg-white flex flex-col" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-5 h-16 border-b">
          <div className="font-bold text-lg">Tu carrito</div>
          <button onClick={() => abrir(false)} aria-label="Cerrar"><X className="size-5" /></button>
        </div>
        {itens.length === 0 ? (
          <div className="flex-1 grid place-items-center text-neutral-500 text-center p-8">
            <div>
              <ShoppingBag className="size-10 mx-auto mb-3" />
              Tu carrito está vacío.
            </div>
          </div>
        ) : (
          <>
            <ul className="flex-1 overflow-y-auto divide-y">
              {itens.map((i) => (
                <li key={i.sku} className="flex gap-3 p-4">
                  <img src={i.foto} alt="" className="w-20 aspect-[3/4] object-cover bg-neutral-100" />
                  <div className="flex-1 text-sm">
                    <a href={`/p/${i.slug}`} className="font-medium line-clamp-2">{i.nome}</a>
                    <div className="text-neutral-500">{i.cor} · Talle {i.talle}</div>
                    <div className="text-neutral-500">{uyu(i.precio)} c/u</div>
                    <div className="mt-2 flex items-center gap-3">
                      <div className="flex items-center border rounded">
                        <button className="p-1.5" onClick={() => mudar(i.sku, -1)} aria-label="Menos"><Minus className="size-3" /></button>
                        <span className="w-6 text-center">{i.qtd}</span>
                        <button className="p-1.5" onClick={() => mudar(i.sku, 1)} aria-label="Más"><Plus className="size-3" /></button>
                      </div>
                      <button className="text-xs underline text-neutral-500" onClick={() => tirar(i.sku)}>Quitar</button>
                    </div>
                  </div>
                  <div className="text-sm font-semibold whitespace-nowrap">{uyu(i.precio * i.qtd)}</div>
                </li>
              ))}
            </ul>
            <div className="border-t p-5 space-y-2">
              <div className="flex justify-between text-sm"><span>Subtotal</span><span>{uyu(subtotal)}</span></div>
              {desc > 0 && (
                <div className="flex justify-between text-sm text-green-700"><span>Cupón {cupon}</span><span>-{uyu(desc)}</span></div>
              )}
              <div className="flex justify-between font-bold text-lg"><span>Total</span><span>{uyu(subtotal - desc)}</span></div>
              <a href={linkWhatsapp(mensajePedido(itens, cupon))} target="_blank" rel="noreferrer"
                className="mt-2 flex items-center justify-center gap-2 bg-[#25D366] text-white font-bold py-3.5 rounded-sm hover:brightness-95">
                Enviar pedido por WhatsApp
              </a>
              <p className="text-xs text-neutral-500 text-center">El pago y el envío se coordinan por WhatsApp ({LOJA.whatsappVisible}).</p>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}
