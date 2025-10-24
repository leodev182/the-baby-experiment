import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  CheckCircle,
  Download,
  Sparkles,
  Calendar,
  User,
  Heart,
} from "lucide-react";
import { getDraft } from "@/services/localStorageService";
import type { PredictionDraft } from "@/services/localStorageService";

export const SuccessScreen = () => {
  const [imageDownloaded, setImageDownloaded] = useState(false);
  const [prediction, setPrediction] = useState<PredictionDraft | null>(null);

  useEffect(() => {
    // Obtener datos del draft antes de que se limpie
    const draft = getDraft();
    setPrediction(draft);

    // Descargar invitación automáticamente después de 2 segundos
    const timer = setTimeout(() => {
      downloadInvitation();
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const downloadInvitation = () => {
    const link = document.createElement("a");
    link.href = "/images/invite.reveal.jpg";
    link.download = "invitacion-reveal-quantum-baby.jpg";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setImageDownloaded(true);
  };

  if (!prediction || !prediction.hypothesis) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-cyan-400 animate-pulse">Cargando...</div>
      </div>
    );
  }

  const hypothesisText =
    prediction.hypothesis === "XY" ? "XY (Niño)" : "XX (Niña)";
  const hypothesisColor =
    prediction.hypothesis === "XY" ? "text-blue-400" : "text-pink-400";
  const hypothesisBg =
    prediction.hypothesis === "XY" ? "bg-blue-500/20" : "bg-pink-500/20";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {/* Icono de éxito con animación */}
        <motion.div
          initial={{ scale: 0, rotate: 0 }}
          animate={{ scale: 1, rotate: 360 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="flex justify-center mb-6"
        >
          <div className="relative">
            <CheckCircle className="w-24 h-24 text-green-400" strokeWidth={2} />
            <motion.div
              animate={{
                rotate: [0, 10, -10, 10, 0],
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatDelay: 1,
              }}
              className="absolute -top-2 -right-2"
            >
              <Sparkles className="w-8 h-8 text-yellow-400" />
            </motion.div>
          </div>
        </motion.div>

        {/* Mensaje principal */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            ¡Predicción Registrada! 🎉
          </h1>
          <p className="text-lg text-purple-200">
            Tu hipótesis científica ha sido almacenada en nuestro laboratorio
            cuántico
          </p>
        </motion.div>

        {/* Card con resumen de predicción */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 shadow-2xl mb-6"
        >
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-yellow-400" />
            Resumen de tu Predicción
          </h2>

          <div className="space-y-4">
            {/* Hipótesis */}
            <div className="flex items-start gap-3">
              <div className={`${hypothesisBg} p-3 rounded-lg`}>
                <Calendar className={`w-6 h-6 ${hypothesisColor}`} />
              </div>
              <div className="flex-1">
                <p className="text-sm text-purple-200">Tu Hipótesis</p>
                <p className={`text-xl font-bold ${hypothesisColor}`}>
                  {hypothesisText}
                </p>
              </div>
            </div>

            {/* Nombre del científico */}
            <div className="flex items-start gap-3">
              <div className="bg-indigo-500/20 p-3 rounded-lg">
                <User className="w-6 h-6 text-indigo-400" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-purple-200">Científico</p>
                <p className="text-xl font-bold text-white">
                  {prediction.userName}
                </p>
              </div>
            </div>

            {/* Nombre sugerido */}
            {prediction.suggestedName && (
              <div className="flex items-start gap-3">
                <div className="bg-purple-500/20 p-3 rounded-lg">
                  <Heart className="w-6 h-6 text-purple-400" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-purple-200">Nombre Sugerido</p>
                  <p className="text-xl font-bold text-white">
                    {prediction.suggestedName}
                  </p>
                </div>
              </div>
            )}

            {/* Mensaje */}
            {prediction.message && (
              <div className="mt-4 p-4 bg-white/5 rounded-lg border border-white/10">
                <p className="text-sm text-purple-200 mb-2">Tu Mensaje</p>
                <p className="text-white italic">"{prediction.message}"</p>
              </div>
            )}

            {/* Score total */}
            <div className="mt-6 pt-6 border-t border-white/20">
              <div className="text-center">
                <p className="text-sm text-purple-200 mb-2">Puntuación Total</p>
                <div className="inline-block bg-gradient-to-r from-yellow-400 to-orange-400 text-gray-900 px-6 py-3 rounded-full font-bold text-2xl">
                  {prediction.scores.total} pts
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Sección de descarga de invitación */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-lg rounded-2xl p-6 border border-white/20 mb-6"
        >
          <div className="flex items-center gap-4">
            <Download
              className={`w-8 h-8 ${
                imageDownloaded ? "text-green-400" : "text-white"
              }`}
            />
            <div className="flex-1">
              <h3 className="text-lg font-bold text-white mb-1">
                {imageDownloaded
                  ? "¡Invitación Descargada!"
                  : "Descargando Invitación..."}
              </h3>
              <p className="text-sm text-purple-200">
                {imageDownloaded
                  ? "Revisa tu carpeta de descargas para ver los detalles del evento"
                  : "La invitación al reveal se está descargando automáticamente"}
              </p>
            </div>
            {!imageDownloaded && (
              <button
                onClick={downloadInvitation}
                className="px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-colors"
              >
                Descargar
              </button>
            )}
          </div>
        </motion.div>

        {/* Mensaje de agradecimiento */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center"
        >
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
            <p className="text-lg text-white mb-2">
              ¡Gracias por participar en este experimento cuántico! 🔬✨
            </p>
            <p className="text-purple-200">
              Nos vemos en el reveal para descubrir si tu hipótesis fue correcta
            </p>
          </div>
        </motion.div>

        {/* Botón para compartir (opcional) */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-center mt-6"
        >
          <button
            onClick={() => {
              if (navigator.share) {
                navigator.share({
                  title: "Baby Gender Reveal - Quantum Lab",
                  text: `¡Acabo de hacer mi predicción para el Baby Reveal! 🎉 Mi hipótesis: ${hypothesisText}`,
                });
              }
            }}
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-full transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            Compartir mi Predicción 📱
          </button>
        </motion.div>
      </div>
    </div>
  );
};
