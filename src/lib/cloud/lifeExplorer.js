import { isSupabaseEnabled, supabase } from "../supabaseClient";

export async function fetchLifeExplorerItems(userId) {
  if (!isSupabaseEnabled || !userId) return [];
  const { data, error } = await supabase
    .from("life_explorer_items")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
  if (error || !data) return [];
  return data;
}

export async function upsertLifeExplorerItem({ userId, id, itemType, title, body, meta, shareScope }) {
  if (!isSupabaseEnabled || !userId) return { ok: false };
  const row = {
    user_id: userId,
    item_type: itemType,
    title,
    body: body ?? null,
    meta: meta ?? {},
    share_scope: shareScope ?? "private",
  };
  if (id) row.id = id;
  const { data, error } = await supabase.from("life_explorer_items").upsert(row).select().single();
  if (error) return { ok: false, reason: error.message };
  return { ok: true, item: data };
}

export async function deleteLifeExplorerItem(userId, id) {
  if (!isSupabaseEnabled || !userId || !id) return { ok: false };
  const { error } = await supabase.from("life_explorer_items").delete().eq("user_id", userId).eq("id", id);
  if (error) return { ok: false, reason: error.message };
  return { ok: true };
}
