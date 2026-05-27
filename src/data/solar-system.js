// Solar System lessons — concept cards + generated quizzes from planet data.
// Same shape as the other JSON subjects so existing lesson/quiz/results plumbing works.

import PLANETS from "./solar-system/planets.json";
import { rngFromString, sampleN } from "./geography/countries";

function shuffle(arr, rng) {
  return sampleN(arr, arr.length, rng);
}

// --- Lesson 1: Meet the Planets ---
function lessonPlanetsExplorer() {
  const id = "solar-planets-explorer";
  const rng = rngFromString(id);
  const easyPlanets = PLANETS.filter((p) => ["earth", "mars", "jupiter", "saturn", "venus", "mercury"].includes(p.id));
  const targets = sampleN(easyPlanets, 5, rng);
  const questions = targets.map((p, i) => {
    if (i === 0) {
      return {
        type: "choice",
        prompt: "Which planet is our home?",
        options: shuffle(["Earth", "Mars", "Jupiter"], rng),
        answer: "Earth",
      };
    }
    if (i === 1) {
      return {
        type: "choice",
        prompt: "Which planet is RED?",
        options: shuffle(["Mars", "Venus", "Earth"], rng),
        answer: "Mars",
      };
    }
    if (i === 2) {
      return {
        type: "choice",
        prompt: "Which planet has BIG RINGS?",
        options: shuffle(["Saturn", "Mercury", "Earth"], rng),
        answer: "Saturn",
      };
    }
    if (i === 3) {
      return {
        type: "yes-no",
        prompt: "Is Jupiter the biggest planet?",
        answer: "yes",
      };
    }
    return {
      type: "yes-no",
      prompt: "Does the Sun go around the Earth?",
      answer: "no",
    };
  });
  return {
    id,
    title: "Meet the Planets",
    track: "planets",
    concept: {
      text: "There are 8 planets going around the Sun. Earth is our home. Mars is red. Jupiter is huge. Saturn has rings!",
      emoji: "🪐",
      funFact: "If Earth were the size of a marble, Jupiter would be the size of a basketball!",
    },
    questions,
  };
}

function lessonPlanetsAdventurer() {
  const id = "solar-planets-adventurer";
  const rng = rngFromString(id);
  const otherPlanets = PLANETS.map((p) => p.name);
  const questions = [];

  questions.push({
    type: "choice",
    prompt: "Which planet is 3rd from the Sun?",
    options: shuffle(["Earth", "Mars", "Venus", "Mercury"], rng),
    answer: "Earth",
  });
  questions.push({
    type: "choice",
    prompt: "Which planet is the biggest in our solar system?",
    options: shuffle(["Jupiter", "Saturn", "Neptune", "Earth"], rng),
    answer: "Jupiter",
  });
  questions.push({
    type: "choice",
    prompt: "How many planets are in our solar system?",
    options: shuffle(["8", "7", "9", "10"], rng),
    answer: "8",
  });
  questions.push({
    type: "choice",
    prompt: "Which planet has the most moons?",
    options: shuffle(["Saturn", "Earth", "Mars", "Mercury"], rng),
    answer: "Saturn",
  });
  questions.push({
    type: "tf",
    prompt: "Venus is the hottest planet in our solar system.",
    answer: "true",
  });
  questions.push({
    type: "choice",
    prompt: "Which planet has beautiful icy rings?",
    options: shuffle(["Saturn", "Mars", "Mercury", "Venus"], rng),
    answer: "Saturn",
  });

  return {
    id,
    title: "Meet the Planets",
    track: "planets",
    concept: {
      text: "Our solar system has 8 planets, each one unique. The order from the Sun is Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, Neptune.",
      emoji: "🪐",
      funFact: "Pluto used to be the 9th planet — now it's called a 'dwarf planet'.",
    },
    questions,
  };
}

function lessonPlanetsChampion() {
  const id = "solar-planets-champion";
  const rng = rngFromString(id);
  const planetNames = PLANETS.map((p) => p.name);
  const orderedFirstFour = ["Mercury", "Venus", "Earth", "Mars"];
  const questions = [];

  questions.push({
    type: "choice",
    prompt: "Which planet is 5th from the Sun?",
    options: shuffle(["Jupiter", "Saturn", "Mars", "Uranus"], rng),
    answer: "Jupiter",
  });
  questions.push({
    type: "choice",
    prompt: "Which planet has the fastest winds in the solar system?",
    options: shuffle(["Neptune", "Jupiter", "Saturn", "Mars"], rng),
    answer: "Neptune",
  });
  questions.push({
    type: "choice",
    prompt: "Which planet spins on its side like a rolling ball?",
    options: shuffle(["Uranus", "Saturn", "Neptune", "Earth"], rng),
    answer: "Uranus",
  });
  questions.push({
    type: "order",
    prompt: "Put these planets in order, closest to the Sun first.",
    options: ["Earth", "Mercury", "Mars", "Venus"],
    answer: orderedFirstFour,
  });
  questions.push({
    type: "fill",
    prompt: "What is the smallest planet (closest to the Sun)?",
    answer: "Mercury",
  });
  questions.push({
    type: "tf",
    prompt: "Jupiter is a rocky planet just like Earth.",
    answer: "false",
  });
  questions.push({
    type: "choice",
    prompt: "Which of these is NOT a gas or ice giant?",
    options: shuffle(["Mars", "Jupiter", "Saturn", "Neptune"], rng),
    answer: "Mars",
  });
  questions.push({
    type: "choice",
    prompt: "Which planet is named after the Roman god of the sea?",
    options: shuffle(["Neptune", "Saturn", "Jupiter", "Uranus"], rng),
    answer: "Neptune",
  });

  return {
    id,
    title: "Planets in Detail",
    track: "planets",
    concept: {
      text: "Inner planets (Mercury, Venus, Earth, Mars) are small and rocky. Outer planets (Jupiter, Saturn, Uranus, Neptune) are huge gas or ice giants. Knowing their order and features unlocks a deep understanding of our cosmic neighborhood.",
      emoji: "🌌",
      funFact: "Astronomers use the mnemonic 'My Very Educated Mother Just Served Us Noodles' to remember the order.",
    },
    questions,
  };
}

