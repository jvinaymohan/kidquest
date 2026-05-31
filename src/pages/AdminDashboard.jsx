import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Users,
  MessageSquare,
  RefreshCw,
  Mail,
  ChevronLeft,
  Sparkles,
  Ticket,
  UserPlus,
} from "lucide-react";
import {
  fetchAdminUserStats,
  fetchAdminUsers,
  sendPasswordResetEmail,
  buildSuggestedAction,
} from "../lib/cloud/admin";
import {
  FEEDBACK_CATEGORIES,
  fetchFeedbackForAdmin,
  updateFeedbackAdmin,
} from "../lib/cloud/feedback";
import {
  fetchAdminReferralRequests,
  updateReferralRequestAdmin,
  fetchAdminInviteCodes,
  createInviteCodeAdmin,
  updateInviteCodeAdmin,
} from "../lib/cloud/invites";
import { useAuthStore } from "../store/useAuthStore";

const STATUS_OPTIONS = [
  { id: "new", label: "New" },
  { id: "reviewing", label: "Reviewing" },
  { id: "resolved", label: "Resolved" },
  { id: "wontfix", label: "Won't fix" },
];

function formatDate(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function AdminDashboard() {
  const user = useAuthStore((s) => s.user);
  const [tab, setTab] = useState("feedback");
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [feedback, setFeedback] = useState([]);
  const [referrals, setReferrals] = useState([]);
  const [invites, setInvites] = useState([]);
  const [userSearch, setUserSearch] = useState("");
  const [fbStatus, setFbStatus] = useState("all");
  const [fbCategory, setFbCategory] = useState("all");
  const [referralStatus, setReferralStatus] = useState("all");
  const [inviteStatus, setInviteStatus] = useState("all");
  const [newInviteEmail, setNewInviteEmail] = useState("");
  const [newInviteNote, setNewInviteNote] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  };

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [sRes, uRes, fRes, rRes, iRes] = await Promise.allSettled([
        fetchAdminUserStats(),
        fetchAdminUsers({ search: userSearch }),
        fetchFeedbackForAdmin({ status: fbStatus, category: fbCategory }),
        fetchAdminReferralRequests({ status: referralStatus }),
        fetchAdminInviteCodes({ status: inviteStatus }),
      ]);

      const schemaHint =
        "Run supabase/patch-invites-referrals.sql in Supabase → SQL Editor (or npm run db:apply).";

      if (sRes.status === "fulfilled") setStats(sRes.value);
      else setStats(null);

      if (uRes.status === "fulfilled") setUsers(uRes.value);
      else setUsers([]);

      if (fRes.status === "fulfilled") setFeedback(fRes.value);
      else setFeedback([]);

      if (rRes.status === "fulfilled") {
        setReferrals(rRes.value);
      } else {
        setReferrals([]);
        const msg = rRes.reason?.message ?? String(rRes.reason);
        if (/referral_requests|schema cache/i.test(msg)) {
          setError(`${msg} — ${schemaHint}`);
        }
      }

      if (iRes.status === "fulfilled") {
        setInvites(iRes.value);
      } else {
        setInvites([]);
        const msg = iRes.reason?.message ?? String(iRes.reason);
        if (/invite_codes|schema cache/i.test(msg)) {
          setError((prev) => prev ?? `${msg} — ${schemaHint}`);
        }
      }

      const hardFail = [sRes, uRes, fRes].find((r) => r.status === "rejected");
      if (hardFail && hardFail.status === "rejected") {
        throw hardFail.reason;
      }
    } catch (e) {
      setError(e.message ?? "Failed to load admin data");
    } finally {
      setLoading(false);
    }
  }, [userSearch, fbStatus, fbCategory, referralStatus, inviteStatus]);

  useEffect(() => {
    load();
  }, [load]);

  async function handlePasswordReset(email) {
    if (!email) {
      showToast("No email on this profile — check feedback contact email.");
      return;
    }
    const res = await sendPasswordResetEmail(email);
    showToast(res.ok ? `Reset email sent to ${email}` : res.reason ?? "Failed to send");
  }

  async function saveFeedbackRow(id, patch) {
    const res = await updateFeedbackAdmin(id, patch);
    if (!res.ok) {
      showToast(res.reason ?? "Update failed");
      return;
    }
    setFeedback((rows) => rows.map((r) => (r.id === id ? { ...r, ...patch } : r)));
    showToast("Feedback updated");
  }

  async function handleReferralDecision(item, status) {
    const patch = {
      status,
      reviewed_by: user?.id ?? null,
      reviewed_at: new Date().toISOString(),
    };
    const res = await updateReferralRequestAdmin(item.id, patch);
    if (!res.ok) {
      showToast(res.reason ?? "Could not update referral");
      return;
    }
    setReferrals((rows) => rows.map((r) => (r.id === item.id ? { ...r, ...patch } : r)));
    showToast(`Referral marked ${status}`);
  }

  async function handleCreateInvite({ requestId = null, email = null, note = null } = {}) {
    const res = await createInviteCodeAdmin({
      issuedToEmail: email || newInviteEmail,
      note: note || newInviteNote,
      approvedRequestId: requestId,
      issuedBy: user?.id ?? null,
    });
    if (!res.ok) {
      showToast(res.reason ?? "Failed to create invite");
      return null;
    }
    setInvites((rows) => [res.invite, ...rows]);
    if (!requestId) {
      setNewInviteEmail("");
      setNewInviteNote("");
    }
    showToast(`Invite created: ${res.invite.code}`);
    return res.invite;
  }

  async function approveReferralAndIssueInvite(item) {
    const invite = await handleCreateInvite({
      requestId: item.id,
      email: item.email,
      note: `Approved referral for ${item.full_name}`,
    });
    if (!invite) return;
    const patch = {
      status: "approved",
      reviewed_by: user?.id ?? null,
      reviewed_at: new Date().toISOString(),
      approved_invite_id: invite.id,
    };
    const res = await updateReferralRequestAdmin(item.id, patch);
    if (!res.ok) {
      showToast(res.reason ?? "Invite created, but referral update failed");
      return;
    }
    setReferrals((rows) => rows.map((r) => (r.id === item.id ? { ...r, ...patch } : r)));
    showToast("Referral approved and invite issued");
  }

  async function markInviteStatus(id, status) {
    const patch = status === "used" ? { status, used_at: new Date().toISOString() } : { status };
    const res = await updateInviteCodeAdmin(id, patch);
    if (!res.ok) {
      showToast(res.reason ?? "Could not update invite");
      return;
    }
    setInvites((rows) => rows.map((r) => (r.id === id ? { ...r, ...patch } : r)));
    showToast(`Invite marked ${status}`);
  }

  function applySuggestion(item) {
    const text = buildSuggestedAction(item);
    saveFeedbackRow(item.id, { suggested_action: text, status: "reviewing" });
  }

  return (
    <div className="max-w-3xl mx-auto pb-24">
      <div className="flex items-center gap-3 mb-4">
        <Link
          to="/home"
          className="w-10 h-10 rounded-xl bg-ink/5 grid place-items-center focus-ring"
          aria-label="Back home"
        >
          <ChevronLeft size={20} />
        </Link>
        <div className="flex-1">
          <h1 className="font-display text-2xl font-extrabold">Admin</h1>
          <p className="text-xs font-medium text-ink/55">
            Signed in as {user?.email}
          </p>
        </div>
        <button
          type="button"
          onClick={load}
          disabled={loading}
          className="px-3 py-2 rounded-xl bg-ink/5 text-sm font-bold focus-ring flex items-center gap-1"
        >
          <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      {error && (
        <p className="mb-4 text-sm font-bold text-error bg-error/10 px-3 py-2 rounded-xl">
          {error}
        </p>
      )}

      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-5">
          <StatCard label="Total users" value={stats.total} icon={Users} />
          <StatCard label="New (7 days)" value={stats.newThisWeek} />
          <StatCard label="Open feedback" value={stats.openFeedback} icon={MessageSquare} />
          <StatCard label="Pending referrals" value={stats.pendingReferrals} icon={UserPlus} />
          <StatCard label="Active invites" value={stats.activeInvites} icon={Ticket} />
          <StatCard
            label="Parents"
            value={stats.byRole?.parent ?? 0}
            sub={`Kids: ${stats.byRole?.kid ?? 0}`}
          />
        </div>
      )}

      <div className="flex gap-2 mb-4">
        {[
          { id: "feedback", label: "Feedback" },
          { id: "users", label: "Users & passwords" },
          { id: "referrals", label: "Referrals" },
          { id: "invites", label: "Invites" },
        ].map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={`flex-1 py-2.5 rounded-xl text-sm font-display font-extrabold focus-ring ${
              tab === t.id ? "bg-primary text-white" : "bg-ink/5 text-ink/70"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "users" && (
        <section className="space-y-3">
          <input
            type="search"
            value={userSearch}
            onChange={(e) => setUserSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && load()}
            placeholder="Search email or name…"
            className="w-full px-3 py-2.5 rounded-xl border border-ink/15 font-medium focus-ring"
          />
          <p className="text-xs font-medium text-ink/55">
            Send a Supabase password-reset link when someone is locked out. They can also use
            Feedback → Password / login help.
          </p>
          <ul className="space-y-2">
            {users.map((u) => (
              <li
                key={u.id}
                className="p-3 rounded-2xl bg-white ring-1 ring-ink/10 flex flex-col sm:flex-row sm:items-center gap-2"
              >
                <div className="flex-1 min-w-0">
                  <p className="font-display font-extrabold text-sm truncate">
                    {u.kid_name || u.display_name || "—"}
                  </p>
                  <p className="text-xs font-medium text-ink/55 truncate">
                    {u.email || "No email saved"}
                  </p>
                  <p className="text-[10px] font-bold text-ink/40 mt-0.5">
                    {u.role} · joined {formatDate(u.created_at)}
                  </p>
                </div>
                <button
                  type="button"
                  disabled={!u.email}
                  onClick={() => handlePasswordReset(u.email)}
                  className="shrink-0 px-3 py-2 rounded-xl bg-ink text-white text-xs font-bold focus-ring disabled:opacity-40 flex items-center gap-1"
                >
                  <Mail size={14} />
                  Send reset email
                </button>
              </li>
            ))}
            {!loading && users.length === 0 && (
              <p className="text-sm text-ink/50 text-center py-6">No users found.</p>
            )}
          </ul>
        </section>
      )}

      {tab === "feedback" && (
        <section className="space-y-3">
          <div className="flex flex-wrap gap-2">
            <select
              value={fbStatus}
              onChange={(e) => setFbStatus(e.target.value)}
              className="px-3 py-2 rounded-xl border border-ink/15 text-sm font-bold focus-ring"
            >
              <option value="all">All statuses</option>
              {STATUS_OPTIONS.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.label}
                </option>
              ))}
            </select>
            <select
              value={fbCategory}
              onChange={(e) => setFbCategory(e.target.value)}
              className="px-3 py-2 rounded-xl border border-ink/15 text-sm font-bold focus-ring"
            >
              <option value="all">All categories</option>
              {FEEDBACK_CATEGORIES.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.emoji} {c.label}
                </option>
              ))}
            </select>
          </div>

          <ul className="space-y-3">
            {feedback.map((item) => (
              <FeedbackCard
                key={item.id}
                item={item}
                onSave={(patch) => saveFeedbackRow(item.id, patch)}
                onSuggest={() => applySuggestion(item)}
                onPasswordReset={() =>
                  handlePasswordReset(item.contact_email)
                }
              />
            ))}
            {!loading && feedback.length === 0 && (
              <p className="text-sm text-ink/50 text-center py-8">
                No feedback yet — share the app and encourage parents & kids to use the 💬 button.
              </p>
            )}
          </ul>
        </section>
      )}

      {tab === "referrals" && (
        <section className="space-y-3">
          <div className="flex flex-wrap gap-2">
            <select
              value={referralStatus}
              onChange={(e) => setReferralStatus(e.target.value)}
              className="px-3 py-2 rounded-xl border border-ink/15 text-sm font-bold focus-ring"
            >
              <option value="all">All statuses</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
          <ul className="space-y-3">
            {referrals.map((item) => (
              <li key={item.id} className="p-4 rounded-2xl bg-white ring-1 ring-ink/10 space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <p className="font-display font-extrabold text-sm">{item.full_name}</p>
                  <span className="text-xs font-bold px-2 py-1 rounded-full bg-ink/5">{item.status}</span>
                </div>
                <p className="text-xs font-medium text-ink/60">{item.email}</p>
                <p className="text-sm text-ink whitespace-pre-wrap">{item.reason}</p>
                {(item.referrer_name || item.referrer_email) && (
                  <p className="text-xs text-ink/50 font-medium">
                    Referred by {item.referrer_name || "Unknown"} {item.referrer_email ? `(${item.referrer_email})` : ""}
                  </p>
                )}
                <p className="text-[11px] text-ink/45 font-medium">{formatDate(item.created_at)}</p>
                {item.status === "pending" && (
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => approveReferralAndIssueInvite(item)}
                      className="px-3 py-1.5 rounded-xl bg-primary text-white text-xs font-bold focus-ring"
                    >
                      Approve + issue invite
                    </button>
                    <button
                      type="button"
                      onClick={() => handleReferralDecision(item, "rejected")}
                      className="px-3 py-1.5 rounded-xl bg-ink/10 text-ink text-xs font-bold focus-ring"
                    >
                      Reject
                    </button>
                  </div>
                )}
              </li>
            ))}
            {!loading && referrals.length === 0 && (
              <p className="text-sm text-ink/50 text-center py-8">No referral requests in this filter.</p>
            )}
          </ul>
        </section>
      )}

      {tab === "invites" && (
        <section className="space-y-3">
          <div className="p-3 rounded-2xl bg-white ring-1 ring-ink/10 space-y-2">
            <p className="text-xs font-bold text-ink/55">Create invite</p>
            <input
              type="email"
              value={newInviteEmail}
              onChange={(e) => setNewInviteEmail(e.target.value)}
              placeholder="Issued to email (optional)"
              className="w-full px-3 py-2.5 rounded-xl border border-ink/15 font-medium focus-ring"
            />
            <input
              value={newInviteNote}
              onChange={(e) => setNewInviteNote(e.target.value)}
              placeholder="Internal note (optional)"
              className="w-full px-3 py-2.5 rounded-xl border border-ink/15 font-medium focus-ring"
            />
            <button
              type="button"
              onClick={() => handleCreateInvite()}
              className="px-3 py-2 rounded-xl bg-primary text-white text-sm font-bold focus-ring"
            >
              Generate invite
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            <select
              value={inviteStatus}
              onChange={(e) => setInviteStatus(e.target.value)}
              className="px-3 py-2 rounded-xl border border-ink/15 text-sm font-bold focus-ring"
            >
              <option value="all">All statuses</option>
              <option value="active">Active</option>
              <option value="used">Used</option>
              <option value="revoked">Revoked</option>
              <option value="expired">Expired</option>
            </select>
          </div>
          <ul className="space-y-2">
            {invites.map((invite) => (
              <li
                key={invite.id}
                className="p-3 rounded-2xl bg-white ring-1 ring-ink/10 flex flex-col gap-1"
              >
                <p className="font-display text-sm font-extrabold break-all">{invite.code}</p>
                <p className="text-xs font-medium text-ink/55">
                  {invite.issued_to_email || "Any email"} · {invite.status} · issued {formatDate(invite.issued_at)}
                </p>
                {invite.note && <p className="text-xs text-ink/50">{invite.note}</p>}
                <div className="flex flex-wrap gap-2 pt-1">
                  {invite.status !== "used" && (
                    <button
                      type="button"
                      onClick={() => markInviteStatus(invite.id, "used")}
                      className="px-2 py-1 rounded-lg bg-ink text-white text-[11px] font-bold focus-ring"
                    >
                      Mark used
                    </button>
                  )}
                  {invite.status !== "revoked" && (
                    <button
                      type="button"
                      onClick={() => markInviteStatus(invite.id, "revoked")}
                      className="px-2 py-1 rounded-lg bg-ink/10 text-ink text-[11px] font-bold focus-ring"
                    >
                      Revoke
                    </button>
                  )}
                </div>
              </li>
            ))}
            {!loading && invites.length === 0 && (
              <p className="text-sm text-ink/50 text-center py-8">No invites in this filter.</p>
            )}
          </ul>
        </section>
      )}

      {toast && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[70] px-4 py-2 rounded-full bg-ink text-white text-sm font-bold shadow-lg">
          {toast}
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value, sub, icon: Icon }) {
  return (
    <div className="p-3 rounded-2xl bg-white ring-1 ring-ink/10">
      {Icon && <Icon size={16} className="text-primary mb-1" />}
      <p className="font-display text-xl font-extrabold">{value}</p>
      <p className="text-[10px] font-bold text-ink/50">{label}</p>
      {sub && <p className="text-[10px] font-medium text-ink/40">{sub}</p>}
    </div>
  );
}

function FeedbackCard({ item, onSave, onSuggest, onPasswordReset }) {
  const [notes, setNotes] = useState(item.admin_notes ?? "");
  const [status, setStatus] = useState(item.status);
  const cat = FEEDBACK_CATEGORIES.find((c) => c.id === item.category);

  return (
    <li className="p-4 rounded-2xl bg-white ring-1 ring-ink/10 space-y-2">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-ink/5">
            {cat?.emoji} {cat?.label ?? item.category}
          </span>
          {item.rating && (
            <span className="ml-2 text-xs" aria-label={`${item.rating} stars`}>
              {"⭐".repeat(item.rating)}
            </span>
          )}
        </div>
        <select
          value={status}
          onChange={(e) => {
            setStatus(e.target.value);
            onSave({ status: e.target.value });
          }}
          className="text-xs font-bold px-2 py-1 rounded-lg border border-ink/15 focus-ring"
        >
          {STATUS_OPTIONS.map((s) => (
            <option key={s.id} value={s.id}>
              {s.label}
            </option>
          ))}
        </select>
      </div>

      <p className="text-sm font-medium text-ink whitespace-pre-wrap">{item.message}</p>

      <p className="text-[11px] font-medium text-ink/50">
        {item.contact_name && `${item.contact_name} · `}
        {item.contact_email || "no email"}
        {item.user_role && ` · ${item.user_role}`}
        {item.page_path && ` · ${item.page_path}`}
        <br />
        {formatDate(item.created_at)}
      </p>

      {item.suggested_action && (
        <div className="text-xs font-medium bg-primary/10 text-ink px-3 py-2 rounded-xl">
          <span className="font-bold">Suggested fix: </span>
          {item.suggested_action}
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={onSuggest}
          className="px-3 py-1.5 rounded-xl bg-primary/15 text-primary text-xs font-bold focus-ring flex items-center gap-1"
        >
          <Sparkles size={14} />
          Suggest fix
        </button>
        {item.category === "password" && item.contact_email && (
          <button
            type="button"
            onClick={onPasswordReset}
            className="px-3 py-1.5 rounded-xl bg-ink text-white text-xs font-bold focus-ring"
          >
            Send reset email
          </button>
        )}
      </div>

      <label className="block text-xs font-bold text-ink/55">
        Admin notes
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={2}
          className="mt-1 w-full px-3 py-2 rounded-xl border border-ink/15 font-medium text-sm resize-none focus-ring"
          placeholder="What you did, links to issues, etc."
        />
      </label>
      <button
        type="button"
        onClick={() => onSave({ admin_notes: notes })}
        className="text-xs font-bold text-primary focus-ring"
      >
        Save notes
      </button>
    </li>
  );
}
