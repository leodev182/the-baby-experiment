import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { updateGameScore } from "@/services/localStorageService";

interface Phase3SynthesisProps {
  onComplete: (score: number) => void;
}

interface Ingredient {
  id: number;
  name: string;
  color: string;
  emoji: string;
  gradient: string;
}

const INGREDIENTS: Ingredient[] = [
  {
    id: 1,
    name: "Elemento Paterno",
    color: "cyan",
    emoji: "💙",
    gradient: "from-cyan-500 to-blue-600",
  },
  {
    id: 2,
    name: "Elemento Materno",
    color: "pink",
    emoji: "💗",
    gradient: "from-pink-500 to-rose-600",
  },
  {
    id: 3,
    name: "Amor",
    color: "purple",
    emoji: "💜",
    gradient: "from-purple-500 to-violet-600",
  },
  {
    id: 4,
    name: "Esperanza",
    color: "yellow",
    emoji: "💛",
    gradient: "from-yellow-400 to-amber-500",
  },
  {
    id: 5,
    name: "Energía",
    color: "orange",
    emoji: "🧡",
    gradient: "from-orange-500 to-red-500",
  },
  {
    id: 6,
    name: "Vida Nueva",
    color: "white",
    emoji: "✨",
    gradient: "from-white to-gray-200",
  },
];

