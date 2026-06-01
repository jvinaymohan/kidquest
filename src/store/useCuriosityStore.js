import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { todayISO } from "../utils/curiosity/calendar";

function gentleStreakBump(lastDate, current) {
  const today = todayISO();
  if (lastDate === today) return current;
  if (!lastDate) return 1;
  const prev = new Date(lastDate);
  const now = new Date(today);
  const diff = Math.round((now - prev) / 86400000);
  if (diff === 1) return current + 1;
  if (diff === 0) return current;
  return 1;
}

export const useCuriosityStore = create(
  persist(
    (set, get) => ({
      savedIds: [],
      completedCardIds: [],
      quizScores: {},
      openedDates: [],
      gentleStreak: 0,
      lastOpenDate: null,
      badges: [],

      recordOpen: () => {
        const today = todayISO();
        set((s) => {
          const streak = gentleStreakBump(s.lastOpenDate, s.gentleStreak);
          const openedDates = s.openedDates.includes(today)
            ? s.openedDates
            : [...s.openedDates, today].slice(-60);
          const badges = [...s.badges];
          if (streak >= 3 && !badges.includes("curiosity-3")) badges.push("curiosity-3");
          if (streak >= 7 && !badges.includes("curiosity-7")) badges.push("curiosity-7");
          if (openedDates.length >= 10 && !badges.includes("curiosity-explorer")) {
            badges.push("curiosity-explorer");
          }
          return { lastOpenDate: today, gentleStreak: streak, openedDates, badges };
        });
      },

      toggleSaved: (cardId) =>
        set((s) => ({
          savedIds: s.savedIds.includes(cardId)
            ? s.savedIds.filter((id) => id !== cardId)
            : [...s.savedIds, cardId],
        })),

      isSaved: (cardId) => get().savedIds.includes(cardId),

      markCompleted: (cardId) =>
        set((s) => ({
          completedCardIds: s.completedCardIds.includes(cardId)
            ? s.completedCardIds
            : [...s.completedCardIds, cardId],
        })),

      recordQuiz: (cardId, { correct, total }) =>
        set((s) => ({
          quizScores: {
            ...s.quizScores,
            [cardId]: {
              correct,
              total,
              at: new Date().toISOString(),
              best: Math.max(s.quizScores[cardId]?.best ?? 0, correct),
            },
          },
        })),

      savedCount: () => get().savedIds.length,
      completedCount: () => get().completedCardIds.length,
    }),
    { name: "kidquest-curiosity-v1", storage: createJSONStorage(() => localStorage) }
  )
);
