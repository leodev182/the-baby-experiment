import { useState, useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../lib/firebase";
import type { EventConfig } from "../types";
import { logger } from "../utils/logger";
import { rateLimiter, RATE_LIMITS } from "../utils/rateLimiters";

export function useEventConfig() {
  const [config, setConfig] = useState<EventConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchConfig = async () => {
      // ✅ Verificar rate limit ANTES de hacer la petición
      if (!rateLimiter.isAllowed("fetchConfig", RATE_LIMITS.CONFIG_FETCH)) {
        logger.warn("⚠️ Rate limit: fetchConfig bloqueado temporalmente");
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const docRef = doc(db, "config", "event");
        const docSnap = await getDoc(docRef);

        // Solo actualizar si el componente sigue montado
        if (!isMounted) return;

        if (docSnap.exists()) {
          setConfig(docSnap.data() as EventConfig);
          logger.log("✅ Configuración cargada desde Firestore");
        } else {
          setError("No se encontró la configuración del evento en Firestore");
          logger.error("❌ Documento config/event no existe");
        }
      } catch (err) {
        if (!isMounted) return;

        const errorMessage =
          err instanceof Error ? err.message : "Error desconocido";
        setError(`Error al cargar configuración: ${errorMessage}`);
        logger.error("❌ Error en useEventConfig:", err);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchConfig();

    // Cleanup: marcar componente como desmontado
    return () => {
      isMounted = false;
    };
  }, []);

  return { config, loading, error };
}
