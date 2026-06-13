import { useMemo } from "react";
import { motion } from "framer-motion";
import { useScreenTimeStore, formatScreenMinutes } from "../../store/useScreenTimeStore";
import { lastNDaysKeys, SCREEN_SECTIONS, todayKey } from "../../utils/screenTimeSections";
import { usePreferencesStore } from "../../store/usePreferencesStore";

export function FamilyTimePanel() {
  const byDate = useScreenTimeStore((s) => s.byDate);
  const limitMinutes = usePreferencesStore((s) => s.screenTimeLimitMinutes);

  const { todayTotal, todaySections, week } = useMemo(() => {
    const date = todayKey();
    const todaySections = byDate[date] ?? {};
    const todayTotal = Object.values(todaySections).reduce((a, b) => a + b, 0);
    const week = lastNDaysKeys(7).map((day) => {
      const sections = byDate[day] ?? {};
      const total = Object.values(sections).reduce((a, b) => a + b, 0);
      return { date: day, total, sections };
    });
    return { todayTotal, todaySections, week };
  }, [byDate]);

  const breakdown = Object.entries(todaySections)
    .filter(([, sec]) => sec > 0)
    .sort((a, b) => b[1] - a[1]);

  const weekMax = Math.max(1, ...week.map((d) => d.total));

  return (
    <section className="chunky-card p-4 border-[3px] border-primary/25 bg-primary/5">
      <h2 className="font-display font-extrabold text-lg mb-1">Family time</h2>
      <p className="text-xs font-bold text-ink/60 mb-3">
        Read-only activity for today and the past week (local on this device).
      </p>

      <div className="rounded-chunky border-2 border-ink/10 bg-white p-3 mb-3">
        <p className="text-[10px] font-extrabold uppercase tracking-wide text-ink/50">Today</p>
        <p className="font-display text-2xl font-extrabold text-primary tabular-nums">
          {formatScreenMinutes(todayTotal)}
        </p>
        {limitMinutes != null && limitMinutes > 0 && (
          <p className="text-xs font-bold text-ink/55 mt-1">
            Daily cap: {limitMinutes} min
            {todayTotal >= limitMinutes * 60 ? " · cap reached" : ""}
          </p>
        )}
      </div>

      {breakdown.length > 0 ? (
        <ul className="flex flex-col gap-2 mb-4">
          {breakdown.map(([id, secs]) => {
            const meta = SCREEN_SECTIONS[id] ?? SCREEN_SECTIONS.other;
            const pct = todayTotal > 0 ? secs / todayTotal : 0;
            return (
              <li key={id}>
                <div className="flex justify-between text-sm font-bold">
                  <span>
                    {meta.emoji} {meta.label}
                  </span>
                  <span className="tabular-nums">{formatScreenMinutes(secs)}</span>
                </div>
                <div className="h-2 bg-ink/10 rounded-full overflow-hidden mt-1">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ background: meta.color }}
                    initial={{ width: 0 }}
                    animate={{ width: `${pct * 100}%` }}
                  />
                </div>
              </li>
            );
          })}
        </ul>
      ) : (
        <p className="text-sm font-bold text-ink/60 mb-4">No learning time logged yet today.</p>
      )}

      <p className="text-[10px] font-extrabold uppercase tracking-wide text-ink/50 mb-2">Past 7 days</p>
      <div className="flex items-end gap-1.5 h-24">
        {week.map((day) => {
          const h = day.total > 0 ? Math.max(8, (day.total / weekMax) * 100) : 4;
          const label = day.date.slice(5);
          return (
            <div key={day.date} className="flex-1 flex flex-col items-center gap-1 min-w-0">
              <div
                className="w-full rounded-t-md bg-primary/70"
                style={{ height: `${h}%` }}
                title={formatScreenMinutes(day.total)}
              />
              <span className="text-[9px] font-bold text-ink/45 tabular-nums">{label}</span>
            </div>
          );
        })}
      </div>
    </section>
  );
}
