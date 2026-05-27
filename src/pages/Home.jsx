import { Link, useNavigate } from "react-router-dom";
import { Brain, ChevronRight, Zap } from "lucide-react";
import { useMemo } from "react";
import { motion } from "framer-motion";
import * as Icons from "lucide-react";
import { useAppStore } from "../store/useAppStore";
import { SUBJECTS } from "../data/subjects";
import { ProgressRing } from "../components/ui/ProgressRing";
import { StarRating } from "../components/ui/StarRating";
import { subjectProgress, subjectRankFor, findNextLesson } from "../utils/content";
import { getMonthlyTheme, getThemeBackgroundStyle } from "../utils/theme";
import { Mascot } from "../components/mascots/Mascot";
import { useMultiplicationStore } from "../store/useMultiplicationStore";
import { formatMs } from "../utils/multiplicationScoring";

export default function Home() {
  const navigate = useNavigate();
  const { kidName, ageGroup, lessonProgress, dailyGoal, lessonsToday } = useAppStore();
  const dueReviews = useMultiplicationStore((s) => s.getDueReviews().length);
  const bestSpeedRun = useMultiplicationStore((s) => s.bestSpeedRun);
  const theme = getMonthlyTheme();

  const today = new Date().toISOString().slice(0, 10);
  const todayCount = lessonsToday.date === today ? lessonsToday.count : 0;
  const goalPct = Math.min(1, todayCount / Math.max(1, dailyGoal));

  return (
    <div className="flex flex-col gap-5">
      <motion.section
        initial={{ opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
        className="chunky-card px-4 py-3 flex items-center gap-3"
        style={getThemeBackgroundStyle(theme)}
      >
        <motion.div
          animate={{ rotate: [-6, 6, -6] }}
          transition={{ repeat: Infinity, duration: 3.4, ease: "easeInOut" }}
          className="text-3xl"
          aria-hidden
        >
          {theme.emoji}
        </motion.div>
        <div className="flex-1 min-w-0">
          <div className="text-[10px] uppercase tracking-wide font-display font-extrabold text-ink/60">
            This month
          </div>
          <div className="font-display font-extrabold text-lg leading-tight truncate" style={{ color: theme.accent }}>
            {theme.name}
          </div>
          <div className="text-xs font-bold text-ink/70 truncate">{theme.tagline}</div>
        </div>
      </motion.section>

      <section className="relative chunky-card p-5 overflow-hidden" style={getThemeBackgroundStyle(theme)}>
        <div className="absolute -right-4 -bottom-4 opacity-90">
          <Mascot kind="panda" size={120} />
        </div>
        <div className="relative max-w-[70%]">
          <div className="text-xs font-display font-extrabold uppercase tracking-wide text-ink/60">
            Welcome back!
          </div>
          <h1 className="font-display text-3xl font-extrabold leading-tight">
            Hi, {kidName || "Friend"} <motion.span initial={{ rotate: -20 }} animate={{ rotate: 20 }} transition={{ repeat: Infinity, repeatType: "reverse", duration: 0.6 }} className="inline-block">👋</motion.span>
          </h1>
          <p className="text-sm font-body font-bold text-ink/70 mt-1">
            What do you want to learn today?
          </p>
          <div className="mt-3 inline-flex items-center gap-2 bg-white/90 rounded-pill px-3 py-1.5 border-[2.5px] border-ink/15">
            <div className="w-20 h-2 rounded-full bg-ink/10 overflow-hidden">
              <motion.div
                className="h-full bg-primary"
                initial={{ width: 0 }}
                animate={{ width: `${goalPct * 100}%` }}
                transition={{ duration: 0.6 }}
              />
            </div>
            <span className="text-xs font-display font-bold">
              {todayCount} / {dailyGoal} today
            </span>
          </div>
        </div>
      </section>

      {dueReviews > 0 && (
        <Link to="/multiplication/review" className="chunky-card p-4 flex items-center gap-3 bg-[#EEEDFE] border-[3px] border-[#7F77DD]/30 focus-ring">
          <div className="w-10 h-10 rounded-xl bg-[#7F77DD] text-white grid place-items-center">
            <Brain size={20} />
          </div>
          <div className="min-w-0 flex-1">
            <div className="font-display text-base font-extrabold text-[#3C3489]">
              {dueReviews} items due for review
            </div>
            <div className="text-xs font-bold text-[#534AB7]">
              Quick 5-min session to keep your knowledge sharp
            </div>
          </div>
          <ChevronRight className="text-[#7F77DD]" size={18} />
        </Link>
      )}

      <Link
        to="/multiplication/speed-run"
        className="chunky-card p-4 flex items-center gap-4 border-[3px] border-mul-electric/50 bg-gradient-to-r from-mul-dark to-math text-white focus-ring"
      >
        <Zap className="text-mul-gold shrink-0" size={32} />
        <div className="min-w-0 flex-1">
          <div className="font-display text-lg font-extrabold">Speed Run Challenge</div>
          <div className="text-xs font-bold text-white/75">
            {bestSpeedRun
              ? `Your best: ${bestSpeedRun.score}/50 in ${formatMs(bestSpeedRun.totalTimeMs)}`
              : "Beat 50 random multiplication questions as fast as possible"}
          </div>
        </div>
        <span className="font-display font-extrabold text-mul-gold text-sm px-3 py-1 rounded-pill bg-primary/80">Play</span>
      </Link>

      <h2 className="font-display text-2xl font-extrabold flex items-center gap-2">
        <span>Subjects</span>
        <span className="text-sm font-bold text-ink/60">Pick your adventure</span>
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {SUBJECTS.map((s, i) => (
          <SubjectCard
            key={s.id}
            subject={s}
            index={i}
            ageGroup={ageGroup}
            lessonProgress={lessonProgress}
            onClick={() => navigate(`/subject/${s.id}`)}
          />
        ))}
      </div>

      <div className="flex items-center justify-center gap-3 text-xs font-bold text-ink/50 pt-1">
        <Link to="/about" className="hover:text-primary focus-ring rounded px-2 py-1">Our story</Link>
        <span aria-hidden>·</span>
        <Link to="/impact" className="hover:text-primary focus-ring rounded px-2 py-1">Mission</Link>
      </div>
      <p className="text-center text-[10px] font-bold text-ink/40 -mt-2 pb-1">
        Designed by Vinay. Built with Cursor.
      </p>
    </div>
  );
}

function SubjectCard({ subject, index, ageGroup, lessonProgress, onClick }) {
  const stats = useMemo(() => subjectProgress(subject.id, ageGroup, lessonProgress), [subject.id, ageGroup, lessonProgress]);
  const next = useMemo(() => findNextLesson(subject.id, ageGroup, lessonProgress), [subject.id, ageGroup, lessonProgress]);
  const Icon = Icons[subject.icon] ?? Icons.Sparkles;
  const cta = stats.attempted === 0 ? "Start" : stats.mastered === stats.total ? "Review" : "Continue";

  return (
    <motion.button
      onClick={onClick}
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.3 }}
      whileHover={{ y: -2 }}
      whileTap={{ y: 2, boxShadow: "2px 2px 0px rgba(0,0,0,0.15)" }}
      className="chunky-card p-4 text-left flex flex-col gap-3 focus-ring"
      style={{ background: `linear-gradient(135deg, ${subject.accent} 0%, white 100%)` }}
    >
      <div className="flex items-center gap-3">
        <div
          className="w-12 h-12 rounded-2xl grid place-items-center text-white shadow-chunkySm border-[2.5px] border-ink/20"
          style={{ background: subject.color }}
        >
          <Icon size={24} strokeWidth={2.5} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <div className="font-display text-lg font-extrabold leading-tight truncate">{subject.name}</div>
            {subject.isBonus && (
              <span className="shrink-0 text-[9px] uppercase tracking-wide font-display font-extrabold px-2 py-0.5 rounded-pill bg-accent border-[2px] border-ink/15 text-ink">
                Bonus
              </span>
            )}
          </div>
          <div className="text-[12px] font-bold text-ink/60 truncate">{subject.tagline}</div>
        </div>
        <ProgressRing value={stats.masteryPct} size={48} stroke={6} color={subject.color}>
          <span className="text-[11px] font-extrabold">{Math.round(stats.masteryPct * 100)}%</span>
        </ProgressRing>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <StarRating value={Math.min(3, Math.round((stats.stars / Math.max(1, stats.maxStars)) * 3))} size={18} />
          <span className="text-[11px] font-bold text-ink/60">
            {subjectRankFor(stats.masteryPct).emoji} {subjectRankFor(stats.masteryPct).title} · {stats.mastered}/{stats.total}
          </span>
        </div>
        <span
          className="font-display font-extrabold text-sm px-3 py-1.5 rounded-pill text-white shadow-chunkySm border-[2.5px] border-ink/20"
          style={{ background: subject.color }}
        >
          {cta} →
        </span>
      </div>
      {next && (
        <div className="text-xs font-bold text-ink/60 truncate">Up next: {next.title}</div>
      )}
    </motion.button>
  );
}
