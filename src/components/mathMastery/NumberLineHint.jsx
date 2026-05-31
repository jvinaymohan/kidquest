export function NumberLineHint({ max = 12 }) {
  const n = Math.min(20, Math.max(5, max));
  return (
    <div className="rounded-2xl bg-accent/30 px-3 py-3">
      <p className="mb-2 text-center text-xs font-bold text-ink/55">Number line hint</p>
      <div className="flex items-center gap-0.5 overflow-x-auto no-scrollbar">
        {Array.from({ length: n + 1 }, (_, i) => (
          <div key={i} className="flex shrink-0 flex-col items-center">
            <span className="h-2 w-0.5 bg-ink/30" />
            <span className="font-display text-[10px] font-extrabold text-ink/60">{i}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
