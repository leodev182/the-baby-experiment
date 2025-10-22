import { useState } from "react";
import { motion } from "framer-motion";
import { updatePersonalData } from "@/services/localStorageService";

interface InputScreenProps {
  onSubmit: (data: InputData) => void;
  onBack?: () => void;
}

export interface InputData {
  userName: string;
  suggestedName: string;
  message: string;
}

export function InputScreen({ onSubmit, onBack }: InputScreenProps) {
  const [formData, setFormData] = useState<InputData>({
    userName: "",
    suggestedName: "",
    message: "",
  });

  const [errors, setErrors] = useState<Partial<InputData>>({});

  const validateField = (
    field: keyof InputData,
    value: string
  ): string | null => {
    switch (field) {
      case "userName":
        if (value.length < 2)
          return "El nombre debe tener al menos 2 caracteres";
        if (value.length > 50) return "El nombre es demasiado largo";
        if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(value))
          return "Solo se permiten letras";
        return null;

      case "suggestedName":
        if (value.length < 2)
          return "El nombre debe tener al menos 2 caracteres";
        if (value.length > 30) return "El nombre es demasiado largo";
        if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(value))
          return "Solo se permiten letras";
        return null;

      case "message":
        if (value.length < 10)
          return "El mensaje debe tener al menos 10 caracteres";
        if (value.length > 500)
          return "El mensaje es demasiado largo (máx 500 caracteres)";
        return null;

      default:
        return null;
    }
  };

  const handleChange = (field: keyof InputData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Validar en tiempo real
    const error = validateField(field, value);
    setErrors((prev) => ({ ...prev, [field]: error || undefined }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validar todos los campos
    const newErrors: Partial<InputData> = {};
    let isValid = true;

    (Object.keys(formData) as Array<keyof InputData>).forEach((field) => {
      const error = validateField(field, formData[field]);
      if (error) {
        newErrors[field] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);

    if (isValid) {
      // Guardar en localStorage
      updatePersonalData(
        formData.userName,
        formData.suggestedName,
        formData.message
      );

      // Notificar al componente padre
      onSubmit(formData);
    }
  };

  const isFormValid =
    formData.userName.length >= 2 &&
    formData.suggestedName.length >= 2 &&
    formData.message.length >= 10 &&
    Object.values(errors).every((error) => !error);

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black flex items-center justify-center p-4">
      {/* Grid de fondo */}
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

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl w-full relative z-10"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-4xl md:text-5xl font-bold text-cyan-400 mb-2 tracking-wider"
          >
            🔬 REGISTRO DE DATOS
          </motion.h1>
          <p className="text-gray-400 text-lg">
            Complete el formulario de participación experimental
          </p>
        </div>

        {/* Formulario */}
        <motion.form
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          onSubmit={handleSubmit}
          className="bg-gradient-to-br from-gray-900/90 to-gray-800/90 border-2 border-cyan-500/30 rounded-2xl p-8 backdrop-blur-sm"
        >
          {/* Campo 1: Tu nombre */}
          <div className="mb-6">
            <label className="block text-cyan-400 font-semibold mb-2">
              Tu nombre completo
            </label>
            <input
              type="text"
              value={formData.userName}
              onChange={(e) => handleChange("userName", e.target.value)}
              placeholder="Ej: Dr. Carlos García"
              className={`w-full bg-gray-800/50 border-2 ${
                errors.userName ? "border-red-500" : "border-cyan-500/50"
              } rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400 transition-colors`}
              maxLength={50}
            />
            {errors.userName && (
              <p className="text-red-400 text-sm mt-1">⚠️ {errors.userName}</p>
            )}
            <p className="text-gray-500 text-xs mt-1">
              {formData.userName.length}/50 caracteres
            </p>
          </div>

          {/* Campo 2: Nombre sugerido */}
          <div className="mb-6">
            <label className="block text-cyan-400 font-semibold mb-2">
              Nombre sugerido para el nuevo espécimen
            </label>
            <input
              type="text"
              value={formData.suggestedName}
              onChange={(e) => handleChange("suggestedName", e.target.value)}
              placeholder="Ej: Luna Quantum"
              className={`w-full bg-gray-800/50 border-2 ${
                errors.suggestedName ? "border-red-500" : "border-cyan-500/50"
              } rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400 transition-colors`}
              maxLength={30}
            />
            {errors.suggestedName && (
              <p className="text-red-400 text-sm mt-1">
                ⚠️ {errors.suggestedName}
              </p>
            )}
            <p className="text-gray-500 text-xs mt-1">
              {formData.suggestedName.length}/30 caracteres
            </p>
          </div>

          {/* Campo 3: Mensaje */}
          <div className="mb-8">
            <label className="block text-cyan-400 font-semibold mb-2">
              Mensaje para los investigadores principales
            </label>
            <textarea
              value={formData.message}
              onChange={(e) => handleChange("message", e.target.value)}
              placeholder="Escribe un mensaje especial para los futuros papás..."
              rows={5}
              className={`w-full bg-gray-800/50 border-2 ${
                errors.message ? "border-red-500" : "border-cyan-500/50"
              } rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400 transition-colors resize-none`}
              maxLength={500}
            />
            {errors.message && (
              <p className="text-red-400 text-sm mt-1">⚠️ {errors.message}</p>
            )}
            <p className="text-gray-500 text-xs mt-1">
              {formData.message.length}/500 caracteres
            </p>
          </div>

          {/* Botones */}
          <div className="flex gap-4 justify-end">
            {onBack && (
              <motion.button
                type="button"
                onClick={onBack}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-semibold transition-colors"
              >
                ← Volver
              </motion.button>
            )}

            <motion.button
              type="submit"
              disabled={!isFormValid}
              whileHover={isFormValid ? { scale: 1.05 } : {}}
              whileTap={isFormValid ? { scale: 0.95 } : {}}
              className={`px-8 py-3 rounded-lg font-semibold transition-all ${
                isFormValid
                  ? "bg-cyan-500 hover:bg-cyan-600 text-black shadow-lg shadow-cyan-500/50"
                  : "bg-gray-600 text-gray-400 cursor-not-allowed"
              }`}
            >
              Continuar →
            </motion.button>
          </div>
        </motion.form>

        {/* Indicador de progreso */}
        <div className="mt-6 text-center">
          <p className="text-gray-500 text-sm">
            Paso 2 de 5: Registro de datos
          </p>
        </div>
      </motion.div>
    </div>
  );
}
