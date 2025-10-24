import { useState, useEffect } from "react";
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

function App() {
  const [currentPhase, setCurrentPhase] = useState<GamePhase>("intro");
  const [isSaving, setIsSaving] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Detectar si estamos en la ruta de admin
  const isAdminRoute = window.location.pathname === "/admin-stats-2025";

  // Si es ruta admin, mostrar AdminPanel directamente
  if (isAdminRoute) {
    return <AdminPanel />;
  }

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
    // Sobrescribir hipótesis en localStorage (permite cambiar de opinión)
    updateHypothesis(hypothesis);
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
      // Ir a los juegos primero
      setCurrentPhase("collider");

      console.log("🎮 Navegando a juegos. Draft completo:", draft);
    } else {
      alert("Faltan datos. Por favor completa el formulario.");
    }
  };

  const handleInputBack = () => {
    // El draft se mantiene, solo volvemos a la fase anterior
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

      // IMPORTANTE: NO limpiar el draft todavía
      // SuccessScreen lo necesita para mostrar los datos
      // Se limpiará cuando el usuario cierre o recargue

      // Navegar a pantalla de éxito
      setCurrentPhase("submitted");
    } catch (error) {
      console.error("❌ Error al enviar predicción:", error);
      alert("Error al enviar tu predicción. Por favor intenta de nuevo.");
    } finally {
      setIsSaving(false);
    }
  };

  // Handlers para los juegos
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
        <Phase1Collider onComplete={handleColliderComplete} />
      )}

      {/* Juego 2: Equation */}
      {currentPhase === "equation" && (
        <Phase2Equation onComplete={handleEquationComplete} />
      )}

      {/* Juego 3: Synthesis */}
      {currentPhase === "synthesis" && (
        <Phase3Synthesis onComplete={handleSynthesisComplete} />
      )}

      {/* Pantalla de éxito - SuccessScreen */}
      {currentPhase === "submitted" && <SuccessScreen />}
    </MainLayout>
  );
}

export default App;
