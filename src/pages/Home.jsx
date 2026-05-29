import { Link, useNavigate } from "react-router-dom";
import { useMemo } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  BarChart3,
  BookOpen,
  ChevronRight,
  ClipboardList,
  Compass,
  PencilLine,
  Play,
  Settings,
  ShieldCheck,
  Sparkles,
  Trophy,
  Users,
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
  { to: "/review", label: "Review", Icon: ClipboardList },
];

const FEATURE_ORBITS = [
  { Icon: Sparkles, title: "Fun quests", desc: "Short adventures kids actually want to finish." },
  { Icon: BookOpen, title: "Smart learning", desc: "Math, geography, science, and more in one place." },
  { Icon: Users, title: "Family ready", desc: "Parents and teachers see progress at a glance." },
  { Icon: Trophy, title: "Play together", desc: "Challenges, reviews, and wins that build confidence." },
];

const fadeUp = (i, reduce) =>
  reduce
    ? {}
    : {
        initial: { opacity: 0, y: 14 },
        animate: { opacity: 1, y: 0 },
        transition: { delay: i * 0.06, duration: 0.4, ease: [0.22, 1, 0.36, 1] },
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
    <div className="home-page flex min-h-full flex-col pb-2">
      <section className="relative overflow-hidden bg-gradient-to-br from-primary via-[#ff9348] to-[#3A86FF] px-4 pt-5 pb-12 sm:pb-14">
        <div
          className="pointer-events-none absolute inset-0 opacity-50"
          aria-hidden
          style={{
            backgroundImage:
              "radial-gradient(circle at 14% 18%, rgba(255,255,255,0.85) 0%, transparent 36%), radial-gradient(circle at 82% 12%, rgba(255,230,109,0.65) 0%, transparent 38%)",
          }}
        />
        <div className="home-hero-wave" aria-hidden />
        <motion.div className="relative mx-auto max-w-2xl" {...fadeUp(0, reduce)}>
          <p className="inline-flex items-center gap-2 rounded-full bg-white/20 px-3 py-1 text-xs font-extrabold uppercase tracking-wide text-white ring-1 ring-white/30">
            <span aria-hidden>🎒</span> KidQuest · Study is fun
          </p>
          <h1 className="mt-3 font-display text-[2rem] font-extrabold leading-[1.05] tracking-tight text-white sm:text-[2.5rem]">
            {isFirstTime
              ? `Welcome, ${kidName || "Explorer"}!`
              : `Hi ${kidName || "Explorer"} — let’s learn!`}
          </h1>
          <p className="mt-3 max-w-[34rem] text-[15px] font-semibold leading-snug text-white/95 sm:text-base">
            Joyful learning adventures for kids, with streaks, mastery, and parent-friendly progress you can trust.
          </p>
          <p className="mt-1 text-sm font-bold text-white/80">
            {theme.emoji} {theme.name} theme this month
          </p>

          <div className="mt-4 flex flex-wrap gap-2.5">
            <Chip>{level.emoji} Level {level.level}</Chip>
            <Chip>🔥 {currentStreak} day streak</Chip>
            <Chip>⚡ {xpToday} XP today</Chip>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-[1.1fr_0.9fr]">
            <button
              type="button"
              onClick={() => navigate(nextAction ? nextAction.path : "/multiplication")}
              className="group rounded-3xl bg-[#3A86FF] px-4 py-4 text-left text-white shadow-[0_10px_0_rgba(25,70,140,0.35)] transition hover:translate-y-[-1px] focus-ring"
              aria-label={nextAction ? "Continue your next lesson" : "Start learning now"}
            >
              <p className="text-xs font-bold uppercase tracking-wide text-white/85">
                {nextAction ? "Continue your quest" : "Try now"}
              </p>
              <p className="mt-1 font-display text-lg font-extrabold leading-tight text-white">
                {nextAction ? nextAction.lesson.title : "Begin with multiplication"}
              </p>
              <p className="mt-1 text-sm font-medium text-white/80">
                {nextAction ? nextAction.subject.name : "Fast wins with tables and games"}
              </p>
              <span className="mt-3 inline-flex items-center gap-1.5 text-sm font-bold text-white">
                Jump in <ArrowRight size={16} className="transition group-hover:translate-x-0.5" />
              </span>
            </button>

            <div className="rounded-3xl bg-white p-4 text-ink shadow-[0_10px_30px_rgba(17,17,35,0.12)] ring-2 ring-white/50">
              <div className="flex items-center justify-between text-xs font-bold text-ink/60">
                <span>Today&apos;s goal</span>
                <span>
                  {lessonsDone}/{dailyGoal} lessons
                </span>
              </div>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-ink/10">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-secondary to-accent"
                  initial={{ width: 0 }}
                  animate={{ width: `${goalPct}%` }}
                  transition={{ duration: 0.7, ease: "easeOut" }}
                />
              </div>
              <p className="mt-3 text-sm font-semibold text-ink/80">
                {goalPct >= 100 ? "You crushed today’s goal!" : `${goalPct}% complete. Keep going!`}
              </p>
            </div>
          </div>
        </motion.div>
      </section>

      <div className="sticky top-0 z-20 border-b border-ink/[0.06] bg-[#f3f4f8]/90 px-4 py-2.5 backdrop-blur-lg">
        <div className="mx-auto flex max-w-2xl gap-2 overflow-x-auto scrollbar-none">
          {QUICK_NAV.map(({ to, label, Icon, active }) => (
            <Link
              key={to}
              to={to}
              className={`inline-flex shrink-0 items-center gap-2 rounded-2xl px-4 py-2.5 text-sm font-bold transition focus-ring ${
                active
                  ? "bg-ink text-white shadow-md"
                  : "bg-white text-ink/75 ring-1 ring-ink/[0.08] hover:bg-ink/[0.03]"
              }`}
              aria-label={`Go to ${label}`}
            >
              <Icon size={16} strokeWidth={2.5} />
              {label}
            </Link>
          ))}
        </div>
      </div>

      <main className="mx-auto flex w-full max-w-2xl flex-col gap-5 px-4 py-5">
        <motion.section {...fadeUp(1, reduce)}>
          <SectionTitle>What makes KidQuest special</SectionTitle>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {FEATURE_ORBITS.map(({ Icon, title, desc }) => (
              <FeatureOrbit key={title} Icon={Icon} title={title} desc={desc} />
            ))}
          </div>
        </motion.section>

        <motion.section
          className="home-card bg-gradient-to-br from-[#fff9e7] via-white to-[#f2f4ff] p-4 sm:p-5"
          {...fadeUp(2, reduce)}
        >
          <SectionTitle>Growing learner community</SectionTitle>
          <div className="grid gap-4 sm:grid-cols-[1.1fr_0.9fr]">
            <div>
              <p className="text-sm font-medium leading-relaxed text-ink/70">
                Kids build confidence through short daily wins, while parents and teachers can track
                healthy learning habits over time.
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <TrustTag icon={<Users size={13} />} label="Family + classroom ready" />
                <TrustTag icon={<ShieldCheck size={13} />} label="Safe, guided experience" />
                <TrustTag icon={<BarChart3 size={13} />} label="Progress insights" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <ImpactStat label="Subjects" value={`${SUBJECTS.length}`} />
              <ImpactStat label="XP Today" value={`${xpToday}`} />
              <ImpactStat label="Reviews Due" value={`${dueReviews}`} />
              <ImpactStat label="Current Streak" value={`${currentStreak}d`} />
            </div>
          </div>
        </motion.section>

        <motion.section {...fadeUp(3, reduce)}>
          <SectionTitle
            action={
              <button
                type="button"
                onClick={() => navigate("/explore")}
                className="flex items-center gap-0.5 rounded-lg px-1 text-sm font-bold text-primary focus-ring"
              >
                See all <ChevronRight size={16} />
              </button>
            }
          >
            Discover your next adventure
          </SectionTitle>
          <div className="grid grid-cols-2 gap-3">
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

        <motion.section {...fadeUp(4, reduce)}>
          <SectionTitle
            action={
              <Link to="/compete" className="flex items-center gap-0.5 rounded-lg px-1 text-sm font-bold text-primary focus-ring">
                Open hub <ChevronRight size={16} />
              </Link>
            }
          >
            Spotlight challenges
          </SectionTitle>
          <div className="flex snap-x snap-mandatory gap-3 overflow-x-auto -mx-4 px-4 pb-1 scrollbar-none">
            <SpotlightCard
              to={daily.path}
              icon={daily.emoji}
              title={dailyDone ? "Daily challenge done" : daily.title}
              sub={dailyDone ? "Come back tomorrow for a new quest" : `Earn +${daily.xpBonus} XP bonus`}
              gradient="from-[#fff0bf] to-[#ffe8a1]"
              onClick={() => {
                if (!dailyDone) {
                  completeDailyChallenge(daily.dateKey);
                  grantXP(daily.xpBonus);
                }
              }}
            />
            <SpotlightCard
              to="/multiplication/speed-run"
              icon="⚡"
              title="Speed Run"
              sub={bestSpeedRun ? `Best ${formatMs(bestSpeedRun.totalTimeMs)}` : "50 questions against the clock"}
              gradient="from-slate-900 to-slate-700"
              dark
            />
            <SpotlightCard
              to={dueReviews > 0 ? "/review" : "/explore"}
              icon={dueReviews > 0 ? "🧠" : "🧭"}
              title={dueReviews > 0 ? "Review mission" : "Explore mission"}
              sub={dueReviews > 0 ? `${mulDue} math · ${geoDue} geo ready` : "Try maps, trivia, and more"}
              gradient="from-[#ece6ff] to-[#e4ecff]"
            />
            <SpotlightCard
              to="/create"
              icon="🎨"
              title="Create mode"
              sub="Build your own quiz adventure"
              gradient="from-[#dff9f4] to-[#dff1ff]"
            />
          </div>
        </motion.section>

        {assignments.length > 0 && (
          <motion.div {...fadeUp(5, reduce)}>
            <AssignmentsBanner assignments={assignments} />
          </motion.div>
        )}

        <motion.section {...fadeUp(6, reduce)} className="space-y-2">
          {showAdmin && (
            <Link
              to="/admin"
              className="flex items-center justify-between rounded-2xl bg-ink px-4 py-3.5 text-white transition focus-ring"
            >
              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-white/15">
                  <Sparkles size={18} />
                </div>
                <div>
                  <p className="font-display text-sm font-extrabold">Admin</p>
                  <p className="text-xs font-medium text-white/70">Users, feedback & password help</p>
                </div>
              </div>
              <ChevronRight size={18} className="text-white/50" />
            </Link>
          )}
          <Link
            to="/settings"
            className="flex items-center justify-between rounded-2xl bg-ink/[0.04] px-4 py-3.5 transition hover:bg-ink/[0.06] focus-ring"
          >
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-white ring-1 ring-ink/[0.08]">
                <Settings size={18} className="text-ink/70" />
              </div>
              <div>
                <p className="font-display text-sm font-extrabold text-ink">
                  {role === "teacher" ? "Teacher dashboard" : "Parent dashboard"}
                </p>
                <p className="text-xs font-medium text-ink/50">Progress · PIN · classrooms</p>
              </div>
            </div>
            <ChevronRight size={18} className="text-ink/30" />
          </Link>
        </motion.section>

        <footer className="pb-4 pt-1 text-center">
          <div className="flex justify-center gap-4 text-xs font-semibold text-ink/40">
            <Link to="/about" className="rounded hover:text-primary focus-ring">
              Our story
            </Link>
            <Link to="/impact" className="rounded hover:text-primary focus-ring">
              Mission
            </Link>
            <Link to="/privacy" className="rounded hover:text-primary focus-ring">
              Privacy
            </Link>
          </div>
        </footer>
      </main>
    </div>
  );
}

