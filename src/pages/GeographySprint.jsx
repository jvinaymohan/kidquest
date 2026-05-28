import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { COUNTRIES } from "../data/geography/countries";
import { AnswerOption } from "../components/quiz/AnswerOption";
import { SessionComplete } from "../components/multiplication/SessionComplete";
import { useGeographyStore } from "../store/useGeographyStore";
import { useAppStore } from "../store/useAppStore";
import { shuffle } from "../utils/multiplicationScoring";

const SPRINT_SIZE = 8;
const TIME_LIMIT_MS = 120_000;

function pickWrongCapitals(correct, n = 3) {
  const pool = COUNTRIES.filter((c) => c.capital && c.capital !== correct).map((c) => c.capital);
  return shuffle(pool).slice(0, n);
}

export default function GeographySprint() {
  const navigate = useNavigate();
  const grantXP = useAppStore((s) => s.grantXP);
  const recordPractice = useGeographyStore((s) => s.recordPractice);

  const questions = useMemo(() => {
    const pool = shuffle(COUNTRIES.filter((c) => c.capital)).slice(0, SPRINT_SIZE);
    return pool.map((c) => ({
      country: c,
      prompt: `Capital of ${c.name}?`,
      answer: c.capital,
      options: shuffle([c.capital, ...pickWrongCapitals(c.capital)]),
    }));
  }, []);

  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const [startedAt] = useState(Date.now());

  const q = questions[idx];

  function answer(choice) {
    const correct = choice === q.answer;
    if (correct) {
      setScore((s) => s + 1);
      recordPractice(q.country.code, true);
      grantXP(8);
    } else {
      recordPractice(q.country.code, false);
    }
    if (idx + 1 >= questions.length) {
      setDone(true);
      return;
    }
    setIdx((i) => i + 1);
  }

  if (done) {
    const elapsed = Date.now() - startedAt;
    return (
      <SessionComplete
        emoji="🌍"
        title="Geography Sprint complete!"
        subtitle={`${score}/${SPRINT_SIZE} in ${(elapsed / 1000).toFixed(0)}s`}
        stats={[
          { label: "Score", value: `${score}/${SPRINT_SIZE}` },
          { label: "Target", value: "< 2 min" },
        ]}
        primaryLabel="Back to Compete"
        onPrimary={() => navigate("/compete")}
        secondaryLabel="Explore map"
        onSecondary={() => navigate("/subject/geography?tab=learn")}
      />
    );
  }

  if (!q) return null;

  return (
    <div className="flex flex-col gap-4">
      <Link to="/compete" className="text-sm font-bold text-geography">
        ← Compete
      </Link>
      <p className="text-xs font-bold text-ink/55 text-center">
        Sprint {idx + 1}/{SPRINT_SIZE} · {Math.round((TIME_LIMIT_MS - (Date.now() - startedAt)) / 1000)}s soft limit
      </p>
      <h2 className="font-display text-xl font-extrabold text-center">{q.prompt}</h2>
      <div className="grid gap-2">
        {q.options.map((opt) => (
          <AnswerOption key={opt} label={opt} onClick={() => answer(opt)} />
        ))}
      </div>
    </div>
  );
}
