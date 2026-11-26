// Pop-up de bienvenida: "Rescatá $500 para tu primera compra". Aparece una vez por visitante
// (a los 8 s o al intentar salir de la página) y guarda el cupón para el carrito.
import { useEffect, useState } from "react";
import { X, Gift } from "lucide-react";
import { useRouterState } from "@tanstack/react-router";
import { rescatarCuponFn } from "@/lib/cupon";
import { CUPON_BIENVENIDA, uyu } from "@/lib/loja";
import { CHAVE_CUPON } from "./Carrito";
import { Logo, VERDE } from "./Loja";

const VISTO = "fitclubuy-popup-visto";
const ler = (k: string) => {
  try {
    return localStorage.getItem(k);
  } catch {
    return null;
  }
};
const gravar = (k: string, v: string) => {
  try {
    localStorage.setItem(k, v);
  } catch {
    /* navegador sin almacenamiento */
  }
};

export function PopupCupon() {
  const ruta = useRouterState({ select: (s) => s.location.pathname });
  const [abierto, setAbierto] = useState(false);
  const [f, setF] = useState({ nombre: "", email: "", whatsapp: "" });
  const [codigo, setCodigo] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [enviando, setEnviando] = useState(false);

  useEffect(() => {
    if (ler(VISTO) || ler(CHAVE_CUPON) || /^\/(admin|login|cadastro|cuenta)/.test(ruta)) return;
    const abrir = () => setAbierto(true);
    const t = setTimeout(abrir, 8000);
    const salida = (e: MouseEvent) => e.clientY <= 0 && abrir();
    document.addEventListener("mouseleave", salida);
    return () => {
      clearTimeout(t);
      document.removeEventListener("mouseleave", salida);
    };
  }, [ruta]);

  if (!abierto) return null;
  const cerrar = () => {
    gravar(VISTO, "1");
    setAbierto(false);
  };
  const enviar = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setEnviando(true);
    try {
      const r = await rescatarCuponFn({ data: f });
      if (!r.ok) return setError(r.error);
      gravar(CHAVE_CUPON, r.codigo);
      gravar(VISTO, "1");
      setCodigo(r.codigo);
    } catch {
      setError("No pudimos guardar tus datos. Probá de nuevo.");
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[70] bg-black/60 grid place-items-center p-4" onClick={cerrar}>
      <div className="relative w-full max-w-md bg-black text-white overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <button onClick={cerrar} className="absolute top-3 right-3 p-1 text-white/70 hover:text-white" aria-label="Cerrar"><X className="size-5" /></button>
        <div className="p-7 sm:p-9 text-center">
          <Logo className="h-8 mx-auto" />
          {codigo ? (
            <>
              <Gift className="size-10 mx-auto mt-6" style={{ color: VERDE }} />
              <h2 className="mt-3 text-2xl font-extrabold">¡Listo! Ganaste {uyu(CUPON_BIENVENIDA)}</h2>
              <p className="mt-2 text-white/75 text-sm">Tu código ya está aplicado en el carrito y se envía junto con tu pedido por WhatsApp.</p>
              <div className="mt-5 inline-block border-2 border-dashed px-6 py-3 text-2xl font-extrabold tracking-widest" style={{ borderColor: VERDE, color: VERDE }}>
                {codigo}
              </div>
              <button onClick={() => setAbierto(false)} className="mt-6 w-full font-bold py-3 text-black" style={{ background: VERDE }}>EMPEZAR A COMPRAR</button>
            </>
          ) : (
            <>
              <div className="mt-6 text-xs tracking-[0.3em] font-bold" style={{ color: VERDE }}>BIENVENIDA</div>
              <h2 className="mt-2 text-3xl sm:text-4xl font-extrabold leading-tight">
                Rescatá {uyu(CUPON_BIENVENIDA)}<br />para tu primera compra
              </h2>
              <p className="mt-3 text-white/70 text-sm">Dejanos tus datos y recibí tu código al instante.</p>
              <form onSubmit={enviar} className="mt-6 space-y-3 text-left">
                <input required placeholder="Tu nombre" value={f.nombre} onChange={(e) => setF({ ...f, nombre: e.target.value })}
                  className="w-full bg-white/10 border border-white/20 px-4 py-3 outline-none focus:border-white placeholder:text-white/40" />
                <input required type="email" placeholder="Tu e-mail" value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })}
                  className="w-full bg-white/10 border border-white/20 px-4 py-3 outline-none focus:border-white placeholder:text-white/40" />
                <input required type="tel" placeholder="Tu WhatsApp (ej.: 099 123 456)" value={f.whatsapp} onChange={(e) => setF({ ...f, whatsapp: e.target.value })}
                  className="w-full bg-white/10 border border-white/20 px-4 py-3 outline-none focus:border-white placeholder:text-white/40" />
                {error && <div className="text-sm text-red-400">{error}</div>}
                <button disabled={enviando} className="w-full font-extrabold py-3.5 text-black disabled:opacity-60" style={{ background: VERDE }}>
                  {enviando ? "ENVIANDO…" : `QUIERO MIS ${uyu(CUPON_BIENVENIDA)}`}
                </button>
              </form>
              <button onClick={cerrar} className="mt-4 text-xs text-white/50 underline">No, gracias</button>
              <p className="mt-3 text-[11px] text-white/40">Válido para la primera compra. Un cupón por persona.</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
