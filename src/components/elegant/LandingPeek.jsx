import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  BeyondSchoolGrid,
  CuriosityTeaser,
  LandingBottomCta,
  LifeSkillsStrip,
  WonderQuote,
  WorldsShowcase,
} from "./ElegantSections";

/** Full marketing story — visible on scroll (not behind a toggle). */
export function LandingMarketingSections() {
  return (
    <div className="landing-marketing" aria-label="Why families choose KidQuest">
      <section id="why-kidquest" className="landing-marketing-section">
        <CuriosityTeaser />
        <BeyondSchoolGrid />
      </section>

      <section id="life-skills" className="landing-marketing-section">
        <LifeSkillsStrip />
        <WonderQuote />
      </section>

      <section id="worlds" className="landing-marketing-section">
        <div className="elegant-landing-wrap px-1">
          <WorldsShowcase interactive={false} />
        </div>
      </section>

      <LandingBottomCta />
    </div>
  );
}

/** Appears after scrolling past the hero. */
export function LandingStickyBar() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 320);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!visible) return null;

  return (
    <div className="landing-sticky-bar" role="navigation" aria-label="Sign in">
      <span className="landing-sticky-brand">
        <span className="text-white">Kid</span>
        <span className="elegant-title-grad">Quest</span>
      </span>
      <div className="landing-sticky-actions">
        <Link to="/login" className="landing-sticky-link focus-ring">
          Sign in
        </Link>
        <Link to="/register" className="landing-sticky-cta focus-ring">
          Get started
        </Link>
      </div>
    </div>
  );
}

export function LandingScrollCue() {
  return (
    <p className="landing-scroll-cue" aria-hidden>
      Scroll to see what&apos;s inside
      <span className="landing-scroll-cue-arrow">↓</span>
    </p>
  );
}
