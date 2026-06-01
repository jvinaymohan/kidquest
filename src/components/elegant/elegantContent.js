/** Beyond-school pillars with routes where content exists. */
export const BEYOND_SCHOOL_CARDS = [
  {
    id: "deep-knowledge",
    icon: "🌌",
    title: "The universe is your classroom",
    desc: "Explore space, ancient worlds, and big ideas — topics school won't reach for years.",
    tag: "Deep knowledge",
    glow: "bc-1",
    iconWrap: "ci-purple",
    tagClass: "ct-purple",
    to: "/science",
  },
  {
    id: "critical-thinking",
    icon: "🧩",
    title: "Think like a problem-solver",
    desc: "Logic, strategy, and creative thinking — the skills behind every great inventor.",
    tag: "Critical thinking",
    glow: "bc-2",
    iconWrap: "ci-aqua",
    tagClass: "ct-aqua",
    to: "/math-master",
  },
  {
    id: "financial-literacy",
    icon: "💰",
    title: "Money, budgets & big dreams",
    desc: "Learn how money works — saving, spending wisely, and building things that matter.",
    tag: "Financial literacy",
    glow: "bc-3",
    iconWrap: "ci-gold",
    tagClass: "ct-gold",
    to: "/explore",
    exploreLabel: "Explore hub",
  },
  {
    id: "earth-nature",
    icon: "🌱",
    title: "Our planet needs you",
    desc: "Ecosystems, climate, and why today's choices shape tomorrow's world.",
    tag: "Earth & nature",
    glow: "bc-4",
    iconWrap: "ci-rose",
    tagClass: "ct-rose",
    to: "/subject/geography",
  },
  {
    id: "social-skills",
    icon: "🗣️",
    title: "People skills are superpowers",
    desc: "Empathy, communication, and teamwork — the skills that open every door.",
    tag: "Social skills",
    glow: "bc-5",
    iconWrap: "ci-purple",
    tagClass: "ct-purple",
    to: "/journey",
  },
  {
    id: "pure-curiosity",
    icon: "🔭",
    title: 'Ask "why?" without limits',
    desc: "Philosophy, everyday science, and wild facts — because the best questions never end.",
    tag: "Pure curiosity",
    glow: "bc-6",
    iconWrap: "ci-aqua",
    tagClass: "ct-aqua",
    to: "/curiosity",
  },
];

export const LIFE_SKILLS = [
  { icon: "💡", name: "Creativity", sub: "Think differently" },
  { icon: "🤝", name: "Empathy", sub: "Understand others" },
  { icon: "🧘", name: "Resilience", sub: "Bounce back stronger" },
  { icon: "🗺️", name: "Curiosity", sub: "Never stop asking" },
  { icon: "⚡", name: "Focus", sub: "Deep attention" },
  { icon: "🌐", name: "Global view", sub: "See the big picture" },
];

export const PLATFORM_STATS = [
  { num: "50", suffix: "+", label: "Worlds to explore" },
  { num: "200", suffix: "+", label: "Quests & challenges" },
  { num: "6", suffix: "", label: "Live worlds now" },
  { num: "0", suffix: "$", label: "Cost to join" },
];

export const HERO_PILLS = [
  { icon: "🎮", label: "Play to learn" },
  { icon: "⭐", label: "Earn XP & badges" },
  { icon: "🧠", label: "Beyond school" },
  { icon: "🛡️", label: "Always safe" },
  { icon: "🌍", label: "Real world skills" },
];

export const LANDING_HOOK =
  "School teaches answers — we teach you to love questions.";

export const GETTING_STARTED_ITEMS = [
  { icon: "🚀", label: "I have a code", sub: "Enter invite", to: "/register" },
  { icon: "✨", label: "Request invite", sub: "Join waitlist", to: "/invite-request" },
  { icon: "🔑", label: "Sign in", sub: "Welcome back", to: "/login" },
];

/** Above-the-fold value peek — links tease register. */
export const LANDING_PEEK_CARDS = [
  { icon: "⚡", title: "Daily Spark", desc: "New wonder daily", to: "/register" },
  { icon: "🌍", title: "6 worlds live", desc: "50+ unlocking", to: "/register" },
  { icon: "🛡️", title: "Always safe", desc: "Ages 6–14 · no ads", to: "/register" },
  { icon: "🧠", title: "Beyond school", desc: "Real-life skills", to: "/register" },
];

/** Mini world chips (optional teasers) — matches liveSubjects.js */
export const LANDING_MINI_WORLDS = [
  { id: "geography", emoji: "🌍", gradient: "wc-geo", name: "Geo" },
  { id: "math", emoji: "🔢", gradient: "wc-math", name: "Math" },
  { id: "trivia", emoji: "⭐", gradient: "wc-trivia", name: "Trivia" },
  { id: "curiosity", emoji: "🔭", gradient: "wc-sci", name: "Curiosity" },
  { id: "science", emoji: "🔬", gradient: "wc-sci", name: "Science" },
  { id: "solar-system", emoji: "🪐", gradient: "wc-space", name: "Space" },
];

/** World card visuals — live vs coming soon handled by caller. */
export const WORLD_STYLES = {
  geography: { emoji: "🌍", gradient: "wc-geo", xp: 50, displayName: "Geography" },
  math: { emoji: "🔢", gradient: "wc-math", xp: 40, displayName: "Math" },
  "solar-system": { emoji: "🪐", gradient: "wc-space", xp: 60, displayName: "Space" },
  science: { emoji: "🔬", gradient: "wc-sci", xp: 45, displayName: "Science" },
  trivia: { emoji: "⭐", gradient: "wc-trivia", xp: 35, displayName: "Trivia" },
  curiosity: { emoji: "🔭", gradient: "wc-sci", xp: 30, displayName: "Curiosity" },
  history: { emoji: "🏛️", gradient: "wc-hist", xp: 0, displayName: "History" },
  music: { emoji: "🎵", gradient: "wc-music", xp: 0, displayName: "Music" },
  "general-knowledge": { emoji: "💡", gradient: "wc-gk", xp: 0, displayName: "GK" },
};

export const COMING_SOON_WORLDS = [
  { id: "history", emoji: "🏛️", name: "History", gradient: "wc-hist" },
  { id: "music", emoji: "🎵", name: "Music", gradient: "wc-music" },
  { id: "general-knowledge", emoji: "💡", name: "GK", gradient: "wc-gk" },
  { id: "art", emoji: "🎨", name: "Art", gradient: "wc-art" },
];
