import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { ElegantBackground } from "../components/elegant/ElegantBackground";
import { ElegantLogo } from "../components/elegant/ElegantLogo";
import { LandingGettingStarted } from "../components/elegant/LandingGettingStarted";
import {
  CuriosityPeekStrip,
  LandingLearnMore,
  WorldsMiniRow,
} from "../components/elegant/LandingPeek";
import { HeroEyebrow } from "../components/elegant/ElegantSections";
import { LANDING_HOOK } from "../components/elegant/elegantContent";

export default function Landing() {
  const reduce = useReducedMotion();
  const [learnMoreOpen, setLearnMoreOpen] = useState(false);

  return (
    <div
      className={`elegant-page landing-fit relative min-h-[100dvh] w-full ${learnMoreOpen ? "landing-fit-expanded" : ""}`}
    >
      <ElegantBackground reduceMotion={reduce} />

      <div className="landing-fit-shell relative z-10 mx-auto flex h-full w-full max-w-5xl flex-col px-4 sm:px-6">
        <motion.header
          className="landing-hero flex flex-col items-center text-center"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
        >
          <HeroEyebrow />
          <div className="landing-hero-logo-wrap">
            <ElegantLogo size={84} reduceMotion={reduce} mascotSize={36} />
          </div>
          <h1 className="elegant-hero-title landing-hero-title">
            <span className="text-white">Kid</span>
            <span className="elegant-title-grad">Quest</span>
          </h1>
          <p className="landing-hook">{LANDING_HOOK}</p>
        </motion.header>

        <LandingGettingStarted />
        <CuriosityPeekStrip />
        <WorldsMiniRow />

        <footer className="landing-footer mt-auto">
          <LandingLearnMore
            expanded={learnMoreOpen}
            onToggle={() => setLearnMoreOpen((open) => !open)}
          />
          <p className="landing-footer-meta">
            100% free · Safe for ages 6–14 · No ads
            {" · "}
            <Link to="/terms" className="landing-footer-link focus-ring">
              Terms
            </Link>
            {" · "}
            <Link to="/privacy" className="landing-footer-link focus-ring">
              Privacy
            </Link>
          </p>
        </footer>
      </div>
    </div>
  );
}
