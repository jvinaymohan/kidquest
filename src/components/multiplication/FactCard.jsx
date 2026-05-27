import { motion } from "framer-motion";
import { DotArray } from "./DotArray";

export function FactCard({ fact, revealed, onReveal, showDots }) {
  return (
    <motion.button
      type="button"
      onClick={onReveal}
      className="w-full chunky-card p-6 sm:p-8 text-center focus-ring min-h-[200px] flex flex-col items-center justify-center gap-4 bg-cream"
      whileTap={{ scale: 0.98 }}
    >
      <div className="font-display text-4xl sm:text-5xl font-extrabold text-ink">
        {fact.multiplicand} × {fact.multiplier} = {revealed ? fact.product : "?"}
      </div>
      {revealed && showDots && DotArray && (
        <DotArray rows={fact.multiplicand} cols={fact.multiplier} />
      )}
      {!revealed && (
        <span className="text-sm font-bold text-ink/50">Tap to reveal</span>
      )}
    </motion.button>
  );
}
