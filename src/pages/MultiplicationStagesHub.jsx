import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Layers, Lock, Star } from "lucide-react";
import { HubPageLayout } from "../components/layout/HubPageLayout";
import { useMultiplicationStagesStore } from "../store/useMultiplicationStagesStore";
import { useAppStore } from "../store/useAppStore";
import {
  MULTIPLICATION_STAGES,
  stageProgressCounts,
  STAGE_ACCURACY_HITS,
  STAGE_FAST_HITS,
  STAGE_BANK_SIZE,
} from "../utils/multiplicationStages";
import { stagesPlacementCopy, suggestedMulStage } from "../utils/placement";
import { PlacementPrompt } from "../components/placement/PlacementPrompt";

export default function MultiplicationStagesHub() {
  const ageGroup = useAppStore((s) => s.ageGroup);
  const stages = useMultiplicationStagesStore((s) => s.stages);
  const placementApplied = useMultiplicationStagesStore((s) => s.placementApplied);
  const applyAgePlacement = useMultiplicationStagesStore((s) => s.applyAgePlacement);
  const ensureBank = useMultiplicationStagesStore((s) => s.ensureBank);
  const [showPlacement, setShowPlacement] = useState(false);
  const suggested = suggestedMulStage(ageGroup);
  const copy = stagesPlacementCopy(ageGroup);

  useEffect(() => {
    const fresh = Object.values(stages).every((r) => !r.mastered && (r.bank?.length ?? 0) === 0);
    if (!placementApplied && fresh && suggested !== "1x1") {
      setShowPlacement(true);
    }
  }, [placementApplied, stages, suggested]);

  useEffect(() => {
    for (const st of MULTIPLICATION_STAGES) {
      if (stages[st.id]?.unlocked) ensureBank(st.id);
    }
  }, [stages, ensureBank]);

  const masteredCount = MULTIPLICATION_STAGES.filter((s) => stages[s.id]?.mastered).length;

  return (
    <HubPageLayout
      title="Multiplication Stages"
      subtitle="Grow from 1-digit facts to bigger products — accuracy and speed"
      icon={<Layers className="mx-auto text-mul-gold" size={36} aria-hidden />}
      headerClassName="border-mul-gold/35"
      headerExtra={
        <p className="mt-2 text-xs font-bold text-white/55">
          {masteredCount}/{MULTIPLICATION_STAGES.length} stages complete · each problem needs{" "}
          {STAGE_ACCURACY_HITS} accurate + {STAGE_FAST_HITS} fast answer
        </p>
      }
    >
      <Link
        to="/multiplication"
        className="mb-2 block text-center text-sm font-bold text-[#93c5fd] underline"
      >
        ← Times Tables (1×–20×)
      </Link>

      <ul className="flex flex-col gap-3">
        {MULTIPLICATION_STAGES.map((stage) => {
          const row = stages[stage.id] ?? {};
          const unlocked = row.unlocked ?? stage.order === 1;
          const bank = row.bank ?? [];
          const stageDef = MULTIPLICATION_STAGES.find((s) => s.id === stage.id);
          const progressBank =
            bank.length > 0
              ? bank
              : Array.from({ length: STAGE_BANK_SIZE }, (_, i) => ({ id: `pending-${i}` }));
          const { accuracyDone, speedDone, fullyDone, total } = stageProgressCounts(
            row,
            progressBank,
            stageDef
          );
          const mastered = row.mastered || fullyDone >= total;

          return (
            <li key={stage.id}>
              {unlocked ? (
                <Link
                  to={`/math/stages/${stage.id}`}
                  className="hub-topic-card border-[3px] border-mul-gold/30 bg-gradient-to-r from-mul-dark/95 to-[#1a1060] focus-ring"
                >
                  <span className="grid h-12 w-12 place-items-center rounded-2xl bg-white/10 font-display text-lg font-extrabold text-mul-gold shrink-0">
                    {mastered ? <Star size={22} fill="currentColor" /> : stage.order}
                  </span>
                  <div className="flex-1 text-left min-w-0">
                    <p className="font-display text-lg font-extrabold text-white">{stage.title}</p>
                    <p className="text-xs font-bold text-white/70">
                      e.g. {stage.example} · under {stage.timeLimitMs / 1000}s for speed
                    </p>
                    <p className="mt-1 text-[10px] font-bold text-white/50">
                      Accuracy {accuracyDone}/{total} · Speed {speedDone}/{total}
                      {mastered ? " · Mastered ⭐" : ""}
                    </p>
                  </div>
                  <span className="font-display font-extrabold text-mul-gold shrink-0">
                    {mastered ? "Review →" : "Train →"}
                  </span>
                </Link>
              ) : (
                <div className="hub-topic-card border-[3px] border-white/10 bg-white/5 opacity-70">
                  <span className="grid h-12 w-12 place-items-center rounded-2xl bg-white/5 shrink-0">
                    <Lock className="text-white/40" size={22} />
                  </span>
                  <div className="flex-1 text-left min-w-0">
                    <p className="font-display text-lg font-extrabold text-white/60">{stage.title}</p>
                    <p className="text-xs font-bold text-white/40">Complete the previous stage to unlock</p>
                  </div>
                </div>
              )}
            </li>
          );
        })}
      </ul>

      {showPlacement && (
        <PlacementPrompt
          title={copy.title}
          body={copy.body}
          primaryLabel={copy.jumpLabel}
          secondaryLabel={copy.easyLabel}
          onPrimary={() => {
            applyAgePlacement(ageGroup, { jumpAhead: true });
            setShowPlacement(false);
          }}
          onSecondary={() => {
            applyAgePlacement(ageGroup, { jumpAhead: false });
            setShowPlacement(false);
          }}
          onDismiss={() => setShowPlacement(false)}
        />
      )}
    </HubPageLayout>
  );
}
