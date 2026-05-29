import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronRight, Lock, Map } from "lucide-react";
import { GEO_TRACKS, geographyLessonId } from "../data/geography/tracks";
import { getLessonsFor } from "../data/subjects";
import { isLessonUnlocked } from "../utils/content";
import { ProgressRing } from "../components/ui/ProgressRing";
import { StarRating } from "../components/ui/StarRating";

export function GeographyHub({ ageGroup, lessonProgress }) {
  const navigate = useNavigate();
  const minimumQuestions = 10;
  const lessons = getLessonsFor("geography", ageGroup);
  const lessonByTrack = Object.fromEntries(
    lessons.map((l) => [l.track ?? l.id.split("-")[1], l])
  );

  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-3xl bg-gradient-to-br from-[#E1F5EE] via-white to-[#B5E8E1]/40 p-4 ring-1 ring-geography/20">
        <div className="flex items-start gap-3">
          <div className="w-12 h-12 rounded-2xl bg-geography/15 grid place-items-center text-2xl shrink-0">
            🌍
          </div>
          <div>
            <h2 className="font-display text-lg font-extrabold text-geography leading-tight">
              Know the world — for adventure, not for a test.
            </h2>
            <p className="text-sm font-medium text-ink/60 mt-1 leading-relaxed">
              Five tracks · 194 countries · map, flags, capitals & more.
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => navigate("/subject/geography?tab=learn")}
          className="mt-3 w-full flex items-center justify-center gap-2 py-2.5 rounded-2xl bg-geography text-white font-display font-extrabold text-sm focus-ring"
        >
          <Map size={16} />
          Open Learn — browse countries & map
        </button>
      </div>

      <p className="text-[11px] font-bold uppercase tracking-wide text-ink/45 px-1">
        5 tracks to master
      </p>

      <ul className="flex flex-col gap-3">
        {GEO_TRACKS.map((track, i) => {
          const lesson = lessonByTrack[track.id];
          if (!lesson) return null;
          const p = lessonProgress[lesson.id];
          const unlocked = isLessonUnlocked(
            "geography",
            ageGroup,
            lesson.id,
            lessonProgress
          );
          const mastery = p?.mastered ? 1 : p ? 0.35 : 0;
          const stars = p?.stars ?? 0;

          return (
            <motion.li
              key={track.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
            >
              <button
                type="button"
                disabled={!unlocked}
                onClick={() => unlocked && navigate(`/lesson/${lesson.id}`)}
                className={`w-full text-left rounded-3xl p-4 flex items-center gap-3 focus-ring transition ${
                  unlocked
                    ? "hover:shadow-md ring-1 ring-ink/[0.08] shadow-sm"
                    : "opacity-55 cursor-not-allowed ring-1 ring-ink/[0.06]"
                }`}
                style={{ background: track.accent }}
              >
                <div
                  className="w-14 h-14 rounded-2xl grid place-items-center text-2xl shrink-0"
                  style={{ background: `${track.color}22` }}
                >
                  {track.emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <p
                    className="font-display font-extrabold text-base leading-tight"
                    style={{ color: track.color }}
                  >
                    {track.title}
                  </p>
                  <p className="text-xs font-medium text-ink/55 mt-0.5 line-clamp-2">
                    {track.blurb}
                  </p>
                  <p className="text-[10px] font-bold text-ink/45 mt-1">
                    {Math.max(lesson.questions.length, minimumQuestions)}+ questions
                    {p?.mastered ? " · Mastered" : unlocked ? "" : " · Locked"}
                  </p>
                </div>
                {unlocked ? (
                  <div className="flex flex-col items-center gap-1 shrink-0">
                    <ProgressRing
                      value={mastery}
                      size={48}
                      stroke={6}
                      color={track.color}
                    >
                      <span className="text-[10px] font-extrabold">
                        {p?.mastered ? "✓" : stars ? `${stars}★` : "Go"}
                      </span>
                    </ProgressRing>
                    <StarRating value={stars} size={14} />
                  </div>
                ) : (
                  <Lock className="text-ink/35 shrink-0" size={22} />
                )}
                {unlocked && (
                  <ChevronRight className="text-ink/25 shrink-0" size={20} />
                )}
              </button>
            </motion.li>
          );
        })}
      </ul>

      <p className="text-[11px] font-medium text-ink/45 text-center px-2">
        Lesson ids use format <code className="text-ink/60">geo-track-age</code>.
        Old geography progress may reset after updates — see Settings.
      </p>
    </div>
  );
}

export { geographyLessonId };
