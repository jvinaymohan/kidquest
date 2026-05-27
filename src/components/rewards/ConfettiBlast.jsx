import { useMemo } from "react";
import { motion } from "framer-motion";

const COLORS = ["#FF6B35", "#4ECDC4", "#FFE66D", "#6BCB77", "#9B5DE5", "#3A86FF", "#E63946"];

export function ConfettiBlast({ count = 80, duration = 2.5 }) {
  const pieces = useMemo(
    () =>
      Array.from({ length: count }).map(() => ({
        left: Math.random() * 100,
        delay: Math.random() * 0.4,
        rot: Math.random() * 360,
        dx: (Math.random() - 0.5) * 200,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        size: 6 + Math.random() * 10,
        kind: Math.random() > 0.5 ? "rect" : "circle",
      })),
    [count]
  );

  return (
    <div className="pointer-events-none fixed inset-0 z-[100] overflow-hidden">
      {pieces.map((p, i) => (
        <motion.div
          key={i}
          initial={{ y: -30, x: 0, opacity: 1, rotate: p.rot }}
          animate={{
            y: typeof window !== "undefined" ? window.innerHeight + 40 : 800,
            x: p.dx,
            opacity: [1, 1, 0],
            rotate: p.rot + 720,
          }}
          transition={{ duration: duration + Math.random(), delay: p.delay, ease: "easeIn" }}
          style={{
            left: `${p.left}%`,
            width: p.size,
            height: p.kind === "rect" ? p.size * 1.4 : p.size,
            background: p.color,
            borderRadius: p.kind === "rect" ? 2 : "50%",
            position: "absolute",
            top: 0,
          }}
        />
      ))}
    </div>
  );
}
