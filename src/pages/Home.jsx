import { Link, useNavigate } from "react-router-dom";
import { useMemo } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  BookOpen,
  ChevronRight,
  ClipboardList,
  Compass,
  PencilLine,
  Play,
  Settings,
  Sparkles,
  Trophy,
} from "lucide-react";
import { useAppStore } from "../store/useAppStore";
import { SUBJECTS } from "../data/subjects";
import { subjectProgress, findNextLesson } from "../utils/content";
import { getMonthlyTheme } from "../utils/theme";
import { useMultiplicationStore } from "../store/useMultiplicationStore";
import { useGeographyStore } from "../store/useGeographyStore";
import { formatMs } from "../utils/multiplicationScoring";
import { useAssignments } from "../hooks/useAssignments";
import { getDailyChallenge } from "../utils/dailyChallenge";
import { xpToNextLevel } from "../utils/scoring";

const SUBJECT_THEMES = {
  geography: { gradient: "from-emerald-400/20 to-teal-50", accent: "#0F6E56", emoji: "🌍" },
  history: { gradient: "from-amber-400/25 to-orange-50", accent: "#854F0B", emoji: "📜" },
  math: { gradient: "from-blue-400/20 to-sky-50", accent: "#185FA5", emoji: "🔢" },
  music: { gradient: "from-violet-400/20 to-purple-50", accent: "#534AB7", emoji: "🎵" },
  "solar-system": { gradient: "from-orange-400/20 to-rose-50", accent: "#993C1D", emoji: "🪐" },
  "general-knowledge": { gradient: "from-lime-400/20 to-green-50", accent: "#3B6D11", emoji: "💡" },
  trivia: { gradient: "from-rose-400/20 to-pink-50", accent: "#B7273A", emoji: "⭐" },
};

const QUICK_NAV = [
  { to: "/home", label: "Learn", Icon: BookOpen, active: true },
  { to: "/explore", label: "Explore", Icon: Compass },
  { to: "/create", label: "Create", Icon: PencilLine },
  { to: "/compete", label: "Compete", Icon: Trophy },
];

const fadeUp = (i, reduce) =>
  reduce
    ? {}
    : {
        initial: { opacity: 0, y: 12 },
        animate: { opacity: 1, y: 0 },
        transition: { delay: i * 0.05, duration: 0.35, ease: [0.22, 1, 0.36, 1] },
      };

function todayKey() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function sumTodayXP(learnXPDaily) {
  if (!learnXPDaily || learnXPDaily.date !== todayKey()) return 0;
  return Object.values(learnXPDaily.xpBySubject || {}).reduce((a, b) => a + b, 0);
}

function pickNextAction(ageGroup, lessonProgress) {
  for (const s of SUBJECTS) {
    const next = findNextLesson(s.id, ageGroup, lessonProgress);
    if (next) {
      return {
        subject: s,
        lesson: next,
        path:
          s.id === "math"
            ? "/multiplication"
            : s.id === "geography"
              ? "/subject/geography"
              : `/lesson/${next.id}`,
      };
    }
  }
  return null;
}

