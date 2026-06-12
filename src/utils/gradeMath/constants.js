/** Grades 1–10 — US common-core-ish skill bands for KidQuest Grade Path. */
export const GRADES = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

export const GRADE_PASS_THRESHOLD = 0.8;

export const MODES = {
  practice: {
    id: "practice",
    label: "Practice",
    emoji: "🌱",
    description: "Low-pressure questions — learn at your pace",
    questionCount: 10,
    timed: false,
    canUnlock: false,
  },
  check: {
    id: "check",
    label: "Check yourself",
    emoji: "🔍",
    description: "Short quiz with score and weak spots",
    questionCount: 12,
    timed: false,
    canUnlock: false,
  },
  test: {
    id: "test",
    label: "Grade test",
    emoji: "🏆",
    description: "Pass with 80% to unlock the next grade",
    questionCount: 15,
    timed: false,
    canUnlock: true,
  },
};

export const GRADE_META = {
  1: {
    title: "Grade 1",
    badge: "Number Explorer",
    skills: ["Counting", "Add & subtract within 20", "Number sense"],
    emoji: "🔢",
  },
  2: {
    title: "Grade 2",
    badge: "Hundred Hero",
    skills: ["Add & subtract within 100", "Intro multiplication", "Place value"],
    emoji: "➕",
  },
  3: {
    title: "Grade 3",
    badge: "Fact Finder",
    skills: ["Multiplication & division facts", "Fractions intro", "Word problems"],
    emoji: "✖️",
  },
  4: {
    title: "Grade 4",
    badge: "Digit Dynamo",
    skills: ["Multi-digit × & ÷", "Fractions", "Decimals intro"],
    emoji: "📐",
  },
  5: {
    title: "Grade 5",
    badge: "Fraction Pro",
    skills: ["Fraction & decimal ops", "Volume", "Coordinate grids"],
    emoji: "🍕",
  },
  6: {
    title: "Grade 6",
    badge: "Ratio Ranger",
    skills: ["Ratios", "Negative numbers", "Expressions"],
    emoji: "⚖️",
  },
  7: {
    title: "Grade 7",
    badge: "Percent Pilot",
    skills: ["Proportions", "Percent", "Basic algebra"],
    emoji: "📊",
  },
  8: {
    title: "Grade 8",
    badge: "Equation Expert",
    skills: ["Linear equations", "Square roots", "Geometry"],
    emoji: "📏",
  },
  9: {
    title: "Grade 9",
    badge: "Algebra Ace",
    skills: ["Algebra I", "Systems of equations", "Quadratics intro"],
    emoji: "🧮",
  },
  10: {
    title: "Grade 10",
    badge: "Math Master",
    skills: ["Algebra II foundations", "Geometry proofs intro", "Functions"],
    emoji: "🎓",
  },
};

export function getGradeMeta(grade) {
  return GRADE_META[grade] ?? GRADE_META[1];
}

export function modeConfig(modeId) {
  return MODES[modeId] ?? MODES.practice;
}

export function parseGradeParam(raw) {
  const n = Number(raw);
  if (!Number.isInteger(n) || n < 1 || n > 10) return null;
  return n;
}
