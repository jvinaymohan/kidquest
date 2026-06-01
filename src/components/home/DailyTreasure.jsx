import { useState } from "react";
import { motion } from "framer-motion";
import { useAppStore } from "../../store/useAppStore";

function todayKey() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

const REWARDS = [5, 8, 10, 12, 15];

export function DailyTreasure({ compact = false }) {
  const dailyTreasureClaimed = useAppStore((s) => s.dailyTreasureClaimed);
  const claimDailyTreasure = useAppStore((s) => s.claimDailyTreasure);
  const grantXP = useAppStore((s) => s.grantXP);
  const [justClaimed, setJustClaimed] = useState(null);
  const [shaking, setShaking] = useState(false);

  const today = todayKey();
  const claimed = dailyTreasureClaimed === today;

  function handleTap() {
    if (claimed || shaking) return;
    setShaking(true);
    setTimeout(() => {
      const xp = REWARDS[Math.floor(Math.random() * REWARDS.length)];
      claimDailyTreasure(today);
      grantXP(xp);
      setJustClaimed(xp);
      setShaking(false);
    }, 600);
  }

  return (
    <div className={`home-v2-panel ${compact ? "home-v2-panel-compact" : ""}`}>
      <p className="home-v2-panel-label">Daily treasure</p>
      <motion.button
        type="button"
        onClick={handleTap}
        disabled={claimed}
        whileTap={claimed ? undefined : { scale: 0.92 }}
        animate={shaking ? { rotate: [-4, 4, -4, 4, 0] } : {}}
        transition={{ duration: 0.5 }}
        className={`home-v2-treasure focus-ring ${claimed ? "home-v2-treasure-open" : "home-v2-treasure-closed"}`}
        aria-label={claimed ? "Treasure already opened today" : "Tap to open today's treasure chest"}
      >
        <span className="text-3xl" aria-hidden>
          {claimed ? "✨" : "🎁"}
        </span>
        <span className="font-display text-xs font-extrabold text-white">
          {claimed ? (justClaimed ? `+${justClaimed} XP!` : "See you tomorrow!") : "Tap me!"}
        </span>
      </motion.button>
      {!claimed && (
        <p className="mt-1.5 text-center text-[10px] font-bold text-white/45">One surprise per day</p>
      )}
    </div>
  );
}
