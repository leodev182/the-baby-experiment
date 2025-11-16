import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export function BabyShowerSuccess() {
  const [confetti, setConfetti] = useState<
    { id: number; x: number; delay: number }[]
  >([]);

  useEffect(() => {
    // Generar confetti
    const items = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      delay: Math.random() * 2,
    }));
    setConfetti(items);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-900 via-purple-900 to-pink-900 flex items-center justify-center p-4 overflow-hidden relative">
      {/* Confetti Animation */}
      {confetti.map((item) => (
        <motion.div
          key={item.id}
          initial={{ y: -100, opacity: 1 }}
          animate={{ y: window.innerHeight + 100, opacity: 0 }}
          transition={{
            duration: 3,
            delay: item.delay,
            ease: "linear",
            repeat: Infinity,
          }}
          className="absolute w-3 h-3 rounded-full"
          style={{
            left: `${item.x}%`,
            backgroundColor: ["#60a5fa", "#f472b6", "#fbbf24"][
              Math.floor(Math.random() * 3)
            ],
          }}
        />
      ))}

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 md:p-12 max-w-2xl w-full text-center relative z-10"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
          className="text-8xl mb-6"
        >
          🎉
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-4xl md:text-5xl font-bold text-white mb-4"
        >
          ¡Confirmación Exitosa!
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="space-y-4 text-white/90 text-lg mb-8"
        >
          <p>
            Gracias por confirmar tu asistencia al Baby Shower de{" "}
            <span className="font-bold text-blue-300">Mateo Ignacio</span>
          </p>

          <div className="bg-white/10 rounded-lg p-6 space-y-2">
            <p className="text-2xl font-bold">📅 7 de Diciembre de 2025</p>
            <p className="text-xl">🕐 14:00 - 18:30 hrs</p>
            <p className="text-lg">📍 Irarrázaval 200, Salón de Eventos</p>
          </div>

          <p className="text-white/80">
            Nos emociona mucho compartir este momento especial contigo 💙
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="space-y-4"
        >
          <a
            href="/"
            className="inline-block bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-bold py-3 px-8 rounded-lg transition-all duration-300 transform hover:scale-105"
          >
            Volver al inicio
          </a>

          <p className="text-white/60 text-sm">
            Si necesitas modificar tu confirmación, por favor contáctanos
            directamente
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
