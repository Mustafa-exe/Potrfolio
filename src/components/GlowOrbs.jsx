/* ── Animated glowing orbs that add ambient light depth to sections ── */

export default function GlowOrbs() {
  const orbs = [
    { size: 300, x: "10%", y: "20%", color: "rgba(168, 212, 245, 0.03)", delay: 0 },
    { size: 400, x: "70%", y: "10%", color: "rgba(74, 128, 176, 0.025)", delay: 2 },
    { size: 250, x: "85%", y: "60%", color: "rgba(107, 184, 224, 0.02)", delay: 4 },
    { size: 350, x: "20%", y: "70%", color: "rgba(140, 200, 240, 0.02)", delay: 6 },
    { size: 200, x: "50%", y: "40%", color: "rgba(168, 212, 245, 0.015)", delay: 1 },
  ];

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        pointerEvents: "none",
        zIndex: 0,
      }}
    >
      {orbs.map((orb, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: orb.x,
            top: orb.y,
            width: orb.size,
            height: orb.size,
            borderRadius: "50%",
            background: `radial-gradient(circle, ${orb.color}, transparent 70%)`,
            animation: `glow-pulse ${8 + i * 2}s ease-in-out ${orb.delay}s infinite`,
            transform: "translate(-50%, -50%)",
          }}
        />
      ))}
      <style>{`
        @keyframes glow-pulse {
          0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.6; }
          50% { transform: translate(-50%, -50%) scale(1.3); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
