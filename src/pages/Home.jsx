import { Link, useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
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
import { dailySpaceFact } from "../data/spaceFacts";
import { Mascot } from "../components/mascots/Mascot";
import { Avatar } from "../components/mascots/Avatar";
import { SpaceBackground } from "../components/home/SpaceBackground";
import { DailyTreasure } from "../components/home/DailyTreasure";
import { StreakCalendar } from "../components/home/StreakCalendar";
import { ShareStreakButton } from "../components/home/ShareStreakButton";
import { ConfettiBlast } from "../components/rewards/ConfettiBlast";

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
  science: {
    emoji: "🧪",
    from: "#6b3fa0",
    to: "#9b5de5",
    shadow: "0 10px 30px rgba(155,93,229,0.4)",
    xp: 45,
    tag: "Everyday science",
  },
  history: { emoji: "📜", from: "#8e6b14", to: "#d4a017", shadow: undefined, xp: 0, tag: "Soon" },
  music: { emoji: "🎵", from: "#6b3fa0", to: "#9b5de5", shadow: undefined, xp: 0, tag: "Soon" },
  "general-knowledge": { emoji: "💡", from: "#b45309", to: "#fb8500", shadow: undefined, xp: 0, tag: "Soon" },
  trivia: {
    emoji: "⭐",
    from: "#c1121f",
    to: "#e63946",
    shadow: "0 10px 30px rgba(230,57,70,0.4)",
    xp: 35,
    tag: "1000s of facts",
  },
};

const MASCOT_MESSAGES = [
  "You're a star explorer — pick a world and go!",
  "Every quest makes your brain stronger!",
  "Can you beat yesterday's score?",
  "The treasure chest has a surprise for you!",
  "Share your streak — dare a friend to join!",
  "Legendary tables = super speed-run powers!",
  "Come back tomorrow for a new space fact!",
  "Finish today's goal to keep your streak glowing!",
];

const STREAK_MILESTONES = [3, 7, 14, 30];

