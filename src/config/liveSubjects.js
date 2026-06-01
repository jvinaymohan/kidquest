/** Subjects with full playable experiences (others show Coming soon). */
export const LIVE_SUBJECT_IDS = new Set([
  "geography",
  "math",
  "solar-system",
  "science",
  "trivia",
  "curiosity",
]);

export function isLiveSubject(subjectId) {
  return LIVE_SUBJECT_IDS.has(subjectId);
}

export function pathForSubject(subjectId) {
  if (subjectId === "math") return "/math";
  if (subjectId === "solar-system") return "/subject/solar-system?tab=learn";
  if (subjectId === "geography") return "/subject/geography";
  if (subjectId === "science") return "/science";
  if (subjectId === "trivia") return "/trivia";
  if (subjectId === "curiosity") return "/curiosity";
  return null;
}
