import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import {
  lastNDaysKeys,
  subjectIdForSection,
  todayKey,
} from "../utils/screenTimeSections";
import { useAppStore } from "./useAppStore";

const MAX_HISTORY_DAYS = 14;

function pruneHistory(byDate) {
  const keys = Object.keys(byDate).sort();
  if (keys.length <= MAX_HISTORY_DAYS) return byDate;
  const keep = new Set(keys.slice(-MAX_HISTORY_DAYS));
  return Object.fromEntries(Object.entries(byDate).filter(([k]) => keep.has(k)));
}

export const useScreenTimeStore = create(
  persist(
    (set, get) => ({
      byDate: {},

      tick: (sectionId, seconds) => {
        if (!sectionId || seconds <= 0) return;
        const date = todayKey();
        set((s) => {
          const day = { ...(s.byDate[date] ?? {}) };
          day[sectionId] = (day[sectionId] ?? 0) + seconds;
          return { byDate: pruneHistory({ ...s.byDate, [date]: day }) };
        });
        const subjectId = subjectIdForSection(sectionId);
        if (subjectId) {
          useAppStore.getState().addTimeToSubject(subjectId, seconds);
        }
      },

      getDay: (date = todayKey()) => get().byDate[date] ?? {},

      getTodayTotalSeconds: () => {
        const day = get().getDay();
        return Object.values(day).reduce((a, b) => a + b, 0);
      },

      getWeekSummary: () => {
        const keys = lastNDaysKeys(7);
        return keys.map((date) => {
          const sections = get().byDate[date] ?? {};
          const total = Object.values(sections).reduce((a, b) => a + b, 0);
          return { date, total, sections };
        });
      },
    }),
    {
      name: "kidquest-screen-time-v1",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export function formatScreenMinutes(seconds) {
  const m = Math.round(seconds / 60);
  if (m < 1) return "under 1 min";
  if (m === 1) return "1 min";
  return `${m} min`;
}
