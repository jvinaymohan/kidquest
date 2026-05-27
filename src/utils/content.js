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

export function levelLabelFor(masteryPct) {
  if (masteryPct >= 1) return "Master";
  if (masteryPct >= 0.66) return "Expert";
  if (masteryPct >= 0.33) return "Apprentice";
  return "Beginner";
}

export function allSubjectIds() {
  return SUBJECTS.map((s) => s.id);
}
