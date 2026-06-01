import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Sparkles, Trophy } from "lucide-react";
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
import { HubPageLayout } from "../components/layout/HubPageLayout";

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
      detail: `${geoMastered}/${COUNTRIES.length} countries mastered`,
      path: "/subject/geography",
      color: "#2EC4B6",
    },
    {
      id: "solar",
      emoji: "🪐",
      title: "Solar System",
      pct: solarStats.masteryPct,
      detail: `${solarStats.mastered}/${solarStats.total} lessons mastered`,
      path: "/subject/solar-system",
      color: "#7B68EE",
    },
    {
      id: "science",
      emoji: "🧪",
      title: "Science Lab",
      pct: scienceDone / Math.max(1, SCIENCE_TOPICS.length),
      detail: `${scienceDone}/${SCIENCE_TOPICS.length} topics done`,
      path: "/science",
      color: "#9B5DE5",
    },
    {
      id: "trivia",
      emoji: "⭐",
      title: "Trivia Galaxy",
      pct: triviaDone / Math.max(1, TRIVIA_CATEGORIES.length),
      detail: `${triviaDone}/${TRIVIA_CATEGORIES.length} categories done`,
      path: "/trivia",
      color: "#FF6B6B",
    },
    {
      id: "math",
      emoji: "🎯",
      title: "Math Master",
      pct: mathMastered / mathTotal,
      detail: `${mathMastered}/${mathTotal} levels mastered`,
      path: "/math-master",
      color: "#3A86FF",
    },
    {
      id: "mul",
      emoji: "⚡",
      title: "Multiplication",
      pct: mulLegendary / 20,
      detail: `${mulLegendary}/20 legendary tables`,
      path: "/multiplication",
      color: "#FFD700",
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
    <HubPageLayout
      title={`Look what you discovered, ${kidName || "Explorer"}!`}
      subtitle={`Level ${level.level} ${level.emoji} · ${currentStreak}-day streak · ${COUNTRIES.length} countries to explore`}
      icon={<Sparkles className="mx-auto text-[#ffd700]" size={32} aria-hidden />}
      headerClassName="border-primary/30"
    >
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
              className="hub-topic-card"
            >
              <span className="text-3xl shrink-0">{card.emoji}</span>
              <div className="flex-1 min-w-0">
                <p className="font-display font-extrabold text-base text-white">{card.title}</p>
                <p className="text-xs font-medium text-white/55 mt-0.5">{card.detail}</p>
              </div>
              <ProgressRing value={card.pct} size={48} stroke={6} color={card.color}>
                <span className="text-[10px] font-extrabold text-white">
                  {Math.round(card.pct * 100)}%
                </span>
              </ProgressRing>
            </button>
          </motion.li>
        ))}
      </ul>

      {recentBadges.length > 0 && (
        <section className="hub-glass-panel p-4">
          <div className="flex items-center gap-2 mb-3">
            <Trophy size={18} className="text-[#ffd700]" aria-hidden />
            <h2 className="font-display font-extrabold text-white">Recent badges</h2>
          </div>
          <ul className="flex flex-wrap gap-2">
            {recentBadges.map((b) => (
              <li
                key={b.id}
                className="flex items-center gap-2 rounded-2xl bg-white/10 px-3 py-2 text-sm font-bold text-white"
              >
                <span>{b.emoji}</span> {b.name}
              </li>
            ))}
          </ul>
        </section>
      )}

      <p className="text-[11px] font-medium text-white/45 text-center">
        Keep exploring — every quest makes your brain stronger!
      </p>
    </HubPageLayout>
  );
}
