import { useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { COUNTRIES, getCountry } from "../data/geography/countries";
import { Flag } from "../components/quiz/Flag";
import { AnswerOption } from "../components/quiz/AnswerOption";
import { useGeographyStore } from "../store/useGeographyStore";
import { shuffle } from "../utils/multiplicationScoring";

function pickWrongCapitals(correct, n = 3) {
  const pool = COUNTRIES.filter((c) => c.capital && c.capital !== correct).map(
    (c) => c.capital
  );
  return shuffle(pool).slice(0, n);
}

export default function GeographyReview() {
  const navigate = useNavigate();
  const due = useGeographyStore((s) => s.getDueReviews());
  const recordSRReview = useGeographyStore((s) => s.recordSRReview);

  const questions = useMemo(() => {
    const codes = shuffle(due).slice(0, 10);
    return codes
      .map((code) => getCountry(code))
      .filter(Boolean)
      .map((c) => ({
        country: c,
        prompt: `Capital of ${c.name}?`,
        answer: c.capital,
        options: shuffle([c.capital, ...pickWrongCapitals(c.capital)]),
      }));
  }, [due]);

  const [idx, setIdx] = useState(0);
  const [done, setDone] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const startRef = useRef(Date.now());

  const q = questions[idx];

  function answer(choice) {
    if (!q) return;
    const ms = Date.now() - startRef.current;
    const correct = choice === q.answer;
    if (correct) setCorrectCount((c) => c + 1);
    recordSRReview(q.country.code, correct, ms);
    if (idx + 1 >= questions.length) {
      setDone(true);
      return;
    }
    setIdx((i) => i + 1);
    startRef.current = Date.now();
  }

  if (!questions.length) {
    return (
      <div className="flex flex-col gap-4 p-4 text-center">
        <p className="text-4xl" aria-hidden>
          🌍
        </p>
        <p className="font-display text-xl font-extrabold">All caught up!</p>
        <p className="text-sm font-medium text-ink/60">
          No geography reviews due. Play a quiz to add countries to your review
          deck.
        </p>
        <Link
          to="/subject/geography"
          className="font-display font-extrabold text-geography"
        >
          Geography hub →
        </Link>
      </div>
    );
  }

  if (done) {
    return (
      <div className="flex flex-col gap-4 p-4 text-center">
        <p className="font-display text-xl font-extrabold">Review complete! 🧠</p>
        <p className="text-sm font-bold text-ink/70">
          {correctCount}/{questions.length} correct
        </p>
        <button
          type="button"
          className="font-display font-extrabold text-geography"
          onClick={() => navigate("/review")}
        >
          Back to Review hub
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <Link to="/review" className="text-sm font-bold text-geography">
        ← Review hub
      </Link>
      <p className="text-xs font-bold text-ink/55 text-center">
        {idx + 1} / {questions.length} · spaced repetition
      </p>
      <div className="flex justify-center">
        <Flag code={q.country.code} size="lg" />
      </div>
      <h2 className="font-display text-xl font-extrabold text-center">
        {q.prompt}
      </h2>
      <div className="grid gap-2">
        {q.options.map((opt) => (
          <AnswerOption key={opt} label={opt} onClick={() => answer(opt)} />
        ))}
      </div>
    </div>
  );
}
