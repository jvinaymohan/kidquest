import {
  BeyondSchoolGrid,
  CuriosityTeaser,
  LandingBottomCta,
  LifeSkillsStrip,
  WorldsShowcase,
} from "./ElegantSections";
import { LandingPickAreas } from "./LandingPickAreas";

/** Full marketing story — scroll order matches product spec. */
export function LandingMarketingSections({ onGetStarted }) {
  return (
    <div className="landing-marketing" aria-label="Why families choose KidQuest">
      <section id="what-is-kidquest" className="landing-marketing-section">
        <CuriosityTeaser compact />
        <BeyondSchoolGrid onComingSoon={() => {}} />
      </section>

      <section id="life-skills" className="landing-marketing-section">
        <LifeSkillsStrip />
      </section>

      <section className="landing-marketing-section">
        <LandingPickAreas onGetStarted={onGetStarted} />
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
