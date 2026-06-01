import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export const useTriviaStore = create(
  persist(
    (set, get) => ({
      categories: {},

      recordCategory: (categoryId, { correct, total, stars, ageGroup }) => {
        const key = `${categoryId}-${ageGroup}`;
        const prev = get().categories[key] ?? { bestStars: 0, sessions: 0 };
        set({
          categories: {
            ...get().categories,
            [key]: {
              bestStars: Math.max(prev.bestStars, stars),
              sessions: prev.sessions + 1,
              lastScore: `${correct}/${total}`,
              completed: stars >= 2,
              ageGroup,
              lastPlayed: new Date().toISOString().slice(0, 10),
            },
          },
        });
      },

      starsFor: (categoryId, ageGroup) =>
        get().categories[`${categoryId}-${ageGroup}`]?.bestStars ?? 0,

      completedCount: () =>
        Object.values(get().categories).filter((c) => c.completed).length,
    }),
    { name: "kidquest-trivia-v1", storage: createJSONStorage(() => localStorage) }
  )
);
