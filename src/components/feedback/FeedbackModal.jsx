import { useState } from "react";
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import { useAuthStore } from "../../store/useAuthStore";
import { useAppStore } from "../../store/useAppStore";
import { isSupabaseEnabled } from "../../lib/supabaseClient";
import { FEEDBACK_CATEGORIES, submitFeedback } from "../../lib/cloud/feedback";
import { saveLocalFeedback } from "../../lib/localFeedback";

export function FeedbackModal({ open, onClose }) {
  const location = useLocation();
  const user = useAuthStore((s) => s.user);
  const profile = useAuthStore((s) => s.profile);
  const kidName = useAppStore((s) => s.kidName);
  const role = useAppStore((s) => s.role);

  const [category, setCategory] = useState("general");
  const [message, setMessage] = useState("");
  const [rating, setRating] = useState(0);
  const [contactEmail, setContactEmail] = useState(user?.email ?? profile?.email ?? "");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState(null);

  if (!open) return null;

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    if (message.trim().length < 3) {
      setError("Please write a little more so we can help.");
      return;
    }
    setBusy(true);
    const payload = {
      userId: user?.id,
      contactEmail: contactEmail || user?.email,
      contactName: kidName || profile?.kid_name,
      userRole: role,
      pagePath: location.pathname,
      category,
      message: message.trim(),
      rating: rating || null,
    };

    let res;
    if (isSupabaseEnabled) {
      res = await submitFeedback(payload);
    } else {
      saveLocalFeedback(payload);
      res = { ok: true };
    }
    setBusy(false);
    if (!res.ok) {
      setError(res.reason ?? "Could not send feedback");
      return;
    }
    setDone(true);
    setTimeout(() => {
      setDone(false);
      setMessage("");
      setRating(0);
      onClose();
    }, 2200);
  }

  return (
    <motion.div
      className="fixed inset-0 z-[60] bg-ink/50 grid place-items-end sm:place-items-center p-4 safe-bottom"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        role="dialog"
        aria-labelledby="feedback-title"
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md bg-white rounded-3xl shadow-2xl ring-1 ring-ink/10 overflow-hidden max-h-[85vh] flex flex-col"
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-ink/10">
          <div>
            <h2 id="feedback-title" className="font-display font-extrabold text-lg">
              Send feedback
            </h2>
            <p className="text-xs font-medium text-ink/55">
              Help us improve KidQuest for kids & parents
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-ink/5 grid place-items-center focus-ring"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        {done ? (
          <div className="p-8 text-center">
            <div className="text-4xl mb-2" aria-hidden>
              💛
            </div>
            <p className="font-display font-extrabold text-lg">Thank you!</p>
            <p className="text-sm font-medium text-ink/60 mt-1">
              We read every message and use it to make KidQuest better.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-4 flex flex-col gap-3 overflow-y-auto">
            <fieldset>
              <legend className="text-xs font-bold text-ink/55 mb-2">What is this about?</legend>
              <div className="flex flex-wrap gap-2">
                {FEEDBACK_CATEGORIES.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setCategory(c.id)}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold focus-ring border ${
                      category === c.id
                        ? "bg-primary text-white border-primary"
                        : "bg-ink/5 border-ink/10 text-ink/70"
                    }`}
                  >
                    {c.emoji} {c.label}
                  </button>
                ))}
              </div>
            </fieldset>

            {!user && (
              <label className="flex flex-col gap-1 text-xs font-bold">
                Your email (so we can reply)
                <input
                  type="email"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  required
                  className="px-3 py-2 rounded-xl border border-ink/15 font-medium focus-ring"
                  placeholder="you@example.com"
                />
              </label>
            )}

            <label className="flex flex-col gap-1 text-xs font-bold">
              Your message
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={4}
                required
                maxLength={4000}
                placeholder={
                  category === "password"
                    ? "Tell us the email you signed up with and what happened…"
                    : "What worked well? What was confusing?"
                }
                className="px-3 py-2 rounded-xl border border-ink/15 font-medium resize-none focus-ring"
              />
            </label>

            <div>
              <p className="text-xs font-bold text-ink/55 mb-1">How is KidQuest so far? (optional)</p>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => setRating(n)}
                    className={`text-2xl focus-ring rounded p-1 ${rating >= n ? "" : "opacity-35"}`}
                    aria-label={`${n} stars`}
                  >
                    ⭐
                  </button>
                ))}
              </div>
            </div>

            {error && (
              <p className="text-error text-sm font-bold bg-error/10 px-3 py-2 rounded-xl">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={busy}
              className="w-full py-3 rounded-2xl bg-primary text-white font-display font-extrabold focus-ring disabled:opacity-60"
            >
              {busy ? "Sending…" : "Send feedback"}
            </button>
          </form>
        )}
      </motion.div>
    </motion.div>
  );
}
