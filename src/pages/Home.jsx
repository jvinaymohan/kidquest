import { Link, useNavigate } from "react-router-dom";
import { useMemo } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Play, Settings, Sparkles } from "lucide-react";
import { useAppStore } from "../store/useAppStore";
import { useAuthStore } from "../store/useAuthStore";
import { isAdminUser } from "../lib/adminAccess";
import { SUBJECTS } from "../data/subjects";
import { findNextLesson } from "../utils/content";
import { getMonthlyTheme } from "../utils/theme";
import { useMultiplicationStore } from "../store/useMultiplicationStore";
import { useGeographyStore } from "../store/useGeographyStore";
import { getDailyChallenge } from "../utils/dailyChallenge";
import { xpToNextLevel } from "../utils/scoring";
import { Mascot } from "../components/mascots/Mascot";
import { Avatar } from "../components/mascots/Avatar";

const WORLD = {
  geography: { emoji: "🌍", from: "#34d399", to: "#0d9488", glow: "rgba(52,211,153,0.35)" },
  history: { emoji: "📜", from: "#fbbf24", to: "#d97706", glow: "rgba(251,191,36,0.35)" },
  math: { emoji: "🔢", from: "#60a5fa", to: "#2563eb", glow: "rgba(96,165,250,0.35)" },
  music: { emoji: "🎵", from: "#c084fc", to: "#7c3aed", glow: "rgba(192,132,252,0.35)" },
  "solar-system": { emoji: "🪐", from: "#fb923c", to: "#ea580c", glow: "rgba(251,146,60,0.35)" },
  "general-knowledge": { emoji: "💡", from: "#a3e635", to: "#65a30d", glow: "rgba(163,230,53,0.35)" },
  trivia: { emoji: "⭐", from: "#f472b6", to: "#db2777", glow: "rgba(244,114,182,0.35)" },
};

const ORBS = [
  { to: "/explore", emoji: "🧭", label: "Explore" },
  { to: "/create", emoji: "🎨", label: "Create" },
  { to: "/compete", emoji: "🏆", label: "Compete" },
  { to: "/review", emoji: "🧠", label: "Review" },
];

