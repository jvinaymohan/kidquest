import { useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import { PhaseProgress } from "../components/multiplication/PhaseProgress";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { defaultTableRow, useMultiplicationStore } from "../store/useMultiplicationStore";
import { computeTableProgress } from "../utils/multiplicationProgress";
import { tablePatterns, MOTIVATIONAL } from "../data/multiplication/tables";
import { ProgressRing } from "../components/ui/ProgressRing";

const PHASE_ROUTES = {
  1: "learn",
  2: "practice",
  3: "drill",
  4: "boss",
};

export default function MultiplicationTable() {
  const { tableNumber: tn } = useParams();
  const tableNumber = Number(tn);
  const stored = useMultiplicationStore((s) => s.tables[tableNumber]);
  const facts = useMultiplicationStore((s) => s.facts);
  const table = useMemo(() => stored ?? defaultTableRow(tableNumber), [stored, tableNumber]);
  const progress = useMemo(
    () => computeTableProgress(facts, tableNumber),
    [facts, tableNumber]
  );
  const unlockAll = useMultiplicationStore((s) => s.unlockAllTables);

  if (!tableNumber || tableNumber < 1 || tableNumber > 20) {
    return <p className="p-4">Invalid table.</p>;
  }

  const unlocked = unlockAll || table?.unlocked;
  const phase = table?.legendAt ? 5 : table?.bossPassed ? 4 : table?.currentPhase ?? 1;
  const pattern = tablePatterns[tableNumber];

  if (!unlocked) {
    return (
      <div className="p-4 text-center">
        <p className="font-display text-xl font-extrabold">Table {tableNumber}× is locked</p>
        <p className="text-sm font-bold text-ink/60 mt-2">
          Legend the previous table to unlock, or ask a parent to unlock all in Settings.
        </p>
        <Link to="/multiplication" className="inline-block mt-4">
          <Button variant="ghost">Back to Camp</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      <Link to="/multiplication" className="text-sm font-bold text-math">
        ← Training Camp
      </Link>

      <div className="flex items-center gap-4">
        <ProgressRing value={progress.pct / 100} size={72} stroke={8} color="#00D4FF">
          <span className="font-display text-2xl font-extrabold">{tableNumber}×</span>
        </ProgressRing>
        <div>
          <h1 className="font-display text-2xl font-extrabold">Table {tableNumber}</h1>
          <p className="text-sm font-bold text-ink/60">
            {progress.practiced}/{progress.total} practiced · {progress.drilled} drilled fast
          </p>
        </div>
      </div>

      <PhaseProgress currentPhase={phase} />

      {pattern && (
        <Card className="bg-cream text-sm font-bold text-ink/80">{pattern}</Card>
      )}

      <p className="text-sm font-bold text-ink/70">{MOTIVATIONAL.startTable(tableNumber)}</p>

      {table.bossPassed && !table.legendAt && (
        <Card className="bg-accent/50 text-center p-4">
          <p className="font-display font-extrabold">Boss beaten! Complete 2 review sessions for Legend ★</p>
          <Link to="/multiplication/review" className="text-math font-bold text-sm mt-2 inline-block">
            Start review →
          </Link>
        </Card>
      )}

      {table.legendAt ? (
        <Card className="bg-mul-gold/20 border-mul-gold text-center p-6">
          <div className="text-4xl">★</div>
          <p className="font-display font-extrabold text-lg mt-2">{MOTIVATIONAL.legend(tableNumber)}</p>
          <p className="text-xs font-bold text-ink/60 mt-1">
            SR reviews: {table.srPasses}/2 for full retention
          </p>
        </Card>
      ) : (
        <div className="grid gap-2">
          {[1, 2, 3, 4].map((p) => {
            const route = PHASE_ROUTES[p];
            const available = phase >= p || (p === 1);
            const current = phase === p || (phase < p && p === phase);
            return (
              <Link
                key={p}
                to={available ? `/multiplication/table/${tableNumber}/${route}` : "#"}
                className={!available ? "pointer-events-none opacity-40" : ""}
              >
                <Card
                  className={`flex justify-between items-center ${
                    current ? "ring-2 ring-mul-electric" : ""
                  }`}
                >
                  <span className="font-display font-extrabold">
                    Phase {p}: {["Learn", "Practice", "Speed Drill", "Boss Battle"][p - 1]}
                  </span>
                  <span className="text-math font-bold">→</span>
                </Card>
              </Link>
            );
          })}
        </div>
      )}

      {phase >= 4 && (
        <Link to={`/multiplication/table/${tableNumber}/boss`}>
          <Button variant="secondary" className="w-full">
            Retry Boss Battle
          </Button>
        </Link>
      )}
    </div>
  );
}
