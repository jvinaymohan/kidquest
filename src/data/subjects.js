import history from "./history.json";
import geography from "./geography";
import music from "./music.json";
import math from "./math";
import generalKnowledge from "./general-knowledge.json";
import trivia from "./trivia.json";
import solarSystem from "./solar-system";

export const SUBJECTS = [
  {
    id: "history",
    name: "History",
    tagline: "Time-travel through epic stories",
    color: "var(--history)",
    accent: "#FFE7A8",
    mascotKey: "owl",
    mascotName: "Professor Owl",
    icon: "Scroll",
  },
  {
    id: "geography",
    name: "Geography",
    tagline: "Explore the wide, wide world",
    color: "var(--geography)",
    accent: "#B5E8E1",
    mascotKey: "compass",
    mascotName: "Captain Compass",
    icon: "Globe2",
    learnSurface: true,
  },
  {
    id: "music",
    name: "Music",
    tagline: "Make magic with melody",
    color: "var(--music)",
    accent: "#E2CCFA",
    mascotKey: "dino",
    mascotName: "DJ Dino",
    icon: "Music2",
  },
  {
    id: "math",
    name: "Math",
    tagline: "Numbers are your superpower",
    color: "var(--math)",
    accent: "#C5DBFF",
    mascotKey: "robot",
    mascotName: "Robot Rex",
    icon: "Calculator",
    learnSurface: true,
  },
  {
    id: "general-knowledge",
    name: "General Knowledge",
    tagline: "Discover how the world works",
    color: "var(--general-knowledge)",
    accent: "#FFDCB0",
    mascotKey: "cat",
    mascotName: "Curious Cat",
    icon: "Lightbulb",
  },
  {
    id: "trivia",
    name: "Trivia",
    tagline: "Mix-it-up brain teasers",
    color: "var(--trivia)",
    accent: "#FFC9CE",
    mascotKey: "panda",
    mascotName: "Party Panda",
    icon: "Star",
  },
  {
    id: "solar-system",
    name: "Solar System",
    tagline: "Blast off into space!",
    color: "var(--solar-system)",
    accent: "#D6E6FF",
    mascotKey: "rocket",
    mascotName: "Captain Cosmo",
    icon: "Rocket",
    isBonus: true,
    learnSurface: true,
  },
];

export const SUBJECT_DATA = {
  history,
  geography,
  music,
  math,
  "general-knowledge": generalKnowledge,
  trivia,
  "solar-system": solarSystem,
};

export const AGE_GROUPS = [
  {
    id: "explorer",
    label: "Explorer",
    ageRange: "4–6",
    description: "Big pictures, simple words, easy taps.",
    emoji: "🦋",
    color: "var(--color-secondary)",
  },
  {
    id: "adventurer",
    label: "Adventurer",
    ageRange: "7–10",
    description: "Stories, multiple choice & quick puzzles.",
    emoji: "🚀",
    color: "var(--color-primary)",
  },
  {
    id: "champion",
    label: "Champion",
    ageRange: "11–14",
    description: "Deep questions, ordering & tricky facts.",
    emoji: "🏆",
    color: "var(--music)",
  },
];

export function getSubject(id) {
  return SUBJECTS.find((s) => s.id === id);
}

export function getLessonsFor(subjectId, ageGroup) {
  const data = SUBJECT_DATA[subjectId];
  if (!data) return [];
  return data.ageGroups?.[ageGroup]?.lessons ?? [];
}

export function getLessonById(lessonId) {
  for (const sid of Object.keys(SUBJECT_DATA)) {
    const sd = SUBJECT_DATA[sid];
    for (const ag of Object.keys(sd.ageGroups)) {
      const found = sd.ageGroups[ag].lessons.find((l) => l.id === lessonId);
      if (found) return { lesson: found, subjectId: sid, ageGroup: ag };
    }
  }
  return null;
}
