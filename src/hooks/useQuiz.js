import { useCallback, useState } from "react";

export function useQuiz(questions = []) {
  const [index, setIndex] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [results, setResults] = useState([]);
  const [done, setDone] = useState(false);

  const total = questions.length;
  const current = questions[index];

  const submit = useCallback(
    (wasCorrect) => {
      setResults((r) => [...r, wasCorrect]);
      if (wasCorrect) setCorrectCount((n) => n + 1);
      if (index + 1 >= total) {
        setDone(true);
      } else {
        setIndex((i) => i + 1);
      }
    },
    [index, total]
  );

  const reset = useCallback(() => {
    setIndex(0);
    setCorrectCount(0);
    setResults([]);
    setDone(false);
  }, []);

  return { current, index, total, correctCount, results, done, submit, reset };
}
