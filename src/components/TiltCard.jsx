import { useRef, useState } from "react";
import { motion } from "framer-motion";

/* ── 3D perspective tilt card ──
   Wrap any content in this to get a hologram-like
   perspective-tracking hover effect. */

export default function TiltCard({ children, className = "", style = {}, ...props }) {
  const cardRef = useRef(null);
  const [transform, setTransform] = useState("");
  const [glare, setGlare] = useState({ x: 50, y: 50, opacity: 0 });

  const handleMouseMove = (e) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -8;
    const rotateY = ((x - centerX) / centerX) * 8;
    setTransform(
      `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`
    );
    setGlare({
      x: (x / rect.width) * 100,
      y: (y / rect.height) * 100,
      opacity: 0.08,
    });
  };

  const handleMouseLeave = () => {
    setTransform("perspective(800px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)");
    setGlare({ x: 50, y: 50, opacity: 0 });
  };

  return (
    <motion.div
      ref={cardRef}
      className={className}
      style={{
        ...style,
        transform,
        transition: "transform 0.35s ease",
        position: "relative",
        overflow: "hidden",
        willChange: "transform",
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      {...props}
    >
      {children}
      {/* Glare overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          background: `radial-gradient(circle at ${glare.x}% ${glare.y}%, rgba(168, 212, 245, ${glare.opacity}), transparent 60%)`,
          transition: "opacity 0.3s",
          borderRadius: "inherit",
          zIndex: 10,
        }}
      />
    </motion.div>
  );
}
