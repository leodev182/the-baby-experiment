import { useMemo } from "react";
import { useCountdown } from "../../hooks/useCountdown";
import { useEventConfig } from "../../hooks/useEventConfig";
import type { GamePhase } from "../../types";

interface SpaceComputerProps {
  currentPhase: GamePhase;
}

export function SpaceComputer({ currentPhase }: SpaceComputerProps) {
  const { config } = useEventConfig();

  // ✅ FIX: Memorizar la fecha target para evitar que cambie en cada render
  const targetDate = useMemo(() => {
    return (
      config?.revealDate || new Date("2025-10-26T19:00:00-03:00").getTime()
    );
  }, [config?.revealDate]);

  const countdown = useCountdown(targetDate);

  // Calcular progreso de gestación
  // FPP: 29 enero 2026
  // Embarazo: 40 semanas = 280 días
  // Fecha de concepción estimada: 29 enero 2026 - 280 días = 24 abril 2025
  const CONCEPTION_DATE = new Date("2025-04-24").getTime();
  const GESTATION_PERIOD = 280 * 24 * 60 * 60 * 1000; // 40 semanas en milisegundos
  const now = Date.now();
  const timeElapsed = now - CONCEPTION_DATE;
  const gestationProgress = Math.min(
    100,
    Math.max(0, (timeElapsed / GESTATION_PERIOD) * 100)
  );

  // Calcular semanas de gestación
  const weeksElapsed = Math.floor(timeElapsed / (7 * 24 * 60 * 60 * 1000));

  return (
    <>
      {/* HUD TOP - Desktop y Mobile - FIJO */}
      <div className="fixed top-0 left-0 right-0 h-16 bg-black/90 backdrop-blur-md border-b border-cyan-500/30 z-50">
        <div className="max-w-7xl mx-auto h-full px-4 flex items-center justify-between">
          {/* Logo/Title */}
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
            <span className="text-cyan-400 font-mono text-sm">
              BABY-REVEAL v1.0
            </span>
          </div>

          {/* Fase actual */}
          <div className="hidden md:flex items-center gap-2 text-xs">
            <span className="text-gray-400">FASE:</span>
            <span className="text-cyan-300 font-semibold">{currentPhase}</span>
          </div>

          {/* Countdown compacto */}
          {!countdown.isExpired ? (
            <div className="flex items-center gap-2 font-mono text-xs">
              <span className="text-gray-400">T-</span>
              <div className="flex gap-1">
                <span className="text-cyan-400">{countdown.days}d</span>
                <span className="text-gray-500">:</span>
                <span className="text-cyan-400">{countdown.hours}h</span>
                <span className="text-gray-500">:</span>
                <span className="text-cyan-400">{countdown.minutes}m</span>
              </div>
            </div>
          ) : (
            <span className="text-green-400 text-xs font-mono animate-pulse">
              EXPERIMENTO COMPLETADO
            </span>
          )}
        </div>
      </div>

      {/* HUD SIDEBAR - Solo Desktop - FIJO */}
      <aside className="hidden lg:block fixed left-0 top-16 bottom-0 w-80 bg-black/90 backdrop-blur-md border-r border-cyan-500/30 overflow-y-auto z-40">
        <div className="p-6 space-y-6">
          {/* Progreso de Gestación */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-gray-400">PROGRESO GESTACIONAL</span>
              <span className="text-cyan-400">
                {gestationProgress.toFixed(1)}%
              </span>
            </div>
            <div className="flex justify-between text-[10px] text-gray-500 mb-1">
              <span>Semana {weeksElapsed} de 40</span>
              <span>FPP: 29 Ene 2026</span>
            </div>
            <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-500"
                style={{ width: `${gestationProgress}%` }}
              />
            </div>
          </div>

          {/* Datos Científicos */}
          <div className="space-y-3 text-xs">
            <h3 className="text-cyan-400 font-semibold border-b border-cyan-500/30 pb-2">
              DATOS DEL EXPERIMENTO
            </h3>

            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-400">Energía detectada:</span>
                <span className="text-cyan-300 font-mono">9.8 × 10⁹ J</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-400">Nivel de ternura:</span>
                <span className="text-cyan-300 font-mono">∞ mol/L</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-400">Temperatura emocional:</span>
                <span className="text-cyan-300 font-mono">
                  298 K (caliente)
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-400">Estado cuántico:</span>
                <span className="text-cyan-300 font-mono">Superposición</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-400">Probabilidad de éxito:</span>
                <span className="text-green-400 font-mono">100.00%</span>
              </div>
            </div>
          </div>

          {/* Countdown Grande */}
          {!countdown.isExpired && (
            <div className="space-y-3 pt-4 border-t border-cyan-500/30">
              <h3 className="text-cyan-400 font-semibold text-xs">
                TIEMPO HASTA REVEAL
              </h3>

              <div className="grid grid-cols-4 gap-2">
                <div className="bg-gray-900/50 rounded p-2 text-center border border-cyan-500/20">
                  <div className="text-2xl font-mono text-cyan-400">
                    {countdown.days}
                  </div>
                  <div className="text-[10px] text-gray-400 mt-1">DÍAS</div>
                </div>
                <div className="bg-gray-900/50 rounded p-2 text-center border border-cyan-500/20">
                  <div className="text-2xl font-mono text-cyan-400">
                    {countdown.hours}
                  </div>
                  <div className="text-[10px] text-gray-400 mt-1">HORAS</div>
                </div>
                <div className="bg-gray-900/50 rounded p-2 text-center border border-cyan-500/20">
                  <div className="text-2xl font-mono text-cyan-400">
                    {countdown.minutes}
                  </div>
                  <div className="text-[10px] text-gray-400 mt-1">MIN</div>
                </div>
                <div className="bg-gray-900/50 rounded p-2 text-center border border-cyan-500/20">
                  <div className="text-2xl font-mono text-cyan-400">
                    {countdown.seconds}
                  </div>
                  <div className="text-[10px] text-gray-400 mt-1">SEG</div>
                </div>
              </div>
            </div>
          )}

          {/* Indicador de Sistema */}
          <div className="pt-4 border-t border-cyan-500/30 space-y-2">
            <div className="flex items-center gap-2 text-xs">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-gray-400">Sistema operativo</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
              <span className="text-gray-400">Firestore conectado</span>
            </div>
            <div className="text-[10px] text-gray-500 mt-2">
              Lanzamiento: 23 Oct 2025
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
