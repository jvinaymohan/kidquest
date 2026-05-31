import { motion } from "framer-motion";
import { Check, X } from "lucide-react";

export function ResultFeedback({ correct, correctAnswer, visible }) {
  if (!visible) return null;
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-2xl px-4 py-4 text-center ring-2 ${
        correct ? "bg-success/15 ring-success/40" : "bg-error/10 ring-error/30"
      }`}
    >
      <div className="flex items-center justify-center gap-2">
        {correct ? (
          <Check className="text-success" size={28} strokeWidth={3} />
        ) : (
          <X className="text-error" size={28} strokeWidth={3} />
        )}
        <p className={`font-display text-xl font-extrabold ${correct ? "text-success" : "text-error"}`}>
          {correct ? "Correct! 🎉" : "Not quite"}
        </p>
      </div>
      {!correct && (
        <p className="mt-2 text-base font-bold text-ink/70">
          The answer was <span className="font-display text-ink">{correctAnswer}</span>
        </p>
      )}
    </motion.div>
  );
}
