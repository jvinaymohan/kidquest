import { useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { FactCard } from "../components/multiplication/FactCard";
import { Button } from "../components/ui/Button";
import { getFactsForTable, tablePatterns } from "../data/multiplication/tables";
import { useMultiplicationStore } from "../store/useMultiplicationStore";

export default function MultiplicationLearn() {
  const { tableNumber: tn } = useParams();
  const tableNumber = Number(tn);
  const facts = getFactsForTable(tableNumber);
  const [idx, setIdx] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const completeLearn = useMultiplicationStore((s) => s.completeLearn);
  const touchPracticeDay = useMultiplicationStore((s) => s.touchPracticeDay);
  const navigate = useNavigate();

  const fact = facts[idx];
  const done = idx >= facts.length;

  function next() {
    if (idx + 1 >= facts.length) {
      completeLearn(tableNumber);
      touchPracticeDay();
      navigate(`/multiplication/table/${tableNumber}`);
      return;
    }
    setIdx((i) => i + 1);
    setRevealed(false);
  }

  if (!fact) {
    return <p className="p-4">Invalid table.</p>;
  }

  return (
    <div className="flex flex-col gap-4 min-h-[70vh] bg-cream">
      <Link to={`/multiplication/table/${tableNumber}`} className="text-sm font-bold text-math">
        ← Table {tableNumber}×
      </Link>
      <div className="text-xs font-bold text-ink/50 text-center">
        {idx + 1} / {facts.length}
      </div>
      <div className="w-full h-2 bg-ink/10 rounded-pill overflow-hidden">
        <div
          className="h-full bg-mul-electric transition-all"
          style={{ width: `${((idx + 1) / facts.length) * 100}%` }}
        />
      </div>
      {idx === 0 && tablePatterns[tableNumber] && (
        <p className="text-sm font-bold text-center text-ink/70 px-2">{tablePatterns[tableNumber]}</p>
      )}
      {!done ? (
        <>
          <FactCard
            fact={fact}
            revealed={revealed}
            onReveal={() => setRevealed(true)}
            showDots={revealed && fact.multiplicand <= 10 && fact.multiplier <= 10}
          />
          {revealed && (
            <Button className="w-full max-w-sm mx-auto" onClick={next}>
              {idx + 1 >= facts.length ? "Finish Learn" : "Next fact →"}
            </Button>
          )}
        </>
      ) : null}
    </div>
  );
}
