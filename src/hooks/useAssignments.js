import { useEffect, useState } from "react";
import { listAssignments } from "../lib/cloud/classrooms";
import { useAuthStore } from "../store/useAuthStore";
import { isSupabaseEnabled } from "../lib/supabaseClient";

export function useAssignments() {
  const userId = useAuthStore((s) => s.user?.id);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(false);

  const refresh = async () => {
    if (!isSupabaseEnabled || !userId) {
      setAssignments([]);
      return;
    }
    setLoading(true);
    const rows = await listAssignments(userId);
    setAssignments(rows.filter((a) => !a.done));
    setLoading(false);
  };

  useEffect(() => {
    refresh();
  }, [userId]);

  return { assignments, loading, refresh };
}
