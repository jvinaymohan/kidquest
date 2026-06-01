/** Everyday science topics — short lessons + mini-quizzes. */
export const SCIENCE_TOPICS = [
  {
    id: "sky",
    title: "Sky & Space",
    emoji: "🌤️",
    color: "#3A86FF",
    accent: "#E6F1FB",
    lesson: {
      text: "The sky changes all day! Blue by day, stars at night. Clouds are made of tiny water drops. The Sun is a star that gives us light and warmth.",
      funFact: "Lightning is hotter than the surface of the Sun!",
    },
    questions: [
      { type: "choice", prompt: "What color is the sky on a sunny day?", options: ["Blue", "Green", "Purple"], answer: "Blue" },
      { type: "yes-no", prompt: "Can you see stars at night?", answer: "yes" },
      { type: "choice", prompt: "Clouds are made of...", options: ["Water drops", "Cotton", "Smoke"], answer: "Water drops" },
      { type: "choice", prompt: "The Sun is a...", options: ["Star", "Planet", "Moon"], answer: "Star" },
    ],
  },
  {
    id: "plants",
    title: "Plants & Trees",
    emoji: "🌱",
    color: "#2A9D8F",
    accent: "#E1F5EE",
    lesson: {
      text: "Plants need sunlight, water, and soil to grow. They make oxygen — the air we breathe! Trees are the biggest plants and homes for birds and bugs.",
      funFact: "Some bamboo can grow almost a meter in one day!",
    },
    questions: [
      { type: "choice", prompt: "Plants need sunlight, water, and...", options: ["Soil", "Candy", "TV"], answer: "Soil" },
      { type: "yes-no", prompt: "Do plants make oxygen?", answer: "yes" },
      { type: "choice", prompt: "The biggest plants are...", options: ["Trees", "Moss", "Grass"], answer: "Trees" },
      { type: "choice", prompt: "Green leaves use sunlight to make...", options: ["Food", "Rocks", "Plastic"], answer: "Food" },
    ],
  },
  {
    id: "body",
    title: "Your Amazing Body",
    emoji: "🫀",
    color: "#E63946",
    accent: "#FFE5E7",
    lesson: {
      text: "Your heart pumps blood all day. Your brain helps you think, learn, and dream. Bones hold you up — and muscles help you move and play!",
      funFact: "Your nose can remember 50,000 different smells!",
    },
    questions: [
      { type: "choice", prompt: "What pumps blood through your body?", options: ["Heart", "Stomach", "Elbow"], answer: "Heart" },
      { type: "choice", prompt: "You think with your...", options: ["Brain", "Toes", "Hair"], answer: "Brain" },
      { type: "yes-no", prompt: "Do muscles help you move?", answer: "yes" },
      { type: "choice", prompt: "Bones help you...", options: ["Stand up", "Fly", "Glow"], answer: "Stand up" },
    ],
  },
  {
    id: "weather",
    title: "Weather Wonders",
    emoji: "⛈️",
    color: "#457B9D",
    accent: "#E8F4FA",
    lesson: {
      text: "Weather is what's happening outside right now — sunny, rainy, windy, or snowy. A rainbow appears when sunlight hits raindrops!",
      funFact: "Snowflakes always have six sides — no two are exactly alike!",
    },
    questions: [
      { type: "choice", prompt: "Rain comes from...", options: ["Clouds", "Rocks", "Cars"], answer: "Clouds" },
      { type: "yes-no", prompt: "Can wind move things?", answer: "yes" },
      { type: "choice", prompt: "A rainbow needs sunlight and...", options: ["Rain", "Sand", "Fire"], answer: "Rain" },
      { type: "choice", prompt: "Weather tells us what's happening...", options: ["Outside", "Underground", "In space"], answer: "Outside" },
    ],
  },
  {
    id: "animals",
    title: "Animal Kingdom",
    emoji: "🦁",
    color: "#F4A261",
    accent: "#FEF3E8",
    lesson: {
      text: "Animals live everywhere — land, sea, and sky! Mammals have fur and feed milk to babies. Birds have feathers and lay eggs. Fish breathe with gills underwater.",
      funFact: "A group of flamingos is called a flamboyance!",
    },
    questions: [
      { type: "choice", prompt: "Birds have...", options: ["Feathers", "Scales", "Leaves"], answer: "Feathers" },
      { type: "choice", prompt: "Fish breathe with...", options: ["Gills", "Lungs", "Noses"], answer: "Gills" },
      { type: "yes-no", prompt: "Do mammals feed milk to babies?", answer: "yes" },
      { type: "choice", prompt: "Dolphins live in the...", options: ["Ocean", "Desert", "Sky"], answer: "Ocean" },
    ],
  },
  {
    id: "kitchen",
    title: "Kitchen Science",
    emoji: "🧪",
    color: "#9B5DE5",
    accent: "#F0EBFF",
    lesson: {
      text: "Cooking is science! Heat changes food — ice melts, bread bakes, popcorn pops. Mixing baking soda and vinegar makes fizzy bubbles — that's a chemical reaction!",
      funFact: "Honey never spoils — archaeologists found edible honey in ancient Egyptian tombs!",
    },
    questions: [
      { type: "choice", prompt: "Ice melts when it gets...", options: ["Warmer", "Colder", "Darker"], answer: "Warmer" },
      { type: "yes-no", prompt: "Does popcorn pop with heat?", answer: "yes" },
      { type: "choice", prompt: "Baking soda + vinegar makes...", options: ["Bubbles", "Silence", "Rocks"], answer: "Bubbles" },
      { type: "choice", prompt: "Cooking changes food using...", options: ["Heat", "Wind", "Shadows"], answer: "Heat" },
    ],
  },
];

export function getScienceTopic(id) {
  return SCIENCE_TOPICS.find((t) => t.id === id);
}
