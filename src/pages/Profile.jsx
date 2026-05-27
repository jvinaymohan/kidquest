import { useState } from "react";
import { motion } from "framer-motion";
import { useAppStore } from "../store/useAppStore";
import { Avatar, AVATAR_OPTIONS } from "../components/mascots/Avatar";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { BADGES, BADGE_BY_ID } from "../data/badges";
import { BadgeChip } from "../components/ui/BadgeChip";
import { SUBJECTS } from "../data/subjects";
import { subjectProgress } from "../utils/content";
import { ProgressRing } from "../components/ui/ProgressRing";

export default function Profile() {
  const {
    kidName, setKidName, avatarConfig, setAvatar,
    totalXP, totalPoints, level, currentStreak, longestStreak,
    badges, ageGroup, lessonProgress,
  } = useAppStore();

  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(kidName);
  const [config, setConfig] = useState(avatarConfig);

  function tweak(key, d) {
    setConfig((c) => ({ ...c, [key]: (c[key] + d + AVATAR_OPTIONS[key]) % AVATAR_OPTIONS[key] }));
  }
  function save() {
    setKidName(name.trim() || kidName);
    setAvatar(config);
    setEditing(false);
  }

  const earnedSet = new Set(badges);

  return (
    <div className="flex flex-col gap-5">
      <motion.section
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="chunky-card p-5 flex items-center gap-4 bg-gradient-to-br from-accent to-white"
      >
        <div className="rounded-full bg-white border-[3px] border-ink/20 shadow-chunky p-1">
          <Avatar config={avatarConfig} size={96} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-xs font-display font-extrabold uppercase tracking-wide text-ink/60">Hero</div>
          <div className="font-display text-2xl font-extrabold truncate">{kidName || "Friend"}</div>
          <div className="text-xs font-bold text-ink/70 capitalize">{ageGroup}</div>
        </div>
        <Button variant="ghost" size="sm" onClick={() => { setName(kidName); setConfig(avatarConfig); setEditing(true); }}>
          Edit
        </Button>
      </motion.section>

      <section className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Stat label="Points" value={totalPoints ?? 0} hint="🏆" />
        <Stat label="XP" value={totalXP} hint="⚡" />
        <Stat label="Level" value={level} hint="🎯" />
        <Stat label="Streak" value={`${currentStreak}🔥`} />
      </section>
      <div className="text-center text-xs font-bold text-ink/60 -mt-2">Longest streak: {longestStreak} days</div>

      <section>
        <h3 className="font-display text-xl font-extrabold mb-2">Subject Mastery</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {SUBJECTS.map((s) => {
            const stats = subjectProgress(s.id, ageGroup, lessonProgress);
            return (
              <Card key={s.id} className="flex flex-col items-center gap-2" style={{ background: s.accent }}>
                <ProgressRing value={stats.masteryPct} size={56} stroke={7} color={s.color}>
                  <span className="text-[11px] font-extrabold">{Math.round(stats.masteryPct * 100)}%</span>
                </ProgressRing>
                <div className="font-display font-extrabold text-sm text-center">{s.name}</div>
              </Card>
            );
          })}
        </div>
      </section>

      <section>
        <h3 className="font-display text-xl font-extrabold mb-2">Badge Shelf</h3>
        <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
          {BADGES.map((b) => (
            <BadgeChip key={b.id} badge={b} earned={earnedSet.has(b.id)} />
          ))}
        </div>
        <p className="text-center text-xs font-bold text-ink/60 mt-3">
          {badges.length} / {BADGES.length} unlocked
        </p>
      </section>

      {editing && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 bg-ink/40 grid place-items-center p-4"
          onClick={() => setEditing(false)}
        >
          <motion.div
            initial={{ scale: 0.9, y: 12 }}
            animate={{ scale: 1, y: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-chunky border-[3px] border-ink/15 shadow-chunkyLg p-5 max-w-sm w-full"
          >
            <h3 className="font-display text-2xl font-extrabold text-center">Edit Hero</h3>
            <div className="grid place-items-center my-3">
              <Avatar config={config} size={140} />
            </div>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={18}
              className="w-full px-4 py-3 text-xl font-display font-bold text-center rounded-chunky border-[3px] border-ink/15 shadow-chunky focus-ring"
            />
            <div className="grid grid-cols-2 gap-2 mt-3 text-sm">
              {[
                ["skin", "Skin"],
                ["hair", "Hair"],
                ["outfit", "Outfit"],
                ["accessory", "Glasses"],
              ].map(([k, l]) => (
                <div key={k} className="bg-bg rounded-chunky border-[3px] border-ink/15 shadow-chunkySm p-2 flex items-center justify-between">
                  <button onClick={() => tweak(k, -1)} className="w-9 h-9 rounded-full bg-white border-[2.5px] border-ink/15 font-bold focus-ring">←</button>
                  <span className="font-display font-extrabold">{l}</span>
                  <button onClick={() => tweak(k, +1)} className="w-9 h-9 rounded-full bg-white border-[2.5px] border-ink/15 font-bold focus-ring">→</button>
                </div>
              ))}
            </div>
            <div className="flex gap-3 mt-4">
              <Button variant="ghost" fullWidth onClick={() => setEditing(false)}>Cancel</Button>
              <Button fullWidth onClick={save}>Save</Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}

function Stat({ label, value, hint }) {
  return (
    <div className="chunky-card text-center py-3 relative">
      {hint && <div className="absolute top-1.5 right-2 text-sm opacity-70" aria-hidden>{hint}</div>}
      <div className="text-[10px] uppercase tracking-wide font-display font-extrabold text-ink/60">{label}</div>
      <div className="font-display font-extrabold text-2xl">{value}</div>
    </div>
  );
}
