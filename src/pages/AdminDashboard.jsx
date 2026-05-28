import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Users,
  MessageSquare,
  RefreshCw,
  Mail,
  ChevronLeft,
  Sparkles,
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
  const [userSearch, setUserSearch] = useState("");
  const [fbStatus, setFbStatus] = useState("all");
  const [fbCategory, setFbCategory] = useState("all");
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
      const [s, u, f] = await Promise.all([
        fetchAdminUserStats(),
        fetchAdminUsers({ search: userSearch }),
        fetchFeedbackForAdmin({ status: fbStatus, category: fbCategory }),
      ]);
      setStats(s);
      setUsers(u);
      setFeedback(f);
    } catch (e) {
      setError(e.message ?? "Failed to load admin data");
    } finally {
      setLoading(false);
    }
  }, [userSearch, fbStatus, fbCategory]);

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
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-5">
          <StatCard label="Total users" value={stats.total} icon={Users} />
          <StatCard label="New (7 days)" value={stats.newThisWeek} />
          <StatCard label="Open feedback" value={stats.openFeedback} icon={MessageSquare} />
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
