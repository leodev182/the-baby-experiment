import {
  doc,
  setDoc,
  updateDoc,
  increment,
  arrayUnion,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../lib/firebase";
import { rateLimiter, RATE_LIMITS } from "../utils/rateLimiters";
import type { PredictionDraft } from "./localStorageService";
import { logger } from "../utils/logger";

/**
 * Envía la predicción completa a Firebase con rate limiting
 * UNA SOLA VEZ al final de todo el flujo
 */
export async function submitPrediction(draft: PredictionDraft): Promise<void> {
  // ✅ Verificar rate limit ANTES de hacer cualquier cosa
  if (
    !rateLimiter.isAllowed("submitPrediction", RATE_LIMITS.SUBMIT_PREDICTION)
  ) {
    logger.warn("⚠️ Rate limit alcanzado. Por favor espera unos segundos.");
    throw new Error(
      "Por favor espera unos segundos antes de enviar nuevamente"
    );
  }

  try {
    logger.log("🚀 Iniciando envío a Firebase...");
    logger.log("📦 Draft a enviar:", draft);

    // Validar que el draft tenga hipótesis
    if (!draft.hypothesis) {
      throw new Error("No se puede enviar sin hipótesis seleccionada");
    }

    // 1. Guardar predicción en predictions/
    const predictionRef = doc(db, "predictions", draft.userId);

    await setDoc(predictionRef, {
      userId: draft.userId,
      hypothesis: draft.hypothesis,
      userName: draft.userName,
      suggestedName: draft.suggestedName,
      message: draft.message,
      scores: draft.scores,
      timestamp: serverTimestamp(),
      userAgent: navigator.userAgent,
    });

    logger.log("✅ Predicción guardada en predictions/");

    // 2. Actualizar estadísticas globales en config/event
    await updateStats(draft);

    logger.log("🎉 ¡Predicción enviada exitosamente!");
  } catch (error) {
    logger.error("❌ Error enviando predicción:", error);
    throw error;
  }
}

/**
 * Actualiza las estadísticas en config/event
 */
async function updateStats(draft: PredictionDraft): Promise<void> {
  const statsRef = doc(db, "config", "event");

  // Determinar qué contador incrementar
  const hypothesisField =
    draft.hypothesis === "XX" ? "stats.xxCount" : "stats.xyCount";

  try {
    await updateDoc(statsRef, {
      // Incrementar contadores
      "stats.totalPredictions": increment(1),
      [hypothesisField]: increment(1),

      // Agregar solo el STRING del nombre al array
      "stats.topNames": arrayUnion(draft.suggestedName),

      // Actualizar timestamp
      "stats.lastUpdated": serverTimestamp(),
    });

    logger.log("✅ Estadísticas actualizadas en config/event");
  } catch (error) {
    logger.error("⚠️ Error actualizando stats (no crítico):", error);
  }
}
