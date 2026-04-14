export interface Card {
  id: number;
  name: string;
  slug: string;
}

// Standard Don Clemente Gallo deck — verify numbering matches your physical deck
export const LOTERIA_CARDS: Card[] = [
  { id: 1,  name: "El Gallo",       slug: "el-gallo" },
  { id: 2,  name: "El Diablito",    slug: "el-diablito" },
  { id: 3,  name: "La Dama",        slug: "la-dama" },
  { id: 4,  name: "El Catrín",      slug: "el-catrin" },
  { id: 5,  name: "El Paraguas",    slug: "el-paraguas" },
  { id: 6,  name: "La Sirena",      slug: "la-sirena" },
  { id: 7,  name: "La Escalera",    slug: "la-escalera" },
  { id: 8,  name: "La Botella",     slug: "la-botella" },
  { id: 9,  name: "El Barril",      slug: "el-barril" },
  { id: 10, name: "El Árbol",       slug: "el-arbol" },
  { id: 11, name: "El Melón",       slug: "el-melon" },
  { id: 12, name: "El Valiente",    slug: "el-valiente" },
  { id: 13, name: "El Gordo",       slug: "el-gordo" },
  { id: 14, name: "La Rosa",        slug: "la-rosa" },
  { id: 15, name: "La Calavera",    slug: "la-calavera" },
  { id: 16, name: "La Campana",     slug: "la-campana" },
  { id: 17, name: "El Cantarito",   slug: "el-cantarito" },
  { id: 18, name: "El Venado",      slug: "el-venado" },
  { id: 19, name: "El Sol",         slug: "el-sol" },
  { id: 20, name: "La Corona",      slug: "la-corona" },
  { id: 21, name: "La Chalupa",     slug: "la-chalupa" },
  { id: 22, name: "El Alacrán",     slug: "el-alacran" },
  { id: 23, name: "El Músico",      slug: "el-musico" },
  { id: 24, name: "La Araña",       slug: "la-arana" },
  { id: 25, name: "El Soldado",     slug: "el-soldado" },
  { id: 26, name: "La Estrella",    slug: "la-estrella" },
  { id: 27, name: "El Cazo",        slug: "el-cazo" },
  { id: 28, name: "El Mundo",       slug: "el-mundo" },
  { id: 29, name: "El Apache",      slug: "el-apache" },
  { id: 30, name: "El Nopal",       slug: "el-nopal" },
  { id: 31, name: "La Palma",       slug: "la-palma" },
  { id: 32, name: "La Maceta",      slug: "la-maceta" },
  { id: 33, name: "El Arpa",        slug: "el-arpa" },
  { id: 34, name: "El Borracho",    slug: "el-borracho" },
  { id: 35, name: "El Bandolón",    slug: "el-bandolon" },
  { id: 36, name: "El Violoncello", slug: "el-violoncello" },
  { id: 37, name: "La Garza",       slug: "la-garza" },
  { id: 38, name: "El Pájaro",      slug: "el-pajaro" },
  { id: 39, name: "La Mano",        slug: "la-mano" },
  { id: 40, name: "La Bota",        slug: "la-bota" },
  { id: 41, name: "El Corazón",     slug: "el-corazon" },
  { id: 42, name: "La Sandía",      slug: "la-sandia" },
  { id: 43, name: "El Tambor",      slug: "el-tambor" },
  { id: 44, name: "El Camarón",     slug: "el-camaron" },
  { id: 45, name: "Las Jaras",      slug: "las-jaras" },
  { id: 46, name: "La Pera",        slug: "la-pera" },
  { id: 47, name: "La Bandera",     slug: "la-bandera" },
  { id: 48, name: "El Cotorro",     slug: "el-cotorro" },
  { id: 49, name: "El Colmillo",    slug: "el-colmillo" },
  { id: 50, name: "La Muerte",      slug: "la-muerte" },
  { id: 51, name: "La Luna",        slug: "la-luna" },
  { id: 52, name: "El Sombrero",    slug: "el-sombrero" },
  { id: 53, name: "La Negra",       slug: "la-negra" },
  { id: 54, name: "El Apache",      slug: "el-apache-2" },
];

export const CARD_BY_ID = new Map<number, Card>(
  LOTERIA_CARDS.map((c) => [c.id, c])
);
