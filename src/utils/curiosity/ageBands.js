/** KidQuest age groups → curiosity age bands (kid-safe content tiers). */
export const AGE_BANDS = ["5-7", "8-10", "11-13"];

export const AGE_GROUP_TO_BAND = {
  explorer: "5-7",
  adventurer: "8-10",
  champion: "11-13",
};

export const BAND_TO_AGE_GROUP = {
  "5-7": "explorer",
  "8-10": "adventurer",
  "11-13": "champion",
};

export function ageGroupToBand(ageGroup) {
  return AGE_GROUP_TO_BAND[ageGroup] ?? "8-10";
}

export function bandToAgeGroup(band) {
  return BAND_TO_AGE_GROUP[band] ?? "adventurer";
}

/** Pick age-specific copy from a card. */
export function contentForBand(card, band) {
  if (!card?.ageContent) return null;
  return card.ageContent[band] ?? card.ageContent["8-10"] ?? Object.values(card.ageContent)[0];
}
