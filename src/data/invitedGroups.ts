export interface InvitedGroup {
  id: string;
  mainGuest: string;
  companions: string[];
  isSpecial?: boolean;
  isMemoryOnly?: boolean;
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
  // 6 Familiares de sangre
  {
    id: "jose-godoy",
    mainGuest: "José Godoy",
    companions: [],
  },
  {
    id: "ana-preciado",
    mainGuest: "Ana Preciado",
    companions: [],
  },
  {
    id: "sasha-godoy",
    mainGuest: "Sasha Godoy",
    companions: [],
  },
  {
    id: "sebastian-cortez",
    mainGuest: "Sebastián Cortez",
    companions: [],
  },
  {
    id: "anabel-godoy",
    mainGuest: "Anabel Godoy",
    companions: [],
  },
  {
    id: "leonardo-duque",
    mainGuest: "Leonardo Duque",
    companions: [],
  },
  // 6 Invitados nuevos
  {
    id: "ivanna-cabrera",
    mainGuest: "Ivanna Cabrera",
    companions: [],
  },
  {
    id: "denisse-palma",
    mainGuest: "Denisse Palma",
    companions: [],
  },
  {
    id: "elizabeth-miguel",
    mainGuest: "Elizabeth Miguel",
    companions: [],
  },
  {
    id: "eliana-vega",
    mainGuest: "Eliana Vega",
    companions: [],
  },
  {
    id: "kathia-cifuentes",
    mainGuest: "Kathia Cifuentes",
    companions: [],
  },
  {
    id: "javiera-barra",
    mainGuest: "Javiera Barra",
    companions: [],
  },
  // Grupo Recuerdo (27 personas)
  {
    id: "hector-arturo-escalante",
    mainGuest: "Hector Arturo Escalante",
    companions: [],
    isMemoryOnly: true,
  },
  {
    id: "ursula-perez",
    mainGuest: "Ursula Pérez",
    companions: [],
    isMemoryOnly: true,
  },
  {
    id: "samuel-suarez",
    mainGuest: "Samuel Suárez",
    companions: [],
    isMemoryOnly: true,
  },
  {
    id: "adrian-escalante",
    mainGuest: "Adrián Escalante",
    companions: [],
    isMemoryOnly: true,
  },
  {
    id: "samantha-suarez",
    mainGuest: "Samantha Suárez",
    companions: [],
    isMemoryOnly: true,
  },
  {
    id: "victoria-duque",
    mainGuest: "Victoria Duque",
    companions: [],
    isMemoryOnly: true,
  },
  {
    id: "andres-duque",
    mainGuest: "Andrés Duque",
    companions: [],
    isMemoryOnly: true,
  },
  {
    id: "camila-contreras",
    mainGuest: "Camila Contreras",
    companions: [],
    isMemoryOnly: true,
  },
  {
    id: "hector-leonardo-escalante",
    mainGuest: "Hector Leonardo Escalante",
    companions: [],
    isMemoryOnly: true,
  },
  {
    id: "marzia-escalante",
    mainGuest: "Marzia Escalante",
    companions: [],
    isMemoryOnly: true,
  },
  {
    id: "jose-rafael-perez",
    mainGuest: "José Rafael Pérez",
    companions: [],
    isMemoryOnly: true,
  },
  {
    id: "yngrid-hernandez",
    mainGuest: "Yngrid Hernández",
    companions: [],
    isMemoryOnly: true,
  },
  {
    id: "eric-gonzalez",
    mainGuest: "Eric González",
    companions: [],
    isMemoryOnly: true,
  },
  {
    id: "andrea-mendoza",
    mainGuest: "Andrea Mendoza",
    companions: [],
    isMemoryOnly: true,
  },
  {
    id: "daniela-velasquez",
    mainGuest: "Daniela Velásquez",
    companions: [],
    isMemoryOnly: true,
  },
  {
    id: "frederick-pena",
    mainGuest: "Frederick Peña",
    companions: [],
    isMemoryOnly: true,
  },
  {
    id: "yaremith-martinez",
    mainGuest: "Yaremith Martínez",
    companions: [],
    isMemoryOnly: true,
  },
  {
    id: "jose-angel-perez",
    mainGuest: "José Ángel Pérez",
    companions: [],
    isMemoryOnly: true,
  },
  {
    id: "jose-carlos-perez",
    mainGuest: "José Carlos Pérez",
    companions: [],
    isMemoryOnly: true,
  },
  {
    id: "christopher-suarez",
    mainGuest: "Christopher Suárez",
    companions: [],
    isMemoryOnly: true,
  },
  {
    id: "sabrina-suarez",
    mainGuest: "Sabrina Suárez",
    companions: [],
    isMemoryOnly: true,
  },
  {
    id: "david-contreras",
    mainGuest: "David Contreras",
    companions: [],
    isMemoryOnly: true,
  },
  {
    id: "deivi-pena",
    mainGuest: "Deivi Peña",
    companions: [],
    isMemoryOnly: true,
  },
  {
    id: "emilio-montilla",
    mainGuest: "Emilio Montilla",
    companions: [],
    isMemoryOnly: true,
  },
  {
    id: "oliver-rodriguez",
    mainGuest: "Oliver Rodríguez",
    companions: [],
    isMemoryOnly: true,
  },
  {
    id: "arturo-castillo",
    mainGuest: "Arturo Castillo",
    companions: [],
    isMemoryOnly: true,
  },
  {
    id: "rita-ledezma",
    mainGuest: "Rita Ledezma",
    companions: [],
    isMemoryOnly: true,
  },
];
