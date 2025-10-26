interface RateLimitConfig {
  maxCalls: number;
  timeWindow: number;
}

class RateLimiter {
  private callTimestamps: Map<string, number[]> = new Map();

  /**
   * Verifica si una llamada está permitida
   * @param key
   * @param config
   * @returns
   */
  public isAllowed(key: string, config: RateLimitConfig): boolean {
    const now = Date.now();
    const timestamps = this.callTimestamps.get(key) || [];

    // Filtrar solo los timestamps dentro de la ventana de tiempo
    const recentCalls = timestamps.filter(
      (timestamp) => now - timestamp < config.timeWindow
    );

    // Si ya alcanzo el límite, bloquear
    if (recentCalls.length >= config.maxCalls) {
      console.warn(
        `⚠️ Rate limit alcanzado para "${key}". Máximo ${config.maxCalls} llamadas en ${config.timeWindow}ms`
      );
      return false;
    }

    // Agregar el timestamp actual y actualizar
    recentCalls.push(now);
    this.callTimestamps.set(key, recentCalls);

    return true;
  }

  /**
   * Limpia los timestamps antiguos (opcional, para liberar memoria)
   */
  public cleanup(): void {
    const now = Date.now();
    const maxAge = 60000; // 1 minuto

    this.callTimestamps.forEach((timestamps, key) => {
      const recent = timestamps.filter((t) => now - t < maxAge);
      if (recent.length === 0) {
        this.callTimestamps.delete(key);
      } else {
        this.callTimestamps.set(key, recent);
      }
    });
  }
}

// Instancia global del rate limiter
export const rateLimiter = new RateLimiter();

// Configuraciones predefinidas
export const RATE_LIMITS = {
  // Configuración: máximo 1 llamada cada 5 segundos
  CONFIG_FETCH: { maxCalls: 1, timeWindow: 5000 },

  // Envío de predicción: máximo 1 cada 3 segundos
  SUBMIT_PREDICTION: { maxCalls: 1, timeWindow: 3000 },

  // Fetch general: máximo 5 llamadas en 10 segundos
  GENERAL_FETCH: { maxCalls: 5, timeWindow: 10000 },
};

// Limpieza automática cada minuto
setInterval(() => rateLimiter.cleanup(), 60000);
