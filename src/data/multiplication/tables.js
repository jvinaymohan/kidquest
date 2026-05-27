export function generateAllFacts() {
  const facts = [];
  for (let a = 1; a <= 20; a++) {
    for (let b = 1; b <= 20; b++) {
      facts.push({
        id: `${a}x${b}`,
        multiplicand: a,
        multiplier: b,
        product: a * b,
        tableNumber: a,
      });
    }
  }
  return facts;
}

export const ALL_FACTS = generateAllFacts();

export function getFactsForTable(tableNumber) {
  return ALL_FACTS.filter((f) => f.tableNumber === tableNumber);
}

export function getFact(id) {
  return ALL_FACTS.find((f) => f.id === id);
}

export const tablePatterns = {
  1: "Any number times 1 is always itself! 1 is the identity!",
  2: "Multiplying by 2 is the same as adding the number to itself.",
  3: "Digits of multiples of 3 always add up to 3, 6, or 9.",
  4: "Multiply by 4 = double it, then double again!",
  5: "Multiples of 5 always end in 0 or 5.",
  6: "6 times any even number: last digit matches the even number.",
  7: "The trickiest table! Just needs practice. You've got this.",
  8: "Multiply by 8 = double three times!",
  9: "The 9s trick: digits always add to 9. (9×3=27, 2+7=9!)",
  10: "Just add a 0! 10×7 = 70.",
  11: "Up to 11×9, just repeat the digit! 11×6 = 66.",
  12: "12 = 10 + 2. Multiply by 10, then add double the number.",
  13: "13 = 10 + 3. Use the split trick!",
  14: "14 = 10 + 4. Double the 7s table!",
  15: "15 = 10 + 5. Add the 10× and 5× answers.",
  16: "16 = 2 × 8. Double the 8s table.",
  17: "17 = 10 + 7. Split it!",
  18: "18 = 2 × 9. Double the 9s table.",
  19: "19 trick: multiply by 20, then subtract the number.",
  20: "Just multiply by 2, then add a 0! 20×7 = 140.",
};

export const MOTIVATIONAL = {
  startTable: (n) => `Let's train Table ${n}. Ready to own it?`,
  firstCorrect: "That's it! Keep going.",
  wrong: (y) => `Close! The answer was ${y}. You'll get it next time.`,
  personalBest: (x) => `NEW PERSONAL BEST! ⚡ ${x} seconds faster!`,
  gold: "GOLD! 🥇 You are UNSTOPPABLE!",
  phase4Pass: (n) => `Table ${n} MASTERED! You're a legend in training.`,
  legend: (n) => `LEGEND STATUS UNLOCKED! Table ${n} is YOURS. Forever.`,
  under2min: "UNDER 2 MINUTES?! You're built different. 🚀",
  grandMultiplier: "THE GRAND MULTIPLIER. The rarest title in KidQuest. You earned it.",
  reviewWrong: "These facts are going back into training. That's how champions improve.",
  dailyStreak: (d) => `Day ${d} in a row! Your brain is getting faster every single day.`,
};
