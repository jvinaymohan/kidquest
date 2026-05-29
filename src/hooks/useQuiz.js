import { useCallback, useMemo, useState } from "react";
import {
  createQuizSession,
  getCurrentQuestion,
  submitQuizAnswer,
} from "../utils/quizSession";

const MIN_SESSION_QUESTIONS = 10;

export function useQuiz(questions = []) {
  const [session, setSession] = useState(() =>
    createQuizSession(questions, { minQuestions: MIN_SESSION_QUESTIONS })
  );

  const currentItem = useMemo(() => getCurrentQuestion(session, questions), [session, questions]);
  const current = currentItem?.question ?? null;
  const total = Math.max(session.minQuestions, session.attempts + session.queue.length);
  const index = session.attempts;
  const results = session.answered.map((r) => r.correct);
  const correctCount = results.filter(Boolean).length;

  const scopeCount = questions.length;
  const masteredCount = session.mastered.size;
  const done = session.done;

  const submit = useCallback(
    (wasCorrect) => {
      setSession((prev) => submitQuizAnswer(prev, wasCorrect));
    },
    []
  );

  const reset = useCallback(() => {
    setSession(createQuizSession(questions, { minQuestions: MIN_SESSION_QUESTIONS }));
  }, [questions]);

  return {
    current,
    index,
    total,
    correctCount,
    results,
    done,
    submit,
    reset,
    scopeCount,
    masteredCount,
    minQuestions: session.minQuestions,
  };
}
