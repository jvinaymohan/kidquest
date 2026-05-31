import { useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AnswerKeypad } from "../components/multiplication/AnswerKeypad";
import { getFact } from "../data/multiplication/tables";
import { shuffle } from "../utils/multiplicationScoring";
import { useMultiplicationStore } from "../store/useMultiplicationStore";
import { getDueReviewIds } from "../utils/multiplicationProgress";
import { MOTIVATIONAL } from "../data/multiplication/tables";

export default function MultiplicationReview() {
  const facts = useMultiplicationStore((s) => s.facts);
  const tables = useMultiplicationStore((s) => s.tables);
  const dueIds = useMemo(() => getDueReviewIds({ facts, tables }), [facts, tables]);
  const recordSRReview = useMultiplicationStore((s) => s.recordSRReview);
  const completeSRSession = useMultiplicationStore((s) => s.completeSRSession);
  const navigate = useNavigate();

  const questions = useMemo(() => {
    const ids = shuffle(dueIds).slice(0, 10);
    return ids.map((id) => getFact(id)).filter(Boolean);
  }, [dueIds]);

  const [idx, setIdx] = useState(0);
  const [value, setValue] = useState("");
  const [done, setDone] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const startRef = useRef(Date.now());
  const tablesHit = useRef(new Set());

  const fact = questions[idx];

  function submit() {
    if (!fact) return;
    const ms = Date.now() - startRef.current;
    const correct = Number(value) === fact.product;
    if (correct) setCorrectCount((c) => c + 1);
    recordSRReview(fact.id, correct, ms);
    tablesHit.current.add(fact.tableNumber);
    setValue("");
    if (idx + 1 >= questions.length) {
      if (correctCount + (correct ? 1 : 0) >= Math.ceil(questions.length * 0.7)) {
        tablesHit.current.forEach((t) => completeSRSession(t));
      }
      setDone(true);
      return;
    }
    setIdx((i) => i + 1);
    startRef.current = Date.now();
  }

  if (!questions.length) {
    return (
      <div className="p-6 text-center">
        <p className="font-display font-extrabold">No reviews due right now!</p>
        <Link to="/multiplication" className="text-math font-bold mt-2 inline-block">
          Back to camp
        </Link>
      </div>
    );
  }

  if (done) {
    return (
      <div className="p-6 text-center">
        <p className="font-display text-xl font-extrabold">Review complete! 🧠</p>
        <p className="text-sm font-bold text-ink/70 mt-1">
          Accuracy: {Math.round((correctCount / Math.max(questions.length, 1)) * 100)}%
        </p>
        <p className="text-sm font-bold text-ink/60 mt-2">{MOTIVATIONAL.reviewWrong}</p>
        <button
          type="button"
          className="mt-4 font-display font-extrabold text-math"
          onClick={() => navigate("/multiplication")}
        >
          Back to camp
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-[70vh] flex flex-col p-4 bg-cream">
      <Link to="/multiplication" className="text-sm font-bold text-math mb-4">
        ← Camp
      </Link>
      <p className="text-center text-xs font-bold text-ink/60">
        Review {idx + 1}/{questions.length}
      </p>
      <div className="flex-1 flex flex-col items-center justify-center gap-4">
        <div className="font-display text-4xl font-extrabold">
          {fact.multiplicand} × {fact.multiplier} = ?
        </div>
        <div className="text-2xl font-extrabold text-math">{value}</div>
        <AnswerKeypad value={value} onChange={setValue} onSubmit={submit} />
      </div>
    </div>
  );
}
