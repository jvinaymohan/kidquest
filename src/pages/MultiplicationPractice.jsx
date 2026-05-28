import { useMemo, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { AnswerOption } from "../components/quiz/AnswerOption";
import { Button } from "../components/ui/Button";
import { getFactsForTable, MOTIVATIONAL } from "../data/multiplication/tables";
import { pickWrongOptions, shuffle } from "../utils/multiplicationScoring";
import { useMultiplicationStore } from "../store/useMultiplicationStore";
import { useAppStore } from "../store/useAppStore";
import { useSound } from "../hooks/useSound";
import { SessionComplete } from "../components/multiplication/SessionComplete";

export default function MultiplicationPractice() {
  const { tableNumber: tn } = useParams();
  const tableNumber = Number(tn);
  const facts = useMemo(() => getFactsForTable(tableNumber), [tableNumber]);
  const factProgress = useMultiplicationStore((s) => s.facts);
  const recordPractice = useMultiplicationStore((s) => s.recordPractice);
  const touchPracticeDay = useMultiplicationStore((s) => s.touchPracticeDay);
  const grantXP = useAppStore((s) => s.grantXP);
  const navigate = useNavigate();
  const sound = useSound();

  const queue = useMemo(
    () => shuffle(facts.filter((f) => (factProgress[f.id]?.practiceHits ?? 0) < 2)),
    [facts, factProgress]
  );

  const [idx, setIdx] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const fact = queue[idx] ?? facts[0];
  const mastered = facts.every((f) => (factProgress[f.id]?.practiceHits ?? 0) >= 2);

  const options = useMemo(() => {
    if (!fact) return [];
    return shuffle([fact.product, ...pickWrongOptions(fact.product)]);
  }, [fact?.id]);

  if (!tableNumber || tableNumber < 1 || tableNumber > 20 || facts.length === 0) {
    return <p className="p-4">Invalid table.</p>;
  }

  function answer(choice) {
    const correct = choice === fact.product;
    recordPractice(fact.id, correct);
    if (correct) {
      sound.correct();
      grantXP(5);
      touchPracticeDay();
    } else {
      sound.wrong();
    }
    setFeedback({ correct, answer: fact.product });
    setTimeout(() => {
      setFeedback(null);
      if (idx + 1 >= queue.length && correct) {
        if (facts.every((f) => (useMultiplicationStore.getState().facts[f.id]?.practiceHits ?? 0) >= 2)) {
          navigate(`/multiplication/table/${tableNumber}`);
        } else {
          setIdx(0);
        }
      } else {
        setIdx((i) => (i + 1) % Math.max(queue.length, 1));
      }
    }, correct ? 600 : 1200);
  }

  if (mastered) {
    return (
      <SessionComplete
        emoji="🎉"
        title={`Table ${tableNumber} practiced!`}
        subtitle="Phase 2 complete — unlock Speed Drill when you're ready."
        stats={[
          { label: "Facts", value: facts.length },
          { label: "XP earned", value: "+5 each" },
        ]}
        primaryLabel="Back to table"
        onPrimary={() => navigate(`/multiplication/table/${tableNumber}`)}
      />
    );
  }

  if (!fact) return null;

  const doneCount = facts.filter((f) => (factProgress[f.id]?.practiceHits ?? 0) >= 2).length;

  return (
    <div className="flex flex-col gap-4 bg-cream min-h-[70vh] p-2">
      <Link to={`/multiplication/table/${tableNumber}`} className="text-sm font-bold text-math">
        ← Table {tableNumber}×
      </Link>
      <div className="text-xs font-bold text-center text-ink/60">
        Mastery {doneCount}/{facts.length}
      </div>
      <div className="w-full h-2 bg-ink/10 rounded-pill">
        <div
          className="h-full bg-success rounded-pill transition-all"
          style={{ width: `${(doneCount / facts.length) * 100}%` }}
        />
      </div>
      <h2 className="font-display text-4xl font-extrabold text-center my-4">
        {fact.multiplicand} × {fact.multiplier} = ?
      </h2>
      <div className="grid gap-3 max-w-md mx-auto w-full">
        {options.map((opt) => (
          <AnswerOption
            key={opt}
            label={String(opt)}
            disabled={!!feedback}
            onSelect={() => !feedback && answer(opt)}
            state={
              feedback
                ? opt === fact.product
                  ? "correct"
                  : !feedback.correct && opt !== fact.product
                    ? "dim"
                    : "idle"
                : "idle"
            }
          />
        ))}
      </div>
      {feedback && !feedback.correct && (
        <p className="text-center text-sm font-bold text-error animate-shake">
          {MOTIVATIONAL.wrong(feedback.answer)}
        </p>
      )}
      {feedback?.correct && (
        <p className="text-center text-sm font-bold text-success">{MOTIVATIONAL.firstCorrect}</p>
      )}
    </div>
  );
}
