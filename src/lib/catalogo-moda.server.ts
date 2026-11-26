// Catálogo de moda leído del produtos.json generado por el descargador (Desktop\live\produtos).
// Por ahora directo del archivo (sin base de datos); se recarga solo cuando el archivo cambia.
// Precios: precio de origen en R$ × MARGEN × cotización R$→$U del día.
import fs from "node:fs";
import path from "node:path";
import { MARGEN } from "./loja";
import { nomeEs, corEs } from "./es-moda";

const DIR = process.env.CATALOGO_DIR || "C:/Users/USER/Desktop/live/produtos";
const IMG_REMOTA = "https://imagens.liveoficial.com.br/product/";

type Tamanho = {
  tamanho: string;
  sku: string;
  preco: number;
  preco_original: number;
  estoque: number;
  disponivel: boolean;
};
type Cor = {
  id: number;
  nome: string;
  amostra: string;
  fotos: string[];
  tamanhos: Tamanho[];
  detalhes: string;
  recomendacao: string | null;
};
export type Linea = "live" | "lupo";
type Produto = { id: number; referencia: string; nome: string; categorias: string[]; cores: Cor[]; linha: Linea; itens?: string[] };

export type CardProduto = {
  id: number;
  slug: string;
  linea: Linea;
  marca: string; // etiqueta del card: LIVE! · LUPO · PINK CHEEKS
  nome: string;
  foto: string;
  foto2: string | null;
  preco: number; // $U
  precoOriginal: number; // $U
  cores: { nome: string; amostra: string }[];
};

// Dos líneas: LIVE! (Desktop\live\produtos) y LUPO (Desktop\lupo\produtos, extraído de la tienda Shopify)
const DIR_LUPO = process.env.CATALOGO_LUPO_DIR || "C:/Users/USER/Desktop/lupo/produtos";
const PREFIXO_LUPO = "lupo/"; // fotos de Lupo: "lupo/fotos/<handle>/<color>/<archivo>"

type ProdutoLupo = {
  id: number; referencia: string; nome: string; genero: string[]; esportes: string[]; faixa_etaria: string[];
  categorias: string[]; tipo: string;
  cores: { id: string; nome: string; fotos: string[]; tamanhos: { tamanho: string; sku: string; preco: number; preco_original: number; disponivel: boolean }[] }[];
};
// Categorías de Lupo traducidas al mismo esquema que usa LIVE! (así funcionan los mismos filtros)
const ESPORTE_CAT: Record<string, string[]> = {
  Corrida: ["corrida"], Treino: ["treino", "training"], "Estúdio": ["yoga", "pilates"], IOGA: ["yoga"],
  "Beach Tennis": ["beach-tennis"], Trilha: ["trilha"], Tenis: ["tenis"], Ciclismo: ["ciclismo"],
  "Acessórios": ["acessorios"], "Esportes Aquáticos": ["praia"], Casual: ["casual"], Futebol: ["futebol"],
};
function deLupo(p: ProdutoLupo): Produto {
  const cats = new Set(p.categorias);
  const acessorio = p.esportes.includes("Acessórios") || /acess|meia|bon[eé]|viseira|pochete|garraf|mochila|bolsa|caneca|faixa de cabelo|manguito|cano /i.test(`${p.tipo} ${p.nome}`);
  for (const g of p.genero) {
    if (g === "Feminino" || g === "Unissex") cats.add("feminino");
    if (g === "Masculino" || g === "Unissex") cats.add("masculino");
  }
  if (p.faixa_etaria.includes("Kids")) cats.add("kids");
  for (const e of p.esportes) for (const c of ESPORTE_CAT[e] ?? []) cats.add(c);
  if (acessorio) cats.add("acessorios");
  else cats.add("moda-fitness");
  return {
    id: p.id,
    referencia: p.referencia,
    nome: p.nome,
    linha: "lupo",
    categorias: [...cats],
    cores: p.cores.map((c) => ({
      id: c.id as unknown as number,
      nome: c.nome,
      amostra: "",
      fotos: c.fotos.map((f) => PREFIXO_LUPO + f),
      detalhes: "",
      recomendacao: p.esportes.filter((e) => e !== "Acessórios").join(", ") || null,
      // la tienda de origen no informa la cantidad, solo si hay stock
      tamanhos: c.tamanhos.map((t) => ({ ...t, estoque: t.disponivel ? 99 : 0 })),
    })),
  };
}

