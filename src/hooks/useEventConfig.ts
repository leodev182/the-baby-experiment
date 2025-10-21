import { useState, useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../lib/firebase";
import type { EventConfig } from "../types";
import { EVENT_CONFIG } from "../utils/constants";

// Configuración mock para desarrollo
const MOCK_CONFIG: EventConfig = {
  revealDate: new Date(EVENT_CONFIG.REVEAL_DATE).getTime(),
  isRevealed: false,
  actualResult: null,
  babyName: null,
  meetLink: EVENT_CONFIG.MEET_LINK,
  stats: {
    totalPredictions: 0,
    xxCount: 0,
    xyCount: 0,
    xxPercentage: 0,
    xyPercentage: 0,
    averageScore: 0,
    topNames: [],
    lastUpdated: Date.now(),
  },
};

export function useEventConfig() {
  const [config, setConfig] = useState<EventConfig | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        setLoading(true);
        const docRef = doc(db, "config", "event");
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setConfig(docSnap.data() as EventConfig);
        } else {
          // Si no existe en Firestore, usar mock
          console.log(
            "⚠️ No se encontró configuración en Firestore, usando mock temporal"
          );
          setConfig(MOCK_CONFIG);
        }
      } catch (err) {
        console.warn(
          "⚠️ Error al cargar configuración de Firestore, usando mock:",
          err
        );
        // Si hay error de conexión, usar mock
        setConfig(MOCK_CONFIG);
      } finally {
        setLoading(false);
      }
    };

    fetchConfig();
  }, []);

  return { config, loading };
}
