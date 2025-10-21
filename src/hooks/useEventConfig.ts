import { useState, useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../lib/firebase";
import type { EventConfig } from "../types";

export function useEventConfig() {
  const [config, setConfig] = useState<EventConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        setLoading(true);
        setError(null);

        const docRef = doc(db, "config", "event");
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setConfig(docSnap.data() as EventConfig);
          console.log("✅ Configuración cargada desde Firestore");
        } else {
          setError("No se encontró la configuración del evento en Firestore");
          console.error("❌ Documento config/event no existe");
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Error desconocido";
        setError(`Error al cargar configuración: ${errorMessage}`);
        console.error("❌ Error en useEventConfig:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchConfig();
  }, []);

  return { config, loading, error };
}
