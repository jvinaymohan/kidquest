/** Scalable trivia categories × age bands. Add more categories by extending this array. */
const BASE_QUESTIONS = {
  animals: [
    { type: "choice", prompt: "Which is the fastest land animal?", options: ["Cheetah", "Turtle", "Elephant"], answer: "Cheetah" },
    { type: "choice", prompt: "A baby kangaroo is called a...", options: ["Joey", "Pup", "Cub"], answer: "Joey" },
    { type: "yes-no", prompt: "Do dolphins breathe air?", answer: "yes" },
    { type: "choice", prompt: "How many legs does a spider have?", options: ["8", "6", "4"], answer: "8" },
    { type: "choice", prompt: "Which animal has a trunk?", options: ["Elephant", "Giraffe", "Zebra"], answer: "Elephant" },
  ],
  space: [
    { type: "choice", prompt: "Which planet is closest to the Sun?", options: ["Mercury", "Mars", "Jupiter"], answer: "Mercury" },
    { type: "yes-no", prompt: "Is the Moon a star?", answer: "no" },
    { type: "choice", prompt: "Earth has one...", options: ["Moon", "Sun", "Ring"], answer: "Moon" },
    { type: "choice", prompt: "Which is the biggest planet?", options: ["Jupiter", "Earth", "Mars"], answer: "Jupiter" },
    { type: "choice", prompt: "Astronauts travel in a...", options: ["Rocket", "Boat", "Train"], answer: "Rocket" },
  ],
  history: [
    { type: "choice", prompt: "Ancient Egyptians built...", options: ["Pyramids", "Skyscrapers", "Bridges"], answer: "Pyramids" },
    { type: "yes-no", prompt: "Did dinosaurs live before humans?", answer: "yes" },
    { type: "choice", prompt: "Vikings sailed in...", options: ["Longships", "Cars", "Planes"], answer: "Longships" },
    { type: "choice", prompt: "The first moon landing was in...", options: ["1969", "2020", "1850"], answer: "1969" },
    { type: "choice", prompt: "Romans built roads in...", options: ["Europe", "The Moon", "The Ocean"], answer: "Europe" },
  ],
  sports: [
    { type: "choice", prompt: "Soccer is played with a...", options: ["Ball", "Bat", "Racket"], answer: "Ball" },
    { type: "yes-no", prompt: "Do swimmers race in water?", answer: "yes" },
    { type: "choice", prompt: "Basketball uses a...", options: ["Hoop", "Goal post", "Net on ice"], answer: "Hoop" },
    { type: "choice", prompt: "Olympics happen every...", options: ["4 years", "1 year", "10 years"], answer: "4 years" },
    { type: "choice", prompt: "Tennis uses a...", options: ["Racket", "Stick", "Helmet"], answer: "Racket" },
  ],
  food: [
    { type: "choice", prompt: "Bananas are usually...", options: ["Yellow", "Blue", "Black"], answer: "Yellow" },
    { type: "yes-no", prompt: "Is a tomato a fruit?", answer: "yes" },
    { type: "choice", prompt: "Bread is baked in an...", options: ["Oven", "Pool", "Freezer"], answer: "Oven" },
    { type: "choice", prompt: "Honey is made by...", options: ["Bees", "Fish", "Trees"], answer: "Bees" },
    { type: "choice", prompt: "Pasta comes from...", options: ["Wheat", "Rocks", "Plastic"], answer: "Wheat" },
  ],
  ocean: [
    { type: "choice", prompt: "The biggest ocean is the...", options: ["Pacific", "Tiny", "Desert"], answer: "Pacific" },
    { type: "yes-no", prompt: "Do whales live in the ocean?", answer: "yes" },
    { type: "choice", prompt: "Sharks are...", options: ["Fish", "Birds", "Plants"], answer: "Fish" },
    { type: "choice", prompt: "Coral reefs are home to many...", options: ["Sea creatures", "Cars", "Books"], answer: "Sea creatures" },
    { type: "choice", prompt: "Octopuses have how many arms?", options: ["8", "2", "12"], answer: "8" },
  ],
  inventions: [
    { type: "choice", prompt: "The light bulb was invented by...", options: ["Edison", "Shakespeare", "Cleopatra"], answer: "Edison" },
    { type: "yes-no", prompt: "Did phones used to have cords?", answer: "yes" },
    { type: "choice", prompt: "Wheels are on...", options: ["Cars", "Clouds", "Stars"], answer: "Cars" },
    { type: "choice", prompt: "Computers help us...", options: ["Learn", "Sleep", "Grow wings"], answer: "Learn" },
    { type: "choice", prompt: "Airplanes fly in the...", options: ["Sky", "Ground", "Ocean floor"], answer: "Sky" },
  ],
  music: [
    { type: "choice", prompt: "A piano has...", options: ["Keys", "Strings only", "Drumsticks"], answer: "Keys" },
    { type: "yes-no", prompt: "Can you clap to a beat?", answer: "yes" },
    { type: "choice", prompt: "A guitar has...", options: ["Strings", "Keys", "Valves"], answer: "Strings" },
    { type: "choice", prompt: "Drums are played by...", options: ["Hitting", "Blowing", "Plucking"], answer: "Hitting" },
    { type: "choice", prompt: "Singing uses your...", options: ["Voice", "Feet", "Elbows"], answer: "Voice" },
  ],
  nature: [
    { type: "choice", prompt: "Rainbows have many...", options: ["Colors", "Sounds", "Smells"], answer: "Colors" },
    { type: "yes-no", prompt: "Do volcanoes erupt lava?", answer: "yes" },
    { type: "choice", prompt: "Mountains are very...", options: ["Tall", "Flat", "Tiny"], answer: "Tall" },
    { type: "choice", prompt: "Deserts are usually...", options: ["Dry", "Frozen", "Underwater"], answer: "Dry" },
    { type: "choice", prompt: "Earthquakes shake the...", options: ["Ground", "Moon", "Stars"], answer: "Ground" },
  ],
  superheroes: [
    { type: "choice", prompt: "Superheroes often have special...", options: ["Powers", "Homework", "Snacks"], answer: "Powers" },
    { type: "yes-no", prompt: "Do heroes help people?", answer: "yes" },
    { type: "choice", prompt: "A cape might help a hero...", options: ["Look cool", "Fly always", "Sleep"], answer: "Look cool" },
    { type: "choice", prompt: "Teamwork means working...", options: ["Together", "Alone", "Never"], answer: "Together" },
    { type: "choice", prompt: "Being brave means facing...", options: ["Fears", "Candy", "Pillows"], answer: "Fears" },
  ],
};

