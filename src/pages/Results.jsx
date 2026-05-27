import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Home, Sparkles, TrendingUp, Zap, Trophy } from "lucide-react";
import { useAppStore } from "../store/useAppStore";
import { getLessonById, getSubject, getLessonsFor } from "../data/subjects";
import { StarRating } from "../components/ui/StarRating";
import { Button } from "../components/ui/Button";
import { ConfettiBlast } from "../components/rewards/ConfettiBlast";
import { LevelUpModal } from "../components/rewards/LevelUpModal";
import { Mascot } from "../components/mascots/Mascot";
import { BADGE_BY_ID } from "../data/badges";
import { xpToNextLevel, ageMultiplier } from "../utils/scoring";

export default function Results() {
  const { lessonId } = useParams();
  const navigate = useNavigate();
  const clearCelebration = useAppStore((s) => s.clearCelebration);
  const ageGroup = useAppStore((s) => s.ageGroup);
  const lessonProgress = useAppStore((s) => s.lessonProgress);
  const totalXP = useAppStore((s) => s.totalXP);
  const totalPoints = useAppStore((s) => s.totalPoints);

  const [animatedPoints, setAnimatedPoints] = useState(0);
  const [animatedXP, setAnimatedXP] = useState(0);
  const [levelUpOpen, setLevelUpOpen] = useState(false);
  const [result, setResult] = useState(() => {
    const p = useAppStore.getState().pendingCelebration;
    return p && p.lessonId === lessonId ? p : null;
  });

  useEffect(() => {
    clearCelebration();
  }, [clearCelebration]);

  const found = getLessonById(lessonId);
  const lesson = found?.lesson;
  const subject = found ? getSubject(found.subjectId) : null;
  const lp = lesson ? lessonProgress[lesson.id] : null;
  const stars = result?.stars ?? lp?.stars ?? 0;
  const correct = result?.correct ?? lp?.lastScore ?? 0;
  const total = result?.total ?? lp?.lastTotal ?? lesson?.questions.length ?? 0;
  const xp = result?.xpEarned ?? 0;
  const points = result?.pointsEarned ?? 0;
  const newBadges = result?.newlyEarnedBadges ?? [];

  const nextLesson = useMemo(() => {
    if (!found) return null;
    const lessons = getLessonsFor(found.subjectId, ageGroup);
    const idx = lessons.findIndex((l) => l.id === lessonId);
    return lessons[idx + 1] ?? null;
  }, [found, lessonId, ageGroup]);

  useEffect(() => {
    if (!points) return;
    const start = performance.now();
    const dur = 1100;
    let raf;
    const tick = (t) => {
      const p = Math.min(1, (t - start) / dur);
      setAnimatedPoints(Math.round(p * points));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [points]);

  useEffect(() => {
    if (!xp) return;
    const start = performance.now();
    const dur = 1100;
    let raf;
    const tick = (t) => {
      const p = Math.min(1, (t - start) / dur);
      setAnimatedXP(Math.round(p * xp));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [xp]);

  useEffect(() => {
    if (result?.leveledUp) {
      const t = setTimeout(() => setLevelUpOpen(true), 1500);
      return () => clearTimeout(t);
    }
  }, [result?.leveledUp]);

  if (!found || !lesson || !subject) {
    return (
      <div className="text-center mt-10">
        <p className="font-display font-extrabold text-xl">No results to show.</p>
        <Button onClick={() => navigate("/home")} className="mt-4">Home</Button>
      </div>
    );
  }

  const message =
    stars >= 3 ? "Perfect score! You crushed it!" :
    stars === 2 ? "Great work! Almost perfect." :
    stars === 1 ? "Good try! A little more practice and you've got it." :
    "Don't give up! Let's try again together.";

  return (
    <div className="flex flex-col gap-5 items-stretch">
      {stars >= 3 && <ConfettiBlast count={140} duration={3} />}

      <button
        onClick={() => navigate("/home")}
        className="self-start flex items-center gap-1 font-display font-extrabold text-ink/70 focus-ring rounded-pill px-3 py-1.5 bg-white border-[3px] border-ink/15 shadow-chunkySm"
        aria-label="Go to Home"
      >
        <Home size={18} strokeWidth={2.5} />
        <span>Home</span>
      </button>

      <motion.section
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 220, damping: 18 }}
        className="chunky-card p-6 text-center relative overflow-hidden"
        style={{ background: `linear-gradient(135deg, ${subject.accent} 0%, white 100%)` }}
      >
        <div className="absolute -bottom-2 -right-2 opacity-90">
          <Mascot kind={subject.mascotKey} size={96} />
        </div>
        <div className="text-xs uppercase tracking-wide font-display font-extrabold text-ink/60">
          Lesson Complete
        </div>
        <h1 className="font-display text-3xl font-extrabold leading-tight mt-1">{lesson.title}</h1>
        <div className="grid place-items-center mt-3">
          <StarRating value={stars} size={48} animate />
        </div>
        <div className="font-display text-5xl font-extrabold mt-2">
          {correct} / {total}
        </div>
        <p className="font-body font-bold text-ink/70 mt-1">{message}</p>

        {points > 0 && (
          <motion.div
            initial={{ scale: 0, rotate: -8 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.6, type: "spring", stiffness: 260, damping: 14 }}
            className="inline-flex items-center gap-2 mt-4 px-5 py-2.5 rounded-pill bg-primary text-white shadow-chunky border-[3px] border-ink/20"
          >
            <Trophy size={22} strokeWidth={2.5} />
            <span className="font-display font-extrabold text-2xl leading-none">+{animatedPoints} points!</span>
          </motion.div>
        )}
      </motion.section>

      <RewardsCard
        points={points}
        animatedPoints={animatedPoints}
        totalPoints={totalPoints}
        xp={xp}
        animatedXP={animatedXP}
        totalXP={totalXP}
        ageGroup={ageGroup}
      />

      {newBadges.length > 0 && (
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="chunky-card p-4 bg-accent/40"
        >
          <div className="font-display font-extrabold mb-2">New Badge{newBadges.length > 1 ? "s" : ""} Unlocked!</div>
          <ul className="flex flex-wrap gap-3">
            {newBadges.map((id) => {
              const b = BADGE_BY_ID[id];
              if (!b) return null;
              return (
                <motion.li
                  key={id}
                  initial={{ scale: 0, rotate: -90 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", stiffness: 240, damping: 14 }}
                  className="flex items-center gap-2 bg-white rounded-chunky border-[3px] border-ink/15 shadow-chunky px-3 py-2"
                >
                  <span className="text-2xl">{b.emoji}</span>
                  <div>
                    <div className="font-display font-extrabold">{b.name}</div>
                    <div className="text-xs font-bold text-ink/60">{b.description}</div>
                  </div>
                </motion.li>
              );
            })}
          </ul>
        </motion.section>
      )}

      <div className="grid grid-cols-2 gap-3">
        <Button variant="ghost" fullWidth onClick={() => navigate(`/lesson/${lesson.id}`, { replace: true })}>
          Try Again
        </Button>
        {nextLesson ? (
          <Button fullWidth onClick={() => navigate(`/lesson/${nextLesson.id}`, { replace: true })}>
            Next Lesson →
          </Button>
        ) : (
          <Button fullWidth onClick={() => navigate(`/subject/${found.subjectId}`)}>
            All Lessons →
          </Button>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Button variant="ghost" fullWidth onClick={() => navigate(`/subject/${found.subjectId}`)}
          leftIcon={<span aria-hidden>📚</span>}>
          Lessons
        </Button>
        <Button variant="ghost" fullWidth onClick={() => navigate("/home")} leftIcon={<Home size={18} strokeWidth={2.5} />}>
          Home
        </Button>
      </div>

      <LevelUpModal open={levelUpOpen} level={result?.newLevel} onClose={() => setLevelUpOpen(false)} />
    </div>
  );
}

function useCountUp(target, deps = []) {
  const [val, setVal] = useState(target);
  useEffect(() => {
    const start = performance.now();
    const dur = 1100;
    const from = val;
    let raf;
    const tick = (t) => {
      const p = Math.min(1, (t - start) / dur);
      setVal(Math.round(from + p * (target - from)));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
  return val;
}

function RewardsCard({ points, animatedPoints, totalPoints, xp, animatedXP, totalXP, ageGroup }) {
  const prevTotalPoints = Math.max(0, totalPoints - points);
  const prevTotalXP = Math.max(0, totalXP - xp);

  const displayTotalPoints = useCountUp(totalPoints, [totalPoints, points]);
  const displayTotalXP = useCountUp(totalXP, [totalXP, xp]);

  const { level, current, needed, pct } = xpToNextLevel(displayTotalXP);
  const mult = ageMultiplier(ageGroup);
  const multLabel = mult > 1 ? `×${mult.toFixed(1)} ${ageGroup} bonus` : "";

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      <motion.section
        initial={{ opacity: 0, y: 12, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ delay: 0.35, type: "spring", stiffness: 220, damping: 18 }}
        className="chunky-card p-5 bg-gradient-to-br from-accent to-white relative overflow-hidden"
      >
        <div className="absolute -right-3 -bottom-3 text-6xl opacity-20" aria-hidden>🏆</div>
        <div className="font-display text-[11px] font-extrabold uppercase tracking-wide text-ink/60 flex items-center gap-1">
          <Trophy size={14} className="text-primary" /> Points
        </div>
        <div className="mt-1">
          <div className="font-display font-extrabold text-4xl text-primary leading-none">
            {points > 0 ? `+${animatedPoints}` : "—"}
          </div>
          <div className="text-xs font-bold text-ink/60 mt-1">
            Total: <span className="font-display font-extrabold text-ink">{displayTotalPoints}</span>
          </div>
        </div>
        <div className="mt-3 text-[11px] font-bold text-ink/60">
          Lesson score · 10/correct + 20 perfect bonus
        </div>
      </motion.section>

      <motion.section
        initial={{ opacity: 0, y: 12, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ delay: 0.45, type: "spring", stiffness: 220, damping: 18 }}
        className="chunky-card p-5 bg-gradient-to-br from-secondary/20 to-white relative overflow-hidden"
      >
        <div className="absolute -right-3 -bottom-3 text-6xl opacity-20" aria-hidden>⚡</div>
        <div className="font-display text-[11px] font-extrabold uppercase tracking-wide text-ink/60 flex items-center gap-1">
          <Zap size={14} className="text-secondary" /> XP
        </div>
        <div className="mt-1">
          <div className="font-display font-extrabold text-4xl text-secondary leading-none">
            {xp > 0 ? `+${animatedXP}` : "—"}
          </div>
          <div className="text-xs font-bold text-ink/60 mt-1">
            Total: <span className="font-display font-extrabold text-ink">{displayTotalXP}</span>
          </div>
        </div>
        <div className="mt-3 text-[11px] font-bold text-ink/60">
          Powers your level{multLabel && <span> · <span className="text-secondary font-extrabold">{multLabel}</span></span>}
        </div>
      </motion.section>

      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.55 }}
        className="sm:col-span-2 chunky-card p-4"
      >
        <div className="flex items-center justify-between text-xs font-display font-extrabold text-ink/70 mb-2">
          <span className="flex items-center gap-2">
            <span className="inline-grid place-items-center w-8 h-8 rounded-full bg-accent border-[2.5px] border-ink/20 font-extrabold text-sm shadow-chunkySm">
              {level}
            </span>
            <span className="text-base">Level {level}</span>
          </span>
          <span className="flex items-center gap-1 text-secondary">
            <TrendingUp size={14} />
            {current} / {needed} XP to Lv{level + 1}
          </span>
        </div>
        <div className="h-4 bg-ink/10 rounded-full overflow-hidden border-[2px] border-ink/15">
          <motion.div
            className="h-full bg-gradient-to-r from-secondary to-primary"
            initial={false}
            animate={{ width: `${pct * 100}%` }}
            transition={{ duration: 0.9, ease: "easeOut" }}
          />
        </div>
      </motion.section>
    </div>
  );
}