const slide = (i, reduce) =>
  reduce
    ? {}
    : {
        initial: { opacity: 0, y: 24 },
        animate: { opacity: 1, y: 0 },
        transition: { delay: 0.08 + i * 0.06, duration: 0.5, ease: [0.22, 1, 0.36, 1] },
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
  const showAdmin = isAdminUser({ profile, email: user?.email ?? profile?.email });

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
  const theme = getMonthlyTheme();
  const daily = useMemo(() => getDailyChallenge(), []);
  const dailyDone = dailyChallengeDone === daily.dateKey;
  const nextAction = useMemo(
    () => pickNextAction(ageGroup, lessonProgress),
    [ageGroup, lessonProgress]
  );
  const xpToday = sumTodayXP(learnXPDaily);
  const lessonsDone = lessonsToday?.date === todayKey() ? lessonsToday.count : 0;
  const goalPct = Math.min(100, Math.round((lessonsDone / Math.max(1, dailyGoal)) * 100));
  const level = xpToNextLevel(totalXP);

  const playPath = nextAction?.path ?? "/multiplication";
  const playTitle = nextAction?.lesson.title ?? "Math Adventure";

  return (
    <div className="home-v2 relative min-h-full overflow-hidden pb-8">
      {/* Decorative sky blobs */}
      <div className="home-v2-blob home-v2-blob-a" aria-hidden />
      <div className="home-v2-blob home-v2-blob-b" aria-hidden />
      <div className="home-v2-stars" aria-hidden />

      <div className="relative mx-auto flex w-full max-w-lg flex-col items-center px-4 pt-4">
        {/* Game HUD */}
        <motion.header className="flex w-full items-center gap-2" {...slide(0, reduce)}>
          <Link
            to="/profile"
            className="flex shrink-0 items-center gap-2 rounded-2xl bg-white/90 px-2 py-1.5 shadow-md ring-2 ring-white focus-ring"
          >
            <span className="grid h-10 w-10 place-items-center overflow-hidden rounded-xl bg-gradient-to-br from-accent/40 to-primary/30">
              {avatarConfig ? <Avatar config={avatarConfig} size={36} /> : <Mascot kind="owl" size={32} animate={false} />}
            </span>
            <span className="hidden min-w-0 sm:block">
              <span className="block truncate font-display text-sm font-extrabold text-ink">{kidName || "Explorer"}</span>
              <span className="block text-[10px] font-bold text-ink/50">Lvl {level.level}</span>
            </span>
          </Link>

          <div className="flex flex-1 justify-center gap-2">
            <HudPill emoji="🔥" value={currentStreak} label="streak" />
            <HudPill emoji="⚡" value={xpToday} label="XP" />
          </div>

          <Link
            to="/settings"
            className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-white/90 text-ink/60 shadow-md ring-2 ring-white focus-ring"
            aria-label="Settings"
          >
            <Settings size={20} />
          </Link>
        </motion.header>

        {/* Hero — centered adventure launch */}
        <motion.section className="mt-6 w-full text-center" {...slide(1, reduce)}>
          <p className="home-v2-badge mx-auto">
            {theme.emoji} {theme.name}
          </p>

          <div className="relative mx-auto mt-5 flex h-36 w-36 items-center justify-center">
            <motion.div
              className="absolute inset-0 rounded-full bg-gradient-to-br from-[#ffe066] via-[#ff9f43] to-[#ff6b6b] opacity-90 blur-sm"
              animate={reduce ? undefined : { scale: [1, 1.06, 1], rotate: [0, 4, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            />
            <div className="relative z-10 grid h-28 w-28 place-items-center rounded-full bg-white shadow-[0_12px_40px_rgba(0,0,0,0.15)] ring-[5px] ring-white">
              <Mascot kind="rocket" size={72} />
            </div>
            <span className="absolute -right-2 top-2 z-20 animate-[wiggle_2s_ease-in-out_infinite] text-3xl" aria-hidden>
              ✨
            </span>
            <span className="absolute -left-3 bottom-4 z-20 text-2xl" aria-hidden>
              🌈
            </span>
          </div>

          <h1 className="mt-5 font-display text-[2rem] font-extrabold leading-[1.08] tracking-tight text-ink sm:text-[2.35rem]">
            Ready for your
            <span className="block bg-gradient-to-r from-primary via-[#ff8f4a] to-[#3A86FF] bg-clip-text text-transparent">
              next quest?
            </span>
          </h1>
          <p className="mx-auto mt-3 max-w-[20rem] text-[15px] font-bold leading-snug text-ink/55">
            Hi {kidName || "friend"}! Tap play and explore worlds made for curious kids.
          </p>

          {/* Daily goal ring */}
          <div className="mx-auto mt-5 flex max-w-[16rem] items-center gap-3 rounded-2xl bg-white/80 px-4 py-3 shadow-lg ring-2 ring-white backdrop-blur-sm">
            <div
              className="relative grid h-12 w-12 shrink-0 place-items-center rounded-full bg-ink/[0.06]"
              style={{
                background: `conic-gradient(#FF6B35 ${goalPct}%, rgba(45,48,71,0.08) ${goalPct}%)`,
              }}
            >
              <span className="grid h-9 w-9 place-items-center rounded-full bg-white text-xs font-extrabold text-ink">
                {goalPct}%
              </span>
            </div>
            <div className="text-left">
              <p className="font-display text-sm font-extrabold text-ink">Today&apos;s goal</p>
              <p className="text-xs font-bold text-ink/50">
                {lessonsDone}/{dailyGoal} lessons · keep the streak alive!
              </p>
            </div>
          </div>

          {/* Primary CTA */}
          <motion.button
            type="button"
            onClick={() => navigate(playPath)}
            className="home-v2-play mt-6 w-full max-w-[18rem] focus-ring"
            whileTap={{ scale: 0.96 }}
            {...slide(2, reduce)}
          >
            <span className="flex items-center justify-center gap-2">
              <Play size={22} fill="currentColor" />
              <span className="font-display text-xl font-extrabold">Play now</span>
            </span>
            <span className="mt-1 block text-sm font-bold text-white/90">{playTitle}</span>
          </motion.button>
        </motion.section>

        {/* Subject worlds — big tappable tiles */}
        <motion.section className="mt-10 w-full" {...slide(3, reduce)}>
          <h2 className="text-center font-display text-lg font-extrabold text-ink">Choose your world</h2>
          <p className="mt-1 text-center text-xs font-bold uppercase tracking-widest text-ink/40">Tap to explore</p>
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {SUBJECTS.map((s, i) => {
              const w = WORLD[s.id] ?? WORLD.trivia;
              return (
                <WorldTile
                  key={s.id}
                  name={s.name}
                  emoji={w.emoji}
                  from={w.from}
                  to={w.to}
                  glow={w.glow}
                  delay={i * 0.04}
                  reduce={reduce}
                  onClick={() => navigate(s.id === "math" ? "/multiplication" : `/subject/${s.id}`)}
                />
              );
            })}
          </div>
        </motion.section>

        {/* Quick orbs */}
        <motion.section className="mt-8 w-full" {...slide(4, reduce)}>
          <div className="flex justify-center gap-3 sm:gap-4">
            {ORBS.map(({ to, emoji, label }) => (
              <Link key={to} to={to} className="home-v2-orb focus-ring">
                <span className="text-2xl" aria-hidden>
                  {emoji}
                </span>
                <span className="mt-1 font-display text-[11px] font-extrabold text-ink/75">{label}</span>
              </Link>
            ))}
          </div>
        </motion.section>

        {/* Daily bonus */}
        <motion.section className="mt-8 w-full" {...slide(5, reduce)}>
          <Link
            to={daily.path}
            onClick={() => {
              if (!dailyDone) {
                completeDailyChallenge(daily.dateKey);
                grantXP(daily.xpBonus);
              }
            }}
            className="home-v2-daily flex items-center gap-4 focus-ring"
          >
            <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-white text-3xl shadow-inner">
              {dailyDone ? "✅" : daily.emoji}
            </span>
            <div className="flex-1 text-left">
              <p className="font-display text-base font-extrabold text-ink">
                {dailyDone ? "Daily bonus collected!" : "Daily bonus quest"}
              </p>
              <p className="text-sm font-bold text-ink/50">
                {dailyDone ? "Come back tomorrow" : `${daily.title} · +${daily.xpBonus} XP`}
              </p>
            </div>
            {!dailyDone && (
              <span className="rounded-full bg-primary px-3 py-1.5 text-xs font-extrabold text-white">Go</span>
            )}
          </Link>
        </motion.section>

        {(mulDue + geoDue) > 0 && (
          <motion.button
            type="button"
            onClick={() => navigate("/review")}
            className="mt-4 w-full rounded-2xl bg-violet-500 px-4 py-3 font-display text-sm font-extrabold text-white shadow-lg focus-ring"
            {...slide(5, reduce)}
          >
            🧠 {mulDue + geoDue} reviews waiting for you!
          </motion.button>
        )}

        {/* Footer — thanks centered */}
        <motion.footer className="mt-10 w-full text-center" {...slide(6, reduce)}>
          {showAdmin && (
            <Link
              to="/admin"
              className="mb-3 inline-flex items-center gap-2 rounded-full bg-ink px-4 py-2 text-xs font-extrabold text-white focus-ring"
            >
              <Sparkles size={14} /> Admin dashboard
            </Link>
          )}

          <div className="home-v2-thanks mx-auto max-w-sm px-6 py-8">
            <p className="text-3xl" aria-hidden>
              💛
            </p>
            <p className="mt-2 font-display text-xl font-extrabold text-ink">Thanks for being awesome!</p>
            <p className="mt-2 text-sm font-semibold leading-relaxed text-ink/55">
              Every adventure you complete makes KidQuest more fun for kids everywhere.
            </p>
            <p className="mt-4 text-xs font-bold text-ink/35">
              {role === "teacher" ? "Teachers" : "Parents"} ·{" "}
              <Link to="/settings" className="text-primary hover:underline">
                open dashboard
              </Link>
            </p>
          </div>

          <div className="flex justify-center gap-4 pb-2 text-xs font-bold text-ink/35">
            <Link to="/about" className="hover:text-primary focus-ring">
              Story
            </Link>
            <Link to="/impact" className="hover:text-primary focus-ring">
              Mission
            </Link>
            <Link to="/privacy" className="hover:text-primary focus-ring">
              Privacy
            </Link>
          </div>
        </motion.footer>
      </div>
    </div>
  );
}

function HudPill({ emoji, value, label }) {
  return (
    <div className="flex items-center gap-1.5 rounded-2xl bg-white/90 px-3 py-2 shadow-md ring-2 ring-white">
      <span className="text-base" aria-hidden>
        {emoji}
      </span>
      <div className="text-left leading-none">
        <p className="font-display text-sm font-extrabold tabular-nums text-ink">{value}</p>
        <p className="text-[9px] font-bold uppercase tracking-wide text-ink/40">{label}</p>
      </div>
    </div>
  );
}

function WorldTile({ name, emoji, from, to, glow, delay, reduce, onClick }) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      initial={reduce ? false : { opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, duration: 0.35 }}
      whileTap={{ scale: 0.94 }}
      className="home-v2-world focus-ring"
      style={{ boxShadow: `0 8px 0 rgba(0,0,0,0.08), 0 12px 32px ${glow}` }}
    >
      <div
        className="flex h-full flex-col items-center justify-center gap-1 rounded-[1.35rem] p-4"
        style={{ background: `linear-gradient(145deg, ${from} 0%, ${to} 100%)` }}
      >
        <span className="text-4xl drop-shadow-sm" aria-hidden>
          {emoji}
        </span>
        <span className="font-display text-sm font-extrabold text-white drop-shadow-sm">{name}</span>
      </div>
    </motion.button>
  );
}
