import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { ElegantBackground } from "../components/elegant/ElegantBackground";
import { GettingStartedModal } from "../components/elegant/GettingStartedModal";
import { LandingTopBar } from "../components/elegant/LandingTopBar";
import { LandingMarketingSections } from "../components/elegant/LandingPeek";
import { HeroEyebrow } from "../components/elegant/ElegantSections";
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

      <div className="landing-page-inner relative z-10 mx-auto w-full max-w-5xl px-4 pb-8 pt-[4.25rem] sm:px-6 sm:pt-[4.5rem]">
        <motion.header
          className="landing-hero landing-hero-compact mb-6 flex flex-col items-center text-center"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
        >
          <HeroEyebrow />
          <p className="landing-hook mt-2">{LANDING_HOOK}</p>
        </motion.header>

        <LandingMarketingSections onGetStarted={openGettingStarted} />

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
