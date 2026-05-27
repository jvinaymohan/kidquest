import { useCallback, useMemo, useRef, useState } from "react";
import { ALL_FACTS } from "../data/multiplication/tables";
import { shuffle } from "../utils/multiplicationScoring";
import { useMultiplicationStore } from "../store/useMultiplicationStore";

export function useSpeedRun() {
  const tables = useMultiplicationStore((s) => s.tables);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [startedAt, setStartedAt] = useState(null);
  const [elapsed, setElapsed] = useState(0);
  const timerRef = useRef(null);

  const questions = useMemo(() => {
    const practicedTables = Object.entries(tables)
      .filter(([, t]) => t.currentPhase >= 2)
      .map(([n]) => Number(n));
    const pool = ALL_FACTS.filter(
      (f) =>
        practicedTables.length === 0 ||
        practicedTables.includes(f.tableNumber) ||
        Math.random() < 0.3
    );
    const mixed = shuffle(pool.length >= 50 ? pool : ALL_FACTS);
    return mixed.slice(0, 50);
  }, []);

  const current = questions[index];
  const done = index >= questions.length;

  const start = useCallback(() => {
    setStartedAt(Date.now());
    timerRef.current = setInterval(() => {
      setElapsed((e) => e + 100);
    }, 100);
  }, []);

  const stopTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
  }, []);

  const submitAnswer = useCallback(
    (given, responseMs) => {
      const correct = Number(given) === current.product;
      const entry = {
        factId: current.id,
        multiplicand: current.multiplicand,
        multiplier: current.multiplier,
        product: current.product,
        given: Number(given),
        correct,
        responseMs,
      };
      setAnswers((a) => [...a, entry]);
      setIndex((i) => i + 1);
      return { correct, entry };
    },
    [current]
  );

  const results = useMemo(() => {
    if (!done) return null;
    const score = answers.filter((a) => a.correct).length;
    const wrong = answers.filter((a) => !a.correct);
    const slowest = [...answers]
      .sort((a, b) => b.responseMs - a.responseMs)
      .slice(0, 5);
    const accuracy = (score / 50) * 100;
    return {
      score,
      wrong,
      slowest,
      accuracy,
      totalTimeMs: elapsed || (startedAt ? Date.now() - startedAt : 0),
      answers,
    };
  }, [done, answers, elapsed, startedAt]);

  return {
    questions,
    current,
    index,
    done,
    elapsed,
    start,
    stopTimer,
    submitAnswer,
    results,
  };
}
