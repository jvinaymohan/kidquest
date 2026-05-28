/** Deterministic daily challenge from calendar date (same for all users that day). */

const CHALLENGES = [
  { id: "geo-capitals", subjectId: "geography", title: "Capital Sprint", path: "/subject/geography", emoji: "🌍" },
  { id: "solar-facts", subjectId: "solar-system", title: "Planet Facts Quiz", path: "/subject/solar-system", emoji: "🪐" },
  { id: "mul-speed", subjectId: "math", title: "Speed Run Warm-up", path: "/multiplication/speed-run", emoji: "⚡" },
  { id: "mul-review", subjectId: "math", title: "Spaced Review", path: "/multiplication/review", emoji: "🧠" },
  { id: "trivia-blitz", subjectId: "trivia", title: "Trivia Blitz", path: "/subject/trivia", emoji: "⭐" },
  { id: "history-timeline", subjectId: "history", title: "Timeline Challenge", path: "/subject/history", emoji: "📜" },
];

function daySeed(date = new Date()) {
  const y = date.getFullYear();
  const m = date.getMonth() + 1;
  const d = date.getDate();
  return y * 10000 + m * 100 + d;
}

export function getDailyChallenge(date = new Date()) {
  const seed = daySeed(date);
  const idx = seed % CHALLENGES.length;
  const challenge = CHALLENGES[idx];
  const dateKey = date.toISOString().slice(0, 10);
  return { ...challenge, dateKey, xpBonus: 25 };
}

export function isDailyChallengeDone(dateKey, completedKeys = []) {
  return completedKeys.includes(`daily:${dateKey}`);
}
