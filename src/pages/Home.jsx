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
  Settings,
  Sparkles,
  Trophy,
} from "lucide-react";
import { useAppStore } from "../store/useAppStore";
import { useAuthStore } from "../store/useAuthStore";
import { isAdminUser } from "../lib/adminAccess";
import { SUBJECTS } from "../data/subjects";
import { subjectProgress, findNextLesson } from "../utils/content";
import { getMonthlyTheme } from "../utils/theme";
import { useMultiplicationStore } from "../store/useMultiplicationStore";
import { useGeographyStore } from "../store/useGeographyStore";
import { formatMs } from "../utils/multiplicationScoring";
import { useAssignments } from "../hooks/useAssignments";
import { getDailyChallenge } from "../utils/dailyChallenge";
import { xpToNextLevel } from "../utils/scoring";
import { Mascot } from "../components/mascots/Mascot";
import { Avatar } from "../components/mascots/Avatar";

const SUBJECT_THEMES = {
  geography: { bg: "#E8F8F4", accent: "#0F6E56", emoji: "🌍" },
  history: { bg: "#FFF4E0", accent: "#854F0B", emoji: "📜" },
  math: { bg: "#EAF3FF", accent: "#185FA5", emoji: "🔢" },
  music: { bg: "#F3EBFF", accent: "#534AB7", emoji: "🎵" },
  "solar-system": { bg: "#FFEDE8", accent: "#993C1D", emoji: "🪐" },
  "general-knowledge": { bg: "#EFFBE8", accent: "#3B6D11", emoji: "💡" },
  trivia: { bg: "#FFE8EC", accent: "#B7273A", emoji: "⭐" },
};

const HUB_LINKS = [
  { to: "/explore", label: "Explore", Icon: Compass, color: "bg-sky-100 text-sky-800" },
  { to: "/create", label: "Create", Icon: PencilLine, color: "bg-violet-100 text-violet-800" },
  { to: "/compete", label: "Compete", Icon: Trophy, color: "bg-amber-100 text-amber-900" },
  { to: "/review", label: "Review", Icon: BookOpen, color: "bg-emerald-100 text-emerald-800" },
];

