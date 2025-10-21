import type { GamePhase, Hypothesis } from "@/types";

// ============================================
// CONFIGURACIÓN DEL EVENTO
// ============================================

export const EVENT_CONFIG = {
  REVEAL_DATE: import.meta.env.VITE_REVEAL_DATE || "2025-10-26T19:00:00-03:00",
  MEET_LINK: import.meta.env.VITE_MEET_LINK || "",
  ADMIN_PASSWORD: import.meta.env.VITE_ADMIN_PASSWORD || "admin123",
};

// ============================================
// FASES DEL JUEGO
// ============================================

export const GAME_PHASES: GamePhase[] = [
  "intro",
  "hypothesis",
  "collider",
  "equation",
  "synthesis",
  "input",
  "confirmation",
  "submitted",
  "wall",
  "countdown",
  "reveal",
];

export const PHASE_TITLES: Record<GamePhase, string> = {
  intro: "Iniciando Protocolo BABY-REVEAL v1.0",
  hypothesis: "Formulación de Hipótesis",
  collider: "Fase 1: Colisionador de Partículas",
  equation: "Fase 2: Ecuación de Enlace Molecular",
  synthesis: "Fase 3: Síntesis Farmacéutica",
  input: "Registro de Datos del Experimento",
  confirmation: "Verificación de Predicción",
  submitted: "Predicción Registrada en Base de Datos",
  wall: "Muro de Predicciones Científicas",
  countdown: "Cuenta Regresiva al Colapso Cuántico",
  reveal: "Revelación del Resultado Experimental",
};

export const PHASE_DESCRIPTIONS: Record<GamePhase, string> = {
  intro:
    "Dos científicos han iniciado el experimento más importante de sus vidas...",
  hypothesis: "Selecciona tu predicción: ¿Variable XX estable o XY dominante?",
  collider:
    "Colisiona las partículas P (Físico) y Q (Química) en el momento exacto",
  equation: "Balancea la ecuación arrastrando elementos de física y química",
  synthesis: "Captura los ingredientes correctos para sintetizar el resultado",
  input: "Registra tu nombre científico y tu mensaje para el nuevo espécimen",
  confirmation: "Revisa tu predicción antes de enviarla a la base de datos",
  submitted: "Tu predicción ha sido almacenada correctamente",
  wall: "Consulta las predicciones de otros científicos",
  countdown: "Tiempo restante hasta la revelación del experimento",
  reveal: "El momento ha llegado. Observa el resultado del experimento",
};

// ============================================
// HIPÓTESIS
// ============================================

export const HYPOTHESIS_LABELS: Record<Hypothesis, string> = {
  XX: "Variable XX Estable",
  XY: "Variable XY Dominante",
};

export const HYPOTHESIS_FULL_LABELS: Record<Hypothesis, string> = {
  XX: "💗 Variable XX Estable (Niña)",
  XY: "💙 Variable XY Dominante (Niño)",
};

export const HYPOTHESIS_DESCRIPTIONS: Record<Hypothesis, string> = {
  XX: "Predicción de configuración cromosómica XX. Sistema estable con alta probabilidad de ternura molecular.",
  XY: "Predicción de configuración cromosómica XY. Sistema dinámico con energía cinética elevada.",
};

// ============================================
// PUNTUACIÓN
// ============================================

export const SCORE_CONFIG = {
  MAX_PER_GAME: 100,
  MAX_TOTAL: 300,
  PERFECT_THRESHOLD: 90, // 90+ es "perfecto"
  GOOD_THRESHOLD: 70, // 70-89 es "bueno"
  PASSING_THRESHOLD: 40, // 40-69 es "aceptable"
};

export const SCORE_MESSAGES = {
  PERFECT: [
    "¡COLISIÓN PERFECTA! Se ha detectado el Bosón de Higgs del Amor",
    "¡EXCELENTE! Tus cálculos cuánticos son impecables",
    "¡EXTRAORDINARIO! Nivel de precisión científica: 100%",
  ],
  GOOD: [
    "Colisión exitosa. Partículas fundidas con alta probabilidad",
    "Buen trabajo. El campo de Higgs está correctamente alineado",
    "Cálculos correctos. Energía de enlace estable detectada",
  ],
  PASSING: [
    "Colisión parcial. El campo está ligeramente perturbado",
    "Resultado aceptable. Requiere calibración adicional",
    "Dentro de los parámetros. Margen de error tolerable",
  ],
  FAILED: [
    "Partículas desviadas. Reiniciando el acelerador...",
    "Colisión fallida. Ajustando parámetros del experimento",
    "Resultado subóptimo. Se requiere otro intento",
  ],
};

// ============================================
// VALIDACIÓN
// ============================================

export const VALIDATION_RULES = {
  userName: {
    minLength: 2,
    maxLength: 50,
    pattern: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/,
    errorMessage: "Nombre debe tener 2-50 caracteres (solo letras)",
  },
  suggestedName: {
    minLength: 2,
    maxLength: 30,
    pattern: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/,
    errorMessage: "Nombre sugerido debe tener 2-30 caracteres",
  },
  message: {
    minLength: 10,
    maxLength: 500,
    errorMessage: "Mensaje debe tener 10-500 caracteres",
  },
};

// ============================================
// ANIMACIONES
// ============================================

export const ANIMATION_DURATIONS = {
  fast: 0.2,
  normal: 0.3,
  slow: 0.5,
  phase: 0.8,
};

export const ANIMATION_DELAYS = {
  stagger: 0.1,
  sequence: 0.2,
};

// ============================================
// SONIDOS
// ============================================

export const SOUND_PATHS = {
  collision: "/sounds/collision.mp3",
  bubbles: "/sounds/bubbles.mp3",
  laser: "/sounds/laser.mp3",
  success: "/sounds/success.mp3",
  reveal: "/sounds/reveal.mp3",
};

// ============================================
// TEXTOS CIENTÍFICOS
// ============================================

export const SCIENTIFIC_INTRO = `
En el universo conocido, dos fuerzas fundamentales están a punto de colisionar:

⚛️ La FÍSICA - Dominio de las partículas, la energía y el espacio-tiempo
🧪 La QUÍMICA - Reino de los enlaces, las reacciones y la materia

Cuando un Físico y una Química Farmacéutica unen sus campos cuánticos,
el resultado no puede calcularse con ecuaciones convencionales...

Solo puede REVELARSE.

EXPERIMENTO: SÍNTESIS HUMANA
ESTADO: En gestación
ENERGÍA DETECTADA: ∞ julios de amor puro

Inicializando protocolo de predicción...
`;

export const POST_REVEAL_MESSAGE = `
El experimento ha sido un éxito.

Todos los parámetros se encuentran dentro de los límites esperados.
La síntesis se ha completado satisfactoriamente.

Nivel de felicidad detectado: 100% estable.

Gracias por participar en este experimento científico.
`;

// ============================================
// FIRESTORE
// ============================================

export const FIRESTORE_COLLECTIONS = {
  PREDICTIONS: "predictions",
  EVENT: "event",
};

export const FIRESTORE_DOCS = {
  CONFIG: "config",
};

// ============================================
// MISC
// ============================================

export const GESTATION_PERIOD_DAYS = 280; // ~40 semanas
export const ENERGY_FORMULA_CONSTANT = 9.8e9; // julios de amor

export const ADMIN_ROUTE = "/admin";
export const HOME_ROUTE = "/";
