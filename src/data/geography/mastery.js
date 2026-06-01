import { CONTINENTS } from "./countries";
import { TIER_1, TIER_2 } from "./difficulty";

/** Mastery tiers — Explorer → Regional (per continent) → World Master. */
export const GEO_TIERS = [
  {
    id: "explorer",
    title: "Explorer",
    emoji: "🦋",
    blurb: "30 famous countries — flags, capitals & map pins",
    questionCount: 10,
    masteryTarget: 30,
  },
  {
    id: "regional",
    title: "Regional Master",
    emoji: "🗺️",
    blurb: "10 questions per continent — learn one region at a time",
    questionCount: 10,
    masteryTarget: null,
  },
  {
    id: "world",
    title: "World Master",
    emoji: "🏆",
    blurb: "All 194 countries with spaced repetition until mastery",
    questionCount: 15,
    masteryTarget: 194,
  },
];

export const GEO_TRACKS = [
  { id: "flags", title: "Flags", emoji: "🚩" },
  { id: "capitals", title: "Capitals", emoji: "🏛️" },
  { id: "map", title: "Map", emoji: "📍" },
  { id: "continents", title: "Continents", emoji: "🌍" },
];

export { CONTINENTS };

/** Seed countries per continent for Regional tier (expand over time). */
export const SEED_BY_CONTINENT = {
  Africa: [
    "EG", "ZA", "NG", "KE", "MA", "GH", "ET", "TZ", "UG", "DZ",
    "TN", "SN", "CI", "CM", "AO", "MZ", "MG", "ZW", "SD", "RW",
  ],
  Americas: [
    "US", "CA", "MX", "BR", "AR", "CL", "CO", "PE", "VE", "CU",
    "JM", "PA", "CR", "DO", "EC", "BO", "PY", "UY", "GT", "HN",
  ],
  Asia: [
    "CN", "JP", "IN", "KR", "TH", "VN", "ID", "PH", "MY", "SG",
    "PK", "BD", "SA", "AE", "IL", "TR", "IR", "NP", "MN", "KZ",
  ],
  Europe: [
    "GB", "FR", "DE", "IT", "ES", "PT", "NL", "BE", "CH", "SE",
    "NO", "DK", "IE", "PL", "GR", "AT", "FI", "UA", "HU", "CZ",
  ],
  Oceania: [
    "AU", "NZ", "FJ", "PG", "WS", "TO", "VU", "SB", "FM", "PW",
  ],
};

export function poolForTier(tierId, { continent, allCountries }) {
  if (tierId === "explorer") {
    return allCountries.filter((c) => TIER_1.includes(c.code));
  }
  if (tierId === "regional" && continent) {
    const seeds = new Set(SEED_BY_CONTINENT[continent] ?? []);
    const regional = allCountries.filter((c) => c.continent === continent);
    const seeded = regional.filter((c) => seeds.has(c.code));
    return seeded.length >= 8 ? seeded : regional.slice(0, 20);
  }
  if (tierId === "world") {
    return allCountries;
  }
  const pool = new Set([...TIER_1, ...TIER_2]);
  return allCountries.filter((c) => pool.has(c.code));
}

export function questionCountForTier(tierId) {
  return GEO_TIERS.find((t) => t.id === tierId)?.questionCount ?? 10;
}
