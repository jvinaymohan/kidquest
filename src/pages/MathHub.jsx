import { Link } from "react-router-dom";
import { Calculator, GraduationCap, Zap } from "lucide-react";
import { HubPageLayout } from "../components/layout/HubPageLayout";

export default function MathHub() {
  return (
    <HubPageLayout
      title="Math Zone"
      subtitle="Pick your math adventure"
      icon={<Calculator className="mx-auto text-[#93c5fd]" size={36} aria-hidden />}
      headerClassName="border-math/35"
    >
      <Link
        to="/math/grades"
        className="hub-topic-card border-[3px] border-[#ffd700]/45 bg-gradient-to-r from-[#1a1060] via-primary/20 to-[#1a1060] focus-ring ring-2 ring-primary/25"
      >
        <span className="grid h-14 w-14 place-items-center rounded-2xl bg-primary/25 text-3xl shrink-0">
          🎓
        </span>
        <div className="flex-1 text-left min-w-0">
          <p className="font-display text-xl font-extrabold text-white">Grade Path</p>
          <p className="text-sm font-bold text-white/75">
            Grades 1–10 — practice, check yourself, and pass tests to level up
          </p>
        </div>
        <GraduationCap className="text-[#ffd700] shrink-0" size={28} aria-hidden />
      </Link>

      <Link
        to="/math-master"
        className="hub-topic-card border-[3px] border-primary/30 bg-gradient-to-r from-white/15 to-white/5 focus-ring"
      >
        <span className="grid h-14 w-14 place-items-center rounded-2xl bg-primary/20 text-3xl shrink-0">
          🎯
        </span>
        <div className="flex-1 text-left min-w-0">
          <p className="font-display text-xl font-extrabold text-white">Math Master!</p>
          <p className="text-sm font-bold text-white/65">
            Add, subtract, multiply, divide & fractions — 25 in a row to level up
          </p>
        </div>
        <span className="font-display font-extrabold text-[#93c5fd] shrink-0">Go →</span>
      </Link>

      <Link
        to="/math/stages"
        className="hub-topic-card border-[3px] border-mul-electric/35 bg-gradient-to-r from-[#1a1060] to-mul-dark/90 focus-ring"
      >
        <span className="grid h-14 w-14 place-items-center rounded-2xl bg-white/15 text-3xl shrink-0">
          📐
        </span>
        <div className="flex-1 text-left min-w-0">
          <p className="font-display text-xl font-extrabold text-white">Multiplication Stages</p>
          <p className="text-sm font-bold text-white/80">
            1-digit through mixed products — accuracy and speed goals
          </p>
        </div>
        <span className="font-display font-extrabold text-mul-electric shrink-0">Go →</span>
      </Link>

      <Link
        to="/multiplication"
        className="hub-topic-card border-[3px] border-mul-gold/40 bg-gradient-to-r from-mul-dark/90 to-[#1a1060] focus-ring"
      >
        <span className="grid h-14 w-14 place-items-center rounded-2xl bg-white/15 shrink-0">
          <Zap className="text-mul-gold" size={32} aria-hidden />
        </span>
        <div className="flex-1 text-left min-w-0">
          <p className="font-display text-xl font-extrabold text-white">Multiplication Camp</p>
          <p className="text-sm font-bold text-white/80">
            Master times tables 1×–20× with drills & boss battles
          </p>
        </div>
        <span className="font-display font-extrabold text-mul-gold shrink-0">Go →</span>
      </Link>
    </HubPageLayout>
  );
}
