import { isSupabaseEnabled, supabase } from "../supabaseClient";

function randomFriendCode() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let s = "";
  for (let i = 0; i < 8; i++) s += chars[Math.floor(Math.random() * chars.length)];
  return s;
}

export async function getOrCreateFriendCode(userId) {
  if (!isSupabaseEnabled || !userId) return null;
  const { data: existing } = await supabase.from("friend_codes").select("code").eq("user_id", userId).maybeSingle();
  if (existing?.code) return existing.code;
  const code = randomFriendCode();
  const { error } = await supabase.from("friend_codes").upsert({ user_id: userId, code });
  if (error) return null;
  return code;
}

export async function addFriendByCode({ userId, code }) {
  if (!isSupabaseEnabled || !userId || !code) return { ok: false, reason: "missing" };
  const { data: row, error: lookupErr } = await supabase
    .from("friend_codes")
    .select("user_id")
    .eq("code", code.trim().toUpperCase())
    .maybeSingle();
  if (lookupErr) return { ok: false, reason: lookupErr.message };
  if (!row?.user_id) return { ok: false, reason: "Code not found" };
  if (row.user_id === userId) return { ok: false, reason: "That's your own code" };

  const { error } = await supabase.from("friend_links").upsert([
    { user_id: userId, friend_user_id: row.user_id },
    { user_id: row.user_id, friend_user_id: userId },
  ]);
  if (error) return { ok: false, reason: error.message };
  return { ok: true, friendUserId: row.user_id };
}

export async function listFriends(userId) {
  if (!isSupabaseEnabled || !userId) return [];
  const { data, error } = await supabase
    .from("friend_links")
    .select("friend_user_id, profiles:friend_user_id(kid_name, display_name, age_group)")
    .eq("user_id", userId);
  if (error || !data) return [];
  return data.map((r) => ({
    id: r.friend_user_id,
    name: r.profiles?.kid_name ?? r.profiles?.display_name ?? "Friend",
    ageGroup: r.profiles?.age_group,
  }));
}

export async function submitDailyDuel({ userId, score, total, answers }) {
  if (!isSupabaseEnabled || !userId) return { ok: false };
  const duelDate = new Date().toISOString().slice(0, 10);
  const { error } = await supabase.from("daily_duels").upsert({
    duel_date: duelDate,
    user_id: userId,
    score,
    total,
    answers,
  });
  if (error) return { ok: false, reason: error.message };
  return { ok: true };
}

export async function fetchTodayDuel(userId) {
  if (!isSupabaseEnabled || !userId) return null;
  const duelDate = new Date().toISOString().slice(0, 10);
  const { data } = await supabase
    .from("daily_duels")
    .select("*")
    .eq("user_id", userId)
    .eq("duel_date", duelDate)
    .maybeSingle();
  return data;
}
