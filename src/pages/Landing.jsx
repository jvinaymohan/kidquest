import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { GoogleSignInButton } from "../components/auth/GoogleSignInButton";
import { isGoogleOAuthEnabled } from "../lib/featureFlags";
import { ElegantBackground } from "../components/elegant/ElegantBackground";
import { ElegantLogo } from "../components/elegant/ElegantLogo";
import {
  BeyondSchoolGrid,
  CuriosityTeaser,
  HeroEyebrow,
  HeroPills,
  HERO_PILLS,
  LandingBottomCta,
  LifeSkillsStrip,
  StatsRow,
  WonderQuote,
  WorldsShowcase,
} from "../components/elegant/ElegantSections";

export default function Landing() {
  const reduce = useReducedMotion();

  return (
    <div className="elegant-page home-v2 home-v2-scroll relative min-h-[100dvh] w-full">
      <ElegantBackground reduceMotion={reduce} />

      <div className="relative z-10 mx-auto w-full max-w-5xl px-5 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-[max(1.25rem,env(safe-area-inset-top))] lg:px-8">
        <motion.section
          className="flex flex-col items-center px-2 py-10 text-center sm:py-14"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <HeroEyebrow />

          <div className="mt-8">
            <ElegantLogo size={110} reduceMotion={reduce} mascotSize={44} />
          </div>

          <h1 className="elegant-hero-title mt-6">
            <span className="text-white">Kid</span>
            <span className="elegant-title-grad">Quest</span>
          </h1>
          <p className="elegant-hero-sub mt-2">where wonder never stops</p>

          <div className="mt-6">
            <HeroPills pills={HERO_PILLS} />
          </div>

          <div className="elegant-hero-btns mt-10">
            <Link to="/register" className="elegant-btn-primary focus-ring">
              🚀 I have an invite code
            </Link>
            <Link to="/invite-request" className="elegant-btn-secondary focus-ring">
              ✨ Request an invite
            </Link>
          </div>
          <p className="elegant-signin">
            Already a member?{" "}
            <Link to="/login" className="focus-ring rounded">
              Sign in
            </Link>
          </p>
          {isGoogleOAuthEnabled && (
            <div className="mt-6 w-full max-w-[25rem]">
              <div className="mb-3 flex items-center gap-2">
                <div className="h-px flex-1 bg-white/15" />
                <span className="text-[10px] font-bold uppercase text-white/40">or</span>
                <div className="h-px flex-1 bg-white/15" />
              </div>
              <GoogleSignInButton />
            </div>
          )}
        </motion.section>

        <div className="elegant-landing-wrap">
          <CuriosityTeaser />
          <BeyondSchoolGrid />
        </div>

        <LifeSkillsStrip />
        <WonderQuote />
        <StatsRow />

        <div className="elegant-landing-wrap px-2">
          <WorldsShowcase interactive={false} />
        </div>

        <LandingBottomCta />

        <footer className="pb-6 pt-2 text-center">
          <p className="text-[10px] font-bold text-white/40">
            <Link to="/terms" className="text-[#f5c842] underline focus-ring">
              Terms
            </Link>
            {" · "}
            <Link to="/privacy" className="text-[#f5c842] underline focus-ring">
              Privacy
            </Link>
          </p>
        </footer>
      </div>
    </div>
  );
}
