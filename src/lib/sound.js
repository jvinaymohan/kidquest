/** Lightweight Web Audio SFX. Respects mute via useSound hook. */

let audioCtx = null;

function getCtx() {
  if (typeof window === "undefined") return null;
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  return audioCtx;
}

function tone(freq, duration = 0.12, type = "sine", gain = 0.08) {
  const ctx = getCtx();
  if (!ctx) return;
  if (ctx.state === "suspended") ctx.resume().catch(() => {});
  const osc = ctx.createOscillator();
  const g = ctx.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  g.gain.value = gain;
  osc.connect(g);
  g.connect(ctx.destination);
  const t = ctx.currentTime;
  g.gain.exponentialRampToValueAtTime(0.001, t + duration);
  osc.start(t);
  osc.stop(t + duration);
}

export function sfxCorrect() {
  tone(523, 0.1, "sine", 0.07);
  setTimeout(() => tone(659, 0.12, "sine", 0.06), 80);
}

export function sfxWrong() {
  tone(220, 0.15, "triangle", 0.06);
}

export function sfxLevelUp() {
  [523, 659, 784, 1047].forEach((f, i) => {
    setTimeout(() => tone(f, 0.14, "sine", 0.07), i * 90);
  });
}

export function sfxBossWin() {
  [392, 494, 587, 740].forEach((f, i) => {
    setTimeout(() => tone(f, 0.18, "square", 0.05), i * 120);
  });
}

export function sfxTap() {
  tone(440, 0.05, "sine", 0.04);
}
