import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { useAppStore } from "../store/useAppStore";
import { useGeographyStore } from "../store/useGeographyStore";
import { buildMasteryQuestions } from "../data/geography";
import { GEO_TIERS } from "../data/geography/mastery";
import { QuestionCard } from "../components/quiz/QuestionCard";
import { QuizProgress } from "../components/quiz/QuizProgress";
import { SessionComplete } from "../components/multiplication/SessionComplete";
import { ConfettiBlast } from "../components/rewards/ConfettiBlast";
import { useQuiz } from "../hooks/useQuiz";
import { buildSessionShareText } from "../utils/shareAchievement";

export default function GeographyMasterySession() {
  const { tierId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const ageGroup = useAppStore((s) => s.ageGroup);
  const kidName = useAppStore((s) => s.kidName);
  const recordSR = useGeographyStore((s) => s.recordSRReview);
  const recordMasterySession = useGeographyStore((s) => s.recordMasterySession);

  const continent = searchParams.get("continent");
  const trackId = searchParams.get("track") ?? "flags";
  const tier = GEO_TIERS.find((t) => t.id === tierId);

  const questions = useMemo(() => {
    if (!tier) return [];
    return buildMasteryQuestions({
      tierId,
      trackId,
      continent,
      ageGroup,
      seed: `${tierId}-${trackId}-${continent ?? "all"}-${Date.now()}`,
    });
  }, [tierId, trackId, continent, ageGroup, tier]);

  const [finished, setFinished] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const submittedRef = useRef(false);
  const questionStartedAt = useRef(Date.now());

  const quiz = useQuiz(questions);

  useEffect(() => {
    if (quiz.done && !submittedRef.current) {
      submittedRef.current = true;
      recordMasterySession(tierId, { continent, trackId, correct: quiz.correctCount, total: quiz.total });
      if (quiz.correctCount / quiz.total >= 0.8) {
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 2500);
      }
      setFinished(true);
    }
  }, [quiz.done, quiz.correctCount, quiz.total, tierId, continent, trackId, recordMasterySession]);

  if (!tier) {
    return (
      <div className="text-center p-6">
        <p className="font-display font-extrabold">Session not found</p>
        <Link to="/geography/mastery" className="text-geography font-bold mt-2 inline-block">
          Back
        </Link>
      </div>
    );
  }

  if (finished) {
    const pct = Math.round((quiz.correctCount / quiz.total) * 100);
    return (
      <>
        {showConfetti && <ConfettiBlast count={80} duration={2} />}
        <SessionComplete
          emoji={pct >= 80 ? "🌍" : "🗺️"}
          title={pct >= 80 ? "Continental explorer!" : "Good effort!"}
          subtitle={`${quiz.correctCount}/${quiz.total} correct · ${tier.title}${continent ? ` · ${continent}` : ""}`}
          stats={[
            { label: "Score", value: `${pct}%` },
            { label: "Track", value: trackId },
          ]}
          shareText={buildSessionShareText({
            kidName,
            title: `scored ${pct}% on ${tier.title} geography`,
            detail: `${trackId} track on KidQuest`,
          })}
          primaryLabel="Back to mastery"
          onPrimary={() => navigate(`/geography/mastery/${tierId}`)}
          secondaryLabel="Geography hub"
          onSecondary={() => navigate("/subject/geography")}
        />
      </>
    );
  }

  function handleAnswered(correct) {
    const q = quiz.current;
    if (q?.countryCode) {
      const ms = Date.now() - questionStartedAt.current;
      recordSR(q.countryCode, correct, ms);
    }
    quiz.submit(correct);
    questionStartedAt.current = Date.now();
  }

  return (
    <div className="flex flex-col gap-4 pb-8">
      <button
        type="button"
        onClick={() => navigate(`/geography/mastery/${tierId}`)}
        className="self-start flex items-center gap-1 font-display font-extrabold text-ink/70 focus-ring rounded-pill px-2 py-1"
      >
        <ChevronLeft size={20} /> Exit
      </button>

      <p className="text-xs font-bold text-ink/55 text-center">
        {tier.title}
        {continent && ` · ${continent}`} · {trackId}
      </p>

      <QuizProgress
        index={quiz.index}
        total={quiz.total}
        masteredCount={quiz.masteredCount}
        masteryTotal={quiz.scopeCount}
      />

      {quiz.current && (
        <QuestionCard
          key={quiz.index}
          question={quiz.current}
          ageGroup={ageGroup}
          onAnswered={handleAnswered}
        />
      )}
    </div>
  );
}
