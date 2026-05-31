import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { calculateStars, xpForLesson, pointsForLesson, levelForXP } from "../utils/scoring";
import { computeUnlockedBadges, findNewBadges } from "../utils/badges";
import { queueLessonUpsert, upsertUserStats } from "../lib/cloud/progress";
import { DEFAULT_PARENT_PIN } from "../constants/parentPin";

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
  role: "kid",
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

  parentPin: DEFAULT_PARENT_PIN,

  pendingCelebration: null,

  learnSecondsBySubject: {},
  learnXPDaily: { date: todayISO(), xpBySubject: {} },
  teacherAssignments: [],
  classTarget: "",
  parentDigestLog: [],

  dailyChallengeDone: null,
};

export const useAppStore = create(
  persist(
    (set, get) => ({
      ...initialState,

      completeOnboarding: ({ kidName, ageGroup, avatarConfig, role }) =>
        set((s) => ({
          ...s,
          onboarded: true,
          kidName,
          ageGroup,
          role: role ?? s.role ?? "kid",
          avatarConfig: avatarConfig ?? s.avatarConfig,
        })),

      setKidName: (name) => set({ kidName: name }),
      setRole: (role) => set({ role }),
      setAgeGroup: (ageGroup) => set({ ageGroup }),
      setAvatar: (avatarConfig) => set({ avatarConfig }),
      setSound: (v) => set({ soundEnabled: v }),
      setMusic: (v) => set({ musicEnabled: v }),
      setDailyGoal: (v) => set({ dailyGoal: v }),
      setTimerMode: (v) => set({ timerMode: v }),
      setParentPin: (v) => set({ parentPin: v }),
      setClassTarget: (v) => set({ classTarget: v }),

      completeDailyChallenge: (dateKey) =>
        set({ dailyChallengeDone: dateKey ?? todayISO() }),

      addTeacherAssignment: ({ title, dueDate, subjectId = "math" }) => {
        if (!title || !dueDate) return;
        set((s) => ({
          teacherAssignments: [
            ...s.teacherAssignments,
            {
              id: crypto.randomUUID(),
              title,
              dueDate,
              subjectId,
              createdAt: new Date().toISOString(),
              done: false,
            },
          ],
        }));
      },

      toggleTeacherAssignment: (id) =>
        set((s) => ({
          teacherAssignments: s.teacherAssignments.map((a) =>
            a.id === id ? { ...a, done: !a.done } : a
          ),
        })),

      removeTeacherAssignment: (id) =>
        set((s) => ({
          teacherAssignments: s.teacherAssignments.filter((a) => a.id !== id),
        })),

      logParentDigest: (message) =>
        set((s) => ({
          parentDigestLog: [
            { id: crypto.randomUUID(), at: new Date().toISOString(), message },
            ...s.parentDigestLog,
          ].slice(0, 20),
        })),

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

        queueLessonUpsert(lessonId, subjectId, updated.lessonProgress[lessonId]);
        upsertUserStats({
          totalXP: updated.totalXP,
          totalPoints: updated.totalPoints,
          level: updated.level,
          currentStreak: updated.currentStreak,
          longestStreak: updated.longestStreak,
          lastPlayDate: updated.lastPlayDate,
          lessonsToday: updated.lessonsToday,
          badges: updated.badges,
        }).catch(() => {});

        return updated.pendingCelebration;
      },

      clearCelebration: () => set({ pendingCelebration: null }),

      grantXP: (amount) => {
        if (!amount || amount <= 0) return;
        set((s) => {
          const newXP = s.totalXP + amount;
          return {
            totalXP: newXP,
            totalPoints: (s.totalPoints ?? 0) + amount,
            level: levelForXP(newXP),
          };
        });
        get()._bumpStreak();
        const s = get();
        upsertUserStats({
          totalXP: s.totalXP,
          totalPoints: s.totalPoints,
          level: s.level,
          currentStreak: s.currentStreak,
          longestStreak: s.longestStreak,
          lastPlayDate: s.lastPlayDate,
          lessonsToday: s.lessonsToday,
          badges: s.badges,
        }).catch(() => {});
      },

      grantBadge: (badgeId) => {
        if (!badgeId) return;
        set((s) => {
          if (s.badges.includes(badgeId)) return s;
          const badges = [...s.badges, badgeId];
          const merged = { ...s, badges };
          return { badges: computeUnlockedBadges(merged) };
        });
      },

      tickLearnTime: (subjectId, deltaSeconds) => {
        if (!subjectId || deltaSeconds <= 0) return;
        const s = get();
        const today = todayISO();
        let learnXPDaily = s.learnXPDaily;
        if (learnXPDaily.date !== today) {
          learnXPDaily = { date: today, xpBySubject: {} };
        }
        const prevSeconds = s.learnSecondsBySubject[subjectId] ?? 0;
        const newSeconds = prevSeconds + deltaSeconds;
        const xpEarnedToday = learnXPDaily.xpBySubject[subjectId] ?? 0;
        const xpBlocks = Math.floor(newSeconds / 30) - Math.floor(prevSeconds / 30);
        let xpToAdd = 0;
        if (xpBlocks > 0) {
          xpToAdd = Math.min(xpBlocks, Math.max(0, 20 - xpEarnedToday));
        }

        const updated = {
          learnSecondsBySubject: {
            ...s.learnSecondsBySubject,
            [subjectId]: newSeconds,
          },
          learnXPDaily: {
            date: today,
            xpBySubject: {
              ...learnXPDaily.xpBySubject,
              [subjectId]: xpEarnedToday + xpToAdd,
            },
          },
        };

        if (xpToAdd > 0) {
          const newXP = s.totalXP + xpToAdd;
          updated.totalXP = newXP;
          updated.level = levelForXP(newXP);
        }

        const merged = { ...s, ...updated };
        updated.badges = computeUnlockedBadges(merged);

        set(updated);
      },

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
