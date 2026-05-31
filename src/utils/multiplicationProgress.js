import { getFactsForTable } from "../data/multiplication/tables";

export function countLegendaryTables(tables) {
  if (!tables) return 0;
  return Object.values(tables).filter((t) => t?.legendAt).length;
}

export function countTablesAtPhase3Plus(tables, unlockAll) {
  if (!tables) return 0;
  return Object.values(tables).filter((t) => (unlockAll || t?.unlocked) && (t?.currentPhase ?? 0) >= 3).length;
}

export function computeTableProgress(facts, tableNumber) {
  const tableFacts = getFactsForTable(tableNumber);
  const practiced = tableFacts.filter((f) => (facts[f.id]?.practiceHits ?? 0) >= 2).length;
  const drilled = tableFacts.filter((f) => (facts[f.id]?.drillFastHits ?? 0) >= 2).length;
  const pct = Math.round(((practiced + drilled) / (tableFacts.length * 2)) * 100);
  return { practiced, drilled, total: tableFacts.length, pct: Math.min(100, pct) };
}

export function countDueReviews(state) {
  return getDueReviewIds(state).length;
}

export function getDueReviewIds(state) {
  const today = new Date().toISOString().slice(0, 10);
  const due = new Set(
    Object.entries(state.facts ?? {})
      .filter(([, f]) => f.nextReviewDate && f.nextReviewDate <= today)
      .map(([id]) => id)
  );
  Object.entries(state.tables ?? {}).forEach(([n, t]) => {
    if (t.bossPassed && !t.legendAt && (t.srPasses ?? 0) < 2) {
      getFactsForTable(Number(n))
        .slice(0, 3)
        .forEach((f) => due.add(f.id));
    }
  });
  return [...due].slice(0, 20);
}
