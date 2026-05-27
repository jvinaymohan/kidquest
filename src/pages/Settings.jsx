import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Volume2, VolumeX, Music, Music2, Lock, ShieldCheck, Heart, BookOpen, Download, ClipboardList } from "lucide-react";
import { useAppStore } from "../store/useAppStore";
import { useMultiplicationStore } from "../store/useMultiplicationStore";
import { Button } from "../components/ui/Button";
import { SUBJECTS, AGE_GROUPS } from "../data/subjects";

export default function Settings() {
  const {
    parentPin, soundEnabled, musicEnabled, dailyGoal, timerMode,
    ageGroup, setAgeGroup, setSound, setMusic, setDailyGoal, setTimerMode,
    timePerSubject, resetProgress, setParentPin, lessonsToday, lessonProgress,
    teacherAssignments, addTeacherAssignment, toggleTeacherAssignment, removeTeacherAssignment,
    classTarget, setClassTarget, parentDigestLog, logParentDigest, kidName,
  } = useAppStore();

  const [unlocked, setUnlocked] = useState(false);
  const [pinInput, setPinInput] = useState("");
  const [showPinSet, setShowPinSet] = useState(false);
  const [newPin, setNewPin] = useState("");
  const [assignmentTitle, setAssignmentTitle] = useState("");
  const [assignmentDue, setAssignmentDue] = useState("");
  const [assignmentSubject, setAssignmentSubject] = useState("math");
  const multiplicationTables = useMultiplicationStore((s) => s.tables);

  if (!unlocked) {
    return (
      <div className="flex flex-col items-center gap-5 mt-6">
        <motion.div initial={{ scale: 0.7, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="w-20 h-20 bg-accent rounded-full grid place-items-center border-[4px] border-ink/20 shadow-chunkyLg">
          <Lock size={36} />
        </motion.div>
        <h1 className="font-display text-3xl font-extrabold">Parent Zone</h1>
        <p className="text-center font-body font-bold text-ink/70 max-w-sm">
          Enter the PIN to view progress, set goals, and change settings.
        </p>
        <input
          value={pinInput}
          onChange={(e) => setPinInput(e.target.value.replace(/\D/g, "").slice(0, 6))}
          inputMode="numeric"
          autoFocus
          placeholder="••••"
          className="w-40 text-center px-4 py-3 text-3xl tracking-[0.4em] font-display font-extrabold rounded-chunky border-[3px] border-ink/15 shadow-chunky focus-ring"
        />
        <Button onClick={() => setUnlocked(pinInput === parentPin)} size="lg">
          Unlock
        </Button>
        {pinInput && pinInput !== parentPin && pinInput.length >= 4 && (
          <p className="text-error font-bold text-sm">Wrong PIN. Default is 1234.</p>
        )}
        <p className="text-xs font-bold text-ink/50">Hint: default PIN is 1234</p>

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

  return (
    <div className="flex flex-col gap-5">
      <header className="flex items-center gap-2">
        <ShieldCheck className="text-success" />
        <h1 className="font-display text-3xl font-extrabold">Parent Dashboard</h1>
      </header>

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
              onClick={() => setAgeGroup(g.id)}
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

      <section className="chunky-card p-4 flex flex-col gap-3">
        <h2 className="font-display font-extrabold text-lg">Sound & Music</h2>
        <Toggle
          label="Sound effects"
          icon={soundEnabled ? <Volume2 /> : <VolumeX />}
          on={soundEnabled}
          onChange={setSound}
        />
        <Toggle
          label="Background music"
          icon={musicEnabled ? <Music2 /> : <Music />}
          on={musicEnabled}
          onChange={setMusic}
        />
        <Toggle
          label="Champion timer mode"
          icon={<ShieldCheck />}
          on={timerMode}
          onChange={setTimerMode}
        />
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
        <h2 className="font-display font-extrabold text-lg mb-2">Teacher Assignments</h2>
        <div className="flex flex-wrap gap-2 mb-2">
          <button
            type="button"
            onClick={() => {
              setAssignmentTitle("Geography: Locate 8 countries");
              setAssignmentSubject("geography");
            }}
            className="text-xs font-bold px-2 py-1 rounded-pill border-2 border-ink/15 bg-white"
          >
            + Geography template
          </button>
          <button
            type="button"
            onClick={() => {
              setAssignmentTitle("Solar System: Learn 5 planet facts");
              setAssignmentSubject("solar-system");
            }}
            className="text-xs font-bold px-2 py-1 rounded-pill border-2 border-ink/15 bg-white"
          >
            + Solar template
          </button>
          <button
            type="button"
            onClick={() => {
              setAssignmentTitle("Math: Table 7 to Boss Battle");
              setAssignmentSubject("math");
            }}
            className="text-xs font-bold px-2 py-1 rounded-pill border-2 border-ink/15 bg-white"
          >
            + Math template
          </button>
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
        <Button
          className="mt-2 w-full"
          onClick={() => {
            if (!assignmentTitle || !assignmentDue) return;
            addTeacherAssignment({ title: assignmentTitle, dueDate: assignmentDue, subjectId: assignmentSubject });
            setAssignmentTitle("");
            setAssignmentDue("");
          }}
        >
          Add Assignment
        </Button>
        <ul className="mt-3 space-y-2">
          {teacherAssignments.map((a) => (
            <li key={a.id} className="rounded-chunky border-[2px] border-ink/10 p-2 flex items-center gap-2">
              <button type="button" onClick={() => toggleTeacherAssignment(a.id)} className="text-lg">
                {a.done ? "✅" : "⬜"}
              </button>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold truncate">{a.title}</p>
                <p className="text-xs text-ink/60">{a.subjectId} · due {a.dueDate}</p>
              </div>
              <button type="button" onClick={() => removeTeacherAssignment(a.id)} className="text-xs font-bold text-error">
                remove
              </button>
            </li>
          ))}
          {teacherAssignments.length === 0 && (
            <p className="text-xs font-bold text-ink/60">No assignments yet.</p>
          )}
        </ul>
      </section>

      <section className="chunky-card p-4 border-[3px] border-geography/25">
        <h2 className="font-display font-extrabold text-lg mb-2">Parent Digests & Exports</h2>
        <Button
          variant="ghost"
          fullWidth
          leftIcon={<ClipboardList size={16} />}
          onClick={() => {
            const msg = `Today ${kidName || "your child"} completed ${todayLessons(lessonsToday)} lessons and has a ${dailyGoal}-lesson daily goal.`;
            logParentDigest(msg);
          }}
        >
          Generate Daily Digest
        </Button>
        <Button
          className="mt-2 w-full"
          leftIcon={<Download size={16} />}
          onClick={() => exportProgressCsv({ teacherAssignments, lessonProgress, multiplicationTables })}
        >
          Export Progress CSV
        </Button>
        <ul className="mt-3 space-y-2">
          {parentDigestLog.slice(0, 5).map((d) => (
            <li key={d.id} className="text-xs font-bold text-ink/70 rounded-chunky bg-bg px-2 py-2 border border-ink/10">
              {new Date(d.at).toLocaleDateString()} - {d.message}
            </li>
          ))}
          {parentDigestLog.length === 0 && (
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
            <Button
              onClick={() => {
                if (newPin.length >= 4) {
                  setParentPin(newPin);
                  setShowPinSet(false);
                  setNewPin("");
                }
              }}
            >
              Save
            </Button>
          </div>
        )}
      </section>

      <MultiplicationParentSection />

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
      <Toggle
        label="Unlock all tables (1–20)"
        icon={<ShieldCheck />}
        on={unlockAll}
        onChange={setUnlockAll}
      />
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
