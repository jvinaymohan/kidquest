import { LEVELS, OPERATIONS } from "./mathMastery/constants";
import { AGE_GROUPS } from "../data/subjects";

/** Minimum session attempts before suggesting a level change. */
export const PLACEMENT_MIN_ATTEMPTS = 10;

/** Accuracy below this triggers an adaptive downgrade suggestion. */
export const PLACEMENT_FAIL_THRESHOLD = 0.6;

/** Boss score (out of 20) below this triggers table downgrade suggestion. */
export const BOSS_FAIL_SCORE = 12;

export function suggestedMathLevel(ageGroup) {
  if (ageGroup === "champion") return 4;
  if (ageGroup === "adventurer") return 3;
  return 1;
}

export function suggestedMulTable(ageGroup) {
  if (ageGroup === "champion") return 10;
  if (ageGroup === "adventurer") return 6;
  return 2;
}

export function ageGroupMeta(ageGroup) {
  return AGE_GROUPS.find((g) => g.id === ageGroup) ?? AGE_GROUPS[1];
}

export function placementCopy(ageGroup, subject = "math") {
  const meta = ageGroupMeta(ageGroup);
  const mathLvl = suggestedMathLevel(ageGroup);
  const mulTbl = suggestedMulTable(ageGroup);

  if (subject === "multiplication") {
    return {
      title: `Ready for the ${mulTbl}× table?`,
      body: `You're an ${meta.label} (${meta.ageRange}) — most kids your age start around table ${mulTbl}. Want to jump ahead or warm up first?`,
      jumpLabel: `Jump to ${mulTbl}×! 🚀`,
      easyLabel: "Start easy (2×)",
    };
  }

  return {
    title: `Try Level ${mathLvl}?`,
    body: `You're an ${meta.label} (${meta.ageRange}) — we think Level ${mathLvl} is a great starting spot. Jump ahead or build up from Level 1?`,
    jumpLabel: `Start at Level ${mathLvl}! 🚀`,
    easyLabel: "Start at Level 1",
  };
}

export function downgradeCopy({ subject, fromLevel, fromTable }) {
  if (subject === "multiplication" && fromTable > 1) {
    const easier = fromTable - 1;
    return {
      title: "Let's practice easier ones first!",
      body: `The ${fromTable}× boss was tough. Table ${easier}× is a great place to build speed.`,
      actionLabel: `Try ${easier}× table`,
    };
  }
  if (fromLevel > 1) {
    const easier = fromLevel - 1;
    return {
      title: "No worries — we'll level you down!",
      body: `Level ${fromLevel} is tricky right now. Level ${easier} will help you build a super streak.`,
      actionLabel: `Switch to Level ${easier}`,
    };
  }
  return null;
}

export function isFreshMathProgress(progress) {
  if (!progress || typeof progress !== "object") return true;
  return OPERATIONS.every((op) => {
    const opRow = progress[op.id] ?? {};
    return LEVELS.every((lvl) => {
      const row = opRow[lvl] ?? opRow[String(lvl)];
      if (!row) return lvl === 1;
      const attempts = row.totalAttempts ?? 0;
      const mastered = row.mastered ?? false;
      const unlocked = row.unlocked ?? lvl === 1;
      if (lvl === 1) return attempts === 0 && !mastered && unlocked;
      return !mastered && !unlocked && attempts === 0;
    });
  });
}

export function isFreshMulProgress(tables) {
  if (!tables || typeof tables !== "object") return true;
  for (let n = 1; n <= 20; n++) {
    const row = tables[n] ?? tables[String(n)];
    if (!row) continue;
    if (row.learnComplete || row.bossPassed || row.legendAt) return false;
    if (n > 2 && row.unlocked) return false;
    if ((row.currentPhase ?? 1) > 1) return false;
  }
  return true;
}

export function sessionNeedsDowngrade(correct, total) {
  if (total < PLACEMENT_MIN_ATTEMPTS) return false;
  return correct / total < PLACEMENT_FAIL_THRESHOLD;
}

export function bossNeedsDowngrade(score) {
  return score < BOSS_FAIL_SCORE;
}
