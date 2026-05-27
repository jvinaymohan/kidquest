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

export const LEVEL_TITLES = [
  { level: 1,  xp: 0,    title: "Curious Cub",       emoji: "🐾" },
  { level: 2,  xp: 100,  title: "Explorer Scout",    emoji: "🧭" },
  { level: 3,  xp: 250,  title: "Map Maker",         emoji: "🗺️" },
  { level: 4,  xp: 500,  title: "Star Chaser",       emoji: "⭐" },
  { level: 5,  xp: 900,  title: "World Wanderer",    emoji: "🌍" },
  { level: 6,  xp: 1400, title: "Knowledge Knight",  emoji: "⚔️" },
  { level: 7,  xp: 2000, title: "Quiz Wizard",       emoji: "🧙" },
  { level: 8,  xp: 2800, title: "Atlas Master",      emoji: "🏛️" },
  { level: 9,  xp: 3800, title: "Legend of Learning",emoji: "🏆" },
  { level: 10, xp: 5000, title: "Grand Champion",    emoji: "👑" },
];

const LEVEL_XP = LEVEL_TITLES.map((l) => l.xp);

export function levelForXP(xp) {
  let lvl = 1;
  for (let i = 0; i < LEVEL_XP.length; i++) {
    if (xp >= LEVEL_XP[i]) lvl = i + 1;
    else break;
  }
  return Math.min(lvl, LEVEL_TITLES.length);
}

export function levelInfo(xp) {
  const lvl = levelForXP(xp);
  const idx = Math.min(lvl - 1, LEVEL_TITLES.length - 1);
  return LEVEL_TITLES[idx];
}

export function xpToNextLevel(xp) {
  const lvl = levelForXP(xp);
  const next = LEVEL_XP[lvl] ?? xp + 1000;
  const prev = LEVEL_XP[lvl - 1] ?? 0;
  const info = LEVEL_TITLES[Math.min(lvl - 1, LEVEL_TITLES.length - 1)];
  const isMax = lvl >= LEVEL_TITLES.length;
  return {
    level: lvl,
    title: info.title,
    emoji: info.emoji,
    current: xp - prev,
    needed: next - prev,
    pct: isMax ? 1 : Math.min(1, (xp - prev) / Math.max(1, next - prev)),
    isMax,
  };
}
