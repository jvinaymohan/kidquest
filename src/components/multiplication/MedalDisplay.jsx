import { motion } from "framer-motion";

export function MedalDisplay({ medal, label, emoji }) {
  if (!medal && !label) return null;
  return (
    <motion.div
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", bounce: 0.5 }}
      className="text-center py-4"
    >
      <div className="text-6xl">{emoji || "💪"}</div>
      <div className="font-display text-3xl font-extrabold mt-2">{label}</div>
    </motion.div>
  );
}
