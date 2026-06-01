import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, FlaskConical } from "lucide-react";
import { SCIENCE_TOPICS } from "../data/science/topics";
import { useScienceStore } from "../store/useScienceStore";
import { StarRating } from "../components/ui/StarRating";
import { ProgressRing } from "../components/ui/ProgressRing";

export default function ScienceHub() {
  const navigate = useNavigate();
  const topics = useScienceStore((s) => s.topics);
  const completedCount = useScienceStore((s) => s.completedCount());
  const total = SCIENCE_TOPICS.length;
  const pct = total > 0 ? completedCount / total : 0;

  return (
    <div className="flex flex-col gap-4 pb-8">
      <button
        type="button"
        onClick={() => navigate("/home")}
        className="self-start flex items-center gap-1 font-display font-extrabold text-ink/70 focus-ring rounded-pill px-2 py-1"
      >
        <ChevronLeft size={20} /> Home
      </button>

      <header className="rounded-chunky border-[3px] border-[#9B5DE5]/40 bg-gradient-to-br from-[#F0EBFF] via-white to-[#E2CCFA] p-5 text-center">
        <FlaskConical className="mx-auto text-[#9B5DE5]" size={36} />
        <h1 className="mt-2 font-display text-3xl font-extrabold">Science Lab</h1>
        <p className="mt-1 text-sm font-bold text-ink/60">
          Everyday science — sky, plants, body & more
        </p>
        <div className="mt-3 flex items-center justify-center gap-2">
          <ProgressRing value={pct} size={52} stroke={6} color="#9B5DE5">
            <span className="text-xs font-extrabold">{completedCount}/{total}</span>
          </ProgressRing>
          <p className="text-xs font-bold text-ink/55 text-left">
            Topics explored<br />{Math.round(pct * 100)}% complete
          </p>
        </div>
      </header>

      <ul className="flex flex-col gap-3">
        {SCIENCE_TOPICS.map((topic, i) => {
          const prog = topics[topic.id];
          return (
            <motion.li
              key={topic.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
            >
              <Link
                to={`/science/${topic.id}`}
                className="w-full text-left rounded-3xl p-4 flex items-center gap-3 focus-ring ring-1 ring-ink/[0.08] shadow-sm hover:shadow-md"
                style={{ background: topic.accent }}
              >
                <span className="text-3xl">{topic.emoji}</span>
                <div className="flex-1 min-w-0">
                  <p className="font-display font-extrabold text-base" style={{ color: topic.color }}>
                    {topic.title}
                  </p>
                  <p className="text-xs font-medium text-ink/55 mt-0.5">
                    {topic.questions.length} questions
                    {prog?.completed ? " · Done ✓" : ""}
                  </p>
                </div>
                {prog?.bestStars > 0 && <StarRating value={prog.bestStars} size={14} />}
                <ChevronRight className="text-ink/25 shrink-0" size={20} />
              </Link>
            </motion.li>
          );
        })}
      </ul>
    </div>
  );
}
