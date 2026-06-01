import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronLeft, Sparkles, Trophy } from "lucide-react";
import { useAppStore } from "../store/useAppStore";
import { useGeographyStore } from "../store/useGeographyStore";
import { useScienceStore } from "../store/useScienceStore";
import { useTriviaStore } from "../store/useTriviaStore";
import { useCuriosityStore } from "../store/useCuriosityStore";
import { useMathMasteryStore } from "../store/useMathMasteryStore";
import { useMultiplicationStore } from "../store/useMultiplicationStore";
import { SCIENCE_TOPICS } from "../data/science/topics";
import { TRIVIA_CATEGORIES } from "../data/trivia/categories";
import { COUNTRIES } from "../data/geography/countries";
import { LEVELS, OPERATIONS } from "../utils/mathMastery/constants";
import { subjectProgress } from "../utils/content";
import { xpToNextLevel } from "../utils/scoring";
import { ProgressRing } from "../components/ui/ProgressRing";
import { BADGE_BY_ID } from "../data/badges";

export default function MyJourney() {
  const navigate = useNavigate();
  const {
    kidName,
    ageGroup,
    lessonProgress,
    totalXP,
    badges,
    currentStreak,
  } = useAppStore();

  const geoMastered = useGeographyStore((s) => s.masteredCountryCount());
  const scienceDone = useScienceStore((s) => s.completedCount());
  const triviaDone = useTriviaStore((s) => s.completedCount());
  const mathProgress = useMathMasteryStore((s) => s.progress);
  const mulLegendary = useMultiplicationStore((s) => s.getLegendaryCount());
  const curiosityCompleted = useCuriosityStore((s) => s.completedCardIds?.length ?? 0);
  const curiositySaved = useCuriosityStore((s) => (s.savedIds ?? []).length);
  const curiosityStreak = useCuriosityStore((s) => s.gentleStreak ?? 0);

  const geoStats = subjectProgress("geography", ageGroup, lessonProgress);
  const solarStats = subjectProgress("solar-system", ageGroup, lessonProgress);

  const mathMastered = OPERATIONS.reduce(
    (sum, op) => sum + LEVELS.filter((l) => mathProgress[op.id]?.[l]?.mastered).length,
    0
  );
  const mathTotal = OPERATIONS.length * LEVELS.length;
  const level = xpToNextLevel(totalXP);

  const recentBadges = (badges ?? [])
    .slice(-3)
    .map((id) => BADGE_BY_ID[id])
    .filter(Boolean);

  const cards = [
    {
      id: "geography",
      emoji: "🌍",
      title: "Geography",
      pct: geoStats.masteryPct,
      detail: `${geoMastered} countries in deck · ${geoStats.mastered}/${geoStats.total} lessons`,
      path: "/subject/geography",
      color: "var(--geography)",
    },
    {
      id: "math",
      emoji: "🔢",
      title: "Math",
      pct: mathMastered / mathTotal,
      detail: `${mathMastered}/${mathTotal} mastery levels · ${mulLegendary}/20 legendary tables`,
      path: "/math",
      color: "var(--math)",
    },
    {
      id: "solar",
      emoji: "🪐",
      title: "Solar System",
      pct: solarStats.masteryPct,
      detail: `${solarStats.mastered}/${solarStats.total} lessons · ${solarStats.stars}⭐`,
      path: "/subject/solar-system",
      color: "var(--solar-system)",
    },
    {
      id: "science",
      emoji: "🧪",
      title: "Science",
      pct: scienceDone / Math.max(1, SCIENCE_TOPICS.length),
      detail: `${scienceDone}/${SCIENCE_TOPICS.length} topics explored`,
      path: "/science",
      color: "#9B5DE5",
    },
    {
      id: "trivia",
      emoji: "⭐",
      title: "Trivia",
      pct: triviaDone / Math.max(1, TRIVIA_CATEGORIES.length),
      detail: `${triviaDone}/${TRIVIA_CATEGORIES.length} categories · 1000s of facts`,
      path: "/trivia",
      color: "var(--trivia)",
    },
    {
      id: "curiosity",
      emoji: "🔭",
      title: "Curiosity Hub",
      pct: Math.min(1, curiosityCompleted / 12),
      detail: `${curiosityCompleted} explored · ${curiositySaved} saved · ${curiosityStreak}-day streak`,
      path: "/curiosity",
      color: "#7B68EE",
    },
  ];

  return (
    <div className="flex flex-col gap-4 pb-8">
      <button
        type="button"
        onClick={() => navigate("/home")}
        className="self-start flex items-center gap-1 font-display font-extrabold text-ink/70 focus-ring rounded-pill px-2 py-1"
      >
        <ChevronLeft size={20} /> Home
      </button>

      <header className="rounded-chunky border-[3px] border-primary/30 bg-gradient-to-br from-[#1a1060] via-[#2d1b8e] to-[#4a2cc7] p-5 text-center text-white">
        <Sparkles className="mx-auto text-[#ffd700]" size={32} />
        <h1 className="mt-2 font-display text-2xl font-extrabold">
          Look what you discovered, {kidName || "Explorer"}!
        </h1>
        <p className="mt-1 text-sm font-bold text-white/70">
          Level {level.level} {level.emoji} · {currentStreak}-day streak · {COUNTRIES.length} countries to explore
        </p>
      </header>

      <ul className="flex flex-col gap-3">
        {cards.map((card, i) => (
          <motion.li
            key={card.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <button
              type="button"
              onClick={() => navigate(card.path)}
              className="w-full text-left rounded-3xl p-4 flex items-center gap-3 focus-ring ring-1 ring-ink/[0.08] shadow-sm bg-white hover:shadow-md"
            >
              <span className="text-3xl">{card.emoji}</span>
              <div className="flex-1 min-w-0">
                <p className="font-display font-extrabold text-base">{card.title}</p>
                <p className="text-xs font-medium text-ink/55 mt-0.5">{card.detail}</p>
              </div>
              <ProgressRing value={card.pct} size={48} stroke={6} color={card.color}>
                <span className="text-[10px] font-extrabold">{Math.round(card.pct * 100)}%</span>
              </ProgressRing>
            </button>
          </motion.li>
        ))}
      </ul>

      {recentBadges.length > 0 && (
        <section className="chunky-card p-4">
          <div className="flex items-center gap-2 mb-3">
            <Trophy size={18} className="text-primary" />
            <h2 className="font-display font-extrabold">Recent badges</h2>
          </div>
          <ul className="flex flex-wrap gap-2">
            {recentBadges.map((b) => (
              <li
                key={b.id}
                className="flex items-center gap-2 bg-bg rounded-2xl px-3 py-2 text-sm font-bold"
              >
                <span>{b.emoji}</span> {b.name}
              </li>
            ))}
          </ul>
        </section>
      )}

      <p className="text-[11px] font-medium text-ink/45 text-center">
        Keep exploring — every quest makes your brain stronger!
      </p>
    </div>
  );
}
