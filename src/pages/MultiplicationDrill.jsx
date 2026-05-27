import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { AnswerKeypad } from "../components/multiplication/AnswerKeypad";
import { TimerDisplay } from "../components/multiplication/TimerDisplay";
import { getFactsForTable } from "../data/multiplication/tables";
import { shuffle } from "../utils/multiplicationScoring";
import { useMultiplicationStore } from "../store/useMultiplicationStore";
import { useAppStore } from "../store/useAppStore";
import { confirmExit, useExitGuard } from "../hooks/useExitGuard";

export default function MultiplicationDrill() {
  const { tableNumber: tn } = useParams();
  const tableNumber = Number(tn);
  const facts = useMemo(() => getFactsForTable(tableNumber), [tableNumber]);
  const factProgress = useMultiplicationStore((s) => s.facts);
  const recordDrill = useMultiplicationStore((s) => s.recordDrill);
  const touchPracticeDay = useMultiplicationStore((s) => s.touchPracticeDay);
  const grantXP = useAppStore((s) => s.grantXP);
  const navigate = useNavigate();

  const queue = useMemo(
    () => shuffle(facts.filter((f) => (factProgress[f.id]?.drillFastHits ?? 0) < 2)),
    [facts, factProgress]
  );

  const [qIdx, setQIdx] = useState(0);
  const [value, setValue] = useState("");
  const [questionCount, setQuestionCount] = useState(0);
  const [times, setTimes] = useState([]);
  const startRef = useRef(null);
  const fact = queue[qIdx % Math.max(queue.length, 1)];

  const drilled = facts.filter((f) => (factProgress[f.id]?.drillFastHits ?? 0) >= 2).length;
  const allDone = drilled >= facts.length;
  if (!tableNumber || tableNumber < 1 || tableNumber > 20 || facts.length === 0) {
    return <p className="p-4">Invalid table.</p>;
  }
  useExitGuard(!allDone, "Leave Speed Drill? This run's momentum will reset.");

  useEffect(() => {
    startRef.current = Date.now();
  }, [qIdx, fact?.id]);

  function submit() {
    if (!value || !fact) return;
    const ms = Date.now() - startRef.current;
    const correct = Number(value) === fact.product;
    recordDrill(fact.id, correct, ms);
    if (correct) {
      grantXP(ms < 4000 ? 8 : 4);
      touchPracticeDay();
      if (ms < 4000) setTimes((t) => [...t, ms]);
    }
    setQuestionCount((c) => c + 1);
    setValue("");
    if (questionCount + 1 >= 10) {
      const avg = times.length ? times.reduce((a, b) => a + b, 0) / times.length : ms;
      alert(`Session avg: ${(avg / 1000).toFixed(1)}s — keep pushing under 3s!`);
      setQuestionCount(0);
      setTimes([]);
    }
    setQIdx((i) => i + 1);
    if (useMultiplicationStore.getState().tables[tableNumber]?.currentPhase >= 4) {
      navigate(`/multiplication/table/${tableNumber}`);
    }
  }

  if (allDone) {
    return (
      <div className="min-h-screen bg-mul-dark text-white p-6 text-center">
        <h2 className="font-display text-2xl font-extrabold text-mul-gold">Speed Drill Complete!</h2>
        <Link to={`/multiplication/table/${tableNumber}`} className="inline-block mt-4 text-mul-electric font-bold">
          Boss Battle unlocked →
        </Link>
      </div>
    );
  }

  if (!fact) return null;

  return (
    <div className="min-h-screen bg-mul-dark flex flex-col p-4 text-white">
      <button
        type="button"
        onClick={() => {
          if (confirmExit("Leave Speed Drill? This run's momentum will reset.")) {
            navigate(`/multiplication/table/${tableNumber}`);
          }
        }}
        className="text-sm font-bold text-mul-electric mb-2 text-left"
      >
        ← Table {tableNumber}×
      </button>
      <p className="text-xs font-bold text-white/60 text-center">
        Target: under 3 seconds · Drilled {drilled}/{facts.length}
      </p>
      <div className="flex-1 flex flex-col items-center justify-center gap-6">
        <TimerDisplay ms={startRef.current ? Date.now() - startRef.current : 0} dark label="This question" />
        <div className="font-display text-5xl sm:text-6xl font-extrabold text-mul-electric">
          {fact.multiplicand} × {fact.multiplier}
        </div>
        <div className="text-3xl font-extrabold text-mul-gold min-h-[48px]">{value || "?"}</div>
        <AnswerKeypad value={value} onChange={setValue} onSubmit={submit} dark />
      </div>
    </div>
  );
}
