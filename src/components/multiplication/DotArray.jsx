export function DotArray({ rows, cols, maxDots = 80 }) {
  const total = rows * cols;
  const showAll = total <= maxDots;
  const displayRows = showAll ? rows : Math.min(rows, 8);
  const displayCols = showAll ? cols : Math.min(cols, 10);

  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className="inline-grid gap-1 p-3 rounded-xl bg-ink/5"
        style={{
          gridTemplateColumns: `repeat(${displayCols}, minmax(0, 1fr))`,
        }}
      >
        {Array.from({ length: displayRows * displayCols }).map((_, i) => (
          <span
            key={i}
            className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-mul-electric"
          />
        ))}
      </div>
      {!showAll && (
        <p className="text-xs font-bold text-ink/60">
          {rows} rows × {cols} dots = {total} total
        </p>
      )}
    </div>
  );
}
