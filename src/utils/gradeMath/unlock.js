import { GRADE_PASS_THRESHOLD, modeConfig } from "./constants.js";

export function sessionPassed(correct, total, modeId = "test") {
  const mode = modeConfig(modeId);
  if (!mode.canUnlock) return false;
  if (total <= 0) return false;
  return correct / total >= GRADE_PASS_THRESHOLD;
}

export function accuracyPct(correct, total) {
  if (total <= 0) return 0;
  return Math.round((correct / total) * 100);
}

export function starsForGrade(stats) {
  if (!stats?.testPassed) return 0;
  const best = stats.bestTestPct ?? 0;
  if (best >= 95) return 3;
  if (best >= 85) return 2;
  return 1;
}

export function canUnlockGrade(grade, unlockedGrades) {
  if (grade <= 1) return true;
  return unlockedGrades.includes(grade);
}

export function nextGradeAfterPass(grade) {
  if (grade >= 10) return null;
  return grade + 1;
}

export function gradeDowngradeTarget(grade) {
  return Math.max(1, grade - 1);
}
