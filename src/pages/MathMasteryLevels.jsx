import { Link, useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronLeft, Lock, Star } from "lucide-react";
import { useMathMasteryStore } from "../store/useMathMasteryStore";
import {
  LEVELS,
  STREAK_TARGET,
  fractionLevelLabel,
  getOperation,
  levelLabel,
} from "../utils/mathMastery/constants";

export default function MathMasteryLevels() {
  const { operationId } = useParams();
  const navigate = useNavigate();
  const operation = getOperation(operationId);
  const progress = useMathMasteryStore((s) => s.progress[operationId] ?? {});
  const isUnlocked = useMathMasteryStore((s) => s.isLevelUnlocked);

  if (!operation) {
    return (
      <div className="p-4">
        <p>Operation not found.</p>
        <Link to="/math-master">Back</Link>
      </div>
    );
  }

  const labelFn = operationId === "fractions" ? fractionLevelLabel : levelLabel;

  return (
    <div className="flex flex-col gap-5 pb-8">
      <button
        type="button"
        onClick={() => navigate("/math-master")}
        className="self-start flex items-center gap-1 rounded-pill px-2 py-1 font-display font-extrabold text-ink/70 focus-ring"
      >
        <ChevronLeft size={20} /> Math Master
      </button>

      <header
        className="rounded-chunky border-[3px] p-5 text-center"
        style={{ borderColor: `${operation.accent}55`, background: `${operation.accent}15` }}
      >
        <span className="text-4xl">{operation.emoji}</span>
        <h1 className="mt-2 font-display text-2xl font-extrabold">{operation.name}</h1>
        <p className="text-sm font-bold text-ink/60">Master each level — {STREAK_TARGET} correct in a row wins!</p>
      </header>

      <ul className="flex flex-col gap-3">
        {LEVELS.map((lvl, i) => {
          const row = progress[lvl];
          const unlocked = isUnlocked(operationId, lvl);
          const mastered = row?.mastered;
          return (
            <motion.li
              key={lvl}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
            >
              {unlocked ? (
                <Link
                  to={`/math-master/${operationId}/level/${lvl}`}
                  className={`chunky-card flex items-center gap-4 p-4 focus-ring ${
                    mastered ? "ring-2 ring-mul-gold bg-mul-gold/10" : ""
                  }`}
                >
                  <span
                    className="grid h-12 w-12 place-items-center rounded-full font-display text-lg font-extrabold text-white"
                    style={{ background: operation.accent }}
                  >
                    {mastered ? <Star size={22} fill="white" /> : lvl}
                  </span>
                  <div className="flex-1">
                    <p className="font-display font-extrabold">Level {lvl}</p>
                    <p className="text-xs font-bold text-ink/55">{labelFn(lvl)}</p>
                    {row?.bestStreak > 0 && (
                      <p className="text-[10px] font-bold text-ink/45">
                        Best streak: {row.bestStreak}/{STREAK_TARGET}
                      </p>
                    )}
                  </div>
                  <span className="font-display font-extrabold text-primary">
                    {mastered ? "Practice →" : "Play →"}
                  </span>
                </Link>
              ) : (
                <div className="chunky-card flex items-center gap-4 p-4 opacity-55">
                  <span className="grid h-12 w-12 place-items-center rounded-full bg-ink/20 text-ink/50">
                    <Lock size={20} />
                  </span>
                  <div>
                    <p className="font-display font-extrabold">Level {lvl}</p>
                    <p className="text-xs font-bold text-ink/50">Beat level {lvl - 1} to unlock!</p>
                  </div>
                </div>
              )}
            </motion.li>
          );
        })}
      </ul>
    </div>
  );
}
