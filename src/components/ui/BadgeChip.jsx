import clsx from "clsx";
import { motion } from "framer-motion";

export function BadgeChip({ badge, earned = true, size = "md", onClick }) {
  const dims = size === "lg" ? "w-24 h-24 text-4xl" : size === "sm" ? "w-14 h-14 text-xl" : "w-20 h-20 text-3xl";
  return (
    <motion.button
      onClick={onClick}
      whileTap={{ scale: 0.95 }}
      whileHover={{ y: -2 }}
      className={clsx(
        "rounded-chunky border-[3px] grid place-items-center font-display shadow-chunky focus-ring",
        dims,
        earned ? "bg-accent border-ink/20" : "bg-ink/5 border-ink/10 grayscale opacity-60"
      )}
      title={badge?.name}
    >
      <span>{badge?.emoji ?? "?"}</span>
    </motion.button>
  );
}
