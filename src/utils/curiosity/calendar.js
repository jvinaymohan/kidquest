/** Rule-based calendar helpers — no live news APIs. */

export function todayISO(date = new Date()) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function isoWeekKey(date = new Date()) {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const weekNo = Math.ceil(((d - yearStart) / 86400000 + 1) / 7);
  return `${d.getUTCFullYear()}-W${String(weekNo).padStart(2, "0")}`;
}

export function monthKey(date = new Date()) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

export function seasonForDate(date = new Date()) {
  const m = date.getMonth() + 1;
  if (m >= 3 && m <= 5) return "spring";
  if (m >= 6 && m <= 8) return "summer";
  if (m >= 9 && m <= 11) return "fall";
  return "winter";
}

/** US school calendar approximations (rule-based, extensible). */
export function schoolPeriodUS(date = new Date()) {
  const m = date.getMonth() + 1;
  const d = date.getDate();
  if (m === 6 || m === 7 || (m === 8 && d < 15)) return "summer-break";
  if (m === 12 && d >= 15) return "winter-break";
  if (m === 1 && d <= 5) return "winter-break";
  if (m === 3 && d >= 10 && d <= 25) return "spring-break";
  if (m === 11 && d >= 20 && d <= 30) return "thanksgiving-week";
  if (m >= 9 && m <= 5) return "in-session";
  return "in-session";
}

/** Gentle sports/culture moments — themed, not live scores. */
export function sportsMomentUS(date = new Date()) {
  const m = date.getMonth() + 1;
  if (m === 2) return "winter-games-season";
  if (m === 3 || m === 4) return "basketball-finals-season";
  if (m === 7) return "summer-sports-fest";
  if (m === 10) return "fall-sports";
  if (m === 11) return "gratitude-games";
  return null;
}

export function isActiveOnDate(card, date = new Date()) {
  const day = todayISO(date);
  if (card.activeFrom && day < card.activeFrom) return false;
  if (card.activeUntil && day > card.activeUntil) return false;
  return true;
}

export function hashPick(seed, items) {
  if (!items.length) return null;
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) | 0;
  return items[Math.abs(h) % items.length];
}
