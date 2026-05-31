import { motion } from "framer-motion";

export function NumberKeypad({ value, onChange, onSubmit, disabled, allowFractions }) {
  const keys = allowFractions
    ? ["1", "2", "3", "4", "5", "6", "7", "8", "9", "/", "0", "⌫"]
    : ["1", "2", "3", "4", "5", "6", "7", "8", "9", "R", "0", "⌫"];

  function press(key) {
    if (disabled) return;
    if (key === "⌫") {
      onChange(value.slice(0, -1));
      return;
    }
    if (key === "R" && value.includes("R")) return;
    if (key === "/" && value.includes("/")) return;
    onChange(value + key);
  }

  return (
    <div className="flex flex-col gap-3">
      <input
        type="text"
        inputMode="text"
        value={value}
        onChange={(e) => !disabled && onChange(e.target.value)}
        placeholder="Your answer"
        disabled={disabled}
        className="w-full min-h-[56px] rounded-2xl border-[3px] border-ink/15 bg-white px-4 text-center font-display text-[2rem] font-extrabold text-ink focus-ring"
      />
      <div className="grid grid-cols-3 gap-2">
        {keys.map((k) => (
          <motion.button
            key={k}
            type="button"
            whileTap={{ scale: 0.94 }}
            disabled={disabled}
            onClick={() => press(k)}
            className="min-h-[52px] rounded-2xl border-[3px] border-ink/10 bg-white font-display text-xl font-extrabold text-ink shadow-sm focus-ring disabled:opacity-40"
          >
            {k}
          </motion.button>
        ))}
      </div>
      <button
        type="button"
        disabled={disabled || !value.trim()}
        onClick={onSubmit}
        className="min-h-[52px] rounded-2xl bg-primary font-display text-lg font-extrabold text-white shadow-lg focus-ring disabled:opacity-40"
      >
        Check ✓
      </button>
    </div>
  );
}
