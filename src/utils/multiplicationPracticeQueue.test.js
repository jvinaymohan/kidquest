import test from "node:test";
import assert from "node:assert/strict";

/**
 * Mirrors MultiplicationPractice queue indexing after the mastery bugfix.
 * Manual check: answer facts in a shrinking queue — modulo must not fall back to facts[0].
 */
function pickFact(queue, idx, factsFallback) {
  return queue.length > 0 ? queue[idx % queue.length] : factsFallback[0] ?? null;
}

test("modulo index stays in queue when queue shrinks", () => {
  const facts = [{ id: "6x1" }, { id: "6x2" }, { id: "6x3" }];
  let queue = [...facts];
  let idx = 2;
  const first = pickFact(queue, idx, facts);
  assert.equal(first.id, "6x3");
  queue = queue.filter((f) => f.id !== "6x1");
  idx = 2;
  const afterShrink = pickFact(queue, idx, facts);
  assert.equal(afterShrink.id, "6x2");
  assert.notEqual(afterShrink.id, facts[0].id);
});
