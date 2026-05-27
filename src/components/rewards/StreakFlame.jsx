import { motion } from "framer-motion";
import { Flame } from "lucide-react";
import clsx from "clsx";

export function StreakFlame({ streak = 0 }) {
  const big = streak >= 30;
  const med = streak >= 7;
  const small = streak >= 3;
  const color = big ? "text-music" : med ? "text-primary" : small ? "text-accent" : "text-ink/30";

  return (
    <div className="flex items-center gap-1.5 bg-white border-[3px] border-ink/15 rounded-pill shadow-chunky px-3 py-1.5">
      <motion.div
        animate={{ scale: [1, 1.1, 1], rotate: [0, -4, 4, 0] }}
        transition={{ repeat: Infinity, duration: 2.2 }}
      >
        <Flame
          size={big ? 26 : med ? 24 : 22}
          className={clsx(color)}
          fill={small ? "currentColor" : "transparent"}
          strokeWidth={2.5}
        />
      </motion.div>
      <div className="leading-tight">
        <div className="font-display font-bold text-base">{streak}</div>
        <div className="text-[10px] uppercase tracking-wide text-ink/60 font-bold">day{streak === 1 ? "" : "s"}</div>
      </div>
    </div>
  );
}
