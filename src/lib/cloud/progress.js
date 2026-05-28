import { isSupabaseEnabled, supabase } from "../supabaseClient";

let currentUserId = null;
let syncEnabled = false;
const pendingMul = new Map();
const pendingFact = new Map();
const pendingLesson = new Map();
let flushTimer = null;

export function setCloudUser(userId) {
  currentUserId = userId ?? null;
  syncEnabled = Boolean(currentUserId && isSupabaseEnabled);
}

export function isCloudSyncEnabled() {
  return syncEnabled;
}

function scheduleFlush() {
  if (!syncEnabled) return;
  if (flushTimer) return;
  flushTimer = setTimeout(() => {
    flushTimer = null;
    flushPending().catch(() => {});
  }, 700);
}

export async function flushPending() {
  if (!syncEnabled || !supabase || !currentUserId) return;

  if (pendingMul.size) {
    const rows = [...pendingMul.values()];
    pendingMul.clear();
    await supabase.from("mul_table_progress").upsert(rows, { onConflict: "user_id,table_number" });
  }
  if (pendingFact.size) {
    const rows = [...pendingFact.values()];
    pendingFact.clear();
    await supabase.from("mul_fact_progress").upsert(rows, { onConflict: "user_id,fact_id" });
  }
  if (pendingLesson.size) {
    const rows = [...pendingLesson.values()];
    pendingLesson.clear();
    await supabase.from("lesson_progress").upsert(rows, { onConflict: "user_id,lesson_id" });
  }
}

export function queueMulTableUpsert(tableNumber, t) {
  if (!syncEnabled || !currentUserId) return;
  pendingMul.set(tableNumber, {
    user_id: currentUserId,
    table_number: tableNumber,
    unlocked: !!t.unlocked,
    current_phase: t.currentPhase ?? 1,
    learn_complete: !!t.learnComplete,
    boss_passed: !!t.bossPassed,
    boss_best: t.bossBest ?? 0,
    sr_passes: t.srPasses ?? 0,
    legend_at: t.legendAt ?? null,
    best_drill_avg_ms: t.bestDrillAvgMs ?? null,
  });
  scheduleFlush();
}

export function queueMulFactUpsert(factId, f) {
  if (!syncEnabled || !currentUserId) return;
  pendingFact.set(factId, {
    user_id: currentUserId,
    fact_id: factId,
    practice_hits: f.practiceHits ?? 0,
    drill_fast_hits: f.drillFastHits ?? 0,
    ease_factor: Number((f.easeFactor ?? 2.5).toFixed(2)),
    interval_days: f.interval ?? 1,
    repetitions: f.repetitions ?? 0,
    next_review_date: f.nextReviewDate ?? null,
    attempt_count: f.attemptCount ?? 0,
    correct_count: f.correctCount ?? 0,
    avg_response_ms: f.avgResponseMs ?? 0,
    fastest_response_ms: f.fastestResponseMs ?? null,
  });
  scheduleFlush();
}

export function queueLessonUpsert(lessonId, subjectId, p) {
  if (!syncEnabled || !currentUserId) return;
  pendingLesson.set(lessonId, {
    user_id: currentUserId,
    lesson_id: lessonId,
    subject_id: subjectId,
    stars: p.stars ?? 0,
    mastered: !!p.mastered,
    attempts: p.attempts ?? 0,
    last_score: p.lastScore ?? 0,
    last_total: p.lastTotal ?? 0,
    last_played: p.lastPlayed ?? null,
  });
  scheduleFlush();
}

export async function upsertUserStats(stats) {
  if (!syncEnabled || !supabase || !currentUserId) return;
  await supabase.from("user_stats").upsert({
    user_id: currentUserId,
    total_xp: stats.totalXP ?? 0,
    total_points: stats.totalPoints ?? 0,
    level: stats.level ?? 1,
    current_streak: stats.currentStreak ?? 0,
    longest_streak: stats.longestStreak ?? 0,
    last_play_date: stats.lastPlayDate ?? null,
    lessons_today_date: stats.lessonsToday?.date ?? null,
    lessons_today_count: stats.lessonsToday?.count ?? 0,
    badges: stats.badges ?? [],
  }, { onConflict: "user_id" });
}

export async function fetchUserStats() {
  if (!isSupabaseEnabled || !supabase || !currentUserId) return null;
  const { data, error } = await supabase
    .from("user_stats")
    .select("*")
    .eq("user_id", currentUserId)
    .maybeSingle();
  if (error || !data) return null;
  return {
    totalXP: data.total_xp ?? 0,
    totalPoints: data.total_points ?? 0,
    level: data.level ?? 1,
    currentStreak: data.current_streak ?? 0,
    longestStreak: data.longest_streak ?? 0,
    lastPlayDate: data.last_play_date,
    lessonsToday: {
      date: data.lessons_today_date,
      count: data.lessons_today_count ?? 0,
    },
    badges: data.badges ?? [],
  };
}

export async function fetchLessonProgress() {
  if (!isSupabaseEnabled || !supabase || !currentUserId) return null;
  const { data, error } = await supabase
    .from("lesson_progress")
    .select("*")
    .eq("user_id", currentUserId);
  if (error || !data) return null;
  const out = {};
  for (const r of data) {
    out[r.lesson_id] = {
      stars: r.stars,
      mastered: r.mastered,
      attempts: r.attempts,
      lastScore: r.last_score,
      lastTotal: r.last_total,
      lastPlayed: r.last_played,
    };
  }
  return out;
}

export async function fetchMulTableProgress() {
  if (!isSupabaseEnabled || !supabase || !currentUserId) return null;
  const { data, error } = await supabase
    .from("mul_table_progress")
    .select("*")
    .eq("user_id", currentUserId);
  if (error || !data) return null;
  const out = {};
  for (const r of data) {
    out[r.table_number] = {
      unlocked: r.unlocked,
      currentPhase: r.current_phase,
      learnComplete: r.learn_complete,
      bossPassed: r.boss_passed,
      bossBest: r.boss_best,
      srPasses: r.sr_passes,
      legendAt: r.legend_at,
      bestDrillAvgMs: r.best_drill_avg_ms,
    };
  }
  return out;
}

export async function fetchMulFactProgress() {
  if (!isSupabaseEnabled || !supabase || !currentUserId) return null;
  const { data, error } = await supabase
    .from("mul_fact_progress")
    .select("*")
    .eq("user_id", currentUserId);
  if (error || !data) return null;
  const out = {};
  for (const r of data) {
    out[r.fact_id] = {
      practiceHits: r.practice_hits,
      drillFastHits: r.drill_fast_hits,
      easeFactor: Number(r.ease_factor),
      interval: r.interval_days,
      repetitions: r.repetitions,
      nextReviewDate: r.next_review_date,
      attemptCount: r.attempt_count,
      correctCount: r.correct_count,
      avgResponseMs: r.avg_response_ms,
      fastestResponseMs: r.fastest_response_ms,
    };
  }
  return out;
}
