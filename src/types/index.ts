import type { Timestamp } from "firebase/firestore";

// ============================================
// ENTIDADES PRINCIPALES
// ============================================

/**
 * Predicción de un usuario
 */
export interface Prediction {
  id: string;
  userName: string;
  hypothesis: Hypothesis;
  suggestedName: string;
  message: string;
  scores: GameScores;
  timestamp: number; // Timestamp en milisegundos
  userAgent?: string; // Para prevenir duplicados
}

/**
 * Tipo de hipótesis
 */
export type Hypothesis = "XX" | "XY"; // XX = Niña, XY = Niño

/**
 * Puntuaciones de los 3 minijuegos
 */
export interface GameScores {
  collider: number; // 0-100 puntos Fase 1
  equation: number; // 0-100 puntos Fase 2
  synthesis: number; // 0-100 puntos Fase 3
  total: number; // Suma total (0-300)
}

/**
 * Configuración del evento (en Firestore)
 */
export interface EventConfig {
  revealDate: number; // Timestamp del reveal
  isRevealed: boolean;
  actualResult: Hypothesis | null;
  babyName: string | null;
  meetLink: string;
  stats: EventStats;
}

/**
 * Estadísticas globales del evento
 */
export interface EventStats {
  totalPredictions: number;
  xxCount: number; // Cuántos dijeron niña
  xyCount: number; // Cuántos dijeron niño
  xxPercentage: number; // Calculado
  xyPercentage: number; // Calculado
  averageScore: number;
  topNames: NameCount[]; // Top 5 nombres más sugeridos
  lastUpdated: number;
}

/**
 * Contador de nombres
 */
export interface NameCount {
  name: string;
  count: number;
}

// ============================================
// ESTADOS DE LA APLICACIÓN (Zustand Store)
// ============================================

/**
 * Estado global de la aplicación
 */
export interface AppState {
  // Configuración del evento
  eventConfig: EventConfig | null;

  // Datos del usuario actual (antes de enviar)
  currentPrediction: Partial<Prediction> | null;

  // Fase actual del juego
  currentPhase: GamePhase;

  // Todas las predicciones (para admin y muro)
  allPredictions: Prediction[];

  // Estado de carga
  isLoading: boolean;
  error: string | null;

  // Acciones
  setEventConfig: (config: EventConfig) => void;
  setCurrentPrediction: (prediction: Partial<Prediction>) => void;
  setCurrentPhase: (phase: GamePhase) => void;
  updateScore: (phase: keyof GameScores, score: number) => void;
  submitPrediction: () => Promise<void>;
  fetchPredictions: () => Promise<void>;
}

/**
 * Fases del juego
 */
export type GamePhase =
  | "intro" // Pantalla de bienvenida
  | "hypothesis" // Selección de hipótesis XX/XY
  | "collider" // Minijuego 1: Colisionador de partículas
  | "equation" // Minijuego 2: Ecuación de enlace
  | "synthesis" // Minijuego 3: Síntesis farmacéutica
  | "input" // Input de nombre y mensaje
  | "confirmation" // Confirmación antes de enviar
  | "submitted" // Ya enviado, mostrar resumen
  | "wall" // Muro de predicciones
  | "countdown" // Vista de countdown
  | "reveal"; // Animación de reveal

// ============================================
// DATOS DE FIREBASE (Firestore)
// ============================================

/**
 * Estructura de documento en Firestore
 */
export interface FirestorePrediction {
  userName: string;
  hypothesis: Hypothesis;
  suggestedName: string;
  message: string;
  scores: GameScores;
  timestamp: Timestamp;
  userAgent: string;
}

/**
 * Estructura del documento de configuración
 */
export interface FirestoreEventConfig {
  revealDate: Timestamp;
  isRevealed: boolean;
  actualResult: Hypothesis | null;
  babyName: string | null;
  meetLink: string;
  stats: EventStats;
}

// ============================================
// PROPS DE COMPONENTES
// ============================================

/**
 * Props del componente de computadora espacial (HUD)
 */
export interface SpaceComputerProps {
  gestationPercentage: number; // 0-100
  energyLevel: number; // En julios (calculado)
  successProbability: number; // 0-100
  countdown: CountdownData;
  phase?: GamePhase;
}

/**
 * Datos del countdown
 */
export interface CountdownData {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isExpired: boolean;
  totalSeconds: number;
}

/**
 * Props del componente de hipótesis
 */
export interface HypothesisSelectorProps {
  selected: Hypothesis | null;
  onSelect: (hypothesis: Hypothesis) => void;
  disabled?: boolean;
}

