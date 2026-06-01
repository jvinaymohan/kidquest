import { useEffect, useState } from "react";
import {
  BeyondSchoolGrid,
  CuriosityTeaser,
  LandingBottomCta,
  LifeSkillsStrip,
  WonderQuote,
  WorldsShowcase,
} from "./ElegantSections";
import { BEYOND_SCHOOL_CARDS, LANDING_MINI_WORLDS } from "./elegantContent";

/** Value-first content visible above the fold (no auth CTAs). */
export function LandingAboveFoldValue() {
  const peekCards = BEYOND_SCHOOL_CARDS.slice(0, 3);

  return (
    <div className="landing-fold-value" aria-label="What makes KidQuest special">
      <CuriosityTeaser compact />

      <div className="landing-beyond-peek">
        <p className="landing-section-label">Beyond school</p>
        <div className="landing-beyond-peek-grid">
          {peekCards.map((card) => (
            <div key={card.id} className={`landing-beyond-peek-card ${card.glow}`}>
              <span className="landing-beyond-peek-icon" aria-hidden>
                {card.icon}
              </span>
              <span className="landing-beyond-peek-tag">{card.tag}</span>
              <span className="landing-beyond-peek-title">{card.title}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="landing-worlds-mini">
        <p className="landing-section-label landing-worlds-mini-label">6 live worlds</p>
        <div className="landing-worlds-row">
          {LANDING_MINI_WORLDS.map((w) => (
            <div key={w.id} className={`landing-world-chip ${w.gradient}`}>
              <span className="landing-world-chip-emoji" aria-hidden>
                {w.emoji}
              </span>
              <span className="landing-world-chip-name">{w.name}</span>
            </div>
          ))}
        </div>
        <p className="landing-worlds-tease">50+ worlds unlocking as you quest</p>
      </div>
    </div>
  );
}

/** Full marketing story — visible on scroll (not behind a toggle). */
export function LandingMarketingSections({ onGetStarted }) {
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

      <LandingBottomCta onGetStarted={onGetStarted} />
    </div>
  );
}

/** Appears after scrolling past the hero — opens getting-started modal. */
export function LandingStickyBar({ onOpenGettingStarted }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 320);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!visible) return null;

  return (
    <div className="landing-sticky-bar" role="navigation" aria-label="Get started">
      <span className="landing-sticky-brand">
        <span className="text-white">Kid</span>
        <span className="elegant-title-grad">Quest</span>
      </span>
      <button
        type="button"
        className="landing-sticky-cta focus-ring"
        onClick={onOpenGettingStarted}
      >
        Let&apos;s get started
      </button>
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
