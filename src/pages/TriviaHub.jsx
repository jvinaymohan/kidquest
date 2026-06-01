import { Star } from "lucide-react";
import { TRIVIA_CATEGORIES, categoriesByGroup } from "../data/trivia/categories";
import { useTriviaStore } from "../store/useTriviaStore";
import { useAppStore } from "../store/useAppStore";
import { StarRating } from "../components/ui/StarRating";
import { HubPageLayout, HubSectionLabel } from "../components/layout/HubPageLayout";
import { HubTopicCard } from "../components/layout/HubTopicCard";

export default function TriviaHub() {
  const ageGroup = useAppStore((s) => s.ageGroup);
  const categories = useTriviaStore((s) => s.categories);
  const completedCount = useTriviaStore((s) => s.completedCount());
  const grouped = categoriesByGroup();

  return (
    <HubPageLayout
      title="Trivia Galaxy"
      subtitle={`${TRIVIA_CATEGORIES.length} categories · 1000s of curious facts`}
      icon={<Star className="mx-auto text-[#ff8fa3]" size={36} fill="currentColor" aria-hidden />}
      headerClassName="border-trivia/35"
      headerExtra={
        <p className="mt-2 text-xs font-extrabold text-[#ff8fa3] uppercase tracking-wide">
          {completedCount} categories mastered · Age: {ageGroup}
        </p>
      }
      journeyFooter={{
        to: "/journey",
        label: "See trivia progress on My Journey",
      }}
    >
      {Object.entries(grouped).map(([group, cats]) => (
        <section key={group}>
          <HubSectionLabel>{group}</HubSectionLabel>
          <ul className="flex flex-col gap-2">
            {cats.map((cat, i) => {
              const key = `${cat.id}-${ageGroup}`;
              const prog = categories[key];
              return (
                <HubTopicCard
                  key={cat.id}
                  to={`/trivia/${cat.id}`}
                  emoji={cat.emoji}
                  title={cat.title}
                  subtitle={`${cat.questions.length} questions${prog?.completed ? " · ✓ Done" : ""}`}
                  accent={{ background: "rgba(255,255,255,0.12)" }}
                  delay={i * 0.02}
                  trailing={
                    prog?.bestStars > 0 ? <StarRating value={prog.bestStars} size={12} /> : null
                  }
                />
              );
            })}
          </ul>
        </section>
      ))}
    </HubPageLayout>
  );
}
