import { ageGroupToBand } from "./ageBands";
import { isActiveOnDate } from "./calendar";

const BLOCKED_TOPIC_PATTERNS = [/politic/i, /election/i, /war/i, /violence/i, /breaking/i];

/** Safety gate — cards must pass schema + parent prefs. */
export function passesSafety(card) {
  if (!card?.id || !card?.title || !card?.hook) return false;
  if (card.rawNews === true) return false;
  if (card.autoplay === true) return false;
  const text = `${card.title} ${card.hook}`;
  if (BLOCKED_TOPIC_PATTERNS.some((p) => p.test(text))) return false;
  return true;
}

export function matchesRegion(card, region) {
  if (!region || region === "US") {
    return !card.region?.length || card.region.includes("US") || card.region.includes("global");
  }
  return card.region?.includes(region) || card.region?.includes("global");
}

export function matchesAgeBand(card, band) {
  return !card.ageBands?.length || card.ageBands.includes(band);
}

export function matchesSensitivity(card, maxLevel) {
  const order = { gentle: 0, standard: 1 };
  const cardLevel = order[card.sensitivity] ?? 1;
  const max = order[maxLevel] ?? 1;
  return cardLevel <= max;
}

export function matchesTopics(card, enabledTopics) {
  if (!enabledTopics || enabledTopics === "all") return true;
  if (!card.topics?.length) return true;
  return card.topics.some((t) => enabledTopics[t] !== false);
}

export function isApproved(card, approvedIds, requireApproval) {
  if (!requireApproval) return true;
  if (card.sensitivity === "gentle") return true;
  return approvedIds?.includes(card.id);
}

export function filterCards(cards, prefs, { ageGroup, date = new Date() } = {}) {
  const band = ageGroupToBand(ageGroup);
  const region = prefs?.region ?? "US";
  const maxSensitivity = prefs?.maxSensitivity ?? "standard";
  const enabledTopics = prefs?.topics ?? {};
  const requireApproval = prefs?.requireTopicApproval ?? false;
  const approvedIds = prefs?.approvedTopicIds ?? [];

  return cards.filter(
    (c) =>
      passesSafety(c) &&
      isActiveOnDate(c, date) &&
      matchesRegion(c, region) &&
      matchesAgeBand(c, band) &&
      matchesSensitivity(c, maxSensitivity) &&
      matchesTopics(c, enabledTopics) &&
      isApproved(c, approvedIds, requireApproval)
  );
}
