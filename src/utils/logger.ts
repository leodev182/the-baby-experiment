const isDev = import.meta.env.DEV;
const isProd = import.meta.env.PROD;

// En producción, acumular logs en memoria (máximo 50)
const logBuffer: string[] = [];
const MAX_BUFFER = 50;

function addToBuffer(message: string) {
  if (isProd && logBuffer.length < MAX_BUFFER) {
    logBuffer.push(`[${new Date().toISOString()}] ${message}`);
  }
}

export const logger = {
  /**
   * Log normal - Solo en desarrollo
   */
  log: (...args: any[]) => {
    if (isDev) {
      console.log(...args);
    } else {
      // En producción, solo guardar en buffer (no mostrar)
      addToBuffer(args.join(" "));
    }
  },

  /**
   * Info - Solo en desarrollo
   */
  info: (...args: any[]) => {
    if (isDev) {
      console.info(...args);
    }
  },

  /**
   * Warning - Siempre mostrar pero ligero
   */
  warn: (...args: any[]) => {
    console.warn(...args);
    addToBuffer(`WARN: ${args.join(" ")}`);
  },

  /**
   * Error - SIEMPRE mostrar (crítico)
   */
  error: (...args: any[]) => {
    console.error(...args);
    addToBuffer(`ERROR: ${args.join(" ")}`);
  },

  /**
   * Success - Solo en desarrollo
   */
  success: (...args: any[]) => {
    if (isDev) {
      console.log("✅", ...args);
    }
  },

  /**
   * Debug - Solo en desarrollo
   */
  debug: (...args: any[]) => {
    if (isDev) {
      console.debug("🐛", ...args);
    }
  },

  /**
   * Obtener logs acumulados (útil para debugging remoto)
   */
  getLogs: () => {
    return logBuffer;
  },

  /**
   * Limpiar buffer de logs
   */
  clearLogs: () => {
    logBuffer.length = 0;
  },
};

// Hacer logger global para debugging en producción si es necesario
if (isProd && typeof window !== "undefined") {
  (window as any).__logger = logger;
}
