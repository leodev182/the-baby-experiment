import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { updateGameScore } from "@/services/localStorageService";

interface Phase1ColliderProps {
  onComplete: (score: number) => void;
}

interface Attempt {
  score: number;
  feedback: "perfect" | "good" | "ok" | "miss";
  message: string;
}

export function Phase1Collider({ onComplete }: Phase1ColliderProps) {
  const [gameState, setGameState] = useState<"intro" | "playing" | "result">(
    "intro"
  );
  const [currentRound, setCurrentRound] = useState(0);
  const [attempts, setAttempts] = useState<Attempt[]>([]);
  const [rotation, setRotation] = useState(0);
  const [isCollisionZone, setIsCollisionZone] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [lastFeedback, setLastFeedback] = useState<Attempt | null>(null);
  const [particles, setParticles] = useState<
    Array<{ x: number; y: number; vx: number; vy: number }>
  >([]);

  const animationRef = useRef<number>();
  const speedRef = useRef(1);

  // Iniciar juego
  const startGame = () => {
    setGameState("playing");
    setCurrentRound(1);
    setAttempts([]);
    startRound();
  };

  // Iniciar una ronda
  const startRound = () => {
    setRotation(0);
    setIsCollisionZone(false);
    setShowFeedback(false);
    speedRef.current = 1 + currentRound * 0.3; // Aumenta velocidad cada ronda
    animateParticles();
  };

  // Animación de partículas orbitando
  const animateParticles = () => {
    let angle = 0;

    const animate = () => {
      angle += 2 * speedRef.current;
      setRotation(angle);

      // Zona de colisión cuando las partículas están cerca (±15 grados)
      const normalizedAngle = ((angle % 360) + 360) % 360;
      const inZone = normalizedAngle > 165 && normalizedAngle < 195;
      setIsCollisionZone(inZone);

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();
  };

  // Detener animación
  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  // Handler del click
  const handleClick = () => {
    if (gameState !== "playing" || showFeedback) return;

    // Calcular precisión
    const normalizedAngle = ((rotation % 360) + 360) % 360;
    const distanceFromPerfect = Math.abs(normalizedAngle - 180);

    let score = 0;
    let feedback: Attempt["feedback"] = "miss";
    let message = "";

    if (distanceFromPerfect < 5) {
      // Perfecto (175-185 grados)
      score = 100;
      feedback = "perfect";
      message = "¡COLISIÓN PERFECTA!";
      createExplosion();
    } else if (distanceFromPerfect < 15) {
      // Bueno (165-195 grados)
      score = 85;
      feedback = "good";
      message = "¡Excelente timing!";
      createExplosion();
    } else if (distanceFromPerfect < 30) {
      // Ok (150-210 grados)
      score = 60;
      feedback = "ok";
      message = "Casi...";
    } else {
      // Fallo
      score = 0;
      feedback = "miss";
      message = normalizedAngle < 180 ? "Demasiado pronto" : "Demasiado tarde";
    }

    const attempt: Attempt = { score, feedback, message };
    setLastFeedback(attempt);
    setShowFeedback(true);

    // Detener animación
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }

    // Esperar feedback y continuar
    setTimeout(() => {
      const newAttempts = [...attempts, attempt];
      setAttempts(newAttempts);

      if (currentRound < 3) {
        // Siguiente ronda
        setCurrentRound(currentRound + 1);
        setShowFeedback(false);
        startRound();
      } else {
        // Fin del juego
        finishGame(newAttempts);
      }
    }, 2000);
  };

  // Crear explosión de partículas
  const createExplosion = () => {
    const newParticles = Array.from({ length: 20 }, () => ({
      x: 0,
      y: 0,
      vx: (Math.random() - 0.5) * 10,
      vy: (Math.random() - 0.5) * 10,
    }));
    setParticles(newParticles);

    setTimeout(() => setParticles([]), 1000);
  };

  // Finalizar juego
  const finishGame = (finalAttempts: Attempt[]) => {
    setGameState("result");

    // Calcular score final (promedio)
    const totalScore = finalAttempts.reduce((sum, a) => sum + a.score, 0);
    const finalScore = Math.round(totalScore / 3);

    // Guardar en draft
    updateGameScore("collider", finalScore);

    // Notificar al componente padre después de mostrar resultados
    setTimeout(() => {
      onComplete(finalScore);
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center relative overflow-hidden">
      {/* Estrellas de fondo */}
      <div className="absolute inset-0">
        {Array.from({ length: 100 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0.2, 1, 0.2],
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
          className="text-center z-10 max-w-2xl px-4"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="text-8xl mb-6"
          >
            ⚛️
          </motion.div>

          <h1 className="text-5xl font-bold text-cyan-400 mb-4">
            COLISIONADOR DE PARTÍCULAS
          </h1>

          <p className="text-gray-300 text-lg mb-6">
            Haz click en el momento exacto cuando las partículas colisionen
          </p>

          <div className="bg-gray-900/80 border-2 border-cyan-500/50 rounded-xl p-6 mb-8 backdrop-blur-sm">
            <div className="space-y-3 text-left">
              <div className="flex items-center gap-3">
                <span className="text-2xl">💙</span>
                <span className="text-gray-300">Partícula Azul (Física)</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-2xl">💗</span>
                <span className="text-gray-300">Partícula Rosa (Química)</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-2xl">⭕</span>
                <span className="text-gray-300">Zona de impacto óptimo</span>
              </div>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={startGame}
            className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-pink-500 text-white text-xl font-bold rounded-lg shadow-lg hover:shadow-cyan-500/50 transition-all"
          >
            🚀 INICIAR COLISIÓN
          </motion.button>
        </motion.div>
      )}

      {/* Pantalla de juego */}
      {gameState === "playing" && (
        <div className="relative z-10">
          {/* Header con progreso */}
          <div className="absolute top-8 left-1/2 -translate-x-1/2 text-center">
            <div className="text-cyan-400 text-2xl font-bold mb-2">
              RONDA {currentRound}/3
            </div>
            <div className="flex gap-2">
              {[1, 2, 3].map((round) => (
                <div
                  key={round}
                  className={`w-16 h-2 rounded-full ${
                    round < currentRound
                      ? "bg-green-500"
                      : round === currentRound
                      ? "bg-cyan-500 animate-pulse"
                      : "bg-gray-700"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Colisionador */}
          <div
            className="relative w-96 h-96 cursor-pointer"
            onClick={handleClick}
          >
            {/* Zona de colisión */}
            <AnimatePresence>
              {isCollisionZone && !showFeedback && (
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 0.3 }}
                  exit={{ scale: 0, opacity: 0 }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <div className="w-32 h-32 border-4 border-yellow-400 rounded-full animate-pulse" />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Círculo central */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-4 h-4 bg-white rounded-full shadow-lg shadow-white/50" />
            </div>

            {/* Órbita */}
            <div className="absolute inset-0 border-2 border-gray-700 rounded-full" />

            {/* Partícula Azul (Física) */}
            <motion.div
              className="absolute top-1/2 left-1/2"
              style={{
                x: "-50%",
                y: "-50%",
              }}
              animate={{
                rotate: rotation,
              }}
              transition={{ duration: 0, ease: "linear" }}
            >
              <motion.div
                className="w-8 h-8 -ml-4 -mt-4"
                style={{ translateX: 190 }}
              >
                <div className="w-8 h-8 bg-cyan-500 rounded-full shadow-lg shadow-cyan-500/80 relative">
                  <motion.div
                    className="absolute inset-0 bg-cyan-400 rounded-full"
                    animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0, 0.5] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  />
                </div>
              </motion.div>
            </motion.div>

            {/* Partícula Rosa (Química) */}
            <motion.div
              className="absolute top-1/2 left-1/2"
              style={{
                x: "-50%",
                y: "-50%",
              }}
              animate={{
                rotate: rotation + 180,
              }}
              transition={{ duration: 0, ease: "linear" }}
            >
              <motion.div
                className="w-8 h-8 -ml-4 -mt-4"
                style={{ translateX: 190 }}
              >
                <div className="w-8 h-8 bg-pink-500 rounded-full shadow-lg shadow-pink-500/80 relative">
                  <motion.div
                    className="absolute inset-0 bg-pink-400 rounded-full"
                    animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0, 0.5] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  />
                </div>
              </motion.div>
            </motion.div>

            {/* Partículas de explosión */}
            <AnimatePresence>
              {particles.map((particle, i) => (
                <motion.div
                  key={i}
                  className="absolute top-1/2 left-1/2 w-2 h-2 rounded-full bg-gradient-to-r from-cyan-400 to-pink-400"
                  initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
                  animate={{
                    x: particle.vx * 50,
                    y: particle.vy * 50,
                    opacity: 0,
                    scale: 0,
                  }}
                  transition={{ duration: 1 }}
                />
              ))}
            </AnimatePresence>
          </div>

          {/* Feedback */}
          <AnimatePresence>
            {showFeedback && lastFeedback && (
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0 }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center"
              >
                <div
                  className={`text-6xl font-bold mb-2 ${
                    lastFeedback.feedback === "perfect"
                      ? "text-yellow-400"
                      : lastFeedback.feedback === "good"
                      ? "text-green-400"
                      : lastFeedback.feedback === "ok"
                      ? "text-orange-400"
                      : "text-red-400"
                  }`}
                >
                  {lastFeedback.feedback === "perfect" && "✨"}
                  {lastFeedback.feedback === "good" && "⭐"}
                  {lastFeedback.feedback === "ok" && "💫"}
                  {lastFeedback.feedback === "miss" && "❌"}
                </div>
                <div className="text-3xl font-bold text-white mb-2">
                  {lastFeedback.message}
                </div>
                <div className="text-5xl font-bold text-cyan-400">
                  +{lastFeedback.score} pts
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Instrucción */}
          {!showFeedback && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute bottom-8 left-1/2 -translate-x-1/2 text-center"
            >
              <div
                className={`text-xl font-bold ${
                  isCollisionZone
                    ? "text-yellow-400 animate-pulse"
                    : "text-gray-400"
                }`}
              >
                {isCollisionZone
                  ? "¡CLICK AHORA! ⚡"
                  : "Espera el momento perfecto..."}
              </div>
            </motion.div>
          )}
        </div>
      )}

      {/* Pantalla de resultados */}
      {gameState === "result" && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center z-10 max-w-2xl px-4"
        >
          <motion.div
            animate={{ rotate: [0, 360], scale: [1, 1.2, 1] }}
            transition={{ duration: 2 }}
            className="text-8xl mb-6"
          >
            🎉
          </motion.div>

          <h2 className="text-4xl font-bold text-cyan-400 mb-8">
            ¡COLISIÓN COMPLETADA!
          </h2>

          {/* Resultados por ronda */}
          <div className="space-y-3 mb-8">
            {attempts.map((attempt, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.2 }}
                className="bg-gray-900/80 border-2 border-cyan-500/50 rounded-lg p-4 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">
                    {attempt.feedback === "perfect" && "✨"}
                    {attempt.feedback === "good" && "⭐"}
                    {attempt.feedback === "ok" && "💫"}
                    {attempt.feedback === "miss" && "❌"}
                  </span>
                  <span className="text-gray-300">Ronda {i + 1}</span>
                </div>
                <span className="text-2xl font-bold text-cyan-400">
                  {attempt.score} pts
                </span>
              </motion.div>
            ))}
          </div>

          {/* Score final */}
          <div className="bg-gradient-to-r from-cyan-900/50 to-pink-900/50 border-2 border-cyan-500 rounded-xl p-6 mb-6">
            <div className="text-gray-300 mb-2">Score Final</div>
            <div className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-pink-400">
              {Math.round(attempts.reduce((sum, a) => sum + a.score, 0) / 3)} /
              100
            </div>
          </div>

          <div className="text-gray-400">
            Continuando a la siguiente fase...
          </div>
        </motion.div>
      )}
    </div>
  );
}
