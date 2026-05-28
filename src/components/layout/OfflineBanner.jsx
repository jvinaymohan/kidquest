import { useEffect, useState } from "react";
import { WifiOff } from "lucide-react";
import { isSupabaseEnabled } from "../../lib/supabaseClient";

export function OfflineBanner() {
  const [offline, setOffline] = useState(
    typeof navigator !== "undefined" ? !navigator.onLine : false
  );

  useEffect(() => {
    const on = () => setOffline(false);
    const off = () => setOffline(true);
    window.addEventListener("online", on);
    window.addEventListener("offline", off);
    return () => {
      window.removeEventListener("online", on);
      window.removeEventListener("offline", off);
    };
  }, []);

  if (!offline || !isSupabaseEnabled) return null;

  return (
    <div
      role="status"
      className="bg-amber-100 border-b border-amber-300 px-4 py-2 flex items-center justify-center gap-2 text-xs font-bold text-amber-900"
    >
      <WifiOff size={14} />
      You&apos;re offline — progress saves locally and syncs when you&apos;re back online.
    </div>
  );
}
