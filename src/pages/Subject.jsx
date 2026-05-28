import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useMemo } from "react";
import { motion } from "framer-motion";
import * as Icons from "lucide-react";
import { ChevronLeft, Lock } from "lucide-react";
import { useAppStore } from "../store/useAppStore";
import { getLessonsFor, getSubject } from "../data/subjects";
import { Mascot } from "../components/mascots/Mascot";
import { StarRating } from "../components/ui/StarRating";
import { ProgressRing } from "../components/ui/ProgressRing";
import { LearnTabs } from "../components/learn/LearnTabs";
import { GeographyLearn } from "../components/geography/GeographyLearn";
import { SolarSystemLearn } from "../components/solar-system/SolarSystemLearn";
import { MathLearn } from "../components/math/MathLearn";
import { GenericSubjectLearn } from "../components/learn/GenericSubjectLearn";
import { GeographyHub } from "./GeographyHub";
import { isLessonUnlocked, subjectProgress, subjectRankFor } from "../utils/content";

export default function Subject() {
  const { subjectId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { ageGroup, lessonProgress } = useAppStore();
  const subject = getSubject(subjectId);

  const tab = searchParams.get("tab") === "learn" ? "learn" : "lessons";
  const showLearn = Boolean(subject?.learnSurface);

  const lessons = useMemo(() => getLessonsFor(subjectId, ageGroup), [subjectId, ageGroup]);
  const stats = useMemo(() => subjectProgress(subjectId, ageGroup, lessonProgress), [subjectId, ageGroup, lessonProgress]);

  if (!subject) return <div>Subject not found.</div>;
  const Icon = Icons[subject.icon] ?? Icons.Sparkles;

  const setTab = (next) => {
    if (next === "lessons") {
      searchParams.delete("tab");
      setSearchParams(searchParams, { replace: true });
    } else {
      setSearchParams({ tab: "learn" }, { replace: true });
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <button
        onClick={() => navigate("/home")}
        className="self-start flex items-center gap-1 font-display font-extrabold text-ink/70 focus-ring rounded-pill px-2 py-1"
      >
        <ChevronLeft size={20} /> Home
      </button>

      <motion.section
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="chunky-card p-5 relative overflow-hidden"
        style={{ background: `linear-gradient(135deg, ${subject.accent} 0%, white 100%)` }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-14 h-14 rounded-2xl grid place-items-center text-white shadow-chunky border-[3px] border-ink/20"
            style={{ background: subject.color }}
          >
            <Icon size={28} strokeWidth={2.5} />
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="font-display text-3xl font-extrabold leading-tight">{subject.name}</h1>
            <p className="text-sm font-bold text-ink/70">{subject.tagline}</p>
            {subjectId === "math" && (
              <>
                <p className="text-xs font-bold text-primary mt-1">
                  Times tables you&apos;ll use for life — and at school.
                </p>
                <Link
                  to="/multiplication"
                  className="inline-block mt-2 text-xs font-display font-extrabold text-math underline focus-ring"
                >
                  Enter Multiplication Training Camp →
                </Link>
              </>
            )}
            {subjectId === "geography" && (
              <p className="text-xs font-bold text-ink/60 mt-1">
                Know the world — for adventure, not for a test.
              </p>
            )}
          </div>
          <ProgressRing value={stats.masteryPct} size={64} stroke={8} color={subject.color}>
            <span className="text-sm font-extrabold">{Math.round(stats.masteryPct * 100)}%</span>
          </ProgressRing>
        </div>
        <div className="mt-3 flex items-center gap-2">
          {(() => {
            const r = subjectRankFor(stats.masteryPct);
            return (
              <span
                className="px-3 py-1 rounded-pill bg-white/90 border-[2.5px] border-ink/15 font-display font-extrabold text-xs uppercase tracking-wide flex items-center gap-1"
                style={{ color: r.color }}
              >
                <span aria-hidden>{r.emoji}</span> {r.title}
              </span>
            );
          })()}
          <span className="text-xs font-bold text-ink/60">
            {stats.mastered}/{stats.total} mastered · {stats.stars}/{stats.maxStars} ⭐
          </span>
          <div className="ml-auto -mb-6 -mr-2 opacity-90">
            <Mascot kind={subject.mascotKey} size={72} />
          </div>
        </div>
      </motion.section>

      {showLearn && <LearnTabs active={tab} onChange={setTab} showLearn />}

      {tab === "learn" && showLearn ? (
        <LearnSurface subjectId={subjectId} />
      ) : subjectId === "geography" ? (
        <GeographyHub ageGroup={ageGroup} lessonProgress={lessonProgress} />
      ) : (
        <LessonsList
          lessons={lessons}
          subject={subject}
          subjectId={subjectId}
          ageGroup={ageGroup}
          lessonProgress={lessonProgress}
          navigate={navigate}
        />
      )}
    </div>
  );
}

function LearnSurface({ subjectId }) {
  if (subjectId === "geography") return <GeographyLearn />;
  if (subjectId === "solar-system") return <SolarSystemLearn />;
  if (subjectId === "math") return <MathLearn />;
  const subject = getSubject(subjectId);
  return <GenericSubjectLearn subjectId={subjectId} subjectName={subject?.name ?? subjectId} />;
}

function LessonsList({ lessons, subject, subjectId, ageGroup, lessonProgress, navigate }) {
  return (
    <ul className="flex flex-col gap-3">
      {lessons.map((lesson, i) => {
        const p = lessonProgress[lesson.id];
        const unlocked = isLessonUnlocked(subjectId, ageGroup, lesson.id, lessonProgress);
        const stars = p?.stars ?? 0;
        return (
          <motion.li
            key={lesson.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <button
              onClick={() => unlocked && navigate(`/lesson/${lesson.id}`)}
              disabled={!unlocked}
              className={`w-full chunky-card p-4 flex items-center gap-3 text-left focus-ring ${
                unlocked ? "hover:-translate-y-0.5 transition" : "opacity-60 cursor-not-allowed"
              }`}
              style={unlocked && p?.mastered ? { background: subject.accent } : undefined}
            >
              <div
                className="w-12 h-12 rounded-full grid place-items-center font-display font-extrabold text-white shadow-chunkySm border-[2.5px] border-ink/20"
                style={{ background: unlocked ? subject.color : "var(--color-text)" }}
              >
                {unlocked ? i + 1 : <Lock size={18} />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-display text-lg font-extrabold truncate">{lesson.title}</div>
                <div className="text-xs font-bold text-ink/60">
                  {lesson.questions.length} questions · {p?.mastered ? "Mastered ⭐" : unlocked ? "Tap to begin" : "Locked"}
                </div>
              </div>
              <StarRating value={stars} size={20} />
            </button>
          </motion.li>
        );
      })}
    </ul>
  );
}
