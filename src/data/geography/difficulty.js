// Curated lists of country ISO2 codes by difficulty tier.
// Used to pick age-appropriate countries for quizzes.

// Tier 1: globally famous, on every kid's radar. Explorer pool.
export const TIER_1 = [
  "US", "GB", "FR", "DE", "IT", "ES", "CA", "MX", "BR", "AR",
  "JP", "CN", "IN", "AU", "RU", "EG", "ZA", "KE", "NG", "TR",
  "GR", "PT", "NL", "BE", "CH", "SE", "NO", "DK", "IE", "PL",
];

// Tier 2: well-known. Adventurer pool (T1 + T2).
export const TIER_2 = [
  "VN", "TH", "ID", "PH", "MY", "SG", "KR", "PK", "BD", "SA",
  "AE", "IL", "IR", "NP", "MN", "NZ", "FJ", "CL", "PE", "CO",
  "VE", "EC", "CU", "JM", "PA", "AT", "FI", "IS", "UA", "HU",
  "CZ", "RO", "BG", "HR", "RS", "MA", "DZ", "TN", "GH", "TZ",
  "UG", "ET", "ZW", "SD", "AO", "MZ", "MG", "BS", "DO", "CR",
];

// Tier 3: harder countries (small islands, less famous). Champion pool (T1 + T2 + T3).
// Champion uses ALL UN members.

export function poolForAgeGroup(ageGroup, allCountries) {
  if (ageGroup === "explorer") {
    return allCountries.filter((c) => TIER_1.includes(c.code));
  }
  if (ageGroup === "adventurer") {
    const pool = new Set([...TIER_1, ...TIER_2]);
    return allCountries.filter((c) => pool.has(c.code));
  }
  return allCountries;
}
