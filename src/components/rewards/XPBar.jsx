import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { xpToNextLevel } from "../../utils/scoring";

export function XPBar({ totalXP = 0 }) {
  const { level, current, needed, pct } = xpToNextLevel(totalXP);
  return (
    <div className="flex items-center gap-2 bg-white border-[3px] border-ink/15 rounded-pill shadow-chunky px-3 py-1.5">
      <div className="grid place-items-center w-8 h-8 bg-accent rounded-full border-[2.5px] border-ink/20 font-display font-bold text-sm">
        {level}
      </div>
      <div className="flex-1 min-w-[100px]">
        <div className="h-3 bg-ink/10 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-primary to-accent"
            initial={{ width: 0 }}
            animate={{ width: `${pct * 100}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
        </div>
        <div className="text-xs font-bold text-ink/70 flex items-center gap-1 mt-0.5">
          <Sparkles size={12} className="text-primary" />
          {current} / {needed} XP
        </div>
      </div>
    </div>
  );
}
