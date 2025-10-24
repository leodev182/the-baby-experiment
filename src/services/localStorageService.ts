import type { Hypothesis, GameScores } from "@/types";
import type { Timestamp } from "firebase/firestore";

/**
 * Estructura del borrador (draft) en localStorage
 */
export interface PredictionDraft {
  userId: string;
  hypothesis: Hypothesis | null;
  userName: string;
  suggestedName: string;
  message: string;
  scores: GameScores;
  timestamp?: number | Timestamp;
}

const STORAGE_KEY = "baby_experiment_prediction_draft";

/**
 * Inicializa un nuevo draft con userId único
 */
export function initializeDraft(): PredictionDraft {
  const userId = `user_${Date.now()}_${Math.random()
    .toString(36)
    .substr(2, 9)}`;

  const draft: PredictionDraft = {
    userId,
    hypothesis: null,
    userName: "",
    suggestedName: "",
    message: "",
    scores: {
      collider: 0,
      equation: 0,
      synthesis: 0,
      total: 0,
    },
    timestamp: Date.now(),
  };

  localStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
  console.log("📝 Draft inicializado:", userId);
  return draft;
}

/**
 * Obtiene el draft actual del localStorage
 * Si no existe, lo inicializa
 */
export function getDraft(): PredictionDraft {
  const data = localStorage.getItem(STORAGE_KEY);

  if (!data) {
    console.log("ℹ️ No hay draft, creando uno nuevo");
    return initializeDraft();
  }

  try {
    const draft = JSON.parse(data) as PredictionDraft;
    console.log("✅ Draft cargado:", draft.userId);
    return draft;
  } catch (error) {
    console.error("❌ Error parseando draft, creando uno nuevo:", error);
    return initializeDraft();
  }
}

/**
 * Actualiza la hipótesis en el draft
 */
export function updateHypothesis(hypothesis: Hypothesis): void {
  const draft = getDraft();
  draft.hypothesis = hypothesis;
  draft.timestamp = Date.now();

  localStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
  console.log(`📝 Hipótesis guardada en localStorage: ${hypothesis}`);
}

/**
 * Actualiza los datos personales en el draft
 */
export function updatePersonalData(
  userName: string,
  suggestedName: string,
  message: string
): void {
  const draft = getDraft();

  draft.userName = userName;
  draft.suggestedName = suggestedName;
  draft.message = message;
  draft.timestamp = Date.now();

  localStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
  console.log("📝 Datos personales guardados en localStorage");
}

/**
 * Actualiza el score de un juego específico
 */
export function updateGameScore(
  game: keyof Omit<GameScores, "total">,
  score: number
): void {
  const draft = getDraft();

  draft.scores[game] = score;
  draft.scores.total =
    draft.scores.collider + draft.scores.equation + draft.scores.synthesis;
  draft.timestamp = Date.now();

  localStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
  console.log(
    `📝 Score de ${game} guardado: ${score} pts (Total: ${draft.scores.total})`
  );
}

/**
 * Valida que el draft esté completo y listo para enviar
 */
export function isDraftComplete(draft: PredictionDraft): boolean {
  return !!(
    draft.hypothesis &&
    draft.userName.length >= 2 &&
    draft.suggestedName.length >= 2 &&
    draft.message.length >= 10 &&
    draft.scores.total > 0
  );
}

/**
 * Valida que al menos la hipótesis y datos personales estén completos
 * (Para permitir envío incluso sin jugar todos los juegos)
 */
export function isDraftPartiallyComplete(draft: PredictionDraft): boolean {
  return !!(
    draft.hypothesis &&
    draft.userName.length >= 2 &&
    draft.suggestedName.length >= 2 &&
    draft.message.length >= 10
  );
}

/**
 * Limpia el draft del localStorage
 */
export function clearDraft(): void {
  localStorage.removeItem(STORAGE_KEY);
  console.log("🗑️ Draft limpiado");
}

/**
 * Verifica si existe un draft en progreso
 */
export function hasDraft(): boolean {
  return localStorage.getItem(STORAGE_KEY) !== null;
}

/**
 * Obtiene información resumida del draft (para debugging)
 */
export function getDraftSummary(): string {
  const draft = getDraft();
  return `
    Draft Summary:
    - User ID: ${draft.userId}
    - Hypothesis: ${draft.hypothesis || "No seleccionada"}
    - Name: ${draft.userName || "Vacío"}
    - Suggested Name: ${draft.suggestedName || "Vacío"}
    - Message: ${
      draft.message ? `${draft.message.substring(0, 30)}...` : "Vacío"
    }
    - Scores: ${draft.scores.total} pts
    - Complete: ${isDraftComplete(draft) ? "✅" : "❌"}
  `.trim();
}
