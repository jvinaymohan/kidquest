import { useEffect, useMemo, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AnswerKeypad } from "../components/multiplication/AnswerKeypad";
import { TimerDisplay } from "../components/multiplication/TimerDisplay";
import { getFactsForTable } from "../data/multiplication/tables";
import { shuffle } from "../utils/multiplicationScoring";
import { useMultiplicationStore } from "../store/useMultiplicationStore";
import { useAppStore } from "../store/useAppStore";
import { confirmExit, useExitGuard } from "../hooks/useExitGuard";
import { useSound } from "../hooks/useSound";
import { SessionComplete } from "../components/multiplication/SessionComplete";

export default function MultiplicationDrill() {
  const { tableNumber: tn } = useParams();
  const tableNumber = Number(tn);
  const facts = useMemo(() => getFactsForTable(tableNumber), [tableNumber]);
  const factProgress = useMultiplicationStore((s) => s.facts);
  const recordDrill = useMultiplicationStore((s) => s.recordDrill);
  const touchPracticeDay = useMultiplicationStore((s) => s.touchPracticeDay);
  const grantXP = useAppStore((s) => s.grantXP);
  const navigate = useNavigate();
  const sound = useSound();

  const queue = useMemo(
    () => shuffle(facts.filter((f) => (factProgress[f.id]?.drillFastHits ?? 0) < 2)),
    [facts, factProgress]
  );

  const [qIdx, setQIdx] = useState(0);
  const [value, setValue] = useState("");
  const [times, setTimes] = useState([]);
  const [wrongCount, setWrongCount] = useState(0);
  const startRef = useRef(null);
  const fact = queue[qIdx % Math.max(queue.length, 1)];

  const drilled = facts.filter((f) => (factProgress[f.id]?.drillFastHits ?? 0) >= 2).length;
  const allDone = drilled >= facts.length;
  useExitGuard(!allDone, "Leave Speed Drill? This run's momentum will reset.");

  useEffect(() => {
    startRef.current = Date.now();
  }, [qIdx, fact?.id]);

  if (!tableNumber || tableNumber < 1 || tableNumber > 20 || facts.length === 0) {
    return <p className="p-4">Invalid table.</p>;
  }

  function submit() {
    if (!value || !fact) return;
    const ms = Date.now() - startRef.current;
    const correct = Number(value) === fact.product;
    recordDrill(fact.id, correct, ms);
    if (correct) {
      sound.correct();
      grantXP(ms < 4000 ? 8 : 4);
      touchPracticeDay();
      if (ms < 4000) setTimes((t) => [...t, ms]);
    } else {
      sound.wrong();
      setWrongCount((n) => n + 1);
    }
    setValue("");
    setQIdx((i) => i + 1);
    if (useMultiplicationStore.getState().tables[tableNumber]?.currentPhase >= 4) {
      navigate(`/multiplication/table/${tableNumber}`);
    }
  }

  const sessionAvg =
    times.length > 0 ? times.reduce((a, b) => a + b, 0) / times.length : null;

  const learnPath = `/multiplication/table/${tableNumber}/learn`;
  const perfectSession = wrongCount === 0;

  if (allDone) {
    return (
      <div className="min-h-screen bg-mul-dark">
        <SessionComplete
          emoji="⚡"
          title="Speed drill complete!"
          subtitle={
            perfectSession
              ? "Boss Battle is unlocked — beat 18/20 to earn your table badge."
              : "Nice work! Review facts in Learn if any felt slow."
          }
          stats={[
            { label: "Avg time", value: sessionAvg ? `${(sessionAvg / 1000).toFixed(1)}s` : "—" },
            { label: "Misses", value: wrongCount },
          ]}
          primaryLabel="Boss Battle →"
          onPrimary={() => navigate(`/multiplication/table/${tableNumber}/boss`)}
          secondaryLabel={!perfectSession ? "Try Learn phase" : "Back to table"}
          onSecondary={() =>
            navigate(!perfectSession ? learnPath : `/multiplication/table/${tableNumber}`)
          }
        />
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
        {sessionAvg ? ` · Avg ${(sessionAvg / 1000).toFixed(1)}s` : ""}
      </p>
      <div className="flex-1 flex flex-col items-center justify-center gap-6">
        <TimerDisplay ms={startRef.current ? Date.now() - startRef.current : 0} dark label="This question" />
        <div className="font-display text-5xl sm:text-6xl font-extrabold text-mul-electric">
          {fact.multiplicand} × {fact.multiplier}
        </div>
        <div className="text-3xl font-extrabold text-mul-gold min-h-[48px]">{value || "?"}</div>
        <AnswerKeypad value={value} onChange={setValue} onSubmit={submit} dark />
        {wrongCount > 0 && (
          <button
            type="button"
            onClick={() => navigate(learnPath)}
            className="text-sm font-bold text-mul-electric underline"
          >
            Need help? Try Learn phase
          </button>
        )}
      </div>
    </div>
  );
}
