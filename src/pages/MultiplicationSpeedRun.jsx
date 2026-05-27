import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { AnswerKeypad } from "../components/multiplication/AnswerKeypad";
import { TimerDisplay } from "../components/multiplication/TimerDisplay";
import { useSpeedRun } from "../hooks/useSpeedRun";
import { useMultiplicationStore } from "../store/useMultiplicationStore";
import { confirmExit, useExitGuard } from "../hooks/useExitGuard";

export default function MultiplicationSpeedRun() {
  const navigate = useNavigate();
  const completeSpeedRun = useMultiplicationStore((s) => s.completeSpeedRun);
  const touchPracticeDay = useMultiplicationStore((s) => s.touchPracticeDay);
  const {
    current,
    index,
    done,
    elapsed,
    start,
    stopTimer,
    submitAnswer,
    results,
  } = useSpeedRun();

  const [value, setValue] = useState("");
  const [shake, setShake] = useState(false);
  const qStart = useRef(null);
  const started = useRef(false);
  useExitGuard(!done, "Leave Speed Run? This attempt will be lost.");

  useEffect(() => {
    if (!started.current) {
      started.current = true;
      start();
    }
    return () => stopTimer();
  }, [start, stopTimer]);

  useEffect(() => {
    qStart.current = Date.now();
  }, [index]);

  useEffect(() => {
    if (done && results) {
      stopTimer();
      completeSpeedRun(results);
      touchPracticeDay();
      navigate("/multiplication/results", { state: { results } });
    }
  }, [done, results, completeSpeedRun, touchPracticeDay, navigate, stopTimer]);

  function trySubmit() {
    if (!value || !current) return;
    const ms = Date.now() - qStart.current;
    const { correct } = submitAnswer(value, ms);
    setValue("");
    if (!correct) {
      setShake(true);
      setTimeout(() => setShake(false), 400);
    }
  }

  if (!current) {
    return (
      <div className="min-h-screen bg-mul-dark text-white flex items-center justify-center">
        Loading…
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-mul-dark flex flex-col p-3 text-white">
      <div className="flex justify-between items-center px-1">
        <button
          type="button"
          onClick={() => {
            if (confirmExit("Leave Speed Run? This attempt will be lost.")) {
              navigate("/multiplication");
            }
          }}
          className="text-xs font-bold text-mul-electric"
        >
          Exit
        </button>
        <div className="flex gap-0.5 flex-wrap max-w-[70%]">
          {Array.from({ length: 50 }).map((_, i) => (
            <span
              key={i}
              className={`w-1.5 h-1.5 rounded-full ${
                i < index ? "bg-success" : i === index ? "bg-mul-gold" : "bg-white/20"
              }`}
            />
          ))}
        </div>
        <TimerDisplay ms={elapsed} dark />
      </div>

      <motion.div
        className={`flex-1 flex flex-col items-center justify-center gap-4 px-2 ${
          shake ? "animate-shake" : ""
        }`}
        animate={{ opacity: 1 }}
      >
        <div className="font-display text-5xl sm:text-7xl font-extrabold text-mul-electric text-center leading-tight">
          {current.multiplicand} × {current.multiplier}
        </div>
        <div className="text-2xl sm:text-3xl font-extrabold text-mul-gold min-h-[40px]">
          {value}
        </div>
      </motion.div>

      <AnswerKeypad value={value} onChange={setValue} onSubmit={trySubmit} dark />
    </div>
  );
}
