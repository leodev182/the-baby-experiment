import { motion } from "framer-motion";
import { useState } from "react";

interface DeclineModalProps {
  onClose: () => void;
  onConfirm: () => void;
}

export function DeclineModal({ onClose, onConfirm }: DeclineModalProps) {
  const [isDownloading, setIsDownloading] = useState(false);

  async function handleDownloadCard() {
    setIsDownloading(true);

    try {
      // Crear canvas con el mensaje
      const canvas = document.createElement("canvas");
      canvas.width = 1080;
      canvas.height = 1920;
      const ctx = canvas.getContext("2d")!;

      // Fondo degradado (similar a la invitación)
      const gradient = ctx.createLinearGradient(0, 0, 0, 1920);
      gradient.addColorStop(0, "#1e3a8a"); // blue-900
      gradient.addColorStop(0.5, "#581c87"); // purple-900
      gradient.addColorStop(1, "#831843"); // pink-900
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 1080, 1920);

      // Estrellas decorativas
      ctx.fillStyle = "rgba(255, 255, 255, 0.6)";
      const stars = [
        { x: 150, y: 200, size: 8 },
        { x: 900, y: 300, size: 6 },
        { x: 200, y: 1600, size: 7 },
        { x: 850, y: 1700, size: 9 },
        { x: 540, y: 400, size: 10 },
      ];
      stars.forEach((star) => {
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();
      });

      // Emojis
      ctx.font = "120px Arial";
      ctx.textAlign = "center";
      ctx.fillText("💙 💗 💛", 540, 300);

      // Texto del mensaje
      ctx.fillStyle = "white";
      ctx.font = "bold 48px Arial";
      ctx.textAlign = "center";

      const lines = [
        "Para nosotros 3,",
        "lo más importante es",
        "que sepas que eres",
        "parte de nuestra familia.",
        "",
        "Entendemos perfectamente",
        "y te apoyamos en tu",
        "compromiso o actividad,",
        "recuerda mantenerte",
        "en contacto.",
        "",
        "Con muchísimo cariño:",
        "Anabel, Leo y Mateo 💕",
      ];

      let y = 500;
      lines.forEach((line) => {
        ctx.fillText(line, 540, y);
        y += 80;
      });

      // Convertir a blob y descargar
      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = url;
          link.download = "baby-shower-mensaje.png";
          link.click();
          URL.revokeObjectURL(url);
        }
        setIsDownloading(false);
      });
    } catch (error) {
      console.error("Error generating card:", error);
      setIsDownloading(false);
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-gradient-to-b from-blue-900 via-purple-900 to-pink-900 border-2 border-white/20 rounded-2xl p-8 max-w-lg w-full text-center relative"
      >
        {/* Estrellas decorativas */}
        <div className="absolute top-4 left-4 text-2xl">✨</div>
        <div className="absolute top-4 right-4 text-2xl">✨</div>
        <div className="absolute bottom-4 left-4 text-2xl">💫</div>
        <div className="absolute bottom-4 right-4 text-2xl">💫</div>

        <div className="text-6xl mb-6">💙 💗 💛</div>

        <div className="space-y-4 text-white text-lg leading-relaxed mb-8">
          <p>
            Para nosotros 3, lo más importante es que sepas que eres parte de
            nuestra familia.
          </p>
          <p>
            Entendemos perfectamente y te apoyamos en tu compromiso o actividad,
            recuerda mantenerte en contacto.
          </p>
          <p className="font-semibold text-xl">
            Con muchísimo cariño:
            <br />
            Anabel, Leo y Mateo 💕
          </p>
        </div>

        <div className="space-y-3">
          <button
            onClick={handleDownloadCard}
            disabled={isDownloading}
            className="w-full bg-white/20 hover:bg-white/30 border border-white/40 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 disabled:opacity-50"
          >
            {isDownloading ? "Generando..." : "📥 Descargar Mensaje"}
          </button>

          <button
            onClick={onConfirm}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300"
          >
            Confirmar que no asistiré
          </button>

          <button
            onClick={onClose}
            className="w-full bg-transparent hover:bg-white/10 text-white/80 font-medium py-3 px-6 rounded-lg transition-all duration-300"
          >
            Volver
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
