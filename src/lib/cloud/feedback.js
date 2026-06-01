import { isSupabaseEnabled, supabase } from "../supabaseClient";
import { saveLocalFeedback } from "../localFeedback";

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
    saveLocalFeedback({
      userId,
      contactEmail,
      contactName,
      userRole,
      pagePath,
      category,
      message,
      rating,
    });
    return { ok: true, id: null, local: true };
  }
  const trimmedMessage = message.trim();
  const { data, error } = await supabase.rpc("submit_app_feedback", {
    p_contact_email: contactEmail?.trim()?.toLowerCase() || null,
    p_contact_name: contactName?.trim() || null,
    p_user_role: userRole ?? null,
    p_page_path: pagePath ?? null,
    p_category: category ?? "general",
    p_message: trimmedMessage,
    p_rating: rating ?? null,
  });
  if (!error) {
    return { ok: true, id: data ?? null };
  }
  // Never fall back to direct table insert — RLS blocks it in production.
  saveLocalFeedback({
    userId,
    contactEmail,
    contactName,
    userRole,
    pagePath,
    category,
    message: trimmedMessage,
    rating,
    rpcError: error.message,
  });
  return {
    ok: false,
    reason:
      error.message.includes("row-level security") || error.message.includes("submit_app_feedback")
        ? "Feedback couldn't reach the server right now. We saved it on this device — try again later or email support."
        : error.message,
  };
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
