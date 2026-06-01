import { useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronRight, Compass, Sparkles, Bookmark } from "lucide-react";
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
import { HubPageLayout } from "../components/layout/HubPageLayout";

function SparkCard({ card, to, label, delay = 0 }) {
  const gradient = card.visual?.gradient ?? "from-[#667eea]/80 to-[#764ba2]/80";
  return (
    <motion.li
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
    >
      <Link
        to={to}
        className={`hub-topic-card block bg-gradient-to-br ${gradient} border-white/20`}
      >
        <p className="text-[10px] font-extrabold uppercase tracking-widest text-white/70 w-full">
          {label}
        </p>
        <div className="mt-2 flex w-full items-start gap-3">
          <span className="text-4xl shrink-0" aria-hidden>
            {card.visual?.emoji ?? "✨"}
          </span>
          <div className="min-w-0 flex-1">
            <p className="font-display text-lg font-extrabold leading-tight text-white">
              {card.title}
            </p>
            <p className="mt-1 text-xs font-bold text-white/80 line-clamp-2">{card.hook}</p>
          </div>
          <ChevronRight className="shrink-0 text-white/50" size={22} aria-hidden />
        </div>
      </Link>
    </motion.li>
  );
}

export default function CuriosityHub() {
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
    <HubPageLayout
      title="Curiosity Hub"
      subtitle="Discovery — not a news feed. Wonder at your own pace."
      icon={<Compass className="mx-auto text-[#ffd700]" size={36} aria-hidden />}
      headerExtra={
        <>
          {gentleStreak > 0 && (
            <p className="mt-2 inline-flex items-center gap-1 rounded-full bg-white/15 px-3 py-1 text-xs font-extrabold text-[#ffd700]">
              <Sparkles size={14} aria-hidden /> {gentleStreak}-day curiosity streak
            </p>
          )}
          <p className="mt-1 text-[10px] font-bold text-white/45">Age band {band}</p>
        </>
      }
      journeyFooter={{
        to: "/journey",
        label: "See curiosity progress on My Journey",
      }}
    >
      <ul className="flex flex-col gap-3">
        {daily && (
          <SparkCard
            card={daily}
            to={`/curiosity/spark/${daily.id}`}
            label="Daily Curiosity Spark"
            delay={0.04}
          />
        )}
        {weekly && (
          <SparkCard
            card={weekly}
            to={`/curiosity/weekly/${weekly.id}`}
            label="Weekly Spotlight"
            delay={0.08}
          />
        )}
        {monthly && (
          <SparkCard card={monthly} to={themePath} label="Monthly Theme" delay={0.12} />
        )}
      </ul>

      {!daily && !weekly && !monthly && (
        <p className="hub-glass-panel p-4 text-center text-sm font-bold text-white/60">
          No sparks match your settings right now. Ask a grown-up to check Curiosity controls in
          Settings.
        </p>
      )}

      {savedIds.length > 0 && (
        <section>
          <div className="flex items-center gap-2 mb-2">
            <Bookmark size={16} className="text-[#ffd700]" aria-hidden />
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
                    className="flex items-center gap-2 rounded-2xl border border-white/15 bg-white/10 px-3 py-2 text-sm font-bold text-white focus-ring backdrop-blur-md"
                  >
                    <span>{card.visual?.emoji}</span>
                    <span className="truncate flex-1">{card.title}</span>
                    <ChevronRight size={16} className="text-white/40" aria-hidden />
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>
      )}
    </HubPageLayout>
  );
}
