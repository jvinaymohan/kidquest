import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronLeft, Zap, Calculator } from "lucide-react";

export default function MathHub() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col gap-5 pb-8">
      <button
        type="button"
        onClick={() => navigate("/home")}
        className="self-start flex items-center gap-1 rounded-pill px-2 py-1 font-display font-extrabold text-ink/70 focus-ring"
      >
        <ChevronLeft size={20} /> Home
      </button>

      <motion.header
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-chunky border-[3px] border-math/40 bg-gradient-to-br from-[#C5DBFF] via-white to-[#dbeafe] p-5 text-center"
      >
        <Calculator className="mx-auto text-math" size={36} />
        <h1 className="mt-2 font-display text-3xl font-extrabold text-ink">Math Zone</h1>
        <p className="mt-1 text-sm font-bold text-ink/60">Pick your math adventure</p>
      </motion.header>

      <Link
        to="/math-master"
        className="chunky-card flex items-center gap-4 p-5 focus-ring border-[3px] border-primary/30 bg-gradient-to-r from-white to-accent/20"
      >
        <span className="grid h-14 w-14 place-items-center rounded-2xl bg-primary/15 text-3xl">🎯</span>
        <div className="flex-1 text-left">
          <p className="font-display text-xl font-extrabold">Math Master!</p>
          <p className="text-sm font-bold text-ink/60">
            Add, subtract, multiply, divide & fractions — 25 in a row to level up
          </p>
        </div>
        <span className="font-display font-extrabold text-primary">Go →</span>
      </Link>

      <Link
        to="/multiplication"
        className="chunky-card flex items-center gap-4 p-5 focus-ring border-[3px] border-mul-electric/40 bg-gradient-to-r from-mul-dark/90 to-math text-white"
      >
        <span className="grid h-14 w-14 place-items-center rounded-2xl bg-white/15">
          <Zap className="text-mul-gold" size={32} />
        </span>
        <div className="flex-1 text-left">
          <p className="font-display text-xl font-extrabold">Multiplication Camp</p>
          <p className="text-sm font-bold text-white/80">Master times tables 1×–20× with drills & boss battles</p>
        </div>
        <span className="font-display font-extrabold text-mul-gold">Go →</span>
      </Link>
    </div>
  );
}
