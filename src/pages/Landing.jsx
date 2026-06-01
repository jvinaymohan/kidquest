import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { ElegantBackground } from "../components/elegant/ElegantBackground";
import { GettingStartedModal } from "../components/elegant/GettingStartedModal";
import { LandingTopBar } from "../components/elegant/LandingTopBar";
import { LandingMarketingSections } from "../components/elegant/LandingPeek";
import { HeroEyebrow, WonderQuote } from "../components/elegant/ElegantSections";
import { LANDING_HOOK } from "../components/elegant/elegantContent";

export default function Landing() {
  const reduce = useReducedMotion();
  const [gettingStartedOpen, setGettingStartedOpen] = useState(false);

  const openGettingStarted = () => setGettingStartedOpen(true);
  const closeGettingStarted = () => setGettingStartedOpen(false);

  return (
    <div className="elegant-page landing-page relative min-h-[100dvh] w-full">
      <ElegantBackground reduceMotion={reduce} />
      <LandingTopBar onOpenGettingStarted={openGettingStarted} reduceMotion={reduce} />
      <GettingStartedModal open={gettingStartedOpen} onClose={closeGettingStarted} />

      <div className="landing-page-inner relative z-10 mx-auto w-full max-w-5xl px-4 pb-6 pt-[3.75rem] sm:px-6 sm:pt-[4rem]">
        <motion.div
          className="landing-hero-quote"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
        >
          <WonderQuote compact />
        </motion.div>

        <LandingMarketingSections onGetStarted={openGettingStarted} />

        <footer className="landing-footer pb-8 pt-2 text-center">
          <div className="landing-footer-tagline mb-4 flex flex-col items-center gap-2">
            <HeroEyebrow />
            <p className="landing-hook">{LANDING_HOOK}</p>
          </div>
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
