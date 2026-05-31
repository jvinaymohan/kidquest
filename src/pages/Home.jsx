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
import { SpaceBackground } from "../components/home/SpaceBackground";

const WORLD = {
  geography: {
    emoji: "🌍",
    from: "#1a7a3c",
    to: "#27ae60",
    shadow: "0 10px 30px rgba(39,174,96,0.4)",
    xp: 50,
  },
  math: {
    emoji: "🔢",
    from: "#1a5fa0",
    to: "#2980b9",
    shadow: "0 10px 30px rgba(41,128,185,0.4)",
    xp: 40,
  },
  "solar-system": {
    emoji: "🪐",
    from: "#c0392b",
    to: "#e74c3c",
    shadow: "0 10px 30px rgba(231,76,60,0.4)",
    xp: 60,
  },
  history: { emoji: "📜", from: "#8e6b14", to: "#d4a017", shadow: undefined, xp: 0 },
  music: { emoji: "🎵", from: "#6b3fa0", to: "#9b5de5", shadow: undefined, xp: 0 },
  "general-knowledge": { emoji: "💡", from: "#b45309", to: "#fb8500", shadow: undefined, xp: 0 },
  trivia: { emoji: "⭐", from: "#c1121f", to: "#e63946", shadow: undefined, xp: 0 },
};

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
    <div className="home-v2 home-v2-scroll relative">
      <SpaceBackground reduceMotion={reduce} />

      <div className="relative z-10 mx-auto flex w-full max-w-lg flex-col px-4 pb-[calc(5.5rem+env(safe-area-inset-bottom))] pt-[max(0.75rem,env(safe-area-inset-top))]">
        {/* HUD */}
        <header className="flex shrink-0 items-center gap-1.5">
          <Link to="/profile" className="home-v2-hud-profile focus-ring">
            <span className="grid h-9 w-9 place-items-center overflow-hidden rounded-xl bg-white/15">
              {avatarConfig ? (
                <Avatar config={avatarConfig} size={32} />
              ) : (
                <Mascot kind="owl" size={28} animate={false} />
              )}
            </span>
            <span className="hidden min-w-0 sm:block">
              <span className="block truncate font-display text-xs font-extrabold text-white">
                {kidName || "Explorer"}
              </span>
              <span className="block text-[9px] font-bold text-white/50">Lvl {level.level}</span>
            </span>
          </Link>

          <div className="flex min-w-0 flex-1 justify-center gap-1">
            <HudPill emoji="🔥" value={currentStreak} label="streak" />
            <HudPill emoji="⭐" value={totalPoints ?? 0} label="pts" />
            <HudPill emoji="⚡" value={totalXP} label="XP" />
          </div>

          <Link
            to="/settings"
            className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl text-white/70 home-v2-hud-pill focus-ring"
            aria-label="Settings"
          >
            <Settings size={18} />
          </Link>
        </header>

        {/* Hero */}
        <section className="mt-4 flex flex-col items-center text-center">
          <p className="home-v2-badge">
            {theme.emoji} {theme.name}
          </p>

          <div className="relative mt-4">
            <div className={reduce ? "" : "home-v2-logo-ring grid place-items-center"}>
              <div
                className={`home-v2-logo-inner grid place-items-center ${reduce ? "h-[5.5rem] w-[5.5rem] rounded-full bg-[#1a1060]" : ""}`}
              >
                <Mascot kind="rocket" size={48} animate={!reduce} />
              </div>
            </div>
            {!reduce && (
              <>
                <span className="absolute -right-2 -top-1 text-lg" aria-hidden>
                  ⭐
                </span>
                <span className="absolute -left-3 bottom-0 text-sm" aria-hidden>
                  ✨
                </span>
                <span className="absolute -left-4 top-5 text-xs" aria-hidden>
                  💫
                </span>
              </>
            )}
          </div>

          <h1 className="mt-4 font-display text-[2.35rem] font-extrabold leading-none tracking-tight">
            <span className="text-white">Hi {kidName || "friend"}!</span>
            <span className="mt-1 block text-[1.65rem]">
              <span className="text-white">Pick a </span>
              <span className="home-v2-title-quest">quest</span>
            </span>
          </h1>

          <div className="home-v2-goal mt-4 w-full max-w-xs">
            <div
              className="relative grid h-10 w-10 shrink-0 place-items-center rounded-full"
              style={{
                background: `conic-gradient(#FFD700 ${goalPct}%, rgba(255,255,255,0.12) ${goalPct}%)`,
              }}
            >
              <span className="grid h-8 w-8 place-items-center rounded-full bg-[#1a1060] text-[10px] font-extrabold text-white">
                {goalPct}%
              </span>
            </div>
            <p className="text-left text-xs font-bold text-white/70">
              <span className="font-display font-extrabold text-white">Today&apos;s goal</span>
              <br />
              {lessonsDone}/{dailyGoal} lessons
            </p>
          </div>

          <motion.button
            type="button"
            onClick={() => navigate(playPath)}
            className="home-v2-play mt-4 focus-ring"
            whileTap={{ scale: 0.98 }}
          >
            <span className="flex items-center justify-center gap-2">
              <Play size={20} fill="currentColor" />
              Play now
            </span>
            <span className="mt-0.5 block text-xs font-bold text-white/90">{playTitle}</span>
          </motion.button>
        </section>

        {/* Live worlds */}
        <section className="mt-8">
          <div className="mb-4 flex items-center justify-center gap-2">
            <span className="home-v2-live-dot" aria-hidden />
            <h2 className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-white/50">
              Live now
            </h2>
          </div>

          <div className="flex flex-wrap justify-center gap-4">
            {liveSubjects.map((s, i) => {
              const w = WORLD[s.id] ?? WORLD.trivia;
              return (
                <SubjectCard
                  key={s.id}
                  name={s.name}
                  emoji={w.emoji}
                  from={w.from}
                  to={w.to}
                  shadow={w.shadow}
                  xp={w.xp}
                  delay={i * 0.04}
                  reduce={reduce}
                  onClick={() => openSubject(s)}
                />
              );
            })}
          </div>

          <p className="mt-6 text-center text-[11px] font-bold uppercase tracking-widest text-white/40">
            Coming soon
          </p>
          <div className="mt-2 flex flex-wrap justify-center gap-2">
            {soonSubjects.map((s) => {
              const w = WORLD[s.id] ?? WORLD.trivia;
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setComingSoonName(s.name)}
                  className="home-v2-subject-compact w-[4.5rem] focus-ring"
                  style={{
                    background: `linear-gradient(145deg, ${w.from}, ${w.to})`,
                  }}
                >
                  <span className="absolute -right-0.5 -top-0.5 z-10 rounded-full bg-[#0d0b2e] px-1.5 py-0.5 text-[7px] font-extrabold uppercase text-white">
                    Soon
                  </span>
                  <span className="text-xl" aria-hidden>
                    {w.emoji}
                  </span>
                  <span className="mt-0.5 text-center font-display text-[9px] font-extrabold leading-tight text-white">
                    {s.name}
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-6 flex flex-col gap-2">
          {reviewsDue > 0 && (
            <button
              type="button"
              onClick={() => navigate("/review")}
              className="w-full rounded-2xl bg-violet-500/90 px-3 py-2.5 font-display text-xs font-extrabold text-white shadow-lg focus-ring"
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
            className="home-v2-daily focus-ring"
          >
            <span className="text-2xl" aria-hidden>
              {dailyDone ? "✅" : daily.emoji}
            </span>
            <div className="min-w-0 flex-1 text-left">
              <p className="truncate font-display text-sm font-extrabold text-white">
                {dailyDone ? "Daily bonus done" : daily.title}
              </p>
              <p className="text-[11px] font-bold text-white/50">
                {dailyDone ? "See you tomorrow" : `+${daily.xpBonus} XP & pts`}
              </p>
            </div>
            {!dailyDone && (
              <span className="shrink-0 rounded-full bg-gradient-to-r from-[#ff6b6b] to-[#ffd700] px-2.5 py-1 text-[10px] font-extrabold text-white">
                Go
              </span>
            )}
          </Link>

          {showAdmin && (
            <Link
              to="/admin"
              className="mx-auto inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1.5 text-[10px] font-extrabold text-white focus-ring"
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
    <div className="home-v2-hud-pill">
      <span className="text-sm" aria-hidden>
        {emoji}
      </span>
      <div className="text-left leading-none">
        <p className="font-display text-xs font-extrabold tabular-nums text-white">{value}</p>
        <p className="text-[8px] font-bold uppercase tracking-wide text-white/40">{label}</p>
      </div>
    </div>
  );
}

function SubjectCard({ name, emoji, from, to, shadow, xp, delay, reduce, onClick }) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      initial={reduce ? false : { opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, duration: 0.3 }}
      whileTap={{ scale: 0.96 }}
      className="home-v2-subject-card focus-ring"
      style={{
        background: `linear-gradient(145deg, ${from}, ${to})`,
        boxShadow: shadow,
      }}
    >
      <span className="home-v2-card-emoji" aria-hidden>
        {emoji}
      </span>
      <span className="home-v2-card-name">{name}</span>
      {xp > 0 && <span className="home-v2-card-xp">+{xp} XP</span>}
    </motion.button>
  );
}

function ComingSoonToast({ name, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center p-4 pb-24 sm:items-center">
      <button type="button" className="absolute inset-0 bg-black/50" aria-label="Close" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative w-full max-w-sm rounded-3xl bg-[#1a1060] p-5 text-center shadow-2xl ring-2 ring-white/20"
      >
        <p className="text-3xl" aria-hidden>
          🚧
        </p>
        <p className="mt-2 font-display text-lg font-extrabold text-white">{name} is coming soon!</p>
        <p className="mt-1 text-sm font-semibold text-white/60">
          Try Geography, Math, or Solar System for now.
        </p>
        <button
          type="button"
          onClick={onClose}
          className="mt-4 w-full rounded-2xl bg-gradient-to-r from-[#ff6b6b] to-[#ffd700] py-3 font-display font-extrabold text-white focus-ring"
        >
          Got it
        </button>
      </motion.div>
    </div>
  );
}
