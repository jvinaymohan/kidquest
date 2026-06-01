import { Sparkles } from "lucide-react";
import { ElegantLogo } from "./ElegantLogo";

/** Fixed top bar — logo left, getting-started pill right (always visible). */
export function LandingTopBar({ onOpenGettingStarted, reduceMotion = false }) {
  return (
    <header className="landing-top-bar" role="banner">
      <div className="landing-top-bar-brand">
        <ElegantLogo size={36} reduceMotion={reduceMotion} mascotSize={18} />
        <span className="landing-top-bar-wordmark">
          <span className="text-white">Kid</span>
          <span className="elegant-title-grad">Quest</span>
        </span>
      </div>
      <button
        type="button"
        className="landing-get-started-pill focus-ring"
        onClick={onOpenGettingStarted}
        aria-haspopup="dialog"
      >
        <Sparkles size={14} aria-hidden className="landing-get-started-fab-icon" />
        <span>Let&apos;s get started</span>
      </button>
    </header>
  );
}
