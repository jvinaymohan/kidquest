import { Link, useNavigate } from "react-router-dom";
import { useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Play, Settings, Sparkles, Zap, Target, Trophy, Brain } from "lucide-react";
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
import { useMathMasteryStore } from "../store/useMathMasteryStore";
import { getDailyChallenge } from "../utils/dailyChallenge";
import { xpToNextLevel } from "../utils/scoring";
import { LEVELS, OPERATIONS } from "../utils/mathMastery/constants";
import { BADGE_BY_ID } from "../data/badges";
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
    tag: "Explore countries!",
  },
  math: {
    emoji: "🔢",
    from: "#1a5fa0",
    to: "#2980b9",
    shadow: "0 10px 30px rgba(41,128,185,0.4)",
    xp: 40,
    tag: "Numbers & tables",
  },
  "solar-system": {
    emoji: "🪐",
    from: "#c0392b",
    to: "#e74c3c",
    shadow: "0 10px 30px rgba(231,76,60,0.4)",
    xp: 60,
    tag: "Blast off!",
  },
  history: { emoji: "📜", from: "#8e6b14", to: "#d4a017", shadow: undefined, xp: 0, tag: "Soon" },
  music: { emoji: "🎵", from: "#6b3fa0", to: "#9b5de5", shadow: undefined, xp: 0, tag: "Soon" },
  "general-knowledge": { emoji: "💡", from: "#b45309", to: "#fb8500", shadow: undefined, xp: 0, tag: "Soon" },
  trivia: { emoji: "⭐", from: "#c1121f", to: "#e63946", shadow: undefined, xp: 0, tag: "Soon" },
};

