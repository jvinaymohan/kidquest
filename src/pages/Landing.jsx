import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { Mascot } from "../components/mascots/Mascot";
import { GoogleSignInButton } from "../components/auth/GoogleSignInButton";
import { isGoogleOAuthEnabled } from "../lib/featureFlags";
import { SpaceBackground } from "../components/home/SpaceBackground";

const LIVE_WORLDS = [
  { emoji: "🌍", name: "Geography", from: "#1a7a3c", to: "#27ae60", shadow: "0 10px 30px rgba(39,174,96,0.4)", xp: 50 },
  { emoji: "🔢", name: "Math", from: "#1a5fa0", to: "#2980b9", shadow: "0 10px 30px rgba(41,128,185,0.4)", xp: 40 },
  { emoji: "🪐", name: "Space", from: "#c0392b", to: "#e74c3c", shadow: "0 10px 30px rgba(231,76,60,0.4)", xp: 60 },
];

const PILLARS = [
  { emoji: "🎮", title: "Play to learn" },
  { emoji: "⭐", title: "Earn XP & badges" },
  { emoji: "🛡️", title: "Safe for kids" },
];

export default function Landing() {
  const reduce = useReducedMotion();

  return (
    <div className="home-v2 home-v2-scroll relative">
      <SpaceBackground reduceMotion={reduce} />

      <div className="relative z-10 mx-auto flex min-h-[100dvh] w-full max-w-5xl flex-col items-center px-5 py-[max(1.5rem,env(safe-area-inset-top))] pb-[max(1.5rem,env(safe-area-inset-bottom))] lg:px-10">
        <motion.section
          className="w-full shrink-0 text-center"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
        >
          <p className="home-v2-badge mx-auto">🎮 Free Learning for Curious Kids</p>

          <div className="relative mx-auto mt-6">
            <div className={reduce ? "" : "home-v2-logo-ring mx-auto grid place-items-center"}>
              <div
                className={`home-v2-logo-inner grid place-items-center ${reduce ? "mx-auto h-[5.5rem] w-[5.5rem] rounded-full bg-[#1a1060]" : ""}`}
              >
                <Mascot kind="rocket" size={48} animate={!reduce} />
              </div>
            </div>
            {!reduce && (
              <>
                <span className="absolute -right-2 -top-1 text-lg" aria-hidden>
                  ⭐
                </span>
                <span className="absolute -left-3 bottom-0 text-sm" aria-hidden>
                  ✨
                </span>
                <span className="absolute -left-4 top-5 text-xs" aria-hidden>
                  💫
                </span>
              </>
            )}
          </div>

          <h1 className="mt-4 font-display text-[3.2rem] font-extrabold leading-none tracking-tight sm:text-[3.6rem]">
            <span className="text-white">Kid</span>
            <span className="home-v2-title-quest">Quest</span>
          </h1>
          <p className="mx-auto mt-3 max-w-xs text-base font-bold leading-relaxed text-white/70">
            Explore worlds, earn points & XP, and master skills — the fun way to learn!
          </p>

          <div className="mt-5 flex flex-wrap justify-center gap-2.5">
            {PILLARS.map((p) => (
              <span
                key={p.title}
                className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3.5 py-1.5 text-xs font-bold text-white backdrop-blur-md"
              >
                <span aria-hidden>{p.emoji}</span>
                {p.title}
              </span>
            ))}
          </div>
        </motion.section>

        <motion.section
          className="mt-8 w-full max-w-[25rem] shrink-0 space-y-3.5"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.12, duration: 0.4 }}
        >
          <Link
            to="/invite-request"
            className="flex w-full items-center justify-center gap-2 rounded-[1.25rem] bg-white/95 px-8 py-4 font-display text-[17px] font-extrabold text-[#1a1060] shadow-[0_8px_30px_rgba(255,255,255,0.2)] transition hover:-translate-y-0.5 hover:scale-[1.02] focus-ring active:scale-[0.98]"
          >
            ✨ Request an invite
          </Link>
          <Link
            to="/register"
            className="home-v2-play flex w-full max-w-none items-center justify-center gap-2 focus-ring"
          >
            🚀 I have an invite code
          </Link>
          <p className="text-center text-sm font-bold text-white/60">
            Already in?{" "}
            <Link to="/login" className="font-extrabold text-[#FFD700] hover:underline focus-ring rounded">
              Sign in
            </Link>
          </p>
          {isGoogleOAuthEnabled && (
            <div className="pt-1">
              <div className="mb-2 flex items-center gap-2">
                <div className="h-px flex-1 bg-white/15" />
                <span className="text-[10px] font-bold uppercase text-white/40">or</span>
                <div className="h-px flex-1 bg-white/15" />
              </div>
              <GoogleSignInButton />
            </div>
          )}
        </motion.section>

        <motion.section
          className="mt-10 w-full shrink-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="mb-5 flex items-center justify-center gap-2">
            <span className="home-v2-live-dot" aria-hidden />
            <p className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-white/50">Live now</p>
          </div>
          <div className="flex flex-wrap justify-center gap-4 lg:gap-8">
            {LIVE_WORLDS.map((w) => (
              <div
                key={w.name}
                className="home-v2-subject-card pointer-events-none"
                style={{
                  background: `linear-gradient(145deg, ${w.from}, ${w.to})`,
                  boxShadow: w.shadow,
                }}
              >
                <span className="home-v2-card-emoji" aria-hidden>
                  {w.emoji}
                </span>
                <span className="home-v2-card-name">{w.name}</span>
                <span className="home-v2-card-xp">+{w.xp} XP</span>
              </div>
            ))}
          </div>
          <p className="mt-5 text-center text-[13px] italic text-white/40">
            History, music, trivia & more — coming soon after sign-in 🎉
          </p>
        </motion.section>

        <footer className="mt-auto w-full shrink-0 pt-8 text-center">
          <p className="text-[10px] font-bold text-white/40">
            <Link to="/terms" className="text-[#FFD700] underline focus-ring">
              Terms
            </Link>
            {" · "}
            <Link to="/privacy" className="text-[#FFD700] underline focus-ring">
              Privacy
            </Link>
          </p>
        </footer>
      </div>
    </div>
  );
}
