import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { AnswerKeypad } from "../components/multiplication/AnswerKeypad";
import { TimerDisplay } from "../components/multiplication/TimerDisplay";
import { SessionComplete } from "../components/multiplication/SessionComplete";
import { useMultiplicationStagesStore } from "../store/useMultiplicationStagesStore";
import { useAppStore } from "../store/useAppStore";
import { useSound } from "../hooks/useSound";
import { confirmExit, useExitGuard } from "../hooks/useExitGuard";
import {
  getStage,
  isProblemMastered,
  isStageMastered,
  stageProgressCounts,
  STAGE_ACCURACY_HITS,
  STAGE_FAST_HITS,
} from "../utils/multiplicationStages";
import { shuffle } from "../utils/multiplicationScoring";

export default function MultiplicationStagesSession() {
  const { stageId } = useParams();
  const stage = getStage(stageId);
  const navigate = useNavigate();
  const sound = useSound();
  const grantXP = useAppStore((s) => s.grantXP);
  const kidName = useAppStore((s) => s.kidName);

  const stageRow = useMultiplicationStagesStore((s) => s.stages[stageId]);
  const ensureBank = useMultiplicationStagesStore((s) => s.ensureBank);
  const recordAnswer = useMultiplicationStagesStore((s) => s.recordAnswer);

  const bank = useMemo(() => {
    if (!stage) return [];
    return stageRow?.bank?.length ? stageRow.bank : ensureBank(stageId);
  }, [stage, stageId, stageRow?.bank, ensureBank]);

  const problems = stageRow?.problems ?? {};
  const queue = useMemo(
    () => shuffle(bank.filter((p) => !isProblemMastered(problems[p.id], stage))),
    [bank, problems, stage]
  );

  const [idx, setIdx] = useState(0);
  const [value, setValue] = useState("");
  const [feedback, setFeedback] = useState(null);
  const [session, setSession] = useState({ correct: 0, total: 0 });
  const [elapsedMs, setElapsedMs] = useState(0);
  const startRef = useRef(null);
  const problem = queue.length > 0 ? queue[idx % queue.length] : null;

  const counts = stageProgressCounts(stageRow, bank, stage);
  const stageComplete = stage && isStageMastered(stageRow, bank, stage);

  useExitGuard(!stageComplete, "Leave stage practice? Your session progress is saved.");

  useEffect(() => {
    if (queue.length > 0 && idx >= queue.length) setIdx(0);
  }, [queue.length, idx]);

  useEffect(() => {
    if (!problem || feedback) return undefined;
    startRef.current = Date.now();
    const id = setInterval(() => {
      if (startRef.current) setElapsedMs(Date.now() - startRef.current);
    }, 100);
    return () => clearInterval(id);
  }, [problem?.id, feedback]);

  if (!stage) {
    return <p className="p-4 text-white">Unknown stage.</p>;
  }

  if (!(stageRow?.unlocked ?? stage.order === 1)) {
    return (
      <div className="flex flex-col gap-4 p-6 text-center text-white">
        <p className="font-display text-xl font-extrabold">Stage locked 🔒</p>
        <Link to="/math/stages" className="text-mul-gold font-bold underline">
          Back to stages
        </Link>
      </div>
    );
  }

  function goBack() {
    if (
      session.total > 0 &&
      !confirmExit("Leave stage practice? Your progress on each problem is saved.")
    ) {
      return;
    }
    navigate("/math/stages");
  }

  function submit() {
    if (!value.trim() || !problem || feedback) return;
    const ms = Date.now() - startRef.current;
    const correct = Number(value) === problem.product;
    setSession((s) => ({
      correct: s.correct + (correct ? 1 : 0),
      total: s.total + 1,
    }));
    const { stageMastered } = recordAnswer(stageId, problem.id, { correct, responseMs: ms });
    if (correct) {
      sound.correct();
      grantXP(ms <= stage.timeLimitMs ? 8 : 4);
    } else {
      sound.wrong();
    }
    setFeedback({ correct, answer: problem.product, fast: correct && ms <= stage.timeLimitMs });
    setValue("");
    setTimeout(() => {
      setFeedback(null);
      if (stageMastered) return;
      setIdx((i) => i + 1);
    }, correct ? 700 : 1400);
  }

  if (stageComplete) {
    const sessionPct =
      session.total > 0 ? Math.round((session.correct / session.total) * 100) : 100;
    return (
      <div className="min-h-screen bg-mul-dark p-4">
        <SessionComplete
          emoji="⭐"
          title={`${stage.title} mastered!`}
          subtitle="Accuracy and speed goals met for every problem in this stage."
          stats={[
            { label: "Problems", value: counts.total },
            { label: "Session", value: `${sessionPct}%` },
          ]}
          primaryLabel="Back to stages"
          onPrimary={() => navigate("/math/stages")}
          shareText={`${kidName || "I"} mastered ${stage.title} on KidQuest!`}
        />
      </div>
    );
  }

  if (!problem) {
    return (
      <div className="min-h-screen bg-mul-dark p-4 text-white text-center">
        <p className="font-display text-xl font-extrabold">Loading problems…</p>
      </div>
    );
  }

  const row = problems[problem.id] ?? { accuracyHits: 0, fastHits: 0 };
  const sessionPct =
    session.total > 0 ? Math.round((session.correct / session.total) * 100) : null;

  return (
    <div className="flex flex-col gap-4 min-h-screen bg-mul-dark text-white p-3 pb-8">
      <button type="button" onClick={goBack} className="text-sm font-bold text-mul-gold text-left">
        ← {stage.title}
      </button>
      <div className="text-xs font-bold text-center text-white/60">
        Accuracy {counts.accuracyDone}/{counts.total} ({STAGE_ACCURACY_HITS} hits each) · Speed{" "}
        {counts.speedDone}/{counts.total} (≤{stage.timeLimitMs / 1000}s)
        {sessionPct != null && <span className="ml-2">· Session {sessionPct}%</span>}
      </div>
      <div className="flex justify-center gap-4 text-[10px] font-bold text-white/50">
        <span>
          This problem: {row.accuracyHits}/{STAGE_ACCURACY_HITS} acc · {row.fastHits}/
          {STAGE_FAST_HITS} fast
        </span>
        <TimerDisplay ms={elapsedMs} dark label={`Goal ≤ ${stage.timeLimitMs / 1000}s`} />
      </div>
      <h2 className="font-display text-4xl font-extrabold text-center my-2 text-mul-gold">
        {problem.multiplicand} × {problem.multiplier} = ?
      </h2>
      <p className="text-center text-2xl font-mono font-bold min-h-[2rem]">{value || "—"}</p>
      <AnswerKeypad
        dark
        value={value}
        onChange={setValue}
        onSubmit={submit}
        disabled={!!feedback}
      />
      {feedback && (
        <p
          className={`text-center text-sm font-bold ${feedback.correct ? "text-success" : "text-error"}`}
        >
          {feedback.correct
            ? feedback.fast
              ? "Fast enough for speed credit! ⚡"
              : `Correct! Answer under ${stage.timeLimitMs / 1000}s for speed credit.`
            : `Answer: ${feedback.answer}`}
        </p>
      )}
    </div>
  );
}