let cache: { chave: string; produtos: Produto[] } | null = null;
function produtos(): Produto[] {
  const arqLive = path.join(DIR, "produtos.json");
  const arqLupo = path.join(DIR_LUPO, "produtos_agrupados.json");
  const temLupo = fs.existsSync(arqLupo);
  // kits de LIVE! (kits.json) y la lista de productos de la marca Pink Cheeks (marcas.json), de baixar_kits.cjs
  const arqKits = path.join(DIR, "kits.json");
  const arqMarcas = path.join(DIR, "marcas.json");
  const mt = (a: string) => (fs.existsSync(a) ? fs.statSync(a).mtimeMs : 0);
  const chave = [arqLive, arqLupo, arqKits, arqMarcas].map(mt).join("|");
  if (!cache || cache.chave !== chave) {
    const ler = (a: string, padrao: unknown) => (fs.existsSync(a) ? JSON.parse(fs.readFileSync(a, "utf8")) : padrao);
    const pink = new Set<number>(ler(arqMarcas, { pinkCheeks: [] }).pinkCheeks);
    const kits: Produto[] = ler(arqKits, []);
    const live: Produto[] = [...kits, ...JSON.parse(fs.readFileSync(arqLive, "utf8"))].map((p: Produto) => ({
      ...p,
      linha: "live" as const,
      categorias: pink.has(p.id) ? [...p.categorias, "pink-cheeks"] : p.categorias,
    }));
    const lupo: Produto[] = temLupo ? JSON.parse(fs.readFileSync(arqLupo, "utf8")).map(deLupo) : [];
    // intercaladas (2 de LIVE!, 1 de LUPO) para que las vitrinas muestren las dos líneas
    const todos: Produto[] = [];
    for (let i = 0, j = 0; i < live.length || j < lupo.length; ) {
      if (i < live.length) todos.push(live[i++]);
      if (i < live.length) todos.push(live[i++]);
      if (j < lupo.length) todos.push(lupo[j++]);
    }
    cache = { chave, produtos: todos };
  }
  return cache.produtos;
}

// Cotización R$ → $U: se actualiza una vez por día (open.er-api.com) y queda guardada en cotacao.json
const ARQ_COTACAO = path.join(DIR, "cotacao.json");
let cotacao: { valor: number; data: number } | null = null;
try {
  cotacao = JSON.parse(fs.readFileSync(ARQ_COTACAO, "utf8"));
} catch {
  /* sin archivo todavía */
}
let buscando = false;
async function atualizarCotacao() {
  if (buscando) return;
  buscando = true;
  try {
    const r = await fetch("https://open.er-api.com/v6/latest/BRL");
    const valor = (await r.json())?.rates?.UYU;
    if (valor > 0) {
      cotacao = { valor, data: Date.now() };
      fs.writeFileSync(ARQ_COTACAO, JSON.stringify(cotacao));
    }
  } catch {
    /* sigue con la última cotización conocida */
  } finally {
    buscando = false;
  }
}
export async function cotacaoDoDia() {
  if (!cotacao || Date.now() - cotacao.data > 24 * 3600_000) await atualizarCotacao();
  return cotacao?.valor ?? 6.88;
}

// Precio redondeado hacia arriba terminando en 90: 12.384 → 12.390
const arred = (v: number) => Math.max(90, Math.ceil(v / 100) * 100 - 10);
const emPesos = (brl: number, taxa: number) => arred(brl * MARGEN * taxa);

// Foto local si ya fue descargada; si no, la original (vista previa mientras termina la descarga)
export function fotoUrl(rel: string) {
  if (rel.startsWith(PREFIXO_LUPO)) return `/catalogo/lupo/${rel.slice(PREFIXO_LUPO.length).replace(/^fotos\//, "")}`;
  if (fs.existsSync(path.join(DIR, rel))) return `/catalogo/${rel.replace(/^fotos\//, "")}`;
  return IMG_REMOTA + path.basename(rel);
}

