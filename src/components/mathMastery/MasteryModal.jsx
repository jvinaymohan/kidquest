import { useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "../ui/Button";

const COLORS = ["#FF6B35", "#3A86FF", "#FFB703", "#2A9D8F", "#9B5DE5", "#FF006E"];

export function ConfettiBurst({ active }) {
  if (!active) return null;
  const pieces = Array.from({ length: 40 }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    delay: Math.random() * 0.4,
    color: COLORS[i % COLORS.length],
    rotate: Math.random() * 360,
  }));

  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden" aria-hidden>
      {pieces.map((p) => (
        <span
          key={p.id}
          className="confetti-piece animate-[confetti-fall_2.5s_ease-out_forwards]"
          style={{
            left: p.left,
            background: p.color,
            animationDelay: `${p.delay}s`,
            transform: `rotate(${p.rotate}deg)`,
          }}
        />
      ))}
    </div>
  );
}

export function MasteryModal({ open, title, subtitle, onContinue }) {
  useEffect(() => {
    if (!open) return;
    const t = setTimeout(onContinue, 4000);
    return () => clearTimeout(t);
  }, [open, onContinue]);

  if (!open) return null;

  return (
    <>
      <ConfettiBurst active />
      <div className="fixed inset-0 z-40 grid place-items-center bg-ink/40 p-4">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-full max-w-sm rounded-3xl bg-white p-8 text-center shadow-2xl ring-4 ring-mul-gold"
        >
          <p className="text-5xl" aria-hidden>
            🏆
          </p>
          <h2 className="mt-3 font-display text-2xl font-extrabold text-ink">{title}</h2>
          <p className="mt-2 text-sm font-bold text-ink/60">{subtitle}</p>
          <Button className="mt-6 w-full" onClick={onContinue}>
            Awesome!
          </Button>
        </motion.div>
      </div>
    </>
  );
}