function SectionTitle({ children, action }) {
  return (
    <div className="mb-3 flex items-center justify-between">
      <h2 className="font-display text-lg font-extrabold tracking-tight text-ink">{children}</h2>
      {action}
    </div>
  );
}

function Chip({ children }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-white/20 px-3 py-1.5 text-xs font-bold text-white backdrop-blur-sm">
      {children}
    </span>
  );
}

function FeatureOrbit({ Icon, title, desc }) {
  return (
    <article className="text-center">
      <div className="home-feature-orbit">
        <Icon size={26} strokeWidth={2.25} />
      </div>
      <h3 className="mt-3 font-display text-sm font-extrabold text-ink">{title}</h3>
      <p className="mt-1 text-[11px] font-semibold leading-snug text-ink/60">{desc}</p>
    </article>
  );
}

function TrustTag({ icon, label }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-ink/[0.06] px-2.5 py-1 text-[11px] font-bold text-ink/75">
      {icon}
      {label}
    </span>
  );
}

function ImpactStat({ label, value }) {
  return (
    <div className="rounded-2xl bg-white p-3 text-center ring-1 ring-ink/[0.07]">
      <p className="font-display text-lg font-extrabold text-ink">{value}</p>
      <p className="text-[11px] font-semibold uppercase tracking-wide text-ink/55">{label}</p>
    </div>
  );
}

