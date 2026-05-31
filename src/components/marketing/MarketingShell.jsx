import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Mascot } from "../mascots/Mascot";

/**
 * Shared layout for landing + auth pages (pre-login).
 * Centered, kid-friendly sky theme matching Home v2.
 */
export function MarketingShell({
  mascot = "rocket",
  badge,
  title,
  subtitle,
  backTo = "/landing",
  backLabel = "Back",
  children,
  wide = false,
}) {
  return (
    <div className="marketing-page relative min-h-screen overflow-x-hidden">
      <div className="marketing-blob marketing-blob-a" aria-hidden />
      <div className="marketing-blob marketing-blob-b" aria-hidden />
      <div className="marketing-stars" aria-hidden />

      <div
        className={`relative mx-auto flex min-h-screen w-full flex-col px-4 py-6 ${
          wide ? "max-w-lg" : "max-w-md"
        }`}
      >
        {backTo && (
          <Link
            to={backTo}
            className="mb-4 inline-flex w-fit items-center gap-1 rounded-full bg-white/80 px-3 py-1.5 text-xs font-extrabold text-ink/55 shadow-sm ring-1 ring-white focus-ring"
          >
            ← {backLabel}
          </Link>
        )}

        <motion.header
          className="text-center"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        >
          {badge && <p className="marketing-badge mx-auto">{badge}</p>}
          <div className="relative mx-auto mt-4 flex h-24 w-24 items-center justify-center">
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary/30 via-accent/40 to-secondary/30 blur-md" />
            <div className="relative grid h-20 w-20 place-items-center rounded-full bg-white shadow-lg ring-4 ring-white">
              <Mascot kind={mascot} size={56} />
            </div>
          </div>
          {title && (
            <h1 className="mt-4 font-display text-[1.75rem] font-extrabold leading-tight text-ink sm:text-[2rem]">
              {title}
            </h1>
          )}
          {subtitle && (
            <p className="mx-auto mt-2 max-w-[20rem] text-sm font-semibold leading-relaxed text-ink/60">
              {subtitle}
            </p>
          )}
        </motion.header>

        <motion.div
          className="mt-6 flex flex-1 flex-col"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.45 }}
        >
          {children}
        </motion.div>

        <footer className="mt-8 pb-4 text-center">
          <Link to="/landing" className="font-display text-sm font-extrabold text-ink/40 hover:text-primary">
            KidQuest
          </Link>
          <div className="mt-2 flex justify-center gap-3 text-[11px] font-bold text-ink/35">
            <Link to="/privacy" className="hover:text-primary focus-ring">
              Privacy
            </Link>
            <Link to="/terms" className="hover:text-primary focus-ring">
              Terms
            </Link>
          </div>
        </footer>
      </div>
    </div>
  );
}

export function MarketingCard({ children, className = "" }) {
  return (
    <div className={`marketing-card ${className}`}>{children}</div>
  );
}

export function MarketingInput({ label, children, hint }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-xs font-extrabold uppercase tracking-wide text-ink/50">{label}</span>
      {children}
      {hint && <span className="text-[11px] font-semibold text-ink/45">{hint}</span>}
    </label>
  );
}

export const inputClass =
  "w-full rounded-xl border-2 border-ink/10 bg-white px-3.5 py-3 font-display text-base font-bold text-ink placeholder:text-ink/30 focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/20";

export function MarketingPrimaryButton({ children, type = "button", disabled, onClick, as: As = "button", to }) {
  const className =
    "marketing-btn-primary w-full focus-ring disabled:opacity-50 disabled:cursor-not-allowed";
  if (As === "link" && to) {
    return (
      <Link to={to} className={`${className} inline-block text-center`}>
        {children}
      </Link>
    );
  }
  return (
    <button type={type} disabled={disabled} onClick={onClick} className={className}>
      {children}
    </button>
  );
}

export function MarketingSecondaryButton({ children, to }) {
  return (
    <Link to={to} className="marketing-btn-secondary w-full text-center focus-ring">
      {children}
    </Link>
  );
}

export function MarketingError({ children }) {
  if (!children) return null;
  return <p className="rounded-xl bg-error/10 px-3 py-2.5 text-sm font-bold text-error">{children}</p>;
}

export function MarketingSuccess({ children }) {
  if (!children) return null;
  return (
    <p className="rounded-xl bg-success/15 px-3 py-2.5 text-sm font-bold text-[#1d6b2a]">{children}</p>
  );
}
