import { motion } from "framer-motion";

export function QuizProgress({ index, total }) {
  const pct = total === 0 ? 0 : ((index + 1) / total) * 100;
  return (
    <div className="w-full">
      <div className="flex justify-between text-xs font-display font-bold text-ink/70 mb-1">
        <span>Question {index + 1} of {total}</span>
        <span>{Math.round(pct)}%</span>
      </div>
      <div className="h-3 rounded-full bg-ink/10 overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-primary to-accent"
          initial={false}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}
