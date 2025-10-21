/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // Colores de Física
        physics: {
          primary: "#667eea",
          secondary: "#764ba2",
          accent: "#00d4ff",
          glow: "rgba(102, 126, 234, 0.5)",
        },
        // Colores de Química
        chemistry: {
          primary: "#11998e",
          secondary: "#38ef7d",
          accent: "#00ffc6",
          glow: "rgba(17, 153, 142, 0.5)",
        },
        // Neutros
        bg: {
          dark: "#0a0e27",
          medium: "#1a1f3a",
        },
        text: {
          light: "#e4e9f7",
          glow: "#ffffff",
        },
      },
      fontFamily: {
        tech: ["Orbitron", "Rajdhani", "sans-serif"],
        mono: ["Share Tech Mono", "Courier New", "monospace"],
      },
      animation: {
        "pulse-physics": "pulse-physics 4s ease-in-out infinite",
        "pulse-chemistry": "pulse-chemistry 4s ease-in-out infinite 2s",
        float: "float 3s ease-in-out infinite",
        glow: "glow 3s ease-in-out infinite",
      },
      keyframes: {
        "pulse-physics": {
          "0%, 100%": { opacity: "0.3" },
          "50%": { opacity: "0.6" },
        },
        "pulse-chemistry": {
          "0%, 100%": { opacity: "0.3" },
          "50%": { opacity: "0.6" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0) rotate(0deg)" },
          "50%": { transform: "translateY(-20px) rotate(180deg)" },
        },
        glow: {
          "0%, 100%": { filter: "brightness(1)" },
          "50%": { filter: "brightness(1.3)" },
        },
      },
    },
  },
  plugins: [],
};
