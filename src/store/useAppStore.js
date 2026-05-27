import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { calculateStars, xpForLesson, pointsForLesson, levelForXP } from "../utils/scoring";
import { computeUnlockedBadges, findNewBadges } from "../utils/badges";

function todayISO() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function daysBetween(a, b) {
  const da = new Date(a);
  const db = new Date(b);
  const ms = db.setHours(0, 0, 0, 0) - da.setHours(0, 0, 0, 0);
  return Math.round(ms / (1000 * 60 * 60 * 24));
}

const initialState = {
  onboarded: false,
  kidName: "",
  avatarConfig: { skin: 1, hair: 1, outfit: 1, accessory: 0 },
  ageGroup: "adventurer",

  lessonProgress: {},
  timePerSubject: {},
  lessonsToday: { date: todayISO(), count: 0 },

  totalXP: 0,
  totalPoints: 0,
  level: 1,

  lastPlayDate: null,
  currentStreak: 0,
  longestStreak: 0,

  badges: [],

  soundEnabled: true,
  musicEnabled: true,
  dailyGoal: 2,
  timerMode: false,

  parentPin: "1234",

  pendingCelebration: null,
};

export const useAppStore = create(
  persist(
    (set, get) => ({
      ...initialState,

      completeOnboarding: ({ kidName, ageGroup, avatarConfig }) =>
        set((s) => ({
          ...s,
          onboarded: true,
          kidName,
          ageGroup,
          avatarConfig: avatarConfig ?? s.avatarConfig,
        })),

      setKidName: (name) => set({ kidName: name }),
      setAgeGroup: (ageGroup) => set({ ageGroup }),
      setAvatar: (avatarConfig) => set({ avatarConfig }),
      setSound: (v) => set({ soundEnabled: v }),
      setMusic: (v) => set({ musicEnabled: v }),
      setDailyGoal: (v) => set({ dailyGoal: v }),
      setTimerMode: (v) => set({ timerMode: v }),
      setParentPin: (v) => set({ parentPin: v }),

      _bumpStreak: () => {
        const s = get();
        const today = todayISO();
        if (s.lastPlayDate === today) return;
        let newStreak;
        if (!s.lastPlayDate) newStreak = 1;
        else {
          const diff = daysBetween(s.lastPlayDate, today);
          if (diff === 1) newStreak = s.currentStreak + 1;
          else if (diff === 0) newStreak = s.currentStreak;
          else newStreak = 1;
        }
        set({
          lastPlayDate: today,
          currentStreak: newStreak,
          longestStreak: Math.max(s.longestStreak, newStreak),
        });
      },

      _bumpTodayLessonCount: () => {
        const s = get();
        const today = todayISO();
        if (s.lessonsToday.date !== today) {
          set({ lessonsToday: { date: today, count: 1 } });
        } else {
          set({ lessonsToday: { date: today, count: s.lessonsToday.count + 1 } });
        }
      },

      addTimeToSubject: (subjectId, seconds) =>
        set((s) => ({
          timePerSubject: {
            ...s.timePerSubject,
            [subjectId]: (s.timePerSubject[subjectId] ?? 0) + seconds,
          },
        })),

      submitLessonResult: ({ lessonId, subjectId, correct, total, secondsElapsed = 0 }) => {
        const s = get();
        const stars = calculateStars(correct, total);
        const points = pointsForLesson(correct, total);
        const xp = xpForLesson(correct, total, s.ageGroup);
        const prevP = s.lessonProgress[lessonId];
        const prevStars = prevP?.stars ?? 0;
        const wasMastered = prevP?.mastered ?? false;
        const newStars = Math.max(prevStars, stars);
        const mastered = wasMastered || stars >= 3;

        const prevXP = s.totalXP;
        const newXP = prevXP + xp;
        const newPoints = (s.totalPoints ?? 0) + points;
        const prevLevel = levelForXP(prevXP);
        const newLevel = levelForXP(newXP);
        const leveledUp = newLevel > prevLevel;

        const updated = {
          ...s,
          totalXP: newXP,
          totalPoints: newPoints,
          level: newLevel,
          lessonProgress: {
            ...s.lessonProgress,
            [lessonId]: {
              stars: newStars,
              mastered,
              attempts: (prevP?.attempts ?? 0) + 1,
              lastScore: correct,
              lastTotal: total,
              lastPoints: points,
              lastXP: xp,
              lastPlayed: todayISO(),
            },
          },
          timePerSubject: {
            ...s.timePerSubject,
            [subjectId]: (s.timePerSubject[subjectId] ?? 0) + secondsElapsed,
          },
        };

        const today = todayISO();
        if (updated.lessonsToday.date !== today) {
          updated.lessonsToday = { date: today, count: 1 };
        } else {
          updated.lessonsToday = { date: today, count: updated.lessonsToday.count + 1 };
        }

        if (s.lastPlayDate !== today) {
          let newStreak;
          if (!s.lastPlayDate) newStreak = 1;
          else {
            const diff = daysBetween(s.lastPlayDate, today);
            if (diff === 1) newStreak = s.currentStreak + 1;
            else if (diff === 0) newStreak = s.currentStreak;
            else newStreak = 1;
          }
          updated.lastPlayDate = today;
          updated.currentStreak = newStreak;
          updated.longestStreak = Math.max(s.longestStreak, newStreak);
        }

        const newBadgeList = computeUnlockedBadges(updated);
        const earned = findNewBadges(s.badges, newBadgeList);
        updated.badges = newBadgeList;

        updated.pendingCelebration = {
          lessonId,
          subjectId,
          stars,
          xpEarned: xp,
          pointsEarned: points,
          correct,
          total,
          leveledUp,
          newLevel,
          newlyEarnedBadges: earned,
          createdAt: Date.now(),
        };

        set(updated);
        return updated.pendingCelebration;
      },

      clearCelebration: () => set({ pendingCelebration: null }),

      resetProgress: () =>
        set((s) => ({
          ...initialState,
          onboarded: s.onboarded,
          kidName: s.kidName,
          avatarConfig: s.avatarConfig,
          ageGroup: s.ageGroup,
          soundEnabled: s.soundEnabled,
          musicEnabled: s.musicEnabled,
          dailyGoal: s.dailyGoal,
          parentPin: s.parentPin,
        })),

      resetAll: () => set({ ...initialState }),
    }),
    {
      name: "kidquest-state-v1",
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => {
        const { pendingCelebration, ...rest } = s;
        return rest;
      },
    }
  )
);