// Muestra del color descargada junto con las fotos (fotos/<ref>/<color>/_cor.png)
// Lupo no tiene muestras: se usa la primera foto del color
function amostraUrl(p: Produto, c: Cor) {
  if (p.linha === "lupo") return c.fotos[0] ? fotoUrl(c.fotos[0]) : "";
  const rel = `fotos/${slugify(p.referencia || String(p.id))}/${slugify(c.nome || "sem-cor")}/_cor${path.extname(c.amostra || "") || ".png"}`;
  return fs.existsSync(path.join(DIR, rel)) ? `/catalogo/${rel.slice(6)}` : c.amostra;
}

const slugify = (s: string) =>
  s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

const disponiveis = (c: Cor) => c.tamanhos.filter((t) => t.disponivel && t.estoque > 0);

function card(p: Produto, taxa: number): CardProduto | null {
  const cores = p.cores.filter((c) => c.fotos.length && disponiveis(c).length);
  if (!cores.length) return null;
  const c = cores[0];
  const t = disponiveis(c).sort((a, b) => a.preco - b.preco)[0];
  const nome = nomeEs(p.nome);
  return {
    id: p.id,
    slug: `${slugify(nome)}-${p.id}`,
    linea: p.linha,
    marca: p.categorias.includes("pink-cheeks") ? "PINK CHEEKS" : p.linha === "lupo" ? "LUPO" : "LIVE!",
    nome,
    foto: fotoUrl(c.fotos[0]),
    foto2: c.fotos[1] ? fotoUrl(c.fotos[1]) : null,
    preco: emPesos(t.preco, taxa),
    precoOriginal: emPesos(t.preco_original, taxa),
    cores: cores.map((x) => ({ nome: corEs(x.nome), amostra: amostraUrl(p, x) })),
  };
}

// Filtros por sección. Las categorías del origen son desordenadas: se combina categoría + nombre.
const tem = (p: Produto, re: RegExp) => p.categorias.some((c) => re.test(c));
const nome = (p: Produto, re: RegExp) => re.test(p.nome);
export const FILTROS: Record<string, (p: Produto) => boolean> = {
  live: (p) => p.linha === "live",
  "pink-cheeks": (p) => p.categorias.includes("pink-cheeks"),
  kits: (p) => p.categorias.includes("kits"),
  lupo: (p) => p.linha === "lupo",
  mujer: (p) => tem(p, /^feminino/) && !nome(p, /\bmen\b|masculin/i),
  hombre: (p) => tem(p, /^masculino/) || nome(p, /\bmen\b|masculin/i),
  fitness: (p) => tem(p, /^moda-fitness|fitness/),
  playa: (p) => nome(p, /biqu|maiô|maio|tanga|sunga|saída|saida|praia|beach/i),
  accesorios: (p) =>
    tem(p, /^acessorios|acessorios/) || nome(p, /garrafa|bolsa|mochila|necess|viseira|bon[eé]|meia|toalha|squeeze/i),
  ninos: (p) => tem(p, /^kids|infantil/) || nome(p, /kids/i),
  outlet: (p) => p.cores.some((c) => c.tamanhos.some((t) => t.preco < t.preco_original)),
  calzas: (p) => nome(p, /legging|calça|calca/i),
  running: (p) => tem(p, /corrida/),
  entrenamiento: (p) => tem(p, /training|treino|cross/),
  yoga: (p) => tem(p, /yoga|pilates/),
  conjuntos: (p) => nome(p, /conjunto|macac|body|top/i) && tem(p, /fitness/),
  remeras: (p) => nome(p, /camiseta|t-shirt|blusa|\bpolo\b|cropped|camisa/i) && !nome(p, /regata|biqu/i),
  musculosas: (p) => nome(p, /regata/i),
  shorts: (p) => nome(p, /\bshorts?\b|bermuda|\bsaia\b|tapa bumbum/i) && !nome(p, /biqu|tanga|sunga/i),
  camperas: (p) => nome(p, /jaqueta|moletom|colete|casaco|corta-vento|shacket|blus[aã]o|jacket|hoodie|puffer|manga longa/i) && !nome(p, /^top|camiseta|t-shirt|mai[oô]/i),
  enteritos: (p) => nome(p, /macac|\bbody\b|vestido/i),
  medias: (p) => nome(p, /\bmeias?\b|sapatilha|\bcano (curto|m[ée]dio|longo|extra)/i),
  // Tops de entrenamiento (sin los de bikini)
  tops: (p) =>
    nome(p, /^top\b/i) &&
    !nome(p, /cortininha|faixa|biqu|praia|tomara|fancy|amarra/i) &&
    !tem(p, /^moda-praia|praia-outlet/),
};

