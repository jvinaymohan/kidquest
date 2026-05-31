import { Link } from "react-router-dom";
import { Brain, BookOpen, Globe, Orbit } from "lucide-react";
import { countDueReviews } from "../utils/multiplicationProgress";
import { useMultiplicationStore } from "../store/useMultiplicationStore";
import { useGeographyStore } from "../store/useGeographyStore";
import { useAppStore } from "../store/useAppStore";
import { SUBJECTS } from "../data/subjects";
import { isLiveSubject } from "../config/liveSubjects";
import { subjectProgress } from "../utils/content";

export default function ReviewHub() {
  const mulDue = useMultiplicationStore((s) => countDueReviews(s));
  const geoDue = useGeographyStore((s) => s.getDueReviews().length);
  const ageGroup = useAppStore((s) => s.ageGroup);
  const lessonProgress = useAppStore((s) => s.lessonProgress);

  const weakSubjects = SUBJECTS.filter((s) => isLiveSubject(s.id))
    .map((s) => {
    const stats = subjectProgress(s.id, ageGroup, lessonProgress);
    return { ...s, masteryPct: stats.masteryPct, attempted: stats.attempted };
  })
    .filter((s) => s.attempted > 0 && s.masteryPct < 0.75)
    .sort((a, b) => a.masteryPct - b.masteryPct)
    .slice(0, 4);

  return (
    <div className="flex flex-col gap-4">
      <header className="chunky-card p-4 bg-gradient-to-br from-[#EEEDFE] to-white border-[3px] border-[#7F77DD]/30">
        <div className="flex items-center gap-3">
          <Brain className="text-[#7F77DD]" />
          <div>
            <h1 className="font-display text-2xl font-extrabold">Review</h1>
            <p className="text-sm font-bold text-ink/70">Spaced repetition across subjects.</p>
          </div>
        </div>
      </header>

      <Link
        to="/multiplication/review"
        className="chunky-card p-4 flex items-center gap-3 focus-ring border-[3px] border-math/25"
      >
        <span className="text-3xl" aria-hidden>
          🔢
        </span>
        <div className="flex-1">
          <p className="font-display font-extrabold">Multiplication SRS</p>
          <p className="text-xs font-bold text-ink/60">
            {mulDue > 0 ? `${mulDue} facts due today` : "All caught up — nice work!"}
          </p>
        </div>
        <span className="text-sm font-display font-extrabold text-math">Start</span>
      </Link>

      <Link
        to="/review/geography"
        className="chunky-card p-4 flex items-center gap-3 focus-ring border-[3px] border-geography/25"
      >
        <span className="text-3xl" aria-hidden>
          🌍
        </span>
        <div className="flex-1">
          <p className="font-display font-extrabold">Geography SRS</p>
          <p className="text-xs font-bold text-ink/60">
            {geoDue > 0 ? `${geoDue} countries due today` : "Play flag or map quizzes to build your deck"}
          </p>
        </div>
        <span className="text-sm font-display font-extrabold text-geography">Start</span>
      </Link>

      {weakSubjects.length > 0 && (
        <section className="chunky-card p-4">
          <div className="flex items-center gap-2 mb-3">
            <BookOpen size={18} className="text-primary" />
            <h2 className="font-display font-extrabold">Brush up</h2>
          </div>
          <ul className="grid gap-2">
            {weakSubjects.map((s) => (
              <li key={s.id}>
                <Link
                  to={s.id === "math" ? "/multiplication" : `/subject/${s.id}`}
                  className="rounded-chunky border-2 border-ink/12 px-3 py-2 flex justify-between items-center text-sm font-bold focus-ring"
                >
                  <span>{s.name}</span>
                  <span className="font-display font-extrabold text-ink/55">
                    {Math.round(s.masteryPct * 100)}%
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="grid grid-cols-2 gap-2">
        <Link to="/subject/geography" className="chunky-card p-3 text-center focus-ring">
          <Globe className="mx-auto text-geography mb-1" size={22} />
          <p className="text-xs font-display font-extrabold">Geography recap</p>
        </Link>
        <Link to="/subject/solar-system" className="chunky-card p-3 text-center focus-ring">
          <Orbit className="mx-auto text-solar-system mb-1" size={22} />
          <p className="text-xs font-display font-extrabold">Solar recap</p>
        </Link>
      </section>
    </div>
  );
}
