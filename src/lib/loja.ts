// Identidad de la tienda FITCLUBUY (Uruguay). Cambiá acá nombre, textos y contactos.
export const LOJA = {
  nome: "FITCLUBUY",
  logo: "/logo-fitclub.png",
  slogan: "Ropa deportiva y de playa con envío a todo Uruguay",
  whatsapp: "555391343980", // +55 53 9134-3980 (pedidos y pagos por WhatsApp)
  whatsappVisible: "+55 53 9134-3980",
  instagram: "",
  email: "",
};

// Precio de venta: precio de origen (R$) × MARGEN, convertido a pesos uruguayos con la cotización del día
export const MARGEN = 4.5; // +350 %

// Menú principal: etiqueta + filtro del catálogo (ver catalogo-moda.server.ts)
export const MENU = [
  { rotulo: "Línea LIVE!", slug: "live" },
  { rotulo: "Línea LUPO", slug: "lupo" },
  { rotulo: "Mujer", slug: "mujer" },
  { rotulo: "Hombre", slug: "hombre" },
  { rotulo: "Fitness", slug: "fitness" },
  { rotulo: "Playa", slug: "playa" },
  { rotulo: "Accesorios", slug: "accesorios" },
  { rotulo: "Pink Cheeks", slug: "pink-cheeks" },
  { rotulo: "Niños", slug: "ninos" },
  { rotulo: "Outlet", slug: "outlet" },
] as const;

// Submenú de cada línea (desplegable en el menú y en el menú del celular)
export const SUBMENU: Record<string, { rotulo: string; slug: string }[]> = {
  live: [
    { rotulo: "Calzas", slug: "calzas" }, { rotulo: "Tops", slug: "tops" }, { rotulo: "Remeras y blusas", slug: "remeras" },
    { rotulo: "Musculosas", slug: "musculosas" }, { rotulo: "Shorts", slug: "shorts" }, { rotulo: "Camperas y buzos", slug: "camperas" },
    { rotulo: "Enteritos y vestidos", slug: "enteritos" }, { rotulo: "Playa", slug: "playa" }, { rotulo: "Accesorios", slug: "accesorios" },
    { rotulo: "Pink Cheeks", slug: "pink-cheeks" }, { rotulo: "Kits", slug: "kits" }, { rotulo: "Outlet", slug: "outlet" },
  ],
  lupo: [
    { rotulo: "Calzas", slug: "calzas" }, { rotulo: "Tops", slug: "tops" }, { rotulo: "Remeras", slug: "remeras" },
    { rotulo: "Musculosas", slug: "musculosas" }, { rotulo: "Shorts y bermudas", slug: "shorts" }, { rotulo: "Camperas y buzos", slug: "camperas" },
    { rotulo: "Medias", slug: "medias" }, { rotulo: "Running", slug: "running" }, { rotulo: "Entrenamiento", slug: "entrenamiento" },
    { rotulo: "Accesorios", slug: "accesorios" },
  ],
};

const fmt = new Intl.NumberFormat("es-UY", { style: "currency", currency: "UYU", maximumFractionDigits: 0 });
export const uyu = (v: number) => fmt.format(v);

// Cupón de bienvenida (pop-up): descuento fijo en pesos en la primera compra
export const CUPON_BIENVENIDA = 500;

// Link de WhatsApp con mensaje armado
export const linkWhatsapp = (texto: string) => `https://wa.me/${LOJA.whatsapp}?text=${encodeURIComponent(texto)}`;