export function Phase3Synthesis({ onComplete }: Phase3SynthesisProps) {
  const [gameState, setGameState] = useState<"intro" | "playing" | "result">(
    "intro"
  );
  const [sequence, setSequence] = useState<number[]>([]);
  const [errors, setErrors] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [showFeedback, setShowFeedback] = useState<"correct" | "wrong" | null>(
    null
  );
  const [bubbles, setBubbles] = useState<
    Array<{ id: number; x: number; y: number }>
  >([]);
  const [confetti, setConfetti] = useState<
    Array<{ id: number; x: number; y: number; color: string }>
  >([]);
  const [correctSequence, setCorrectSequence] = useState<number[]>([]);
  const [showSequence, setShowSequence] = useState(true);

  const shuffleArray = <T,>(array: T[]): T[] => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const startGame = () => {
    const randomSequence = shuffleArray([1, 2, 3, 4, 5, 6]);
    setCorrectSequence(randomSequence);
    setGameState("playing");
    setSequence([]);
    setErrors(0);
    setCurrentStep(0);
    setShowSequence(true);

    setTimeout(() => {
      setShowSequence(false);
    }, 8000);
  };

  const handleIngredientClick = (ingredientId: number) => {
    if (gameState !== "playing" || sequence.includes(ingredientId)) return;

    const expectedId = correctSequence[currentStep];
    const isCorrect = ingredientId === expectedId;

    if (isCorrect) {
      setSequence([...sequence, ingredientId]);
      setCurrentStep(currentStep + 1);
      setShowFeedback("correct");
      createBubbles();

      if (currentStep === correctSequence.length - 1) {
        setTimeout(() => {
          finishGame();
        }, 1500);
      }
    } else {
      setErrors(errors + 1);
      setShowFeedback("wrong");
    }

    setTimeout(() => setShowFeedback(null), 1000);
  };

  const createBubbles = () => {
    const newBubbles = Array.from({ length: 15 }, (_, i) => ({
      id: Date.now() + i,
      x: Math.random() * 100 - 50,
      y: Math.random() * 100 - 50,
    }));
    setBubbles(newBubbles);
    setTimeout(() => setBubbles([]), 2000);
  };

  const createConfetti = () => {
    const colors = [
      "#06b6d4",
      "#ec4899",
      "#a855f7",
      "#fbbf24",
      "#f97316",
      "#ffffff",
    ];
    const newConfetti = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: Math.random() * window.innerWidth,
      y: -50,
      color: colors[Math.floor(Math.random() * colors.length)],
    }));
    setConfetti(newConfetti);
    setTimeout(() => setConfetti([]), 4000);
  };

  const finishGame = () => {
    setGameState("result");
    createConfetti();

    let finalScore = 100;
    if (errors === 1) finalScore = 85;
    else if (errors === 2) finalScore = 70;
    else if (errors >= 3) finalScore = 50;

    updateGameScore("synthesis", finalScore);

    setTimeout(() => {
      onComplete(finalScore);
    }, 4000);
  };

  const getFlaskColor = () => {
    if (sequence.length === 0) return "from-gray-600 to-gray-700";
    if (sequence.length <= 2) return "from-cyan-500 to-pink-500";
    if (sequence.length <= 4) return "from-purple-500 to-yellow-500";
    return "from-yellow-400 to-white";
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-indigo-900/20 to-black flex items-center justify-center relative overflow-hidden p-4">
      {/* Vapor de fondo */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-32 h-32 bg-white/5 rounded-full blur-3xl"
            style={{
              left: `${Math.random() * 100}%`,
              bottom: -50,
            }}
            animate={{
              y: [-50, -window.innerHeight - 100],
              opacity: [0, 0.3, 0],
              scale: [0.5, 1.5, 0.5],
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              delay: Math.random() * 5,
            }}
          />
        ))}
      </div>

      {/* Confetti */}
      <AnimatePresence>
        {confetti.map((item) => (
          <motion.div
            key={item.id}
            className="absolute w-3 h-3 rounded-sm"
            style={{
              left: item.x,
              backgroundColor: item.color,
            }}
            initial={{ y: item.y, rotate: 0, opacity: 1 }}
            animate={{
              y: window.innerHeight + 100,
              rotate: Math.random() * 720,
              opacity: [1, 1, 0],
            }}
            transition={{ duration: 3, ease: "easeIn" }}
          />
        ))}
      </AnimatePresence>

      {/* Pantalla de intro */}
      {gameState === "intro" && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center z-10 max-w-2xl"
        >
          <motion.div
            animate={{
              y: [0, -10, 0],
              rotate: [0, 5, -5, 0],
            }}
            transition={{ duration: 3, repeat: Infinity }}
            className="text-8xl mb-6"
          >
            💊
          </motion.div>

          <h1 className="text-5xl font-bold text-indigo-400 mb-4">
            SÍNTESIS FARMACÉUTICA
          </h1>

          <p className="text-gray-300 text-lg mb-6">
            Combina los ingredientes en el orden correcto para crear la fórmula
            perfecta
          </p>

          <div className="bg-gray-900/80 border-2 border-indigo-500/50 rounded-xl p-6 mb-8 backdrop-blur-sm">
            <div className="text-left space-y-2">
              <div className="text-white font-semibold mb-3">
                Memoriza la secuencia (será única para ti):
              </div>
              <div className="text-gray-400 text-sm mb-3">
                El orden se generará al iniciar el juego
              </div>
              <div className="grid grid-cols-3 gap-2">
                {INGREDIENTS.map((ing) => (
                  <div
                    key={ing.id}
                    className="flex items-center gap-2 bg-gray-800/50 rounded p-2"
                  >
                    <span className="text-xl">{ing.emoji}</span>
                    <span className="text-gray-300 text-sm">{ing.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={startGame}
            className="px-8 py-4 bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-xl font-bold rounded-lg shadow-lg hover:shadow-indigo-500/50 transition-all"
          >
            🧪 INICIAR SÍNTESIS
          </motion.button>
        </motion.div>
      )}

      {/* Pantalla de juego */}
      {gameState === "playing" && (
        <div className="w-full max-w-4xl z-10 h-screen flex flex-col justify-center py-2">
          {/* Header */}
          <div className="flex justify-between items-center mb-2">
            <div className="bg-gray-900/80 border-2 border-indigo-500/50 rounded-lg px-3 py-1">
              <div className="text-gray-400 text-xs">Progreso</div>
              <div className="text-lg font-bold text-indigo-400">
                {sequence.length}/{INGREDIENTS.length}
              </div>
            </div>

            <div className="bg-gray-900/80 border-2 border-indigo-500/50 rounded-lg px-3 py-1">
              <div className="text-gray-400 text-xs">Errores</div>
              <div className="text-lg font-bold text-red-400">{errors}</div>
            </div>
          </div>

          {/* Secuencia objetivo - desaparece después de 8 segundos */}
          <AnimatePresence>
            {showSequence && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="mb-2 bg-yellow-500/20 border-2 border-yellow-500 rounded-xl p-2 backdrop-blur-sm"
              >
                <div className="text-center">
                  <div className="text-yellow-400 text-xs font-bold mb-1 flex items-center justify-center gap-2">
                    ⚠️ ¡MEMORIZA!
                    <motion.span
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 1, repeat: Infinity }}
                    >
                      ⏱️
                    </motion.span>
                  </div>
                  <div className="flex justify-center gap-1 flex-wrap">
                    {correctSequence.map((id, index) => {
                      const ing = INGREDIENTS.find((i) => i.id === id);
                      return (
                        <div
                          key={index}
                          className="flex items-center gap-1 px-2 py-1 rounded-lg bg-yellow-500/30 border border-yellow-400"
                        >
                          <span className="text-yellow-300 text-xs font-mono font-bold">
                            {index + 1}.
                          </span>
                          <span className="text-lg">{ing?.emoji}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Matraz principal */}
          <div className="flex justify-center mb-2 relative">
            <div className="relative scale-50">
              {/* Burbujas */}
              <AnimatePresence>
                {bubbles.map((bubble) => (
                  <motion.div
                    key={bubble.id}
                    className="absolute top-1/2 left-1/2 w-4 h-4 bg-white/50 rounded-full"
                    initial={{ scale: 0, x: 0, y: 0 }}
                    animate={{
                      scale: [0, 1, 0],
                      x: bubble.x,
                      y: bubble.y - 100,
                      opacity: [1, 1, 0],
                    }}
                    transition={{ duration: 2 }}
                  />
                ))}
              </AnimatePresence>

              {/* Matraz */}
              <motion.div
                animate={sequence.length > 0 ? { scale: [1, 1.02, 1] } : {}}
                transition={{ duration: 2, repeat: Infinity }}
                className="relative"
              >
                <svg
                  width="200"
                  height="300"
                  viewBox="0 0 200 300"
                  className="drop-shadow-2xl"
                >
                  <defs>
                    <linearGradient
                      id="flaskGradient"
                      x1="0%"
                      y1="0%"
                      x2="0%"
                      y2="100%"
                    >
                      <stop
                        offset="0%"
                        className={`${getFlaskColor().split(" ")[0]}`}
                      />
                      <stop
                        offset="100%"
                        className={`${getFlaskColor().split(" ")[1]}`}
                      />
                    </linearGradient>
                  </defs>

                  <rect
                    x="85"
                    y="10"
                    width="30"
                    height="60"
                    fill="#374151"
                    stroke="#9ca3af"
                    strokeWidth="2"
                  />

                  <path
                    d="M 85 70 L 40 180 Q 40 250 100 250 Q 160 250 160 180 L 115 70 Z"
                    fill="url(#flaskGradient)"
                    stroke="#9ca3af"
                    strokeWidth="3"
                    opacity="0.9"
                  />

                  {sequence.length > 0 && (
                    <motion.ellipse
                      cx="100"
                      cy="160"
                      rx="50"
                      ry="10"
                      fill="white"
                      opacity="0.3"
                      animate={{
                        ry: [10, 15, 10],
                        opacity: [0.3, 0.5, 0.3],
                      }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  )}
                </svg>

                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-3xl">
                  {sequence.length > 0 && (
                    <motion.div
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      className="flex gap-1"
                    >
                      {sequence.map((id) => {
                        const ing = INGREDIENTS.find((i) => i.id === id);
                        return <span key={id}>{ing?.emoji}</span>;
                      })}
                    </motion.div>
                  )}
                </div>
              </motion.div>

              {sequence.length > 0 && (
                <motion.div
                  className="absolute -top-10 left-1/2 -translate-x-1/2"
                  animate={{ y: [0, -30, 0], opacity: [0.5, 0.2, 0.5] }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  <div className="text-4xl">☁️</div>
                </motion.div>
              )}
            </div>
          </div>

          {/* Ingredientes */}
          <div>
            <h3 className="text-lg font-bold text-indigo-400 mb-2 text-center">
              Ingredientes
            </h3>
            <div className="grid grid-cols-3 gap-2 max-w-lg mx-auto">
              {INGREDIENTS.map((ingredient) => {
                const isUsed = sequence.includes(ingredient.id);

                return (
                  <motion.button
                    key={ingredient.id}
                    whileHover={!isUsed ? { scale: 1.05 } : {}}
                    whileTap={!isUsed ? { scale: 0.95 } : {}}
                    onClick={() => handleIngredientClick(ingredient.id)}
                    disabled={isUsed}
                    className={`relative p-2 rounded-lg border-2 transition-all ${
                      isUsed
                        ? "bg-gray-800 border-gray-700 opacity-50 cursor-not-allowed"
                        : `bg-gradient-to-br ${ingredient.gradient} border-indigo-500/50 hover:border-indigo-400 cursor-pointer`
                    }`}
                  >
                    <div className="text-center">
                      <div className="text-3xl">{ingredient.emoji}</div>
                      <div className="text-white font-bold text-[10px] leading-tight mt-1">
                        {ingredient.name}
                      </div>
                    </div>

                    {isUsed && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-4xl">✓</div>
                      </div>
                    )}
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* Feedback */}
          <AnimatePresence>
            {showFeedback && (
              <motion.div
                initial={{ opacity: 0, scale: 0.5, y: 50 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.5 }}
                className={`fixed top-1/4 left-1/2 -translate-x-1/2 px-8 py-4 rounded-2xl font-bold text-3xl ${
                  showFeedback === "correct"
                    ? "bg-green-500 text-white"
                    : "bg-red-500 text-white"
                }`}
              >
                {showFeedback === "correct"
                  ? "✓ ¡Perfecto!"
                  : "✗ Ingrediente incorrecto"}
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
            animate={{
              rotate: [0, 360],
              scale: [1, 1.3, 1],
            }}
            transition={{ duration: 2 }}
            className="text-9xl mb-6"
          >
            ✨
          </motion.div>

          <h2 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 mb-4">
            ¡FÓRMULA PERFECTA!
          </h2>

          <p className="text-2xl text-gray-300 mb-8">
            Síntesis completada con éxito
          </p>

          <div className="bg-gradient-to-r from-indigo-900/50 to-purple-900/50 border-2 border-indigo-500 rounded-xl p-8 mb-6">
            <div className="text-gray-300 mb-2">Score Final</div>
            <div className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-pink-400">
              {errors === 0 ? 100 : errors === 1 ? 85 : errors === 2 ? 70 : 50}{" "}
              / 100
            </div>

            <div className="mt-6 flex justify-center gap-8">
              <div>
                <div className="text-gray-400 text-sm">Secuencia Completa</div>
                <div className="text-3xl font-bold text-green-400">✓</div>
              </div>
              <div>
                <div className="text-gray-400 text-sm">Errores</div>
                <div className="text-3xl font-bold text-indigo-400">
                  {errors}
                </div>
              </div>
            </div>
          </div>

          <motion.div
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-indigo-400 text-lg"
          >
            Enviando predicción a Firebase...
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
