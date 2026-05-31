import { STREAK_TARGET } from "../../utils/mathMastery/constants";

export function StreakBar({ streak }) {
  const pct = Math.min(100, Math.round((streak / STREAK_TARGET) * 100));
  return (
    <div className="w-full">
      <div className="mb-1 flex items-center justify-between">
        <span className="font-display text-sm font-extrabold text-ink">
          Streak: {streak}/{STREAK_TARGET} 🔥
        </span>
        <span className="text-xs font-bold text-ink/50">{pct}%</span>
      </div>
      <div className="h-4 overflow-hidden rounded-full bg-ink/10 ring-2 ring-white">
        <div
          className="h-full rounded-full bg-gradient-to-r from-primary via-[#ffb703] to-success transition-all duration-300"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
