import { isSupabaseEnabled, supabase } from "../supabaseClient";
import { resetPasswordForEmail } from "./auth";

export async function fetchAdminUserStats() {
  if (!isSupabaseEnabled) return null;
  const { count: total, error: e1 } = await supabase
    .from("profiles")
    .select("*", { count: "exact", head: true });
  if (e1) throw new Error(e1.message);

  const roles = ["kid", "parent", "teacher", "admin"];
  const byRole = {};
  for (const r of roles) {
    const { count, error } = await supabase
      .from("profiles")
      .select("*", { count: "exact", head: true })
      .eq("role", r);
    if (!error) byRole[r] = count ?? 0;
  }

  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);
  const { count: newThisWeek, error: e2 } = await supabase
    .from("profiles")
    .select("*", { count: "exact", head: true })
    .gte("created_at", weekAgo.toISOString());
  if (e2) throw new Error(e2.message);

  const { count: openFeedback, error: e3 } = await supabase
    .from("app_feedback")
    .select("*", { count: "exact", head: true })
    .in("status", ["new", "reviewing"]);
  if (e3) throw new Error(e3.message);

  return {
    total: total ?? 0,
    byRole,
    newThisWeek: newThisWeek ?? 0,
    openFeedback: openFeedback ?? 0,
  };
}

export async function fetchAdminUsers({ search = "", limit = 200 } = {}) {
  if (!isSupabaseEnabled) return [];
  let q = supabase
    .from("profiles")
    .select("id, email, kid_name, display_name, role, age_group, created_at")
    .order("created_at", { ascending: false })
    .limit(limit);
  const { data, error } = await q;
  if (error) throw new Error(error.message);
  const rows = data ?? [];
  if (!search.trim()) return rows;
  const s = search.trim().toLowerCase();
  return rows.filter(
    (r) =>
      (r.email ?? "").toLowerCase().includes(s) ||
      (r.kid_name ?? "").toLowerCase().includes(s) ||
      (r.display_name ?? "").toLowerCase().includes(s)
  );
}

export async function sendPasswordResetEmail(email) {
  if (!email?.trim()) return { ok: false, reason: "No email on file" };
  return resetPasswordForEmail(email.trim());
}

/** Heuristic “auto-fix” hints for the admin inbox (not AI — actionable checklists). */
export function buildSuggestedAction(item) {
  const cat = item?.category ?? "general";
  const msg = (item?.message ?? "").toLowerCase();
  const email = item?.contact_email?.trim();

  if (cat === "password") {
    return email
      ? `Send password reset to ${email}. Confirm Supabase Auth → URL Configuration: Site URL + /auth/callback for production.`
      : "Ask user for signup email via reply, then send reset from Users tab.";
  }
  if (cat === "bug" && (msg.includes("google") || msg.includes("oauth"))) {
    return "Enable Google in Supabase + set VITE_ENABLE_GOOGLE_OAUTH=true on Vercel (see docs/GOOGLE_AUTH.md).";
  }
  if (cat === "bug" && (msg.includes("404") || msg.includes("not found"))) {
    return "Check vercel.json SPA fallback and redeploy; confirm route exists in App.jsx.";
  }
  if (cat === "bug" && msg.includes("sync")) {
    return "Verify VITE_SUPABASE_* env vars on Vercel; user may need to re-run schema.sql in Supabase SQL Editor.";
  }
  if (cat === "feature") {
    return "Log in docs/ROADMAP.md; prioritize if multiple users request the same thing.";
  }
  if (cat === "praise") {
    return "Thank the family — consider highlighting in marketing or testimonials (with consent).";
  }
  return "Review message, reproduce on production, assign status, and link any GitHub issue.";
}
