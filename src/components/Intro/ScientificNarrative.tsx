import { motion } from "framer-motion";
import { SCIENTIFIC_INTRO } from "@/utils/constants";

export function ScientificNarrative() {
  const lines = SCIENTIFIC_INTRO.trim()
    .split("\n")
    .filter((line) => line.trim());

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {lines.map((line, index) => (
        <motion.p
          key={index}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{
            delay: index * 0.15,
            duration: 0.5,
            ease: "easeOut",
          }}
          className={`
            font-mono leading-relaxed
            ${
              line.includes("⚛️") || line.includes("🧪")
                ? "text-lg font-semibold text-gradient-dual"
                : line.includes("EXPERIMENTO") ||
                  line.includes("ESTADO") ||
                  line.includes("ENERGÍA")
                ? "text-chemistry-accent font-bold tracking-wider"
                : "text-text-light text-opacity-80"
            }
          `}
        >
          {line}
        </motion.p>
      ))}

      {/* Cursor parpadeante al final */}
      <motion.span
        className="inline-block w-2 h-5 bg-physics-accent ml-1"
        animate={{ opacity: [1, 0] }}
        transition={{ repeat: Infinity, duration: 0.8 }}
      />
    </div>
  );
}
