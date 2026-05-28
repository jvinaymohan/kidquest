import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { calculateNextReview, qualityFromResponse } from "../lib/sm2";

export const useGeographyStore = create(
  persist(
    (set, get) => ({
      countries: {},

      recordPractice: (countryCode, correct) => {
        const prev = get().countries[countryCode] ?? {
          phase: 1,
          practiceHits: 0,
          mastered: false,
        };
        const hits = correct ? prev.practiceHits + 1 : prev.practiceHits;
        const phase = hits >= 4 ? Math.max(prev.phase, 2) : prev.phase;
        set({
          countries: {
            ...get().countries,
            [countryCode]: {
              ...prev,
              practiceHits: hits,
              phase,
              mastered: phase >= 5,
            },
          },
        });
      },

      recordSRReview: (countryCode, correct, responseMs) => {
        const prev = get().countries[countryCode] ?? {
          phase: 2,
          practiceHits: 0,
          interval: 1,
          easiness: 2.5,
          repetitions: 0,
        };
        const quality = qualityFromResponse({ correct, responseMs });
        const next = calculateNextReview(prev, quality);
        set({
          countries: {
            ...get().countries,
            [countryCode]: { ...prev, ...next, phase: next.repetitions >= 3 ? 5 : Math.max(prev.phase, 3) },
          },
        });
      },

      getDueReviews: () => {
        const today = new Date().toISOString().slice(0, 10);
        return Object.entries(get().countries)
          .filter(([, c]) => c.nextReviewDate && c.nextReviewDate <= today)
          .map(([code]) => code);
      },

      masteryPct: () => {
        const entries = Object.values(get().countries);
        if (!entries.length) return 0;
        return entries.filter((c) => c.mastered || c.phase >= 4).length / entries.length;
      },
    }),
    { name: "kidquest-geography-v1", storage: createJSONStorage(() => localStorage) }
  )
);
