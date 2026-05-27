export const RANKS = [
  { min: 0, title: "Multiplication Beginner", emoji: "🌱" },
  { min: 1, title: "Times Table Trainee", emoji: "📘" },
  { min: 4, title: "Multiplication Apprentice", emoji: "🔢" },
  { min: 7, title: "Times Table Scout", emoji: "🧭" },
  { min: 11, title: "Multiplication Expert", emoji: "🎓" },
  { min: 15, title: "Speed Calculator", emoji: "⚡" },
  { min: 18, title: "Math Machine", emoji: "🤖" },
  { min: 20, title: "THE GRAND MULTIPLIER", emoji: "💎" },
];

export function rankForLegendaryCount(count) {
  let rank = RANKS[0];
  for (const r of RANKS) {
    if (count >= r.min) rank = r;
  }
  return rank;
}

export function medalForRun(score, totalTimeMs) {
  if (score === 50 && totalTimeMs < 180000) return { medal: "gold", label: "Gold", emoji: "🥇", perfect: true };
  if (score === 50) return { medal: "gold", label: "Gold", emoji: "🥇", perfect: false };
  if (score >= 45) return { medal: "silver", label: "Silver", emoji: "🥈", perfect: false };
  if (score >= 40) return { medal: "bronze", label: "Bronze", emoji: "🥉", perfect: false };
  return { medal: null, label: "Keep Training", emoji: "💪", perfect: false };
}

export function xpForSpeedRun(score, accuracyPct) {
  const base = score * 4;
  const bonus = Math.round(accuracyPct * 20);
  return base + bonus;
}

export function tablePhaseColor(phase, unlocked) {
  if (!unlocked) return { bg: "#E8E8E8", ring: "#B0B0B0", label: "Locked" };
  if (phase >= 5) return { bg: "#FFF4C2", ring: "#FFD700", label: "Legend", glow: true };
  if (phase >= 4) return { bg: "#FFE0CC", ring: "#FF6B35", label: "Boss" };
  if (phase >= 3) return { bg: "#FFF0CC", ring: "#FFB703", label: "Speed" };
  return { bg: "#D6EEFF", ring: "#00D4FF", label: "Learning" };
}

export function formatMs(ms) {
  const sec = Math.floor(ms / 1000);
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

export function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function pickWrongOptions(product, count = 3) {
  const wrong = new Set();
  while (wrong.size < count) {
    const delta = Math.floor(Math.random() * 11) - 5;
    const w = product + delta;
    if (w > 0 && w !== product) wrong.add(w);
  }
  return [...wrong];
}
