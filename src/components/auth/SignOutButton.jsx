import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { LogOut } from "lucide-react";
import { useAppStore } from "../../store/useAppStore";
import { useAuthStore } from "../../store/useAuthStore";
import { Button } from "../ui/Button";

/**
 * Kid-friendly sign out with a warm confirmation (not scary).
 */
export function SignOutButton({
  variant = "ghost",
  size = "sm",
  fullWidth = false,
  className = "",
  label = "Sign out",
}) {
  const kidName = useAppStore((s) => s.kidName);
  const signOut = useAuthStore((s) => s.signOut);
  const session = useAuthStore((s) => s.session);
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);

  if (!session) return null;

  async function confirmSignOut() {
    setBusy(true);
    try {
      await signOut();
      navigate("/landing", { replace: true });
    } finally {
      setBusy(false);
      setOpen(false);
    }
  }

  return (
    <>
      <Button
        type="button"
        variant={variant}
        size={size}
        fullWidth={fullWidth}
        className={className}
        leftIcon={<LogOut size={16} />}
        onClick={() => setOpen(true)}
      >
        {label}
      </Button>

      {open && (
        <div className="fixed inset-0 z-[60] flex items-end justify-center p-4 pb-24 sm:items-center">
          <button
            type="button"
            className="absolute inset-0 bg-black/45"
            aria-label="Close"
            onClick={() => !busy && setOpen(false)}
          />
          <motion.div
            role="dialog"
            aria-labelledby="signout-title"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative w-full max-w-sm rounded-3xl border-[3px] border-ink/15 bg-white p-6 text-center shadow-chunkyLg"
          >
            <p className="text-4xl" aria-hidden>
              👋
            </p>
            <h2 id="signout-title" className="mt-2 font-display text-xl font-extrabold text-ink">
              See you next time{kidName ? `, ${kidName}` : ""}!
            </h2>
            <p className="mt-2 text-sm font-bold text-ink/60">
              Your adventure saves automatically. Come back anytime!
            </p>
            <div className="mt-5 flex flex-col gap-2 sm:flex-row">
              <Button variant="ghost" fullWidth onClick={() => setOpen(false)} disabled={busy}>
                Stay here
              </Button>
              <Button fullWidth onClick={confirmSignOut} disabled={busy}>
                {busy ? "Signing out…" : "Sign out"}
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
}
