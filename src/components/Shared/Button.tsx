import { motion } from "framer-motion";
import type { ReactNode } from "react";

interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "outline";
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  className?: string;
  type?: "button" | "submit" | "reset";
}

export function Button({
  children,
  onClick,
  variant = "primary",
  size = "md",
  disabled = false,
  className = "",
  type = "button",
}: ButtonProps) {
  const baseStyles =
    "font-tech font-bold rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden";

  const variants = {
    primary:
      "bg-gradient-to-r from-physics-primary to-chemistry-primary text-white hover:shadow-lg hover:shadow-physics-primary/50",
    secondary:
      "bg-bg-medium text-physics-accent border-2 border-physics-accent hover:bg-physics-accent hover:text-white",
    outline:
      "bg-transparent text-chemistry-accent border-2 border-chemistry-accent hover:bg-chemistry-accent hover:text-bg-dark",
  };

  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
  };

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      whileHover={{ scale: disabled ? 1 : 1.05 }}
      whileTap={{ scale: disabled ? 1 : 0.95 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Efecto de brillo al hover */}
      <motion.span
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0"
        whileHover={{ opacity: 0.2, x: ["0%", "200%"] }}
        transition={{ duration: 0.6 }}
      />

      {/* Contenido */}
      <span className="relative z-10">{children}</span>
    </motion.button>
  );
}
