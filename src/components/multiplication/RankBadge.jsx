import { useMemo } from "react";
import { useMultiplicationStore } from "../../store/useMultiplicationStore";
import { rankForLegendaryCount } from "../../utils/multiplicationScoring";
import { countLegendaryTables } from "../../utils/multiplicationProgress";

export function RankBadge({ compact }) {
  const legendary = useMultiplicationStore((s) => countLegendaryTables(s.tables));
  const rank = useMemo(() => rankForLegendaryCount(legendary), [legendary]);

  if (compact) {
    return (
      <span className="text-xs font-bold text-ink/70">
        {rank.emoji} {rank.title}
      </span>
    );
  }

  return (
    <div className="rounded-chunky border-[3px] border-mul-gold/50 bg-gradient-to-r from-mul-dark to-mul-electric/30 p-4 text-white">
      <div className="text-xs font-display font-extrabold uppercase tracking-wide text-mul-gold">
        Multiplication Rank
      </div>
      <div className="font-display text-xl font-extrabold mt-1">
        {rank.emoji} {rank.title}
      </div>
      <div className="text-sm font-bold text-white/80 mt-1">
        {legendary} / 20 tables legendary
      </div>
    </div>
  );
}
