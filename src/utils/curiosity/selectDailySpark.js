import { filterCards } from "./filters";
import { hashPick, isoWeekKey, seasonForDate, schoolPeriodUS, sportsMomentUS, todayISO } from "./calendar";

function scoreCard(card, ctx) {
  let score = 0;
  if (card.topics?.includes(ctx.season)) score += 3;
  if (card.seasons?.includes(ctx.season)) score += 4;
  if (card.schoolPeriods?.includes(ctx.schoolPeriod)) score += 2;
  if (card.sportsMoments?.includes(ctx.sportsMoment)) score += 3;
  if (card.priority) score += card.priority;
  return score;
}

export function selectDailySpark(allCards, prefs, { ageGroup, date = new Date() } = {}) {
  const daily = filterCards(
    allCards.filter((c) => c.type === "daily"),
    prefs,
    { ageGroup, date }
  );
  if (!daily.length) return null;

  const ctx = {
    season: seasonForDate(date),
    schoolPeriod: schoolPeriodUS(date),
    sportsMoment: sportsMomentUS(date),
  };

  const seed = `${todayISO(date)}-${prefs?.region ?? "US"}-${ageGroup}`;
  const maxScore = Math.max(...daily.map((c) => scoreCard(c, ctx)));
  const top = daily.filter((c) => scoreCard(c, ctx) >= maxScore - 1);
  return hashPick(seed, top.length ? top : daily);
}

export function selectWeeklySpotlight(allCards, prefs, { ageGroup, date = new Date() } = {}) {
  const weekly = filterCards(
    allCards.filter((c) => c.type === "weekly"),
    prefs,
    { ageGroup, date }
  );
  if (!weekly.length) return null;
  const seed = `${isoWeekKey(date)}-${prefs?.region ?? "US"}-${ageGroup}`;
  return hashPick(seed, weekly);
}

export function selectMonthlyTheme(allCards, prefs, { ageGroup, date = new Date() } = {}) {
  const monthly = filterCards(
    allCards.filter((c) => c.type === "monthly"),
    prefs,
    { ageGroup, date }
  );
  if (!monthly.length) return null;
  const seed = `${date.getFullYear()}-${date.getMonth()}-${prefs?.region ?? "US"}-${ageGroup}`;
  return hashPick(seed, monthly);
}

export function getCardById(allCards, id) {
  return allCards.find((c) => c.id === id) ?? null;
}
