// SEO de FITCLUBUY para Uruguay: metadatos, ciudades y palabras clave.
// Páginas locales: /uy/<palabra-clave>/<ciudad> (ej.: /uy/calzas-deportivas/montevideo)
import { LOJA } from "./loja";

export const SITE = (import.meta.env.VITE_SITE_URL as string | undefined)?.replace(/\/$/, "") || "https://fitclubuy.com";

// Departamentos y ciudades principales (capital primero)
export const DEPARTAMENTOS: { nombre: string; ciudades: string[] }[] = [
  { nombre: "Montevideo", ciudades: ["Montevideo", "Pocitos", "Carrasco", "Punta Carretas", "Malvín", "Buceo", "Cordón", "Centro", "Prado", "Ciudad Vieja", "Parque Rodó", "La Blanqueada", "Unión", "Cerro"] },
  { nombre: "Canelones", ciudades: ["Canelones", "Ciudad de la Costa", "Las Piedras", "Pando", "La Paz", "Atlántida", "Santa Lucía", "Progreso", "Solymar", "Lagomar", "El Pinar", "Barros Blancos", "Salinas", "Parque del Plata"] },
  { nombre: "Maldonado", ciudades: ["Maldonado", "Punta del Este", "San Carlos", "Piriápolis", "Pan de Azúcar", "La Barra", "José Ignacio", "Aiguá"] },
  { nombre: "Rocha", ciudades: ["Rocha", "Chuy", "La Paloma", "Castillos", "Lascano", "Punta del Diablo", "La Pedrera", "Cabo Polonio"] },
  { nombre: "Colonia", ciudades: ["Colonia del Sacramento", "Carmelo", "Juan Lacaze", "Nueva Helvecia", "Rosario", "Nueva Palmira", "Tarariras"] },
  { nombre: "San José", ciudades: ["San José de Mayo", "Ciudad del Plata", "Libertad", "Ecilda Paullier"] },
  { nombre: "Salto", ciudades: ["Salto", "Constitución", "Belén"] },
  { nombre: "Paysandú", ciudades: ["Paysandú", "Guichón", "Quebracho"] },
  { nombre: "Rivera", ciudades: ["Rivera", "Tranqueras", "Vichadero"] },
  { nombre: "Tacuarembó", ciudades: ["Tacuarembó", "Paso de los Toros", "San Gregorio de Polanco"] },
  { nombre: "Cerro Largo", ciudades: ["Melo", "Río Branco", "Fraile Muerto"] },
  { nombre: "Artigas", ciudades: ["Artigas", "Bella Unión", "Tomás Gomensoro"] },
  { nombre: "Soriano", ciudades: ["Mercedes", "Dolores", "Cardona"] },
  { nombre: "Río Negro", ciudades: ["Fray Bentos", "Young", "Nuevo Berlín"] },
  { nombre: "Florida", ciudades: ["Florida", "Sarandí Grande", "Casupá"] },
  { nombre: "Lavalleja", ciudades: ["Minas", "José Pedro Varela", "Solís de Mataojo"] },
  { nombre: "Durazno", ciudades: ["Durazno", "Sarandí del Yí", "Carmen"] },
  { nombre: "Flores", ciudades: ["Trinidad", "Ismael Cortinas"] },
  { nombre: "Treinta y Tres", ciudades: ["Treinta y Tres", "Vergara", "Santa Clara de Olimar"] },
];

// Palabras clave: frase principal, variantes que se buscan y qué parte del catálogo mostrar
export const PALABRAS: { slug: string; frase: string; variantes: string[]; filtro: string; intro: string }[] = [
  { slug: "ropa-deportiva", frase: "Ropa deportiva", filtro: "novedades",
    variantes: ["ropa deportiva mujer", "ropa deportiva hombre", "indumentaria deportiva", "tienda de ropa deportiva"],
    intro: "calzas, tops, remeras, shorts y camperas para entrenar y para el día a día" },
  { slug: "calzas-deportivas", frase: "Calzas deportivas", filtro: "calzas",
    variantes: ["calzas de compresión", "calzas para gimnasio", "calzas tiro alto", "leggings deportivos"],
    intro: "calzas de compresión, tiro alto y telas que no transparentan" },
  { slug: "tops-deportivos", frase: "Tops deportivos", filtro: "tops",
    variantes: ["top deportivo mujer", "corpiño deportivo", "top para gimnasio", "top de alto impacto"],
    intro: "tops con soporte para entrenamiento, running y yoga" },
  { slug: "ropa-de-gimnasio", frase: "Ropa de gimnasio", filtro: "entrenamiento",
    variantes: ["ropa para el gym", "ropa fitness", "conjuntos deportivos mujer", "ropa para entrenar"],
    intro: "conjuntos, calzas y remeras para entrenar en el gimnasio, crossfit y funcional" },
  { slug: "ropa-de-running", frase: "Ropa de running", filtro: "running",
    variantes: ["ropa para correr", "shorts de running", "remeras para correr", "camperas rompevientos"],
    intro: "ropa liviana y respirable para correr: shorts, remeras, calzas y camperas" },
  { slug: "bikinis-y-mallas", frase: "Bikinis y mallas", filtro: "playa",
    variantes: ["bikinis", "mallas enteras", "mallas de hombre", "ropa de playa", "salidas de playa"],
    intro: "bikinis, mallas enteras, mallas de hombre y salidas de playa para el verano" },
  { slug: "ropa-deportiva-hombre", frase: "Ropa deportiva para hombre", filtro: "hombre",
    variantes: ["remeras deportivas hombre", "shorts deportivos hombre", "ropa de gimnasio hombre"],
    intro: "remeras, shorts, bermudas y camperas deportivas para hombre" },
  { slug: "yoga-y-pilates", frase: "Ropa de yoga y pilates", filtro: "yoga",
    variantes: ["calzas para yoga", "ropa para pilates", "tops para yoga"],
    intro: "calzas suaves, tops y conjuntos cómodos para yoga y pilates" },
];

