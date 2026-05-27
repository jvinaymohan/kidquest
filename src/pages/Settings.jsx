import { useState } from "react";
import { motion } from "framer-motion";
import { Volume2, VolumeX, Music, Music2, Lock, ShieldCheck } from "lucide-react";
import { useAppStore } from "../store/useAppStore";
import { Button } from "../components/ui/Button";
import { SUBJECTS, AGE_GROUPS } from "../data/subjects";

export default function Settings() {
  const {
    parentPin, soundEnabled, musicEnabled, dailyGoal, timerMode,
    ageGroup, setAgeGroup, setSound, setMusic, setDailyGoal, setTimerMode,
    timePerSubject, resetProgress, setParentPin,
  } = useAppStore();

  const [unlocked, setUnlocked] = useState(false);
  const [pinInput, setPinInput] = useState("");
  const [showPinSet, setShowPinSet] = useState(false);
  const [newPin, setNewPin] = useState("");

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

      <section className="chunky-card p-4 border-error/40">
        <h2 className="font-display font-extrabold text-lg mb-2 text-error">Danger Zone</h2>
        <p className="text-xs font-bold text-ink/60 mb-2">Reset learning progress (keeps profile).</p>
        <Button variant="error" onClick={() => {
          if (confirm("Reset all learning progress? This cannot be undone.")) resetProgress();
        }}>
          Reset Progress
        </Button>
      </section>
    </div>
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
