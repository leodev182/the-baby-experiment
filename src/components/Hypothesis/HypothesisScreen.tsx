import { useState } from "react";
import { motion } from "framer-motion";
import { updateHypothesis } from "@/services/localStorageService";
import type { Hypothesis } from "@/types";

interface HypothesisScreenProps {
  onHypothesisSelect: (hypothesis: Hypothesis) => void;
}

export function HypothesisScreen({
  onHypothesisSelect,
}: HypothesisScreenProps) {
  const [selectedHypothesis, setSelectedHypothesis] =
    useState<Hypothesis | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleSelect = (hypothesis: Hypothesis) => {
    setSelectedHypothesis(hypothesis);
    setShowConfirmation(true);
  };

  const handleConfirm = () => {
    if (selectedHypothesis) {
      // Guardar en localStorage (NO en Firebase todavía)
      updateHypothesis(selectedHypothesis);

      // Notificar al componente padre para cambiar de fase
      onHypothesisSelect(selectedHypothesis);
    }
  };

  const handleChangeSelection = () => {
    setSelectedHypothesis(null);
    setShowConfirmation(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black flex items-center justify-center p-4 overflow-hidden relative">
      {/* Grid de fondo estilo matriz */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="h-full w-full"
          style={{
            backgroundImage:
              "linear-gradient(cyan 1px, transparent 1px), linear-gradient(90deg, cyan 1px, transparent 1px)",
            backgroundSize: "50px 50px",
          }}
        />
      </div>

      {/* Partículas flotantes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-cyan-400 rounded-full"
            initial={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
              opacity: 0,
            }}
            animate={{
              y: [null, Math.random() * window.innerHeight],
              opacity: [0, 0.6, 0],
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        ))}
      </div>

      <div className="max-w-4xl w-full relative z-10">
        {/* Header con efecto glitch */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-cyan-400 mb-2 tracking-wider">
            🔬 LABORATORIO DE HIPÓTESIS
          </h1>
          <motion.p
            className="text-gray-400 text-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Formule su predicción científica
          </motion.p>
        </motion.div>

        {!showConfirmation ? (
          <>
            {/* Cards de selección */}
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              {/* Card XY (NIÑO) */}
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                whileHover={{ scale: 1.05 }}
                onClick={() => handleSelect("XY")}
                className="relative group"
              >
                <div className="relative bg-gradient-to-br from-blue-900/50 to-cyan-900/50 border-2 border-cyan-500/50 rounded-2xl p-8 backdrop-blur-sm hover:border-cyan-400 transition-all duration-300 hover:shadow-[0_0_30px_rgba(34,211,238,0.3)]">
                  {/* Scan lines effect */}
                  <div className="absolute inset-0 opacity-20 pointer-events-none">
                    <div
                      className="h-full w-full"
                      style={{
                        backgroundImage:
                          "repeating-linear-gradient(0deg, transparent, transparent 2px, cyan 2px, cyan 4px)",
                      }}
                    />
                  </div>

                  {/* Contenido */}
                  <div className="relative z-10">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 20,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                      className="text-6xl mb-4"
                    >
                      💙
                    </motion.div>
                    <h3 className="text-3xl font-bold text-cyan-400 mb-2">
                      XY
                    </h3>
                    <p className="text-gray-400">Variable XY Dominante</p>

                    {/* Atom icon decorativo */}
                    <motion.div
                      className="mt-4 opacity-50"
                      animate={{ rotate: -360 }}
                      transition={{
                        duration: 15,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                    >
                      ⚛️
                    </motion.div>
                  </div>

                  {/* Glow effect on hover */}
                  <div className="absolute inset-0 bg-cyan-500/0 group-hover:bg-cyan-500/10 rounded-2xl transition-all duration-300" />
                </div>
              </motion.button>

              {/* Card XX (NIÑA) */}
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6, duration: 0.5 }}
                whileHover={{ scale: 1.05 }}
                onClick={() => handleSelect("XX")}
                className="relative group"
              >
                <div className="relative bg-gradient-to-br from-pink-900/50 to-rose-900/50 border-2 border-pink-500/50 rounded-2xl p-8 backdrop-blur-sm hover:border-pink-400 transition-all duration-300 hover:shadow-[0_0_30px_rgba(236,72,153,0.3)]">
                  {/* Scan lines effect */}
                  <div className="absolute inset-0 opacity-20 pointer-events-none">
                    <div
                      className="h-full w-full"
                      style={{
                        backgroundImage:
                          "repeating-linear-gradient(0deg, transparent, transparent 2px, #ec4899 2px, #ec4899 4px)",
                      }}
                    />
                  </div>

                  {/* Contenido */}
                  <div className="relative z-10">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 20,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                      className="text-6xl mb-4"
                    >
                      💗
                    </motion.div>
                    <h3 className="text-3xl font-bold text-pink-400 mb-2">
                      XX
                    </h3>
                    <p className="text-gray-400">Variable XX Estable</p>

                    {/* Atom icon decorativo */}
                    <motion.div
                      className="mt-4 opacity-50"
                      animate={{ rotate: -360 }}
                      transition={{
                        duration: 15,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                    >
                      ⚛️
                    </motion.div>
                  </div>

                  {/* Glow effect on hover */}
                  <div className="absolute inset-0 bg-pink-500/0 group-hover:bg-pink-500/10 rounded-2xl transition-all duration-300" />
                </div>
              </motion.button>
            </div>

            {/* Barra de probabilidad */}
            <motion.div
              initial={{ opacity: 0, scaleX: 0 }}
              animate={{ opacity: 1, scaleX: 1 }}
              transition={{ delay: 0.8, duration: 0.8 }}
              className="text-center"
            >
              <p className="text-gray-400 mb-2">Probabilidad inicial</p>
              <div className="flex items-center justify-center gap-4">
                <span className="text-cyan-400 font-mono">50%</span>
                <div className="w-64 h-2 bg-gray-800 rounded-full overflow-hidden">
                  <div className="h-full w-1/2 bg-gradient-to-r from-cyan-500 to-pink-500" />
                </div>
                <span className="text-pink-400 font-mono">50%</span>
              </div>
            </motion.div>
          </>
        ) : (
          /* Pantalla de confirmación */
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
          >
            <div
              className={`max-w-md mx-auto bg-gradient-to-br ${
                selectedHypothesis === "XY"
                  ? "from-blue-900/50 to-cyan-900/50 border-cyan-500"
                  : "from-pink-900/50 to-rose-900/50 border-pink-500"
              } border-2 rounded-2xl p-8 backdrop-blur-sm`}
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", duration: 0.6 }}
                className="text-7xl mb-4"
              >
                {selectedHypothesis === "XY" ? "💙" : "💗"}
              </motion.div>

              <h2 className="text-3xl font-bold text-white mb-4">
                Hipótesis Registrada
              </h2>

              <p className="text-gray-300 mb-6">
                Has seleccionado:{" "}
                <span
                  className={`font-bold ${
                    selectedHypothesis === "XY"
                      ? "text-cyan-400"
                      : "text-pink-400"
                  }`}
                >
                  {selectedHypothesis}
                </span>
              </p>

              <div className="flex gap-4 justify-center">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleChangeSelection}
                  className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-semibold transition-colors"
                >
                  Cambiar
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleConfirm}
                  className={`px-6 py-3 ${
                    selectedHypothesis === "XY"
                      ? "bg-cyan-500 hover:bg-cyan-600"
                      : "bg-pink-500 hover:bg-pink-600"
                  } text-white rounded-lg font-semibold transition-colors shadow-lg`}
                >
                  Confirmar
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
