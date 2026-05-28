import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAppStore } from "../store/useAppStore";
import { useAuthStore } from "../store/useAuthStore";
import { isSupabaseEnabled } from "../lib/supabaseClient";
import { AGE_GROUPS } from "../data/subjects";
import { Button } from "../components/ui/Button";
import { Avatar, AVATAR_OPTIONS } from "../components/mascots/Avatar";
import { Mascot } from "../components/mascots/Mascot";
import { ConfettiBlast } from "../components/rewards/ConfettiBlast";

const STEPS = ["welcome", "name", "age", "avatar", "go"];

export default function Onboarding() {
  const existingName = useAppStore((s) => s.kidName);
  const existingAge = useAppStore((s) => s.ageGroup);
  const existingAvatar = useAppStore((s) => s.avatarConfig);
  const existingRole = useAppStore((s) => s.role);
  const updateProfile = useAuthStore((s) => s.updateProfile);
  const profile = useAuthStore((s) => s.profile);
  const session = useAuthStore((s) => s.session);
  const [step, setStep] = useState(existingName ? 3 : 0);
  const [name, setName] = useState(existingName || profile?.kid_name || "");
  const [ageGroup, setAgeGroup] = useState(existingAge || profile?.age_group || "adventurer");
  const [avatar, setAvatar] = useState(existingAvatar || { skin: 1, hair: 1, outfit: 1, accessory: 0 });
  const [celebrate, setCelebrate] = useState(false);
  const navigate = useNavigate();
  const complete = useAppStore((s) => s.completeOnboarding);

  if (isSupabaseEnabled && !session) {
    return <Navigate to="/landing" replace />;
  }

  function next() {
    setStep((s) => Math.min(STEPS.length - 1, s + 1));
  }
  function back() {
    setStep((s) => Math.max(0, s - 1));
  }

  function finish() {
    setCelebrate(true);
    const finalName = name.trim() || "Friend";
    complete({ kidName: finalName, ageGroup, avatarConfig: avatar, role: existingRole || "kid" });
    updateProfile({
      kid_name: finalName,
      display_name: finalName,
      age_group: ageGroup,
      avatar_config: avatar,
      role: existingRole || "kid",
    }).catch(() => {});
    setTimeout(() => {
      navigate("/home", { replace: true });
    }, 1400);
  }

  function tweakAvatar(key, delta) {
    setAvatar((a) => ({
      ...a,
      [key]: (a[key] + delta + AVATAR_OPTIONS[key]) % AVATAR_OPTIONS[key],
    }));
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-5 relative overflow-hidden">
      {celebrate && <ConfettiBlast count={140} />}

      <AnimatePresence mode="wait">
        {step === 0 && (
          <motion.div
            key="welcome"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="text-center max-w-md w-full"
          >
            <div className="grid grid-cols-3 gap-2 max-w-xs mx-auto mb-6">
              {["owl", "compass", "dino", "robot", "cat", "panda"].map((m, i) => (
                <motion.div
                  key={m}
                  initial={{ y: -40, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: i * 0.12, type: "spring", stiffness: 260, damping: 18 }}
                >
                  <Mascot kind={m} size={72} />
                </motion.div>
              ))}
            </div>
            <h1 className="font-display text-5xl font-extrabold text-primary leading-none">KidQuest</h1>
            <p className="font-body font-bold text-lg mt-3 text-ink/80">
              A joyful learning adventure with our mascot friends!
            </p>
            <Button size="xl" className="mt-8" fullWidth onClick={next}>
              Start the Quest! ✨
            </Button>
          </motion.div>
        )}

        {step === 1 && (
          <motion.div
            key="name"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            className="text-center max-w-md w-full"
          >
            <Mascot kind="cat" size={120} />
            <h2 className="font-display text-3xl font-extrabold mt-3">What's your name?</h2>
            <input
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && name.trim() && next()}
              placeholder="Your awesome name"
              className="w-full mt-5 px-5 py-4 text-2xl font-display font-bold text-center rounded-chunky border-[3px] border-ink/20 shadow-chunky focus-ring"
              maxLength={18}
            />
            <div className="flex gap-3 mt-5">
              <Button variant="ghost" onClick={back} fullWidth>← Back</Button>
              <Button onClick={next} disabled={!name.trim()} fullWidth size="lg">Next →</Button>
            </div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            key="age"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            className="text-center max-w-md w-full"
          >
            <h2 className="font-display text-3xl font-extrabold">How old are you, {name || "friend"}?</h2>
            <p className="font-body font-bold text-ink/70 mt-1">Pick the group that fits best!</p>
            <div className="flex flex-col gap-3 mt-6">
              {AGE_GROUPS.map((g) => (
                <button
                  key={g.id}
                  onClick={() => setAgeGroup(g.id)}
                  className={`text-left rounded-chunky border-[3px] p-4 shadow-chunky font-bold focus-ring transition ${
                    ageGroup === g.id ? "bg-accent border-ink/30 scale-[1.02]" : "bg-white border-ink/15"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="text-4xl">{g.emoji}</div>
                    <div className="flex-1">
                      <div className="font-display text-xl font-extrabold">{g.label} <span className="text-ink/60 font-bold text-base">· Ages {g.ageRange}</span></div>
                      <div className="text-sm text-ink/70">{g.description}</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
            <div className="flex gap-3 mt-6">
              <Button variant="ghost" onClick={back} fullWidth>← Back</Button>
              <Button onClick={next} fullWidth size="lg">Next →</Button>
            </div>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div
            key="avatar"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            className="text-center max-w-md w-full"
          >
            <h2 className="font-display text-3xl font-extrabold">Build your hero!</h2>
            <div className="grid place-items-center my-5">
              <div className="rounded-full bg-white border-[4px] border-ink/20 shadow-chunkyLg p-2">
                <Avatar config={avatar} size={160} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              {[
                { key: "skin", label: "Skin" },
                { key: "hair", label: "Hair" },
                { key: "outfit", label: "Outfit" },
                { key: "accessory", label: "Glasses" },
              ].map(({ key, label }) => (
                <div key={key} className="bg-white rounded-chunky border-[3px] border-ink/15 shadow-chunky p-2 flex items-center justify-between">
                  <button onClick={() => tweakAvatar(key, -1)} className="w-9 h-9 rounded-full bg-bg border-[2.5px] border-ink/20 font-display font-extrabold focus-ring">←</button>
                  <span className="font-display font-extrabold">{label}</span>
                  <button onClick={() => tweakAvatar(key, +1)} className="w-9 h-9 rounded-full bg-bg border-[2.5px] border-ink/20 font-display font-extrabold focus-ring">→</button>
                </div>
              ))}
            </div>
            <div className="flex gap-3 mt-5">
              <Button variant="ghost" onClick={back} fullWidth>← Back</Button>
              <Button onClick={next} fullWidth size="lg">Looks great →</Button>
            </div>
          </motion.div>
        )}

        {step === 4 && (
          <motion.div
            key="go"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="text-center max-w-md w-full"
          >
            <motion.div animate={{ y: [0, -8, 0] }} transition={{ repeat: Infinity, duration: 1.8 }}>
              <Avatar config={avatar} size={160} />
            </motion.div>
            <h2 className="font-display text-4xl font-extrabold mt-3">Let's go, {name || "Hero"}!</h2>
            <p className="font-body font-bold mt-1 text-ink/70">Your adventure is ready.</p>
            <Button size="xl" className="mt-8" fullWidth onClick={finish}>
              Start Learning! 🚀
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