export const slugUY = (s: string) =>
  s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

export const CIUDADES = DEPARTAMENTOS.flatMap((d) => d.ciudades.map((c) => ({ ciudad: c, slug: slugUY(c), departamento: d.nombre })));
export const ciudadPorSlug = (s: string) => CIUDADES.find((c) => c.slug === s);
export const palabraPorSlug = (s: string) => PALABRAS.find((p) => p.slug === s);

const PALABRAS_CLAVE_INICIO = [
  "ropa deportiva Uruguay", "calzas deportivas", "calzas de compresión", "tops deportivos", "ropa de gimnasio",
  "ropa fitness Uruguay", "ropa de running", "bikinis Uruguay", "mallas", "conjuntos deportivos mujer",
  "ropa deportiva Montevideo", "ropa deportiva Punta del Este", "tienda online ropa deportiva Uruguay",
];

const ogImagem = `${SITE}/logo-fitclub.png`;

export function seoInicio() {
  const titulo = `${LOJA.nome} | Ropa deportiva, calzas y bikinis en Uruguay`;
  const descr =
    "Tienda online de ropa deportiva en Uruguay: calzas de compresión, tops, remeras, shorts, camperas, bikinis y mallas. Envíos a Montevideo, Punta del Este y todo el país. Comprá por WhatsApp.";
  return {
    meta: [
      { title: titulo },
      { name: "description", content: descr },
      { name: "keywords", content: PALABRAS_CLAVE_INICIO.join(", ") },
      { property: "og:title", content: titulo },
      { property: "og:description", content: descr },
      { property: "og:image", content: ogImagem },
      { property: "og:locale", content: "es_UY" },
      { name: "geo.region", content: "UY" },
      { name: "geo.placename", content: "Uruguay" },
    ],
    links: [{ rel: "canonical", href: `${SITE}/` }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "OnlineStore",
          name: LOJA.nome,
          url: SITE,
          logo: ogImagem,
          description: descr,
          telephone: LOJA.whatsappVisible,
          areaServed: { "@type": "Country", name: "Uruguay" },
          currenciesAccepted: "UYU",
          paymentAccepted: "Transferencia, tarjeta (coordinado por WhatsApp)",
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: LOJA.nome,
          url: SITE,
          potentialAction: { "@type": "SearchAction", target: `${SITE}/buscar?q={q}`, "query-input": "required name=q" },
        }),
      },
    ],
  };
}

// Texto y preguntas de cada página local (variando por ciudad para no repetir contenido)
export function contenidoLocal(p: (typeof PALABRAS)[number], c: (typeof CIUDADES)[number]) {
  const enCapital = c.ciudad === c.departamento || DEPARTAMENTOS.find((d) => d.nombre === c.departamento)?.ciudades[0] === c.ciudad;
  const lugar = enCapital ? `${c.ciudad} (${c.departamento})` : `${c.ciudad}, ${c.departamento}`;
  const titulo = `${p.frase} en ${c.ciudad}`;
  return {
    titulo,
    metaTitulo: `${titulo} | Envío a ${c.departamento} | ${LOJA.nome}`,
    descripcion: `Comprá ${p.frase.toLowerCase()} en ${lugar}: ${p.intro}. Precios en pesos uruguayos, envíos a ${c.ciudad} y pago coordinado por WhatsApp.`,
    intro: [
      `En ${LOJA.nome} encontrás ${p.intro}, con envío a ${lugar}. Elegí tu talle y color, sumá los productos al carrito y enviá el pedido por WhatsApp: te confirmamos stock, costo de envío a ${c.ciudad} y forma de pago.`,
      `Si buscás ${p.variantes.slice(0, 3).join(", ")} o ${p.variantes[3] ?? p.frase.toLowerCase()} en ${c.departamento}, tenemos cientos de modelos en talles XS a XXL, con precios en pesos uruguayos.`,
    ],
    preguntas: [
      { p: `¿Hacen envíos de ${p.frase.toLowerCase()} a ${c.ciudad}?`, r: `Sí. Enviamos a ${c.ciudad} y a todo ${c.departamento}. El costo y el plazo te los confirmamos por WhatsApp al hacer el pedido.` },
      { p: "¿Cómo pago mi compra?", r: `Armá el carrito y tocá “Enviar pedido por WhatsApp” (${LOJA.whatsappVisible}). Coordinamos el pago por transferencia u otro medio y el envío.` },
      { p: "¿Qué talles tienen?", r: "Trabajamos talles XS, S, M, L, XL y XXL según el modelo. En cada producto ves los talles disponibles en el color elegido." },
      { p: "¿Tienen descuento en la primera compra?", r: "Sí: registrate en la web y rescatá $ 500 de descuento para tu primera compra." },
    ],
  };
}
