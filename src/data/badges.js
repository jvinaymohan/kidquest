export const BADGES = [
  { id: "first_lesson", name: "First Steps", emoji: "👣", description: "Complete your very first lesson." },
  { id: "first_perfect", name: "Star Striker", emoji: "🌟", description: "Earn 3 stars on a lesson." },
  { id: "streak_3", name: "On Fire", emoji: "🔥", description: "Play 3 days in a row." },
  { id: "streak_7", name: "Week Warrior", emoji: "⚡", description: "Play 7 days in a row." },
  { id: "streak_30", name: "Legend Streak", emoji: "💎", description: "Play 30 days in a row." },
  { id: "xp_100", name: "Rookie", emoji: "🥉", description: "Earn 100 XP." },
  { id: "xp_500", name: "Pro", emoji: "🥈", description: "Earn 500 XP." },
  { id: "xp_1000", name: "Champion", emoji: "🥇", description: "Earn 1,000 XP." },
  { id: "history_apprentice", name: "History Buff", emoji: "📜", description: "Master 3 History lessons." },
  { id: "geography_apprentice", name: "World Wanderer", emoji: "🗺️", description: "Master 3 Geography lessons." },
  { id: "music_apprentice", name: "Maestro", emoji: "🎼", description: "Master 3 Music lessons." },
  { id: "math_apprentice", name: "Number Ninja", emoji: "🧮", description: "Master 3 Math lessons." },
  { id: "gk_apprentice", name: "Brainy Bunch", emoji: "💡", description: "Master 3 General Knowledge lessons." },
  { id: "trivia_apprentice", name: "Trivia Titan", emoji: "🎉", description: "Master 3 Trivia lessons." },
  { id: "subject_master", name: "Subject Master", emoji: "👑", description: "100% mastery in a subject." },
  { id: "all_subjects", name: "Quest Complete!", emoji: "🏆", description: "Try every subject." },
];

export const BADGE_BY_ID = Object.fromEntries(BADGES.map((b) => [b.id, b]));
