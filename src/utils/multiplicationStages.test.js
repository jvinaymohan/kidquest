import test from "node:test";
import assert from "node:assert/strict";
import {
  generateStageBank,
  getStage,
  isProblemMastered,
  isStageMastered,
  STAGE_ACCURACY_HITS,
  STAGE_FAST_HITS,
} from "./multiplicationStages.js";

test("stage bank has unique problems", () => {
  const stage = getStage("1x1");
  const bank = generateStageBank(stage, 15);
  assert.equal(bank.length, 15);
  const ids = new Set(bank.map((p) => p.id));
  assert.equal(ids.size, 15);
  for (const p of bank) {
    assert.ok(p.multiplicand >= 1 && p.multiplicand <= 9);
    assert.ok(p.multiplier >= 1 && p.multiplier <= 9);
  }
});

test("problem mastery requires accuracy and speed hits", () => {
  const stage = getStage("1x1");
  assert.equal(isProblemMastered({ accuracyHits: 1, fastHits: 1 }, stage), false);
  assert.equal(
    isProblemMastered(
      { accuracyHits: STAGE_ACCURACY_HITS, fastHits: STAGE_FAST_HITS },
      stage
    ),
    true
  );
});

test("stage mastered when all bank problems mastered", () => {
  const stage = getStage("1x1");
  const bank = generateStageBank(stage, 3);
  const problems = {};
  for (const p of bank) {
    problems[p.id] = { accuracyHits: STAGE_ACCURACY_HITS, fastHits: STAGE_FAST_HITS };
  }
  assert.equal(isStageMastered({ problems }, bank, stage), true);
});
