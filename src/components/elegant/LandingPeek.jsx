import { Link } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import {
  BeyondSchoolGrid,
  CuriosityTeaser,
  LifeSkillsStrip,
  StatsRow,
  WonderQuote,
  WorldsShowcase,
} from "./ElegantSections";
import { LANDING_MINI_WORLDS, LANDING_PEEK_CARDS } from "./elegantContent";

export function CuriosityPeekStrip() {
  return (
    <section className="landing-peek" aria-label="Why KidQuest">
      <div className="landing-peek-row">
        {LANDING_PEEK_CARDS.map((card) => (
          <Link key={card.title} to={card.to} className="landing-peek-card focus-ring">
            <span className="landing-peek-icon" aria-hidden>
              {card.icon}
            </span>
            <span className="landing-peek-title">{card.title}</span>
            <span className="landing-peek-desc">{card.desc}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}

export function WorldsMiniRow() {
  return (
    <section className="landing-worlds-mini" aria-label="Live worlds preview">
      <p className="landing-section-label landing-worlds-mini-label">Live worlds</p>
      <div className="landing-worlds-row">
        {LANDING_MINI_WORLDS.map((world) => (
          <div
            key={world.id}
            className={`landing-world-chip ${world.gradient}`}
            title={world.name}
          >
            <span className="landing-world-chip-emoji" aria-hidden>
              {world.emoji}
            </span>
            <span className="landing-world-chip-name">{world.name}</span>
          </div>
        ))}
      </div>
      <p className="landing-worlds-tease">
        <Link to="/register" className="focus-ring rounded">
          Sign in to explore
        </Link>
      </p>
    </section>
  );
}

export function LandingLearnMore({ expanded, onToggle }) {
  return (
    <div className="landing-learn-more">
      <button
        type="button"
        className="landing-learn-more-btn focus-ring"
        onClick={onToggle}
        aria-expanded={expanded}
      >
        {expanded ? "Show less" : "Learn more"}
        <ChevronDown
          className={`landing-learn-more-chevron ${expanded ? "landing-learn-more-chevron-open" : ""}`}
          size={16}
          aria-hidden
        />
      </button>
      {expanded && (
        <div className="landing-learn-more-panel">
          <CuriosityTeaser compact />
          <BeyondSchoolGrid />
          <LifeSkillsStrip />
          <WonderQuote />
          <StatsRow />
          <div className="elegant-landing-wrap px-1">
            <WorldsShowcase interactive={false} />
          </div>
        </div>
      )}
    </div>
  );
}
