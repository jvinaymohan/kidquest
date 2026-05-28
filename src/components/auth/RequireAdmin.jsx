import { Navigate } from "react-router-dom";
import { useAuthStore } from "../../store/useAuthStore";
import { isSupabaseEnabled } from "../../lib/supabaseClient";
import { isAdminUser } from "../../lib/adminAccess";

export function RequireAdmin({ children }) {
  const session = useAuthStore((s) => s.session);
  const profile = useAuthStore((s) => s.profile);
  const user = useAuthStore((s) => s.user);
  const cloudReady = useAuthStore((s) => s.cloudReady);

  if (!isSupabaseEnabled) {
    return (
      <div className="p-6 text-center">
        <p className="font-display font-extrabold">Admin needs Supabase</p>
        <p className="text-sm text-ink/60 mt-2">Enable cloud sync to use the admin dashboard.</p>
      </div>
    );
  }

  if (!session) {
    return <Navigate to="/login" replace state={{ from: "/admin" }} />;
  }

  if (!cloudReady) {
    return (
      <div className="min-h-[40vh] grid place-items-center">
        <p className="font-display font-extrabold text-ink/60">Loading admin…</p>
      </div>
    );
  }

  if (!isAdminUser({ profile, email: user?.email ?? profile?.email })) {
    return <Navigate to="/home" replace />;
  }

  return children;
}