const MASCOT_TIPS = [
  "Tap a world below to start your next adventure!",
  "Finish today's goal to keep your streak glowing!",
  "Math Master loves 25-in-a-row streaks — can you do it?",
  "Legendary tables = super speed-run powers!",
  "Daily bonus XP is waiting — grab it before bed!",
];

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
    badges,
    ageGroup,
  } = useAppStore();

  const mulDue = useMultiplicationStore((s) => countDueReviews(s));
  const mulRank = useMultiplicationStore((s) => s.getRank());
  const mulLegendary = useMultiplicationStore((s) => s.getLegendaryCount());
  const mathProgress = useMathMasteryStore((s) => s.progress);
  const geoDue = useGeographyStore((s) => countGeoDueReviews(s.countries));
  const theme = getMonthlyTheme();
  const daily = useMemo(() => getDailyChallenge(), []);
  const dailyDone = dailyChallengeDone === daily.dateKey;
  const level = xpToNextLevel(totalXP);
  const lessonsDone = lessonsToday?.date === todayKey() ? lessonsToday.count : 0;
  const goalPct = Math.min(100, Math.round((lessonsDone / Math.max(1, dailyGoal)) * 100));
  const reviewsDue = mulDue + geoDue;
  const tip = useMemo(() => MASCOT_TIPS[Math.floor(Date.now() / 86400000) % MASCOT_TIPS.length], []);

  const mathMastered = useMemo(
    () =>
      OPERATIONS.reduce(
        (sum, op) => sum + LEVELS.filter((l) => mathProgress[op.id]?.[l]?.mastered).length,
        0
      ),
    [mathProgress]
  );
  const mathTotal = OPERATIONS.length * LEVELS.length;
  const recentBadge = useMemo(() => {
    const last = badges?.[badges.length - 1];
    return last ? BADGE_BY_ID[last] : null;
  }, [badges]);

  const liveSubjects = SUBJECTS.filter((s) => isLiveSubject(s.id));
  const soonSubjects = SUBJECTS.filter((s) => !isLiveSubject(s.id));

  function openSubject(subject) {
    const path = pathForSubject(subject.id);
    if (path) navigate(path);
    else setComingSoonName(subject.name);
  }

  return (
    <div className="home-v2 home-v2-scroll relative">
      <SpaceBackground reduceMotion={reduce} />

      <div className="relative z-10 mx-auto flex w-full max-w-2xl flex-col px-4 pb-[calc(5.5rem+env(safe-area-inset-bottom))] pt-[max(0.75rem,env(safe-area-inset-top))]">
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
              <span className="block text-[9px] font-bold text-white/50">
                {level.emoji} {level.title}
              </span>
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

        {/* Hero row — mascot + greeting + goal */}
        <section className="mt-4 grid gap-3 sm:grid-cols-[auto_1fr] sm:items-center">
          <div className="relative mx-auto sm:mx-0">
            <div className={reduce ? "" : "home-v2-logo-ring grid place-items-center"}>
              <div
                className={`home-v2-logo-inner grid place-items-center ${reduce ? "h-[4.5rem] w-[4.5rem] rounded-full bg-[#1a1060]" : ""}`}
              >
                <Mascot kind="rocket" size={40} animate={!reduce} />
              </div>
            </div>
          </div>

          <div className="min-w-0 text-center sm:text-left">
            <p className="home-v2-badge inline-flex">{theme.emoji} {theme.name}</p>
            <h1 className="mt-2 font-display text-2xl font-extrabold leading-tight text-white sm:text-[1.75rem]">
              Hey {kidName || "friend"}!{" "}
              <span className="home-v2-title-quest">Ready to quest?</span>
            </h1>
            <p className="home-v2-mascot-tip mt-2">{tip}</p>
          </div>
        </section>

        {/* Stats + goal row */}
        <section className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
          <StatTile emoji="🎯" label="Today's goal" value={`${lessonsDone}/${dailyGoal}`} sub={`${goalPct}% done`} />
          <StatTile emoji="🧮" label="Math Master" value={`${mathMastered}/${mathTotal}`} sub="levels ⭐" />
          <StatTile emoji="✖️" label="Tables" value={`${mulLegendary}/20`} sub="legendary" />
          <StatTile emoji={level.emoji} label="Rank" value={`Lvl ${level.level}`} sub={level.isMax ? "Max!" : `${level.current}/${level.needed} XP`} />
        </section>

        {/* XP progress bar */}
        {!level.isMax && (
          <div className="home-v2-xp-bar mt-3">
            <div className="flex justify-between text-[10px] font-extrabold text-white/60">
              <span>{level.title}</span>
              <span>Next level</span>
            </div>
            <div className="mt-1 h-2 overflow-hidden rounded-full bg-white/10">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-[#ffd700] to-[#ff6b6b]"
                initial={false}
                animate={{ width: `${Math.round(level.pct * 100)}%` }}
              />
            </div>
          </div>
        )}

        {/* Quick actions */}
        <section className="mt-5">
          <h2 className="mb-2 text-center text-[11px] font-extrabold uppercase tracking-[0.2em] text-white/45">
            Quick launch
          </h2>
          <div className="grid grid-cols-2 gap-2">
            <QuickAction
              icon={<Play size={18} fill="currentColor" />}
              title="Play now"
              sub="Math Zone"
              accent="from-[#ff6b6b] to-[#ffd700]"
              onClick={() => navigate("/math")}
              reduce={reduce}
            />
            <QuickAction
              icon={<Target size={18} />}
              title="Math Master"
              sub={`${mathMastered} levels done`}
              accent="from-[#2980b9] to-[#54a0ff]"
              onClick={() => navigate("/math-master")}
              reduce={reduce}
            />
            <QuickAction
              icon={<Zap size={18} />}
              title="Times Tables"
              sub={mulRank?.label ?? "Training camp"}
              accent="from-[#9b5de5] to-[#5f27cd]"
              onClick={() => navigate("/multiplication")}
              reduce={reduce}
            />
            <QuickAction
              icon={<Brain size={18} />}
              title={reviewsDue > 0 ? "Reviews!" : "Daily bonus"}
              sub={reviewsDue > 0 ? `${reviewsDue} ready` : dailyDone ? "Done ✅" : daily.title}
              accent="from-[#2ecc71] to-[#27ae60]"
              onClick={() => (reviewsDue > 0 ? navigate("/review") : navigate(daily.path))}
              reduce={reduce}
              pulse={reviewsDue > 0}
            />
          </div>
        </section>

        {/* Streak / badge celebration */}
        {(currentStreak >= 3 || recentBadge) && (
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="home-v2-celebrate mt-4 flex items-center gap-3 px-3 py-2.5"
          >
            <span className="text-2xl" aria-hidden>
              {currentStreak >= 7 ? "💎" : currentStreak >= 3 ? "🔥" : recentBadge?.emoji ?? "🏆"}
            </span>
            <p className="text-left text-xs font-bold text-white/85">
              {currentStreak >= 3 ? (
                <>
                  <span className="font-display font-extrabold text-[#ffd700]">{currentStreak}-day streak!</span>
                  {" "}You're on fire — keep it going!
                </>
              ) : (
                <>
                  New badge: <span className="font-display font-extrabold text-[#ffd700]">{recentBadge?.name}</span>
                </>
              )}
            </p>
          </motion.div>
        )}

        {/* Live worlds */}
        <section className="mt-6">
          <div className="mb-3 flex items-center justify-center gap-2">
            <span className="home-v2-live-dot" aria-hidden />
            <h2 className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-white/50">
              Pick your world
            </h2>
          </div>

          <div className="grid grid-cols-3 gap-3 sm:gap-4">
            {liveSubjects.map((s, i) => {
              const w = WORLD[s.id] ?? WORLD.trivia;
              return (
                <SubjectCard
                  key={s.id}
                  name={s.name}
                  tag={w.tag}
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

          <p className="mt-5 text-center text-[11px] font-bold uppercase tracking-widest text-white/35">
            More worlds coming soon
          </p>
          <div className="mt-2 flex flex-wrap justify-center gap-2">
            {soonSubjects.map((s) => {
              const w = WORLD[s.id] ?? WORLD.trivia;
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setComingSoonName(s.name)}
                  className="home-v2-subject-compact w-[4.25rem] focus-ring"
                  style={{
                    background: `linear-gradient(145deg, ${w.from}, ${w.to})`,
                  }}
                >
                  <span className="absolute -right-0.5 -top-0.5 z-10 rounded-full bg-[#0d0b2e] px-1.5 py-0.5 text-[7px] font-extrabold uppercase text-white">
                    Soon
                  </span>
                  <span className="text-lg" aria-hidden>
                    {w.emoji}
                  </span>
                  <span className="mt-0.5 text-center font-display text-[8px] font-extrabold leading-tight text-white">
                    {s.name}
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-5 flex flex-col gap-2">
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
                {dailyDone ? "Daily bonus collected!" : `Daily quest: ${daily.title}`}
              </p>
              <p className="text-[11px] font-bold text-white/50">
                {dailyDone ? "See you tomorrow, space cadet!" : `+${daily.xpBonus} XP if you finish`}
              </p>
            </div>
            {!dailyDone && (
              <span className="shrink-0 rounded-full bg-gradient-to-r from-[#ff6b6b] to-[#ffd700] px-2.5 py-1 text-[10px] font-extrabold text-white">
                Go!
              </span>
            )}
          </Link>

          {ageGroup === "champion" && (
            <Link
              to="/compete"
              className="home-v2-daily focus-ring border-[#ffd700]/30"
            >
              <Trophy size={22} className="text-[#ffd700]" />
              <div className="min-w-0 flex-1 text-left">
                <p className="font-display text-sm font-extrabold text-white">Compete hub</p>
                <p className="text-[11px] font-bold text-white/50">Duels & leaderboards</p>
              </div>
            </Link>
          )}

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

function StatTile({ emoji, label, value, sub }) {
  return (
    <div className="home-v2-stat-tile">
      <span className="text-lg" aria-hidden>{emoji}</span>
      <p className="text-[9px] font-extrabold uppercase tracking-wide text-white/45">{label}</p>
      <p className="font-display text-sm font-extrabold tabular-nums text-white">{value}</p>
      <p className="text-[9px] font-bold text-white/50">{sub}</p>
    </div>
  );
}

function QuickAction({ icon, title, sub, accent, onClick, reduce, pulse }) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileTap={{ scale: 0.97 }}
      className={`home-v2-quick-action bg-gradient-to-br ${accent} focus-ring ${pulse ? "home-v2-pulse" : ""}`}
    >
      <span className="opacity-90">{icon}</span>
      <span className="font-display text-sm font-extrabold text-white">{title}</span>
      <span className="text-[10px] font-bold text-white/85">{sub}</span>
    </motion.button>
  );
}

function SubjectCard({ name, tag, emoji, from, to, shadow, xp, delay, reduce, onClick }) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      initial={reduce ? false : { opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, duration: 0.3 }}
      whileTap={{ scale: 0.96 }}
      className="home-v2-subject-card home-v2-subject-card-dense focus-ring"
      style={{
        background: `linear-gradient(145deg, ${from}, ${to})`,
        boxShadow: shadow,
      }}
    >
      <span className="home-v2-card-emoji" aria-hidden>
        {emoji}
      </span>
      <span className="home-v2-card-name text-sm">{name}</span>
      <span className="text-[9px] font-bold text-white/75">{tag}</span>
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
        <p className="mt-2 font-display text-lg font-extrabold text-white">{name} is blasting off soon!</p>
        <p className="mt-1 text-sm font-semibold text-white/60">
          For now, try Geography, Math, or Solar System!
        </p>
        <button
          type="button"
          onClick={onClose}
          className="mt-4 w-full rounded-2xl bg-gradient-to-r from-[#ff6b6b] to-[#ffd700] py-3 font-display font-extrabold text-white focus-ring"
        >
          Got it!
        </button>
      </motion.div>
    </div>
  );
}
