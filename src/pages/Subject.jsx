import { useNavigate, useParams } from "react-router-dom";
import { useMemo } from "react";
import { motion } from "framer-motion";
import * as Icons from "lucide-react";
import { ChevronLeft, Lock } from "lucide-react";
import { useAppStore } from "../store/useAppStore";
import { getLessonsFor, getSubject } from "../data/subjects";
import { Mascot } from "../components/mascots/Mascot";
import { StarRating } from "../components/ui/StarRating";
import { ProgressRing } from "../components/ui/ProgressRing";
import { isLessonUnlocked, subjectProgress, levelLabelFor } from "../utils/content";

export default function Subject() {
  const { subjectId } = useParams();
  const navigate = useNavigate();
  const { ageGroup, lessonProgress } = useAppStore();
  const subject = getSubject(subjectId);

  const lessons = useMemo(() => getLessonsFor(subjectId, ageGroup), [subjectId, ageGroup]);
  const stats = useMemo(() => subjectProgress(subjectId, ageGroup, lessonProgress), [subjectId, ageGroup, lessonProgress]);

  if (!subject) return <div>Subject not found.</div>;
  const Icon = Icons[subject.icon] ?? Icons.Sparkles;

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
          </div>
          <ProgressRing value={stats.masteryPct} size={64} stroke={8} color={subject.color}>
            <span className="text-sm font-extrabold">{Math.round(stats.masteryPct * 100)}%</span>
          </ProgressRing>
        </div>
        <div className="mt-3 flex items-center gap-2">
          <span className="px-3 py-1 rounded-pill bg-white/80 border-[2.5px] border-ink/15 font-display font-extrabold text-xs uppercase tracking-wide">
            {levelLabelFor(stats.masteryPct)}
          </span>
          <span className="text-xs font-bold text-ink/60">
            {stats.mastered}/{stats.total} lessons mastered · {stats.stars}/{stats.maxStars} ⭐
          </span>
          <div className="ml-auto -mb-6 -mr-2 opacity-90">
            <Mascot kind={subject.mascotKey} size={72} />
          </div>
        </div>
      </motion.section>

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
    </div>
  );
}
