import { useMemo, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { AnswerOption } from "../components/quiz/AnswerOption";
import { getFactsForTable, MOTIVATIONAL } from "../data/multiplication/tables";
import { pickWrongOptions, shuffle } from "../utils/multiplicationScoring";
import { useMultiplicationStore } from "../store/useMultiplicationStore";
import { useAppStore } from "../store/useAppStore";
import { useSound } from "../hooks/useSound";
import { buildSessionShareText } from "../utils/shareAchievement";
import { SessionComplete } from "../components/multiplication/SessionComplete";

const initialSession = () => ({ correct: 0, total: 0, wrong: 0 });

export default function MultiplicationPractice() {
  const { tableNumber: tn } = useParams();
  const tableNumber = Number(tn);
  const facts = useMemo(() => getFactsForTable(tableNumber), [tableNumber]);
  const factProgress = useMultiplicationStore((s) => s.facts);
  const recordPractice = useMultiplicationStore((s) => s.recordPractice);
  const touchPracticeDay = useMultiplicationStore((s) => s.touchPracticeDay);
  const grantXP = useAppStore((s) => s.grantXP);
  const kidName = useAppStore((s) => s.kidName);
  const navigate = useNavigate();
  const sound = useSound();

  const queue = useMemo(
    () => shuffle(facts.filter((f) => (factProgress[f.id]?.practiceHits ?? 0) < 2)),
    [facts, factProgress]
  );

  const [idx, setIdx] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [session, setSession] = useState(initialSession);
  const fact = queue[idx] ?? facts[0];
  const mastered = facts.every((f) => (factProgress[f.id]?.practiceHits ?? 0) >= 2);

  const options = useMemo(() => {
    if (!fact) return [];
    return shuffle([fact.product, ...pickWrongOptions(fact.product)]);
  }, [fact?.id]);

  const doneCount = facts.filter((f) => (factProgress[f.id]?.practiceHits ?? 0) >= 2).length;
  const tableMasteryPct = facts.length ? Math.round((doneCount / facts.length) * 100) : 100;
  const learnPath = `/multiplication/table/${tableNumber}/learn`;

  function needsLearnNudge() {
    return session.wrong > 0 || tableMasteryPct < 100;
  }

  function goBack() {
    if (
      needsLearnNudge() &&
      !window.confirm(
        "You missed some facts this session. The Learn phase can help — try it before you go. Leave anyway?"
      )
    ) {
      return;
    }
    navigate(`/multiplication/table/${tableNumber}`);
  }

  if (!tableNumber || tableNumber < 1 || tableNumber > 20 || facts.length === 0) {
    return <p className="p-4">Invalid table.</p>;
  }

  function answer(choice) {
    const correct = choice === fact.product;
    setSession((s) => ({
      correct: s.correct + (correct ? 1 : 0),
      total: s.total + 1,
      wrong: s.wrong + (correct ? 0 : 1),
    }));
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
    const sessionHadWrong = session.wrong > 0;
    const sessionPct =
      session.total > 0 ? Math.round((session.correct / session.total) * 100) : 100;

    return (
      <SessionComplete
        emoji="🎉"
        title={`Table ${tableNumber} practiced!`}
        subtitle="Phase 2 complete — unlock Speed Drill when you're ready."
        stats={[
          { label: "Facts", value: facts.length },
          { label: "Session", value: `${sessionPct}%` },
        ]}
        primaryLabel="Back to table"
        onPrimary={() => navigate(`/multiplication/table/${tableNumber}`)}
        secondaryLabel={sessionHadWrong ? "Review with Learn phase" : undefined}
        onSecondary={sessionHadWrong ? () => navigate(learnPath) : undefined}
        shareText={buildSessionShareText({
          kidName,
          title: `mastered the ×${tableNumber} table`,
          detail: `${sessionPct}% accuracy this session`,
        })}
      />
    );
  }

  if (!fact) return null;

  return (
    <div className="flex flex-col gap-4 bg-cream min-h-[70vh] p-2">
      <button
        type="button"
        onClick={goBack}
        className="text-sm font-bold text-math text-left"
      >
        ← Table {tableNumber}×
      </button>
      <div className="text-xs font-bold text-center text-ink/60">
        Mastery {doneCount}/{facts.length}
        {session.total > 0 && (
          <span className="ml-2">
            · Session {Math.round((session.correct / session.total) * 100)}%
          </span>
        )}
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
        <div className="text-center space-y-2">
          <p className="text-sm font-bold text-error animate-shake">
            {MOTIVATIONAL.wrong(feedback.answer)}
          </p>
          <Link to={learnPath} className="text-sm font-bold text-math underline">
            Need help? Try Learn phase
          </Link>
        </div>
      )}
      {feedback?.correct && (
        <p className="text-center text-sm font-bold text-success">{MOTIVATIONAL.firstCorrect}</p>
      )}
    </div>
  );
}
