import { useState, useEffect } from "react";
import { MainLayout } from "./components/Layout/MainLayout";
import { IntroScreen } from "./components/Intro/IntroScreen";
import { HypothesisScreen } from "./components/Hypothesis/HypothesisScreen";
import { InputScreen, type InputData } from "./components/Input/InputScreen";
import {
  getDraft,
  initializeDraft,
  clearDraft,
  hasDraft,
  isDraftPartiallyComplete,
} from "./services/localStorageService";
import { submitPrediction } from "./services/submissionService";
import type { GamePhase, Hypothesis } from "./types";

function App() {
  const [currentPhase, setCurrentPhase] = useState<GamePhase>("intro");
  const [isSaving, setIsSaving] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Inicializar draft al montar el componente
  useEffect(() => {
    if (!hasDraft()) {
      initializeDraft();
      console.log("🆕 Nuevo draft inicializado");
    } else {
      console.log("📋 Draft existente encontrado");
    }
    setIsInitialized(true);
  }, []);

  const handleStart = () => {
    setCurrentPhase("hypothesis");
  };

  const handleHypothesisSelect = (hypothesis: Hypothesis) => {
    // Solo guarda en localStorage (NO en Firebase)
    console.log(`✅ Hipótesis ${hypothesis} guardada en draft`);

    // Navegar a InputScreen
    setCurrentPhase("input");
  };

  const handleInputSubmit = async (data: InputData) => {
    console.log("📝 Datos de input guardados en draft:", data);

    // Verificar si el draft está listo para enviar
    const draft = getDraft();

    if (isDraftPartiallyComplete(draft)) {
      // Si ya tiene todo lo necesario (hipótesis + datos personales)
      // Podemos enviar AHORA o esperar a los juegos

      // OPCIÓN A: Enviar ahora (sin juegos)
      // await handleFinalSubmit();

      // OPCIÓN B: Ir a los juegos primero
      setCurrentPhase("collider");

      console.log("🎮 Navegando a juegos. Draft completo:", draft);
    } else {
      alert("Faltan datos. Por favor completa el formulario.");
    }
  };

  const handleInputBack = () => {
    setCurrentPhase("hypothesis");
  };

  // Función para enviar TODO a Firebase (llamar después de los 3 juegos)
  const handleFinalSubmit = async () => {
    setIsSaving(true);

    try {
      const draft = getDraft();

      console.log("🚀 Enviando predicción completa a Firebase...");
      console.log("📦 Draft final:", draft);

      // Enviar a Firebase
      await submitPrediction(draft);

      console.log("✅ Predicción enviada exitosamente");

      // Limpiar draft
      clearDraft();

      // Navegar a pantalla de éxito
      setCurrentPhase("submitted");

      alert("¡Predicción enviada exitosamente! 🎉");
    } catch (error) {
      console.error("❌ Error al enviar predicción:", error);
      alert("Error al enviar tu predicción. Por favor intenta de nuevo.");
    } finally {
      setIsSaving(false);
    }
  };

  // Handlers para los juegos (cuando los crees en Día 4)
  const handleColliderComplete = (score: number) => {
    console.log(`🎮 Collider completado: ${score} pts`);
    // updateGameScore("collider", score) ya se llama dentro del juego
    setCurrentPhase("equation");
  };

  const handleEquationComplete = (score: number) => {
    console.log(`🎮 Equation completado: ${score} pts`);
    // updateGameScore("equation", score) ya se llama dentro del juego
    setCurrentPhase("synthesis");
  };

  const handleSynthesisComplete = async (score: number) => {
    console.log(`🎮 Synthesis completado: ${score} pts`);
    // updateGameScore("synthesis", score) ya se llama dentro del juego

    // Después del último juego, enviar TODO a Firebase
    await handleFinalSubmit();
  };

  if (!isInitialized) {
    return (
      <MainLayout currentPhase="intro">
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-cyan-400 animate-pulse">Cargando...</div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout currentPhase={currentPhase}>
      {/* Loading overlay cuando se envía a Firebase */}
      {isSaving && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-gray-900 border-2 border-cyan-500 rounded-xl p-8 text-center">
            <div className="text-cyan-400 text-xl mb-4 animate-pulse">
              🔬 Procesando datos...
            </div>
            <div className="text-gray-400">Enviando a Firebase</div>
            <div className="text-gray-500 text-sm mt-2">
              Por favor no cierres esta ventana
            </div>
          </div>
        </div>
      )}

      {/* Fase Intro */}
      {currentPhase === "intro" && <IntroScreen onStart={handleStart} />}

      {/* Fase Hypothesis */}
      {currentPhase === "hypothesis" && (
        <HypothesisScreen onHypothesisSelect={handleHypothesisSelect} />
      )}

      {/* Fase Input */}
      {currentPhase === "input" && (
        <InputScreen onSubmit={handleInputSubmit} onBack={handleInputBack} />
      )}

      {/* Juego 1: Collider */}
      {currentPhase === "collider" && (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center space-y-4">
            <h2 className="text-4xl text-cyan-400 font-bold">
              FASE 1: COLISIONADOR DE PARTÍCULAS
            </h2>
            <p className="text-gray-400">Juego en desarrollo (Día 4)</p>

            {/* Botón temporal para simular completar el juego */}
            <button
              onClick={() => handleColliderComplete(85)}
              className="mt-4 px-6 py-3 bg-cyan-500 hover:bg-cyan-600 text-black rounded-lg font-semibold"
            >
              [DEV] Simular juego (85 pts)
            </button>
          </div>
        </div>
      )}

      {/* Juego 2: Equation */}
      {currentPhase === "equation" && (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center space-y-4">
            <h2 className="text-4xl text-cyan-400 font-bold">
              FASE 2: ECUACIÓN DE ENLACE
            </h2>
            <p className="text-gray-400">Juego en desarrollo (Día 4)</p>

            {/* Botón temporal para simular completar el juego */}
            <button
              onClick={() => handleEquationComplete(92)}
              className="mt-4 px-6 py-3 bg-cyan-500 hover:bg-cyan-600 text-black rounded-lg font-semibold"
            >
              [DEV] Simular juego (92 pts)
            </button>
          </div>
        </div>
      )}

      {/* Juego 3: Synthesis */}
      {currentPhase === "synthesis" && (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center space-y-4">
            <h2 className="text-4xl text-cyan-400 font-bold">
              FASE 3: SÍNTESIS FARMACÉUTICA
            </h2>
            <p className="text-gray-400">Juego en desarrollo (Día 4)</p>

            {/* Botón temporal para simular completar el juego */}
            <button
              onClick={() => handleSynthesisComplete(78)}
              className="mt-4 px-6 py-3 bg-cyan-500 hover:bg-cyan-600 text-black rounded-lg font-semibold"
            >
              [DEV] Simular juego (78 pts) → Enviar a Firebase
            </button>
          </div>
        </div>
      )}

      {/* Pantalla de éxito */}
      {currentPhase === "submitted" && (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center space-y-6 max-w-2xl px-4">
            <div className="text-8xl mb-4">🎉</div>
            <h2 className="text-4xl text-cyan-400 font-bold">
              ¡Predicción Registrada!
            </h2>
            <p className="text-gray-300 text-lg">
              Tu hipótesis ha sido guardada exitosamente en la base de datos
              experimental.
            </p>
            <div className="bg-gray-900/50 border-2 border-cyan-500/30 rounded-xl p-6">
              <p className="text-gray-400">
                Gracias por participar en el experimento científico más
                emocionante del año.
              </p>
              <p className="text-cyan-400 mt-4 font-semibold">
                Nos vemos en el reveal 🚀
              </p>
            </div>
          </div>
        </div>
      )}
    </MainLayout>
  );
}

export default App;