export default function Home() {
  const navigate = useNavigate();
  const reduce = useReducedMotion();
  const {
    kidName,
    role,
    ageGroup,
    lessonProgress,
    dailyChallengeDone,
    completeDailyChallenge,
    grantXP,
    lessonsToday,
    dailyGoal,
    learnXPDaily,
    currentStreak,
    totalXP,
  } = useAppStore();

  const mulDue = useMultiplicationStore((s) => s.getDueReviews().length);
  const geoDue = useGeographyStore((s) => s.getDueReviews().length);
  const dueReviews = mulDue + geoDue;
  const bestSpeedRun = useMultiplicationStore((s) => s.bestSpeedRun);
  const { assignments } = useAssignments();
  const theme = getMonthlyTheme();
  const daily = useMemo(() => getDailyChallenge(), []);
  const dailyDone = dailyChallengeDone === daily.dateKey;
  const nextAction = useMemo(
    () => pickNextAction(ageGroup, lessonProgress),
    [ageGroup, lessonProgress]
  );

  const isFirstTime = Object.keys(lessonProgress).length === 0;
  const xpToday = sumTodayXP(learnXPDaily);
  const lessonsDone =
    lessonsToday?.date === todayKey() ? lessonsToday.count : 0;
  const goalPct = Math.min(100, Math.round((lessonsDone / Math.max(1, dailyGoal)) * 100));
  const level = xpToNextLevel(totalXP);

  return (
    <div className="-mx-4 -mt-5 flex flex-col min-h-[calc(100dvh-8rem)]">
      {/* Hero — full bleed */}
      <section className="relative overflow-hidden px-4 pt-6 pb-8 bg-gradient-to-br from-[#FF6B35] via-[#FF8F5C] to-[#4ECDC4]">
        <div
          className="absolute inset-0 opacity-40 pointer-events-none"
          aria-hidden
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 20%, white 0%, transparent 45%), radial-gradient(circle at 80% 60%, rgba(255,230,109,0.5) 0%, transparent 40%)",
          }}
        />
        <motion.div className="relative max-w-2xl mx-auto" {...fadeUp(0, reduce)}>
          <p className="text-white/80 text-sm font-semibold mb-1">
            {theme.emoji} {theme.name}
          </p>
          <h1 className="font-display text-[1.75rem] sm:text-3xl font-extrabold text-white leading-[1.15] tracking-tight">
            {isFirstTime
              ? `Hey ${kidName || "there"} — let's explore!`
              : `Welcome back, ${kidName || "friend"}!`}
          </h1>
          <p className="text-white/85 text-[15px] font-medium mt-2 max-w-[280px] leading-snug">
            Seven subjects, real skills, and adventures made for curious kids.
          </p>

          <div className="flex flex-wrap gap-2 mt-4">
            <span className="home-pill">
              <span className="font-display font-extrabold">{level.emoji}</span>
              Lvl {level.level}
            </span>
            <span className="home-pill">🔥 {currentStreak} day streak</span>
            <span className="home-pill">⚡ {xpToday} XP today</span>
          </div>

          <div className="mt-4 home-card p-3">
            <div className="flex items-center justify-between text-xs font-bold text-ink/60 mb-1.5">
              <span>Today's goal</span>
              <span className="text-ink">
                {lessonsDone}/{dailyGoal} lessons
              </span>
            </div>
            <div className="h-2 rounded-full bg-ink/[0.06] overflow-hidden">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-primary to-secondary"
                initial={{ width: 0 }}
                animate={{ width: `${goalPct}%` }}
                transition={{ duration: 0.7, ease: "easeOut" }}
              />
            </div>
          </div>
        </motion.div>
      </section>

      {/* Quick nav — mirrors bottom tabs for wayfinding */}
      <div className="sticky top-0 z-20 bg-bg/80 backdrop-blur-lg border-b border-ink/[0.06] px-4 py-2.5">
        <div className="flex gap-2 overflow-x-auto scrollbar-none max-w-2xl mx-auto">
          {QUICK_NAV.map(({ to, label, Icon, active }) => (
            <Link
              key={to}
              to={to}
              className={`shrink-0 inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl text-sm font-bold transition focus-ring ${
                active
                  ? "bg-ink text-white shadow-md"
                  : "bg-white text-ink/70 ring-1 ring-ink/[0.08] hover:bg-ink/[0.03]"
              }`}
            >
              <Icon size={16} strokeWidth={2.5} />
              {label}
            </Link>
          ))}
        </div>
      </div>

      <div className="px-4 py-5 flex flex-col gap-5 max-w-2xl mx-auto w-full">
        {/* Primary CTA */}
        <motion.div {...fadeUp(1, reduce)}>
          {nextAction ? (
            <button
              type="button"
              onClick={() => navigate(nextAction.path)}
              className="group w-full text-left rounded-3xl p-5 bg-gradient-to-br from-ink to-[#3d4268] text-white shadow-[0_12px_40px_rgba(45,48,71,0.25)] focus-ring overflow-hidden relative"
            >
              <div
                className="absolute -right-8 -top-8 w-32 h-32 rounded-full bg-primary/30 blur-2xl"
                aria-hidden
              />
              <div className="relative flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-white/15 grid place-items-center text-3xl shrink-0 backdrop-blur-sm">
                  {SUBJECT_THEMES[nextAction.subject.id]?.emoji ?? "✨"}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white/70 text-xs font-semibold">
                    Continue learning
                  </p>
                  <p className="font-display text-xl font-extrabold leading-tight mt-0.5 line-clamp-2">
                    {nextAction.lesson.title}
                  </p>
                  <p className="text-white/60 text-sm font-medium mt-1">
                    {nextAction.subject.name}
                  </p>
                </div>
                <div className="w-12 h-12 rounded-full bg-primary grid place-items-center shrink-0 group-hover:scale-105 transition-transform">
                  <Play size={22} className="text-white ml-0.5" fill="white" />
                </div>
              </div>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => navigate("/multiplication")}
              className="group w-full text-left rounded-3xl p-5 bg-gradient-to-br from-primary to-[#ff8f5c] text-white shadow-[0_12px_40px_rgba(255,107,53,0.35)] focus-ring"
            >
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-white/20 grid place-items-center text-3xl">
                  🚀
                </div>
                <div className="flex-1">
                  <p className="text-white/90 text-xs font-semibold">
                    {isFirstTime ? "Start your journey" : "Pick something new"}
                  </p>
                  <p className="font-display text-xl font-extrabold leading-tight mt-0.5">
                    Begin with multiplication
                  </p>
                  <p className="text-white/80 text-sm font-medium mt-1">
                    Tables 1×1 through 20×20
                  </p>
                </div>
                <ArrowRight
                  size={24}
                  className="shrink-0 group-hover:translate-x-1 transition-transform"
                />
              </div>
            </button>
          )}
        </motion.div>

        {/* Today's picks — horizontal cards */}
        <motion.section {...fadeUp(2, reduce)}>
          <SectionTitle>Today&apos;s picks</SectionTitle>
          <div className="flex gap-3 overflow-x-auto -mx-4 px-4 pb-1 scrollbar-none snap-x snap-mandatory">
            <PickCard
              to={daily.path}
              icon={daily.emoji}
              title={dailyDone ? "Challenge done" : daily.title}
              sub={dailyDone ? "See you tomorrow" : `+${daily.xpBonus} XP bonus`}
              gradient="from-amber-100 to-yellow-50"
              done={dailyDone}
              onClick={() => {
                if (!dailyDone) {
                  completeDailyChallenge(daily.dateKey);
                  grantXP(daily.xpBonus);
                }
              }}
            />
            <PickCard
              to="/multiplication/speed-run"
              icon="⚡"
              title="Speed Run"
              sub={
                bestSpeedRun
                  ? `Best ${formatMs(bestSpeedRun.totalTimeMs)}`
                  : "50 questions · beat the clock"
              }
              gradient="from-slate-800 to-slate-700"
              dark
            />
            <PickCard
              to={dueReviews > 0 ? "/review" : "/explore"}
              icon={dueReviews > 0 ? "🧠" : "🧭"}
              title={dueReviews > 0 ? "Review time" : "Explore"}
              sub={
                dueReviews > 0
                  ? `${mulDue} math · ${geoDue} geo due`
                  : "Maps, space & more"
              }
              gradient="from-violet-100 to-indigo-50"
            />
            <PickCard
              to="/life"
              icon="📍"
              title="Life Explorer"
              sub="Places, books & stories"
              gradient="from-teal-100 to-cyan-50"
            />
          </div>
        </motion.section>

        {assignments.length > 0 && (
          <motion.div {...fadeUp(3, reduce)}>
            <AssignmentsBanner assignments={assignments} />
          </motion.div>
        )}

        {/* Subjects */}
        <motion.section {...fadeUp(4, reduce)}>
          <SectionTitle
            action={
              <button
                type="button"
                onClick={() => navigate("/explore")}
                className="text-sm font-bold text-primary flex items-center gap-0.5 focus-ring rounded-lg px-1"
              >
                See all <ChevronRight size={16} />
              </button>
            }
          >
            What you can learn
          </SectionTitle>
          <div className="grid grid-cols-2 gap-3">
            {SUBJECTS.map((s) => (
              <SubjectTile
                key={s.id}
                subject={s}
                ageGroup={ageGroup}
                lessonProgress={lessonProgress}
                onClick={() =>
                  navigate(
                    s.id === "math" ? "/multiplication" : `/subject/${s.id}`
                  )
                }
              />
            ))}
          </div>
        </motion.section>

        {/* Why KidQuest — compact trust strip */}
        <motion.section
          className="home-card p-4 bg-gradient-to-br from-white to-secondary/5"
          {...fadeUp(5, reduce)}
        >
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-2xl bg-secondary/15 grid place-items-center shrink-0">
              <Sparkles className="text-secondary" size={20} />
            </div>
            <div>
              <h3 className="font-display font-extrabold text-ink text-base leading-tight">
                Built for kids & families
              </h3>
              <p className="text-sm text-ink/60 font-medium mt-1 leading-relaxed">
                Master math, explore 195 countries, learn space science, and grow
                with streaks, XP, and parent-friendly progress tools.
              </p>
              <div className="flex flex-wrap gap-2 mt-3">
                {["Math fluency", "Geography", "Science", "Safe & ad-free"].map(
                  (tag) => (
                    <span
                      key={tag}
                      className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-ink/[0.05] text-ink/70"
                    >
                      {tag}
                    </span>
                  )
                )}
              </div>
            </div>
          </div>
        </motion.section>

        {/* Grown-ups */}
        <motion.div {...fadeUp(6, reduce)}>
          <Link
            to="/settings"
            className="flex items-center justify-between px-4 py-3.5 rounded-2xl bg-ink/[0.04] hover:bg-ink/[0.06] transition focus-ring"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white grid place-items-center ring-1 ring-ink/[0.08]">
                <Settings size={18} className="text-ink/70" />
              </div>
              <div>
                <p className="font-display font-extrabold text-sm text-ink">
                  {role === "teacher" ? "Teacher dashboard" : "Parent dashboard"}
                </p>
                <p className="text-xs font-medium text-ink/50">
                  Progress · PIN · classrooms
                </p>
              </div>
            </div>
            <ChevronRight size={18} className="text-ink/30" />
          </Link>
        </motion.div>

        <footer className="text-center pb-4 pt-1">
          <div className="flex justify-center gap-4 text-xs font-semibold text-ink/40">
            <Link to="/about" className="hover:text-primary focus-ring rounded">
              Our story
            </Link>
            <Link to="/impact" className="hover:text-primary focus-ring rounded">
              Mission
            </Link>
            <Link to="/privacy" className="hover:text-primary focus-ring rounded">
              Privacy
            </Link>
          </div>
        </footer>
      </div>
    </div>
  );
}

