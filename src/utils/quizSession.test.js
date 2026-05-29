import test from "node:test";
import assert from "node:assert/strict";
import { createQuizSession, submitQuizAnswer } from "./quizSession.js";

test("requeues wrong questions and requires mastery", () => {
  const questions = [{ id: "a" }, { id: "b" }, { id: "c" }];
  let session = createQuizSession(questions, { minQuestions: 10, retryGap: 2 });

  assert.equal(session.queue.length, 10);
  assert.equal(session.done, false);

  const first = session.queue[0];
  session = submitQuizAnswer(session, false);
  assert.equal(session.attempts, 1);
  assert.equal(session.done, false);
  assert.equal(session.queue[2], first);

  while (!session.done) {
    session = submitQuizAnswer(session, true);
  }

  assert.ok(session.attempts >= 10);
  assert.equal(session.mastered.size, questions.length);
});
