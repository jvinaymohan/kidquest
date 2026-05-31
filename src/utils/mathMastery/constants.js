export const STREAK_TARGET = 25;
export const TIMED_SECONDS = 30;
export const LEVELS = [1, 2, 3, 4, 5];

export const OPERATIONS = [
  { id: "addition", name: "Addition", emoji: "➕", accent: "#3A86FF" },
  { id: "subtraction", name: "Subtraction", emoji: "➖", accent: "#FF6B35" },
  { id: "multiplication", name: "Multiplication", emoji: "✖️", accent: "#9B5DE5" },
  { id: "division", name: "Division", emoji: "➗", accent: "#2A9D8F" },
  { id: "fractions", name: "Fractions", emoji: "🍕", accent: "#FFB703" },
];

export function getOperation(id) {
  return OPERATIONS.find((o) => o.id === id);
}

export function levelLabel(level) {
  if (level === 1) return "1-digit";
  return `${level}-digit`;
}

export function fractionLevelLabel(level) {
  const labels = [
    "Same denominator",
    "Different denominators",
    "Mixed numbers",
    "Improper fractions",
    "Multi-step",
  ];
  return labels[level - 1] ?? `Level ${level}`;
}
