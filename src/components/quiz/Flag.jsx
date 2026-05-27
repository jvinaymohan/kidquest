import clsx from "clsx";

export function Flag({ code, size = "md", rounded = true, className = "" }) {
  if (!code) return null;
  const cls = String(code).toLowerCase();
  const sizes = {
    sm: "w-6 h-4",
    md: "w-10 h-7",
    lg: "w-16 h-11",
    xl: "w-24 h-16",
  };
  return (
    <span
      role="img"
      aria-label={`Flag of ${code}`}
      className={clsx(
        "inline-block bg-cover bg-center border-[2px] border-ink/20 shadow-chunky shrink-0",
        sizes[size] ?? sizes.md,
        rounded ? "rounded-md" : "rounded",
        `fi fi-${cls}`,
        className
      )}
    />
  );
}
