import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Volume2,
  VolumeX,
  Music,
  Music2,
  Lock,
  ShieldCheck,
  Heart,
  BookOpen,
  Download,
  ClipboardList,
  Users,
  Plus,
} from "lucide-react";
import { useAppStore } from "../store/useAppStore";
import { useAuthStore } from "../store/useAuthStore";
import { useMultiplicationStore } from "../store/useMultiplicationStore";
import { Button } from "../components/ui/Button";
import { SUBJECTS, AGE_GROUPS } from "../data/subjects";
import { isSupabaseEnabled } from "../lib/supabaseClient";
import {
  createAssignment,
  createClassroom,
  joinClassroom,
  listAssignments,
  listMyClassrooms,
  listParentDigests,
  logParentDigestCloud,
  removeAssignment,
  toggleAssignmentDone,
} from "../lib/cloud/classrooms";
import { usePreferencesStore } from "../store/usePreferencesStore";
import { downloadExportJson } from "../lib/exportData";
import { LOCALES, setLocale } from "../lib/i18n";
import { useGeographyStore } from "../store/useGeographyStore";
import { DEFAULT_PARENT_PIN, isDefaultParentPin } from "../constants/parentPin";

export default function Settings() {
  const {
    parentPin, soundEnabled, musicEnabled, dailyGoal, timerMode,
    ageGroup, setAgeGroup, setSound, setMusic, setDailyGoal, setTimerMode,
    timePerSubject, resetProgress, setParentPin, lessonsToday, lessonProgress,
    teacherAssignments, addTeacherAssignment, toggleTeacherAssignment, removeTeacherAssignment,
    classTarget, setClassTarget, parentDigestLog, logParentDigest, kidName, role,
  } = useAppStore();

  const user = useAuthStore((s) => s.user);
  const updateProfile = useAuthStore((s) => s.updateProfile);

  const [unlocked, setUnlocked] = useState(false);
  const [mustChangePin, setMustChangePin] = useState(false);
  const [pinInput, setPinInput] = useState("");
  const [showPinSet, setShowPinSet] = useState(false);
  const [newPin, setNewPin] = useState("");
  const [assignmentTitle, setAssignmentTitle] = useState("");
  const [assignmentDue, setAssignmentDue] = useState("");
  const [assignmentSubject, setAssignmentSubject] = useState("math");
  const multiplicationTables = useMultiplicationStore((s) => s.tables);
  const locale = usePreferencesStore((s) => s.locale);
  const setLocalePref = usePreferencesStore((s) => s.setLocale);
  const dyslexiaFont = usePreferencesStore((s) => s.dyslexiaFont);
  const setDyslexiaFont = usePreferencesStore((s) => s.setDyslexiaFont);
  const lowBandwidth = usePreferencesStore((s) => s.lowBandwidth);
  const setLowBandwidth = usePreferencesStore((s) => s.setLowBandwidth);
  const screenTimeLimitMinutes = usePreferencesStore((s) => s.screenTimeLimitMinutes);
  const setScreenTimeLimit = usePreferencesStore((s) => s.setScreenTimeLimit);
  const teslaMode = usePreferencesStore((s) => s.teslaMode);
  const setTeslaMode = usePreferencesStore((s) => s.setTeslaMode);
  const geoCountries = useGeographyStore((s) => s.countries);

  const [classrooms, setClassrooms] = useState([]);
  const [cloudAssignments, setCloudAssignments] = useState([]);
  const [cloudDigests, setCloudDigests] = useState([]);
  const [newClassName, setNewClassName] = useState("");
  const [joinCode, setJoinCode] = useState("");
  const [cloudBusy, setCloudBusy] = useState(false);
  const [cloudErr, setCloudErr] = useState(null);

  async function refreshCloud() {
    if (!user?.id) return;
    const [cs, asns, ds] = await Promise.all([
      listMyClassrooms(user.id),
      listAssignments(user.id),
      listParentDigests(user.id),
    ]);
    setClassrooms(cs);
    setCloudAssignments(asns);
    setCloudDigests(ds);
  }

  useEffect(() => {
    if (unlocked && user?.id) {
      refreshCloud().catch(() => {});
    }
  }, [unlocked, user?.id]);

  const cloudOk = isSupabaseEnabled && Boolean(user?.id);

  function tryUnlock() {
    if (pinInput !== parentPin) return;
    if (isDefaultParentPin(parentPin)) {
      setMustChangePin(true);
      setUnlocked(true);
      setShowPinSet(true);
      setNewPin("");
    } else {
      setUnlocked(true);
    }
  }

  function saveNewPin() {
    if (newPin.length < 4 || isDefaultParentPin(newPin)) return;
    setParentPin(newPin);
    if (cloudOk) updateProfile({ parent_pin: newPin }).catch(() => {});
    setMustChangePin(false);
    setShowPinSet(false);
    setNewPin("");
  }

  if (!unlocked) {
    return (
      <div className="flex flex-col items-center gap-5 mt-6">
        <motion.div initial={{ scale: 0.7, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="w-20 h-20 bg-accent rounded-full grid place-items-center border-[4px] border-ink/20 shadow-chunkyLg">
          <Lock size={36} />
        </motion.div>
        <h1 className="font-display text-3xl font-extrabold">
          {role === "teacher" ? "Teacher Zone" : "Parent Zone"}
        </h1>
        <p className="text-center font-body font-bold text-ink/70 max-w-sm">
          Enter the PIN to view progress, manage classrooms, and create assignments.
        </p>
        <input
          value={pinInput}
          onChange={(e) => setPinInput(e.target.value.replace(/\D/g, "").slice(0, 6))}
          inputMode="numeric"
          autoFocus
          placeholder="••••"
          className="w-40 text-center px-4 py-3 text-3xl tracking-[0.4em] font-display font-extrabold rounded-chunky border-[3px] border-ink/15 shadow-chunky focus-ring"
        />
        <Button type="button" onClick={tryUnlock} size="lg" disabled={pinInput.length < 4}>
          Unlock
        </Button>
        {pinInput && pinInput !== parentPin && pinInput.length >= 4 && (
          <p className="text-error font-bold text-sm">Wrong PIN. Ask your parent or guardian.</p>
        )}

        <div className="mt-4 grid grid-cols-2 gap-2 w-full max-w-sm">
          <Link to="/about" className="block">
            <Button variant="ghost" fullWidth leftIcon={<BookOpen size={18} />}>Our Story</Button>
          </Link>
          <Link to="/impact" className="block">
            <Button variant="ghost" fullWidth leftIcon={<Heart size={18} />}>Mission</Button>
          </Link>
        </div>
        <p className="text-xs text-ink/50 font-bold mt-4">Designed by Vinay. Built with Cursor.</p>
      </div>
    );
  }

  const totalSeconds = Object.values(timePerSubject).reduce((a, b) => a + b, 0);

  async function onCreateClassroom() {
    if (!cloudOk || !newClassName.trim()) return;
    setCloudBusy(true); setCloudErr(null);
    const res = await createClassroom({ ownerId: user.id, name: newClassName.trim(), gradeBand: ageGroup });
    setCloudBusy(false);
    if (!res.ok) { setCloudErr(res.reason); return; }
    setNewClassName("");
    refreshCloud();
  }

  async function onJoinClassroom() {
    if (!cloudOk || !joinCode.trim()) return;
    setCloudBusy(true); setCloudErr(null);
    const res = await joinClassroom({ userId: user.id, code: joinCode.trim(), role: role || "kid" });
    setCloudBusy(false);
    if (!res.ok) { setCloudErr(res.reason); return; }
    setJoinCode("");
    refreshCloud();
  }

  async function onAddAssignment() {
    if (!assignmentTitle || !assignmentDue) return;
    if (cloudOk) {
      const classroomId = classrooms.find((c) => c.role === "teacher")?.id ?? null;
      const res = await createAssignment({
        ownerId: user.id,
        classroomId,
        title: assignmentTitle,
        subjectId: assignmentSubject,
        dueDate: assignmentDue,
      });
      if (res.ok) {
        setAssignmentTitle("");
        setAssignmentDue("");
        refreshCloud();
        return;
      }
      setCloudErr(res.reason);
    }
    addTeacherAssignment({ title: assignmentTitle, dueDate: assignmentDue, subjectId: assignmentSubject });
    setAssignmentTitle("");
    setAssignmentDue("");
  }

  async function onToggleAssignment(a) {
    if (cloudOk && a.id) {
      await toggleAssignmentDone({ userId: user.id, assignmentId: a.id, done: !a.done });
      refreshCloud();
    } else {
      toggleTeacherAssignment(a.id);
    }
  }

  async function onRemoveAssignment(a) {
    if (cloudOk && a.ownerId === user.id) {
      await removeAssignment({ assignmentId: a.id });
      refreshCloud();
    } else {
      removeTeacherAssignment(a.id);
    }
  }

  async function onGenerateDigest() {
    const msg = `Today ${kidName || "your child"} completed ${todayLessons(lessonsToday)} lessons and has a ${dailyGoal}-lesson daily goal.`;
    if (cloudOk) {
      const res = await logParentDigestCloud({ userId: user.id, parentId: user.id, message: msg });
      if (res.ok) {
        refreshCloud();
        return;
      }
    }
    logParentDigest(msg);
  }

  const assignmentsToShow = cloudOk ? cloudAssignments : teacherAssignments;
  const digestsToShow = cloudOk ? cloudDigests : parentDigestLog;

  if (mustChangePin) {
    return (
      <div className="flex flex-col gap-5 mt-4 max-w-md mx-auto">
        <header className="chunky-card p-4 border-[3px] border-amber-300 bg-amber-50">
          <h1 className="font-display text-xl font-extrabold text-amber-900">Choose a new Parent PIN</h1>
          <p className="text-sm font-bold text-amber-900/80 mt-1">
            The default PIN ({DEFAULT_PARENT_PIN}) is not safe. Pick a new 4–6 digit PIN only your family
            knows.
          </p>
        </header>
        <div className="chunky-card p-4 flex flex-col gap-3">
          <input
            value={newPin}
            onChange={(e) => setNewPin(e.target.value.replace(/\D/g, "").slice(0, 6))}
            inputMode="numeric"
            autoFocus
            placeholder="New PIN"
            className="w-full text-center px-4 py-3 text-2xl tracking-[0.3em] font-display font-extrabold rounded-chunky border-[3px] border-ink/15 focus-ring"
          />
          {isDefaultParentPin(newPin) && newPin.length >= 4 && (
            <p className="text-error text-sm font-bold">Choose a different PIN than {DEFAULT_PARENT_PIN}.</p>
          )}
          <Button onClick={saveNewPin} disabled={newPin.length < 4 || isDefaultParentPin(newPin)} fullWidth>
            Save new PIN
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      <header className="flex items-center gap-2">
        <ShieldCheck className="text-success" />
        <h1 className="font-display text-3xl font-extrabold">
          {role === "teacher" ? "Teacher Dashboard" : "Parent Dashboard"}
        </h1>
      </header>

      {cloudOk ? (
        <section className="chunky-card p-4 border-[3px] border-success/30">
          <div className="flex items-center gap-2 mb-2">
            <Users size={18} />
            <h2 className="font-display font-extrabold text-lg">Classrooms</h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-2 mb-3">
            <div className="flex gap-2">
              <input
                value={newClassName}
                onChange={(e) => setNewClassName(e.target.value)}
                placeholder="Create classroom name"
                className="flex-1 px-3 py-2 rounded-chunky border-[3px] border-ink/15 font-bold focus-ring"
              />
              <Button onClick={onCreateClassroom} disabled={cloudBusy} leftIcon={<Plus size={16} />}>Create</Button>
            </div>
            <div className="flex gap-2">
              <input
                value={joinCode}
                onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                placeholder="Join with code"
                className="flex-1 px-3 py-2 rounded-chunky border-[3px] border-ink/15 font-display font-extrabold tracking-widest focus-ring"
              />
              <Button variant="secondary" onClick={onJoinClassroom} disabled={cloudBusy}>Join</Button>
            </div>
          </div>
          {cloudErr && <p className="text-xs font-bold text-error mb-2">{cloudErr}</p>}
          {classrooms.length === 0 ? (
            <p className="text-xs font-bold text-ink/60">No classrooms yet. Create one as a teacher or join with a code.</p>
          ) : (
            <ul className="space-y-2">
              {classrooms.map((c) => (
                <li key={c.id} className="rounded-chunky border-[2px] border-ink/10 px-3 py-2 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-display font-extrabold">{c.name}</p>
                    <p className="text-xs text-ink/55">Code: <span className="font-display font-extrabold tracking-widest">{c.code}</span> · {c.role}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      ) : (
        <section className="chunky-card p-4 border border-ink/15">
          <p className="text-xs font-bold text-ink/60">
            Sign in to enable cloud classrooms & assignment sync across devices.
          </p>
        </section>
      )}

      <section className="chunky-card p-4">
        <h2 className="font-display font-extrabold text-lg mb-2">Daily Goal</h2>
        <div className="flex items-center gap-3">
          {[1, 2, 3, 5].map((n) => (
            <button
              key={n}
              onClick={() => setDailyGoal(n)}
              className={`flex-1 py-3 rounded-chunky border-[3px] font-display font-extrabold shadow-chunkySm focus-ring ${
                dailyGoal === n ? "bg-accent border-ink/30" : "bg-white border-ink/15"
              }`}
            >
              {n}
            </button>
          ))}
        </div>
        <p className="text-xs font-bold text-ink/60 mt-1">Lessons per day target.</p>
      </section>

      <section className="chunky-card p-4">
        <h2 className="font-display font-extrabold text-lg mb-2">Age Group</h2>
        <div className="flex flex-col gap-2">
          {AGE_GROUPS.map((g) => (
            <button
              key={g.id}
              onClick={() => {
                setAgeGroup(g.id);
                if (cloudOk) updateProfile({ age_group: g.id }).catch(() => {});
              }}
              className={`text-left p-3 rounded-chunky border-[3px] font-bold focus-ring ${
                ageGroup === g.id ? "bg-accent border-ink/30" : "bg-white border-ink/15"
              }`}
            >
              <div className="font-display font-extrabold">
                {g.emoji} {g.label} <span className="text-ink/60">· Ages {g.ageRange}</span>
              </div>
              <div className="text-xs text-ink/70">{g.description}</div>
            </button>
          ))}
        </div>
      </section>

      <section className="chunky-card p-4 flex flex-col gap-3 border-[3px] border-primary/20">
        <h2 className="font-display font-extrabold text-lg">Global & accessibility</h2>
        <label className="text-sm font-bold">
          Language
          <select
            value={locale}
            onChange={(e) => {
              setLocalePref(e.target.value);
              setLocale(e.target.value);
            }}
            className="w-full mt-1 px-3 py-2 rounded-chunky border-2 border-ink/15 font-bold"
          >
            {LOCALES.map((l) => (
              <option key={l.id} value={l.id}>
                {l.label}
              </option>
            ))}
          </select>
        </label>
        <Toggle
          label="Dyslexia-friendly font"
          icon={<BookOpen />}
          on={dyslexiaFont}
          onChange={(v) => {
            setDyslexiaFont(v);
            document.documentElement.classList.toggle("dyslexia-font", v);
          }}
        />
        <Toggle
          label="Low-bandwidth mode"
          icon={<Download />}
          on={lowBandwidth}
          onChange={(v) => {
            setLowBandwidth(v);
            document.documentElement.classList.toggle("low-bandwidth", v);
          }}
        />
        <Toggle label="Tesla / kiosk large UI" icon={<ShieldCheck />} on={teslaMode} onChange={setTeslaMode} />
        <label className="text-sm font-bold">
          Screen time cap (minutes/day, optional)
          <input
            type="number"
            min={0}
            value={screenTimeLimitMinutes ?? ""}
            onChange={(e) => setScreenTimeLimit(e.target.value ? Number(e.target.value) : null)}
            placeholder="No limit"
            className="w-full mt-1 px-3 py-2 rounded-chunky border-2 border-ink/15 font-bold"
          />
        </label>
        <Button variant="ghost" fullWidth onClick={downloadExportJson}>
          Download my data (JSON export)
        </Button>
      </section>

      <section className="chunky-card p-4 border-[3px] border-amber-200 bg-amber-50/50">
        <h2 className="font-display font-extrabold text-lg mb-2">Weak areas</h2>
        <WeakAreasList
          lessonProgress={lessonProgress}
          multiplicationTables={multiplicationTables}
          geoCountries={geoCountries}
        />
        <p className="text-[10px] font-bold text-ink/50 mt-2">
          Weekly email digest: copy digest below and send from your mail app (automated email in Phase 5.1).
        </p>
      </section>

      <section className="chunky-card p-4 flex flex-col gap-3">
        <h2 className="font-display font-extrabold text-lg">Sound & Music</h2>
        <Toggle label="Sound effects" icon={soundEnabled ? <Volume2 /> : <VolumeX />} on={soundEnabled} onChange={setSound} />
        <Toggle label="Background music" icon={musicEnabled ? <Music2 /> : <Music />} on={musicEnabled} onChange={setMusic} />
        <Toggle label="Champion timer mode" icon={<ShieldCheck />} on={timerMode} onChange={setTimerMode} />
      </section>

      <section className="chunky-card p-4">
        <h2 className="font-display font-extrabold text-lg mb-2">Time per Subject</h2>
        <ul className="flex flex-col gap-2">
          {SUBJECTS.map((s) => {
            const secs = timePerSubject[s.id] ?? 0;
            const pct = totalSeconds === 0 ? 0 : secs / totalSeconds;
            return (
              <li key={s.id}>
                <div className="flex justify-between text-sm font-bold">
                  <span>{s.name}</span>
                  <span>{formatMinutes(secs)}</span>
                </div>
                <div className="h-2 bg-ink/10 rounded-full overflow-hidden mt-1">
                  <motion.div className="h-full" style={{ background: s.color }} initial={{ width: 0 }} animate={{ width: `${pct * 100}%` }} />
                </div>
              </li>
            );
          })}
        </ul>
        {totalSeconds === 0 && (
          <p className="text-xs font-bold text-ink/60 mt-3 text-center">No lessons played yet today.</p>
        )}
      </section>

      <section className="chunky-card p-4 border-[3px] border-math/25">
        <h2 className="font-display font-extrabold text-lg mb-2">Assignments</h2>
        <p className="text-[11px] font-bold text-ink/55 mb-2">
          {cloudOk ? "Synced via Supabase — visible to kids in this account or classroom." : "Local-only until you sign in."}
        </p>
        <div className="flex flex-wrap gap-2 mb-2">
          {[
            { title: "Geography: Locate 8 countries", subject: "geography" },
            { title: "Solar System: Learn 5 planet facts", subject: "solar-system" },
            { title: "Math: Table 7 to Boss Battle", subject: "math" },
          ].map((tpl) => (
            <button
              key={tpl.title}
              type="button"
              onClick={() => { setAssignmentTitle(tpl.title); setAssignmentSubject(tpl.subject); }}
              className="text-xs font-bold px-2 py-1 rounded-pill border-2 border-ink/15 bg-white"
            >
              + {tpl.title.split(":")[0]} template
            </button>
          ))}
        </div>
        <input
          value={classTarget}
          onChange={(e) => setClassTarget(e.target.value)}
          placeholder="Class target (e.g. Tables 1-10 to Phase 3 by Friday)"
          className="w-full px-3 py-2 rounded-chunky border-[3px] border-ink/15 font-bold focus-ring mb-2"
        />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          <input
            value={assignmentTitle}
            onChange={(e) => setAssignmentTitle(e.target.value)}
            placeholder="Assignment title"
            className="px-3 py-2 rounded-chunky border-[3px] border-ink/15 font-bold focus-ring"
          />
          <select
            value={assignmentSubject}
            onChange={(e) => setAssignmentSubject(e.target.value)}
            className="px-3 py-2 rounded-chunky border-[3px] border-ink/15 font-bold focus-ring"
          >
            <option value="math">Math</option>
            <option value="geography">Geography</option>
            <option value="solar-system">Solar System</option>
          </select>
          <input
            type="date"
            value={assignmentDue}
            onChange={(e) => setAssignmentDue(e.target.value)}
            className="px-3 py-2 rounded-chunky border-[3px] border-ink/15 font-bold focus-ring"
          />
        </div>
        <Button className="mt-2 w-full" onClick={onAddAssignment}>Add Assignment</Button>
        <ul className="mt-3 space-y-2">
          {assignmentsToShow.map((a) => (
            <li key={a.id} className="rounded-chunky border-[2px] border-ink/10 p-2 flex items-center gap-2">
              <button type="button" onClick={() => onToggleAssignment(a)} className="text-lg">
                {a.done ? "✅" : "⬜"}
              </button>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold truncate">{a.title}</p>
                <p className="text-xs text-ink/60">{a.subjectId || "math"} · due {a.dueDate}</p>
              </div>
              <button type="button" onClick={() => onRemoveAssignment(a)} className="text-xs font-bold text-error">
                remove
              </button>
            </li>
          ))}
          {assignmentsToShow.length === 0 && (
            <p className="text-xs font-bold text-ink/60">No assignments yet.</p>
          )}
        </ul>
      </section>

      <section className="chunky-card p-4 border-[3px] border-geography/25">
        <h2 className="font-display font-extrabold text-lg mb-2">Digests & Exports</h2>
        <Button variant="ghost" fullWidth leftIcon={<ClipboardList size={16} />} onClick={onGenerateDigest}>
          Generate Daily Digest
        </Button>
        <Button
          className="mt-2 w-full"
          leftIcon={<Download size={16} />}
          onClick={() => exportProgressCsv({ teacherAssignments: assignmentsToShow, lessonProgress, multiplicationTables })}
        >
          Export Progress CSV
        </Button>
        <ul className="mt-3 space-y-2">
          {digestsToShow.slice(0, 5).map((d) => (
            <li key={d.id} className="text-xs font-bold text-ink/70 rounded-chunky bg-bg px-2 py-2 border border-ink/10">
              {new Date(d.at).toLocaleDateString()} - {d.message}
            </li>
          ))}
          {digestsToShow.length === 0 && (
            <p className="text-xs font-bold text-ink/60">No digest generated yet.</p>
          )}
        </ul>
      </section>

      <section className="chunky-card p-4">
        <h2 className="font-display font-extrabold text-lg mb-2">Parent PIN</h2>
        {!showPinSet ? (
          <Button variant="ghost" onClick={() => setShowPinSet(true)}>Change PIN</Button>
        ) : (
          <div className="flex gap-2 items-center">
            <input
              value={newPin}
              onChange={(e) => setNewPin(e.target.value.replace(/\D/g, "").slice(0, 6))}
              inputMode="numeric"
              placeholder="New PIN"
              className="flex-1 px-3 py-2 rounded-chunky border-[3px] border-ink/15 font-display font-extrabold focus-ring"
            />
            <Button onClick={saveNewPin} disabled={newPin.length < 4 || isDefaultParentPin(newPin)}>
              Save
            </Button>
          </div>
        )}
      </section>

      <MultiplicationParentSection />

      <section className="chunky-card p-4 border-geography/25 bg-geography/5">
        <h2 className="font-display font-extrabold text-lg mb-2">Geography data update</h2>
        <p className="text-xs font-bold text-ink/65 leading-relaxed">
          Geography lessons now use IDs like <code className="text-geography">geo-flags-adventurer</code>{" "}
          (5 tracks × age group). If stars look missing after an app update, use Reset Progress below or
          replay tracks from the geography hub.
        </p>
        <p className="text-xs font-bold text-ink/50 mt-2">
          Countries in SRS deck: {Object.keys(geoCountries).length}
        </p>
      </section>

      <section className="chunky-card p-4 border-error/40">
        <h2 className="font-display font-extrabold text-lg mb-2 text-error">Danger Zone</h2>
        <p className="text-xs font-bold text-ink/60 mb-2">Reset learning progress (keeps profile).</p>
        <Button variant="error" onClick={() => {
          if (confirm("Reset all learning progress? This cannot be undone.")) resetProgress();
        }}>
          Reset Progress
        </Button>
      </section>

      <section className="grid grid-cols-2 gap-3">
        <Link to="/about" className="block">
          <Button variant="ghost" fullWidth leftIcon={<BookOpen size={18} />}>Our Story</Button>
        </Link>
        <Link to="/impact" className="block">
          <Button variant="ghost" fullWidth leftIcon={<Heart size={18} />}>Mission</Button>
        </Link>
      </section>

      <footer className="text-center text-xs font-bold text-ink/50 py-2">
        Designed by Vinay. Built with Cursor.
      </footer>
    </div>
  );
}

function MultiplicationParentSection() {
  const unlockAll = useMultiplicationStore((s) => s.unlockAllTables);
  const setUnlockAll = useMultiplicationStore((s) => s.setUnlockAll);
  const resetMul = useMultiplicationStore((s) => s.resetProgress);
  const legendary = useMultiplicationStore((s) => s.getLegendaryCount());
  const rank = useMultiplicationStore((s) => s.getRank());

  return (
    <section className="chunky-card p-4 border-mul-electric/30">
      <h2 className="font-display font-extrabold text-lg mb-2">Multiplication Camp</h2>
      <p className="text-xs font-bold text-ink/60 mb-2">
        Rank: {rank.emoji} {rank.title} · {legendary}/20 legendary tables
      </p>
      <Toggle label="Unlock all tables (1–20)" icon={<ShieldCheck />} on={unlockAll} onChange={setUnlockAll} />
      <Button
        variant="ghost"
        className="mt-2 w-full"
        onClick={() => {
          if (confirm("Reset multiplication camp progress only?")) resetMul();
        }}
      >
        Reset multiplication progress
      </Button>
    </section>
  );
}

function Toggle({ label, icon, on, onChange }) {
  return (
    <div className="flex items-center gap-3">
      <div className="text-ink/70">{icon}</div>
      <div className="flex-1 font-bold">{label}</div>
      <button
        onClick={() => onChange(!on)}
        className={`w-14 h-8 rounded-pill border-[3px] border-ink/20 shadow-chunkySm relative focus-ring transition ${on ? "bg-success" : "bg-ink/10"}`}
      >
        <motion.span
          className="absolute top-0.5 w-6 h-6 rounded-full bg-white shadow"
          animate={{ left: on ? 26 : 2 }}
          transition={{ type: "spring", stiffness: 320, damping: 22 }}
        />
      </button>
    </div>
  );
}

function WeakAreasList({ lessonProgress, multiplicationTables, geoCountries }) {
  const weakLessons = Object.entries(lessonProgress ?? {})
    .filter(([, p]) => p.attempts > 0 && !p.mastered)
    .slice(0, 4)
    .map(([id]) => id);
  const weakTables = Object.entries(multiplicationTables ?? {})
    .filter(([, t]) => t.currentPhase < 3)
    .slice(0, 4)
    .map(([n]) => `${n}× table`);
  const weakGeo = Object.entries(geoCountries ?? {})
    .filter(([, c]) => !c.mastered && c.practiceHits > 0)
    .slice(0, 4)
    .map(([code]) => code);

  const items = [...weakTables, ...weakGeo, ...weakLessons];
  if (!items.length) {
    return <p className="text-sm font-bold text-ink/60">Looking strong — no weak spots flagged yet.</p>;
  }
  return (
    <ul className="text-sm font-bold space-y-1">
      {items.map((x) => (
        <li key={x}>· {x}</li>
      ))}
    </ul>
  );
}

function formatMinutes(secs) {
  const m = Math.round(secs / 60);
  if (m < 1) return `${secs}s`;
  if (m < 60) return `${m}m`;
  const h = Math.floor(m / 60);
  return `${h}h ${m % 60}m`;
}

function exportProgressCsv({ teacherAssignments, lessonProgress, multiplicationTables }) {
  const rows = [
    ["type", "id", "status", "due_date", "stars", "mastered"],
    ...teacherAssignments.map((a) => ["assignment", a.title, a.done ? "done" : "open", a.dueDate, "", ""]),
    ...Object.entries(lessonProgress).map(([id, p]) => [
      "lesson",
      id,
      p.mastered ? "mastered" : "in_progress",
      "",
      p.stars ?? 0,
      p.mastered ? "yes" : "no",
    ]),
    ...Object.entries(multiplicationTables ?? {}).map(([n, t]) => [
      "multiplication_table",
      `${n}x`,
      t.legendAt ? "legend" : `phase_${t.currentPhase}`,
      "",
      t.bossBest ?? 0,
      t.legendAt ? "yes" : "no",
    ]),
  ];
  const csv = rows.map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "kidquest-progress-report.csv";
  a.click();
  URL.revokeObjectURL(url);
}

function todayLessons(lessonsToday) {
  const today = new Date().toISOString().slice(0, 10);
  return lessonsToday.date === today ? lessonsToday.count : 0;
}
