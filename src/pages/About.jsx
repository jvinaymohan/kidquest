import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { ChevronLeft, Shield, Sparkles, Lightbulb, Compass } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { useAppStore } from "../store/useAppStore";
import { isSupabaseEnabled } from "../lib/supabaseClient";
import { ElegantBackground } from "../components/elegant/ElegantBackground";
import { ElegantLogo } from "../components/elegant/ElegantLogo";
import { HeroEyebrow } from "../components/elegant/ElegantSections";

const SECTIONS = [
  {
    id: "spark",
    icon: Lightbulb,
    title: "The spark",
    body: [
      "A parent on a long car ride noticed something familiar: kids could recite answers fast — capitals, formulas, fun facts — but rarely asked why.",
      "The best moments weren't worksheets. They were questions out the window, silly debates, and \"wait, how does that work?\" KidQuest started there — with curiosity, not memorization.",
    ],
  },
  {
    id: "quest",
    icon: Compass,
    title: "The quest",
    body: [
      "We built worlds where questions are celebrated: geography you can explore, math you can feel, science that sparks wonder, and a Curiosity Hub that's discovery — not a news feed.",
      "Every quest earns real progress — streaks, badges, and levels — because knowing things should feel like an adventure, not a chore.",
    ],
  },
  {
    id: "safe",
    icon: Shield,
    title: "Safe by design",
    body: [
      "KidQuest is invite-only for families we know. No scary headlines, no open kid-to-kid chat, and no ads chasing attention.",
      "Parents stay in control — screen time, PIN-protected settings, and learning you can trust after school.",
    ],
  },
  {
    id: "join",
    icon: Sparkles,
    title: "Join us",
    body: [
      "We're growing carefully with families who care about raising thinkers, not just test-takers.",
      "Request an invite for your crew, or sign in if you're already on the quest.",
    ],
  },
];

export default function About() {
  const reduce = useReducedMotion();
  const session = useAuthStore((s) => s.session);
  const onboarded = useAppStore((s) => s.onboarded);
  const loggedIn = isSupabaseEnabled ? Boolean(session) : onboarded;

  const backTo = loggedIn ? "/home" : "/landing";
  const backLabel = loggedIn ? "Quest Home" : "Back";

  return (
    <div className="elegant-page about-page relative min-h-[100dvh] w-full">
      <ElegantBackground reduceMotion={reduce} />
      <div className="about-page-inner relative z-10 mx-auto w-full max-w-2xl px-4 py-8 pb-12 sm:px-6">
        <header className="flex items-center justify-between gap-3">
          <Link
            to={backTo}
            className="inline-flex items-center gap-1 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-extrabold text-white/80 focus-ring"
          >
            <ChevronLeft size={16} aria-hidden />
            {backLabel}
          </Link>
          <ElegantLogo size={32} reduceMotion={reduce} mascotSize={16} />
        </header>

        <motion.div
          className="about-hero mt-6 text-center"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
        >
          <HeroEyebrow />
          <h1 className="mt-3 font-display text-[clamp(1.75rem,5vw,2.5rem)] font-extrabold leading-tight text-white">
            How it all started
          </h1>
          <p className="about-hero-lead mx-auto mt-3 max-w-md text-sm font-semibold leading-relaxed text-white/60">
            KidQuest exists for kids who ask why — and parents who want learning beyond the
            classroom, done safely.
          </p>
        </motion.div>

        <div className="mt-8 flex flex-col gap-4">
          {SECTIONS.map((section, i) => (
            <AboutSection key={section.id} section={section} index={i} reduce={reduce} />
          ))}
        </div>

        <motion.div
          className="about-cta mt-8 rounded-3xl border border-white/15 bg-white/10 p-6 text-center backdrop-blur-md"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
        >
          <p className="font-display text-lg font-extrabold text-white">Ready to quest?</p>
          <p className="mt-1 text-sm font-bold text-white/55">
            Free for invited families · Ages 6–14 · No ads
          </p>
          <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:justify-center">
            {loggedIn ? (
              <Link
                to="/home"
                className="about-cta-primary focus-ring"
              >
                Back to learning
              </Link>
            ) : (
              <>
                <Link to="/invite-request" className="about-cta-primary focus-ring">
                  Request an invite
                </Link>
                <Link to="/login" className="about-cta-secondary focus-ring">
                  Sign in
                </Link>
              </>
            )}
          </div>
        </motion.div>

        <footer className="about-footer mt-8 text-center text-[11px] font-bold text-white/40">
          <Link to="/terms" className="about-footer-link focus-ring">
            Terms
          </Link>
          {" · "}
          <Link to="/privacy" className="about-footer-link focus-ring">
            Privacy
          </Link>
          {" · "}
          <Link to={backTo} className="about-footer-link focus-ring">
            {loggedIn ? "Quest Home" : "Landing"}
          </Link>
        </footer>
      </div>
    </div>
  );
}

function AboutSection({ section, index, reduce }) {
  const Icon = section.icon;
  return (
    <motion.article
      className="about-section-card"
      initial={reduce ? false : { opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.08 + index * 0.06 }}
    >
      <div className="about-section-icon" aria-hidden>
        <Icon size={22} className="text-[#ffd700]" />
      </div>
      <h2 className="font-display text-xl font-extrabold text-white">{section.title}</h2>
      {section.body.map((paragraph) => (
        <p key={paragraph.slice(0, 24)} className="mt-2 text-sm font-semibold leading-relaxed text-white/65">
          {paragraph}
        </p>
      ))}
    </motion.article>
  );
}
