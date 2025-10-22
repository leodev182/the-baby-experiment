import { useState, useEffect, useRef } from "react";
import type { CountdownData } from "../types";

export function useCountdown(targetDate: number): CountdownData {
  const [timeLeft, setTimeLeft] = useState<CountdownData>(() => {
    // Calcular estado inicial inmediatamente
    const now = Date.now();
    const difference = targetDate - now;

    if (difference <= 0) {
      return {
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
        totalSeconds: 0,
        isExpired: true,
      };
    }

    const totalSeconds = Math.floor(difference / 1000);
    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);

    return {
      days,
      hours,
      minutes,
      seconds,
      totalSeconds,
      isExpired: false,
    };
  });

  // Usar ref para evitar recrear el interval si targetDate cambia levemente
  const targetDateRef = useRef(targetDate);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Solo actualizar si el targetDate cambió significativamente (más de 1 segundo)
    if (Math.abs(targetDate - targetDateRef.current) > 1000) {
      targetDateRef.current = targetDate;
    }

    const calculateTimeLeft = () => {
      const now = Date.now();
      const difference = targetDateRef.current - now;

      if (difference <= 0) {
        setTimeLeft({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
          totalSeconds: 0,
          isExpired: true,
        });

        // Limpiar interval cuando expire
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
        return;
      }

      const totalSeconds = Math.floor(difference / 1000);
      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft({
        days,
        hours,
        minutes,
        seconds,
        totalSeconds,
        isExpired: false,
      });
    };

    // Solo crear interval si no existe y no ha expirado
    if (!intervalRef.current && !timeLeft.isExpired) {
      intervalRef.current = setInterval(calculateTimeLeft, 1000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [targetDate]); // Solo depende de targetDate

  return timeLeft;
}
