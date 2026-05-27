import { SUBJECTS, getLessonsFor } from "../data/subjects";

export function subjectProgress(subjectId, ageGroup, lessonProgress) {
  const lessons = getLessonsFor(subjectId, ageGroup);
  const total = lessons.length;
  if (total === 0) return { total: 0, mastered: 0, attempted: 0, stars: 0, maxStars: 0, masteryPct: 0 };

  let mastered = 0;
  let attempted = 0;
  let stars = 0;

  for (const lesson of lessons) {
    const p = lessonProgress[lesson.id];
    if (!p) continue;
    attempted++;
    stars += p.stars ?? 0;
    if (p.mastered) mastered++;
  }

  return {
    total,
    mastered,
    attempted,
    stars,
    maxStars: total * 3,
    masteryPct: total === 0 ? 0 : mastered / total,
  };
}

export function isLessonUnlocked(subjectId, ageGroup, lessonId, lessonProgress) {
  const lessons = getLessonsFor(subjectId, ageGroup);
  const idx = lessons.findIndex((l) => l.id === lessonId);
  if (idx <= 0) return true;
  const prev = lessons[idx - 1];
  const prevProgress = lessonProgress[prev.id];
  return Boolean(prevProgress?.mastered || (prevProgress?.stars ?? 0) >= 2);
}

export function findNextLesson(subjectId, ageGroup, lessonProgress) {
  const lessons = getLessonsFor(subjectId, ageGroup);
  for (const lesson of lessons) {
    const p = lessonProgress[lesson.id];
    if (!p || !p.mastered) return lesson;
  }
  return null;
}

export const SUBJECT_RANKS = [
  { min: 0,    title: "Seedling", emoji: "🌱", color: "#6BCB77" },
  { min: 0.17, title: "Seeker",   emoji: "🔍", color: "#4ECDC4" },
  { min: 0.34, title: "Scholar",  emoji: "📚", color: "#3A86FF" },
  { min: 0.5,  title: "Expert",   emoji: "🎓", color: "#9B5DE5" },
  { min: 0.75, title: "Master",   emoji: "🏆", color: "#FF6B35" },
  { min: 1.0,  title: "Legend",   emoji: "💎", color: "#E63946" },
];

export function subjectRankFor(masteryPct) {
  let rank = SUBJECT_RANKS[0];
  for (const r of SUBJECT_RANKS) {
    if (masteryPct >= r.min) rank = r;
  }
  return rank;
}

// Legacy alias for older imports
export const levelLabelFor = (p) => subjectRankFor(p).title;

export function allSubjectIds() {
  return SUBJECTS.map((s) => s.id);
}
