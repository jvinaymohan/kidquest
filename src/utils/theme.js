const THEMES = [
  { id: "jan", name: "Winter Wonderland",  emoji: "❄️", tagline: "Cool minds, warm curiosity.", from: "#E0F2FE", to: "#FFFFFF", accent: "#3A86FF" },
  { id: "feb", name: "Heart of Learning",  emoji: "💖", tagline: "Learning you can love.",       from: "#FFE4EC", to: "#FFFFFF", accent: "#E63946" },
  { id: "mar", name: "Spring Awakening",   emoji: "🌱", tagline: "New ideas are sprouting!",      from: "#E8F8E0", to: "#FFFFFF", accent: "#6BCB77" },
  { id: "apr", name: "Discovery Days",     emoji: "🌈", tagline: "Discover something new today.", from: "#FFF2CC", to: "#FFFFFF", accent: "#FF6B35" },
  { id: "may", name: "World Explorer",     emoji: "🌍", tagline: "The world is your playground.", from: "#D6F5F2", to: "#FFFFFF", accent: "#2A9D8F" },
  { id: "jun", name: "Space Mission",      emoji: "🚀", tagline: "Reach for the stars.",          from: "#EADCFF", to: "#FFFFFF", accent: "#9B5DE5" },
  { id: "jul", name: "Summer Adventure",   emoji: "☀️", tagline: "Sunny days, big questions.",    from: "#FFE6B3", to: "#FFFFFF", accent: "#FB8500" },
  { id: "aug", name: "Quiz Champions",     emoji: "🏆", tagline: "Champions are made every day.", from: "#FFF7C2", to: "#FFFFFF", accent: "#D4A017" },
  { id: "sep", name: "Back to Adventure",  emoji: "🍂", tagline: "School never felt so fun.",     from: "#FFE0CC", to: "#FFFFFF", accent: "#A86A2C" },
  { id: "oct", name: "Mystery Quest",      emoji: "🕯️", tagline: "Unlock the mystery of facts.",  from: "#F0DDFF", to: "#FFFFFF", accent: "#7B2CBF" },
  { id: "nov", name: "Gratitude Trail",    emoji: "🍁", tagline: "Grateful for curious minds.",   from: "#FFE0CC", to: "#FFFFFF", accent: "#E63946" },
  { id: "dec", name: "Holiday Magic",      emoji: "🎄", tagline: "Learning is the best gift.",    from: "#E0F5E0", to: "#FFFFFF", accent: "#6BCB77" },
];

export function getMonthlyTheme(date = new Date()) {
  const idx = date.getMonth();
  return THEMES[idx] ?? THEMES[0];
}

export function getThemeBackgroundStyle(theme) {
  return {
    background: `linear-gradient(135deg, ${theme.from} 0%, ${theme.to} 100%)`,
  };
}

export const ALL_THEMES = THEMES;
