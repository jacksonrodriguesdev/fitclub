// Traducción portugués → español (Uruguay) de nombres de productos y colores del catálogo de origen.
// Reemplazo por palabra entera, sin tocar marcas ni nombres propios de colección.
const PALABRAS: [RegExp, string][] = [
  ["meia sapatilha", "Media invisible"], ["sap. invisivel", "invisible"], ["t-shirt", "Remera"], ["protetor solar", "Protector solar"], ["shampoo em pó", "Shampoo en polvo"],
  ["proteção e resistência", "Protección y resistencia"], ["pronta em 2 passos", "Lista en 2 pasos"], ["casal que treina junto", "Pareja que entrena junta"],
  ["bochecha corada", "Mejillas rosadas"], ["quero todos", "Los quiero todos"], ["dupla", "Dúo"], ["limpeza", "Limpieza"],
  ["cabelo e rosto", "Pelo y rostro"], ["cabelo", "Pelo"], ["rosto", "Rostro"], ["máscara de cílios", "Máscara de pestañas"],
  ["lápis para olhos", "Lápiz de ojos"], ["lápis batom labial", "Lápiz labial"], ["sombra cremosa", "Sombra cremosa"],
  ["cera para cabelo modeladora", "Cera modeladora para el pelo"], ["antiatrito", "Antifricción"], ["corporal e facial", "Corporal y facial"],
  ["facial", "Facial"], ["bifásico", "Bifásico"], ["iluminador", "Iluminador"], ["pó compacto", "Polvo compacto"],
  ["antioleosidade e antiacne", "Antigrasa y antiacné"], ["fluido", "Fluido"], ["multifuncional", "Multifunción"],
  ["preta", "Negra"], ["olhos", "Ojos"], ["kit", "Kit"], ["camisetas e regatas", "Remeras y musculosas"], ["cano extra longo", "Caña extra larga"],
  ["faixa de cabelo", "Vincha"], ["pochete", "Riñonera"], ["garrafinha", "Botella"], ["caneca", "Taza"],
  ["manguito", "Mangas"], ["sapatilha", "Media invisible"], ["impermeável", "Impermeable"], ["com bojo", "con relleno"],
  ["canelado", "Acanalado"], ["canelada", "Acanalada"], ["alongado", "Largo"], ["selada", "Termosellada"],
  ["duplo", "Doble"], ["estampa", "Estampado"], ["masculina", "Hombre"], ["feminina", "Mujer"],
  ["tapa bumbum", "Cubre cola"], ["proteção", "Protección"], ["térmica", "Térmica"], ["térmico", "Térmico"],
  ["calça fusô", "Calza"], ["calca fuso", "Calza"], ["calça legging", "Calza"],
  ["calça", "Pantalón"], ["calca", "Pantalón"], ["fusô", "Calza"], ["legging", "Calza"],
  ["cano curto", "Caña corta"], ["cano médio", "Caña media"], ["cano longo", "Caña larga"],
  ["fio dental", "Hilo dental"], ["fio", "Hilo"], ["alça", "Bretel"], ["alças", "Breteles"],
  ["regulável", "Regulable"], ["estampada", "Estampada"], ["listrada", "Rayada"], ["básica", "Básica"],
  ["bermuda", "Bermuda"], ["shorts", "Short"], ["short", "Short"], ["saia", "Pollera"],
  ["macaquinho", "Enterito corto"], ["macacão", "Enterito"], ["body", "Body"],
  ["regata", "Musculosa"], ["camiseta", "Remera"], ["blusa", "Blusa"], ["moletom", "Buzo"],
  ["jaqueta", "Campera"], ["casaco", "Abrigo"], ["colete", "Chaleco"], ["corta-vento", "Rompevientos"],
  ["biquíni", "Bikini"], ["biquini", "Bikini"], ["maiô", "Malla entera"], ["maio", "Malla entera"],
  ["tanga", "Bombacha"], ["calcinha", "Bombacha"], ["sutiã", "Corpiño"], ["cueca", "Calzoncillo"],
  ["sunga", "Malla"], ["saída de praia", "Salida de playa"], ["saida de praia", "Salida de playa"],
  ["meia", "Media"], ["meias", "Medias"], ["garrafa", "Botella"], ["viseira", "Visera"], ["boné", "Gorro"],
  ["bolsa", "Bolso"], ["necessaire", "Neceser"], ["toalha", "Toalla"], ["tênis", "Championes"],
  ["infantil", "Niños"], ["masculino", "Hombre"], ["feminino", "Mujer"], ["unissex", "Unisex"],
  ["cintura alta", "Tiro alto"], ["alta compressão", "Alta compresión"], ["compressão", "Compresión"],
  ["sem costura", "Sin costuras"], ["com", "con"], ["sem", "sin"], ["e", "y"], ["de", "de"],
  ["manga longa", "Manga larga"], ["manga curta", "Manga corta"], ["cropped", "Cropped"],
  ["frente", "Frente"], ["costas", "Espalda"], ["bolso", "Bolsillo"], ["bolsos", "Bolsillos"],
].map(([pt, es]) => [new RegExp(`(?<![\\p{L}])${pt.replace(/[-]/g, "[-]")}(?![\\p{L}])`, "giu"), es]);

const COLORES: Record<string, string> = {
  preto: "Negro", branco: "Blanco", cinza: "Gris", azul: "Azul", "azul marinho": "Azul marino",
  vermelho: "Rojo", rosa: "Rosa", verde: "Verde", amarelo: "Amarillo", laranja: "Naranja",
  roxo: "Violeta", lilás: "Lila", marrom: "Marrón", bege: "Beige", vinho: "Bordó", nude: "Nude",
  estampado: "Estampado", mescla: "Melange", "cinza mescla": "Gris melange",
  preta: "Negro", branca: "Blanco", grafite: "Grafito", marinho: "Azul marino", "marinho índigo": "Índigo",
  canela: "Canela", carmim: "Carmín", "açaí": "Açaí", oliva: "Oliva", ameixa: "Ciruela", noz: "Nuez",
  "cerâmica": "Cerámica", anil: "Añil", "mescla grafite": "Grafito melange", "damasco claro": "Damasco claro",
  vermelha: "Roja", amarela: "Amarilla", "rosa claro": "Rosa claro", "azul claro": "Azul claro",
  "verde militar": "Verde militar", "off white": "Crudo", chumbo: "Plomo", "cinza claro": "Gris claro",
  "cinza escuro": "Gris oscuro", "lunar grey": "Gris lunar", terracota: "Terracota", mostarda: "Mostaza",
  areia: "Arena", "café": "Café", caramelo: "Caramelo", lavanda: "Lavanda", coral: "Coral", pink: "Rosa",
};

const capitalizar = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

export function nomeEs(nome: string) {
  let s = nome;
  for (const [re, es] of PALABRAS) {
    s = s.replace(re, (m, off: number) => (off === 0 || /^[A-ZÀ-Ú]/.test(m) ? capitalizar(es) : es.toLowerCase()));
  }
  return s;
}

export function corEs(cor: string) {
  return COLORES[cor.trim().toLowerCase()] ?? cor;
}