function SectionTitle({ children, action }) {
  return (
    <div className="flex items-center justify-between mb-3">
      <h2 className="font-display text-lg font-extrabold text-ink tracking-tight">
        {children}
      </h2>
      {action}
    </div>
  );
}

function PickCard({ to, icon, title, sub, gradient, dark, done, onClick }) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className={`snap-start shrink-0 w-[148px] rounded-3xl p-4 flex flex-col gap-2 focus-ring transition hover:scale-[1.02] active:scale-[0.98] bg-gradient-to-br ${gradient} ${
        dark ? "text-white" : "text-ink"
      } ${done ? "opacity-75" : "shadow-[0_4px_20px_rgba(45,48,71,0.08)]"}`}
    >
      <span className="text-3xl leading-none" aria-hidden>
        {icon}
      </span>
      <div>
        <p
          className={`font-display font-extrabold text-[15px] leading-tight ${
            dark ? "text-white" : "text-ink"
          }`}
        >
          {title}
        </p>
        <p
          className={`text-xs font-medium mt-1 leading-snug ${
            dark ? "text-white/70" : "text-ink/55"
          }`}
        >
          {sub}
        </p>
      </div>
    </Link>
  );
}

function SubjectTile({ subject, ageGroup, lessonProgress, onClick }) {
  const stats = useMemo(
    () => subjectProgress(subject.id, ageGroup, lessonProgress),
    [subject.id, ageGroup, lessonProgress]
  );
  const next = useMemo(
    () => findNextLesson(subject.id, ageGroup, lessonProgress),
    [subject.id, ageGroup, lessonProgress]
  );
  const theme = SUBJECT_THEMES[subject.id] ?? {
    gradient: "from-gray-100 to-white",
    accent: "#2D3047",
    emoji: "✨",
  };
  const pct = Math.round(stats.masteryPct * 100);

  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileTap={{ scale: 0.98 }}
      className={`text-left rounded-3xl p-4 bg-gradient-to-br ${theme.gradient} ring-1 ring-ink/[0.06] focus-ring hover:shadow-md transition-shadow`}
    >
      <div className="flex items-center justify-between">
        <span className="text-3xl" aria-hidden>
          {theme.emoji}
        </span>
        <span
          className="text-xs font-extrabold tabular-nums px-2 py-0.5 rounded-full bg-white/80"
          style={{ color: theme.accent }}
        >
          {pct}%
        </span>
      </div>
      <p
        className="font-display font-extrabold text-[15px] mt-2 leading-tight"
        style={{ color: theme.accent }}
      >
        {subject.name}
      </p>
      <p className="text-[11px] font-semibold text-ink/50 mt-0.5">
        {subject.tagline}
      </p>
      <div className="h-1.5 rounded-full bg-ink/[0.08] mt-3 overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${pct}%`, backgroundColor: theme.accent }}
        />
      </div>
      {next && (
        <p className="text-[10px] font-medium text-ink/45 mt-2 line-clamp-1">
          Next: {next.title}
        </p>
      )}
    </motion.button>
  );
}

function AssignmentsBanner({ assignments }) {
  return (
    <div className="rounded-3xl bg-amber-50/90 ring-1 ring-amber-200/60 px-4 py-3.5">
      <div className="flex items-center gap-2 mb-2">
        <ClipboardList size={16} className="text-amber-700" />
        <span className="font-display text-sm font-extrabold text-amber-900">
          From your teacher
        </span>
      </div>
      <ul className="space-y-2">
        {assignments.slice(0, 3).map((a) => (
          <li
            key={a.id}
            className="text-sm font-semibold text-amber-900/85 flex justify-between gap-2"
          >
            <span className="truncate">{a.title}</span>
            {a.dueDate && (
              <span className="text-amber-700/70 shrink-0 text-xs">
                Due {a.dueDate}
              </span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
