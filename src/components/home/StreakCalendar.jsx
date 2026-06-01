import { useMemo } from "react";
import { useAppStore } from "../../store/useAppStore";

function last7Days() {
  const days = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    days.push({
      key,
      label: d.toLocaleDateString(undefined, { weekday: "narrow" }),
      isToday: i === 0,
    });
  }
  return days;
}

export function StreakCalendar() {
  const currentStreak = useAppStore((s) => s.currentStreak);
  const lastPlayDate = useAppStore((s) => s.lastPlayDate);

  const days = useMemo(() => last7Days(), []);

  const activeKeys = useMemo(() => {
    if (!lastPlayDate || currentStreak <= 0) return new Set();
    const set = new Set();
    const end = new Date(lastPlayDate);
    for (let i = 0; i < currentStreak && i < 7; i++) {
      const d = new Date(end);
      d.setDate(end.getDate() - i);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
      set.add(key);
    }
    return set;
  }, [currentStreak, lastPlayDate]);

  return (
    <div className="home-v2-panel">
      <p className="home-v2-panel-label">Your quest week</p>
      <div className="flex justify-between gap-1">
        {days.map((d) => {
          const lit = activeKeys.has(d.key);
          return (
            <div key={d.key} className="flex flex-1 flex-col items-center gap-1">
              <span
                className={`home-v2-cal-day ${lit ? "home-v2-cal-day-lit" : ""} ${d.isToday ? "home-v2-cal-day-today" : ""}`}
                aria-label={`${d.label}${lit ? ", played" : ""}`}
              >
                {lit ? "🔥" : "·"}
              </span>
              <span className="text-[9px] font-bold text-white/40">{d.label}</span>
            </div>
          );
        })}
      </div>
      <p className="mt-2 text-center text-[10px] font-bold text-white/50">
        Come back tomorrow to keep your streak!
      </p>
    </div>
  );
}
