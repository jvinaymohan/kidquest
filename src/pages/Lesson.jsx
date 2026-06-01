import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ChevronLeft, Home } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAppStore } from "../store/useAppStore";
import { getLessonById, getSubject } from "../data/subjects";
import { ConceptCard } from "../components/lesson/ConceptCard";
import { QuestionCard } from "../components/quiz/QuestionCard";
import { QuizProgress } from "../components/quiz/QuizProgress";
import { Button } from "../components/ui/Button";
import { useQuiz } from "../hooks/useQuiz";
import { useGeographyStore } from "../store/useGeographyStore";

export default function Lesson() {
  const { lessonId } = useParams();
  const navigate = useNavigate();
  const found = getLessonById(lessonId);
  const submit = useAppStore((s) => s.submitLessonResult);

  const [phase, setPhase] = useState("concept");
  const [confirmBack, setConfirmBack] = useState(false);
  const [exitTarget, setExitTarget] = useState("subject");
  const startedAt = useRef(Date.now());

  if (!found) {
    return (
      <div className="text-center mt-10">
        <p className="font-display font-extrabold text-xl">Lesson not found</p>
        <Button onClick={() => navigate("/home")} className="mt-4">Go home</Button>
      </div>
    );
  }

  const { lesson, subjectId } = found;
  const subject = getSubject(subjectId);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-2">
        <button
          onClick={() => { setExitTarget("subject"); setConfirmBack(true); }}
          className="flex items-center gap-1 font-display font-extrabold text-ink/70 focus-ring rounded-pill px-2 py-1"
        >
          <ChevronLeft size={20} /> Back
        </button>
        <div className="font-display font-extrabold text-sm flex-1 text-center" style={{ color: subject.color }}>
          {subject.name}
        </div>
        <button
          onClick={() => { setExitTarget("home"); setConfirmBack(true); }}
          className="flex items-center gap-1 font-display font-extrabold text-ink/70 focus-ring rounded-pill px-2 py-1"
          aria-label="Go to Home"
        >
          <Home size={20} strokeWidth={2.5} /> Home
        </button>
      </div>

      <AnimatePresence mode="wait">
        {phase === "concept" && (
          <motion.div key="concept" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <ConceptCard lesson={lesson} subject={subject} onContinue={() => setPhase("quiz")} />
          </motion.div>
        )}

        {phase === "quiz" && (
          <QuizPhase
            lesson={lesson}
            subject={subject}
            subjectId={subjectId}
            onComplete={(correct, total) => {
              const elapsed = Math.round((Date.now() - startedAt.current) / 1000);
              submit({ lessonId: lesson.id, subjectId, correct, total, secondsElapsed: elapsed });
              navigate(`/results/${lesson.id}`, { replace: true });
            }}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {confirmBack && (
          <motion.div
            className="fixed inset-0 z-50 bg-ink/40 grid place-items-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setConfirmBack(false)}
          >
            <motion.div
              initial={{ scale: 0.85, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.85, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-chunky border-[3px] border-ink/15 shadow-chunkyLg p-5 max-w-sm w-full text-center"
            >
              <div className="text-5xl">🤔</div>
              <h3 className="font-display text-2xl font-extrabold mt-2">Leave this lesson?</h3>
              <p className="font-body text-ink/70 font-bold mt-1">You won't earn stars or XP yet.</p>
              <div className="flex gap-3 mt-4">
                <Button variant="ghost" fullWidth onClick={() => setConfirmBack(false)}>Stay</Button>
                <Button
                  variant="error"
                  fullWidth
                  onClick={() => navigate(exitTarget === "home" ? "/home" : `/subject/${subjectId}`)}
                >
                  {exitTarget === "home" ? "Go Home" : "Leave"}
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function countryCodeFromQuestion(q) {
  if (q?.countryCode) return q.countryCode;
  if (!q?.answer || typeof q.answer !== "string") return null;
  if (q.type === "map-locate" || q.type === "flag-choice" || q.type === "flag-grid") {
    return q.answer.length === 2 ? q.answer : null;
  }
  return null;
}

function QuizPhase({ lesson, subject, subjectId, onComplete }) {
  const ageGroup = useAppStore((s) => s.ageGroup);
  const recordGeoSR = useGeographyStore((s) => s.recordSRReview);
  const quiz = useQuiz(lesson.questions);
  const submittedRef = useRef(false);
  const questionStartedAt = useRef(Date.now());

  useEffect(() => {
    if (quiz.done && !submittedRef.current) {
      submittedRef.current = true;
      onComplete(quiz.correctCount, quiz.total);
    }
  }, [quiz.done, quiz.correctCount, quiz.total, onComplete]);

  function handleAnswered(correct) {
    if (subjectId === "geography" && quiz.current) {
      const code = countryCodeFromQuestion(quiz.current);
      if (code) {
        const ms = Date.now() - questionStartedAt.current;
        recordGeoSR(code, correct, ms);
      }
    }
    quiz.submit(correct);
    questionStartedAt.current = Date.now();
  }

  return (
    <div className="flex flex-col gap-4">
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
