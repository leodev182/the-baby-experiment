import {
  doc,
  setDoc,
  updateDoc,
  increment,
  arrayUnion,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { PredictionDraft } from "./localStorageService";

/**
 * Envía la predicción completa a Firebase
 * UNA SOLA VEZ al final de todo el flujo
 */
export async function submitPrediction(draft: PredictionDraft): Promise<void> {
  try {
    console.log("🚀 Iniciando envío a Firebase...");
    console.log("📦 Draft a enviar:", draft);

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

    console.log("✅ Predicción guardada en predictions/");

    // 2. Actualizar estadísticas globales en config/event
    await updateStats(draft);

    console.log("🎉 ¡Predicción enviada exitosamente!");
  } catch (error) {
    console.error("❌ Error enviando predicción:", error);
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

    console.log("✅ Estadísticas actualizadas en config/event");
  } catch (error) {
    console.error("⚠️ Error actualizando stats (no crítico):", error);
    // No lanza error porque la predicción YA se guardó
  }
}
