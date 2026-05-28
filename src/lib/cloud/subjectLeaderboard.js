import { isSupabaseEnabled, supabase } from "../supabaseClient";

export async function fetchSubjectMasteryLeaderboard(subjectId, { ageGroup, limit = 10 } = {}) {
  if (!isSupabaseEnabled) return { rows: [], cloud: false };
  let query = supabase
    .from("subject_mastery_leaderboard")
    .select("user_id,kid_name,age_group,subject_id,mastery_pct,mastered_count,lesson_count")
    .eq("subject_id", subjectId)
    .order("mastery_pct", { ascending: false })
    .limit(limit);
  if (ageGroup) query = query.eq("age_group", ageGroup);
  const { data, error } = await query;
  if (error) return { rows: [], cloud: true, error: error.message };
  return {
    cloud: true,
    rows: (data ?? []).map((r) => ({
      userId: r.user_id,
      name: r.kid_name,
      ageGroup: r.age_group,
      mastery: r.mastery_pct,
      masteredCount: r.mastered_count,
    })),
  };
}
