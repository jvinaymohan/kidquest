import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase, isSupabaseEnabled } from "../lib/supabaseClient";
import { useAuthStore } from "../store/useAuthStore";
import { useAppStore } from "../store/useAppStore";
import { Mascot } from "../components/mascots/Mascot";

export default function AuthCallback() {
  const navigate = useNavigate();
  const init = useAuthStore((s) => s.init);
  const profile = useAuthStore((s) => s.profile);
  const session = useAuthStore((s) => s.session);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isSupabaseEnabled) {
      navigate("/landing", { replace: true });
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const { data, error: err } = await supabase.auth.getSession();
        if (err) throw err;
        if (!data.session) {
          const hash = window.location.hash;
          if (hash.includes("access_token")) {
            await new Promise((r) => setTimeout(r, 400));
          }
        }
        await init();
        if (cancelled) return;
      } catch (e) {
        if (!cancelled) setError(e.message || "Sign-in failed");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [init, navigate]);

  useEffect(() => {
    if (!session) return;
    const onboarded = useAppStore.getState().onboarded;
    const name = profile?.kid_name?.trim();
    if (!onboarded || !name) {
      navigate("/onboarding", { replace: true, state: { oauth: true } });
      return;
    }
    navigate("/home", { replace: true });
  }, [session, profile, navigate]);

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
        <p className="text-error font-bold">{error}</p>
        <a href="/login" className="mt-4 text-primary font-extrabold">
          Back to sign in
        </a>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-3">
      <Mascot kind="owl" size={64} />
      <p className="font-display font-extrabold">Signing you in…</p>
    </div>
  );
}
