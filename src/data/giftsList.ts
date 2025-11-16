export interface Gift {
  id: string;
  name: string;
  maxCount: number;
  isUnique: boolean;
}

export const GIFTS_LIST: Gift[] = [
  {
    id: "panales-rn-pampers",
    name: "Pañales RN paquete 36 'Pampers'",
    maxCount: 7,
    isUnique: false,
  },
  {
    id: "panales-p-pampers",
    name: "Pañales Talla P 'Pampers'",
    maxCount: 20,
    isUnique: false,
  },
  {
    id: "panales-m-pampers",
    name: "Pañales Talla M 'Pampers'",
    maxCount: 20,
    isUnique: false,
  },
  {
    id: "toallitas-sin-perfume",
    name: "Toallitas sin perfume",
    maxCount: 5,
    isUnique: false,
  },
  {
    id: "bodies-algodon-0-3m",
    name: "Bodies de algodón 0-3 meses",
    maxCount: 5,
    isUnique: false,
  },
  {
    id: "pijamas-0-3m",
    name: "Pijamas 0-3 meses",
    maxCount: 10,
    isUnique: false,
  },
  {
    id: "gorritos-calcetines-0-3m",
    name: "Gorritos suaves + calcetines 0-3 meses",
    maxCount: 10,
    isUnique: false,
  },
  {
    id: "sabanas-cuna-colecho",
    name: "Sábanas ajustables para cuna colecho",
    maxCount: 5,
    isUnique: false,
  },
  {
    id: "baberos",
    name: "Baberos",
    maxCount: 5,
    isUnique: false,
  },
  {
    id: "extractor-leche-haakaa",
    name: "Extractor de leche 'recolector tipo Haakaa'",
    maxCount: 1,
    isUnique: true,
  },
  {
    id: "toallas-con-capucha",
    name: "Toallas con capucha",
    maxCount: 3,
    isUnique: false,
  },
  {
    id: "termometro-digital",
    name: "Termómetro digital para guagua",
    maxCount: 1,
    isUnique: true,
  },
  {
    id: "kit-lima-tijeras",
    name: "Kit Lima y tijeras de uñas para bebé",
    maxCount: 1,
    isUnique: true,
  },
  {
    id: "aspirador-nasal",
    name: "Aspirador nasal",
    maxCount: 1,
    isUnique: true,
  },
  {
    id: "juguetes-sensoriales-0-3m",
    name: "Set de juguetes sensoriales 0-3 meses",
    maxCount: 4,
    isUnique: false,
  },
  {
    id: "fular",
    name: "Fular",
    maxCount: 1,
    isUnique: true,
  },
  {
    id: "mantas-bebe",
    name: "Mantas de bebé",
    maxCount: 5,
    isUnique: false,
  },
];
