import { Link, useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Play, Settings, Sparkles, Compass } from "lucide-react";
import { useAppStore } from "../store/useAppStore";
import { useAuthStore } from "../store/useAuthStore";
import { isAdminUser } from "../lib/adminAccess";
import { pathForSubject, LIVE_SUBJECT_IDS } from "../config/liveSubjects";
import { countDueReviews } from "../utils/multiplicationProgress";
import { useMultiplicationStore } from "../store/useMultiplicationStore";
import { countGeoDueReviews } from "../utils/geographyProgress";
import { useGeographyStore } from "../store/useGeographyStore";
import { getDailyChallenge } from "../utils/dailyChallenge";
import { xpToNextLevel } from "../utils/scoring";
import { Avatar } from "../components/mascots/Avatar";
import { Mascot } from "../components/mascots/Mascot";
import { ElegantBackground } from "../components/elegant/ElegantBackground";
import { WorldsShowcase } from "../components/elegant/ElegantSections";
import { DailyTreasure } from "../components/home/DailyTreasure";
import { ShareStreakButton } from "../components/home/ShareStreakButton";
import { ConfettiBlast } from "../components/rewards/ConfettiBlast";

const STREAK_MILESTONES = [3, 7, 14, 30];

function todayKey() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function guidanceSubtitle({ reviewsDue, dailyDone, daily, goalPct, lessonsDone, dailyGoal }) {
  if (reviewsDue > 0) return `${reviewsDue} reviews ready — quick win first!`;
  if (!dailyDone) return `Today's quest: ${daily.title}`;
  if (goalPct < 100) return `Quest progress today: ${lessonsDone}/${dailyGoal}`;
  return "Pick a world below — your adventure awaits!";
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
    currentStreak,
    totalXP,
    totalPoints,
    lessonsToday,
    dailyGoal,
  } = useAppStore();

  const mulDue = useMultiplicationStore((s) => countDueReviews(s));
  const geoDue = useGeographyStore((s) => countGeoDueReviews(s.countries));
  const daily = useMemo(() => getDailyChallenge(), []);
  const dailyDone = dailyChallengeDone === daily.dateKey;
  const level = xpToNextLevel(totalXP);
  const lessonsDone = lessonsToday?.date === todayKey() ? lessonsToday.count : 0;
  const goalPct = Math.min(100, Math.round((lessonsDone / Math.max(1, dailyGoal)) * 100));
  const reviewsDue = mulDue + geoDue;
  const liveWorldCount = LIVE_SUBJECT_IDS.size;

  const playPath = reviewsDue > 0
    ? "/review"
    : !dailyDone
      ? daily.path
      : goalPct < 100
        ? "/math"
        : "/explore";

  const todayMission = reviewsDue > 0
    ? { emoji: "🧠", title: "Review time", sub: `${reviewsDue} facts ready`, path: "/review" }
    : !dailyDone
      ? { emoji: daily.emoji, title: daily.title, sub: `+${daily.xpBonus} XP bonus`, path: daily.path }
      : goalPct < 100
        ? { emoji: "🎯", title: "Daily goal", sub: `${lessonsDone}/${dailyGoal} quests`, path: "/math" }
        : { emoji: "🌟", title: "Free play", sub: "Explore any world", path: "/explore" };

  const subtitle = guidanceSubtitle({
    reviewsDue,
    dailyDone,
    daily,
    goalPct,
    lessonsDone,
    dailyGoal,
  });

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

  return (
    <div className="elegant-page home-simple relative min-h-[100dvh] w-full">
      <ElegantBackground reduceMotion={reduce} />
      {showConfetti && !reduce && <ConfettiBlast count={60} duration={2} />}

      <div className="home-simple-inner relative z-10 mx-auto w-full max-w-4xl px-4 pb-[calc(5rem+env(safe-area-inset-bottom))] pt-[max(0.5rem,env(safe-area-inset-top))] lg:px-6">
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

          <div className="flex min-w-0 flex-1 justify-end">
            <Link
              to="/settings"
              className="grid h-10 w-10 place-items-center rounded-2xl text-white/70 home-v2-hud-pill focus-ring"
              aria-label="Settings"
            >
              <Settings size={18} />
            </Link>
          </div>
        </header>

        <section className="home-hero mt-3">
          <p className="elegant-eyebrow inline-flex text-[10px] tracking-[0.15em]">
            <span className="elegant-eyebrow-dot" aria-hidden />
            Quest Home
          </p>
          <h1 className="home-hero-title mt-1 font-display text-[1.65rem] font-extrabold text-white sm:text-[1.85rem]">
            Hey {kidName || "friend"}!
          </h1>
          <p className="home-hero-sub mt-0.5 text-sm font-bold text-white/55">{subtitle}</p>

          <motion.button
            type="button"
            onClick={() => navigate(playPath)}
            whileTap={{ scale: 0.97 }}
            className="home-v2-play home-hero-play focus-ring mt-3"
          >
            <Play size={22} fill="currentColor" className="inline-block" aria-hidden />
            <span>Play</span>
          </motion.button>

          <Link to={todayMission.path} className="home-mission-line focus-ring">
            <span aria-hidden>{todayMission.emoji}</span>
            <span className="min-w-0 flex-1 truncate">
              <span className="font-extrabold text-white">{todayMission.title}</span>
              <span className="text-white/50"> · {todayMission.sub}</span>
            </span>
            <span className="text-[10px] font-extrabold text-[#ffd700]">Go →</span>
          </Link>

          <div className="home-progress-strip mt-3">
            <ProgressChip emoji="🔥" label="Streak" value={currentStreak} />
            <GoalRing pct={goalPct} done={lessonsDone} goal={dailyGoal} />
            <ProgressChip emoji={level.emoji} label="Level" value={level.level} sub={level.isMax ? "Max!" : `${level.current}/${level.needed}`} />
            <div className="home-progress-share">
              <ShareStreakButton className="!h-full !min-h-[3.25rem] !w-full !rounded-xl !px-2 !py-2" />
            </div>
          </div>

          <p className="home-quest-copy mt-2 text-center text-[11px] font-bold text-white/45">
            Quest progress today — finish {dailyGoal} quests to keep your streak glowing
          </p>

          <Link to="/journey" className="home-journey-btn focus-ring mt-2">
            <Sparkles size={16} className="text-[#ffd700]" aria-hidden />
            See everything I learned
          </Link>
        </section>

        <section className="home-today-row mt-3">
          <DailyTreasure compact />
        </section>

        <section className="home-worlds-block mt-3">
          <WorldsShowcase
            compact
            liveOnly
            onWorldClick={(s) => openSubject(s)}
            onComingSoon={setComingSoonName}
          />
        </section>

        <section className="home-quick-row mt-3">
          <QuickTile
            icon={<Play size={16} fill="currentColor" />}
            label="Play"
            onClick={() => navigate(playPath)}
          />
          <QuickTile
            icon={<span className="text-base">🔢</span>}
            label="Math"
            onClick={() => navigate("/math")}
          />
          <QuickTile
            icon={<Compass size={16} />}
            label="Curiosity"
            onClick={() => navigate("/curiosity")}
          />
        </section>

        <p className="home-stats-hint mt-2 text-center text-[10px] font-bold text-white/40">
          {liveWorldCount} worlds live · {totalPoints ?? 0} pts · {totalXP} XP
        </p>

        <footer className="home-about-footer mt-4 text-center">
          <Link to="/about" className="home-about-link focus-ring">
            About us
          </Link>
        </footer>

        {showAdmin && (
          <Link
            to="/admin"
            className="mx-auto mt-3 flex w-fit items-center gap-1.5 rounded-full bg-white/15 px-3 py-1.5 text-[10px] font-extrabold text-white focus-ring"
          >
            <Sparkles size={12} /> Admin
          </Link>
        )}
      </div>

      {comingSoonName && (
        <ComingSoonToast name={comingSoonName} onClose={() => setComingSoonName(null)} />
      )}
    </div>
  );
}