function SpotlightCard({ to, icon, title, sub, gradient, onClick, dark }) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className={`snap-start shrink-0 w-[170px] rounded-3xl p-4 transition hover:scale-[1.02] active:scale-[0.98] focus-ring bg-gradient-to-br ${gradient} ${
        dark ? "text-white" : "text-ink"
      }`}
    >
      <span className="text-3xl leading-none" aria-hidden>
        {icon}
      </span>
      <p className={`mt-2 font-display text-[15px] font-extrabold leading-tight ${dark ? "text-white" : "text-ink"}`}>
        {title}
      </p>
      <p className={`mt-1 text-xs font-medium leading-snug ${dark ? "text-white/70" : "text-ink/60"}`}>{sub}</p>
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
      className={`rounded-3xl bg-gradient-to-br ${theme.gradient} p-4 text-left ring-1 ring-ink/[0.06] transition-shadow hover:shadow-md focus-ring`}
      aria-label={`Open ${subject.name}`}
    >
      <div className="flex items-center justify-between">
        <span className="text-3xl" aria-hidden>
          {theme.emoji}
        </span>
        <span
          className="rounded-full bg-white/80 px-2 py-0.5 text-xs font-extrabold tabular-nums"
          style={{ color: theme.accent }}
        >
          {pct}%
        </span>
      </div>
      <p className="mt-2 font-display text-[15px] font-extrabold leading-tight" style={{ color: theme.accent }}>
        {subject.name}
      </p>
      <p className="mt-0.5 text-[11px] font-semibold text-ink/55">{subject.tagline}</p>
      <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-ink/[0.08]">
        <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct}%`, backgroundColor: theme.accent }} />
      </div>
      {next && <p className="mt-2 line-clamp-1 text-[10px] font-medium text-ink/45">Next: {next.title}</p>}
    </motion.button>
  );
}

function AssignmentsBanner({ assignments }) {
  return (
    <div className="rounded-3xl bg-amber-50/90 px-4 py-3.5 ring-1 ring-amber-200/60">
      <div className="mb-2 flex items-center gap-2">
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
