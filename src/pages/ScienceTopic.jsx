import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getScienceTopic } from "../data/science/topics";
import { useAppStore } from "../store/useAppStore";
import { useScienceStore } from "../store/useScienceStore";
import { QuestionCard } from "../components/quiz/QuestionCard";
import { QuizProgress } from "../components/quiz/QuizProgress";
import { SessionComplete } from "../components/multiplication/SessionComplete";
import { ConfettiBlast } from "../components/rewards/ConfettiBlast";
import { useQuiz } from "../hooks/useQuiz";
import { calculateStars } from "../utils/scoring";
import { buildSessionShareText } from "../utils/shareAchievement";

export default function ScienceTopic() {
  const { topicId } = useParams();
  const navigate = useNavigate();
  const topic = getScienceTopic(topicId);
  const ageGroup = useAppStore((s) => s.ageGroup);
  const kidName = useAppStore((s) => s.kidName);
  const recordTopic = useScienceStore((s) => s.recordTopic);

  const [phase, setPhase] = useState("lesson");
  const [finished, setFinished] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const submittedRef = useRef(false);

  const questions = useMemo(() => topic?.questions ?? [], [topic]);
  const quiz = useQuiz(questions);

  useEffect(() => {
    if (quiz.done && !submittedRef.current && phase === "quiz") {
      submittedRef.current = true;
      const stars = calculateStars(quiz.correctCount, quiz.total);
      recordTopic(topicId, { correct: quiz.correctCount, total: quiz.total, stars });
      if (stars >= 3) {
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 2500);
      }
      setFinished(true);
    }
  }, [quiz.done, quiz.correctCount, quiz.total, phase, topicId, recordTopic]);

  if (!topic) {
    return (
      <div className="text-center p-6">
        <p className="font-display font-extrabold">Topic not found</p>
        <Link to="/science" className="text-[#9B5DE5] font-bold mt-2 inline-block">
          Science hub
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
          emoji="🧪"
          title="Science explorer!"
          subtitle={`${quiz.correctCount}/${quiz.total} on ${topic.title}`}
          shareText={buildSessionShareText({
            kidName,
            title: `learned about ${topic.title}`,
            detail: `${pct}% on KidQuest Science`,
          })}
          primaryLabel="More science"
          onPrimary={() => navigate("/science")}
          secondaryLabel="Home"
          onSecondary={() => navigate("/home")}
        />
      </>
    );
  }

  return (
    <div className="flex flex-col gap-4 pb-8">
      {phase === "lesson" ? (
        <div
          className="chunky-card p-5 text-center"
          style={{ background: `linear-gradient(135deg, ${topic.accent} 0%, white 100%)` }}
        >
          <span className="text-5xl">{topic.emoji}</span>
          <h1 className="mt-2 font-display text-2xl font-extrabold">{topic.title}</h1>
          <p className="mt-3 text-sm font-bold text-ink/75 leading-relaxed">{topic.lesson.text}</p>
          <p className="mt-3 text-xs font-bold text-ink/55 italic">{topic.lesson.funFact}</p>
          <button
            type="button"
            onClick={() => setPhase("quiz")}
            className="mt-4 w-full py-3 rounded-2xl font-display font-extrabold text-white focus-ring"
            style={{ background: topic.color }}
          >
            Take the quiz →
          </button>
        </div>
      ) : (
        <>
          <QuizProgress index={quiz.index} total={quiz.total} />
          {quiz.current && (
            <QuestionCard
              key={quiz.index}
              question={quiz.current}
              ageGroup={ageGroup}
              onAnswered={(correct) => quiz.submit(correct)}
            />
          )}
        </>
      )}
    </div>
  );
}
