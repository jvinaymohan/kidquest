import { SUBJECTS } from "../data/subjects";
import { subjectProgress } from "./content";

const SUBJECT_BADGE_KEY = {
  history: "history_apprentice",
  geography: "geography_apprentice",
  music: "music_apprentice",
  math: "math_apprentice",
  "general-knowledge": "gk_apprentice",
  trivia: "trivia_apprentice",
};

export function computeUnlockedBadges(state) {
  const unlocked = new Set(state.badges);
  const lessonProgress = state.lessonProgress || {};
  const totalLessonsAttempted = Object.keys(lessonProgress).length;
  const totalPerfectLessons = Object.values(lessonProgress).filter((p) => (p?.stars ?? 0) >= 3).length;

  if (totalLessonsAttempted >= 1) unlocked.add("first_lesson");
  if (totalPerfectLessons >= 1) unlocked.add("first_perfect");

  if (state.currentStreak >= 3) unlocked.add("streak_3");
  if (state.currentStreak >= 7) unlocked.add("streak_7");
  if (state.currentStreak >= 30) unlocked.add("streak_30");

  if (state.totalXP >= 100) unlocked.add("xp_100");
  if (state.totalXP >= 500) unlocked.add("xp_500");
  if (state.totalXP >= 1000) unlocked.add("xp_1000");

  const triedSubjects = new Set();
  for (const sid of Object.keys(SUBJECT_BADGE_KEY)) {
    const prog = subjectProgress(sid, state.ageGroup, lessonProgress);
    if (prog.attempted > 0) triedSubjects.add(sid);
    if (prog.mastered >= 3) unlocked.add(SUBJECT_BADGE_KEY[sid]);
    if (prog.total > 0 && prog.mastered === prog.total) unlocked.add("subject_master");
  }
  if (triedSubjects.size === SUBJECTS.length) unlocked.add("all_subjects");

  return Array.from(unlocked);
}

export function findNewBadges(prev, next) {
  const prevSet = new Set(prev);
  return next.filter((id) => !prevSet.has(id));
}
