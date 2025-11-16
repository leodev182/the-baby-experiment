import { useState } from "react";
import { motion } from "framer-motion";

interface MemoryCardProps {
  guestName: string;
}

export function MemoryCard({ guestName }: MemoryCardProps) {
  const [isDownloading, setIsDownloading] = useState(false);

  async function handleDownloadCard() {
    setIsDownloading(true);

    try {
      const canvas = document.createElement("canvas");
      canvas.width = 1080;
      canvas.height = 1920;
      const ctx = canvas.getContext("2d")!;

      // Fondo degradado
      const gradient = ctx.createLinearGradient(0, 0, 0, 1920);
      gradient.addColorStop(0, "#1e3a8a");
      gradient.addColorStop(0.5, "#581c87");
      gradient.addColorStop(1, "#831843");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 1080, 1920);

      // Capa de difuminado para que el texto sea legible
      ctx.fillStyle = "rgba(0, 0, 0, 0.4)";
      ctx.fillRect(0, 0, 1080, 1920);

      // Estrellas decorativas (pequeñas y sutiles)
      ctx.fillStyle = "rgba(255, 255, 255, 0.3)";
      const stars = [
        { x: 150, y: 200, size: 4 },
        { x: 900, y: 300, size: 3 },
        { x: 200, y: 1600, size: 3 },
        { x: 850, y: 1700, size: 4 },
        { x: 540, y: 400, size: 5 },
        { x: 300, y: 800, size: 3 },
        { x: 800, y: 1200, size: 4 },
      ];
      stars.forEach((star) => {
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();
      });

      // Cohete simple en el centro superior
      ctx.fillStyle = "rgba(255, 255, 255, 0.2)";
      ctx.beginPath();
      ctx.moveTo(540, 250);
      ctx.lineTo(580, 350);
      ctx.lineTo(540, 330);
      ctx.lineTo(500, 350);
      ctx.closePath();
      ctx.fill();

      // Texto del mensaje
      ctx.fillStyle = "white";
      ctx.textAlign = "center";

      // Título
      ctx.font = "bold 56px Arial";
      ctx.fillText("💙 Baby Shower 💗", 540, 450);

      ctx.font = "bold 64px Arial";
      ctx.fillText("Mateo Ignacio", 540, 550);

      // Mensaje principal - línea por línea con espaciado
      ctx.font = "38px Arial";
      const lines = [
        "Aunque la distancia nos juegue",
        "en contra esta vez, igual están",
        "en cada detalle del Baby Shower…",
        "y sobre todo en nuestra vida diaria.",
        "",
        "Los quisiéramos aquí: metidos en",
        "la foto, en el ruido, en la risa.",
        "",
        "Pero entendemos que están donde",
        "tienen que estar, haciendo su vida",
        "y enviándonos buena vibra desde",
        "otros países.",
        "",
        "Este bebé ya viene con un fandom",
        "internacional gracias a ustedes.",
        "",
        "Y cuando llegue el momento,",
        "lo van a consentir, apapachar",
        "y malcriar igualito—ya sea por",
        "videollamada, por mensajes o cuando",
        "por fin podamos abrazarnos de verdad.",
        "",
        "Los extrañamos muchísimo.",
        "Gracias por ser parte de esto,",
        "incluso desde lejos.",
      ];

      let y = 700;
      lines.forEach((line) => {
        ctx.fillText(line, 540, y);
        y += 50;
      });

      // Firma
      ctx.font = "bold 48px Arial";
      y += 50;
      ctx.fillText("Con amor, siempre.", 540, y);
      ctx.fillText("Mateo y sus papás 💕", 540, y + 60);

      // Convertir a blob y descargar
      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = url;
          link.download = `baby-shower-recuerdo-${guestName
            .replace(/\s+/g, "-")
            .toLowerCase()}.png`;
          link.click();
          URL.revokeObjectURL(url);
        }
        setIsDownloading(false);
      });
    } catch (error) {
      console.error("Error generating memory card:", error);
      setIsDownloading(false);
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/5 rounded-lg p-8 text-center space-y-6"
    >
      <div className="text-6xl mb-4">💙 💗 🚀</div>

      <h3 className="text-2xl font-bold text-white mb-4">Hola, {guestName}!</h3>

      <p className="text-white/80 text-lg leading-relaxed">
        Sabemos que la distancia nos separa esta vez, pero queremos que tengas
        un recuerdo especial de este momento tan importante para nosotros.
      </p>

      <button
        onClick={handleDownloadCard}
        disabled={isDownloading}
        className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 disabled:from-gray-500 disabled:to-gray-600 text-white font-bold py-4 px-8 rounded-lg transition-all duration-300 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed text-lg"
      >
        {isDownloading ? "Generando..." : "📥 Descargar Recuerdo"}
      </button>

      <p className="text-white/60 text-sm">
        Descarga esta tarjeta especial que hicimos para ti 💝
      </p>
    </motion.div>
  );
}
