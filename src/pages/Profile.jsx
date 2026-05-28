import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { LogOut, Cloud, CloudOff } from "lucide-react";
import { useAppStore } from "../store/useAppStore";
import { useAuthStore } from "../store/useAuthStore";
import { Avatar, AVATAR_OPTIONS } from "../components/mascots/Avatar";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { BADGES, BADGE_BY_ID } from "../data/badges";
import { BadgeChip } from "../components/ui/BadgeChip";
import { SUBJECTS } from "../data/subjects";
import { subjectProgress } from "../utils/content";
import { GEO_TRACKS } from "../data/geography/tracks";
import { getLessonsFor } from "../data/subjects";
import { ProgressRing } from "../components/ui/ProgressRing";
import { RankBadge } from "../components/multiplication/RankBadge";
import { isSupabaseEnabled } from "../lib/supabaseClient";

export default function Profile() {
  const {
    kidName, setKidName, avatarConfig, setAvatar,
    totalXP, totalPoints, level, currentStreak, longestStreak,
    badges, ageGroup, lessonProgress, role,
  } = useAppStore();
  const updateProfile = useAuthStore((s) => s.updateProfile);
  const signOut = useAuthStore((s) => s.signOut);
  const session = useAuthStore((s) => s.session);
  const navigate = useNavigate();

  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(kidName);
  const [config, setConfig] = useState(avatarConfig);

  function tweak(key, d) {
    setConfig((c) => ({ ...c, [key]: (c[key] + d + AVATAR_OPTIONS[key]) % AVATAR_OPTIONS[key] }));
  }
  function save() {
    const finalName = name.trim() || kidName;
    setKidName(finalName);
    setAvatar(config);
    updateProfile({ kid_name: finalName, display_name: finalName, avatar_config: config }).catch(() => {});
    setEditing(false);
  }

  async function onSignOut() {
    if (!confirm("Sign out of KidQuest?")) return;
    await signOut();
    navigate("/landing", { replace: true });
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

      <RankBadge />

      <Link
        to="/settings"
        className="chunky-card p-3 border-[3px] border-ink/15 bg-white flex items-center justify-between focus-ring"
      >
        <span className="font-display font-extrabold">
          {role === "teacher" ? "Teacher Dashboard" : role === "parent" ? "Parent Dashboard" : "Parent Dashboard"}
        </span>
        <span className="text-sm font-bold text-ink/60">PIN protected →</span>
      </Link>

      <div className="chunky-card p-3 flex items-center gap-3">
        {session ? <Cloud className="text-success" size={18} /> : <CloudOff className="text-ink/40" size={18} />}
        <div className="flex-1 text-xs font-bold text-ink/70">
          {isSupabaseEnabled
            ? session
              ? "Cloud sync on — progress saves across devices."
              : "Cloud disabled — local progress only."
            : "Configure Supabase to enable cloud sync."}
        </div>
        {session && (
          <Button variant="ghost" size="sm" onClick={onSignOut} leftIcon={<LogOut size={16} />}>
            Sign out
          </Button>
        )}
      </div>

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

      <section className="chunky-card p-4">
        <h3 className="font-display text-lg font-extrabold mb-3 flex items-center gap-2">
          <span aria-hidden>🌍</span> Geography tracks
        </h3>
        <ul className="flex flex-col gap-2.5">
          {GEO_TRACKS.map((track) => {
            const lessons = getLessonsFor("geography", ageGroup);
            const lesson = lessons.find((l) => l.track === track.id);
            const p = lesson ? lessonProgress[lesson.id] : null;
            const pct = p?.mastered ? 100 : p?.stars ? 50 : 0;
            return (
              <li key={track.id}>
                <div className="flex items-center gap-3">
                  <span className="text-xl" aria-hidden>
                    {track.emoji}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-display font-extrabold" style={{ color: track.color }}>
                      {track.title}
                    </div>
                    <div className="h-1.5 rounded-full bg-ink/10 mt-1 overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{ width: `${pct}%`, backgroundColor: track.color }}
                      />
                    </div>
                  </div>
                  <span className="text-xs font-bold text-ink/50 tabular-nums">
                    {p?.mastered ? "✓" : p ? `${p.stars}★` : "—"}
                  </span>
                </div>
              </li>
            );
          })}
        </ul>
        <Link
          to="/subject/geography"
          className="mt-3 inline-block text-sm font-display font-extrabold text-geography focus-ring"
        >
          Open geography hub →
        </Link>
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
