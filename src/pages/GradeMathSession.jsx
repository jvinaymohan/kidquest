import { useCallback, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Check, X } from "lucide-react";
import { AnswerKeypad } from "../components/multiplication/AnswerKeypad";
import { AnswerOption } from "../components/quiz/AnswerOption";
import { SessionComplete } from "../components/multiplication/SessionComplete";
import { DowngradePrompt } from "../components/placement/PlacementPrompt";
import { PlayCosmicShell } from "../components/layout/PlayCosmicShell";
import { useAppStore } from "../store/useAppStore";
import { useGradeMathStore } from "../store/useGradeMathStore";
import {
  GRADE_PASS_THRESHOLD,
  analyzeWeakTopics,
  generateGradeQuestions,
  gradeQuestionAnswerMatches,
  modeConfig,
  parseGradeParam,
} from "../utils/gradeMath";
import { gradeDowngradeTarget } from "../utils/gradeMath/unlock";

export default function GradeMathSession() {
  const { grade: gradeParam, mode: modeParam } = useParams();
  const grade = parseGradeParam(gradeParam);
  const mode = modeConfig(modeParam);
  const navigate = useNavigate();

  const isUnlocked = useGradeMathStore((s) => s.isGradeUnlocked(grade));
  const recordSession = useGradeMathStore((s) => s.recordSession);
  const stepDownGrade = useGradeMathStore((s) => s.stepDownGrade);
  const grantXP = useAppStore((s) => s.grantXP);
  const kidName = useAppStore((s) => s.kidName);

  const questions = useMemo(() => {
    if (!grade) return [];
    return generateGradeQuestions(grade, mode.questionCount, `${grade}-${mode.id}-session`);
  }, [grade, mode.id, mode.questionCount]);

  const [idx, setIdx] = useState(0);
  const [input, setInput] = useState("");
  const [selected, setSelected] = useState(null);
  const [revealed, setRevealed] = useState(false);
  const [correct, setCorrect] = useState(0);
  const [results, setResults] = useState([]);
  const [done, setDone] = useState(false);
  const [sessionResult, setSessionResult] = useState(null);
  const [showDowngrade, setShowDowngrade] = useState(false);
  const [lastWasCorrect, setLastWasCorrect] = useState(null);

  const question = questions[idx];
  const progress = questions.length ? (idx / questions.length) * 100 : 0;

  const finishSession = useCallback(
    (finalResults) => {
      const right = finalResults.filter((r) => r.correct).length;
      const total = finalResults.length;
      const weakTopics = analyzeWeakTopics(finalResults);
      const outcome = recordSession(grade, mode.id, { correct: right, total, weakTopics });
      grantXP(right * 5 + (outcome.passed ? 50 : 0));
      setSessionResult({ ...outcome, correct: right, total, weakTopics });
      setDone(true);
      if (mode.id === "test" && !outcome.passed && grade > 1) {
        setShowDowngrade(true);
      }
    },
    [grade, mode.id, recordSession, grantXP]
  );

  function advance(wasCorrect) {
    const entry = {
      topic: question.topic,
      correct: wasCorrect,
    };
    const nextResults = [...results, entry];
    setResults(nextResults);

    if (idx + 1 >= questions.length) {
      finishSession(nextResults);
      return;
    }

    setIdx((i) => i + 1);
    setInput("");
    setSelected(null);
    setRevealed(false);
    setLastWasCorrect(null);
  }

  function submitNumeric() {
    if (!question || revealed || !input.trim()) return;
    const ok = gradeQuestionAnswerMatches(input, question);
    setLastWasCorrect(ok);
    setRevealed(true);
    setCorrect((c) => c + (ok ? 1 : 0));
    setTimeout(() => advance(ok), ok ? 700 : 1800);
  }

  function submitChoice(opt) {
    if (!question || revealed) return;
    setSelected(opt);
    const ok = gradeQuestionAnswerMatches(opt, question);
    setLastWasCorrect(ok);
    setRevealed(true);
    setCorrect((c) => c + (ok ? 1 : 0));
    setTimeout(() => advance(ok), ok ? 700 : 1800);
  }

  if (!grade || !modeConfig(modeParam)) {
    return (
      <div className="p-6 text-center text-white">
        <p>Unknown session.</p>
        <Link to="/math/grades" className="text-primary underline">
          Back
        </Link>
      </div>
    );
  }

  if (!isUnlocked) {
    return (
      <div className="flex flex-col gap-4 p-6 text-center text-white">
        <p className="font-display text-xl font-extrabold">Grade locked 🔒</p>
        <Link to="/math/grades" className="text-primary font-bold underline">
          Back to Grade Path
        </Link>
      </div>
    );
  }

  if (done && sessionResult) {
    const pct = sessionResult.pct;
    const passed = sessionResult.passed;
    const weak = sessionResult.weakTopics;

    let title;
    let subtitle;
    let emoji = passed ? "🎉" : "💪";
    if (mode.id === "practice") {
      title = "Practice complete!";
      subtitle = `You got ${sessionResult.correct}/${sessionResult.total} — keep practicing!`;
    } else if (mode.id === "check") {
      title = `Check yourself: ${pct}%`;
      subtitle =
        weak.length > 0
          ? `Try more practice on: ${weak.map((w) => w.topic).join(", ")}`
          : "Great job — no weak spots!";
    } else {
      title = passed ? `Grade ${grade} passed! 🏆` : `Not quite — ${pct}%`;
      subtitle = passed
        ? sessionResult.unlockedNext
          ? `Grade ${sessionResult.unlockedNext} is unlocked!`
          : "You completed the highest grade!"
        : `Need ${Math.round(GRADE_PASS_THRESHOLD * 100)}% to unlock the next grade. Practice and retry!`;
      emoji = passed ? "🏆" : "🌟";
    }

    return (
      <PlayCosmicShell>
        <SessionComplete
          emoji={emoji}
          title={title}
          subtitle={subtitle}
          stats={[
            { label: "Score", value: `${pct}%` },
            { label: "Correct", value: `${sessionResult.correct}/${sessionResult.total}` },
          ]}
          primaryLabel={
            mode.id === "test" && passed && sessionResult.unlockedNext
              ? `Go to Grade ${sessionResult.unlockedNext}`
              : "Back to grade"
          }
          onPrimary={() => {
            if (mode.id === "test" && passed && sessionResult.unlockedNext) {
              navigate(`/math/grades/${sessionResult.unlockedNext}`);
            } else {
              navigate(`/math/grades/${grade}`);
            }
          }}
          secondaryLabel={mode.id === "test" && !passed ? "Practice more" : "Grade Path"}
          onSecondary={() => {
            if (mode.id === "test" && !passed) {
              navigate(`/math/grades/${grade}/practice`);
            } else {
              navigate("/math/grades");
            }
          }}
          shareText={
            passed && mode.id === "test"
              ? `${kidName || "I"} passed Grade ${grade} on KidQuest! 🎓`
              : undefined
          }
        />
        <DowngradePrompt
          open={showDowngrade}
          copy={{
            title: "Want to try the previous grade?",
            body: `The Grade ${grade} test was tough. Grade ${gradeDowngradeTarget(grade)} can help you build confidence.`,
            actionLabel: `Go to Grade ${gradeDowngradeTarget(grade)}`,
          }}
          onAccept={() => {
            const target = stepDownGrade(grade);
            setShowDowngrade(false);
            navigate(`/math/grades/${target}`);
          }}
          onDismiss={() => setShowDowngrade(false)}
        />
      </PlayCosmicShell>
    );
  }

  return (
    <PlayCosmicShell className="px-4 pb-6">
      <div className="flex items-center justify-between text-white/70 text-sm font-bold">
        <button type="button" onClick={() => navigate(`/math/grades/${grade}`)} className="focus-ring">
          ← Exit
        </button>
        <span>
          {mode.emoji} {mode.label}
        </span>
        <span>
          {idx + 1}/{questions.length}
        </span>
      </div>

      <div className="h-2 rounded-full bg-white/10 overflow-hidden">
        <div
          className="h-full bg-primary transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      {question && (
        <>
          <motion.div
            key={question.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="hub-glass-panel p-6 text-center mt-2"
          >
            <p className="text-xs font-extrabold uppercase tracking-wider text-white/45 mb-2">
              {question.topic}
            </p>
            <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-white">
              {question.prompt}
            </h2>
          </motion.div>

          {question.type === "choice" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {question.options.map((opt, i) => (
                <AnswerOption
                  key={opt + i}
                  index={i}
                  label={opt}
                  onSelect={() => submitChoice(opt)}
                  disabled={revealed}
                  state={
                    !revealed
                      ? "idle"
                      : String(opt) === String(question.answer)
                      ? "correct"
                      : selected === opt
                      ? "wrong"
                      : "dim"
                  }
                />
              ))}
            </div>
          ) : (
            <>
              <div className="text-center font-display text-3xl font-extrabold text-white min-h-[48px]">
                {input || "?"}
              </div>
              <AnswerKeypad
                value={input}
                onChange={setInput}
                onSubmit={submitNumeric}
                disabled={revealed}
                dark
              />
            </>
          )}
        </>
      )}

      <AnimatePresence>
        {revealed && (
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 pointer-events-none grid place-items-center z-40"
          >
            <motion.div
              initial={{ scale: 0.4 }}
              animate={{ scale: [0.4, 1.1, 1] }}
              className={`w-28 h-28 rounded-full grid place-items-center border-[4px] ${
                lastWasCorrect ? "bg-success border-success/60" : "bg-error border-error/60"
              }`}
            >
              {lastWasCorrect ? (
                <Check size={56} className="text-white" strokeWidth={3} />
              ) : (
                <X size={56} className="text-white" strokeWidth={3} />
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </PlayCosmicShell>
  );
}
