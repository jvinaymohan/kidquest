import { useMemo, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AnswerOption } from "../components/quiz/AnswerOption";
import { SessionComplete } from "../components/multiplication/SessionComplete";
import { ALL_FACTS } from "../data/multiplication/tables";
import { COUNTRIES } from "../data/geography/countries";
import { shuffle } from "../utils/multiplicationScoring";
import { useAuthStore } from "../store/useAuthStore";
import { submitDailyDuel, fetchTodayDuel } from "../lib/cloud/social";
import { useAppStore } from "../store/useAppStore";

function buildDuelQuestions() {
  const mul = shuffle(ALL_FACTS).slice(0, 4).map((f) => ({
    prompt: `${f.multiplicand} × ${f.multiplier} = ?`,
    answer: String(f.product),
    options: shuffle([String(f.product), String(f.product + 1), String(f.product - 2), String(f.product + 3)]),
  }));
  const geo = shuffle(COUNTRIES.filter((c) => c.capital))
    .slice(0, 3)
    .map((c) => ({
      prompt: `Capital of ${c.name}?`,
      answer: c.capital,
      options: shuffle([
        c.capital,
        ...COUNTRIES.filter((x) => x.capital && x.capital !== c.capital)
          .slice(0, 3)
          .map((x) => x.capital),
      ]),
    }));
  const solar = [
    {
      prompt: "Which planet is closest to the Sun?",
      answer: "Mercury",
      options: shuffle(["Mercury", "Venus", "Earth", "Mars"]),
    },
    {
      prompt: "Largest planet in our solar system?",
      answer: "Jupiter",
      options: shuffle(["Jupiter", "Saturn", "Neptune", "Uranus"]),
    },
    {
      prompt: "Planet known for its rings?",
      answer: "Saturn",
      options: shuffle(["Saturn", "Jupiter", "Mars", "Venus"]),
    },
  ];
  return shuffle([...mul, ...geo, ...solar]).slice(0, 10);
}

export default function DailyDuel() {
  const navigate = useNavigate();
  const userId = useAuthStore((s) => s.user?.id);
  const grantXP = useAppStore((s) => s.grantXP);
  const questions = useMemo(() => buildDuelQuestions(), []);
  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const [alreadyPlayed, setAlreadyPlayed] = useState(false);

  useEffect(() => {
    if (!userId) return;
    fetchTodayDuel(userId).then((row) => {
      if (row) {
        setAlreadyPlayed(true);
        setScore(row.score ?? 0);
        setDone(true);
      }
    });
  }, [userId]);

  const q = questions[idx];

  async function answer(choice) {
    const correct = choice === q.answer;
    const nextScore = correct ? score + 1 : score;
    if (correct) grantXP(6);
    if (idx + 1 >= questions.length) {
      setScore(nextScore);
      setDone(true);
      if (userId) {
        await submitDailyDuel({
          userId,
          score: nextScore,
          total: questions.length,
          answers: [],
        });
      }
      return;
    }
    setScore(nextScore);
    setIdx((i) => i + 1);
  }

  if (done) {
    return (
      <SessionComplete
        emoji="⚔️"
        title={alreadyPlayed ? "You already played today!" : "Daily Duel complete!"}
        subtitle={`${score}/${questions.length} — same questions for all players today`}
        primaryLabel="Compete hub"
        onPrimary={() => navigate("/compete")}
      />
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <Link to="/compete" className="text-sm font-bold text-primary">
        ← Compete
      </Link>
      <h1 className="font-display text-2xl font-extrabold text-center">Daily Duel</h1>
      <p className="text-xs font-bold text-ink/60 text-center">10 mixed questions · one try per day</p>
      <p className="text-xs font-bold text-center">
        {idx + 1}/{questions.length} · {score} right
      </p>
      <h2 className="font-display text-lg font-extrabold text-center">{q?.prompt}</h2>
      <div className="grid gap-2">
        {q?.options.map((opt) => (
          <AnswerOption key={opt} label={opt} onClick={() => answer(opt)} />
        ))}
      </div>
    </div>
  );
}