const pop = (i, reduce) =>
  reduce
    ? {}
    : {
        initial: { opacity: 0, scale: 0.96, y: 12 },
        animate: { opacity: 1, scale: 1, y: 0 },
        transition: { delay: i * 0.05, duration: 0.45, ease: [0.22, 1, 0.36, 1] },
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
  const profile = useAuthStore((s) => s.profile);
  const user = useAuthStore((s) => s.user);
  const showAdmin = isAdminUser({
    profile,
    email: user?.email ?? profile?.email,
  });

  const {
    kidName,
    role,
    ageGroup,
    avatarConfig,
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
  const lessonsDone = lessonsToday?.date === todayKey() ? lessonsToday.count : 0;
  const goalPct = Math.min(100, Math.round((lessonsDone / Math.max(1, dailyGoal)) * 100));
  const level = xpToNextLevel(totalXP);

  return (
    <div className="home-hub min-h-full w-full pb-6">
      <div className="mx-auto flex w-full max-w-md flex-col items-center gap-5 px-4 py-5 sm:py-6">
        {/* Hero — everything centered */}
        <motion.section className="home-panel w-full text-center" {...pop(0, reduce)}>
          <div className="relative mx-auto mb-4 flex h-24 w-24 items-center justify-center">
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary/20 via-accent/30 to-secondary/25 animate-[floaty_4s_ease-in-out_infinite]" />
            <div className="relative grid h-20 w-20 place-items-center overflow-hidden rounded-full bg-white shadow-lg ring-4 ring-white">
              {avatarConfig ? (
                <Avatar config={avatarConfig} size={72} />
              ) : (
                <Mascot kind="owl" size={64} />
              )}
            </div>
            <span className="absolute -right-1 -top-1 grid h-9 w-9 place-items-center rounded-full bg-accent text-lg shadow-md ring-2 ring-white">
              {level.emoji}
            </span>
          </div>

          <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-primary">
            {theme.emoji} {theme.name}
          </p>
          <h1 className="mt-2 font-display text-[1.85rem] font-extrabold leading-tight text-ink sm:text-[2.1rem]">
            {isFirstTime ? `Hey ${kidName || "Explorer"}!` : `Welcome back, ${kidName || "Explorer"}!`}
          </h1>
          <p className="mx-auto mt-2 max-w-[18rem] text-sm font-semibold leading-relaxed text-ink/65">
            Learn, play, and grow — with a little help from your family along the way.
          </p>

          <div className="mt-5 grid grid-cols-3 gap-2">
            <StatBubble label="Level" value={level.level} />
            <StatBubble label="Streak" value={`${currentStreak}🔥`} />
            <StatBubble label="XP today" value={xpToday} />
          </div>

          <div className="mt-5 rounded-2xl bg-ink/[0.04] px-4 py-3">
            <div className="flex items-center justify-between text-xs font-bold text-ink/55">
              <span>Daily goal</span>
              <span>
                {lessonsDone}/{dailyGoal} lessons
              </span>
            </div>
            <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-white">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-primary to-secondary"
                initial={{ width: 0 }}
                animate={{ width: `${goalPct}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              />
            </div>
          </div>

          <button
            type="button"
            onClick={() => navigate(nextAction ? nextAction.path : "/multiplication")}
            className="home-cta mt-5 w-full focus-ring"
          >
            <span className="block text-xs font-bold uppercase tracking-wide text-white/90">
              {nextAction ? "Continue learning" : "Start your adventure"}
            </span>
            <span className="mt-1 block font-display text-xl font-extrabold text-white">
              {nextAction ? nextAction.lesson.title : "Jump into Math"}
            </span>
            <span className="mt-2 inline-flex items-center gap-1 text-sm font-bold text-white/95">
              Let&apos;s go <ArrowRight size={16} />
            </span>
          </button>
        </motion.section>

        {/* Quick hubs */}
        <motion.section className="home-panel w-full" {...pop(1, reduce)}>
          <h2 className="text-center font-display text-base font-extrabold text-ink">Where to next?</h2>
          <div className="mt-4 grid grid-cols-2 gap-2.5">
            {HUB_LINKS.map(({ to, label, Icon, color }) => (
              <Link
                key={to}
                to={to}
                className={`flex flex-col items-center gap-2 rounded-2xl px-3 py-4 transition hover:scale-[1.02] active:scale-[0.98] focus-ring ${color}`}
              >
                <Icon size={22} strokeWidth={2.5} />
                <span className="font-display text-sm font-extrabold">{label}</span>
              </Link>
            ))}
          </div>
        </motion.section>

        {/* Subjects */}
        <motion.section className="home-panel w-full" {...pop(2, reduce)}>
          <div className="mb-4 text-center">
            <h2 className="font-display text-base font-extrabold text-ink">Pick a subject</h2>
            <p className="mt-1 text-xs font-semibold text-ink/50">Tap a world to explore</p>
          </div>
          <div className="grid grid-cols-2 gap-2.5">
            {SUBJECTS.map((s) => (
              <SubjectTile
                key={s.id}
                subject={s}
                ageGroup={ageGroup}
                lessonProgress={lessonProgress}
                onClick={() => navigate(s.id === "math" ? "/multiplication" : `/subject/${s.id}`)}
              />
            ))}
          </div>
        </motion.section>

        {/* Play today */}
        <motion.section className="home-panel w-full" {...pop(3, reduce)}>
          <h2 className="text-center font-display text-base font-extrabold text-ink">Play today</h2>
          <div className="mt-4 flex snap-x snap-mandatory gap-3 overflow-x-auto pb-1 scrollbar-none">
            <MiniQuest
              to={daily.path}
              emoji={daily.emoji}
              title={dailyDone ? "Daily done!" : daily.title}
              sub={dailyDone ? "See you tomorrow" : `+${daily.xpBonus} XP`}
              tint="from-amber-100 to-yellow-50"
              onClick={() => {
                if (!dailyDone) {
                  completeDailyChallenge(daily.dateKey);
                  grantXP(daily.xpBonus);
                }
              }}
            />
            <MiniQuest
              to="/multiplication/speed-run"
              emoji="⚡"
              title="Speed run"
              sub={bestSpeedRun ? formatMs(bestSpeedRun.totalTimeMs) : "Beat the clock"}
              tint="from-slate-800 to-slate-600"
              dark
            />
            <MiniQuest
              to={dueReviews > 0 ? "/review" : "/explore"}
              emoji={dueReviews > 0 ? "🧠" : "🧭"}
              title={dueReviews > 0 ? "Review time" : "Explore"}
              sub={dueReviews > 0 ? `${dueReviews} ready` : "Discover more"}
              tint="from-violet-100 to-indigo-50"
            />
          </div>
        </motion.section>

        {assignments.length > 0 && (
          <motion.div className="home-panel w-full" {...pop(4, reduce)}>
            <AssignmentsBanner assignments={assignments} />
          </motion.div>
        )}

        {/* Grown-ups + thank you — centered */}
        <motion.section className="w-full space-y-2 text-center" {...pop(5, reduce)}>
          {showAdmin && (
            <Link
              to="/admin"
              className="home-panel flex items-center justify-between px-4 py-3.5 text-left transition hover:scale-[1.01] focus-ring"
            >
              <div className="flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-2xl bg-ink text-white">
                  <Sparkles size={18} />
                </span>
                <div>
                  <p className="font-display text-sm font-extrabold text-ink">Admin</p>
                  <p className="text-xs font-medium text-ink/50">Approvals & feedback</p>
                </div>
              </div>
              <ChevronRight size={18} className="text-ink/30" />
            </Link>
          )}
          <Link
            to="/settings"
            className="home-panel flex items-center justify-between px-4 py-3.5 text-left transition hover:scale-[1.01] focus-ring"
          >
            <div className="flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-2xl bg-primary/10 text-primary">
                <Settings size={18} />
              </span>
              <div>
                <p className="font-display text-sm font-extrabold text-ink">
                  {role === "teacher" ? "Teacher space" : "Parent space"}
                </p>
                <p className="text-xs font-medium text-ink/50">Progress & settings</p>
              </div>
            </div>
            <ChevronRight size={18} className="text-ink/30" />
          </Link>

          <div className="home-panel px-5 py-6">
            <p className="font-display text-lg font-extrabold text-ink">Thanks for learning with us!</p>
            <p className="mx-auto mt-2 max-w-[16rem] text-sm font-semibold leading-relaxed text-ink/55">
              Every quest you finish helps KidQuest get better for kids and families everywhere.
            </p>
            <p className="mt-3 text-2xl" aria-hidden>
              💛✨🎒
            </p>
          </div>

          <footer className="flex justify-center gap-4 pb-2 pt-1 text-xs font-semibold text-ink/40">
            <Link to="/about" className="rounded hover:text-primary focus-ring">
              Our story
            </Link>
            <Link to="/impact" className="rounded hover:text-primary focus-ring">
              Mission
            </Link>
            <Link to="/privacy" className="rounded hover:text-primary focus-ring">
              Privacy
            </Link>
          </footer>
        </motion.section>
      </div>
    </div>
  );
}

function StatBubble({ label, value }) {
  return (
    <div className="rounded-2xl bg-ink/[0.04] px-2 py-3">
      <p className="font-display text-lg font-extrabold tabular-nums text-ink">{value}</p>
      <p className="mt-0.5 text-[10px] font-bold uppercase tracking-wide text-ink/45">{label}</p>
    </div>
  );
}

function SubjectTile({ subject, ageGroup, lessonProgress, onClick }) {
  const stats = useMemo(
    () => subjectProgress(subject.id, ageGroup, lessonProgress),
    [subject.id, ageGroup, lessonProgress]
  );
  const theme = SUBJECT_THEMES[subject.id] ?? { bg: "#F5F5F5", accent: "#2D3047", emoji: "✨" };
  const pct = Math.round(stats.masteryPct * 100);

  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileTap={{ scale: 0.97 }}
      className="flex flex-col items-center rounded-2xl p-3.5 text-center transition hover:scale-[1.02] focus-ring"
      style={{ backgroundColor: theme.bg }}
      aria-label={`Open ${subject.name}`}
    >
      <span className="text-3xl" aria-hidden>
        {theme.emoji}
      </span>
      <p className="mt-2 font-display text-sm font-extrabold" style={{ color: theme.accent }}>
        {subject.name}
      </p>
      <p className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-white/70">
        <span
          className="block h-full rounded-full transition-all"
          style={{ width: `${pct}%`, backgroundColor: theme.accent }}
        />
      </p>
      <p className="mt-1 text-[10px] font-bold text-ink/45">{pct}% mastered</p>
    </motion.button>
  );
}

function MiniQuest({ to, emoji, title, sub, tint, onClick, dark }) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className={`snap-center shrink-0 w-[9.5rem] rounded-2xl bg-gradient-to-br ${tint} p-3.5 text-center transition hover:scale-[1.03] active:scale-[0.98] focus-ring ${
        dark ? "text-white" : "text-ink"
      }`}
    >
      <span className="text-2xl" aria-hidden>
        {emoji}
      </span>
      <p className={`mt-2 font-display text-sm font-extrabold leading-tight ${dark ? "text-white" : "text-ink"}`}>
        {title}
      </p>
      <p className={`mt-1 text-[11px] font-semibold ${dark ? "text-white/75" : "text-ink/55"}`}>{sub}</p>
    </Link>
  );
}

function AssignmentsBanner({ assignments }) {
  return (
    <div className="text-left">
      <div className="mb-2 flex items-center justify-center gap-2 sm:justify-start">
        <ClipboardList size={16} className="text-amber-700" />
        <span className="font-display text-sm font-extrabold text-amber-900">From your teacher</span>
      </div>
      <ul className="space-y-2">
        {assignments.slice(0, 3).map((a) => (
          <li key={a.id} className="flex justify-between gap-2 text-sm font-semibold text-amber-900/85">
            <span className="truncate">{a.title}</span>
            {a.dueDate && <span className="shrink-0 text-xs text-amber-700/70">Due {a.dueDate}</span>}
          </li>
        ))}
      </ul>
    </div>
  );
}
