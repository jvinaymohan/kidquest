import { create } from "zustand";
import { persist } from "zustand/middleware";
import { LEVELS, OPERATIONS, STREAK_TARGET } from "../utils/mathMastery/constants";
import { suggestedMathLevel } from "../utils/placement";

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

function mergeProgress(persisted) {
  const merged = defaultProgress();
  if (!persisted || typeof persisted !== "object") return merged;
  for (const op of OPERATIONS) {
    const opRow = persisted[op.id];
    if (!opRow || typeof opRow !== "object") continue;
    for (const lvl of LEVELS) {
      const row = opRow[lvl] ?? opRow[String(lvl)];
      if (row) merged[op.id][lvl] = { ...defaultLevelRow(lvl), ...row };
    }
  }
  return merged;
}

export const useMathMasteryStore = create(
  persist(
    (set, get) => ({
      progress: defaultProgress(),
      timedMode: false,
      showHints: true,
      placementApplied: false,

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

      applyAgePlacement: (ageGroup, { jumpAhead = true } = {}) => {
        const startLevel = jumpAhead ? suggestedMathLevel(ageGroup) : 1;
        set((s) => {
          const progress = defaultProgress();
          for (const op of OPERATIONS) {
            for (const lvl of LEVELS) {
              if (lvl < startLevel) {
                progress[op.id][lvl] = {
                  ...defaultLevelRow(lvl),
                  unlocked: true,
                };
              } else if (lvl === startLevel) {
                progress[op.id][lvl] = {
                  ...defaultLevelRow(lvl),
                  unlocked: true,
                };
              }
            }
          }
          return { progress, placementApplied: true };
        });
        return startLevel;
      },

      stepDownLevel: (operation, fromLevel) => {
        const target = Math.max(1, fromLevel - 1);
        if (target >= fromLevel) return target;
        set((s) => {
          const op = { ...(s.progress[operation] ?? {}) };
          for (const lvl of LEVELS) {
            if (lvl >= fromLevel) {
              op[lvl] = { ...defaultLevelRow(lvl), unlocked: false, mastered: false };
            }
          }
          op[target] = { ...defaultLevelRow(target), unlocked: true };
          return {
            progress: { ...s.progress, [operation]: op },
          };
        });
        return target;
      },

      resetProgress: () =>
        set({
          progress: defaultProgress(),
          timedMode: false,
          showHints: true,
          placementApplied: false,
        }),
    }),
    {
      name: "kidquest-math-mastery-v1",
      merge: (persisted, current) => ({
        ...current,
        ...persisted,
        progress: mergeProgress(persisted?.progress ?? current.progress),
      }),
    }
  )
);