function todayKey() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export default function Home() {
  const navigate = useNavigate();
  const reduce = useReducedMotion();
  const [comingSoonName, setComingSoonName] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);
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
  const spaceFact = useMemo(() => dailySpaceFact(), []);
  const mascotMsg = useMemo(
    () => MASCOT_MESSAGES[Math.floor(Math.random() * MASCOT_MESSAGES.length)],
    []
  );

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

  useEffect(() => {
    if (reduce || currentStreak < 3) return;
    const hit = STREAK_MILESTONES.find((m) => currentStreak === m);
    if (!hit) return;
    const key = `kq-streak-celebrate-${todayKey()}-${hit}`;
    if (localStorage.getItem(key)) return;
    localStorage.setItem(key, "1");
    setShowConfetti(true);
    const t = setTimeout(() => setShowConfetti(false), 3000);
    return () => clearTimeout(t);
  }, [currentStreak, reduce]);

  function openSubject(subject) {
    const path = pathForSubject(subject.id);
    if (path) navigate(path);
    else setComingSoonName(subject.name);
  }

  const todayMission = reviewsDue > 0
    ? { emoji: "🧠", title: "Review time!", sub: `${reviewsDue} facts ready — quick win!`, path: "/review" }
    : !dailyDone
      ? { emoji: daily.emoji, title: daily.title, sub: `+${daily.xpBonus} XP bonus`, path: daily.path }
      : goalPct < 100
        ? { emoji: "🎯", title: "Daily goal", sub: `${lessonsDone}/${dailyGoal} quests done`, path: "/math" }
        : { emoji: "🌟", title: "Free play!", sub: "Explore any world you like", path: "/explore" };

  return (
    <div className="home-v2 home-v2-scroll relative min-h-[100dvh] w-full">
      <SpaceBackground reduceMotion={reduce} />
      {showConfetti && !reduce && <ConfettiBlast count={60} duration={2} />}

      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 pb-[calc(5.5rem+env(safe-area-inset-bottom))] pt-[max(0.75rem,env(safe-area-inset-top))] lg:px-8">
        <header className="flex shrink-0 items-center gap-2">
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

          <div className="flex min-w-0 flex-1 justify-center gap-1.5 sm:gap-2">
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

        <div className="home-v2-mobile-strip mt-4">
          <DailyTreasure compact />
          <div className="home-v2-panel home-v2-panel-compact">
            <p className="home-v2-panel-label">Did you know?</p>
            <p className="home-v2-fact">{spaceFact}</p>
          </div>
        </div>

        <div className="home-v2-bento mt-4">
          <aside className="hidden flex-col gap-3 md:flex">
            <DailyTreasure />
            <StreakCalendar />
            <div className="home-v2-panel">
              <p className="home-v2-panel-label">Did you know?</p>
              <p className="home-v2-fact">{spaceFact}</p>
            </div>
          </aside>

          <div className="flex min-w-0 flex-col gap-4">
            <section className="grid gap-3 sm:grid-cols-[auto_1fr] sm:items-center">
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
                <h1 className="mt-2 font-display text-2xl font-extrabold leading-tight text-white sm:text-3xl lg:text-4xl">
                  Hey {kidName || "friend"}!{" "}
                  <span className="home-v2-title-quest">Ready to quest?</span>
                </h1>
                <p className="home-v2-mascot-tip mt-2">{mascotMsg}</p>
              </div>
            </section>

            <section className="home-v2-stat-row">
              <StatTile emoji="🎯" label="Today's goal" value={`${lessonsDone}/${dailyGoal}`} sub={`${goalPct}% done`} />
              <StatTile emoji="🧮" label="Math Master" value={`${mathMastered}/${mathTotal}`} sub="levels ⭐" />
              <StatTile emoji="✖️" label="Tables" value={`${mulLegendary}/20`} sub="legendary" />
              <StatTile emoji={level.emoji} label="Rank" value={`Lvl ${level.level}`} sub={level.isMax ? "Max!" : `${level.current}/${level.needed} XP`} />
            </section>

            {!level.isMax && (
              <div className="home-v2-xp-bar">
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

            <section>
              <h2 className="mb-2 text-[11px] font-extrabold uppercase tracking-[0.2em] text-white/45">
                Quick launch
              </h2>
              <div className="home-v2-quick-grid grid grid-cols-2 gap-2">
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

            {(currentStreak >= 3 || recentBadge) && (
              <motion.div
                initial={reduce ? false : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="home-v2-celebrate flex items-center gap-3 px-3 py-2.5"
              >
                <span className="text-2xl" aria-hidden>
                  {currentStreak >= 7 ? "💎" : currentStreak >= 3 ? "🔥" : recentBadge?.emoji ?? "🏆"}
                </span>
                <p className="flex-1 text-left text-xs font-bold text-white/85">
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
                {currentStreak >= 1 && <ShareStreakButton className="shrink-0 !w-auto px-2.5 py-1.5" />}
              </motion.div>
            )}

            <section>
              <div className="mb-3 flex items-center gap-2">
                <span className="home-v2-live-dot" aria-hidden />
                <h2 className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-white/50">
                  Pick your world
                </h2>
              </div>

              <div className="home-v2-worlds-grid">
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

              <p className="mt-5 text-[11px] font-bold uppercase tracking-widest text-white/35">
                Secret worlds unlocking soon…
              </p>
              <div className="mt-2 grid grid-cols-4 gap-2 sm:grid-cols-4 lg:grid-cols-4">
                {soonSubjects.map((s) => {
                  const w = WORLD[s.id] ?? WORLD.trivia;
                  return (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setComingSoonName(s.name)}
                      className="home-v2-subject-compact home-v2-secret-world w-full focus-ring"
                      style={{
                        background: `linear-gradient(145deg, ${w.from}88, ${w.to}66)`,
                      }}
                    >
                      <span className="relative z-10 text-lg" aria-hidden>
                        {w.emoji}
                      </span>
                      <span className="relative z-10 mt-0.5 text-center font-display text-[8px] font-extrabold leading-tight text-white">
                        {s.name}
                      </span>
                      <span className="relative z-10 mt-0.5 rounded-full bg-black/30 px-1.5 py-0.5 text-[7px] font-extrabold uppercase text-[#ffd700]">
                        🔒 Secret
                      </span>
                    </button>
                  );
                })}
              </div>
            </section>

            <footer className="flex flex-col gap-2">
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
                    {dailyDone ? "Come back tomorrow for a new quest!" : `+${daily.xpBonus} XP if you finish`}
                  </p>
                </div>
                {!dailyDone && (
                  <span className="shrink-0 rounded-full bg-gradient-to-r from-[#ff6b6b] to-[#ffd700] px-2.5 py-1 text-[10px] font-extrabold text-white">
                    Go!
                  </span>
                )}
              </Link>

              <Link to="/journey" className="home-v2-daily focus-ring border-white/20">
                <Sparkles size={22} className="text-[#ffd700]" />
                <div className="min-w-0 flex-1 text-left">
                  <p className="font-display text-sm font-extrabold text-white">My journey</p>
                  <p className="text-[11px] font-bold text-white/50">Look what you discovered!</p>
                </div>
              </Link>

              {ageGroup === "champion" && (
                <Link to="/compete" className="home-v2-daily focus-ring border-[#ffd700]/30">
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

          <aside className="hidden flex-col gap-3 lg:flex">
            <div className="home-v2-panel">
              <p className="home-v2-panel-label">Today's mission</p>
              <Link to={todayMission.path} className="home-v2-mission block focus-ring">
                <p className="font-display text-sm font-extrabold text-white">
                  {todayMission.emoji} {todayMission.title}
                </p>
                <p className="mt-0.5 text-[11px] font-bold text-white/60">{todayMission.sub}</p>
              </Link>
            </div>

            <div className="flex flex-col items-center gap-2">
              <Mascot kind="owl" size={48} animate={!reduce} />
              <p className="home-v2-speech text-center">{mascotMsg}</p>
            </div>

            <ShareStreakButton />

            <div className="home-v2-secret-world">
              <p className="relative z-10 text-2xl" aria-hidden>
                🌌
              </p>
              <p className="relative z-10 mt-1 font-display text-xs font-extrabold text-white">
                Mystery World
              </p>
              <p className="relative z-10 mt-0.5 text-[10px] font-bold text-white/50">
                Keep questing to unlock…
              </p>
            </div>
          </aside>
        </div>
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
