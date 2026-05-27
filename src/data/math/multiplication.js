function mulQuestions(tables, count, rngSeed) {
  const qs = [];
  let seed = 0;
  for (const ch of rngSeed) seed = (seed * 31 + ch.charCodeAt(0)) | 0;
  const rand = () => {
    seed = (seed * 1103515245 + 12345) & 0x7fffffff;
    return seed / 0x7fffffff;
  };
  for (let i = 0; i < count; i++) {
    const a = tables[Math.floor(rand() * tables.length)];
    const b = tables[Math.floor(rand() * tables.length)];
    const product = a * b;
    const wrong = new Set();
    while (wrong.size < 3) {
      const w = product + Math.floor(rand() * 7) - 3;
      if (w > 0 && w !== product) wrong.add(w);
    }
    const options = [...wrong, product].sort(() => rand() - 0.5);
    qs.push({
      type: "choice",
      prompt: `What is ${a} × ${b}?`,
      options: options.map(String),
      answer: String(product),
    });
  }
  return qs;
}

export const MULTIPLICATION_LESSONS = {
  explorer: [
    {
      id: "math-mul-exp-001",
      title: "Times 2",
      track: "multiplication",
      concept: {
        text: "Multiplying by 2 is like doubling! 2 × 3 means two groups of three.",
        emoji: "✖️",
        funFact: "Your shoes come in pairs — that's times 2!",
      },
      questions: mulQuestions([2], 5, "mul-exp-2"),
    },
    {
      id: "math-mul-exp-002",
      title: "Times 3",
      track: "multiplication",
      concept: {
        text: "Times 3 means three equal groups. 3 × 4 = 12!",
        emoji: "3️⃣",
        funFact: "A triangle has 3 sides — great for counting in threes!",
      },
      questions: mulQuestions([3], 5, "mul-exp-3"),
    },
    {
      id: "math-mul-exp-003",
      title: "Times 5",
      track: "multiplication",
      concept: {
        text: "The 5 times table is easy — count by fives on your fingers!",
        emoji: "🖐️",
        funFact: "Each hand has 5 fingers. Two hands = 10!",
      },
      questions: mulQuestions([5], 5, "mul-exp-5"),
    },
  ],
  adventurer: [
    {
      id: "math-mul-adv-001",
      title: "Multiply 2–6",
      track: "multiplication",
      concept: {
        text: "Practice times tables from 2 through 6. Groups of numbers add up fast!",
        emoji: "🧮",
        funFact: "Knowing times tables saves time in real life — cooking, sports, money!",
      },
      questions: mulQuestions([2, 3, 4, 5, 6], 6, "mul-adv-mix"),
    },
    {
      id: "math-mul-adv-002",
      title: "Multiply Mix",
      track: "multiplication",
      concept: {
        text: "Mix it up! Any table from 2 to 6 can show up.",
        emoji: "🎯",
        funFact: "6 × 7 = 42 — a famous number in stories!",
      },
      questions: mulQuestions([2, 3, 4, 5, 6], 6, "mul-adv-mix2"),
    },
  ],
  champion: [
    {
      id: "math-mul-champ-001",
      title: "Full Times Tables",
      track: "multiplication",
      concept: {
        text: "Master 2 through 12. These numbers show up everywhere — recipes, games, and yes, school too!",
        emoji: "🏆",
        funFact: "12 × 12 = 144 — that's a gross in old counting!",
      },
      questions: mulQuestions([2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], 8, "mul-champ-full"),
    },
    {
      id: "math-mul-champ-002",
      title: "Multiplication Word Problems",
      track: "multiplication",
      concept: {
        text: "Real life uses multiplication: '4 bags with 6 apples each' means 4 × 6.",
        emoji: "🍎",
        funFact: "Arrays (rows and columns) are how computers think about multiplication!",
      },
      questions: [
        {
          type: "choice",
          prompt: "4 boxes with 8 crayons each. How many crayons?",
          options: ["32", "12", "24", "40"],
          answer: "32",
        },
        {
          type: "choice",
          prompt: "7 teams of 5 players. How many players?",
          options: ["35", "12", "30", "25"],
          answer: "35",
        },
        {
          type: "choice",
          prompt: "9 shelves with 6 books. How many books?",
          options: ["54", "15", "45", "63"],
          answer: "54",
        },
        {
          type: "choice",
          prompt: "3 packs of 11 stickers. How many stickers?",
          options: ["33", "14", "22", "30"],
          answer: "33",
        },
        {
          type: "fill",
          prompt: "6 × 8 = ?",
          answer: "48",
        },
        {
          type: "choice",
          prompt: "12 × 11 = ?",
          options: ["132", "121", "144", "111"],
          answer: "132",
        },
      ],
    },
  ],
};
