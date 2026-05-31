import { useMemo } from "react";
import { Link } from "react-router-dom";
import { ProgressRing } from "../ui/ProgressRing";
import { tablePhaseColor } from "../../utils/multiplicationScoring";
import { getFactsForTable } from "../../data/multiplication/tables";
import { defaultTableRow, useMultiplicationStore } from "../../store/useMultiplicationStore";

export function TableCard({ tableNumber }) {
  const stored = useMultiplicationStore((s) => s.tables[tableNumber]);
  const unlockAll = useMultiplicationStore((s) => s.unlockAllTables);
  const facts = useMultiplicationStore((s) => s.facts);

  const table = useMemo(() => stored ?? defaultTableRow(tableNumber), [stored, tableNumber]);

  const progress = useMemo(() => {
    const tableFacts = getFactsForTable(tableNumber);
    const practiced = tableFacts.filter((f) => (facts[f.id]?.practiceHits ?? 0) >= 2).length;
    const drilled = tableFacts.filter((f) => (facts[f.id]?.drillFastHits ?? 0) >= 2).length;
    const pct = Math.round(((practiced + drilled) / (tableFacts.length * 2)) * 100);
    return { practiced, drilled, total: tableFacts.length, pct: Math.min(100, pct) };
  }, [facts, tableNumber]);

  const unlocked = unlockAll || table?.unlocked;
  const phase = table?.legendAt ? 5 : table?.bossPassed ? 4 : table?.currentPhase ?? 1;
  const colors = tablePhaseColor(phase, unlocked);

  const phaseLabel =
    phase >= 5 ? "★" : phase >= 4 ? "Boss" : phase >= 3 ? "Speed" : phase >= 2 ? "Practice" : "Learn";

  const inner = (
    <div
      className={`relative flex flex-col items-center justify-center p-3 rounded-chunky border-[3px] min-h-[88px] transition ${
        colors.glow ? "shadow-[0_0_16px_rgba(255,215,0,0.5)]" : "shadow-chunky"
      } ${!unlocked ? "opacity-60" : ""}`}
      style={{ background: colors.bg, borderColor: colors.ring }}
    >
      <ProgressRing value={progress.pct / 100} size={52} stroke={5} color={colors.ring}>
        <span className="font-display text-lg font-extrabold">{tableNumber}×</span>
      </ProgressRing>
      <span className="text-[10px] font-display font-extrabold mt-1 text-ink/70">
        {unlocked ? phaseLabel : "🔒"}
      </span>
    </div>
  );

  if (!unlocked) {
    return inner;
  }

  return (
    <Link to={`/multiplication/table/${tableNumber}`} className="focus-ring rounded-chunky">
      {inner}
    </Link>
  );
}
