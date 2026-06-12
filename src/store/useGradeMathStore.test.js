import test from "node:test";
import assert from "node:assert/strict";
import { create } from "zustand";
import { GRADES } from "../utils/gradeMath/constants.js";

function suggestedGrade(ageGroup) {
  if (ageGroup === "champion") return 5;
  if (ageGroup === "adventurer") return 3;
  return 1;
}

/** Minimal store logic mirror for unlock tests (no localStorage). */
function createTestGradeStore() {
  return create((set) => ({
    currentGrade: 1,
    unlockedGrades: [1],
    gradeStats: Object.fromEntries(
      GRADES.map((g) => [
        g,
        {
          practiceSessions: 0,
          checkSessions: 0,
          testAttempts: 0,
          testPassed: false,
          bestTestPct: 0,
          lastCheckPct: null,
          weakTopics: [],
        },
      ])
    ),

    recordSession: (grade, mode, { correct, total, weakTopics = [] }) => {
      const pct = total ? Math.round((correct / total) * 100) : 0;
      const passed = mode === "test" && total > 0 && correct / total >= 0.8;

      set((s) => {
        const prev = s.gradeStats[grade];
        const nextStats = { ...prev, bestTestPct: Math.max(prev.bestTestPct, pct) };
        if (mode === "test") {
          nextStats.testAttempts += 1;
          if (passed) nextStats.testPassed = true;
        }
        if (mode === "check") {
          nextStats.lastCheckPct = pct;
          nextStats.weakTopics = weakTopics;
        }

        const unlocked = new Set(s.unlockedGrades);
        unlocked.add(grade);
        let currentGrade = s.currentGrade;
        if (passed && grade < 10) {
          unlocked.add(grade + 1);
          currentGrade = grade + 1;
        }

        return {
          gradeStats: { ...s.gradeStats, [grade]: nextStats },
          unlockedGrades: [...unlocked].sort((a, b) => a - b),
          currentGrade,
        };
      });

      return { passed, pct };
    },

    applyAgePlacement: (ageGroup, { jumpAhead = true } = {}) => {
      const start = jumpAhead ? suggestedGrade(ageGroup) : 1;
      const unlocked = [];
      for (let g = 1; g <= start; g++) unlocked.push(g);
      set({ currentGrade: start, unlockedGrades: unlocked });
      return start;
    },
  }));
}

test("passing grade 1 test unlocks grade 2", () => {
  const store = createTestGradeStore();
  const { passed } = store.getState().recordSession(1, "test", { correct: 12, total: 15 });
  assert.equal(passed, true);
  assert.ok(store.getState().unlockedGrades.includes(2));
  assert.equal(store.getState().currentGrade, 2);
});

test("failing grade test does not unlock next grade", () => {
  const store = createTestGradeStore();
  store.getState().recordSession(1, "test", { correct: 10, total: 15 });
  assert.equal(store.getState().unlockedGrades.includes(2), false);
  assert.equal(store.getState().currentGrade, 1);
});

test("age placement unlocks grades through suggested start", () => {
  const store = createTestGradeStore();
  store.getState().applyAgePlacement("adventurer", { jumpAhead: true });
  assert.equal(store.getState().currentGrade, 3);
  assert.deepEqual(store.getState().unlockedGrades, [1, 2, 3]);
});

test("explorer age placement starts at grade 1", () => {
  const store = createTestGradeStore();
  store.getState().applyAgePlacement("explorer", { jumpAhead: true });
  assert.equal(store.getState().currentGrade, 1);
  assert.deepEqual(store.getState().unlockedGrades, [1]);
});
