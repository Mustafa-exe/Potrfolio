import { useState } from "react";

/* ── Lightweight 2D SVG shapes that drift across the viewport ── */
const SHAPES = [
  (s, clr) => (
    <circle cx={s / 2} cy={s / 2} r={s / 2 - 1} fill="none" stroke={clr} strokeWidth="0.8" />
  ),
  (s, clr) => (
    <polygon
      points={`${s / 2},2 ${s - 2},${s - 2} 2,${s - 2}`}
      fill="none"
      stroke={clr}
      strokeWidth="0.8"
    />
  ),
  (s, clr) => {
    const cx = s / 2, cy = s / 2, r = s / 2 - 2;
    const pts = Array.from({ length: 6 }, (_, i) => {
      const a = (Math.PI / 3) * i - Math.PI / 2;
      return `${cx + r * Math.cos(a)},${cy + r * Math.sin(a)}`;
    }).join(" ");
    return <polygon points={pts} fill="none" stroke={clr} strokeWidth="0.8" />;
  },
  (s, clr) => (
    <polygon
      points={`${s / 2},2 ${s - 2},${s / 2} ${s / 2},${s - 2} 2,${s / 2}`}
      fill="none"
      stroke={clr}
      strokeWidth="0.8"
    />
  ),
];

const COLORS = [
  "rgba(168, 212, 245, 0.12)",
  "rgba(107, 184, 224, 0.10)",
  "rgba(74, 128, 176, 0.08)",
  "rgba(208, 232, 255, 0.07)",
];

function generateShape(id) {
  const size = 20 + Math.random() * 35;
  const shapeIdx = Math.floor(Math.random() * SHAPES.length);
  const colorIdx = Math.floor(Math.random() * COLORS.length);
  const x = Math.random() * 100;
  const y = Math.random() * 100;
  const duration = 25 + Math.random() * 35;
  const delay = Math.random() * -40;
  const rotDuration = 20 + Math.random() * 30;
  const driftX = (Math.random() - 0.5) * 40;
  const driftY = -(15 + Math.random() * 30);

  return { id, size, shapeIdx, color: COLORS[colorIdx], x, y, duration, delay, rotDuration, driftX, driftY };
}

const SHAPE_STYLE = document.createElement("style");
SHAPE_STYLE.textContent = `
  @keyframes fs-drift {
    0% { transform: translate(0, 0) scale(0.6); opacity: 0; }
    15% { opacity: 1; }
    85% { opacity: 1; }
    100% { transform: translate(var(--dx), var(--dy)) scale(1.1); opacity: 0; }
  }
  @keyframes fs-spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
`;
if (typeof document !== "undefined" && !document.getElementById("fs-keyframes")) {
  SHAPE_STYLE.id = "fs-keyframes";
  document.head.appendChild(SHAPE_STYLE);
}

export default function FloatingShapes() {
  const [shapes] = useState(() =>
    Array.from({ length: 10 }, (_, i) => generateShape(i))
  );

  return (
    <div
      className="floating-shapes-layer"
      style={{
        position: "fixed",
        inset: 0,
        pointerEvents: "none",
        zIndex: 1,
        overflow: "hidden",
      }}
    >
      {shapes.map((s) => (
        <div
          key={s.id}
          style={{
            position: "absolute",
            left: `${s.x}%`,
            top: `${s.y}%`,
            width: s.size,
            height: s.size,
            "--dx": `${s.driftX}vw`,
            "--dy": `${s.driftY}vh`,
            animation: `fs-drift ${s.duration}s ${s.delay}s linear infinite`,
            willChange: "transform, opacity",
          }}
        >
          <svg
            width={s.size}
            height={s.size}
            viewBox={`0 0 ${s.size} ${s.size}`}
            style={{
              animation: `fs-spin ${s.rotDuration}s linear infinite`,
            }}
          >
            {SHAPES[s.shapeIdx](s.size, s.color)}
          </svg>
        </div>
      ))}
    </div>
  );
}