// --- Lesson 2: The Sun & Moon ---
function lessonSunMoon(ageGroup) {
  const id = `solar-sun-moon-${ageGroup}`;
  const baseConcept = {
    explorer: {
      text: "The Sun is a giant ball of hot light! The Moon goes around the Earth. The Moon changes shape in the sky every night.",
      funFact: "The Sun is so big you could fit a million Earths inside it!",
    },
    adventurer: {
      text: "The Sun is a star — a huge ball of hot, glowing gas at the center of our solar system. The Moon is Earth's natural satellite and is the reason we see tides in the ocean.",
      funFact: "The Moon is moving away from Earth about 3.8 cm every year.",
    },
    champion: {
      text: "The Sun, a G-type main-sequence star, fuses hydrogen into helium and releases the energy that powers nearly all life on Earth. The Moon's gravity creates tides, stabilizes Earth's tilt, and gives us eclipses when alignment is right.",
      funFact: "A solar eclipse happens when the Moon passes between the Sun and Earth. A total solar eclipse can only be seen from a small area on Earth.",
    },
  };

  const questions = [];
  if (ageGroup === "explorer") {
    questions.push({ type: "yes-no", prompt: "Is the Sun very hot?", answer: "yes" });
    questions.push({ type: "yes-no", prompt: "Does the Moon shine brighter than the Sun?", answer: "no" });
    questions.push({ type: "choice", prompt: "The Moon goes around the...", options: ["Earth", "Sun", "Cloud"], answer: "Earth" });
    questions.push({ type: "choice", prompt: "What do we see in the sky at NIGHT?", options: ["Moon", "Sun", "Rainbow"], answer: "Moon" });
    questions.push({ type: "yes-no", prompt: "Does the Sun give us light?", answer: "yes" });
  } else if (ageGroup === "adventurer") {
    questions.push({ type: "choice", prompt: "What kind of object is the Sun?", options: ["A star", "A planet", "A moon", "A comet"], answer: "A star" });
    questions.push({ type: "choice", prompt: "What causes ocean tides?", options: ["The Moon", "The Sun", "Wind", "Earthquakes"], answer: "The Moon" });
    questions.push({ type: "choice", prompt: "About how long does it take the Moon to go around the Earth?", options: ["1 month", "1 day", "1 year", "10 years"], answer: "1 month" });
    questions.push({ type: "tf", prompt: "The Sun is at the center of our solar system.", answer: "true" });
    questions.push({ type: "choice", prompt: "When the Moon blocks the Sun, it's called a...", options: ["Solar eclipse", "Lunar eclipse", "Rainbow", "Meteor shower"], answer: "Solar eclipse" });
    questions.push({ type: "tf", prompt: "The Moon makes its own light.", answer: "false" });
  } else {
    questions.push({ type: "choice", prompt: "Which type of star is the Sun?", options: ["G-type main sequence", "Red giant", "White dwarf", "Neutron star"], answer: "G-type main sequence" });
    questions.push({ type: "choice", prompt: "Approximately how old is the Sun?", options: ["4.6 billion years", "1 billion years", "100 million years", "13.8 billion years"], answer: "4.6 billion years" });
    questions.push({ type: "choice", prompt: "What process powers the Sun?", options: ["Nuclear fusion", "Burning gasoline", "Friction", "Lightning"], answer: "Nuclear fusion" });
    questions.push({ type: "choice", prompt: "What is a lunar eclipse?", options: ["Earth blocks Sun from Moon", "Moon blocks Sun from Earth", "Sun explodes", "Moon goes dark forever"], answer: "Earth blocks Sun from Moon" });
    questions.push({ type: "fill", prompt: "What is the name of our galaxy?", answer: "Milky Way" });
    questions.push({ type: "tf", prompt: "The Sun rotates faster at its equator than at its poles.", answer: "true" });
    questions.push({ type: "choice", prompt: "Which Moon phase comes between First Quarter and Full Moon?", options: ["Waxing Gibbous", "Waning Crescent", "New Moon", "Last Quarter"], answer: "Waxing Gibbous" });
  }

  return {
    id,
    title: "The Sun & Moon",
    track: "sun-moon",
    concept: { ...baseConcept[ageGroup], emoji: "☀️" },
    questions,
  };
}

