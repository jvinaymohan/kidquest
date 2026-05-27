import { motion } from "framer-motion";
import { Mascot } from "./Mascot";

export function MascotSpeech({ kind = "owl", message, color = "var(--color-secondary)" }) {
  return (
    <div className="flex items-end gap-3">
      <Mascot kind={kind} size={88} />
      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 280, damping: 18, delay: 0.15 }}
        className="relative flex-1 bg-white border-[3px] border-ink/15 rounded-chunky shadow-chunky px-4 py-3"
        style={{ borderTopLeftRadius: 4 }}
      >
        <div
          className="absolute -left-2 top-3 w-3 h-3 bg-white border-l-[3px] border-b-[3px] border-ink/15 rotate-45"
          aria-hidden
        />
        <p className="font-body font-bold text-ink text-base leading-snug">{message}</p>
      </motion.div>
    </div>
  );
}
