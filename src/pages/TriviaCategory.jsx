import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { getTriviaCategory } from "../data/trivia/categories";
import { useAppStore } from "../store/useAppStore";
import { useTriviaStore } from "../store/useTriviaStore";
import { QuestionCard } from "../components/quiz/QuestionCard";
import { QuizProgress } from "../components/quiz/QuizProgress";
import { SessionComplete } from "../components/multiplication/SessionComplete";
import { ConfettiBlast } from "../components/rewards/ConfettiBlast";
import { useQuiz } from "../hooks/useQuiz";
import { buildSessionShareText } from "../utils/shareAchievement";

function starsFromScore(correct, total) {
  const pct = total > 0 ? correct / total : 0;
  if (pct >= 1) return 3;
  if (pct >= 0.7) return 2;
  if (pct >= 0.4) return 1;
  return 0;
}

export default function TriviaCategory() {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const category = getTriviaCategory(categoryId);
  const ageGroup = useAppStore((s) => s.ageGroup);
  const kidName = useAppStore((s) => s.kidName);
  const recordCategory = useTriviaStore((s) => s.recordCategory);

  const [finished, setFinished] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const submittedRef = useRef(false);

  const questions = useMemo(() => category?.questions ?? [], [category]);
  const quiz = useQuiz(questions);

  useEffect(() => {
    if (quiz.done && !submittedRef.current) {
      submittedRef.current = true;
      const stars = starsFromScore(quiz.correctCount, quiz.total);
      recordCategory(categoryId, {
        correct: quiz.correctCount,
        total: quiz.total,
        stars,
        ageGroup,
      });
      if (stars >= 3) {
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 2500);
      }
      setFinished(true);
    }
  }, [quiz.done, quiz.correctCount, quiz.total, categoryId, ageGroup, recordCategory]);

  if (!category) {
    return (
      <div className="text-center p-6">
        <p className="font-display font-extrabold">Category not found</p>
        <Link to="/trivia" className="text-trivia font-bold mt-2 inline-block">
          Trivia hub
        </Link>
      </div>
    );
  }

  if (finished) {
    const stars = starsFromScore(quiz.correctCount, quiz.total);
    return (
      <>
        {showConfetti && <ConfettiBlast count={80} duration={2} />}
        <SessionComplete
          emoji={category.emoji}
          title={stars >= 2 ? "Trivia star!" : "Nice try!"}
          subtitle={`${quiz.correctCount}/${quiz.total} on ${category.title}`}
          stats={[{ label: "Stars", value: "⭐".repeat(stars) || "—" }]}
          shareText={buildSessionShareText({
            kidName,
            title: `aced ${category.title} trivia`,
            detail: `${quiz.correctCount}/${quiz.total} on KidQuest`,
          })}
          primaryLabel="More trivia"
          onPrimary={() => navigate("/trivia")}
          secondaryLabel="Home"
          onSecondary={() => navigate("/home")}
        />
      </>
    );
  }

  return (
    <div className="flex flex-col gap-4 pb-8">
      <button
        type="button"
        onClick={() => navigate("/trivia")}
        className="self-start flex items-center gap-1 font-display font-extrabold text-ink/70 focus-ring rounded-pill px-2 py-1"
      >
        <ChevronLeft size={20} /> Trivia
      </button>

      <div className="text-center">
        <span className="text-4xl">{category.emoji}</span>
        <h1 className="font-display text-xl font-extrabold mt-1">{category.title}</h1>
        <p className="text-xs font-bold text-ink/50">{category.group} · {ageGroup}</p>
      </div>

      <QuizProgress index={quiz.index} total={quiz.total} />
      {quiz.current && (
        <QuestionCard
          key={quiz.index}
          question={quiz.current}
          ageGroup={ageGroup}
          onAnswered={(correct) => quiz.submit(correct)}
        />
      )}
    </div>
  );
}