// --- Lesson 3: Space Exploration ---
function lessonSpaceExploration(ageGroup) {
  const id = `solar-missions-${ageGroup}`;
  const concepts = {
    explorer: {
      text: "People have traveled to space! Astronauts wear special suits. The first person to walk on the Moon was Neil Armstrong.",
      funFact: "There's no air in space, so astronauts bring their own to breathe!",
    },
    adventurer: {
      text: "Since 1961 humans have launched rockets, landed on the Moon, sent robots to Mars, and built the International Space Station — a science lab orbiting Earth.",
      funFact: "Astronauts on the ISS see 16 sunrises and sunsets every day!",
    },
    champion: {
      text: "Apollo 11 landed the first humans on the Moon (1969). Voyager 1 became the first man-made object to leave our solar system. NASA's Mars rovers Curiosity and Perseverance continue searching for signs of past life.",
      funFact: "Voyager 1 carries a 'Golden Record' with sounds and images from Earth — a message for any intelligent life that finds it.",
    },
  };

  const questions = [];
  if (ageGroup === "explorer") {
    questions.push({ type: "choice", prompt: "Who walked on the Moon first?", options: ["A person", "A dog", "A robot"], answer: "A person" });
    questions.push({ type: "yes-no", prompt: "Do astronauts wear special suits?", answer: "yes" });
    questions.push({ type: "yes-no", prompt: "Can we breathe normal air in space?", answer: "no" });
    questions.push({ type: "choice", prompt: "What goes UP into space?", options: ["Rocket", "Car", "Boat"], answer: "Rocket" });
    questions.push({ type: "yes-no", prompt: "Have people landed on the Moon?", answer: "yes" });
  } else if (ageGroup === "adventurer") {
    questions.push({ type: "choice", prompt: "Who was the first human to walk on the Moon?", options: ["Neil Armstrong", "Buzz Aldrin", "Yuri Gagarin", "Sally Ride"], answer: "Neil Armstrong" });
    questions.push({ type: "choice", prompt: "Which space mission first landed humans on the Moon?", options: ["Apollo 11", "Apollo 13", "Sputnik 1", "Voyager 1"], answer: "Apollo 11" });
    questions.push({ type: "choice", prompt: "Which planet have rovers explored most?", options: ["Mars", "Venus", "Saturn", "Mercury"], answer: "Mars" });
    questions.push({ type: "choice", prompt: "What is the ISS?", options: ["International Space Station", "Indian Space Society", "Internal Sun Sensor", "Italian Star System"], answer: "International Space Station" });
    questions.push({ type: "tf", prompt: "Yuri Gagarin was the first human in space.", answer: "true" });
    questions.push({ type: "choice", prompt: "Which agency runs the Mars rover Perseverance?", options: ["NASA", "ESA", "ISRO", "SpaceX"], answer: "NASA" });
  } else {
    questions.push({ type: "fill", prompt: "Which was the first artificial satellite, launched in 1957?", answer: "Sputnik" });
    questions.push({ type: "choice", prompt: "How long did it take Apollo 11 to reach the Moon?", options: ["About 3 days", "About 1 day", "About 1 month", "About 6 hours"], answer: "About 3 days" });
    questions.push({ type: "choice", prompt: "Which probe was first to leave our solar system?", options: ["Voyager 1", "Pioneer 10", "Cassini", "New Horizons"], answer: "Voyager 1" });
    questions.push({ type: "choice", prompt: "Which rover discovered evidence of ancient flowing water on Mars?", options: ["Curiosity", "Sojourner", "Opportunity", "All of them"], answer: "All of them" });
    questions.push({ type: "choice", prompt: "Who was the first woman in space?", options: ["Valentina Tereshkova", "Sally Ride", "Mae Jemison", "Christa McAuliffe"], answer: "Valentina Tereshkova" });
    questions.push({ type: "tf", prompt: "The James Webb Space Telescope orbits the Earth like Hubble does.", answer: "false" });
    questions.push({ type: "fill", prompt: "Which planet does the Perseverance rover explore?", answer: "Mars" });
  }

  return {
    id,
    title: "Space Exploration",
    track: "missions",
    concept: { ...concepts[ageGroup], emoji: "🚀" },
    questions,
  };
}

const solarSystemData = {
  subject: "solar-system",
  ageGroups: {
    explorer: { lessons: [lessonPlanetsExplorer(), lessonSunMoon("explorer"), lessonSpaceExploration("explorer")] },
    adventurer: { lessons: [lessonPlanetsAdventurer(), lessonSunMoon("adventurer"), lessonSpaceExploration("adventurer")] },
    champion: { lessons: [lessonPlanetsChampion(), lessonSunMoon("champion"), lessonSpaceExploration("champion")] },
  },
};

export default solarSystemData;
export { PLANETS };
