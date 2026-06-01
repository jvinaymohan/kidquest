import { useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Compass, Sparkles, Calendar, Bookmark } from "lucide-react";
import { useAppStore } from "../store/useAppStore";
import { useCuriosityStore } from "../store/useCuriosityStore";
import { useCuriosityPrefs } from "../store/useCuriosityPreferencesStore";
import { getAllCuriosityCards } from "../data/curiosity";
import {
  selectDailySpark,
  selectWeeklySpotlight,
  selectMonthlyTheme,
  ageGroupToBand,
} from "../utils/curiosity";
import { monthKey } from "../utils/curiosity/calendar";

function HubCard({ card, to, label, delay = 0 }) {
  const gradient = card.visual?.gradient ?? "from-[#667eea] to-[#764ba2]";
  return (
    <motion.li
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
    >
      <Link
        to={to}
        className={`block rounded-3xl p-4 bg-gradient-to-br ${gradient} text-white shadow-lg focus-ring`}
      >
        <p className="text-[10px] font-extrabold uppercase tracking-widest text-white/70">{label}</p>
        <div className="mt-2 flex items-start gap-3">
          <span className="text-4xl" aria-hidden>
            {card.visual?.emoji ?? "✨"}
          </span>
          <div className="min-w-0 flex-1">
            <p className="font-display text-lg font-extrabold leading-tight">{card.title}</p>
            <p className="mt-1 text-xs font-bold text-white/80 line-clamp-2">{card.hook}</p>
          </div>
          <ChevronRight className="shrink-0 text-white/50" size={22} />
        </div>
      </Link>
    </motion.li>
  );
}

export default function CuriosityHub() {
  const navigate = useNavigate();
  const ageGroup = useAppStore((s) => s.ageGroup);
  const recordOpen = useCuriosityStore((s) => s.recordOpen);
  const gentleStreak = useCuriosityStore((s) => s.gentleStreak);
  const savedIds = useCuriosityStore((s) => s.savedIds ?? []);
  const prefs = useCuriosityPrefs();
  const allCards = useMemo(() => getAllCuriosityCards(), []);

  const daily = useMemo(
    () => (prefs.showDaily ? selectDailySpark(allCards, prefs, { ageGroup }) : null),
    [allCards, prefs, ageGroup]
  );
  const weekly = useMemo(
    () => (prefs.showWeekly ? selectWeeklySpotlight(allCards, prefs, { ageGroup }) : null),
    [allCards, prefs, ageGroup]
  );
  const monthly = useMemo(
    () => (prefs.showMonthly ? selectMonthlyTheme(allCards, prefs, { ageGroup }) : null),
    [allCards, prefs, ageGroup]
  );

  useEffect(() => {
    recordOpen();
  }, [recordOpen]);

  const band = ageGroupToBand(ageGroup);
  const themePath = `/curiosity/theme/${monthKey()}`;

  return (
    <div className="elegant-page flex flex-col gap-4 pb-8 min-h-[100dvh]">
      <div className="relative z-10">
        <button
          type="button"
          onClick={() => navigate("/home")}
          className="self-start flex items-center gap-1 font-display font-extrabold text-white/70 focus-ring rounded-pill px-2 py-1"
        >
          <ChevronLeft size={20} /> Home
        </button>

        <header className="mt-2 rounded-3xl border border-white/15 bg-white/10 backdrop-blur-md p-5 text-center">
          <Compass className="mx-auto text-[#ffd700]" size={36} />
          <h1 className="mt-2 font-display text-3xl font-extrabold text-white">Curiosity Hub</h1>
          <p className="mt-1 text-sm font-bold text-white/65">
            Discovery — not a news feed. Wonder at your own pace.
          </p>
          {gentleStreak > 0 && (
            <p className="mt-2 inline-flex items-center gap-1 rounded-full bg-white/15 px-3 py-1 text-xs font-extrabold text-[#ffd700]">
              <Sparkles size={14} /> {gentleStreak}-day curiosity streak
            </p>
          )}
          <p className="mt-1 text-[10px] font-bold text-white/45">Age band {band}</p>
        </header>

        <ul className="mt-4 flex flex-col gap-3">
          {daily && (
            <HubCard
              card={daily}
              to={`/curiosity/spark/${daily.id}`}
              label="Daily Curiosity Spark"
              delay={0.04}
            />
          )}
          {weekly && (
            <HubCard
              card={weekly}
              to={`/curiosity/weekly/${weekly.id}`}
              label="Weekly Spotlight"
              delay={0.08}
            />
          )}
          {monthly && (
            <HubCard
              card={monthly}
              to={themePath}
              label="Monthly Theme"
              delay={0.12}
            />
          )}
        </ul>

        {!daily && !weekly && !monthly && (
          <p className="mt-4 text-center text-sm font-bold text-white/60 chunky-card p-4 bg-white/10">
            No sparks match your settings right now. Ask a grown-up to check Curiosity controls in Settings.
          </p>
        )}

        {savedIds.length > 0 && (
          <section className="mt-5">
            <div className="flex items-center gap-2 mb-2">
              <Bookmark size={16} className="text-[#ffd700]" />
              <h2 className="font-display font-extrabold text-sm text-white">Saved for later</h2>
            </div>
            <ul className="flex flex-col gap-2">
              {savedIds.map((id) => {
                const card = allCards.find((c) => c.id === id);
                if (!card) return null;
                const path =
                  card.type === "weekly"
                    ? `/curiosity/weekly/${id}`
                    : card.type === "monthly"
                      ? themePath
                      : `/curiosity/spark/${id}`;
                return (
                  <li key={id}>
                    <Link
                      to={path}
                      className="flex items-center gap-2 rounded-2xl bg-white/10 px-3 py-2 text-sm font-bold text-white focus-ring"
                    >
                      <span>{card.visual?.emoji}</span>
                      <span className="truncate flex-1">{card.title}</span>
                      <ChevronRight size={16} className="text-white/40" />
                    </Link>
                  </li>
                );
              })}
            </ul>
          </section>
        )}

        <Link
          to="/journey"
          className="mt-4 flex items-center gap-2 rounded-2xl border border-white/20 px-4 py-3 text-sm font-extrabold text-white focus-ring"
        >
          <Calendar size={18} className="text-[#ffd700]" />
          See curiosity progress on My Journey
          <ChevronRight size={16} className="ml-auto text-white/40" />
        </Link>
      </div>
    </div>
  );
}
