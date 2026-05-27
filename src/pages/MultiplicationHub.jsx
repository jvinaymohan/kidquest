import { useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Zap, Trophy } from "lucide-react";
import { TableGrid } from "../components/multiplication/TableGrid";
import { RankBadge } from "../components/multiplication/RankBadge";
import { PersonalBestChart } from "../components/multiplication/PersonalBestChart";
import { Button } from "../components/ui/Button";
import { useMultiplicationStore } from "../store/useMultiplicationStore";
import { useAppStore } from "../store/useAppStore";
import { formatMs, medalForRun } from "../utils/multiplicationScoring";
import { MOTIVATIONAL } from "../data/multiplication/tables";

export default function MultiplicationHub() {
  const due = useMultiplicationStore((s) => s.getDueReviews());
  const phase3Count = useMultiplicationStore((s) => s.tablesAtPhase3Plus());
  const speedRuns = useMultiplicationStore((s) => s.speedRuns);
  const best = useMultiplicationStore((s) => s.bestSpeedRun);
  const streak = useMultiplicationStore((s) => s.practiceStreakDays);
  const tableOfDay = useMultiplicationStore((s) => s.tableOfTheDay);
  const legendary = useMultiplicationStore((s) => s.getLegendaryCount());
  const grantBadge = useAppStore((s) => s.grantBadge);

  useEffect(() => {
    if (legendary >= 20) grantBadge("mul_grand_multiplier");
  }, [legendary, grantBadge]);

  const canSpeedRun = phase3Count >= 5;

  return (
    <div className="flex flex-col gap-5 pb-8">
      <motion.header
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-chunky border-[3px] border-mul-electric/40 bg-gradient-to-br from-mul-dark via-math to-mul-electric/30 p-5 text-white"
      >
        <div className="flex items-start gap-3">
          <Zap className="text-mul-gold shrink-0" size={32} />
          <div>
            <h1 className="font-display text-2xl font-extrabold">Multiplication Training Camp</h1>
            <p className="text-sm font-bold text-white/85 mt-1">
              Master tables 1–20. Own every fact. Win the 50-question speed run.
            </p>
          </div>
        </div>
        {legendary === 20 && (
          <p className="mt-3 text-sm font-extrabold text-mul-gold">{MOTIVATIONAL.grandMultiplier}</p>
        )}
      </motion.header>

      <RankBadge />

      {due.length > 0 && (
        <Link
          to="/multiplication/review"
          className="chunky-card p-4 flex items-center justify-between bg-accent border-[3px] border-ink/15 focus-ring"
        >
          <span className="font-display font-extrabold">Review Due ({due.length})</span>
          <span className="text-xs font-bold bg-error/20 px-2 py-1 rounded-pill">Quick 10</span>
        </Link>
      )}

      {streak >= 3 && (
        <p className="text-center text-sm font-bold text-success">{MOTIVATIONAL.dailyStreak(streak)}</p>
      )}

      <div className="text-center text-xs font-bold text-ink/60">
        Table of the Day: <span className="text-math font-extrabold">{tableOfDay}×</span> (3× XP)
      </div>

      <section>
        <h2 className="font-display text-lg font-extrabold mb-2">Your Tables</h2>
        <TableGrid />
      </section>

      <section className="chunky-card p-4 border-[3px] border-mul-gold/40">
        <div className="flex items-center gap-2 mb-2">
          <Trophy className="text-mul-gold" size={22} />
          <h2 className="font-display text-lg font-extrabold">50-Question Speed Run</h2>
        </div>
        {best && (
          <p className="text-sm font-bold text-ink/70 mb-2">
            Personal best: {best.score}/50 in {formatMs(best.totalTimeMs)}
            {best.medal && ` · ${medalForRun(best.score, best.totalTimeMs).emoji}`}
          </p>
        )}
        <PersonalBestChart runs={speedRuns} />
        {canSpeedRun ? (
          <Link to="/multiplication/speed-run" className="block mt-3">
            <Button className="w-full bg-mul-dark text-mul-gold border-mul-electric">
              Start Speed Run
            </Button>
          </Link>
        ) : (
          <p className="text-sm font-bold text-ink/50 mt-2">
            Unlock after 5 tables reach Speed Drill (Phase 3+). You have {phase3Count}/5.
          </p>
        )}
      </section>
    </div>
  );
}
