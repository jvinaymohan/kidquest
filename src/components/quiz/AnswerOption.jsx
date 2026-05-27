import clsx from "clsx";
import { motion } from "framer-motion";
import { Check, X } from "lucide-react";

export function AnswerOption({ label, onSelect, state = "idle", disabled, index = 0, media = null }) {
  const stateClasses =
    state === "correct"
      ? "bg-success text-white border-success/80"
      : state === "wrong"
      ? "bg-error text-white border-error/80"
      : state === "dim"
      ? "bg-white border-ink/10 opacity-60"
      : "bg-white border-ink/15";

  return (
    <motion.button
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06 }}
      whileTap={disabled ? {} : { y: 1, boxShadow: "2px 2px 0px rgba(0,0,0,0.15)" }}
      whileHover={disabled ? {} : { y: -1 }}
      onClick={onSelect}
      disabled={disabled}
      className={clsx(
        "w-full min-h-[56px] rounded-chunky border-[3px] shadow-chunky font-display font-extrabold text-lg px-4 py-3 flex items-center justify-between gap-3 focus-ring transition-colors",
        stateClasses,
        state === "wrong" && "animate-shake"
      )}
    >
      <span className="flex items-center gap-3 text-left min-w-0">
        {media}
        <span className="truncate">{label}</span>
      </span>
      {state === "correct" && <Check size={22} className="shrink-0" />}
      {state === "wrong" && <X size={22} className="shrink-0" />}
    </motion.button>
  );
}
