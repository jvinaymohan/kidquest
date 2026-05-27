import clsx from "clsx";

export function LearnTabs({ active, onChange, showLearn }) {
  return (
    <div className="flex gap-2 p-1 bg-ink/5 rounded-pill border-[2.5px] border-ink/10">
      <button
        type="button"
        onClick={() => onChange("lessons")}
        className={clsx(
          "flex-1 font-display font-extrabold text-sm py-2 rounded-pill focus-ring transition-colors",
          active === "lessons" ? "bg-white shadow-chunkySm text-ink" : "text-ink/60"
        )}
      >
        Lessons
      </button>
      {showLearn && (
        <button
          type="button"
          onClick={() => onChange("learn")}
          className={clsx(
            "flex-1 font-display font-extrabold text-sm py-2 rounded-pill focus-ring transition-colors",
            active === "learn" ? "bg-white shadow-chunkySm text-ink" : "text-ink/60"
          )}
        >
          Learn
        </button>
      )}
    </div>
  );
}
