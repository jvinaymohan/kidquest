import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Lock, RotateCcw } from "lucide-react";
import { useMathMasteryStore } from "../store/useMathMasteryStore";
import { LEVELS, OPERATIONS, STREAK_TARGET } from "../utils/mathMastery/constants";
import { Button } from "../components/ui/Button";

export default function MathMasteryHub() {
  const navigate = useNavigate();
  const progress = useMathMasteryStore((s) => s.progress);
  const timedMode = useMathMasteryStore((s) => s.timedMode);
  const showHints = useMathMasteryStore((s) => s.showHints);
  const setTimedMode = useMathMasteryStore((s) => s.setTimedMode);
  const setShowHints = useMathMasteryStore((s) => s.setShowHints);
  const resetProgress = useMathMasteryStore((s) => s.resetProgress);

  const totalMastered = OPERATIONS.reduce(
    (sum, op) => sum + LEVELS.filter((l) => progress[op.id]?.[l]?.mastered).length,
    0
  );

  return (
    <div className="flex flex-col gap-5 pb-8">
      <button
        type="button"
        onClick={() => navigate("/math")}
        className="self-start flex items-center gap-1 rounded-pill px-2 py-1 font-display font-extrabold text-ink/70 focus-ring"
      >
        <ChevronLeft size={20} /> Math Zone
      </button>

      <motion.header
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-chunky border-[3px] border-primary/30 bg-gradient-to-br from-primary/20 via-white to-accent/30 p-5 text-center"
      >
        <p className="text-4xl" aria-hidden>
          🎯
        </p>
        <h1 className="font-display text-3xl font-extrabold text-ink">Math Master!</h1>
        <p className="mt-1 text-sm font-bold text-ink/60">
          Get {STREAK_TARGET} correct in a row to master each level
        </p>
        <p className="mt-2 font-display text-sm font-extrabold text-primary">
          {totalMastered}/{OPERATIONS.length * LEVELS.length} levels mastered ⭐
        </p>
      </motion.header>

      <div className="grid gap-3">
        {OPERATIONS.map((op, i) => {
          const mastered = LEVELS.filter((l) => progress[op.id]?.[l]?.mastered).length;
          return (
            <motion.div
              key={op.id}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Link
                to={`/math-master/${op.id}`}
                className="chunky-card flex items-center gap-4 p-4 focus-ring"
                style={{ borderColor: `${op.accent}55` }}
              >
                <span
                  className="grid h-14 w-14 place-items-center rounded-2xl text-3xl"
                  style={{ background: `${op.accent}22` }}
                >
                  {op.emoji}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="font-display text-lg font-extrabold">{op.name}</p>
                  <p className="text-sm font-bold text-ink/55">
                    {mastered}/{LEVELS.length} ⭐ mastered
                  </p>
                </div>
                <span className="font-display font-extrabold" style={{ color: op.accent }}>
                  →
                </span>
              </Link>
            </motion.div>
          );
        })}
      </div>

      {/* Progress grid overview */}
      <section className="chunky-card p-4">
        <p className="mb-3 font-display text-sm font-extrabold text-ink">Your progress map</p>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[280px] text-center text-xs font-bold">
            <thead>
              <tr className="text-ink/45">
                <th className="pb-2 text-left">Op</th>
                {LEVELS.map((l) => (
                  <th key={l} className="pb-2 px-1">
                    L{l}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {OPERATIONS.map((op) => (
                <tr key={op.id}>
                  <td className="py-1 text-left">{op.emoji}</td>
                  {LEVELS.map((l) => {
                    const row = progress[op.id]?.[l];
                    const cell = row?.mastered ? "⭐" : row?.unlocked ? "🔵" : "🔒";
                    return (
                      <td key={l} className="py-1 px-1 text-base">
                        {cell}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-2 text-[10px] font-bold text-ink/40">⭐ mastered · 🔵 unlocked · 🔒 locked</p>
      </section>

      <section className="chunky-card p-4 space-y-3">
        <p className="font-display font-extrabold">Settings</p>
        <label className="flex items-center justify-between gap-3 text-sm font-bold">
          <span>Timed mode ({30}s per question)</span>
          <input
            type="checkbox"
            checked={timedMode}
            onChange={(e) => setTimedMode(e.target.checked)}
            className="h-5 w-5 accent-primary"
          />
        </label>
        <label className="flex items-center justify-between gap-3 text-sm font-bold">
          <span>Show hints (level 1)</span>
          <input
            type="checkbox"
            checked={showHints}
            onChange={(e) => setShowHints(e.target.checked)}
            className="h-5 w-5 accent-primary"
          />
        </label>
        <Button
          variant="ghost"
          className="w-full"
          onClick={() => {
            if (confirm("Reset ALL Math Master progress? This cannot be undone.")) resetProgress();
          }}
        >
          <RotateCcw size={16} className="inline mr-2" />
          Reset progress
        </Button>
      </section>
    </div>
  );
}
