import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  alpha: number;
}

export function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Configurar tamaño del canvas
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Colores temáticos (física = cyan, química = pink/purple)
    const colors = [
      "rgba(6, 182, 212, ", // cyan-500 (física)
      "rgba(59, 130, 246, ", // blue-500 (física)
      "rgba(236, 72, 153, ", // pink-500 (química)
      "rgba(168, 85, 247, ", // purple-500 (química)
    ];

    // Crear partículas
    const particleCount = 60;
    const particles: Particle[] = [];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        radius: Math.random() * 2 + 1,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: Math.random() * 0.5 + 0.3,
      });
    }

    // Función de animación
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height); // Limpiar completamente en vez de trail

      // Actualizar y dibujar partículas
      particles.forEach((particle) => {
        // Mover partícula
        particle.x += particle.vx;
        particle.y += particle.vy;

        // Rebotar en los bordes
        if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
        if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;

        // Dibujar partícula
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        ctx.fillStyle = particle.color + particle.alpha + ")";
        ctx.fill();

        // Efecto de glow
        ctx.shadowBlur = 10;
        ctx.shadowColor = particle.color + "0.8)";
      });

      // Conectar partículas cercanas
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 120) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(100, 200, 255, ${
              0.15 * (1 - distance / 120)
            })`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      ctx.shadowBlur = 0;
      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0 pointer-events-none"
      style={{ background: "transparent" }}
    />
  );
}