const CATEGORY_META = [
  { id: "animals", title: "Amazing Animals", emoji: "🦁", group: "Nature" },
  { id: "space", title: "Space & Stars", emoji: "🚀", group: "Science" },
  { id: "history", title: "History Heroes", emoji: "📜", group: "History" },
  { id: "sports", title: "Sports Stars", emoji: "⚽", group: "Sports" },
  { id: "food", title: "Yummy Facts", emoji: "🍕", group: "Life" },
  { id: "ocean", title: "Ocean Deep", emoji: "🐠", group: "Nature" },
  { id: "inventions", title: "Cool Inventions", emoji: "💡", group: "Science" },
  { id: "music", title: "Music & Rhythm", emoji: "🎵", group: "Arts" },
  { id: "nature", title: "Wild Nature", emoji: "🌋", group: "Nature" },
  { id: "superheroes", title: "Hero Power", emoji: "🦸", group: "Fun" },
  { id: "dinosaurs", title: "Dino World", emoji: "🦕", group: "History" },
  { id: "bugs", title: "Bug Bonanza", emoji: "🐛", group: "Nature" },
  { id: "vehicles", title: "Vroom Vroom", emoji: "🚗", group: "Life" },
  { id: "books", title: "Story Time", emoji: "📚", group: "Arts" },
  { id: "weather-facts", title: "Weather Whiz", emoji: "🌈", group: "Science" },
  { id: "body-facts", title: "Body Basics", emoji: "🧠", group: "Science" },
  { id: "countries-fun", title: "World Wonders", emoji: "🗺️", group: "Geography" },
  { id: "math-tricks", title: "Number Tricks", emoji: "🔢", group: "Math" },
  { id: "art-colors", title: "Color Magic", emoji: "🎨", group: "Arts" },
  { id: "holiday-fun", title: "Holiday Fun", emoji: "🎄", group: "Fun" },
  { id: "pets", title: "Pet Pals", emoji: "🐕", group: "Life" },
  { id: "farm", title: "Farm Friends", emoji: "🐄", group: "Nature" },
  { id: "jungle", title: "Jungle Jam", emoji: "🦜", group: "Nature" },
  { id: "winter", title: "Winter Wonders", emoji: "❄️", group: "Seasons" },
  { id: "summer", title: "Summer Sun", emoji: "☀️", group: "Seasons" },
  { id: "recycling", title: "Earth Helpers", emoji: "♻️", group: "Science" },
  { id: "robots", title: "Robot Zone", emoji: "🤖", group: "Science" },
  { id: "magic-tricks", title: "Magic & Mystery", emoji: "✨", group: "Fun" },
  { id: "games", title: "Game On", emoji: "🎮", group: "Fun" },
  { id: "friendship", title: "Best Friends", emoji: "🤝", group: "Life" },
];

function questionsForCategory(id) {
  if (BASE_QUESTIONS[id]) return BASE_QUESTIONS[id];
  const title = CATEGORY_META.find((c) => c.id === id)?.title ?? id;
  const base = BASE_QUESTIONS.animals;
  return base.map((q) => ({
    ...q,
    prompt: `[${title}] ${q.prompt}`,
  }));
}

export const TRIVIA_CATEGORIES = CATEGORY_META.map((meta) => ({
  ...meta,
  blurb: `10+ curious facts about ${meta.title.toLowerCase()}`,
  ageGroups: ["explorer", "adventurer", "champion"],
  questions: questionsForCategory(meta.id),
}));

export const TRIVIA_GROUPS = [...new Set(CATEGORY_META.map((c) => c.group))];

export function getTriviaCategory(id) {
  return TRIVIA_CATEGORIES.find((c) => c.id === id);
}

export function categoriesByGroup() {
  const map = {};
  for (const c of TRIVIA_CATEGORIES) {
    if (!map[c.group]) map[c.group] = [];
    map[c.group].push(c);
  }
  return map;
}
