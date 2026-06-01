/** Route → screen-time section for daily / weekly tracking */
export const SCREEN_SECTIONS = {
  geography: { label: "Geography", emoji: "🌍", color: "var(--geography)" },
  math: { label: "Math", emoji: "🧮", color: "var(--math)" },
  "math-mastery": { label: "Math Master", emoji: "🎯", color: "var(--math)" },
  multiplication: { label: "Multiplication", emoji: "✖️", color: "var(--math)" },
  "solar-system": { label: "Solar System", emoji: "🪐", color: "var(--solar-system)" },
  science: { label: "Science", emoji: "🔬", color: "#9B5DE5" },
  trivia: { label: "Trivia", emoji: "⭐", color: "var(--trivia)" },
  curiosity: { label: "Curiosity", emoji: "✨", color: "#7B68EE" },
  journey: { label: "My Journey", emoji: "🗺️", color: "#ffd700" },
  review: { label: "Review", emoji: "🧠", color: "#2ecc71" },
  explore: { label: "Explore", emoji: "🧭", color: "#54a0ff" },
  compete: { label: "Compete", emoji: "🏆", color: "#ffd700" },
  life: { label: "Life Explorer", emoji: "🌱", color: "#27ae60" },
  other: { label: "Other", emoji: "📚", color: "var(--ink)" },
};

export function todayKey() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export function sectionFromPathname(pathname = "") {
  if (!pathname || pathname === "/home") return null;
  if (pathname.startsWith("/geography") || pathname.includes("/subject/geography")) return "geography";
  if (pathname.startsWith("/math-master")) return "math-mastery";
  if (pathname.startsWith("/multiplication")) return "multiplication";
  if (pathname.startsWith("/math")) return "math";
  if (pathname.startsWith("/science")) return "science";
  if (pathname.startsWith("/trivia")) return "trivia";
  if (pathname.startsWith("/curiosity")) return "curiosity";
  if (pathname.startsWith("/journey")) return "journey";
  if (pathname.startsWith("/review")) return "review";
  if (pathname.startsWith("/explore")) return "explore";
  if (pathname.startsWith("/compete")) return "compete";
  if (pathname.startsWith("/life")) return "life";
  if (pathname.startsWith("/subject/solar-system") || pathname.includes("solar")) return "solar-system";
  if (pathname.startsWith("/lesson/") || pathname.startsWith("/results/")) return "other";
  if (pathname.startsWith("/subject/")) {
    const id = pathname.split("/")[2];
    if (SCREEN_SECTIONS[id]) return id;
  }
  return "other";
}

/** Map screen section → legacy subject id in useAppStore.timePerSubject */
export function subjectIdForSection(sectionId) {
  if (sectionId === "math-mastery" || sectionId === "multiplication") return "math";
  if (sectionId === "other") return null;
  return sectionId;
}

export function lastNDaysKeys(n = 7) {
  const keys = [];
  const d = new Date();
  for (let i = n - 1; i >= 0; i -= 1) {
    const x = new Date(d);
    x.setDate(d.getDate() - i);
    keys.push(
      `${x.getFullYear()}-${String(x.getMonth() + 1).padStart(2, "0")}-${String(x.getDate()).padStart(2, "0")}`
    );
  }
  return keys;
}
