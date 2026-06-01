import { create } from "zustand";
import { isSupabaseEnabled, supabase } from "../lib/supabaseClient";
import {
  signInWithEmail,
  signInWithGoogle as cloudSignInWithGoogle,
  signUpWithEmail,
  signOut as cloudSignOut,
  getProfile,
  upsertProfile,
  syncProfileEmail,
  onAuthChange,
} from "../lib/cloud/auth";
import {
  setCloudUser,
  flushPending,
  fetchUserStats,
  fetchLessonProgress,
  fetchMulTableProgress,
  fetchMulFactProgress,
  upsertUserStats,
} from "../lib/cloud/progress";
import { useAppStore } from "./useAppStore";
import { mergeTables, useMultiplicationStore } from "./useMultiplicationStore";
import { fetchLifeExplorerItems } from "../lib/cloud/lifeExplorer";
import { useLifeExplorerStore } from "./useLifeExplorerStore";
import { useScreenTimeStore } from "./useScreenTimeStore";

export const useAuthStore = create((set, get) => ({
  initialized: false,
  loading: false,
  session: null,
  user: null,
  profile: null,
  authError: null,
  cloudReady: false,

  init: async () => {
    if (get().initialized) return;

    if (!isSupabaseEnabled) {
      set({ initialized: true });
      return;
    }

    const { data } = await supabase.auth.getSession();
    const session = data?.session ?? null;
    if (session?.user) {
      await get()._onLogin(session);
    } else {
      set({ session: null, user: null, profile: null, cloudReady: false });
    }

    onAuthChange(async ({ event, session: nextSession }) => {
      if (event === "SIGNED_IN" && nextSession?.user) {
        await get()._onLogin(nextSession);
      } else if (event === "SIGNED_OUT") {
        setCloudUser(null);
        set({ session: null, user: null, profile: null, cloudReady: false });
      }
    });

    set({ initialized: true });
  },

  _onLogin: async (session) => {
    const user = session.user;
    set({ session, user });
    setCloudUser(user.id);
    let profile = await getProfile(user.id);
    if (user.email && profile?.email !== user.email) {
      await syncProfileEmail(user.id, user.email);
      profile = await getProfile(user.id);
    }
    set({ profile, cloudReady: true });
    await get()._hydrateFromCloud(profile);
  },

  _hydrateFromCloud: async (profile) => {
    const app = useAppStore.getState();
    const mul = useMultiplicationStore.getState();

    const stats = await fetchUserStats();
    const lessonProgress = await fetchLessonProgress();
    const mulTables = await fetchMulTableProgress();
    const mulFacts = await fetchMulFactProgress();

    const patch = {};
    if (profile?.kid_name) patch.kidName = profile.kid_name;
    if (profile?.age_group) patch.ageGroup = profile.age_group;
    if (profile?.avatar_config) patch.avatarConfig = profile.avatar_config;
    if (profile?.parent_pin) patch.parentPin = profile.parent_pin;
    if (profile?.role) patch.role = profile.role;
    patch.onboarded = Boolean(profile?.kid_name);

    if (stats) {
      patch.totalXP = Math.max(app.totalXP ?? 0, stats.totalXP ?? 0);
      patch.totalPoints = Math.max(app.totalPoints ?? 0, stats.totalPoints ?? 0);
      patch.level = Math.max(app.level ?? 1, stats.level ?? 1);
      patch.currentStreak = Math.max(app.currentStreak ?? 0, stats.currentStreak ?? 0);
      patch.longestStreak = Math.max(app.longestStreak ?? 0, stats.longestStreak ?? 0);
      if (stats.lastPlayDate) patch.lastPlayDate = stats.lastPlayDate;
      if (stats.lessonsToday?.date) {
        patch.lessonsToday = stats.lessonsToday;
      }
      if (Array.isArray(stats.badges) && stats.badges.length) {
        const merged = new Set([...(app.badges ?? []), ...stats.badges]);
        patch.badges = [...merged];
      }
    }
    if (lessonProgress) {
      patch.lessonProgress = { ...app.lessonProgress, ...lessonProgress };
    }
    useAppStore.setState(patch);

    if (mulTables) {
      useMultiplicationStore.setState({
        tables: mergeTables({ ...mul.tables, ...mulTables }),
      });
    }
    if (mulFacts && Object.keys(mulFacts).length) {
      useMultiplicationStore.setState({
        facts: { ...mul.facts, ...mulFacts },
      });
    }

    const userId = get().user?.id;
    if (userId) {
      const lifeRows = await fetchLifeExplorerItems(userId);
      if (lifeRows.length) useLifeExplorerStore.getState().hydrateFromCloud(lifeRows);
    }

    await upsertUserStats({
      totalXP: useAppStore.getState().totalXP,
      totalPoints: useAppStore.getState().totalPoints,
      level: useAppStore.getState().level,
      currentStreak: useAppStore.getState().currentStreak,
      longestStreak: useAppStore.getState().longestStreak,
      lastPlayDate: useAppStore.getState().lastPlayDate,
      lessonsToday: useAppStore.getState().lessonsToday,
      badges: useAppStore.getState().badges,
    });
  },

  signUp: async ({ email, password, kidName, ageGroup, role = "kid", inviteCode }) => {
    set({ loading: true, authError: null });
    const res = await signUpWithEmail({ email, password, kidName, ageGroup, role, inviteCode });
    if (!res.ok) {
      set({ loading: false, authError: res.reason });
      return res;
    }
    if (res.session) {
      await get()._onLogin(res.session);
    } else if (res.user) {
      set({ user: res.user });
    }
    set({ loading: false });
    return res;
  },

  signInWithGoogle: async () => {
    set({ loading: true, authError: null });
    const res = await cloudSignInWithGoogle();
    if (!res.ok) {
      set({ loading: false, authError: res.reason });
      return res;
    }
    if (res.url && typeof window !== "undefined") {
      window.location.href = res.url;
    }
    set({ loading: false });
    return res;
  },

  signIn: async ({ email, password }) => {
    set({ loading: true, authError: null });
    const res = await signInWithEmail({ email, password });
    if (!res.ok) {
      set({ loading: false, authError: res.reason });
      return res;
    }
    const { data } = await supabase.auth.getSession();
    if (data?.session) {
      await get()._onLogin(data.session);
    }
    set({ loading: false });
    return res;
  },

  signOut: async () => {
    await flushPending().catch(() => {});
    await cloudSignOut();
    setCloudUser(null);
    try {
      useAppStore.persist?.clearStorage?.();
      useMultiplicationStore.persist?.clearStorage?.();
      useScreenTimeStore.persist?.clearStorage?.();
    } catch {
      // ignore storage clear errors
    }
    useAppStore.getState().resetAll?.();
    useMultiplicationStore.getState().resetProgress?.();
    useScreenTimeStore.setState({ byDate: {} });
    set({ session: null, user: null, profile: null, cloudReady: false });
  },

  updateProfile: async (patch) => {
    const user = get().user;
    if (!user) return { ok: false };
    const next = { id: user.id, ...patch };
    const res = await upsertProfile(next);
    if (res.ok) {
      const profile = await getProfile(user.id);
      set({ profile });
    }
    return res;
  },
}));
