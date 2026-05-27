import { motion, AnimatePresence } from "framer-motion";
import { Button } from "../ui/Button";
import { ConfettiBlast } from "./ConfettiBlast";
import { LEVEL_TITLES } from "../../utils/scoring";

export function LevelUpModal({ open, level, onClose }) {
  const info = LEVEL_TITLES[Math.min((level ?? 1) - 1, LEVEL_TITLES.length - 1)] ?? LEVEL_TITLES[0];
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 grid place-items-center bg-ink/40 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <ConfettiBlast count={120} duration={3} />
          <motion.div
            initial={{ scale: 0.5, y: 50, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
            transition={{ type: "spring", stiffness: 220, damping: 18 }}
            className="bg-white rounded-chunky p-8 max-w-sm w-full text-center border-[4px] border-ink/15 shadow-chunkyXl"
          >
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 1.6 }}
              className="text-7xl mb-2"
            >
              {info.emoji}
            </motion.div>
            <div className="text-xs uppercase tracking-wide font-display font-extrabold text-ink/60">
              Level Up!
            </div>
            <h2 className="font-display text-4xl font-extrabold text-primary mt-1">
              {info.title}
            </h2>
            <p className="mt-2 text-ink/70 font-bold">You've reached Level {level}</p>
            <div className="mt-4 inline-grid place-items-center w-24 h-24 bg-accent rounded-full border-[4px] border-ink/20 shadow-chunky">
              <span className="font-display font-extrabold text-4xl">{level}</span>
            </div>
            <Button onClick={onClose} fullWidth className="mt-6" variant="primary">
              Keep going!
            </Button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
