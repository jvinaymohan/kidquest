import { formatMs } from "../../utils/multiplicationScoring";

export function TimerDisplay({ ms, countdown, label, dark }) {
  const display =
    countdown != null
      ? `${Math.max(0, Math.ceil(countdown / 1000))}s`
      : formatMs(ms ?? 0);

  return (
    <div
      className={`font-display font-extrabold tabular-nums ${
        dark ? "text-mul-electric" : "text-ink"
      } ${countdown != null && countdown < 2000 ? "text-error animate-pulse" : ""}`}
    >
      {label && (
        <span className="text-xs block opacity-70 font-bold">{label}</span>
      )}
      <span className={countdown != null ? "text-3xl" : "text-lg"}>{display}</span>
    </div>
  );
}
