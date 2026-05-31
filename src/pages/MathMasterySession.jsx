import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { useMathMasteryStore } from "../store/useMathMasteryStore";
import { useAppStore } from "../store/useAppStore";
import { StreakBar } from "../components/mathMastery/StreakBar";
import { NumberKeypad } from "../components/mathMastery/NumberKeypad";
import { ResultFeedback } from "../components/mathMastery/ResultFeedback";
import { MasteryModal } from "../components/mathMastery/MasteryModal";
import { NumberLineHint } from "../components/mathMastery/NumberLineHint";
import { TIMED_SECONDS, getOperation } from "../utils/mathMastery/constants";
import { checkAnswer, generateQuestion } from "../utils/mathMastery/questionGenerator";

export default function MathMasterySession() {
  const { operationId, level: levelStr } = useParams();
  const level = Number(levelStr);
  const navigate = useNavigate();
  const operation = getOperation(operationId);
  const isUnlocked = useMathMasteryStore((s) => s.isLevelUnlocked(operationId, level));
  const timedMode = useMathMasteryStore((s) => s.timedMode);
  const showHints = useMathMasteryStore((s) => s.showHints);
  const recordAttempt = useMathMasteryStore((s) => s.recordAttempt);
  const grantXP = useAppStore((s) => s.grantXP);

  const [streak, setStreak] = useState(0);
  const [input, setInput] = useState("");
  const [feedback, setFeedback] = useState(null);
  const [locked, setLocked] = useState(false);
  const [modal, setModal] = useState(null);
  const [timeLeft, setTimeLeft] = useState(TIMED_SECONDS);
  const [questionKey, setQuestionKey] = useState(0);

  const question = useMemo(() => {
    if (!operationId || !level) return null;
    return generateQuestion(operationId, level);
  }, [operationId, level, questionKey]);

  const submitRef = useRef(null);

  const nextQuestion = useCallback(() => {
    setFeedback(null);
    setInput("");
    setLocked(false);
    setQuestionKey((k) => k + 1);
  }, []);

  const handleSubmit = useCallback(
    (timedOut = false) => {
      if (!question || locked) return;

      setLocked(true);
      const userAnswer = timedOut ? "" : input.trim();
      const correct = !timedOut && checkAnswer(userAnswer, question.answer);
      const newStreak = correct ? streak + 1 : 0;

      setFeedback({ correct, answer: question.answer });
      setStreak(newStreak);

      const result = recordAttempt(operationId, level, { correct, streak: newStreak });
      if (correct) grantXP(5);

      setTimeout(() => {
        if (result.mastered) {
          grantXP(50);
          setModal({
            title: `Level ${level} Mastered! ⭐`,
            subtitle: result.operationComplete
              ? `You mastered all ${operation?.name ?? "operation"} levels! 🎆`
              : `Level ${level + 1} is now unlocked. Keep going!`,
          });
        } else {
          nextQuestion();
        }
      }, correct ? 900 : 2500);
    },
    [question, locked, input, streak, operationId, level, recordAttempt, grantXP, nextQuestion, operation]
  );

  submitRef.current = handleSubmit;

  useEffect(() => {
    if (!timedMode || locked || feedback) return;
    setTimeLeft(TIMED_SECONDS);
    const id = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(id);
          submitRef.current?.(true);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [timedMode, locked, feedback, questionKey]);

  if (!operation) {
    return <p className="p-4">Unknown operation.</p>;
  }

  if (!isUnlocked) {
    return (
      <div className="flex flex-col gap-4 p-4 text-center">
        <p className="font-display text-xl font-extrabold">Level locked 🔒</p>
        <button
          type="button"
          onClick={() => navigate(`/math-master/${operationId}`)}
          className="font-bold text-primary"
        >
          Back to levels
        </button>
      </div>
    );
  }

  return (
    <div className="flex min-h-[70vh] flex-col gap-4 pb-8">
      <button
        type="button"
        onClick={() => navigate(`/math-master/${operationId}`)}
        className="self-start flex items-center gap-1 rounded-pill px-2 py-1 font-display font-extrabold text-ink/70 focus-ring"
      >
        <ChevronLeft size={20} /> {operation.name}
      </button>

      <StreakBar streak={streak} />

      {timedMode && !feedback && (
        <p className="text-center font-display text-sm font-extrabold text-primary">⏱ {timeLeft}s</p>
      )}

      {showHints && level === 1 && operationId !== "fractions" && question?.hintMax && (
        <NumberLineHint max={question.hintMax} />
      )}

      <div className="chunky-card p-6 text-center">
        <p className="text-xs font-bold uppercase tracking-wide text-ink/45">
          Level {level} · {operation.emoji} {operation.name}
        </p>
        <p className="mt-3 font-display text-[2rem] font-extrabold leading-tight text-ink sm:text-[2.5rem]">
          {question?.questionText}
        </p>
      </div>

      <ResultFeedback
        correct={feedback?.correct}
        correctAnswer={feedback?.answer}
        visible={Boolean(feedback)}
      />

      {!feedback && (
        <NumberKeypad
          value={input}
          onChange={setInput}
          onSubmit={() => handleSubmit(false)}
          disabled={locked}
          allowFractions={operationId === "fractions"}
        />
      )}

      <p className="text-center text-xs font-bold text-ink/40">
        One wrong answer resets your streak · Need 25 in a row
      </p>

      <MasteryModal
        open={Boolean(modal)}
        title={modal?.title ?? ""}
        subtitle={modal?.subtitle ?? ""}
        onContinue={() => {
          setModal(null);
          navigate(`/math-master/${operationId}`);
        }}
      />
    </div>
  );
}
