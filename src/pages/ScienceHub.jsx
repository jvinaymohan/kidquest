import { FlaskConical } from "lucide-react";
import { SCIENCE_TOPICS } from "../data/science/topics";
import { useScienceStore } from "../store/useScienceStore";
import { StarRating } from "../components/ui/StarRating";
import { ProgressRing } from "../components/ui/ProgressRing";
import { HubPageLayout } from "../components/layout/HubPageLayout";
import { HubTopicCard } from "../components/layout/HubTopicCard";

export default function ScienceHub() {
  const topics = useScienceStore((s) => s.topics);
  const completedCount = useScienceStore((s) => s.completedCount());
  const total = SCIENCE_TOPICS.length;
  const pct = total > 0 ? completedCount / total : 0;

  return (
    <HubPageLayout
      title="Science Lab"
      subtitle="Everyday science — sky, plants, body & more"
      icon={<FlaskConical className="mx-auto text-[#c4b5fd]" size={36} aria-hidden />}
      headerClassName="border-[#9B5DE5]/35"
      headerExtra={
        <div className="mt-3 flex items-center justify-center gap-2">
          <ProgressRing value={pct} size={52} stroke={6} color="#9B5DE5">
            <span className="text-xs font-extrabold text-white">
              {completedCount}/{total}
            </span>
          </ProgressRing>
          <p className="text-xs font-bold text-white/55 text-left">
            Topics explored
            <br />
            {Math.round(pct * 100)}% complete
          </p>
        </div>
      }
      journeyFooter={{
        to: "/journey",
        label: "See science progress on My Journey",
      }}
    >
      <ul className="flex flex-col gap-3">
        {SCIENCE_TOPICS.map((topic, i) => {
          const prog = topics[topic.id];
          return (
            <HubTopicCard
              key={topic.id}
              to={`/science/${topic.id}`}
              emoji={topic.emoji}
              title={topic.title}
              subtitle={`${topic.questions.length} questions${prog?.completed ? " · Done ✓" : ""}`}
              accent={{ background: topic.accent, color: topic.color }}
              delay={i * 0.04}
              trailing={
                prog?.bestStars > 0 ? <StarRating value={prog.bestStars} size={14} /> : null
              }
            />
          );
        })}
      </ul>
    </HubPageLayout>
  );
}
