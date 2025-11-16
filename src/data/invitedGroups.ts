export interface InvitedGroup {
  id: string;
  mainGuest: string;
  companions: string[];
  isSpecial?: boolean;
}

export const INVITED_GROUPS: InvitedGroup[] = [
  {
    id: "jhonatan-gonzalez",
    mainGuest: "Jhonatan González",
    companions: ["Miroslava Kislinger"],
  },
  {
    id: "oscar-arocha",
    mainGuest: "Oscar Arocha",
    companions: ["Maite Esteves", "Auristela Parejo"],
  },
  {
    id: "douglas-bautista",
    mainGuest: "Douglas Bautista",
    companions: ["Kariana Cruz", "Xavier Bautista"],
  },
  {
    id: "katy-gonzalez",
    mainGuest: "Katy González",
    companions: [],
  },
  {
    id: "solsire-gatti",
    mainGuest: "Solsiré Gatti",
    companions: ["María Davis"],
  },
  {
    id: "darwin-rojas",
    mainGuest: "Darwin Rojas",
    companions: ["Robert Chapellin"],
  },
  {
    id: "william-carpio",
    mainGuest: "William Carpio",
    companions: [],
  },
  {
    id: "jesus-miguel-castillo",
    mainGuest: "Jesús Miguel Castillo",
    companions: ["Sarai Becerra", "hijo"],
  },
  {
    id: "romer-monsalve",
    mainGuest: "Romer Monsalve",
    companions: ["Saybeth Valenzuela"],
  },
  {
    id: "jose-angel-gil",
    mainGuest: "José Ángel Gil",
    companions: [],
  },
  {
    id: "alejandro-hidalgo",
    mainGuest: "Alejandro Hidalgo",
    companions: [],
  },
  {
    id: "juan-andres-avila",
    mainGuest: "Juan Andrés Ávila",
    companions: [],
  },
  {
    id: "yessert-duran",
    mainGuest: "Yessert Durán",
    companions: ["Camila Ruiz"],
  },
  {
    id: "tomas-uzcategui",
    mainGuest: "Tomás Uzcátegui",
    companions: ["Valentina Astudillo", "Isabel Uzcátegui"],
  },
  {
    id: "ibrahim-rojas",
    mainGuest: "Ibrahim Rojas",
    companions: ["Jolymar Acosta"],
  },
  {
    id: "alonso-salas",
    mainGuest: "Alonso Salas",
    companions: [],
  },
  {
    id: "gabriela-duque",
    mainGuest: "Gabriela Duque",
    companions: [],
  },
  {
    id: "leizer-gonzalez",
    mainGuest: "Leizer González",
    companions: ["María Mendoza", "Beatriz Anzola", "Ana Paula González"],
  },
  {
    id: "senaid-bechara",
    mainGuest: "Senaid Bechara",
    companions: [],
  },
  {
    id: "jessaid-bechara",
    mainGuest: "Jessaid Bechara",
    companions: ["Alma"],
  },
  {
    id: "jean-moscoso",
    mainGuest: "Jean Moscoso",
    companions: [],
  },
  // Data Especial
  {
    id: "yngrid-boulanger",
    mainGuest: "Yngrid Boulanger",
    companions: [],
    isSpecial: true,
  },
  {
    id: "luisa-suarez",
    mainGuest: "Luisa Suárez",
    companions: [],
    isSpecial: true,
  },
  {
    id: "ruth-perez",
    mainGuest: "Ruth Pérez",
    companions: [],
    isSpecial: true,
  },
  {
    id: "vania-rebolledo",
    mainGuest: "Vania Rebolledo",
    companions: [],
    isSpecial: true,
  },
];

export const NON_ATTENDING_GUESTS = [
  "Héctor Arturo Escalante",
  "Úrsula Pérez",
  "Samuel Suárez",
  "Adrián Escalante",
  "Samantha Suárez",
  "Victoria Duque",
  "Andrés Duque",
  "Camila Contreras",
  "Héctor Leonardo Escalante",
  "Marzia Escalante",
  "José Rafael Pérez",
  "Yngrid Hernández",
  "Eric González",
  "Andrea Mendoza",
  "Daniela Velásquez",
];
