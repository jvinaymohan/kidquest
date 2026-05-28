import { isSupabaseEnabled, supabase } from "../supabaseClient";

export const FEEDBACK_CATEGORIES = [
  { id: "general", label: "General", emoji: "💬" },
  { id: "bug", label: "Something broke", emoji: "🐛" },
  { id: "feature", label: "Idea", emoji: "✨" },
  { id: "password", label: "Password / login help", emoji: "🔑" },
  { id: "praise", label: "We love it!", emoji: "💛" },
  { id: "other", label: "Other", emoji: "📝" },
];

export async function submitFeedback({
  userId,
  contactEmail,
  contactName,
  userRole,
  pagePath,
  category,
  message,
  rating,
}) {
  if (!isSupabaseEnabled) {
    return { ok: false, reason: "Cloud is off — feedback saved locally only in this build." };
  }
  const row = {
    user_id: userId ?? null,
    contact_email: contactEmail?.trim() || null,
    contact_name: contactName?.trim() || null,
    user_role: userRole ?? null,
    page_path: pagePath ?? null,
    category: category ?? "general",
    message: message.trim(),
    rating: rating ?? null,
    status: "new",
  };
  const { data, error } = await supabase.from("app_feedback").insert(row).select("id").single();
  if (error) return { ok: false, reason: error.message };
  return { ok: true, id: data.id };
}

export async function fetchFeedbackForAdmin({ status, category, limit = 100 } = {}) {
  if (!isSupabaseEnabled) return [];
  let q = supabase
    .from("app_feedback")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);
  if (status && status !== "all") q = q.eq("status", status);
  if (category && category !== "all") q = q.eq("category", category);
  const { data, error } = await q;
  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function updateFeedbackAdmin(id, patch) {
  if (!isSupabaseEnabled) return { ok: false, reason: "supabase-disabled" };
  const { error } = await supabase.from("app_feedback").update(patch).eq("id", id);
  if (error) return { ok: false, reason: error.message };
  return { ok: true };
}
