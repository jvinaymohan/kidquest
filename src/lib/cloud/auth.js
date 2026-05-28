import { isSupabaseEnabled, supabase } from "../supabaseClient";

export async function signUpWithEmail({ email, password, kidName, ageGroup, role = "kid" }) {
  if (!isSupabaseEnabled) return { ok: false, reason: "supabase-disabled" };
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        kid_name: kidName ?? null,
        age_group: ageGroup ?? "adventurer",
        role,
        display_name: kidName ?? email.split("@")[0],
      },
    },
  });
  if (error) return { ok: false, reason: error.message };

  if (data.user) {
    await supabase
      .from("profiles")
      .upsert({
        id: data.user.id,
        email: email?.trim() || data.user.email || null,
        kid_name: kidName ?? null,
        display_name: kidName ?? email?.split("@")[0] ?? null,
        age_group: ageGroup ?? "adventurer",
        role,
      })
      .select()
      .single();
  }
  return { ok: true, user: data.user, session: data.session };
}

export async function signInWithGoogle() {
  if (!isSupabaseEnabled) return { ok: false, reason: "supabase-disabled" };
  const redirectTo =
    typeof window !== "undefined" ? `${window.location.origin}/auth/callback` : undefined;
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo,
      queryParams: { access_type: "offline", prompt: "consent" },
    },
  });
  if (error) return { ok: false, reason: error.message };
  return { ok: true, url: data?.url };
}

export async function signInWithEmail({ email, password }) {
  if (!isSupabaseEnabled) return { ok: false, reason: "supabase-disabled" };
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { ok: false, reason: error.message };
  return { ok: true, user: data.user, session: data.session };
}

export async function resetPasswordForEmail(email) {
  if (!isSupabaseEnabled) return { ok: false, reason: "supabase-disabled" };
  const redirectTo =
    typeof window !== "undefined" ? `${window.location.origin}/login` : undefined;
  const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo });
  if (error) return { ok: false, reason: error.message };
  return { ok: true };
}

export async function signOut() {
  if (!isSupabaseEnabled) return { ok: true };
  const { error } = await supabase.auth.signOut();
  if (error) return { ok: false, reason: error.message };
  return { ok: true };
}

export async function getSession() {
  if (!isSupabaseEnabled) return null;
  const { data } = await supabase.auth.getSession();
  return data?.session ?? null;
}

export function onAuthChange(callback) {
  if (!isSupabaseEnabled) return () => {};
  const { data } = supabase.auth.onAuthStateChange((event, session) => {
    callback({ event, session });
  });
  return () => data?.subscription?.unsubscribe?.();
}

export async function getProfile(userId) {
  if (!isSupabaseEnabled || !userId) return null;
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .maybeSingle();
  if (error) return null;
  return data;
}

export async function upsertProfile(profile) {
  if (!isSupabaseEnabled || !profile?.id) return { ok: false };
  const { error } = await supabase.from("profiles").upsert(profile);
  if (error) return { ok: false, reason: error.message };
  return { ok: true };
}

/** Keep profiles.email in sync with auth.users for admin user list & password resets. */
export async function syncProfileEmail(userId, email) {
  if (!isSupabaseEnabled || !userId || !email?.trim()) return { ok: false };
  return upsertProfile({ id: userId, email: email.trim() });
}