export function vitrine(filtro: keyof typeof FILTROS | null, taxa: number, n = 12, pular = 0) {
  const f = filtro ? FILTROS[filtro] : () => true;
  const out: CardProduto[] = [];
  let i = 0;
  for (const p of produtos()) {
    if (!f(p)) continue;
    const c = card(p, taxa);
    if (!c) continue;
    if (i++ < pular) continue;
    out.push(c);
    if (out.length >= n) break;
  }
  return out;
}

export async function homeModa() {
  const taxa = await cotacaoDoDia();
  const fotos = (filtro: keyof typeof FILTROS, n: number, pular = 0) =>
    vitrine(filtro, taxa, n, pular).map((c) => c.foto);
  const mix = (a: keyof typeof FILTROS, b: keyof typeof FILTROS, n = 12) => {
    const fa = FILTROS[a], fb = FILTROS[b];
    const out: CardProduto[] = [];
    for (const p of produtos()) {
      if (!fa(p) || !fb(p)) continue;
      const c = card(p, taxa);
      if (c) out.push(c);
      if (out.length >= n) break;
    }
    return out;
  };
  return {
    total: produtos().length,
    cotacao: taxa,
    // Carrusel principal: cada slide es un collage de 3 fotos
    hero: [
      { titulo: "Nueva línea LUPO", sub: "Running, beach tennis y entrenamiento con tecnología Lupo Sport", fotos: fotos("lupo", 3, 0), mujer: "/c/lupo?genero=mujer", hombre: "/c/lupo?genero=hombre" },
      { titulo: "Movimiento con estilo", sub: "Nueva colección de calzas, tops y conjuntos", fotos: fotos("calzas", 3, 2), mujer: "/c/mujer", hombre: "/c/hombre" },
      { titulo: "Tu verano empieza acá", sub: "Bikinis, mallas y salidas de playa", fotos: fotos("playa", 3, 4), mujer: "/c/playa", hombre: "/c/hombre" },
      { titulo: "Hecho para correr", sub: "Ropa liviana y respirable para tus kilómetros", fotos: fotos("running", 3, 1), mujer: "/c/running", hombre: "/c/hombre" },
      { titulo: "Outlet FIT CLUB", sub: "Descuentos en cientos de productos", fotos: fotos("outlet", 3, 6), mujer: "/c/outlet", hombre: "/c/outlet" },
    ],
    lineas: [
      { slug: "live", titulo: "LIVE!", sub: "Moda fitness y playa: calzas, tops, bikinis", total: produtos().filter((p) => FILTROS.live(p) && card(p, 1)).length, fotos: fotos("live", 2, 40) },
      { slug: "lupo", titulo: "LUPO", sub: "Lupo Sport: running, beach tennis y entrenamiento", total: produtos().filter((p) => FILTROS.lupo(p) && card(p, 1)).length, fotos: fotos("lupo", 2, 12) },
    ],
    vitrineLupo: vitrine("lupo", taxa, 12, 3),
    vitrineLive: vitrine("live", taxa, 12, 24),
    pilares: [
      { titulo: "Running", foto: fotos("running", 1, 3)[0], slug: "running" },
      { titulo: "Entrenamiento", foto: fotos("entrenamiento", 1, 5)[0], slug: "entrenamiento" },
      { titulo: "Yoga y pilates", foto: fotos("yoga", 1, 2)[0], slug: "yoga" },
      { titulo: "Playa", foto: fotos("playa", 1, 8)[0], slug: "playa" },
    ],
    pestanas: [
      { titulo: "Mujer", link: "/c/mujer", productos: vitrine("mujer", taxa, 12, 12) },
      { titulo: "Hombre", link: "/c/hombre", productos: vitrine("hombre", taxa, 12) },
      { titulo: "Novedades", link: "/c/novedades", productos: vitrine(null, taxa, 12) },
      { titulo: "LIVE!", link: "/c/live", productos: vitrine("live", taxa, 12, 60) },
      { titulo: "LUPO", link: "/c/lupo", productos: vitrine("lupo", taxa, 12, 30) },
    ],
    editorial: fotos("mujer", 2, 30),
    cajas: [
      { titulo: "Armá tu look", sub: "Conjuntos para entrenar", foto: fotos("conjuntos", 1, 10)[0], link: "/c/fitness" },
      { titulo: "Accesorios", sub: "Botellas, bolsos y más", foto: fotos("accesorios", 1, 2)[0], link: "/c/accesorios" },
      { titulo: "Outlet", sub: "Hasta 50 % de descuento", foto: fotos("outlet", 1, 20)[0], link: "/c/outlet" },
    ],
    // Círculos "Comprá por categoría" (foto de un producto de cada una)
    categorias: ([
      ["calzas", "Calzas", 6], ["tops", "Tops", 3], ["remeras", "Remeras", 2], ["shorts", "Shorts", 1],
      ["camperas", "Camperas", 0], ["enteritos", "Enteritos", 0], ["playa", "Playa", 12], ["medias", "Medias", 0],
      ["accesorios", "Accesorios", 4], ["pink-cheeks", "Pink Cheeks", 0], ["kits", "Kits", 0], ["outlet", "Outlet", 30],
    ] as [keyof typeof FILTROS, string, number][]).map(([slug, titulo, pular]) => ({ slug, titulo, foto: fotos(slug, 1, pular)[0] ?? null }))
      .filter((c) => c.foto),
    // Atajos dentro de cada línea (las subcategorías con más productos)
    atajos: Object.fromEntries((["live", "lupo"] as const).map((l) => [l,
      (["calzas", "tops", "remeras", "shorts", "camperas", "playa", "medias", "running", "accesorios"] as const)
        .map((s) => ({ slug: s, titulo: TITULOS[s], n: produtos().filter((p) => FILTROS[l](p) && FILTROS[s](p) && card(p, 1)).length }))
        .filter((s) => s.n >= 8).sort((a, b) => b.n - a.n).slice(0, 5)])) as Record<"live" | "lupo", { slug: string; titulo: string; n: number }[]>,
    // Ofertas: los mayores descuentos (alternando líneas)
    ofertas: (() => {
      const todos: CardProduto[] = [];
      for (const p of produtos()) { if (!FILTROS.outlet(p)) continue; const c = card(p, taxa); if (c && c.precoOriginal > c.preco) todos.push(c); }
      return todos.sort((a, b) => b.precoOriginal / b.preco - a.precoOriginal / a.preco).slice(0, 12);
    })(),
    kits: vitrine("kits", taxa, 12),
    calzas: vitrine("calzas", taxa, 12),
    tops: vitrine("tops", taxa, 12),
    running: mix("running", "mujer"),
    playa: vitrine("playa", taxa, 12),
  };
}

