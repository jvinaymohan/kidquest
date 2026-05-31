import { Link, useNavigate } from "react-router-dom";
import { useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Play, Settings, Sparkles } from "lucide-react";
import { useAppStore } from "../store/useAppStore";
import { useAuthStore } from "../store/useAuthStore";
import { isAdminUser } from "../lib/adminAccess";
import { SUBJECTS } from "../data/subjects";
import { isLiveSubject, pathForSubject } from "../config/liveSubjects";
import { getMonthlyTheme } from "../utils/theme";
import { countDueReviews } from "../utils/multiplicationProgress";
import { useMultiplicationStore } from "../store/useMultiplicationStore";
import { countGeoDueReviews } from "../utils/geographyProgress";
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

const DEFAULT_PLAY = { path: "/multiplication", title: "Multiplication Camp" };

function todayKey() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export default function Home() {
  const navigate = useNavigate();
  const reduce = useReducedMotion();
  const [comingSoonName, setComingSoonName] = useState(null);
  const profile = useAuthStore((s) => s.profile);
  const user = useAuthStore((s) => s.user);
  const showAdmin = isAdminUser({ profile, email: user?.email ?? profile?.email });

  const {
    kidName,
    role,
    avatarConfig,
    dailyChallengeDone,
    completeDailyChallenge,
    grantXP,
    lessonsToday,
    dailyGoal,
    currentStreak,
    totalXP,
    totalPoints,
  } = useAppStore();

  const mulDue = useMultiplicationStore((s) => countDueReviews(s));
  const geoDue = useGeographyStore((s) => countGeoDueReviews(s.countries));
  const theme = getMonthlyTheme();
  const daily = useMemo(() => getDailyChallenge(), []);
  const dailyDone = dailyChallengeDone === daily.dateKey;
  const level = xpToNextLevel(totalXP);
  const lessonsDone = lessonsToday?.date === todayKey() ? lessonsToday.count : 0;
  const goalPct = Math.min(100, Math.round((lessonsDone / Math.max(1, dailyGoal)) * 100));
  const reviewsDue = mulDue + geoDue;

  const liveSubjects = SUBJECTS.filter((s) => isLiveSubject(s.id));
  const soonSubjects = SUBJECTS.filter((s) => !isLiveSubject(s.id));

  const playPath = pathForSubject("math") ?? "/math";
  const playTitle = "Math Zone";

  function openSubject(subject) {
    const path = pathForSubject(subject.id);
    if (path) navigate(path);
    else setComingSoonName(subject.name);
  }

  return (
    <div className="home-v2 home-v2-fit relative flex h-[100dvh] flex-col overflow-hidden">
      <div className="home-v2-blob home-v2-blob-a" aria-hidden />
      <div className="home-v2-blob home-v2-blob-b" aria-hidden />
      <div className="home-v2-stars" aria-hidden />

      <div className="relative mx-auto flex h-full w-full max-w-lg flex-col px-3 pb-[calc(4.5rem+env(safe-area-inset-bottom))] pt-[max(0.5rem,env(safe-area-inset-top))]">
        {/* HUD */}
        <header className="flex shrink-0 items-center gap-1.5">
          <Link
            to="/profile"
            className="flex shrink-0 items-center gap-1.5 rounded-2xl bg-white/90 px-2 py-1 shadow-md ring-2 ring-white focus-ring"
          >
            <span className="grid h-9 w-9 place-items-center overflow-hidden rounded-xl bg-gradient-to-br from-accent/40 to-primary/30">
              {avatarConfig ? <Avatar config={avatarConfig} size={32} /> : <Mascot kind="owl" size={28} animate={false} />}
            </span>
            <span className="hidden min-w-0 sm:block">
              <span className="block truncate font-display text-xs font-extrabold text-ink">{kidName || "Explorer"}</span>
              <span className="block text-[9px] font-bold text-ink/50">Lvl {level.level}</span>
            </span>
          </Link>

          <div className="flex min-w-0 flex-1 justify-center gap-1">
            <HudPill emoji="🔥" value={currentStreak} label="streak" />
            <HudPill emoji="⭐" value={totalPoints ?? 0} label="pts" />
            <HudPill emoji="⚡" value={totalXP} label="XP" />
          </div>

          <Link
            to="/settings"
            className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-white/90 text-ink/60 shadow-md ring-2 ring-white focus-ring"
            aria-label="Settings"
          >
            <Settings size={18} />
          </Link>
        </header>

        {/* Hero */}
        <section className="flex shrink-0 flex-col items-center pt-2 text-center">
          <p className="home-v2-badge mx-auto text-[10px]">
            {theme.emoji} {theme.name}
          </p>

          <div className="relative mt-2 flex h-24 w-24 items-center justify-center">
            <motion.div
              className="absolute inset-0 rounded-full bg-gradient-to-br from-[#ffe066] via-[#ff9f43] to-[#ff6b6b] opacity-90"
              animate={reduce ? undefined : { scale: [1, 1.05, 1] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            />
            <div className="relative z-10 grid h-[4.5rem] w-[4.5rem] place-items-center rounded-full bg-white shadow-lg ring-4 ring-white">
              <Mascot kind="rocket" size={52} />
            </div>
          </div>

          <h1 className="mt-2 font-display text-[1.65rem] font-extrabold leading-tight tracking-tight text-ink">
            Hi {kidName || "friend"}!
            <span className="block bg-gradient-to-r from-primary via-[#ff8f4a] to-[#3A86FF] bg-clip-text text-transparent">
              Pick a quest
            </span>
          </h1>

          <div className="mt-2 flex items-center gap-2 rounded-2xl bg-white/80 px-3 py-2 shadow-md ring-2 ring-white">
            <div
              className="relative grid h-10 w-10 shrink-0 place-items-center rounded-full"
              style={{
                background: `conic-gradient(#FF6B35 ${goalPct}%, rgba(45,48,71,0.08) ${goalPct}%)`,
              }}
            >
              <span className="grid h-8 w-8 place-items-center rounded-full bg-white text-[10px] font-extrabold text-ink">
                {goalPct}%
              </span>
            </div>
            <p className="text-left text-xs font-bold text-ink/55">
              <span className="font-display font-extrabold text-ink">Today&apos;s goal</span>
              <br />
              {lessonsDone}/{dailyGoal} lessons
            </p>
          </div>

          <motion.button
            type="button"
            onClick={() => navigate(playPath)}
            className="home-v2-play mt-3 w-full max-w-[16rem] focus-ring"
            whileTap={{ scale: 0.96 }}
          >
            <span className="flex items-center justify-center gap-2">
              <Play size={20} fill="currentColor" />
              <span className="font-display text-lg font-extrabold">Play now</span>
            </span>
            <span className="mt-0.5 block text-xs font-bold text-white/90">{playTitle}</span>
          </motion.button>
        </section>

        {/* Worlds — flex fill */}
        <section className="mt-3 flex min-h-0 flex-1 flex-col">
          <h2 className="shrink-0 text-center font-display text-sm font-extrabold text-ink">Your worlds</h2>
          <div className="mt-2 grid min-h-0 flex-1 grid-cols-3 gap-2">
            {liveSubjects.map((s, i) => {
              const w = WORLD[s.id] ?? WORLD.trivia;
              return (
                <WorldTile
                  key={s.id}
                  name={s.name}
                  emoji={w.emoji}
                  from={w.from}
                  to={w.to}
                  glow={w.glow}
                  live
                  delay={i * 0.04}
                  reduce={reduce}
                  onClick={() => openSubject(s)}
                />
              );
            })}
          </div>

          <p className="mt-2 shrink-0 text-center text-[10px] font-bold uppercase tracking-widest text-ink/40">
            Coming soon
          </p>
          <div className="mt-1.5 grid shrink-0 grid-cols-4 gap-1.5">
            {soonSubjects.map((s) => {
              const w = WORLD[s.id] ?? WORLD.trivia;
              return (
                <WorldTile
                  key={s.id}
                  name={s.name}
                  emoji={w.emoji}
                  from={w.from}
                  to={w.to}
                  glow={w.glow}
                  compact
                  comingSoon
                  reduce={reduce}
                  onClick={() => setComingSoonName(s.name)}
                />
              );
            })}
          </div>
        </section>

        {/* Footer row */}
        <footer className="mt-2 flex shrink-0 flex-col gap-2">
          {reviewsDue > 0 && (
            <button
              type="button"
              onClick={() => navigate("/review")}
              className="w-full rounded-2xl bg-violet-500 px-3 py-2 font-display text-xs font-extrabold text-white shadow-lg focus-ring"
            >
              🧠 {reviewsDue} reviews ready
            </button>
          )}

          <Link
            to={daily.path}
            onClick={() => {
              if (!dailyDone) {
                completeDailyChallenge(daily.dateKey);
                grantXP(daily.xpBonus);
              }
            }}
            className="home-v2-daily flex items-center gap-3 px-3 py-2.5 focus-ring"
          >
            <span className="text-2xl" aria-hidden>
              {dailyDone ? "✅" : daily.emoji}
            </span>
            <div className="min-w-0 flex-1 text-left">
              <p className="truncate font-display text-sm font-extrabold text-ink">
                {dailyDone ? "Daily bonus done" : daily.title}
              </p>
              <p className="text-[11px] font-bold text-ink/50">
                {dailyDone ? "See you tomorrow" : `+${daily.xpBonus} XP & pts`}
              </p>
            </div>
            {!dailyDone && (
              <span className="shrink-0 rounded-full bg-primary px-2.5 py-1 text-[10px] font-extrabold text-white">
                Go
              </span>
            )}
          </Link>

          {showAdmin && (
            <Link
              to="/admin"
              className="mx-auto inline-flex items-center gap-1.5 rounded-full bg-ink px-3 py-1.5 text-[10px] font-extrabold text-white focus-ring"
            >
              <Sparkles size={12} /> Admin
            </Link>
          )}
        </footer>
      </div>

      {comingSoonName && (
        <ComingSoonToast name={comingSoonName} onClose={() => setComingSoonName(null)} />
      )}
    </div>
  );
}

function HudPill({ emoji, value, label }) {
  return (
    <div className="flex items-center gap-1 rounded-xl bg-white/90 px-2 py-1.5 shadow-md ring-2 ring-white">
      <span className="text-sm" aria-hidden>
        {emoji}
      </span>
      <div className="text-left leading-none">
        <p className="font-display text-xs font-extrabold tabular-nums text-ink">{value}</p>
        <p className="text-[8px] font-bold uppercase tracking-wide text-ink/40">{label}</p>
      </div>
    </div>
  );
}

function WorldTile({ name, emoji, from, to, glow, delay, reduce, onClick, live, comingSoon, compact }) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      initial={reduce ? false : { opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, duration: 0.3 }}
      whileTap={{ scale: 0.94 }}
      className={`home-v2-world relative focus-ring ${compact ? "home-v2-world-compact" : ""} ${comingSoon ? "opacity-75" : ""}`}
      style={{ boxShadow: live ? `0 6px 0 rgba(0,0,0,0.08), 0 8px 24px ${glow}` : undefined }}
    >
      {comingSoon && (
        <span className="absolute -right-0.5 -top-0.5 z-10 rounded-full bg-ink px-1.5 py-0.5 text-[8px] font-extrabold uppercase tracking-wide text-white">
          Soon
        </span>
      )}
      <div
        className={`flex h-full flex-col items-center justify-center rounded-[1.2rem] ${compact ? "p-2" : "p-3"}`}
        style={{ background: `linear-gradient(145deg, ${from} 0%, ${to} 100%)` }}
      >
        <span className={compact ? "text-2xl" : "text-3xl"} aria-hidden>
          {emoji}
        </span>
        <span
          className={`mt-0.5 text-center font-display font-extrabold text-white drop-shadow-sm ${compact ? "text-[9px] leading-tight" : "text-xs"}`}
        >
          {name}
        </span>
      </div>
    </motion.button>
  );
}

function ComingSoonToast({ name, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center p-4 pb-24 sm:items-center">
      <button type="button" className="absolute inset-0 bg-ink/30" aria-label="Close" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative w-full max-w-sm rounded-3xl bg-white p-5 text-center shadow-2xl ring-4 ring-white"
      >
        <p className="text-3xl" aria-hidden>
          🚧
        </p>
        <p className="mt-2 font-display text-lg font-extrabold text-ink">{name} is coming soon!</p>
        <p className="mt-1 text-sm font-semibold text-ink/55">
          Try Geography, Multiplication, or Solar System for now.
        </p>
        <button
          type="button"
          onClick={onClose}
          className="mt-4 w-full rounded-2xl bg-primary py-3 font-display font-extrabold text-white focus-ring"
        >
          Got it
        </button>
      </motion.div>
    </div>
  );
}
