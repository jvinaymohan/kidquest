const PHASES = ["Learn", "Practice", "Drill", "Boss", "Legend"];

export function PhaseProgress({ currentPhase }) {
  return (
    <div className="flex items-center justify-center gap-1 flex-wrap">
      {PHASES.map((label, i) => {
        const phase = i + 1;
        const active = phase === currentPhase;
        const done = phase < currentPhase;
        return (
          <div key={label} className="flex items-center gap-1">
            <div
              className={`px-2 py-0.5 rounded-full text-[10px] font-display font-extrabold border-2 ${
                done
                  ? "bg-mul-gold/30 border-mul-gold text-ink"
                  : active
                    ? "bg-mul-electric/20 border-mul-electric text-ink"
                    : "bg-ink/5 border-ink/15 text-ink/40"
              }`}
            >
              {phase === 5 && done ? "★" : phase}
            </div>
            {i < PHASES.length - 1 && (
              <span className="text-ink/20 text-xs">→</span>
            )}
          </div>
        );
      })}
    </div>
  );
}
