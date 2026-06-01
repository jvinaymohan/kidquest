import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  MULTIPLICATION_STAGES,
  generateStageBank,
  defaultProblemProgress,
  isStageMastered,
  STAGE_ACCURACY_HITS,
  STAGE_FAST_HITS,
} from "../utils/multiplicationStages";
import { suggestedMulStage } from "../utils/placement";

function defaultStageRow(stageId, { unlocked = false } = {}) {
  return {
    unlocked,
    mastered: false,
    problems: {},
    bank: [],
    bankGeneratedAt: null,
  };
}

function defaultStages() {
  const stages = {};
  for (const s of MULTIPLICATION_STAGES) {
    stages[s.id] = defaultStageRow(s.id, { unlocked: s.order === 1 });
  }
  return stages;
}

function mergeStages(persisted) {
  const merged = defaultStages();
  if (!persisted || typeof persisted !== "object") return merged;
  for (const s of MULTIPLICATION_STAGES) {
    const row = persisted[s.id];
    if (row) merged[s.id] = { ...merged[s.id], ...row, problems: { ...merged[s.id].problems, ...row.problems } };
  }
  return merged;
}

export const useMultiplicationStagesStore = create(
  persist(
    (set, get) => ({
      stages: defaultStages(),
      placementApplied: false,

      getStageRow: (stageId) => {
        const s = get();
        return s.stages[stageId] ?? defaultStageRow(stageId);
      },

      ensureBank: (stageId) => {
        const stage = MULTIPLICATION_STAGES.find((x) => x.id === stageId);
        if (!stage) return [];
        const row = get().getStageRow(stageId);
        if (row.bank?.length >= 10) return row.bank;
        const bank = generateStageBank(stage);
        set((s) => ({
          stages: {
            ...s.stages,
            [stageId]: {
              ...(s.stages[stageId] ?? defaultStageRow(stageId)),
              bank,
              bankGeneratedAt: new Date().toISOString(),
            },
          },
        }));
        return bank;
      },

      recordAnswer: (stageId, problemId, { correct, responseMs }) => {
        const stage = MULTIPLICATION_STAGES.find((x) => x.id === stageId);
        if (!stage) return { stageMastered: false };

        let stageMastered = false;
        set((s) => {
          const stages = { ...s.stages };
          const row = { ...(stages[stageId] ?? defaultStageRow(stageId)) };
          const problems = { ...row.problems };
          const prev = { ...defaultProblemProgress(), ...problems[problemId] };
          if (correct) {
            prev.accuracyHits = Math.min(STAGE_ACCURACY_HITS, prev.accuracyHits + 1);
            if (responseMs != null && responseMs <= stage.timeLimitMs) {
              prev.fastHits = Math.min(STAGE_FAST_HITS, prev.fastHits + 1);
            }
          }
          problems[problemId] = prev;
          row.problems = problems;

          const bank = row.bank?.length ? row.bank : generateStageBank(stage);
          if (!row.bank?.length) {
            row.bank = bank;
            row.bankGeneratedAt = new Date().toISOString();
          }

          if (isStageMastered(row, bank, stage)) {
            row.mastered = true;
            const next = MULTIPLICATION_STAGES.find((x) => x.order === stage.order + 1);
            if (next) {
              stages[next.id] = {
                ...(stages[next.id] ?? defaultStageRow(next.id)),
                unlocked: true,
              };
            }
            stageMastered = true;
          }

          stages[stageId] = row;
          return { stages };
        });

        return { stageMastered };
      },

      applyAgePlacement: (ageGroup, { jumpAhead = true } = {}) => {
        const startId = jumpAhead ? suggestedMulStage(ageGroup) : "1x1";
        const start = MULTIPLICATION_STAGES.find((s) => s.id === startId) ?? MULTIPLICATION_STAGES[0];
        set((s) => {
          const stages = defaultStages();
          for (const st of MULTIPLICATION_STAGES) {
            if (st.order < start.order) {
              stages[st.id] = {
                ...defaultStageRow(st.id),
                unlocked: true,
                mastered: true,
                bank: generateStageBank(st),
              };
            } else if (st.order === start.order) {
              stages[st.id] = { ...defaultStageRow(st.id), unlocked: true };
            }
          }
          return { stages, placementApplied: true };
        });
        return start.id;
      },

      resetProgress: () => set({ stages: defaultStages(), placementApplied: false }),
    }),
    {
      name: "kidquest-multiplication-stages-v1",
      merge: (persisted, current) => ({
        ...current,
        ...persisted,
        stages: mergeStages(persisted?.stages ?? current.stages),
      }),
    }
  )
);
