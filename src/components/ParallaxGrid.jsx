import { useEffect, useRef } from "react";

/* ── A 2D canvas overlay that draws an animated grid and
      gradient scan-lines for a "holographic" 2D depth effect ── */

export default function ParallaxGrid() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    let w, h, active = true;

    const resize = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    let t = 0;

    const draw = () => {
      if (!active) return;
      requestAnimationFrame(draw);
      t += 0.003;
      ctx.clearRect(0, 0, w, h);

      // ── Animated grid dots ──
      const spacing = 80;
      const dotR = 0.8;
      const offsetY = (t * 40) % spacing;

      ctx.fillStyle = "rgba(168, 212, 245, 0.04)";
      for (let x = 0; x < w; x += spacing) {
        for (let y = -spacing + offsetY; y < h + spacing; y += spacing) {
          const pulse = 0.3 + 0.7 * Math.abs(Math.sin(t + x * 0.01 + y * 0.008));
          ctx.globalAlpha = 0.04 * pulse;
          ctx.beginPath();
          ctx.arc(x, y, dotR, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // ── Scan line sweep ──
      ctx.globalAlpha = 1;
      const scanY = ((t * 120) % (h + 200)) - 100;
      const grad = ctx.createLinearGradient(0, scanY - 50, 0, scanY + 50);
      grad.addColorStop(0, "rgba(168, 212, 245, 0)");
      grad.addColorStop(0.5, "rgba(168, 212, 245, 0.03)");
      grad.addColorStop(1, "rgba(168, 212, 245, 0)");
      ctx.fillStyle = grad;
      ctx.fillRect(0, scanY - 50, w, 100);

      // ── Horizontal faint lines ──
      ctx.strokeStyle = "rgba(74, 128, 176, 0.015)";
      ctx.lineWidth = 0.5;
      for (let y = 0; y < h; y += 120) {
        const wobble = Math.sin(t * 2 + y * 0.01) * 3;
        ctx.beginPath();
        ctx.moveTo(0, y + wobble);
        ctx.lineTo(w, y - wobble);
        ctx.stroke();
      }
    };

    draw();

    return () => {
      active = false;
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        inset: 0,
        pointerEvents: "none",
        zIndex: 1,
        opacity: 0.7,
      }}
    />
  );
}
