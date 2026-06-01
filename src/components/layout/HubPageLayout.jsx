import clsx from "clsx";
import { Link } from "react-router-dom";
import { Calendar, ChevronRight } from "lucide-react";
import { PlayCosmicShell } from "./PlayCosmicShell";

/**
 * Canonical hub layout: cosmic background, glass header, optional journey footer.
 * Back / Quest Home live in AppShell TopBar — do not add inline "← Home" here.
 */
export function HubPageLayout({
  title,
  subtitle,
  icon,
  headerClassName,
  headerExtra,
  journeyFooter,
  children,
  className,
}) {
  return (
    <PlayCosmicShell className={clsx("pb-4", className)}>
      <header className={clsx("hub-glass-header text-center", headerClassName)}>
        {icon}
        <h1 className="mt-2 elegant-serif text-3xl font-bold text-white">{title}</h1>
        {subtitle && (
          <p className="mt-1 text-sm font-bold text-white/65">{subtitle}</p>
        )}
        {headerExtra}
      </header>

      {children}

      {journeyFooter && (
        <HubJourneyLink to={journeyFooter.to} label={journeyFooter.label} />
      )}
    </PlayCosmicShell>
  );
}

export function HubJourneyLink({ to = "/journey", label = "See your progress on My Journey" }) {
  return (
    <Link
      to={to}
      className="hub-journey-link focus-ring"
    >
      <Calendar size={18} className="shrink-0 text-[#ffd700]" aria-hidden />
      <span className="flex-1">{label}</span>
      <ChevronRight size={16} className="shrink-0 text-white/40" aria-hidden />
    </Link>
  );
}

export function HubSectionLabel({ children }) {
  return (
    <h2 className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-white/45 mb-2 px-1">
      {children}
    </h2>
  );
}
