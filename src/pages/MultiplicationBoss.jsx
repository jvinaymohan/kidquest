import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { AnswerKeypad } from "../components/multiplication/AnswerKeypad";
import { TimerDisplay } from "../components/multiplication/TimerDisplay";
import { getFactsForTable, ALL_FACTS, MOTIVATIONAL } from "../data/multiplication/tables";
import { shuffle } from "../utils/multiplicationScoring";
import { useMultiplicationStore } from "../store/useMultiplicationStore";
import { useAppStore } from "../store/useAppStore";
import { ConfettiBlast } from "../components/rewards/ConfettiBlast";
import { TABLE_BADGES } from "../data/multiplication/badges";
import { confirmExit, useExitGuard } from "../hooks/useExitGuard";
import { useSound } from "../hooks/useSound";

const BOSS_COUNT = 20;
const COUNTDOWN_MS = 3000;

function buildBossQuestions(tableNumber) {
  const main = getFactsForTable(tableNumber);
  const others = ALL_FACTS.filter((f) => f.tableNumber !== tableNumber);
  const extra = shuffle(others).slice(0, BOSS_COUNT);
  const mixed = shuffle([...main, ...extra]).slice(0, BOSS_COUNT);
  return mixed.length >= BOSS_COUNT ? mixed : shuffle(ALL_FACTS).slice(0, BOSS_COUNT);
}

export default function MultiplicationBoss() {
  const { tableNumber: tn } = useParams();
  const tableNumber = Number(tn);
  const questions = useMemo(() => buildBossQuestions(tableNumber), [tableNumber]);
  const recordBoss = useMultiplicationStore((s) => s.recordBoss);
  const grantXP = useAppStore((s) => s.grantXP);
  const grantBadge = useAppStore((s) => s.grantBadge);
  const navigate = useNavigate();
  const sound = useSound();

  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState(0);
  const scoreRef = useRef(0);
  const [value, setValue] = useState("");
  const [remaining, setRemaining] = useState(COUNTDOWN_MS);
  const [finished, setFinished] = useState(false);
  const [passed, setPassed] = useState(false);
  const [wrongCount, setWrongCount] = useState(0);
  const tickRef = useRef(null);
  const qStart = useRef(Date.now());
  const idxRef = useRef(0);

  const fact = questions[idx];
  const done = idx >= questions.length;
  useExitGuard(!finished, "Leave Boss Battle? This attempt will be lost.");

  useEffect(() => {
    idxRef.current = idx;
  }, [idx]);

  function advance(correct) {
    clearInterval(tickRef.current);
    if (correct) {
      scoreRef.current += 1;
      setScore(scoreRef.current);
    } else {
      setWrongCount((n) => n + 1);
    }
    setValue("");
    const nextIdx = idxRef.current + 1;
    if (nextIdx >= questions.length) {
      const finalScore = scoreRef.current;
      const ok = recordBoss(tableNumber, finalScore);
      setPassed(ok);
      setFinished(true);
      if (ok) {
        sound.bossWin();
        grantXP(100);
        const badge = TABLE_BADGES[tableNumber];
        if (badge) grantBadge(badge.id);
      } else {
        sound.wrong();
      }
      return;
    }
    setIdx(nextIdx);
  }

  useEffect(() => {
    if (done || finished) return;
    qStart.current = Date.now();
    setRemaining(COUNTDOWN_MS);
    tickRef.current = setInterval(() => {
      setRemaining((r) => {
        if (r <= 100) {
          clearInterval(tickRef.current);
          advance(false);
          return 0;
        }
        return r - 100;
      });
    }, 100);
    return () => clearInterval(tickRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idx, done, finished]);

  function submit() {
    if (!value || !fact) return;
    const correct = Number(value) === fact.product;
    advance(correct);
  }

  const learnPath = `/multiplication/table/${tableNumber}/learn`;

  if (finished) {
    const finalScore = score;
    const perfectRun = wrongCount === 0 && finalScore === BOSS_COUNT;
    const showLearn = !passed || !perfectRun;
    return (
      <div className="min-h-screen bg-mul-dark text-white p-6 text-center flex flex-col items-center justify-center gap-4">
        {passed && <ConfettiBlast />}
        <motion.h2
          initial={{ scale: 0.5 }}
          animate={{ scale: 1 }}
          className="font-display text-3xl font-extrabold text-mul-gold"
        >
          {passed ? MOTIVATIONAL.phase4Pass(tableNumber) : `Almost! ${finalScore}/20`}
        </motion.h2>
        {!passed && (
          <p className="text-sm font-bold text-white/70">Need 18/20 to unlock Legend path. Try again!</p>
        )}
        {showLearn && (
          <p className="text-sm font-bold text-white/60">
            Stuck on facts? The Learn phase walks through each one.
          </p>
        )}
        <ButtonRow
          onRetry={() => navigate(`/multiplication/table/${tableNumber}/boss`)}
          onBack={() => navigate(`/multiplication/table/${tableNumber}`)}
          onLearn={() => navigate(learnPath)}
          passed={passed}
          showLearn={showLearn}
        />
      </div>
    );
  }

  if (!fact) return null;

  return (
    <div className="min-h-screen bg-mul-dark flex flex-col p-4 text-white">
      <div className="flex justify-between items-center mb-4">
        <button
          type="button"
          onClick={() => {
            if (confirmExit("Leave Boss Battle? This attempt will be lost.")) {
              navigate(`/multiplication/table/${tableNumber}`);
            }
          }}
          className="text-sm font-bold text-mul-electric"
        >
          ← Exit
        </button>
        <span className="font-display font-extrabold text-mul-gold">
          {idx + 1}/{BOSS_COUNT} · {score} right
        </span>
        <TimerDisplay countdown={remaining} dark />
      </div>
      <div className="flex-1 flex flex-col items-center justify-center gap-6">
        <div className="font-display text-5xl font-extrabold text-mul-electric">
          {fact.multiplicand} × {fact.multiplier}
        </div>
        <div className="text-3xl font-extrabold text-mul-gold">{value || "?"}</div>
        <AnswerKeypad value={value} onChange={setValue} onSubmit={submit} dark />
      </div>
    </div>
  );
}

function ButtonRow({ onRetry, onBack, onLearn, passed, showLearn }) {
  return (
    <div className="flex flex-col sm:flex-row gap-2 mt-4">
      {!passed && (
        <button
          type="button"
          onClick={onRetry}
          className="px-4 py-2 rounded-chunky bg-mul-electric text-mul-dark font-display font-extrabold"
        >
          Try Again
        </button>
      )}
      {showLearn && (
        <button
          type="button"
          onClick={onLearn}
          className="px-4 py-2 rounded-chunky border-2 border-mul-electric text-mul-electric font-display font-extrabold"
        >
          Learn phase →
        </button>
      )}
      <button
        type="button"
        onClick={onBack}
        className="px-4 py-2 rounded-chunky border-2 border-white/30 font-display font-extrabold"
      >
        Back to Table
      </button>
    </div>
  );
}