function ProgressChip({ emoji, label, value, sub }) {
  return (
    <div className="home-progress-chip">
      <span className="text-lg" aria-hidden>
        {emoji}
      </span>
      <p className="text-[8px] font-extrabold uppercase tracking-wide text-white/40">{label}</p>
      <p className="font-display text-sm font-extrabold tabular-nums text-white">{value}</p>
      {sub && <p className="text-[9px] font-bold text-white/45">{sub}</p>}
    </div>
  );
}

function GoalRing({ pct, done, goal }) {
  const ringStyle = {
    background: `conic-gradient(#ffd700 ${pct * 3.6}deg, rgba(255,255,255,0.12) 0deg)`,
  };
  return (
    <div className="home-progress-chip home-progress-goal">
      <div className="home-goal-ring" style={ringStyle} aria-hidden>
        <span className="home-goal-ring-inner font-display text-xs font-extrabold text-white">
          {done}/{goal}
        </span>
      </div>
      <p className="text-[8px] font-extrabold uppercase tracking-wide text-white/40">Today</p>
    </div>
  );
}

function QuickTile({ icon, label, onClick }) {
  return (
    <button type="button" onClick={onClick} className="home-quick-tile focus-ring">
      {icon}
      <span className="font-display text-xs font-extrabold text-white">{label}</span>
    </button>
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