/**
 * Props de los minijuegos
 */
export interface GameProps {
  onComplete: (score: number) => void;
  onSkip?: () => void;
}

/**
 * Props del muro de predicciones
 */
export interface PredictionWallProps {
  predictions: Prediction[];
  actualResult?: Hypothesis;
  showScores?: boolean;
  highlightCorrect?: boolean;
}

/**
 * Props del panel admin
 */
export interface AdminPanelProps {
  predictions: Prediction[];
  eventConfig: EventConfig;
  onActivateReveal: (result: Hypothesis, babyName: string) => Promise<void>;
  onExportJSON: () => void;
  onExportCSV: () => void;
}

// ============================================
// UTILIDADES
// ============================================

/**
 * Resultado de una operación asíncrona
 */
export interface Result<T> {
  success: boolean;
  data?: T;
  error?: string;
}

/**
 * Opciones para exportar datos
 */
export interface ExportOptions {
  format: "json" | "csv";
  filename?: string;
  fields?: string[]; // Campos a incluir (para CSV)
}

// ============================================
// BABY SHOWER
// ============================================

export interface Attendee {
  name: string;
  rut: string;
  attending: boolean;
}

export interface SelectedGift {
  id: string;
  name: string;
  quantity: number;
}

export interface BabyShowerConfirmation {
  id?: string;
  groupId: string;
  mainGuestName: string;
  attendees: Attendee[];
  gifts: SelectedGift[];
  specialCompanion?: {
    name: string;
    rut: string;
    attending: boolean;
  };
  allDeclined: boolean;
  timestamp: number;
}

export interface GiftStock {
  id: string;
  name: string;
  maxCount: number;
  currentCount: number;
  isUnique: boolean;
}

/**
 * Grupo de invitados (viene de invitedGroups.ts)
 */
export interface InvitedGroup {
  id: string;
  mainGuest: string;
  companions: string[];
  isSpecial?: boolean;
  isMemoryOnly?: boolean;
}

/**
 * Gift base (viene de giftsList.ts)
 */
export interface Gift {
  id: string;
  name: string;
  maxCount: number;
  isUnique: boolean;
}

// ============================================
// CONSTANTES
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
];

export const MAX_SCORE_PER_GAME = 100;
export const MAX_TOTAL_SCORE = 300;

export const HYPOTHESIS_LABELS: Record<Hypothesis, string> = {
  XX: "Variable XX Estable (Niña) 💗",
  XY: "Variable XY Dominante (Niño) 💙",
};

export const PHASE_TITLES: Record<GamePhase, string> = {
  intro: "Iniciando Protocolo",
  hypothesis: "Formulación de Hipótesis",
  collider: "Fase 1: Colisionador de Partículas",
  equation: "Fase 2: Ecuación de Enlace",
  synthesis: "Fase 3: Síntesis Molecular",
  input: "Registro de Datos",
  confirmation: "Verificación de Predicción",
  submitted: "Predicción Registrada",
  wall: "Base de Datos de Predicciones",
  countdown: "Tiempo Restante",
  reveal: "Colapso de Función de Onda",
};

// ============================================
// VALIDACIONES
// ============================================

/**
 * Schema de validación para predicción
 */
export const PredictionSchema = {
  userName: {
    minLength: 2,
    maxLength: 50,
    required: true,
    pattern: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/,
  },
  suggestedName: {
    minLength: 2,
    maxLength: 30,
    required: true,
    pattern: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/,
  },
  message: {
    minLength: 10,
    maxLength: 500,
    required: true,
  },
  hypothesis: {
    required: true,
    enum: ["XX", "XY"],
  },
};

/**
 * Función de validación
 */
export function validatePrediction(prediction: Partial<Prediction>): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  // Validar nombre de usuario
  if (!prediction.userName || prediction.userName.length < 2) {
    errors.push("El nombre debe tener al menos 2 caracteres");
  }

  // Validar hipótesis
  if (!prediction.hypothesis) {
    errors.push("Debes seleccionar una hipótesis");
  }

  // Validar nombre sugerido
  if (!prediction.suggestedName || prediction.suggestedName.length < 2) {
    errors.push("El nombre sugerido debe tener al menos 2 caracteres");
  }

  // Validar mensaje
  if (!prediction.message || prediction.message.length < 10) {
    errors.push("El mensaje debe tener al menos 10 caracteres");
  }

  // Validar puntuaciones
  if (!prediction.scores || prediction.scores.total === 0) {
    errors.push("Debes completar los minijuegos");
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
