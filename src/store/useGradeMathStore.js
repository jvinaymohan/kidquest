import { create } from "zustand";
import { persist } from "zustand/middleware";
import { GRADES } from "../utils/gradeMath/constants";
import {
  accuracyPct,
  nextGradeAfterPass,
  sessionPassed,
  starsForGrade,
} from "../utils/gradeMath/unlock";
import { suggestedGrade } from "../utils/placement";

function defaultGradeStats() {
  return {
    practiceSessions: 0,
    checkSessions: 0,
    testAttempts: 0,
    testPassed: false,
    bestTestPct: 0,
    lastCheckPct: null,
    weakTopics: [],
  };
}

function defaultState() {
  return {
    currentGrade: 1,
    unlockedGrades: [1],
    gradeStats: Object.fromEntries(GRADES.map((g) => [g, defaultGradeStats()])),
    placementApplied: false,
  };
}

function mergeGradeStats(persisted) {
  const stats = {};
  for (const g of GRADES) {
    stats[g] = { ...defaultGradeStats(), ...(persisted?.[g] ?? {}) };
  }
  return stats;
}

export const useGradeMathStore = create(
  persist(
    (set, get) => ({
      ...defaultState(),

      isGradeUnlocked: (grade) => get().unlockedGrades.includes(grade),

      completedGrades: () =>
        GRADES.filter((g) => get().gradeStats[g]?.testPassed),

      starsFor: (grade) => starsForGrade(get().gradeStats[grade]),

      recordSession: (grade, mode, { correct, total, weakTopics = [] }) => {
        const pct = accuracyPct(correct, total);
        const passed = sessionPassed(correct, total, mode);

        set((s) => {
          const prev = s.gradeStats[grade] ?? defaultGradeStats();
          const nextStats = { ...prev };

          if (mode === "practice") nextStats.practiceSessions += 1;
          if (mode === "check") {
            nextStats.checkSessions += 1;
            nextStats.lastCheckPct = pct;
            nextStats.weakTopics = weakTopics;
          }
          if (mode === "test") {
            nextStats.testAttempts += 1;
            nextStats.bestTestPct = Math.max(nextStats.bestTestPct, pct);
            if (passed) nextStats.testPassed = true;
          }

          const unlocked = new Set(s.unlockedGrades);
          unlocked.add(grade);
          let currentGrade = s.currentGrade;
          if (passed && mode === "test") {
            const nxt = nextGradeAfterPass(grade);
            if (nxt) {
              unlocked.add(nxt);
              currentGrade = nxt;
            }
          }

          return {
            gradeStats: { ...s.gradeStats, [grade]: nextStats },
            unlockedGrades: [...unlocked].sort((a, b) => a - b),
            currentGrade,
          };
        });

        return { passed, pct, unlockedNext: passed && mode === "test" ? nextGradeAfterPass(grade) : null };
      },

      applyAgePlacement: (ageGroup, { jumpAhead = true } = {}) => {
        const start = jumpAhead ? suggestedGrade(ageGroup) : 1;
        const unlocked = [];
        for (let g = 1; g <= start; g++) unlocked.push(g);
        set({
          currentGrade: start,
          unlockedGrades: unlocked,
          placementApplied: true,
        });
        return start;
      },

      setCurrentGrade: (grade) => {
        if (!get().isGradeUnlocked(grade)) return false;
        set({ currentGrade: grade });
        return true;
      },

      stepDownGrade: (fromGrade) => {
        const target = Math.max(1, fromGrade - 1);
        set((s) => ({
          currentGrade: target,
        }));
        return target;
      },

      resetProgress: () => set(defaultState()),
    }),
    {
      name: "kidquest-grade-math-v1",
      merge: (persisted, current) => ({
        ...current,
        ...persisted,
        gradeStats: mergeGradeStats(persisted?.gradeStats),
        unlockedGrades: persisted?.unlockedGrades?.length
          ? [...new Set(persisted.unlockedGrades)].sort((a, b) => a - b)
          : [1],
      }),
    }
  )
);

export function isFreshGradeProgress(state) {
  if (!state) return true;
  if (state.placementApplied) return false;
  const stats = state.gradeStats?.[1];
  if (!stats) return true;
  return (
    stats.practiceSessions === 0 &&
    stats.checkSessions === 0 &&
    stats.testAttempts === 0 &&
    !stats.testPassed
  );
}
