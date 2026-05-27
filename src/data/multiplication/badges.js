export const TABLE_BADGES = {
  1: { id: "mul_table_1", name: "Ones Master", emoji: "🌱" },
  2: { id: "mul_table_2", name: "Doubles Dynamo", emoji: "✌️" },
  3: { id: "mul_table_3", name: "Triple Threat", emoji: "3️⃣" },
  4: { id: "mul_table_4", name: "Quad Crusher", emoji: "4️⃣" },
  5: { id: "mul_table_5", name: "High Fiver", emoji: "✋" },
  6: { id: "mul_table_6", name: "Six Shooter", emoji: "🎯" },
  7: { id: "mul_table_7", name: "Lucky Seven", emoji: "🍀" },
  8: { id: "mul_table_8", name: "Octo Ace", emoji: "🐙" },
  9: { id: "mul_table_9", name: "Nines Ninja", emoji: "🥷" },
  10: { id: "mul_table_10", name: "Perfect Ten", emoji: "🔟" },
  11: { id: "mul_table_11", name: "Elevens Expert", emoji: "1️⃣1️⃣" },
  12: { id: "mul_table_12", name: "Classic Champ", emoji: "📏" },
  13: { id: "mul_table_13", name: "Baker's Dozen", emoji: "🥐" },
  14: { id: "mul_table_14", name: "Fourteen Force", emoji: "💪" },
  15: { id: "mul_table_15", name: "Fifteen Fury", emoji: "⚡" },
  16: { id: "mul_table_16", name: "Sweet Sixteen", emoji: "🎂" },
  17: { id: "mul_table_17", name: "Seventeen Star", emoji: "⭐" },
  18: { id: "mul_table_18", name: "Eighteen Elite", emoji: "🏅" },
  19: { id: "mul_table_19", name: "Nineteen Knight", emoji: "🛡️" },
  20: { id: "mul_table_20", name: "Ultimate Twenty", emoji: "💎" },
};

export const SPEED_BADGES = [
  { id: "mul_lightning", name: "Lightning Strike", emoji: "⚡", check: (s) => s.goldCount >= 1 },
  { id: "mul_speed_demon", name: "Speed Demon", emoji: "🚀", check: (s) => s.bestTimeMs > 0 && s.bestTimeMs < 120000 },
  { id: "mul_flawless", name: "Flawless", emoji: "💯", check: (s) => s.perfectGold },
  { id: "mul_iron_mind", name: "Iron Mind", emoji: "🔩", check: (s) => s.totalRuns >= 10 },
];
