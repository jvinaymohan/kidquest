import { isSupabaseEnabled, supabase } from "../supabaseClient";

function randomCode() {
  const letters = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let s = "";
  for (let i = 0; i < 6; i++) {
    s += letters[Math.floor(Math.random() * letters.length)];
  }
  return s;
}

export async function createClassroom({ ownerId, name, gradeBand }) {
  if (!isSupabaseEnabled || !ownerId) return { ok: false, reason: "supabase-disabled" };
  const code = randomCode();
  const { data, error } = await supabase
    .from("classrooms")
    .insert({ owner_id: ownerId, name, grade_band: gradeBand ?? null, code })
    .select()
    .single();
  if (error) return { ok: false, reason: error.message };
  await supabase
    .from("classroom_members")
    .insert({ classroom_id: data.id, user_id: ownerId, member_role: "teacher" });
  return { ok: true, classroom: data };
}

export async function joinClassroom({ userId, code, role = "kid" }) {
  if (!isSupabaseEnabled || !userId || !code) return { ok: false, reason: "missing" };
  const { data: cls, error: lookupErr } = await supabase
    .from("classrooms")
    .select("*")
    .eq("code", code.trim().toUpperCase())
    .maybeSingle();
  if (lookupErr) return { ok: false, reason: lookupErr.message };
  if (!cls) return { ok: false, reason: "Classroom not found" };

  const { error } = await supabase
    .from("classroom_members")
    .upsert({ classroom_id: cls.id, user_id: userId, member_role: role });
  if (error) return { ok: false, reason: error.message };

  await supabase.from("profiles").update({ classroom_code: cls.code }).eq("id", userId);

  return { ok: true, classroom: cls };
}

export async function listMyClassrooms(userId) {
  if (!isSupabaseEnabled || !userId) return [];
  const { data, error } = await supabase
    .from("classroom_members")
    .select("classroom_id, member_role, classrooms(id, code, name, grade_band, owner_id, created_at)")
    .eq("user_id", userId);
  if (error || !data) return [];
  return data
    .map((m) => ({ role: m.member_role, ...(m.classrooms ?? {}) }))
    .filter((c) => c.id);
}

export async function listAssignments(userId) {
  if (!isSupabaseEnabled || !userId) return [];
  const { data, error } = await supabase
    .from("assignments")
    .select("*, assignment_completions(user_id, done, done_at)")
    .order("due_date", { ascending: true });
  if (error || !data) return [];
  return data.map((a) => {
    const mine = (a.assignment_completions ?? []).find((c) => c.user_id === userId);
    return {
      id: a.id,
      classroomId: a.classroom_id,
      ownerId: a.owner_id,
      title: a.title,
      subjectId: a.subject_id,
      dueDate: a.due_date,
      notes: a.notes,
      createdAt: a.created_at,
      done: mine?.done ?? false,
      doneAt: mine?.done_at ?? null,
    };
  });
}

export async function createAssignment({ ownerId, classroomId, title, subjectId = "math", dueDate, notes }) {
  if (!isSupabaseEnabled || !ownerId) return { ok: false, reason: "supabase-disabled" };
  const { data, error } = await supabase
    .from("assignments")
    .insert({ owner_id: ownerId, classroom_id: classroomId ?? null, title, subject_id: subjectId, due_date: dueDate, notes })
    .select()
    .single();
  if (error) return { ok: false, reason: error.message };
  return { ok: true, assignment: data };
}

export async function toggleAssignmentDone({ userId, assignmentId, done }) {
  if (!isSupabaseEnabled || !userId) return { ok: false };
  const { error } = await supabase
    .from("assignment_completions")
    .upsert({ assignment_id: assignmentId, user_id: userId, done, done_at: done ? new Date().toISOString() : null });
  if (error) return { ok: false, reason: error.message };
  return { ok: true };
}

export async function removeAssignment({ assignmentId }) {
  if (!isSupabaseEnabled) return { ok: false };
  const { error } = await supabase.from("assignments").delete().eq("id", assignmentId);
  if (error) return { ok: false, reason: error.message };
  return { ok: true };
}

export async function listParentDigests(userId) {
  if (!isSupabaseEnabled || !userId) return [];
  const { data, error } = await supabase
    .from("parent_digests")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(20);
  if (error || !data) return [];
  return data.map((d) => ({ id: d.id, at: d.created_at, message: d.message }));
}

export async function logParentDigestCloud({ userId, parentId, message }) {
  if (!isSupabaseEnabled || !userId || !message) return { ok: false };
  const { error } = await supabase
    .from("parent_digests")
    .insert({ user_id: userId, parent_id: parentId ?? userId, message });
  if (error) return { ok: false, reason: error.message };
  return { ok: true };
}
