import { create } from "zustand";
import { persist } from "zustand/middleware";
import { getFactsForTable } from "../data/multiplication/tables";
import { calculateNextReview, qualityFromResponse } from "../lib/sm2";
import { rankForLegendaryCount, medalForRun } from "../utils/multiplicationScoring";
import { TABLE_BADGES } from "../data/multiplication/badges";
import { queueMulFactUpsert, queueMulTableUpsert } from "../lib/cloud/progress";

function defaultFact() {
  return {
    practiceHits: 0,
    drillFastHits: 0,
    easeFactor: 2.5,
    interval: 1,
    repetitions: 0,
    nextReviewDate: null,
    avgResponseMs: 0,
    fastestResponseMs: null,
    attemptCount: 0,
    correctCount: 0,
  };
}

function defaultTables() {
  const tables = {};
  for (let n = 1; n <= 20; n++) {
    tables[n] = {
      unlocked: n <= 2,
      currentPhase: 1,
      learnComplete: false,
      bossPassed: false,
      bossBest: 0,
      srPasses: 0,
      legendAt: null,
      bestDrillAvgMs: null,
    };
  }
  return tables;
}

function defaultFacts() {
  const facts = {};
  for (let a = 1; a <= 20; a++) {
    for (let b = 1; b <= 20; b++) {
      facts[`${a}x${b}`] = defaultFact();
    }
  }
  return facts;
}

