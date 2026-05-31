/** Subjects with full playable experiences (others show Coming soon). */
export const LIVE_SUBJECT_IDS = new Set(["geography", "math", "solar-system"]);

export function isLiveSubject(subjectId) {
  return LIVE_SUBJECT_IDS.has(subjectId);
}

export function pathForSubject(subjectId) {
  if (subjectId === "math") return "/multiplication";
  if (subjectId === "solar-system") return "/subject/solar-system?tab=learn";
  if (subjectId === "geography") return "/subject/geography";
  return null;
}
