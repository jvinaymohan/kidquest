import { create } from "zustand";
import { persist } from "zustand/middleware";
import { LEVELS, OPERATIONS, STREAK_TARGET } from "../utils/mathMastery/constants";

function defaultLevelRow(level) {
  return {
    mastered: false,
    unlocked: level === 1,
    bestStreak: 0,
    totalAttempts: 0,
  };
}

function defaultProgress() {
  const progress = {};
  for (const op of OPERATIONS) {
    progress[op.id] = {};
    for (const lvl of LEVELS) {
      progress[op.id][lvl] = defaultLevelRow(lvl);
    }
  }
  return progress;
}

export const useMathMasteryStore = create(
  persist(
    (set, get) => ({
      progress: defaultProgress(),
      timedMode: false,
      showHints: true,

      setTimedMode: (v) => set({ timedMode: v }),
      setShowHints: (v) => set({ showHints: v }),

      isLevelUnlocked: (operation, level) => {
        const row = get().progress[operation]?.[level];
        return Boolean(row?.unlocked || row?.mastered);
      },

      isLevelMastered: (operation, level) =>
        Boolean(get().progress[operation]?.[level]?.mastered),

      masteredCount: (operation) =>
        LEVELS.filter((l) => get().progress[operation]?.[l]?.mastered).length,

      recordAttempt: (operation, level, { correct, streak }) => {
        set((s) => {
          const op = s.progress[operation] ?? {};
          const row = { ...defaultLevelRow(level), ...op[level] };
          row.totalAttempts += 1;
          row.bestStreak = Math.max(row.bestStreak, streak);

          if (correct && streak >= STREAK_TARGET) {
            row.mastered = true;
            const next = op[level + 1];
            if (next) {
              op[level + 1] = { ...next, unlocked: true };
            }
          }

          return {
            progress: {
              ...s.progress,
              [operation]: { ...op, [level]: row },
            },
          };
        });

        const mastered = get().isLevelMastered(operation, level);
        const justMastered = correct && streak >= STREAK_TARGET;
        const allMastered =
          justMastered && LEVELS.every((l) => get().progress[operation]?.[l]?.mastered);
        return { mastered: justMastered, operationComplete: allMastered };
      },

      resetProgress: () =>
        set({
          progress: defaultProgress(),
          timedMode: false,
          showHints: true,
        }),
    }),
    { name: "kidquest-math-mastery-v1" }
  )
);
