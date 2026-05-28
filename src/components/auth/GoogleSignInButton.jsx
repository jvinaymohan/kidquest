import { useState } from "react";
import { useAuthStore } from "../../store/useAuthStore";
import { isGoogleOAuthEnabled } from "../../lib/featureFlags";
import { isSupabaseEnabled } from "../../lib/supabaseClient";

export function GoogleSignInButton({ className = "", label = "Continue with Google" }) {
  if (!isGoogleOAuthEnabled) return null;
  const signInWithGoogle = useAuthStore((s) => s.signInWithGoogle);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);

  async function onClick() {
    setError(null);
    if (!isSupabaseEnabled) {
      setError("Cloud sync is not configured.");
      return;
    }
    setBusy(true);
    const res = await signInWithGoogle();
    setBusy(false);
    if (!res.ok) setError(res.reason || "Google sign-in failed");
  }

  return (
    <div className="w-full">
      <button
        type="button"
        onClick={onClick}
        disabled={busy || !isSupabaseEnabled}
        className={
          className ||
          "w-full inline-flex items-center justify-center gap-2 bg-white text-ink font-display font-extrabold py-3 rounded-pill border-[1.5px] border-ink/15 focus-ring disabled:opacity-60"
        }
      >
        <GoogleG />
        {busy ? "Redirecting…" : label}
      </button>
      {error && <p className="text-error text-xs font-bold mt-1 text-center">{error}</p>}
    </div>
  );
}

function GoogleG() {
  return (
    <svg viewBox="0 0 18 18" width={18} height={18} aria-hidden>
      <path
        fill="#4285F4"
        d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 01-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"
      />
      <path
        fill="#34A853"
        d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z"
      />
      <path
        fill="#FBBC05"
        d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z"
      />
      <path
        fill="#EA4335"
        d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z"
      />
    </svg>
  );
}
