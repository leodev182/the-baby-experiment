import { useState } from "react";
import { MainLayout } from "./components/Layout/MainLayout";
import { IntroScreen } from "./components/Intro/IntroScreen";
import type { GamePhase } from "./types";

function App() {
  const [currentPhase, setCurrentPhase] = useState<GamePhase>("intro");

  const handleStart = () => {
    setCurrentPhase("hypothesis");
  };

  return (
    <MainLayout currentPhase={currentPhase}>
      {/* Fase Intro */}
      {currentPhase === "intro" && <IntroScreen onStart={handleStart} />}

      {/* Fase Hypothesis - Placeholder */}
      {currentPhase === "hypothesis" && (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center space-y-4">
            <h2 className="text-4xl text-cyan-400 font-bold">
              FASE: FORMULACIÓN DE HIPÓTESIS
            </h2>
            <p className="text-gray-400 text-lg">
              (Componente en desarrollo - Día 3)
            </p>
            <div className="mt-8 text-cyan-300 font-mono text-sm">
              <p>✅ Sistema operativo</p>
              <p>✅ Intro completado</p>
              <p>⏳ Esperando componente HypothesisScreen...</p>
            </div>
          </div>
        </div>
      )}

      {/* Resto de fases - Placeholders */}
      {currentPhase === "collider" && (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center space-y-4">
            <h2 className="text-4xl text-cyan-400 font-bold">
              FASE: COLISIONADOR DE PARTÍCULAS
            </h2>
            <p className="text-gray-400">(Día 3)</p>
          </div>
        </div>
      )}

      {currentPhase === "equation" && (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center space-y-4">
            <h2 className="text-4xl text-cyan-400 font-bold">
              FASE: ECUACIÓN DE ENLACE
            </h2>
            <p className="text-gray-400">(Día 3)</p>
          </div>
        </div>
      )}

      {currentPhase === "synthesis" && (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center space-y-4">
            <h2 className="text-4xl text-cyan-400 font-bold">
              FASE: SÍNTESIS FARMACÉUTICA
            </h2>
            <p className="text-gray-400">(Día 3)</p>
          </div>
        </div>
      )}
    </MainLayout>
  );
}

export default App;
