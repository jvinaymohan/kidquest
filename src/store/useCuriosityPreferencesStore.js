import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { useShallow } from "zustand/react/shallow";

const DEFAULT_TOPICS = {
  science: true,
  seasonal: true,
  sports: true,
  movie: true,
  culture: true,
};

export const useCuriosityPreferencesStore = create(
  persist(
    (set) => ({
      region: "US",
      maxSensitivity: "standard",
      topics: { ...DEFAULT_TOPICS },
      showDaily: true,
      showWeekly: true,
      showMonthly: true,
      requireTopicApproval: false,
      approvedTopicIds: [],

      setRegion: (region) => set({ region }),
      setMaxSensitivity: (maxSensitivity) => set({ maxSensitivity }),
      setTopicEnabled: (topic, enabled) =>
        set((s) => ({ topics: { ...s.topics, [topic]: enabled } })),
      setCadence: ({ showDaily, showWeekly, showMonthly }) =>
        set((s) => ({
          showDaily: showDaily ?? s.showDaily,
          showWeekly: showWeekly ?? s.showWeekly,
          showMonthly: showMonthly ?? s.showMonthly,
        })),
      setRequireTopicApproval: (v) => set({ requireTopicApproval: v }),
      approveTopic: (cardId) =>
        set((s) => ({
          approvedTopicIds: s.approvedTopicIds.includes(cardId)
            ? s.approvedTopicIds
            : [...s.approvedTopicIds, cardId],
        })),
      revokeTopic: (cardId) =>
        set((s) => ({
          approvedTopicIds: s.approvedTopicIds.filter((id) => id !== cardId),
        })),
      resetCuriosityPrefs: () =>
        set({
          region: "US",
          maxSensitivity: "standard",
          topics: { ...DEFAULT_TOPICS },
          showDaily: true,
          showWeekly: true,
          showMonthly: true,
          requireTopicApproval: false,
          approvedTopicIds: [],
        }),
    }),
    { name: "kidquest-curiosity-prefs-v1", storage: createJSONStorage(() => localStorage) }
  )
);

/** Shape passed to filter/select utilities (non-hook callers). */
export function getCuriosityPrefs(getState) {
  const s = getState();
  return {
    region: s.region,
    maxSensitivity: s.maxSensitivity,
    topics: s.topics,
    requireTopicApproval: s.requireTopicApproval,
    approvedTopicIds: s.approvedTopicIds,
    showDaily: s.showDaily,
    showWeekly: s.showWeekly,
    showMonthly: s.showMonthly,
  };
}

/** Stable shallow selector — avoids infinite re-renders from new object refs. */
export function useCuriosityPrefs() {
  return useCuriosityPreferencesStore(
    useShallow((s) => ({
      region: s.region,
      maxSensitivity: s.maxSensitivity,
      topics: s.topics,
      requireTopicApproval: s.requireTopicApproval,
      approvedTopicIds: s.approvedTopicIds ?? [],
      showDaily: s.showDaily,
      showWeekly: s.showWeekly,
      showMonthly: s.showMonthly,
    }))
  );
}
