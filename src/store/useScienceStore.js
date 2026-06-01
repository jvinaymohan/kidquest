import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export const useScienceStore = create(
  persist(
    (set, get) => ({
      topics: {},

      recordTopic: (topicId, { correct, total, stars }) => {
        const prev = get().topics[topicId] ?? { bestStars: 0, sessions: 0, learnedFacts: [] };
        set({
          topics: {
            ...get().topics,
            [topicId]: {
              bestStars: Math.max(prev.bestStars, stars),
              sessions: prev.sessions + 1,
              lastScore: `${correct}/${total}`,
              completed: stars >= 2,
              lastPlayed: new Date().toISOString().slice(0, 10),
            },
          },
        });
      },

      completedCount: () => Object.values(get().topics).filter((t) => t.completed).length,

      completionPct: () => {
        const entries = Object.values(get().topics);
        if (!entries.length) return 0;
        return entries.filter((t) => t.completed).length / entries.length;
      },
    }),
    { name: "kidquest-science-v1", storage: createJSONStorage(() => localStorage) }
  )
);
