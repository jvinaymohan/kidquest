import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { GraduationCap, Lock, Star } from "lucide-react";
import { HubPageLayout, HubSectionLabel } from "../components/layout/HubPageLayout";
import { PlacementPrompt } from "../components/placement/PlacementPrompt";
import { useAppStore } from "../store/useAppStore";
import { useGradeMathStore, isFreshGradeProgress } from "../store/useGradeMathStore";
import { GRADES, getGradeMeta } from "../utils/gradeMath";
import { gradePlacementCopy } from "../utils/placement";

export default function GradeMathHub() {
  const ageGroup = useAppStore((s) => s.ageGroup);
  const currentGrade = useGradeMathStore((s) => s.currentGrade);
  const unlockedGrades = useGradeMathStore((s) => s.unlockedGrades);
  const starsFor = useGradeMathStore((s) => s.starsFor);
  const completedGrades = useGradeMathStore((s) => s.completedGrades);
  const placementApplied = useGradeMathStore((s) => s.placementApplied);
  const applyAgePlacement = useGradeMathStore((s) => s.applyAgePlacement);
  const gradeStats = useGradeMathStore((s) => s.gradeStats);

  const [showPlacement, setShowPlacement] = useState(false);
  const completed = completedGrades();

  useEffect(() => {
    if (!placementApplied && isFreshGradeProgress({ placementApplied, gradeStats })) {
      setShowPlacement(true);
    }
  }, [placementApplied, gradeStats]);

  const copy = gradePlacementCopy(ageGroup);
  const currentMeta = getGradeMeta(currentGrade);

  return (
    <HubPageLayout
      title="Grade Path"
      subtitle="Practice, check yourself, and level up grade by grade"
      icon={<GraduationCap className="mx-auto text-[#93c5fd]" size={36} aria-hidden />}
      headerClassName="border-math/35"
      headerExtra={
        <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-primary/25 px-4 py-1.5 text-sm font-extrabold text-white ring-2 ring-primary/40">
          <span>{currentMeta.emoji}</span>
          You&apos;re in {currentMeta.title}!
        </div>
      }
      journeyFooter={{ to: "/journey", label: "See grade progress on My Journey" }}
    >
      <HubSectionLabel>Grades 1 – 10</HubSectionLabel>

      <ul className="flex flex-col gap-2">
        {GRADES.map((grade) => {
          const meta = getGradeMeta(grade);
          const unlocked = unlockedGrades.includes(grade);
          const isCurrent = grade === currentGrade;
          const stars = starsFor(grade);
          const passed = gradeStats[grade]?.testPassed;

          return (
            <li key={grade}>
              {unlocked ? (
                <Link
                  to={`/math/grades/${grade}`}
                  className={`hub-topic-card focus-ring ${
                    isCurrent ? "border-primary/50 ring-2 ring-primary/30" : ""
                  }`}
                >
                  <span className="grid h-12 w-12 place-items-center rounded-2xl bg-white/10 text-2xl shrink-0">
                    {meta.emoji}
                  </span>
                  <div className="flex-1 min-w-0 text-left">
                    <p className="font-display font-extrabold text-white">
                      {meta.title}
                      {isCurrent && (
                        <span className="ml-2 text-xs font-bold text-primary">· You are here</span>
                      )}
                    </p>
                    <p className="text-xs font-medium text-white/55 truncate">
                      {meta.skills.slice(0, 2).join(" · ")}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    {[1, 2, 3].map((s) => (
                      <Star
                        key={s}
                        size={16}
                        className={s <= stars ? "text-[#ffd700] fill-[#ffd700]" : "text-white/20"}
                        aria-hidden
                      />
                    ))}
                    {passed && (
                      <span className="ml-1 text-xs font-extrabold text-success">✓</span>
                    )}
                  </div>
                </Link>
              ) : (
                <div className="hub-topic-card opacity-55 cursor-not-allowed">
                  <span className="grid h-12 w-12 place-items-center rounded-2xl bg-white/5 shrink-0">
                    <Lock size={22} className="text-white/40" aria-hidden />
                  </span>
                  <div className="flex-1 min-w-0 text-left">
                    <p className="font-display font-extrabold text-white/60">{meta.title}</p>
                    <p className="text-xs font-medium text-white/40">Pass Grade {grade - 1} test to unlock</p>
                  </div>
                </div>
              )}
            </li>
          );
        })}
      </ul>

      {completed.length > 0 && (
        <p className="text-center text-xs font-bold text-white/50">
          {completed.length} grade{completed.length !== 1 ? "s" : ""} completed · Keep going!
        </p>
      )}

      <Link to="/math" className="text-center text-sm font-bold text-white/45 hover:text-white/70">
        ← Back to Math Zone
      </Link>

      <PlacementPrompt
        open={showPlacement}
        copy={copy}
        onJump={() => {
          applyAgePlacement(ageGroup, { jumpAhead: true });
          setShowPlacement(false);
        }}
        onEasy={() => {
          applyAgePlacement(ageGroup, { jumpAhead: false });
          setShowPlacement(false);
        }}
        onDismiss={() => setShowPlacement(false)}
      />
    </HubPageLayout>
  );
}
