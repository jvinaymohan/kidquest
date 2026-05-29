import { isSupabaseEnabled, supabase } from "../supabaseClient";

export const REFERRAL_STATUSES = ["pending", "approved", "rejected"];
export const INVITE_STATUSES = ["active", "used", "revoked", "expired"];

export async function submitReferralRequest({
  fullName,
  email,
  reason,
  referrerName,
  referrerEmail,
}) {
  if (!isSupabaseEnabled) return { ok: false, reason: "supabase-disabled" };
  const row = {
    full_name: fullName?.trim(),
    email: email?.trim()?.toLowerCase(),
    reason: reason?.trim(),
    referrer_name: referrerName?.trim() || null,
    referrer_email: referrerEmail?.trim()?.toLowerCase() || null,
    status: "pending",
  };
  const { data, error } = await supabase.from("referral_requests").insert(row).select("id").single();
  if (error) return { ok: false, reason: error.message };
  return { ok: true, id: data?.id ?? null };
}

export async function validateInviteCode({ code, email }) {
  if (!isSupabaseEnabled) return { ok: false, reason: "supabase-disabled", valid: false };
  const { data, error } = await supabase.rpc("validate_invite_code", {
    p_code: code?.trim() ?? "",
    p_email: email?.trim()?.toLowerCase() || null,
  });
  if (error) return { ok: false, valid: false, reason: error.message };
  const row = Array.isArray(data) ? data[0] : null;
  if (!row?.valid) {
    return { ok: false, valid: false, reason: row?.reason ?? "Invite is not valid." };
  }
  return { ok: true, valid: true, inviteId: row.invite_id };
}

export async function fetchAdminReferralRequests({ status = "all", limit = 200 } = {}) {
  if (!isSupabaseEnabled) return [];
  let q = supabase.from("referral_requests").select("*").order("created_at", { ascending: false }).limit(limit);
  if (status && status !== "all") q = q.eq("status", status);
  const { data, error } = await q;
  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function updateReferralRequestAdmin(id, patch) {
  if (!isSupabaseEnabled) return { ok: false, reason: "supabase-disabled" };
  const { error } = await supabase.from("referral_requests").update(patch).eq("id", id);
  if (error) return { ok: false, reason: error.message };
  return { ok: true };
}

function randomInviteCode() {
  const seed =
    globalThis.crypto?.randomUUID?.().replace(/-/g, "").slice(0, 10).toUpperCase() ??
    `${Date.now()}`;
  return `KQ-${seed}`;
}

export async function createInviteCodeAdmin({
  code,
  issuedToEmail,
  note,
  approvedRequestId,
  expiresAt,
  issuedBy,
}) {
  if (!isSupabaseEnabled) return { ok: false, reason: "supabase-disabled" };
  const payload = {
    code: (code?.trim() || randomInviteCode()).toUpperCase(),
    status: "active",
    issued_to_email: issuedToEmail?.trim()?.toLowerCase() || null,
    note: note?.trim() || null,
    approved_request_id: approvedRequestId ?? null,
    issued_by: issuedBy ?? null,
    expires_at: expiresAt || null,
  };
  const { data, error } = await supabase.from("invite_codes").insert(payload).select("*").single();
  if (error) return { ok: false, reason: error.message };
  return { ok: true, invite: data };
}

export async function fetchAdminInviteCodes({ status = "all", limit = 200 } = {}) {
  if (!isSupabaseEnabled) return [];
  let q = supabase.from("invite_codes").select("*").order("issued_at", { ascending: false }).limit(limit);
  if (status && status !== "all") q = q.eq("status", status);
  const { data, error } = await q;
  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function updateInviteCodeAdmin(id, patch) {
  if (!isSupabaseEnabled) return { ok: false, reason: "supabase-disabled" };
  const { error } = await supabase.from("invite_codes").update(patch).eq("id", id);
  if (error) return { ok: false, reason: error.message };
  return { ok: true };
}
