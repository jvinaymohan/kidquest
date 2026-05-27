import clsx from "clsx";

const KEYS = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "⌫", "0", "✓"];

export function AnswerKeypad({ value, onChange, onSubmit, disabled, dark }) {
  function press(key) {
    if (disabled) return;
    if (key === "⌫") {
      onChange(value.slice(0, -1));
      return;
    }
    if (key === "✓") {
      onSubmit?.();
      return;
    }
    if (value.length >= 4) return;
    onChange(value + key);
  }

  return (
    <div
      className={clsx(
        "grid grid-cols-3 gap-2 w-full max-w-sm mx-auto",
        dark && "text-mul-gold"
      )}
    >
      {KEYS.map((key) => (
        <button
          key={key}
          type="button"
          disabled={disabled}
          onClick={() => press(key)}
          className={clsx(
            "min-h-[72px] sm:min-h-[80px] rounded-chunky border-[3px] font-display text-2xl font-extrabold focus-ring transition active:scale-95 disabled:opacity-40",
            dark
              ? "bg-mul-dark border-mul-electric/40 text-mul-gold hover:bg-mul-electric/10"
              : "bg-white border-ink/20 text-ink hover:bg-accent/30",
            key === "✓" && (dark ? "bg-mul-electric text-mul-dark" : "bg-success/30 border-success")
          )}
        >
          {key}
        </button>
      ))}
    </div>
  );
}
