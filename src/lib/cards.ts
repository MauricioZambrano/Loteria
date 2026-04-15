export interface Card {
  id: number;
  name: string;
  slug: string; // matches filename: public/cards/{padded-id}-{slug}.png
}

// Ordered to match gomflo/barajas-loteria-mexicana (Don Clemente Gallo deck)
export const LOTERIA_CARDS: Card[] = [
  { id: 1,  name: "El Gallo",        slug: "el-gallo" },
  { id: 2,  name: "El Diablito",     slug: "el-diablito" },
  { id: 3,  name: "La Dama",         slug: "la-dama" },
  { id: 4,  name: "El Catrín",       slug: "el-catrin" },
  { id: 5,  name: "El Paraguas",     slug: "el-paraguas" },
  { id: 6,  name: "La Sirena",       slug: "la-sirena" },
  { id: 7,  name: "La Escalera",     slug: "la-escalera" },
  { id: 8,  name: "La Botella",      slug: "la-botella" },
  { id: 9,  name: "El Barril",       slug: "el-barril" },
  { id: 10, name: "El Árbol",        slug: "el-arbol" },
  { id: 11, name: "El Melón",        slug: "el-melon" },
  { id: 12, name: "El Valiente",     slug: "el-valiente" },
  { id: 13, name: "El Gorrito",      slug: "el-gorrito" },
  { id: 14, name: "La Muerte",       slug: "la-muerte" },
  { id: 15, name: "La Pera",         slug: "la-pera" },
  { id: 16, name: "La Bandera",      slug: "la-bandera" },
  { id: 17, name: "El Bandolón",     slug: "el-bandolon" },
  { id: 18, name: "El Violoncello",  slug: "el-violoncello" },
  { id: 19, name: "La Garza",        slug: "la-garza" },
  { id: 20, name: "El Pájaro",       slug: "el-pajaro" },
  { id: 21, name: "La Mano",         slug: "la-mano" },
  { id: 22, name: "La Bota",         slug: "la-bota" },
  { id: 23, name: "La Luna",         slug: "la-luna" },
  { id: 24, name: "El Cotorro",      slug: "el-cotorro" },
  { id: 25, name: "El Borracho",     slug: "el-borracho" },
  { id: 26, name: "El Negrito",      slug: "el-negrito" },
  { id: 27, name: "El Corazón",      slug: "el-corazon" },
  { id: 28, name: "La Sandía",       slug: "la-sandia" },
  { id: 29, name: "El Tambor",       slug: "el-tambor" },
  { id: 30, name: "El Camarón",      slug: "el-camaron" },
  { id: 31, name: "Las Jaras",       slug: "las-jaras" },
  { id: 32, name: "El Músico",       slug: "el-musico" },
  { id: 33, name: "La Araña",        slug: "la-arana" },
  { id: 34, name: "El Soldado",      slug: "el-soldado" },
  { id: 35, name: "La Estrella",     slug: "la-estrella" },
  { id: 36, name: "El Cazo",         slug: "el-cazo" },
  { id: 37, name: "El Mundo",        slug: "el-mundo" },
  { id: 38, name: "El Apache",       slug: "el-apache" },
  { id: 39, name: "El Nopal",        slug: "el-nopal" },
  { id: 40, name: "El Alacrán",      slug: "el-alacran" },
  { id: 41, name: "La Rosa",         slug: "la-rosa" },
  { id: 42, name: "La Calavera",     slug: "la-calavera" },
  { id: 43, name: "La Campana",      slug: "la-campana" },
  { id: 44, name: "El Cantarito",    slug: "el-cantarito" },
  { id: 45, name: "El Venado",       slug: "el-venado" },
  { id: 46, name: "El Sol",          slug: "el-sol" },
  { id: 47, name: "La Corona",       slug: "la-corona" },
  { id: 48, name: "La Chalupa",      slug: "la-chalupa" },
  { id: 49, name: "El Pino",         slug: "el-pino" },
  { id: 50, name: "El Pescado",      slug: "el-pescado" },
  { id: 51, name: "La Palma",        slug: "la-palma" },
  { id: 52, name: "La Maceta",       slug: "la-maceta" },
  { id: 53, name: "El Arpa",         slug: "el-arpa" },
  { id: 54, name: "La Rana",         slug: "la-rana" },
];

export const CARD_BY_ID = new Map<number, Card>(
  LOTERIA_CARDS.map((c) => [c.id, c])
);

export function getCardImagePath(card: Card): string {
  return `/cards/${String(card.id).padStart(2, "0")}-${card.slug}.png`;
}
