import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { TRIVIA_CATEGORIES, categoriesByGroup } from "../data/trivia/categories";
import { useTriviaStore } from "../store/useTriviaStore";
import { useAppStore } from "../store/useAppStore";
import { StarRating } from "../components/ui/StarRating";

export default function TriviaHub() {
  const navigate = useNavigate();
  const ageGroup = useAppStore((s) => s.ageGroup);
  const categories = useTriviaStore((s) => s.categories);
  const completedCount = useTriviaStore((s) => s.completedCount());
  const grouped = categoriesByGroup();

  return (
    <div className="flex flex-col gap-4 pb-8">
      <button
        type="button"
        onClick={() => navigate("/home")}
        className="self-start flex items-center gap-1 font-display font-extrabold text-ink/70 focus-ring rounded-pill px-2 py-1"
      >
        <ChevronLeft size={20} /> Home
      </button>

      <header className="rounded-chunky border-[3px] border-trivia/40 bg-gradient-to-br from-[#FFC9CE] via-white to-[#FFE5E8] p-5 text-center">
        <Star className="mx-auto text-trivia" size={36} fill="currentColor" />
        <h1 className="mt-2 font-display text-3xl font-extrabold">Trivia Galaxy</h1>
        <p className="mt-1 text-sm font-bold text-ink/60">
          {TRIVIA_CATEGORIES.length} categories · 1000s of curious facts
        </p>
        <p className="mt-2 text-xs font-extrabold text-trivia uppercase tracking-wide">
          {completedCount} categories mastered · Age: {ageGroup}
        </p>
      </header>

      {Object.entries(grouped).map(([group, cats]) => (
        <section key={group}>
          <h2 className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-ink/45 mb-2 px-1">
            {group}
          </h2>
          <ul className="flex flex-col gap-2">
            {cats.map((cat, i) => {
              const key = `${cat.id}-${ageGroup}`;
              const prog = categories[key];
              return (
                <motion.li
                  key={cat.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.02 }}
                >
                  <Link
                    to={`/trivia/${cat.id}`}
                    className="w-full text-left rounded-2xl p-3 flex items-center gap-3 focus-ring ring-1 ring-ink/[0.06] bg-white hover:shadow-sm"
                  >
                    <span className="text-2xl">{cat.emoji}</span>
                    <div className="flex-1 min-w-0">
                      <p className="font-display font-extrabold text-sm">{cat.title}</p>
                      <p className="text-[10px] font-bold text-ink/45">
                        {cat.questions.length} questions
                        {prog?.completed ? " · ✓ Done" : ""}
                      </p>
                    </div>
                    {prog?.bestStars > 0 && <StarRating value={prog.bestStars} size={12} />}
                    <ChevronRight className="text-ink/20 shrink-0" size={18} />
                  </Link>
                </motion.li>
              );
            })}
          </ul>
        </section>
      ))}
    </div>
  );
}
