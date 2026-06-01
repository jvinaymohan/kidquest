/** Per-problem accuracy hits and fast hits required before a stage is complete. */
export const STAGE_ACCURACY_HITS = 2;
export const STAGE_FAST_HITS = 1;

/** Problems generated per stage bank (each needs accuracy + speed mastery). */
export const STAGE_BANK_SIZE = 15;

/** Session accuracy target (alternative display metric). */
export const STAGE_SESSION_ACCURACY_TARGET = 0.9;

export const MULTIPLICATION_STAGES = [
  {
    id: "1x1",
    order: 1,
    title: "1-digit × 1-digit",
    example: "6 × 8",
    description: "Core facts with single-digit factors (1–9).",
    timeLimitMs: 8000,
    generateFactors: random1x1,
  },
  {
    id: "1x2",
    order: 2,
    title: "1-digit × 2-digit",
    example: "7 × 24",
    description: "One factor 1–9, the other 10–99.",
    timeLimitMs: 12000,
    generateFactors: random1x2,
  },
  {
    id: "2x2",
    order: 3,
    title: "2-digit × 2-digit",
    example: "14 × 16",
    description: "Both factors are two digits (10–99).",
    timeLimitMs: 15000,
    generateFactors: random2x2,
  },
  {
    id: "2x3",
    order: 4,
    title: "2-digit × 3-digit",
    example: "12 × 105",
    description: "A two-digit factor times a three-digit factor.",
    timeLimitMs: 20000,
    generateFactors: random2x3,
  },
  {
    id: "mixed-20",
    order: 5,
    title: "Mixed up to 20",
    example: "9 × 18, 14 × 7…",
    description: "Random sizes with every factor ≤ 20.",
    timeLimitMs: 12000,
    generateFactors: randomMixed20,
  },
];

export function getStage(id) {
  return MULTIPLICATION_STAGES.find((s) => s.id === id);
}

export function problemId(a, b) {
  return `${a}x${b}`;
}

export function buildProblem(a, b) {
  return {
    id: problemId(a, b),
    multiplicand: a,
    multiplier: b,
    product: a * b,
  };
}

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function random1x1() {
  return [randInt(1, 9), randInt(1, 9)];
}

function random1x2() {
  const one = randInt(1, 9);
  const two = randInt(10, 99);
  return Math.random() < 0.5 ? [one, two] : [two, one];
}

function random2x2() {
  return [randInt(10, 99), randInt(10, 99)];
}

function random2x3() {
  const two = randInt(10, 99);
  const three = randInt(100, 999);
  return Math.random() < 0.5 ? [two, three] : [three, two];
}

function randomMixed20() {
  return [randInt(1, 20), randInt(1, 20)];
}

/** Unique problem bank for a stage (deterministic size, random problems). */
export function generateStageBank(stage, size = STAGE_BANK_SIZE) {
  if (!stage) return [];
  const seen = new Set();
  const bank = [];
  let guard = 0;
  while (bank.length < size && guard < size * 40) {
    guard += 1;
    const [a, b] = stage.generateFactors();
    const id = problemId(a, b);
    if (seen.has(id)) continue;
    seen.add(id);
    bank.push(buildProblem(a, b));
  }
  return bank;
}

export function defaultProblemProgress() {
  return { accuracyHits: 0, fastHits: 0 };
}

export function isProblemMastered(row, stage) {
  const acc = row?.accuracyHits ?? 0;
  const fast = row?.fastHits ?? 0;
  return acc >= STAGE_ACCURACY_HITS && fast >= STAGE_FAST_HITS;
}

export function stageProgressCounts(stageRow, bank, stage) {
  const problems = stageRow?.problems ?? {};
  let accuracyDone = 0;
  let speedDone = 0;
  let fullyDone = 0;
  for (const p of bank) {
    const row = problems[p.id] ?? defaultProblemProgress();
    if ((row.accuracyHits ?? 0) >= STAGE_ACCURACY_HITS) accuracyDone += 1;
    if ((row.fastHits ?? 0) >= STAGE_FAST_HITS) speedDone += 1;
    if (isProblemMastered(row, stage)) fullyDone += 1;
  }
  const total = bank.length || STAGE_BANK_SIZE;
  return { accuracyDone, speedDone, fullyDone, total };
}

export function isStageMastered(stageRow, bank, stage) {
  if (!bank.length) return false;
  return bank.every((p) => isProblemMastered(stageRow?.problems?.[p.id], stage));
}
