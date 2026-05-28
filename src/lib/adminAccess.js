/** Comma-separated admin emails in VITE_ADMIN_EMAILS (optional extra gate). */
export function getAdminEmailAllowlist() {
  const raw = import.meta.env.VITE_ADMIN_EMAILS ?? "";
  return raw
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}

export function isAdminUser({ profile, email } = {}) {
  if (profile?.role === "admin") {
    const allowlist = getAdminEmailAllowlist();
    if (allowlist.length === 0) return true;
    const normalized = (email ?? profile?.email ?? "").toLowerCase();
    return allowlist.includes(normalized);
  }
  return false;
}