export const useMultiplicationStore = create(
  persist(
    (set, get) => ({
      tables: defaultTables(),
      facts: defaultFacts(),
      speedRuns: [],
      bestSpeedRun: null,
      practiceStreakDays: 0,
      lastPracticeDate: null,
      tableOfTheDay: new Date().getDate() % 20 || 20,
      unlockAllTables: false,

      setUnlockAll: (v) => set({ unlockAllTables: v }),

      completeLearn: (tableNumber) => {
        set((s) => {
          const next = {
            ...s.tables[tableNumber],
            learnComplete: true,
            currentPhase: Math.max(s.tables[tableNumber]?.currentPhase ?? 1, 2),
          };
          queueMulTableUpsert(tableNumber, next);
          return { tables: { ...s.tables, [tableNumber]: next } };
        });
      },

      recordPractice: (factId, correct) => {
        set((s) => {
          const f = { ...s.facts[factId], ...defaultFact(), ...s.facts[factId] };
          f.attemptCount += 1;
          if (correct) {
            f.correctCount += 1;
            f.practiceHits = Math.min(2, f.practiceHits + 1);
          }
          const facts = { ...s.facts, [factId]: f };
          const tableNumber = parseInt(factId.split("x")[0], 10);
          const tableFacts = getFactsForTable(tableNumber);
          const allPracticed = tableFacts.every((tf) => (facts[tf.id]?.practiceHits ?? 0) >= 2);
          const tables = { ...s.tables };
          if (allPracticed && tables[tableNumber].currentPhase < 3) {
            tables[tableNumber] = { ...tables[tableNumber], currentPhase: 3 };
            queueMulTableUpsert(tableNumber, tables[tableNumber]);
          }
          queueMulFactUpsert(factId, f);
          return { facts, tables };
        });
      },

      recordDrill: (factId, correct, responseMs) => {
        set((s) => {
          const f = { ...s.facts[factId], ...defaultFact(), ...s.facts[factId] };
          f.attemptCount += 1;
          if (correct) {
            f.correctCount += 1;
            if (responseMs < 4000) {
              f.drillFastHits = Math.min(2, f.drillFastHits + 1);
            }
            if (!f.fastestResponseMs || responseMs < f.fastestResponseMs) {
              f.fastestResponseMs = responseMs;
            }
            f.avgResponseMs = f.avgResponseMs
              ? Math.round((f.avgResponseMs + responseMs) / 2)
              : responseMs;
          }
          const facts = { ...s.facts, [factId]: f };
          const tableNumber = parseInt(factId.split("x")[0], 10);
          const tableFacts = getFactsForTable(tableNumber);
          const allDrilled = tableFacts.every((tf) => (facts[tf.id]?.drillFastHits ?? 0) >= 2);
          const tables = { ...s.tables };
          if (allDrilled && tables[tableNumber].currentPhase < 4) {
            tables[tableNumber] = { ...tables[tableNumber], currentPhase: 4 };
            queueMulTableUpsert(tableNumber, tables[tableNumber]);
          }
          queueMulFactUpsert(factId, f);
          return { facts, tables };
        });
      },

      recordBoss: (tableNumber, score) => {
        const passed = score >= 18;
        set((s) => {
          const tables = { ...s.tables };
          const t = { ...tables[tableNumber] };
          t.bossBest = Math.max(t.bossBest, score);
          if (passed) {
            t.bossPassed = true;
            t.srPasses = 0;
            t.currentPhase = Math.max(t.currentPhase, 4);
          }
          tables[tableNumber] = t;
          queueMulTableUpsert(tableNumber, t);
          if (passed) {
            const next = tableNumber + 1;
            if (next <= 20 && tables[next]) {
              tables[next] = { ...tables[next], unlocked: true };
              queueMulTableUpsert(next, tables[next]);
            }
          }
          return { tables };
        });
        return passed;
      },

      recordSRReview: (factId, correct, responseMs) => {
        set((s) => {
          const f = { ...s.facts[factId], ...defaultFact(), ...s.facts[factId] };
          const quality = qualityFromResponse({ correct, responseMs });
          const next = calculateNextReview(f, quality);
          Object.assign(f, next);
          queueMulFactUpsert(factId, f);
          return { facts: { ...s.facts, [factId]: f } };
        });
      },

      completeSRSession: (tableNumber) => {
        set((s) => {
          const tables = { ...s.tables };
          const t = { ...tables[tableNumber] };
          if (!t.bossPassed && t.currentPhase < 5) return s;
          t.srPasses = Math.min(2, (t.srPasses ?? 0) + 1);
          if (t.srPasses >= 2 && !t.legendAt) {
            t.legendAt = new Date().toISOString();
            t.currentPhase = 5;
            const nextTable = tableNumber + 1;
            if (nextTable <= 20 && tables[nextTable]) {
              tables[nextTable] = { ...tables[nextTable], unlocked: true };
              queueMulTableUpsert(nextTable, tables[nextTable]);
            }
          }
          tables[tableNumber] = t;
          queueMulTableUpsert(tableNumber, t);
          return { tables };
        });
      },

      completeSpeedRun: (result) => {
        set((s) => {
          const { medal } = medalForRun(result.score, result.totalTimeMs);
          const run = {
            ...result,
            medal,
            at: new Date().toISOString(),
          };
          const speedRuns = [...s.speedRuns, run].slice(-10);
          let bestSpeedRun = s.bestSpeedRun;
          if (
            !bestSpeedRun ||
            result.score > bestSpeedRun.score ||
            (result.score === bestSpeedRun.score && result.totalTimeMs < bestSpeedRun.totalTimeMs)
          ) {
            bestSpeedRun = { ...run, isPersonalBest: true };
          }
          return { speedRuns, bestSpeedRun };
        });
      },

      touchPracticeDay: () => {
        const today = new Date().toISOString().slice(0, 10);
        set((s) => {
          if (s.lastPracticeDate === today) return s;
          const yesterday = new Date();
          yesterday.setDate(yesterday.getDate() - 1);
          const yStr = yesterday.toISOString().slice(0, 10);
          const streak =
            s.lastPracticeDate === yStr ? s.practiceStreakDays + 1 : 1;
          return { lastPracticeDate: today, practiceStreakDays: streak };
        });
      },

      getTableProgress: (tableNumber) => {
        const s = get();
        const tableFacts = getFactsForTable(tableNumber);
        const practiced = tableFacts.filter((f) => (s.facts[f.id]?.practiceHits ?? 0) >= 2).length;
        const drilled = tableFacts.filter((f) => (s.facts[f.id]?.drillFastHits ?? 0) >= 2).length;
        const pct = Math.round(((practiced + drilled) / (tableFacts.length * 2)) * 100);
        return { practiced, drilled, total: tableFacts.length, pct: Math.min(100, pct) };
      },

      getLegendaryCount: () => {
        const s = get();
        return Object.values(s.tables).filter((t) => t.legendAt).length;
      },

      getRank: () => rankForLegendaryCount(get().getLegendaryCount()),

      getDueReviews: () => {
        const today = new Date().toISOString().slice(0, 10);
        const s = get();
        const due = new Set(
          Object.entries(s.facts)
            .filter(([, f]) => f.nextReviewDate && f.nextReviewDate <= today)
            .map(([id]) => id)
        );
        Object.entries(s.tables).forEach(([n, t]) => {
          if (t.bossPassed && !t.legendAt && (t.srPasses ?? 0) < 2) {
            getFactsForTable(Number(n))
              .slice(0, 3)
              .forEach((f) => due.add(f.id));
          }
        });
        return [...due].slice(0, 20);
      },

      tablesAtPhase3Plus: () => {
        const s = get();
        return Object.values(s.tables).filter((t) => t.unlocked && t.currentPhase >= 3).length;
      },

      resetProgress: () =>
        set({
          tables: defaultTables(),
          facts: defaultFacts(),
          speedRuns: [],
          bestSpeedRun: null,
          practiceStreakDays: 0,
          lastPracticeDate: null,
        }),
    }),
    { name: "kidquest-multiplication-v1" }
  )
);

export function tableBadgeIds(tables) {
  return Object.entries(tables)
    .filter(([, t]) => t.legendAt)
    .map(([n]) => TABLE_BADGES[Number(n)]?.id)
    .filter(Boolean);
}
