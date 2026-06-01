import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { ElegantBackground } from "../components/elegant/ElegantBackground";
import { ElegantLogo } from "../components/elegant/ElegantLogo";
import { LandingGettingStarted } from "../components/elegant/LandingGettingStarted";
import {
  LandingMarketingSections,
  LandingScrollCue,
  LandingStickyBar,
} from "../components/elegant/LandingPeek";
import { HeroEyebrow } from "../components/elegant/ElegantSections";
import { LANDING_HOOK } from "../components/elegant/elegantContent";

export default function Landing() {
  const reduce = useReducedMotion();

  return (
    <div className="elegant-page landing-page relative min-h-[100dvh] w-full">
      <ElegantBackground reduceMotion={reduce} />
      <LandingStickyBar />

      <div className="landing-page-inner relative z-10 mx-auto w-full max-w-5xl px-4 sm:px-6">
        <section className="landing-above-fold flex min-h-[100dvh] flex-col">
          <motion.header
            className="landing-hero flex flex-1 flex-col items-center justify-center text-center"
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
          <LandingScrollCue />
        </section>

        <LandingMarketingSections />

        <footer className="landing-footer pb-8 pt-4 text-center">
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
