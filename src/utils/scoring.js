export function calculateStars(correct, total) {
  if (total === 0) return 0;
  const pct = correct / total;
  if (pct >= 0.999) return 3;
  if (pct >= 0.7) return 2;
  if (pct >= 0.5) return 1;
  return 0;
}

export function pointsForLesson(correct, total) {
  const base = correct * 10;
  const bonus = correct === total && total > 0 ? 20 : 0;
  return base + bonus;
}

export function ageMultiplier(ageGroup) {
  if (ageGroup === "champion") return 1.4;
  if (ageGroup === "adventurer") return 1.2;
  return 1;
}

export function xpForLesson(correct, total, ageGroup) {
  return Math.round(pointsForLesson(correct, total) * ageMultiplier(ageGroup));
}

const LEVEL_TABLE = [
  0, 50, 120, 220, 360, 540, 760, 1020, 1320, 1660, 2040, 2460, 2920, 3420, 3960,
];

export function levelForXP(xp) {
  let lvl = 1;
  for (let i = 0; i < LEVEL_TABLE.length; i++) {
    if (xp >= LEVEL_TABLE[i]) lvl = i + 1;
    else break;
  }
  return lvl;
}

export function xpToNextLevel(xp) {
  const lvl = levelForXP(xp);
  const next = LEVEL_TABLE[lvl] ?? xp + 500;
  const prev = LEVEL_TABLE[lvl - 1] ?? 0;
  return {
    level: lvl,
    current: xp - prev,
    needed: next - prev,
    pct: Math.min(1, (xp - prev) / Math.max(1, next - prev)),
  };
}
