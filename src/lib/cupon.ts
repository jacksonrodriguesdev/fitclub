import { createServerFn } from "@tanstack/react-start";

// Pop-up "Rescatá $500 para tu primera compra": guarda el contacto en `leads` (origen CUPON)
// y devuelve un código único que el carrito descuenta y se envía en el pedido por WhatsApp.
export const rescatarCuponFn = createServerFn({ method: "POST" })
  .validator((d: { nombre: string; email: string; whatsapp: string }) => ({
    nombre: String(d.nombre ?? "").trim().slice(0, 120),
    email: String(d.email ?? "").trim().toLowerCase().slice(0, 160),
    whatsapp: String(d.whatsapp ?? "").replace(/[^\d+]/g, "").slice(0, 20),
  }))
  .handler(async ({ data }) => {
    if (!data.nombre || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(data.email) || data.whatsapp.replace(/\D/g, "").length < 8) {
      return { ok: false as const, error: "Completá nombre, e-mail y WhatsApp válidos." };
    }
    const { prisma } = await import("./prisma");
    // Mismo e-mail → mismo código (no se acumulan cupones)
    const ya = await prisma.leads.findFirst({ where: { origem: "CUPON", email: data.email } });
    if (ya) return { ok: true as const, codigo: ya.ref };
    const codigo = `FIT500-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
    await prisma.leads.create({
      data: {
        origem: "CUPON",
        ref: codigo,
        nome: data.nombre,
        email: data.email,
        telefone: data.whatsapp,
        detalhe: "Cupón de bienvenida $500 (primera compra)",
        valor: 500,
        quando: new Date(),
      },
    });
    return { ok: true as const, codigo };
  });
