import { Link } from "react-router-dom";
import { Brain, BookOpen, Globe, Orbit } from "lucide-react";
import { countDueReviews } from "../utils/multiplicationProgress";
import { useMultiplicationStore } from "../store/useMultiplicationStore";
import { countGeoDueReviews } from "../utils/geographyProgress";
import { useGeographyStore } from "../store/useGeographyStore";
import { useAppStore } from "../store/useAppStore";
import { SUBJECTS } from "../data/subjects";
import { isLiveSubject } from "../config/liveSubjects";
import { subjectProgress } from "../utils/content";
import { HubPageLayout } from "../components/layout/HubPageLayout";

export default function ReviewHub() {
  const mulDue = useMultiplicationStore((s) => countDueReviews(s));
  const geoDue = useGeographyStore((s) => countGeoDueReviews(s.countries));
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
    <HubPageLayout
      title="Review"
      subtitle="Spaced repetition across subjects."
      icon={<Brain className="mx-auto text-[#c4b5fd]" size={32} aria-hidden />}
      headerClassName="border-[#7F77DD]/35"
    >
      <Link
        to="/multiplication/review"
        className="hub-topic-card border-[3px] border-math/25 focus-ring"
      >
        <span className="text-3xl shrink-0" aria-hidden>
          🔢
        </span>
        <div className="flex-1 min-w-0">
          <p className="font-display font-extrabold text-white">Multiplication SRS</p>
          <p className="text-xs font-bold text-white/55">
            {mulDue > 0 ? `${mulDue} facts due today` : "All caught up — nice work!"}
          </p>
        </div>
        <span className="text-sm font-display font-extrabold text-math shrink-0">Start</span>
      </Link>

      <Link
        to="/review/geography"
        className="hub-topic-card border-[3px] border-geography/25 focus-ring"
      >
        <span className="text-3xl shrink-0" aria-hidden>
          🌍
        </span>
        <div className="flex-1 min-w-0">
          <p className="font-display font-extrabold text-white">Geography SRS</p>
          <p className="text-xs font-bold text-white/55">
            {geoDue > 0
              ? `${geoDue} countries due today`
              : "Play flag or map quizzes to build your deck"}
          </p>
        </div>
        <span className="text-sm font-display font-extrabold text-geography shrink-0">Start</span>
      </Link>

      {weakSubjects.length > 0 && (
        <section className="hub-glass-panel p-4">
          <div className="flex items-center gap-2 mb-3">
            <BookOpen size={18} className="text-[#ffd700]" aria-hidden />
            <h2 className="font-display font-extrabold text-white">Brush up</h2>
          </div>
          <ul className="grid gap-2">
            {weakSubjects.map((s) => (
              <li key={s.id}>
                <Link
                  to={s.id === "math" ? "/multiplication" : `/subject/${s.id}`}
                  className="rounded-2xl border border-white/15 bg-white/10 px-3 py-2 flex justify-between items-center text-sm font-bold text-white focus-ring"
                >
                  <span>{s.name}</span>
                  <span className="font-display font-extrabold text-white/55">
                    {Math.round(s.masteryPct * 100)}%
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="grid grid-cols-2 gap-2">
        <Link to="/subject/geography" className="hub-glass-panel p-3 text-center focus-ring">
          <Globe className="mx-auto text-geography mb-1" size={22} aria-hidden />
          <p className="text-xs font-display font-extrabold text-white">Geography recap</p>
        </Link>
        <Link to="/subject/solar-system" className="hub-glass-panel p-3 text-center focus-ring">
          <Orbit className="mx-auto text-solar-system mb-1" size={22} aria-hidden />
          <p className="text-xs font-display font-extrabold text-white">Solar recap</p>
        </Link>
      </section>
    </HubPageLayout>
  );
}
