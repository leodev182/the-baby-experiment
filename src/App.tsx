import { useState, useEffect } from "react";
import { useEventConfig } from "./hooks/useEventConfig";
import { MainLayout } from "./components/Layout/MainLayout";
import { IntroScreen } from "./components/Intro/IntroScreen";
import { HypothesisScreen } from "./components/Hypothesis/HypothesisScreen";
import { InputScreen, type InputData } from "./components/Input/InputScreen";
import { SuccessScreen } from "./components/Submitted/SuccessScreen";
import { AdminPanel } from "./components/Admin/AdminPanel";
import {
  getDraft,
  initializeDraft,
  hasDraft,
  isDraftPartiallyComplete,
  updateHypothesis,
} from "./services/localStorageService";
import { submitPrediction } from "./services/submissionService";
import type { GamePhase, Hypothesis } from "./types";
import { Phase1Collider } from "./components/Games/Phase1Collider/Phase1Collider";
import { Phase2Equation } from "./components/Games/Phase2Equation/Phase2Equation";
import { Phase3Synthesis } from "./components/Games/Phase3Synthesis/Phase3Synthesis";
import { logger } from "./utils/logger";

function App() {
  const [currentPhase, setCurrentPhase] = useState<GamePhase>("intro");
  const [isSaving, setIsSaving] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // ✅ Cargar config UNA VEZ aquí
  const { config } = useEventConfig();

  // ✅ HOOKS SIEMPRE AL INICIO - Antes de cualquier return condicional
  useEffect(() => {
    if (!hasDraft()) {
      initializeDraft();
      logger.log("🆕 Nuevo draft inicializado");
    } else {
      logger.log("📋 Draft existente encontrado");
    }
    setIsInitialized(true);
  }, []);

  // Detectar si estamos en la ruta de admin
  const isAdminRoute = window.location.pathname === "/admin-stats-2025";

  // Si es ruta admin, mostrar AdminPanel directamente
  if (isAdminRoute) {
    return <AdminPanel />;
  }

  // ✅ Verificar si ya pasó la fecha límite
  const isPastDeadline = config?.revealDate
    ? Date.now() >= config.revealDate
    : false;

  const handleStart = () => {
    // Si ya pasó el deadline, ir directo al muro
    if (isPastDeadline) {
      window.location.href = "/predictions";
      return;
    }
    setCurrentPhase("hypothesis");
  };

  const handleHypothesisSelect = (hypothesis: Hypothesis) => {
    updateHypothesis(hypothesis);
    logger.log(`✅ Hipótesis ${hypothesis} guardada en draft`);
    setCurrentPhase("input");
  };

  const handleInputSubmit = async (data: InputData) => {
    logger.log("📝 Datos de input guardados en draft:", data);

    const draft = getDraft();

    if (isDraftPartiallyComplete(draft)) {
      setCurrentPhase("collider");
      logger.log("🎮 Navegando a juegos. Draft completo:", draft);
    } else {
      alert("Faltan datos. Por favor completa el formulario.");
    }
  };

  const handleInputBack = () => {
    setCurrentPhase("hypothesis");
  };

  const handleFinalSubmit = async () => {
    setIsSaving(true);

    try {
      const draft = getDraft();

      logger.log("🚀 Enviando predicción completa a Firebase...");
      logger.log("📦 Draft final:", draft);

      await submitPrediction(draft);

      logger.log("✅ Predicción enviada exitosamente");

      setCurrentPhase("submitted");
    } catch (error) {
      logger.error("❌ Error al enviar predicción:", error);
      alert("Error al enviar tu predicción. Por favor intenta de nuevo.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleColliderComplete = (score: number) => {
    logger.log(`🎮 Collider completado: ${score} pts`);
    setCurrentPhase("equation");
  };

  const handleEquationComplete = (score: number) => {
    logger.log(`🎮 Equation completado: ${score} pts`);
    setCurrentPhase("synthesis");
  };

  const handleSynthesisComplete = async (score: number) => {
    logger.log(`🎮 Synthesis completado: ${score} pts`);
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

      {/* ✅ Pasar config como prop */}
      {currentPhase === "intro" && (
        <IntroScreen onStart={handleStart} config={config} />
      )}
      {currentPhase === "hypothesis" && (
        <HypothesisScreen onHypothesisSelect={handleHypothesisSelect} />
      )}
      {currentPhase === "input" && (
        <InputScreen onSubmit={handleInputSubmit} onBack={handleInputBack} />
      )}
      {currentPhase === "collider" && (
        <Phase1Collider onComplete={handleColliderComplete} />
      )}
      {currentPhase === "equation" && (
        <Phase2Equation onComplete={handleEquationComplete} />
      )}
      {currentPhase === "synthesis" && (
        <Phase3Synthesis onComplete={handleSynthesisComplete} />
      )}
      {currentPhase === "submitted" && <SuccessScreen />}
    </MainLayout>
  );
}

export default App;
