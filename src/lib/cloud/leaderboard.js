import { isSupabaseEnabled, supabase } from "../supabaseClient";

export async function submitSpeedRunToCloud({
  kidName,
  ageGroup,
  classroom = "A",
  score,
  totalTimeMs,
  accuracyPct,
}) {
  if (!isSupabaseEnabled || !supabase) return { ok: false, reason: "supabase-disabled" };
  const payload = {
    kid_name: kidName || "Hero",
    age_group: ageGroup || "adventurer",
    classroom,
    score,
    total_time_ms: totalTimeMs,
    accuracy_pct: accuracyPct,
  };
  const { error } = await supabase.from("speed_run_results").insert(payload);
  if (error) return { ok: false, reason: error.message };
  return { ok: true };
}

export async function fetchSpeedRunLeaderboard(scope, { ageGroup, classroom = "A", limit = 20 } = {}) {
  if (!isSupabaseEnabled || !supabase) return { rows: [], cloud: false };
  let query = supabase
    .from("speed_run_leaderboard")
    .select("kid_name,age_group,classroom,score,total_time_ms,best_at")
    .order("score", { ascending: false })
    .order("total_time_ms", { ascending: true })
    .limit(limit);

  if (scope === "age" && ageGroup) {
    query = query.eq("age_group", ageGroup);
  } else if (scope === "class") {
    query = query.eq("classroom", classroom);
  }

  const { data, error } = await query;
  if (error) return { rows: [], cloud: true, error: error.message };

  return {
    rows: (data ?? []).map((r) => ({
      name: r.kid_name,
      ageGroup: r.age_group,
      classroom: r.classroom,
      score: r.score,
      totalTimeMs: r.total_time_ms,
      bestAt: r.best_at,
    })),
    cloud: true,
  };
}
