import { ScientificNarrative } from "./ScientificNarrative";
import { ParticleBackground } from "./ParticleBackground";
import { Button } from "../Shared/Button";
import type { EventConfig } from "../../types";

interface IntroScreenProps {
  onStart: () => void;
  config?: EventConfig | null; // ✅ Recibe config como prop opcional
}

export function IntroScreen({ onStart, config }: IntroScreenProps) {
  const isPastDeadline = config?.revealDate
    ? Date.now() >= config.revealDate
    : false;

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center px-4 py-8 relative overflow-x-hidden">
      {/* Fondo de partículas animadas */}
      <ParticleBackground />

      {/* Contenedor con margen superior para no chocar con el header */}
      <div className="w-full max-w-4xl pt-20 pb-12 relative z-10">
        {/* Título principal */}
        <div className="text-center mb-12 relative z-10">
          <h1 className="text-5xl md:text-6xl font-bold text-cyan-400 mb-4 animate-pulse">
            BABY-REVEAL v1.0
          </h1>
          <p className="text-gray-400 text-lg font-mono">
            {isPastDeadline
              ? "Las predicciones han cerrado"
              : "Iniciando protocolo experimental..."}
          </p>
        </div>

        {/* Narrativa científica */}
        <div className="relative z-10">
          <ScientificNarrative />
        </div>

        {/* Botón de inicio */}
        <div className="mt-12 text-center relative z-10">
          {isPastDeadline ? (
            <>
              <Button
                onClick={() =>
                  (window.location.href =
                    "https://baby-reveal-experiment-f9bb0.web.app/baby-shower")
                }
                variant="primary"
              >
                🔬 Confirma tu asistencia
              </Button>
              {/* <Button
                onClick={() =>
                  (window.location.href =
                    "https://baby-reveal-experiment-f9bb0.web.app/admin-stats-2025")
                }
                variant="primary"
              >
                🔬 Ver Predicciones del Experimento
              </Button> */}
              <p className="mt-4 text-sm text-yellow-400 font-mono">
                ⚠️ El plazo para enviar predicciones ha finalizado
              </p>
            </>
          ) : (
            <>
              <Button onClick={onStart} variant="primary">
                🚀 Unirme al Experimento
              </Button>
              <p className="mt-4 text-xs text-gray-500 font-mono">
                Sistema operativo | Firebase conectado | Fase: INTRO
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
