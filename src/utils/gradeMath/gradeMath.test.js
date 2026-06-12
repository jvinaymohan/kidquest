import test from "node:test";
import assert from "node:assert/strict";
import { generateGradeQuestions, gradeQuestionAnswerMatches, analyzeWeakTopics } from "./generators.js";
import {
  sessionPassed,
  starsForGrade,
  nextGradeAfterPass,
  accuracyPct,
} from "./unlock.js";
import { GRADE_PASS_THRESHOLD } from "./constants.js";

test("grade 1 generator produces valid questions", () => {
  const qs = generateGradeQuestions(1, 10, "test-seed-g1");
  assert.equal(qs.length, 10);
  for (const q of qs) {
    assert.ok(q.id);
    assert.ok(q.topic);
    assert.ok(q.prompt);
    assert.ok(q.answer);
    assert.ok(["numeric", "choice"].includes(q.type));
    if (q.type === "choice") {
      assert.equal(q.options.length, 4);
      assert.ok(q.options.includes(q.answer));
    }
  }
});

test("grade 3 generator answers are checkable", () => {
  const qs = generateGradeQuestions(3, 6, "test-seed-g3");
  for (const q of qs) {
    assert.equal(gradeQuestionAnswerMatches(q.answer, q), true);
  }
});

test("weak topic analysis flags low accuracy topics", () => {
  const weak = analyzeWeakTopics([
    { topic: "multiplication", correct: false },
    { topic: "multiplication", correct: false },
    { topic: "division", correct: true },
  ]);
  assert.equal(weak.length, 1);
  assert.equal(weak[0].topic, "multiplication");
  assert.ok(weak[0].pct < GRADE_PASS_THRESHOLD);
});

test("grade test pass requires 80% on 15 questions", () => {
  assert.equal(sessionPassed(12, 15, "test"), true);
  assert.equal(sessionPassed(11, 15, "test"), false);
  assert.equal(sessionPassed(8, 10, "practice"), false);
  assert.equal(accuracyPct(12, 15), 80);
});

test("unlock logic advances to next grade", () => {
  assert.equal(nextGradeAfterPass(3), 4);
  assert.equal(nextGradeAfterPass(10), null);
});

test("stars reflect test performance", () => {
  assert.equal(starsForGrade({ testPassed: false }), 0);
  assert.equal(starsForGrade({ testPassed: true, bestTestPct: 82 }), 1);
  assert.equal(starsForGrade({ testPassed: true, bestTestPct: 90 }), 2);
  assert.equal(starsForGrade({ testPassed: true, bestTestPct: 97 }), 3);
});
