import { Link, useNavigate, useParams } from "react-router-dom";
import { ChevronRight, Star } from "lucide-react";
import { HubPageLayout, HubSectionLabel } from "../components/layout/HubPageLayout";
import { useGradeMathStore } from "../store/useGradeMathStore";
import { MODES, getGradeMeta, parseGradeParam } from "../utils/gradeMath";

export default function GradeMathDetail() {
  const { grade: gradeParam } = useParams();
  const grade = parseGradeParam(gradeParam);
  const navigate = useNavigate();

  const isUnlocked = useGradeMathStore((s) => s.isGradeUnlocked(grade));
  const starsFor = useGradeMathStore((s) => s.starsFor(grade));
  const gradeStats = useGradeMathStore((s) => s.gradeStats);

  if (!grade) {
    return (
      <div className="p-6 text-center text-white">
        <p>Unknown grade.</p>
        <Link to="/math/grades" className="text-primary underline">
          Back to Grade Path
        </Link>
      </div>
    );
  }

  const meta = getGradeMeta(grade);
  const stats = gradeStats[grade] ?? {};
  const stars = starsFor(grade);
  const testPassed = stats.testPassed;

  if (!isUnlocked) {
    return (
      <div className="flex flex-col gap-4 p-6 text-center text-white">
        <p className="font-display text-xl font-extrabold">Grade {grade} locked 🔒</p>
        <p className="text-sm text-white/60">Pass the Grade {grade - 1} test to unlock.</p>
        <Link to="/math/grades" className="text-primary font-bold underline">
          Back to Grade Path
        </Link>
      </div>
    );
  }

  return (
    <HubPageLayout
      title={meta.title}
      subtitle={meta.badge}
      icon={<span className="text-4xl">{meta.emoji}</span>}
      headerClassName="border-math/35"
      headerExtra={
        <div className="mt-2 flex items-center justify-center gap-1">
          {[1, 2, 3].map((s) => (
            <Star
              key={s}
              size={20}
              className={s <= stars ? "text-[#ffd700] fill-[#ffd700]" : "text-white/25"}
              aria-hidden
            />
          ))}
        </div>
      }
    >
      <div className="hub-glass-panel p-4 text-left">
        <HubSectionLabel>Skills in this grade</HubSectionLabel>
        <ul className="flex flex-wrap gap-2 mt-2">
          {meta.skills.map((skill) => (
            <li
              key={skill}
              className="rounded-full bg-white/10 px-3 py-1 text-xs font-bold text-white/80"
            >
              {skill}
            </li>
          ))}
        </ul>
      </div>

      {grade >= 3 && (
        <Link
          to="/multiplication"
          className="hub-topic-card border-mul-gold/30 text-sm focus-ring"
        >
          <span className="text-2xl">⚡</span>
          <div className="flex-1 text-left">
            <p className="font-display font-extrabold text-white">Boost: Times Tables</p>
            <p className="text-xs text-white/55">Optional — master multiplication facts</p>
          </div>
          <ChevronRight className="text-white/40" size={18} aria-hidden />
        </Link>
      )}

      <HubSectionLabel>Choose a mode</HubSectionLabel>

      <ul className="flex flex-col gap-3">
        {Object.values(MODES).map((mode) => (
          <li key={mode.id}>
            <button
              type="button"
              onClick={() => navigate(`/math/grades/${grade}/${mode.id}`)}
              className="hub-topic-card w-full text-left focus-ring"
            >
              <span className="text-3xl shrink-0">{mode.emoji}</span>
              <div className="flex-1 min-w-0">
                <p className="font-display font-extrabold text-white">{mode.label}</p>
                <p className="text-xs font-medium text-white/55">{mode.description}</p>
                {mode.id === "test" && !testPassed && (
                  <p className="mt-1 text-xs font-extrabold text-[#ffd700]">
                    Take the grade test to level up!
                  </p>
                )}
                {mode.id === "test" && testPassed && (
                  <p className="mt-1 text-xs font-extrabold text-success">Passed ✓</p>
                )}
              </div>
              <ChevronRight className="text-white/40 shrink-0" size={18} aria-hidden />
            </button>
          </li>
        ))}
      </ul>

      {stats.lastCheckPct != null && stats.weakTopics?.length > 0 && (
        <div className="hub-glass-panel p-4 text-left">
          <p className="text-xs font-extrabold uppercase tracking-wider text-white/45">
            Last check — weak areas
          </p>
          <ul className="mt-2 flex flex-wrap gap-2">
            {stats.weakTopics.map((t) => (
              <li
                key={t.topic}
                className="rounded-full bg-error/20 px-3 py-1 text-xs font-bold text-white"
              >
                {t.topic} ({Math.round(t.pct * 100)}%)
              </li>
            ))}
          </ul>
        </div>
      )}

      <Link to="/math/grades" className="text-center text-sm font-bold text-white/45 hover:text-white/70">
        ← All grades
      </Link>
    </HubPageLayout>
  );
}