// ---------- Talles, listado por categoría/búsqueda y detalle de producto ----------

// Talles brasileños → uruguayos
const TALLES: Record<string, string> = {
  PP: "XS", P: "S", M: "M", G: "L", GG: "XL", EG: "XXL", XGG: "XXL", XG: "XXL", XXG: "XXXL", "4XG": "4XL", "5XG": "5XL",
  U: "Único", "ÚNICO": "Único", UNICO: "Único", "M/G": "M/L", "PP/P": "XS/S", "P/M": "S/M", "G/GG": "L/XL",
};
export const talleEs = (t: string) => {
  const s = t.trim();
  if (TALLES[s.toUpperCase()]) return TALLES[s.toUpperCase()];
  // "P (38 a 40)" → "S (38 al 40)", "08 anos" → "8 años"
  return s
    .replace(/^(PP|P|M|GG|G|XG)(?= \()/, (m) => TALLES[m])
    .replace(/^0?(\d+) anos$/i, "$1 años")
    .replace(/Panturrilha/i, "Pantorrilla")
    .replace(/ a /g, " al ");
};
const ORDEM_TALLES = ["XS", "XS/S", "S", "S/M", "M", "M/L", "L", "L/XL", "XL", "XXL", "XXXL", "4XL", "5XL", "Único"];
const ordenarTalles = (a: string, b: string) => {
  const ia = ORDEM_TALLES.indexOf(a), ib = ORDEM_TALLES.indexOf(b);
  if (ia >= 0 || ib >= 0) return (ia < 0 ? 99 : ia) - (ib < 0 ? 99 : ib);
  return a.localeCompare(b, "es", { numeric: true });
};

export const TITULOS: Record<string, string> = {
  live: "Línea LIVE!", lupo: "Línea LUPO", todos: "Todos los productos", remeras: "Remeras y blusas", musculosas: "Musculosas",
  shorts: "Shorts y bermudas", camperas: "Camperas y buzos", enteritos: "Enteritos y vestidos", medias: "Medias", "pink-cheeks": "Pink Cheeks · Belleza y protección solar", kits: "Kits",
  mujer: "Mujer", hombre: "Hombre", fitness: "Fitness", playa: "Playa", accesorios: "Accesorios",
  ninos: "Niños", outlet: "Outlet", calzas: "Calzas y pantalones", tops: "Tops", novedades: "Novedades",
  running: "Running", entrenamiento: "Entrenamiento", yoga: "Yoga y pilates", conjuntos: "Armá tu look",
};

const sem = (s: string) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

// Subcategorías que se muestran dentro de cada línea (solo las que tienen productos)
const SUBCATS = ["calzas", "tops", "remeras", "musculosas", "shorts", "camperas", "conjuntos", "enteritos", "playa",
  "running", "entrenamiento", "yoga", "medias", "accesorios", "pink-cheeks", "kits", "ninos", "outlet"];

export async function listar(o: { cat?: string; q?: string; talle?: string; orden?: string; pagina?: number; genero?: string; linea?: string }) {
  const taxa = await cotacaoDoDia();
  // /c/live y /c/lupo = toda la línea; /c/calzas?linea=lupo = calzas de LUPO
  let linea: Linea | undefined = o.linea === "live" || o.linea === "lupo" ? o.linea : undefined;
  if (o.cat === "live" || o.cat === "lupo") { linea = o.cat; o = { ...o, cat: undefined }; }
  if (o.cat === "todos") o = { ...o, cat: undefined };
  const filtroCat = o.cat && FILTROS[o.cat] ? FILTROS[o.cat] : () => true;
  const filtro = (p: Produto) => (!linea || p.linha === linea) && filtroCat(p);
  // conteo por subcategoría dentro de la línea (y del género elegido)
  const conteo: Record<string, number> = {};
  for (const p of produtos()) {
    if (linea && p.linha !== linea) continue;
    if ((o.genero === "mujer" || o.genero === "hombre") && !FILTROS[o.genero](p)) continue;
    if (!p.cores.some((c) => c.fotos.length && disponiveis(c).length)) continue;
    for (const sc of SUBCATS) if (FILTROS[sc](p)) conteo[sc] = (conteo[sc] ?? 0) + 1;
  }
  const subcats = SUBCATS.filter((sc) => conteo[sc]).map((sc) => ({ slug: sc, titulo: TITULOS[sc] ?? sc, total: conteo[sc] }));
  const termos = o.q ? termosBusca(o.q) : [];
  const talles = new Set<string>();
  let itens: (CardProduto & { talles: string[] })[] = [];
  for (const p of produtos()) {
    if (!filtro(p)) continue;
    if ((o.genero === "mujer" || o.genero === "hombre") && !FILTROS[o.genero](p)) continue;
    if (termos.length) {
      // nombre (original y traducido), referencia, colores y categorías ("feminino" responde a "mujer")
      const alvo = " " + sem(
        `${p.linha} ${p.nome} ${nomeEs(p.nome)} ${p.referencia} ${p.cores.map((c) => `${c.nome} ${corEs(c.nome)}`).join(" ")} ${generos(p)}`,
      ).replace(/[^a-z0-9]+/g, " ");
      // cada término debe aparecer como comienzo de palabra ("men" no coincide con "elemento")
      if (!termos.every((alts) => alts.some((t) => alvo.includes(" " + t)))) continue;
    }
    const c = card(p, taxa);
    if (!c) continue;
    const ts = [...new Set(p.cores.flatMap((x) => disponiveis(x).map((t) => talleEs(t.tamanho))))];
    ts.forEach((t) => talles.add(t));
    itens.push({ ...c, talles: ts });
  }
  if (o.talle) itens = itens.filter((i) => i.talles.includes(o.talle!));
  if (o.orden === "menor") itens.sort((a, b) => a.preco - b.preco);
  if (o.orden === "mayor") itens.sort((a, b) => b.preco - a.preco);
  if (o.orden === "descuento") itens.sort((a, b) => b.precoOriginal / b.preco - a.precoOriginal / a.preco);
  const pagina = Math.max(1, o.pagina ?? 1);
  const porPagina = 24;
  return {
    titulo:
      (o.q ? `Resultados para “${o.q}”` : [linea && TITULOS[linea], o.cat && (TITULOS[o.cat] ?? o.cat)].filter(Boolean).join(" · ") || "Todos los productos") +
      (o.genero === "mujer" ? " · Mujer" : o.genero === "hombre" ? " · Hombre" : ""),
    total: itens.length,
    linea: linea ?? null,
    cat: o.cat ?? null,
    subcats,
    talles: [...talles].sort(ordenarTalles),
    itens: itens.slice(0, pagina * porPagina).map(({ talles: _t, ...r }) => r),
    hayMas: itens.length > pagina * porPagina,
  };
}

// Textos técnicos: solo la composición y la recomendación, traducidas (la descripción completa queda pendiente)
const FIBRAS: [RegExp, string][] = [[/composição/gi, "Composición"], [/\be\b/g, "y"], [/algodão/gi, "algodón"], [/poliéster/gi, "poliéster"]];
const ESPORTES: Record<string, string> = {
  corrida: "Running", natação: "Natación", "cross training": "Cross training", trilha: "Trekking", yoga: "Yoga",
  pilates: "Pilates", bike: "Ciclismo", ciclismo: "Ciclismo", "beach tennis": "Beach tennis", lifestyle: "Uso diario",
  musculação: "Musculación", "treino funcional": "Entrenamiento funcional", caminhada: "Caminata", praia: "Playa",
  dança: "Danza", tênis: "Tenis", "dia a dia": "Día a día", academia: "Gimnasio",
  treino: "Entrenamiento", "estúdio": "Yoga y pilates", ioga: "Yoga", casual: "Uso diario", tenis: "Tenis",
  futebol: "Fútbol", "esportes aquáticos": "Deportes acuáticos",
};

export async function produto(id: number) {
  const p = produtos().find((x) => x.id === id);
  if (!p) return null;
  const taxa = await cotacaoDoDia();
  const cores = p.cores
    .filter((c) => c.fotos.length)
    .map((c) => {
      const comp = ((c.detalhes || "").match(/Composição:[^\n]+/i)?.[0] ?? "");
      return {
        id: c.id,
        nome: corEs(c.nome),
        amostra: amostraUrl(p, c),
        fotos: c.fotos.map(fotoUrl),
        composicion: FIBRAS.reduce((s, [re, es]) => s.replace(re, es), comp),
        recomendado: (c.recomendacao || "").split(",").map((s) => s.trim()).filter(Boolean)
          .map((s) => ESPORTES[s.toLowerCase()] ?? s),
        talles: c.tamanhos
          .map((t) => ({ talle: talleEs(t.tamanho), sku: t.sku, precio: emPesos(t.preco, taxa),
            precioOriginal: emPesos(t.preco_original, taxa), stock: t.disponivel && t.estoque > 0 }))
          .sort((a, b) => ordenarTalles(a.talle, b.talle)),
      };
    })
    .filter((c) => c.talles.some((t) => t.stock));
  if (!cores.length) return null;
  const nome = nomeEs(p.nome);
  return { id: p.id, nome, linea: p.linha, incluye: (p.itens ?? []).map(nomeEs), referencia: p.referencia, cores, relacionados: relacionados(p, taxa) };
}

function relacionados(p: Produto, taxa: number) {
  const chave = p.nome.split(" ")[0];
  const out: CardProduto[] = [];
  for (const x of produtos()) {
    if (x.id === p.id || x.linha !== p.linha || !x.nome.startsWith(chave)) continue;
    const c = card(x, taxa);
    if (c) out.push(c);
    if (out.length >= 12) break;
  }
  return out;
}

// Búsqueda: cada palabra puede coincidir con sus sinónimos (español ↔ portugués del catálogo de origen)
const SINONIMOS: string[][] = [
  ["calza", "legging", "calca", "fuso"], ["remera", "camiseta", "camisa"], ["musculosa", "regata"],
  ["campera", "jaqueta", "casaco"], ["buzo", "moletom", "blusa"], ["short", "shorts", "bermuda"],
  // bikini: en el origen las piezas se venden por separado (top cortininha/faixa + tanga)
  ["bikini", "biquini", "cortininha", "faixa", "tanga"], ["malla", "sunga", "maio"], ["bombacha", "calcinha", "tanga"],
  ["corpino", "sutia", "top"], ["media", "meia", "medias", "meias"], ["botella", "garrafa", "squeeze"],
  ["gorro", "bone"], ["visera", "viseira"], ["bolso", "bolsa", "mochila"], ["enterito", "macacao", "macaquinho"],
  ["pollera", "saia"], ["mujer", "feminino", "feminina"], ["hombre", "masculino", "men"], ["nino", "nina", "kids", "infantil"],
  ["negro", "preto", "black", "noir"], ["blanco", "branco", "white"], ["gris", "cinza", "grey", "gray"],
  ["rosa", "pink"], ["azul", "blue", "navy"], ["verde", "green"], ["rojo", "vermelho", "red"],
];
function termosBusca(q: string): string[][] {
  return sem(q)
    .split(/\s+/)
    .filter((t) => t.length > 1)
    .map((t) => {
      // singular y masculino: "remeras" → "remera", "preta" → "pret"
      const raiz = t.length > 4 ? t.replace(/(es|s)$/, "") : t;
      const base = raiz.length > 4 ? raiz.replace(/[ao]$/, "") : raiz;
      const grupo = SINONIMOS.find((g) =>
        g.some((x) => x === t || x === raiz || (base.length > 3 && x.startsWith(base))),
      );
      return grupo ? [...new Set([raiz, ...grupo])] : [base.length > 3 ? base : t];
    });
}

// Sugerencias del buscador (mientras se escribe)
export async function sugerir(q: string) {
  if (sem(q).trim().length < 2) return { productos: [] as CardProduto[], total: 0 };
  const r = await listar({ q });
  return { productos: r.itens.slice(0, 6), total: r.total };
}

// Género para la búsqueda (las categorías del origen están mezcladas; solo se usa mujer/hombre/niños)
function generos(p: Produto) {
  return [FILTROS.mujer(p) && "mujer", FILTROS.hombre(p) && "hombre", FILTROS.ninos(p) && "ninos"].filter(Boolean).join(" ");
}

// Productos con stock para el sitemap
export function slugsProdutos() {
  const out: string[] = [];
  for (const p of produtos()) {
    const c = card(p, 1);
    if (c) out.push(c.slug);
  }
  return out;
}
