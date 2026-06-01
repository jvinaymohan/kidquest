/**
 * Curiosity Hub seed content — rule-based, kid-safe, no live news.
 * All cards include the 8 module fields for detail views.
 */

const ageCopy = (summary, whyItMatters, learn) => ({ summary, whyItMatters, learn });

/** Shared quiz/activity builders for shorter seed cards */
function miniQuiz(items) {
  return items;
}

export const CURIOSITY_CARDS = [
  // ─── FULL SAMPLE: Spring birds (daily) ───
  {
    id: "spark-2026-03-15-spring-birds",
    type: "daily",
    title: "Why are birds singing louder?",
    hook: "Spring is a concert in the trees — here's what's happening.",
    ageBands: ["5-7", "8-10", "11-13"],
    ageContent: {
      "5-7": ageCopy(
        "In spring, many birds sing to say hello and find friends. The days get longer and warmer, so birds have more energy to chirp!",
        "Bird songs help families know who is nearby. It's nature's way of saying spring is here.",
        "Animals change behavior with seasons. Listening helps you notice the world waking up."
      ),
      "8-10": ageCopy(
        "When spring arrives, birds sing more because longer days and warmer weather signal a good time to find mates and claim cozy nesting spots.",
        "Bird calls aren't random noise — they're messages. Scientists study songs to learn how birds share space peacefully.",
        "Seasons affect living things. Observing patterns is how naturalists and scientists make discoveries."
      ),
      "11-13": ageCopy(
        "Spring dawn choruses happen because photoperiod (day length) triggers hormones that boost singing, territory defense, and courtship in many songbirds.",
        "Understanding bird behavior helps conservation — healthy bird communities often mean healthy ecosystems for all of us.",
        "Ethology is the study of animal behavior. Field notes and careful listening are real research skills."
      ),
    },
    topics: ["science", "seasonal"],
    region: ["US", "global"],
    sensitivity: "gentle",
    visual: { emoji: "🐦", gradient: "from-[#a8e6cf] to-[#88d8b0]" },
    seasons: ["spring"],
    schoolPeriods: ["in-session", "spring-break"],
    learnMore: [
      { title: "Dawn chorus", body: "Many birds sing most at sunrise. Light and temperature cue their internal clocks." },
      { title: "Nesting season", body: "Birds pick safe spots for eggs. They may visit the same area each year." },
      { title: "Migration", body: "Some birds flew far to get here. Spring is their reunion with northern homes." },
    ],
    tryItYourself: {
      title: "Bird listening walk",
      steps: [
        "Stand quietly outside for 2 minutes — no talking.",
        "Count how many different chirps you hear.",
        "Sketch or describe one sound in a notebook.",
        "Ask a grown-up when birds are loudest near your home.",
      ],
    },
    quiz: miniQuiz([
      {
        question: "Why do many birds sing more in spring?",
        options: ["Longer days and nesting season", "They learn new songs from TV", "It rains less so they are bored"],
        answer: "Longer days and nesting season",
        explanation: "Light and warmth cue birds to sing for territory and mates.",
      },
      {
        question: "A dawn chorus mostly happens at…",
        options: ["Sunrise", "Midnight", "Only in winter"],
        answer: "Sunrise",
        explanation: "Many species sing most when the day begins.",
      },
    ]),
    askGrownUp: [
      "What birds do we hear most near our home?",
      "Have you noticed spring changing since you were a kid?",
      "How could we help birds (water, native plants, quiet mornings)?",
    ],
    activeFrom: "2026-03-01",
    activeUntil: "2026-05-31",
    priority: 2,
  },

  // ─── FULL SAMPLE: Olympics spirit (weekly) ───
  {
    id: "weekly-2026-02-olympics-spirit",
    type: "weekly",
    title: "The spirit of friendly games",
    hook: "Athletes from around the world gather to try their best — together.",
    ageBands: ["5-7", "8-10", "11-13"],
    ageContent: {
      "5-7": ageCopy(
        "Big sports festivals bring athletes from many countries. They play hard, cheer for each other, and celebrate trying your best.",
        "Seeing people cooperate across languages reminds us we're one big human family.",
        "Practice, teamwork, and kindness matter as much as winning."
      ),
      "8-10": ageCopy(
        "International games like the Olympics highlight skill, dedication, and respect. Athletes train for years to perform on a world stage.",
        "These events inspire kids to move, set goals, and appreciate cultures beyond their own hometown.",
        "Global events teach geography, history, and sportsmanship without needing scary headlines."
      ),
      "11-13": ageCopy(
        "Multi-sport festivals showcase peak performance and international cooperation. Traditions like the opening ceremony symbolize unity.",
        "Studying how athletes prepare connects biology, psychology, and fair play — useful lessons for school and life.",
        "Media literacy: celebrate effort and stories, not just medals. Ask who is represented and why it matters."
      ),
    },
    topics: ["sports", "culture"],
    region: ["US", "global"],
    sensitivity: "standard",
    visual: { emoji: "🏅", gradient: "from-[#ffd89b] to-[#19547b]" },
    sportsMoments: ["winter-games-season"],
    learnMore: [
      { title: "Rings & symbols", body: "Five interlocking rings represent continents joining in friendship." },
      { title: "New sports", body: "Organizers sometimes add sports young people love, like skateboarding or climbing." },
      { title: "Paralympics", body: "Athletes with disabilities compete at elite levels — same spirit, different categories." },
    ],
    tryItYourself: {
      title: "Mini family games",
      steps: [
        "Pick three silly events (sock slide, book balance, paper plane).",
        "Make a simple bracket on paper — see sportsBracket below in app.",
        "Everyone cheers for good tries, not only first place.",
        "Take a team photo with homemade medals.",
      ],
    },
    quiz: miniQuiz([
      {
        question: "Olympic rings mainly stand for…",
        options: ["Friendship across continents", "Favorite candy flavors", "Only winter sports"],
        answer: "Friendship across continents",
        explanation: "The rings symbolize unity, not a scoreboard.",
      },
      {
        question: "A healthy way to watch sports is to…",
        options: ["Celebrate effort and respect", "Only care about arguments", "Ignore all rules"],
        answer: "Celebrate effort and respect",
        explanation: "Sportsmanship means honoring players and fair play.",
      },
    ]),
    askGrownUp: [
      "What's a sport you'd love to try after watching athletes?",
      "How do teams show respect when they lose?",
      "Which country would you like to learn about through its athletes?",
    ],
    sportsBracket: {
      title: "Family fun bracket",
      rounds: [
        { label: "Round 1", matchups: ["Sock slide vs Book balance", "Paper plane vs Dance freeze"] },
        { label: "Final", matchups: ["Winners face off!"] },
      ],
    },
    activeFrom: "2026-01-15",
    activeUntil: "2026-03-15",
    priority: 3,
  },

  // ─── FULL SAMPLE: Space movie wonder (daily) ───
  {
    id: "spark-2026-06-space-movie-wonder",
    type: "daily",
    title: "How movies imagine distant worlds",
    hook: "Filmmakers mix real science with creativity — can you spot the difference?",
    ageBands: ["8-10", "11-13"],
    ageContent: {
      "8-10": ageCopy(
        "Space adventure movies use special effects to show planets, rockets, and aliens. Designers read about real space, then add imagination for drama.",
        "Movies can spark interest in astronomy and engineering. Knowing what's real helps you enjoy stories even more.",
        "Compare fiction with facts — a skill scientists use every day."
      ),
      "11-13": ageCopy(
        "Sci-fi films consult scientists for plausible orbits, spacesuits, and lighting. Directors still bend rules for emotion and pacing.",
        "Separating entertainment from evidence is media literacy — useful for science news, ads, and social posts too.",
        "Art and STEM together inspire careers in VFX, aerospace, and storytelling."
      ),
    },
    topics: ["movie", "science"],
    region: ["US", "global"],
    sensitivity: "gentle",
    visual: { emoji: "🎬", gradient: "from-[#667eea] to-[#764ba2]" },
    learnMore: [
      { title: "Real exoplanets", body: "Telescopes have found thousands of planets orbiting other stars — no warp drive needed to study them!" },
      { title: "Sound in space", body: "Space is mostly empty, so sound doesn't travel like in air. Movies add whooshes for excitement." },
      { title: "Spacesuit facts", body: "Real suits recycle air and protect from radiation and temperature swings." },
    ],
    tryItYourself: {
      title: "Fact or fiction card",
      steps: [
        "Watch a short space clip (with a grown-up).",
        "Write two statements — one true, one movie-magic.",
        "Challenge a friend or sibling to guess which is which.",
        "Look up one real space mission online together.",
      ],
    },
    quiz: miniQuiz([
      {
        question: "Sound in real space mostly…",
        options: ["Doesn't travel like in air", "Is louder than on Earth", "Only works underwater"],
        answer: "Doesn't travel like in air",
        explanation: "Vacuum lacks air molecules to carry sound waves.",
      },
      {
        question: "Movie designers often…",
        options: ["Blend real science with story", "Ignore all physics always", "Film on real Mars every time"],
        answer: "Blend real science with story",
        explanation: "Consultants help balance accuracy and excitement.",
      },
    ]),
    askGrownUp: [
      "What's a space movie you loved as a kid?",
      "How can we tell if a science claim online is trustworthy?",
      "Would you rather design planets or build rockets?",
    ],
    timeline: [
      { year: "1969", label: "Moon landing", detail: "Humans first walked on the Moon — real history!" },
      { year: "1990s", label: "CGI boom", detail: "Computers helped filmmakers build imaginary worlds." },
      { year: "Today", label: "James Webb", detail: "A telescope showing real distant galaxies." },
    ],
    activeFrom: "2026-06-01",
    activeUntil: "2026-08-31",
    priority: 1,
  },

  // ─── FULL SAMPLE: March spring science (monthly) ───
  {
    id: "monthly-2026-03-spring-science",
    type: "monthly",
    title: "March: Waking up the natural world",
    hook: "This month, tiny changes add up to a greener, busier planet.",
    ageBands: ["5-7", "8-10", "11-13"],
    ageContent: {
      "5-7": ageCopy(
        "March is when many places get warmer. Flowers peek up, bugs buzz, and baby animals are born.",
        "Noticing small changes teaches patience — nature doesn't rush, but it always moves forward.",
        "You can be a scientist just by watching the same tree or puddle each week."
      ),
      "8-10": ageCopy(
        "Equinox means day and night are nearly equal. More sunlight powers photosynthesis in plants — the base of most food chains.",
        "Spring is a great time for experiments: measure sprout height, track rainfall, compare soil temperatures.",
        "Data over time reveals patterns climate scientists also study."
      ),
      "11-13": ageCopy(
        "March bridges winter and growth seasons. Phenology is the study of cyclic natural events — first bloom, frog calls, maple sap.",
        "Citizen science apps let families log local observations that help researchers map shifting seasons.",
        "Understanding ecosystems prepares you to protect pollinators, wetlands, and biodiversity."
      ),
    },
    topics: ["science", "seasonal"],
    region: ["US", "global"],
    sensitivity: "gentle",
    visual: { emoji: "🌷", gradient: "from-[#f093fb] to-[#f5576c]" },
    seasons: ["spring"],
    learnMore: [
      { title: "Equinox", body: "Around March 20 (Northern Hemisphere), day and night lengths match." },
      { title: "Pollinators", body: "Bees and butterflies help plants make seeds." },
      { title: "Sap & growth", body: "Some trees move sugary sap upward as days lengthen." },
    ],
    tryItYourself: {
      title: "Phenology journal",
      steps: [
        "Pick one plant or tree to observe all month.",
        "Each week, note color, size, insects, or birds nearby.",
        "Snap a photo or draw what you see.",
        "At month's end, tell the story of how it changed.",
      ],
    },
    quiz: miniQuiz([
      {
        question: "Photosynthesis needs mostly…",
        options: ["Sunlight, water, CO₂", "Only candy", "Darkness all month"],
        answer: "Sunlight, water, CO₂",
        explanation: "Plants use light energy to make sugars and oxygen.",
      },
      {
        question: "Phenology studies…",
        options: ["Timing of natural events", "Only dinosaur bones", "How to build robots"],
        answer: "Timing of natural events",
        explanation: "Think first bloom, migration, or frog chorus.",
      },
    ]),
    askGrownUp: [
      "What signs of spring did you notice growing up?",
      "Can we plant something native for pollinators?",
      "How has spring timing changed in our area?",
    ],
    map: {
      title: "Spring arrives at different times",
      regions: [
        { name: "Southern US", note: "Warmer earlier — flowers in February sometimes." },
        { name: "Northern US", note: "Snow may melt later; spring peaks in April–May." },
        { name: "Southern Hemisphere", note: "March is autumn there — opposite season!" },
      ],
    },
    activeFrom: "2026-03-01",
    activeUntil: "2026-03-31",
    priority: 4,
  },

  // ─── Additional seed cards (variety for selection) ───
  {
    id: "spark-winter-constellations",
    type: "daily",
    title: "Connect-the-dots in the night sky",
    hook: "Long winter nights are perfect for stargazing stories.",
    ageBands: ["5-7", "8-10", "11-13"],
    ageContent: {
      "5-7": ageCopy("Stars look like tiny lights. People imagined pictures by connecting bright stars — constellations!", "Stories helped travelers find directions before phones.", "The sky is a map if you learn a few patterns."),
      "8-10": ageCopy("Constellations are patterns, not real groups — stars are far apart in 3D.", "Orion's Belt is easy to spot in winter skies over many regions.", "Astronomy starts with looking up consistently."),
      "11-13": ageCopy("Earth's rotation makes stars appear to move. Light pollution affects how many stars you see.", "Ancient cultures named the same shapes differently — culture shapes science communication.", "Stargazing builds patience and spatial reasoning."),
    },
    topics: ["science", "seasonal"],
    region: ["US", "global"],
    sensitivity: "gentle",
    visual: { emoji: "✨", gradient: "from-[#1a1a2e] to-[#4a4e9f]" },
    seasons: ["winter"],
    learnMore: [{ title: "Orion", body: "A hunter shape with a famous three-star belt." }],
    tryItYourself: { title: "Star map", steps: ["Go outside after dark with a grown-up.", "Find three bright stars in a row.", "Draw them on paper and name your own constellation."] },
    quiz: miniQuiz([{ question: "Constellations are…", options: ["Patterns we imagine", "Stars glued together", "Only visible in daytime"], answer: "Patterns we imagine", explanation: "Stars in a constellation are usually very far apart." }]),
    askGrownUp: ["Do you know any constellation stories from your childhood?"],
    activeFrom: "2025-11-01",
    activeUntil: "2026-02-28",
  },
  {
    id: "spark-summer-pollinator-picnic",
    type: "daily",
    title: "Who's invited to the flower picnic?",
    hook: "Bees and butterflies are busy chefs for the plant world.",
    ageBands: ["5-7", "8-10", "11-13"],
    ageContent: {
      "5-7": ageCopy("Bees visit flowers for nectar and carry pollen like glitter between blooms.", "Pollinators help fruits and veggies grow.", "Small creatures do huge jobs."),
      "8-10": ageCopy("Pollination moves pollen so plants can make seeds. One in three bites of food connects to pollinators.", "Habitat gardens support local biodiversity.", "Ecosystem roles link biology and nutrition."),
      "11-13": ageCopy("Mutualism benefits both partners — flowers offer nectar; pollinators assist reproduction.", "Colony health and pesticide reduction are community science topics.", "Agriculture depends on managed and wild pollinators."),
    },
    topics: ["science", "seasonal"],
    region: ["US", "global"],
    sensitivity: "gentle",
    visual: { emoji: "🐝", gradient: "from-[#ffecd2] to-[#fcb69f]" },
    seasons: ["summer"],
    learnMore: [{ title: "Butterfly life cycle", body: "Egg → caterpillar → chrysalis → adult." }],
    tryItYourself: { title: "Pollinator spotter", steps: ["Sit by flowers 5 minutes.", "Tally bees vs butterflies.", "Plant herbs if you have space."] },
    quiz: miniQuiz([{ question: "Pollen helps plants…", options: ["Make seeds", "Grow rocks", "Change color instantly"], answer: "Make seeds", explanation: "Pollination is part of plant reproduction." }]),
    askGrownUp: ["Could we add one pollinator-friendly plant?"],
    activeFrom: "2026-06-01",
    activeUntil: "2026-09-30",
  },
  {
    id: "weekly-fall-harvest-fest",
    type: "weekly",
    title: "Celebrating harvest & gratitude",
    hook: "Communities mark the season when farmers gather ripe crops.",
    ageBands: ["5-7", "8-10", "11-13"],
    ageContent: {
      "5-7": ageCopy("Fall festivals thank growers for food like apples and pumpkins.", "Sharing food connects neighbors.", "Gratitude is a habit you can practice."),
      "8-10": ageCopy("Harvest festivals appear worldwide with music, food, and crafts.", "Understanding food sources supports healthy choices.", "Culture and agriculture intertwine."),
      "11-13": ageCopy("Seasonal economies once depended on stored harvests before refrigeration.", "Comparing traditions builds anthropological thinking.", "Food miles and local farms are modern geography topics."),
    },
    topics: ["seasonal", "culture"],
    region: ["US", "global"],
    sensitivity: "gentle",
    visual: { emoji: "🎃", gradient: "from-[#f7971e] to-[#ffd200]" },
    seasons: ["fall"],
    learnMore: [{ title: "Apple orchards", body: "Cool nights help apples turn sweet and colorful." }],
    tryItYourself: { title: "Gratitude jar", steps: ["Write three things you're thankful for.", "Read them at dinner.", "Add one new note each week."] },
    quiz: miniQuiz([{ question: "Harvest festivals often celebrate…", options: ["Food and community", "Only video games", "Ignoring farmers"], answer: "Food and community", explanation: "Many cultures thank people who grow food." }]),
    askGrownUp: ["What fall tradition does our family enjoy?"],
    activeFrom: "2026-09-01",
    activeUntil: "2026-11-30",
  },
  {
    id: "spark-basketball-teamwork",
    type: "daily",
    title: "Why teams pass the ball",
    hook: "Sharing the game can beat hogging the spotlight.",
    ageBands: ["8-10", "11-13"],
    ageContent: {
      "8-10": ageCopy("Basketball teams pass to find the best shot. Everyone practices different skills.", "Teamwork beats one person trying alone every time.", "Cooperation shows up in school projects too."),
      "11-13": ageCopy("Spacing, assists, and defense roles show systems thinking.", "Coaches design plays — similar to planning group work.", "Sports analytics count passes that lead to scores."),
    },
    topics: ["sports"],
    region: ["US", "global"],
    sensitivity: "standard",
    visual: { emoji: "🏀", gradient: "from-[#f46b45] to-[#eea849]" },
    sportsMoments: ["basketball-finals-season"],
    learnMore: [{ title: "Assist", body: "A pass that helps a teammate score." }],
    tryItYourself: { title: "Passing challenge", steps: ["With a friend, pass a ball ten times before a shot.", "Celebrate assists, not only baskets."] },
    quiz: miniQuiz([{ question: "Passing helps because…", options: ["It finds better chances", "It ends the game", "It ignores teammates"], answer: "It finds better chances", explanation: "Teams share opportunities." }]),
    askGrownUp: ["Tell me about a team you admired — what made them kind?"],
    activeFrom: "2026-03-01",
    activeUntil: "2026-04-30",
  },
  {
    id: "weekly-2026-06-ocean-wonders",
    type: "weekly",
    title: "Secrets of the shallow sea",
    hook: "Tide pools are tiny worlds — who lives between the waves?",
    ageBands: ["5-7", "8-10", "11-13"],
    ageContent: {
      "5-7": ageCopy("Tide pools hold starfish, snails, and seaweed when the ocean steps back.", "Coasts are homes for amazing creatures.", "Look closely — small places hide big wonders."),
      "8-10": ageCopy("Intertidal zones change twice a day with tides. Animals adapt to wet and dry hours.", "Oceans produce much of Earth's oxygen via plankton.", "Marine biology starts at the beach."),
      "11-13": ageCopy("Salinity, wave energy, and temperature shape coastal ecosystems.", "Citizen scientists track species shifts as climates warm.", "Protecting coasts helps fisheries and tourism communities."),
    },
    topics: ["science", "seasonal"],
    region: ["US", "global"],
    sensitivity: "gentle",
    visual: { emoji: "🌊", gradient: "from-[#2193b0] to-[#6dd5ed]" },
    seasons: ["summer"],
    learnMore: [{ title: "Tides", body: "The Moon's gravity helps pull ocean water up and down." }],
    tryItYourself: { title: "Shore sketch", steps: ["Visit a beach or look up tide pool photos.", "Draw three organisms and label them.", "Note one way each survives waves or drying out."] },
    quiz: miniQuiz([{ question: "Tide pools are found…", options: ["Between high and low tide", "Only in deserts", "On the Moon"], answer: "Between high and low tide", explanation: "They appear in the intertidal zone." }]),
    askGrownUp: ["Have you explored a coast? What did you notice?"],
    activeFrom: "2026-06-01",
    activeUntil: "2026-09-30",
    priority: 2,
  },
  {
    id: "monthly-2026-06-curious-summer",
    type: "monthly",
    title: "June: Questions under the sun",
    hook: "Long afternoons are perfect for wondering aloud.",
    ageBands: ["5-7", "8-10", "11-13"],
    ageContent: {
      "5-7": ageCopy("June brings picnics, lightning bugs, and late sunsets.", "Asking why keeps your brain growing all summer.", "Share questions at dinner."),
      "8-10": ageCopy("Summer solstice means the longest day in the Northern Hemisphere.", "Track shadows at noon each week — they change!", "Science is everywhere outdoors."),
      "11-13": ageCopy("Earth's tilt causes seasons — June solstice marks astronomical summer start.", "Design a question journal: observe, hypothesize, test safely.", "Curiosity fuels inventions."),
    },
    topics: ["seasonal", "science"],
    region: ["US", "global"],
    sensitivity: "gentle",
    visual: { emoji: "☀️", gradient: "from-[#f7971e] to-[#ffd200]" },
    seasons: ["summer"],
    learnMore: [{ title: "Solstice", body: "Around June 21, the North Pole tilts toward the Sun." }],
    tryItYourself: { title: "Question jar", steps: ["Write questions on slips of paper.", "Pull one at lunch.", "Research together for five minutes."] },
    quiz: miniQuiz([{ question: "Summer in the north happens because Earth is…", options: ["Tilted on its axis", "Square shaped", "Stopped spinning"], answer: "Tilted on its axis", explanation: "Tilt changes how direct sunlight is." }]),
    askGrownUp: ["What big question did you have at my age?"],
    activeFrom: "2026-06-01",
    activeUntil: "2026-06-30",
    priority: 3,
  },
  {
    id: "monthly-2026-07-summer-explorer",
    type: "monthly",
    title: "July: Explorer month",
    hook: "Long days mean more time to investigate the world nearby.",
    ageBands: ["5-7", "8-10", "11-13"],
    ageContent: {
      "5-7": ageCopy("Summer is for exploring parks, beaches, and backyards.", "Curiosity turns walks into adventures.", "Ask questions every day."),
      "8-10": ageCopy("Document discoveries in a field notebook.", "Maps and measurements turn play into science.", "Explorers respect nature — leave no trace."),
      "11-13": ageCopy("Design a micro-research project: question, observe, record, reflect.", "Local history and ecology are equally worth exploring.", "Share findings responsibly with friends."),
    },
    topics: ["seasonal", "science"],
    region: ["US", "global"],
    sensitivity: "gentle",
    visual: { emoji: "🧭", gradient: "from-[#00c6ff] to-[#0072ff]" },
    seasons: ["summer"],
    schoolPeriods: ["summer-break"],
    learnMore: [{ title: "Leave no trace", body: "Pack out trash and protect plants." }],
    tryItYourself: { title: "Five-senses walk", steps: ["Name something you see, hear, smell, touch, and (if safe) taste.", "Draw a map of your route."] },
    quiz: miniQuiz([{ question: "Good explorers…", options: ["Respect nature", "Harm habitats for fun", "Ignore safety rules"], answer: "Respect nature", explanation: "Care for places you visit." }]),
    askGrownUp: ["What's a summer adventure you remember fondly?"],
    activeFrom: "2026-07-01",
    activeUntil: "2026-07-31",
  },
];

export function getAllCuriosityCards() {
  return CURIOSITY_CARDS;
}

export function getCuriosityCard(id) {
  return CURIOSITY_CARDS.find((c) => c.id === id) ?? null;
}
