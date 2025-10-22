import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { updateGameScore } from "@/services/localStorageService";

interface Phase2EquationProps {
  onComplete: (score: number) => void;
}

type MoleculeType = "XX" | "XY" | "BABY";

interface Molecule {
  id: string;
  type: MoleculeType;
  x: number;
  y: number;
  isPlaced: boolean;
  slotIndex?: number;
}

interface Slot {
  index: number;
  expectedType: MoleculeType;
  isCorrect: boolean;
  molecule?: Molecule;
}

export function Phase2Equation({ onComplete }: Phase2EquationProps) {
  const [gameState, setGameState] = useState<"intro" | "playing" | "result">(
    "intro"
  );
  const [score, setScore] = useState(0);
  const [molecules, setMolecules] = useState<Molecule[]>([]);
  const [slots, setSlots] = useState<Slot[]>([]);
  const [selectedMolecule, setSelectedMolecule] = useState<Molecule | null>(
    null
  );
  const [attempts, setAttempts] = useState(0);
  const [correctPlacements, setCorrectPlacements] = useState(0);
  const [showFeedback, setShowFeedback] = useState<{
    correct: boolean;
    points: number;
  } | null>(null);

  const totalSlots = 5;
  const maxScore = 100;
  const pointsPerCorrect = 20;

  const startGame = () => {
    setGameState("playing");
    setScore(0);
    setAttempts(0);
    setCorrectPlacements(0);
    initializeGame();
  };

  const initializeGame = () => {
    const equation: MoleculeType[] = ["XX", "XY", "XX", "XY", "BABY"];

    const newSlots: Slot[] = equation.map((type, index) => ({
      index,
      expectedType: type,
      isCorrect: false,
    }));
    setSlots(newSlots);

    const availableMolecules: Molecule[] = [
      { id: "xx1", type: "XX", x: 0, y: 0, isPlaced: false },
      { id: "xy1", type: "XY", x: 0, y: 0, isPlaced: false },
      { id: "xx2", type: "XX", x: 0, y: 0, isPlaced: false },
      { id: "xy2", type: "XY", x: 0, y: 0, isPlaced: false },
      { id: "baby", type: "BABY", x: 0, y: 0, isPlaced: false },
    ];

    shuffleArray(availableMolecules);
    setMolecules(availableMolecules);
  };

  const shuffleArray = (array: any[]) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  };

  const handleMoleculeClick = (molecule: Molecule) => {
    if (molecule.isPlaced || gameState !== "playing") return;
    setSelectedMolecule(selectedMolecule?.id === molecule.id ? null : molecule);
  };

  const handleSlotClick = (slot: Slot) => {
    if (!selectedMolecule || slot.isCorrect || gameState !== "playing") return;

    setAttempts(attempts + 1);

    const isCorrect = selectedMolecule.type === slot.expectedType;

    if (isCorrect) {
      const newCorrectCount = correctPlacements + 1;
      setCorrectPlacements(newCorrectCount);

      const earnedPoints = pointsPerCorrect;
      setScore(score + earnedPoints);

      setMolecules((prev) =>
        prev.map((m) =>
          m.id === selectedMolecule.id
            ? { ...m, isPlaced: true, slotIndex: slot.index }
            : m
        )
      );

      setSlots((prev) =>
        prev.map((s) =>
          s.index === slot.index
            ? { ...s, isCorrect: true, molecule: selectedMolecule }
            : s
        )
      );

      setShowFeedback({ correct: true, points: earnedPoints });
      setSelectedMolecule(null);

      if (newCorrectCount === totalSlots) {
        setTimeout(() => {
          finishGame(score + earnedPoints);
        }, 2000);
      }
    } else {
      const penalty = 5;
      setScore(Math.max(0, score - penalty));
      setShowFeedback({ correct: false, points: -penalty });
    }

    setTimeout(() => setShowFeedback(null), 1500);
  };

  const finishGame = (finalScore: number) => {
    setGameState("result");
    updateGameScore("equation", finalScore);

    setTimeout(() => {
      onComplete(finalScore);
    }, 3000);
  };

  const getMoleculeEmoji = (type: MoleculeType) => {
    switch (type) {
      case "XX":
        return "💗";
      case "XY":
        return "💙";
      case "BABY":
        return "✨";
    }
  };

  const getMoleculeLabel = (type: MoleculeType) => {
    switch (type) {
      case "XX":
        return "XX";
      case "XY":
        return "XY";
      case "BABY":
        return "BEBÉ";
    }
  };

  const getMoleculeColor = (type: MoleculeType) => {
    switch (type) {
      case "XX":
        return "from-pink-500 to-rose-500";
      case "XY":
        return "from-cyan-500 to-blue-500";
      case "BABY":
        return "from-yellow-400 to-amber-500";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-purple-900/20 to-black flex items-center justify-center relative overflow-hidden p-4">
      {/* Partículas flotantes de fondo */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 30 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-purple-400/30 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.2, 0.5, 0.2],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Pantalla de intro */}
      {gameState === "intro" && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center z-10 max-w-2xl"
        >
          <motion.div
            animate={{
              scale: [1, 1.1, 1],
              rotate: [0, 5, -5, 0],
            }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-8xl mb-6"
          >
            🧬
          </motion.div>

          <h1 className="text-5xl font-bold text-purple-400 mb-4">
            ECUACIÓN MOLECULAR
          </h1>

          <p className="text-gray-300 text-lg mb-6">
            Conecta las moléculas en el orden correcto para completar la
            ecuación genética
          </p>

          <div className="bg-gray-900/80 border-2 border-purple-500/50 rounded-xl p-6 mb-8 backdrop-blur-sm">
            <div className="space-y-4 text-left">
              <div className="flex items-center gap-3">
                <span className="text-3xl">💗</span>
                <div>
                  <div className="text-white font-semibold">Molécula XX</div>
                  <div className="text-gray-400 text-sm">
                    Cromosoma femenino
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-3xl">💙</span>
                <div>
                  <div className="text-white font-semibold">Molécula XY</div>
                  <div className="text-gray-400 text-sm">
                    Cromosoma masculino
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-3xl">✨</span>
                <div>
                  <div className="text-white font-semibold">Resultado</div>
                  <div className="text-gray-400 text-sm">Nueva vida</div>
                </div>
              </div>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={startGame}
            className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xl font-bold rounded-lg shadow-lg hover:shadow-purple-500/50 transition-all"
          >
            🧪 INICIAR SÍNTESIS
          </motion.button>
        </motion.div>
      )}

      {/* Pantalla de juego */}
      {gameState === "playing" && (
        <div className="w-full max-w-5xl z-10">
          {/* Header con score */}
          <div className="flex justify-between items-center mb-8">
            <div className="bg-gray-900/80 border-2 border-purple-500/50 rounded-lg px-6 py-3">
              <div className="text-gray-400 text-sm">Progreso</div>
              <div className="text-2xl font-bold text-purple-400">
                {correctPlacements}/{totalSlots}
              </div>
            </div>

            <div className="bg-gray-900/80 border-2 border-purple-500/50 rounded-lg px-6 py-3">
              <div className="text-gray-400 text-sm">Puntos</div>
              <div className="text-2xl font-bold text-purple-400">
                {score}/{maxScore}
              </div>
            </div>
          </div>

          {/* Ecuación con slots */}
          <div className="bg-gray-900/60 border-2 border-purple-500/30 rounded-2xl p-8 mb-8 backdrop-blur-sm">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-purple-400 mb-2">
                Ecuación Genética
              </h2>
              <p className="text-gray-400 text-sm">
                Coloca las moléculas en el orden correcto
              </p>
            </div>

            <div className="flex items-center justify-center gap-4 flex-wrap">
              {slots.map((slot, index) => (
                <div key={slot.index} className="flex items-center gap-4">
                  <motion.button
                    whileHover={
                      !slot.isCorrect && selectedMolecule ? { scale: 1.05 } : {}
                    }
                    onClick={() => handleSlotClick(slot)}
                    disabled={slot.isCorrect || !selectedMolecule}
                    className={`w-24 h-24 rounded-2xl border-4 flex items-center justify-center transition-all ${
                      slot.isCorrect
                        ? `bg-gradient-to-br ${getMoleculeColor(
                            slot.expectedType
                          )} border-green-400`
                        : selectedMolecule && !slot.isCorrect
                        ? "border-purple-400 border-dashed bg-purple-900/30 hover:bg-purple-800/30 cursor-pointer"
                        : "border-gray-700 bg-gray-800/50"
                    }`}
                  >
                    {slot.isCorrect && slot.molecule ? (
                      <motion.div
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        className="text-center"
                      >
                        <div className="text-4xl">
                          {getMoleculeEmoji(slot.molecule.type)}
                        </div>
                        <div className="text-xs text-white font-bold mt-1">
                          {getMoleculeLabel(slot.molecule.type)}
                        </div>
                      </motion.div>
                    ) : (
                      <div className="text-gray-600 text-2xl">?</div>
                    )}
                  </motion.button>

                  {index < slots.length - 1 && index !== 1 && (
                    <div className="text-purple-400 text-2xl font-bold">+</div>
                  )}
                  {index === 1 && (
                    <div className="text-purple-400 text-2xl font-bold">→</div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Moléculas disponibles */}
          <div>
            <h3 className="text-xl font-bold text-purple-400 mb-4 text-center">
              Moléculas Disponibles
            </h3>
            <div className="flex justify-center gap-4 flex-wrap">
              {molecules
                .filter((m) => !m.isPlaced)
                .map((molecule) => (
                  <motion.button
                    key={molecule.id}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleMoleculeClick(molecule)}
                    className={`w-28 h-28 rounded-2xl border-4 transition-all ${
                      selectedMolecule?.id === molecule.id
                        ? `bg-gradient-to-br ${getMoleculeColor(
                            molecule.type
                          )} border-yellow-400 shadow-lg shadow-yellow-400/50`
                        : `bg-gradient-to-br ${getMoleculeColor(
                            molecule.type
                          )} border-purple-500/50 hover:border-purple-400`
                    }`}
                  >
                    <div className="text-center">
                      <motion.div
                        animate={
                          selectedMolecule?.id === molecule.id
                            ? { scale: [1, 1.2, 1] }
                            : {}
                        }
                        transition={{ duration: 0.5, repeat: Infinity }}
                        className="text-5xl"
                      >
                        {getMoleculeEmoji(molecule.type)}
                      </motion.div>
                      <div className="text-white font-bold text-sm mt-2">
                        {getMoleculeLabel(molecule.type)}
                      </div>
                    </div>
                  </motion.button>
                ))}
            </div>
          </div>

          {/* Feedback */}
          <AnimatePresence>
            {showFeedback && (
              <motion.div
                initial={{ opacity: 0, y: -50, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className={`fixed top-1/4 left-1/2 -translate-x-1/2 px-8 py-4 rounded-2xl font-bold text-2xl ${
                  showFeedback.correct
                    ? "bg-green-500 text-white"
                    : "bg-red-500 text-white"
                }`}
              >
                {showFeedback.correct ? "✓ ¡Correcto!" : "✗ Incorrecto"}
                <span className="ml-3">
                  {showFeedback.points > 0 ? "+" : ""}
                  {showFeedback.points} pts
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Pantalla de resultados */}
      {gameState === "result" && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center z-10 max-w-2xl"
        >
          <motion.div
            animate={{ rotate: [0, 360], scale: [1, 1.2, 1] }}
            transition={{ duration: 2 }}
            className="text-8xl mb-6"
          >
            🎉
          </motion.div>

          <h2 className="text-4xl font-bold text-purple-400 mb-8">
            ¡ECUACIÓN COMPLETADA!
          </h2>

          <div className="bg-gradient-to-r from-purple-900/50 to-pink-900/50 border-2 border-purple-500 rounded-xl p-8 mb-6">
            <div className="text-gray-300 mb-2">Score Final</div>
            <div className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
              {score} / {maxScore}
            </div>

            <div className="mt-6 grid grid-cols-2 gap-4 text-left">
              <div>
                <div className="text-gray-400 text-sm">Aciertos</div>
                <div className="text-2xl font-bold text-green-400">
                  {correctPlacements}/{totalSlots}
                </div>
              </div>
              <div>
                <div className="text-gray-400 text-sm">Intentos</div>
                <div className="text-2xl font-bold text-purple-400">
                  {attempts}
                </div>
              </div>
            </div>
          </div>

          <div className="text-gray-400">Continuando a la fase final...</div>
        </motion.div>
      )}
    </div>
  );
}
