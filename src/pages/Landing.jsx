import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Rocket, Sparkles } from "lucide-react";
import { Mascot } from "../components/mascots/Mascot";
import { GoogleSignInButton } from "../components/auth/GoogleSignInButton";
import { isGoogleOAuthEnabled } from "../lib/featureFlags";

const MASCOTS = [
  { kind: "owl", bg: "rgba(42,157,143,0.18)" },
  { kind: "robot", bg: "rgba(58,134,255,0.18)" },
  { kind: "dino", bg: "rgba(155,93,229,0.18)" },
  { kind: "cat", bg: "rgba(251,133,0,0.18)" },
  { kind: "panda", bg: "rgba(230,57,70,0.18)" },
];

const SUBJECT_TILES = [
  { id: "geography", icon: "🌍", name: "Geography", bg: "#2A9D8F18", color: "#0F6E56" },
  { id: "history", icon: "📜", name: "History", bg: "#D4A01718", color: "#633806" },
  { id: "math", icon: "🔢", name: "Math", bg: "#3A86FF18", color: "#0C447C" },
  { id: "music", icon: "🎵", name: "Music", bg: "#9B5DE518", color: "#3C3489" },
  { id: "general-knowledge", icon: "💡", name: "Knowledge", bg: "#FB850018", color: "#633806" },
  { id: "solar-system", icon: "🪐", name: "Solar System", bg: "#E6394618", color: "#791F1F" },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-cream flex justify-center">
      <div className="w-full max-w-md flex flex-col">
        <section className="bg-mul-dark px-6 pt-10 pb-7 text-center">
          <span className="inline-block bg-[#EEEDFE] text-[#534AB7] text-[11px] font-extrabold px-2.5 py-1 rounded-pill tracking-wide">
            Free for every kid on Earth
          </span>
          <h1 className="font-display text-4xl font-extrabold text-mul-gold mt-3 leading-none">
            KidQuest
          </h1>
          <p className="text-sm text-white/65 mt-2 font-bold">
            Explore the world. Master everything. Have fun doing it.
          </p>

          <div className="flex justify-center gap-2 mt-5">
            {MASCOTS.map((m, i) => (
              <motion.div
                key={m.kind}
                initial={{ y: -12, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: i * 0.08, type: "spring", stiffness: 220, damping: 18 }}
                className="w-12 h-12 rounded-full grid place-items-center"
                style={{ background: m.bg }}
              >
                <Mascot kind={m.kind} size={36} />
              </motion.div>
            ))}
          </div>
        </section>

        <section className="px-5 pt-5">
          <Link
            to="/register"
            className="w-full inline-flex items-center justify-center gap-2 bg-primary text-white font-display font-extrabold py-3.5 rounded-pill shadow-chunky focus-ring"
          >
            <Rocket size={18} /> Have an invite? Create account
          </Link>
          <Link
            to="/invite-request"
            className="mt-2 w-full inline-flex items-center justify-center gap-2 bg-white text-ink font-display font-extrabold py-3 rounded-pill ring-1 ring-ink/15 focus-ring"
          >
            <Sparkles size={16} /> Need access? Request invite
          </Link>

          {isGoogleOAuthEnabled && (
            <>
              <div className="flex items-center gap-3 mt-3 mb-1">
                <div className="flex-1 h-px bg-ink/15" />
                <span className="text-[11px] font-bold text-ink/50">existing users</span>
                <div className="flex-1 h-px bg-ink/15" />
              </div>
              <div className="mt-2">
                <GoogleSignInButton />
              </div>
            </>
          )}
          <p className="text-center text-[10px] font-bold text-ink/50 mt-3 px-2">
            By continuing you agree to our{" "}
            <Link to="/terms" className="text-primary underline">
              Terms
            </Link>{" "}
            and{" "}
            <Link to="/privacy" className="text-primary underline">
              Privacy Policy
            </Link>
            .
          </p>

          <p className="text-center text-xs text-ink/55 font-bold mt-4">
            Already exploring?{" "}
            <Link to="/login" className="text-primary font-extrabold">
              Sign in
            </Link>
          </p>
        </section>

        <p className="text-[11px] font-extrabold text-ink/45 px-5 mt-5 mb-2 tracking-wide uppercase">
          What you'll explore
        </p>
        <section className="grid grid-cols-3 gap-2 px-4 pb-4">
          {SUBJECT_TILES.map((s) => (
            <div
              key={s.id}
              className="rounded-2xl py-3 text-center"
              style={{ background: s.bg }}
            >
              <div className="text-2xl">{s.icon}</div>
              <div className="text-xs font-extrabold mt-1" style={{ color: s.color }}>
                {s.name}
              </div>
            </div>
          ))}
        </section>

        <p className="text-center text-[11px] font-bold text-ink/40 px-5 py-4 flex items-center justify-center gap-2">
          <Sparkles size={12} /> Designed by Vinay · Built with Cursor · Knowledge is free
        </p>
      </div>
    </div>
  );
}

