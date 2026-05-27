// Geography lessons are *generated* from the 194-country dataset so we always
// have age-appropriate, randomly-seeded quizzes drawn from real data instead
// of a tiny hand-written list. Same shape as the old geography.json so all
// existing lesson/quiz/results plumbing keeps working unchanged.

import {
  COUNTRIES,
  CONTINENTS,
  rngFromString,
  sampleN,
} from "./geography/countries";
import { poolForAgeGroup } from "./geography/difficulty";

const AGE_QUESTION_COUNTS = { explorer: 5, adventurer: 6, champion: 8 };

const CONCEPTS = {
  continents: {
    explorer: {
      text: "Earth is split into big land called continents. There are 5 main ones: Africa, the Americas, Asia, Europe, and Oceania!",
      emoji: "🌍",
      funFact: "Antarctica is a continent too — but only penguins live there!",
    },
    adventurer: {
      text: "Earth's land is grouped into 5 main continents: Africa, the Americas, Asia, Europe, and Oceania. Knowing where a country lives is the first step to exploring it.",
      emoji: "🌎",
      funFact: "Russia is so big it sits in two continents — Europe AND Asia.",
    },
    champion: {
      text: "Every country belongs to a continent. Geographers usually use a 5-region model: Africa, the Americas, Asia, Europe, and Oceania. Some maps split the Americas into North and South, and some count Antarctica too.",
      emoji: "🗺️",
      funFact: "Turkey sits on both Europe and Asia. Egypt's Sinai Peninsula is in Asia even though Egypt is in Africa.",
    },
  },
  flags: {
    explorer: {
      text: "Every country has its own flag. Flags use colors and shapes to tell us about a country!",
      emoji: "🚩",
      funFact: "Nepal is the only country with a flag that is not a rectangle.",
    },
    adventurer: {
      text: "Flags are like name tags for countries. Stars, stripes, colors and symbols all mean something. Once you know a few, you start to recognize them everywhere.",
      emoji: "🏳️",
      funFact: "The flag of Japan is older than 1,000 years.",
    },
    champion: {
      text: "Some flags look very similar — Romania vs Chad, Ireland vs Côte d'Ivoire, Indonesia vs Monaco. The order of colors, the stripes, and the small symbols are what set them apart.",
      emoji: "🎌",
      funFact: "Libya once had a flag that was just one solid green color — completely plain!",
    },
  },
  capitals: {
    explorer: {
      text: "Every country has a special city called its capital. That's where the government works!",
      emoji: "🏙️",
      funFact: "Washington D.C. is the capital of the USA, but it's NOT a state!",
    },
    adventurer: {
      text: "A capital city is the heart of a country — where leaders meet and big decisions are made. Some countries have more than one capital!",
      emoji: "🏛️",
      funFact: "South Africa has THREE capitals — Pretoria, Cape Town, and Bloemfontein.",
    },
    champion: {
      text: "Capitals aren't always the biggest city. Canberra (Australia), Brasília (Brazil), and Washington D.C. (USA) were all built specifically to be capitals.",
      emoji: "📍",
      funFact: "Naypyidaw became Myanmar's capital in 2005 — replacing Yangon almost overnight.",
    },
  },
  map: {
    explorer: {
      text: "Every country has a home on the map! Tap the right spot to show you know where it lives.",
      emoji: "📍",
      funFact: "The biggest country is Russia — it spans two continents!",
    },
    adventurer: {
      text: "Maps show us where countries live on Earth. Zoom into a continent and tap the country you hear about!",
      emoji: "🗺️",
      funFact: "Greenland looks huge on some maps but Africa is actually 14 times bigger!",
    },
    champion: {
      text: "Master the world map! From a zoomed-out view or a continent close-up, pin each country precisely.",
      emoji: "🎯",
      funFact: "Only about 30% of Earth's land is dry — the rest is water!",
    },
  },
  currencies: {
    explorer: {
      text: "Money is different in every country! The money each country uses is called its currency.",
      emoji: "💰",
      funFact: "Some countries use coins so big you can hold them with both hands!",
    },
    adventurer: {
      text: "A currency is the kind of money a country uses. The USA uses dollars, France uses euros, Japan uses yen. Each currency has its own symbol like $, €, ¥, ₹.",
      emoji: "💴",
      funFact: "About 20 European countries share the same currency — the euro.",
    },
    champion: {
      text: "Currency codes are 3 letters: USD (US dollar), EUR (euro), GBP (British pound), JPY (Japanese yen), INR (Indian rupee). Many former colonies still use the franc or the dollar from their colonizer's system.",
      emoji: "🏦",
      funFact: "Zimbabwe once printed a $100 trillion dollar banknote — worth less than a loaf of bread.",
    },
  },
};

function shuffle(arr, rng) {
  return sampleN(arr, arr.length, rng);
}

// ----- Track generators -----

function genContinentsQuestions(ageGroup, rng, pool) {
  const count = AGE_QUESTION_COUNTS[ageGroup];
  const targets = sampleN(pool, count, rng);
  return targets.map((country) => {
    const distractors = CONTINENTS.filter((c) => c !== country.continent);
    const optionsCount = ageGroup === "explorer" ? 3 : 4;
    const wrong = sampleN(distractors, optionsCount - 1, rng);
    const options = shuffle([...wrong, country.continent], rng);
    return {
      type: "choice",
      prompt: `Which continent is ${country.name} in?`,
      options,
      answer: country.continent,
    };
  });
}

function genFlagQuestions(ageGroup, rng, pool) {
  const count = AGE_QUESTION_COUNTS[ageGroup];
  const targets = sampleN(pool, count, rng);
  return targets.map((country, idx) => {
    const optsCount = ageGroup === "explorer" ? 3 : ageGroup === "adventurer" ? 4 : 4;
    let distractorPool = pool.filter((c) => c.code !== country.code);
    if (ageGroup === "champion") {
      const sameRegion = distractorPool.filter((c) => c.continent === country.continent);
      distractorPool = sameRegion.length >= optsCount - 1 ? sameRegion : distractorPool;
    }
    const wrong = sampleN(distractorPool, optsCount - 1, rng);
    const allCodes = shuffle([...wrong.map((c) => c.code), country.code], rng);
    if (idx % 2 === 0) {
      return {
        type: "flag-grid",
        prompt: `Tap the flag of ${country.name}.`,
        options: allCodes,
        answer: country.code,
      };
    }
    return {
      type: "flag-choice",
      prompt: `Whose flag is this?`,
      flagCode: country.code,
      options: shuffle(
        [
          ...wrong.map((c) => ({ code: c.code, label: c.name })),
          { code: country.code, label: country.name },
        ],
        rng
      ),
      answer: country.code,
    };
  });
}

function genCapitalsQuestions(ageGroup, rng, pool) {
  const count = AGE_QUESTION_COUNTS[ageGroup];
  const targets = sampleN(pool.filter((c) => c.capital), count, rng);
  return targets.map((country, idx) => {
    const distractors = pool.filter((c) => c.code !== country.code && c.capital);
    const optsCount = ageGroup === "explorer" ? 3 : 4;
    const wrong = sampleN(distractors, optsCount - 1, rng).map((c) => c.capital);
    if (idx % 3 === 2 && ageGroup !== "explorer") {
      const sameContinent = pool.filter(
        (c) => c.code !== country.code && c.continent === country.continent && c.capital
      );
      const reverseDistractors = sampleN(
        sameContinent.length >= 3 ? sameContinent : pool.filter((c) => c.code !== country.code),
        optsCount - 1,
        rng
      ).map((c) => c.name);
      const options = shuffle([...reverseDistractors, country.name], rng);
      return {
        type: "choice",
        prompt: `${country.capital} is the capital of which country?`,
        options,
        answer: country.name,
      };
    }
    const options = shuffle([...wrong, country.capital], rng);
    return {
      type: "choice",
      prompt: `What is the capital of ${country.name}?`,
      options,
      answer: country.capital,
    };
  });
}

function genCurrenciesQuestions(ageGroup, rng, pool) {
  const count = AGE_QUESTION_COUNTS[ageGroup];
  const withCurrency = pool.filter((c) => c.currency && c.currency.name);
  const targets = sampleN(withCurrency, count, rng);
  return targets.map((country, idx) => {
    const distractors = withCurrency
      .filter((c) => c.currency.code !== country.currency.code)
      .map((c) => c.currency.name);
    const uniqueDistractors = [...new Set(distractors)];
    const optsCount = ageGroup === "explorer" ? 3 : 4;
    if (idx % 2 === 0 || ageGroup !== "champion") {
      const wrong = sampleN(uniqueDistractors, optsCount - 1, rng);
      const options = shuffle([...wrong, country.currency.name], rng);
      return {
        type: "choice",
        prompt: `What currency does ${country.name} use?`,
        options,
        answer: country.currency.name,
      };
    }
    const codeDistractors = [
      ...new Set(
        withCurrency
          .filter((c) => c.currency.code !== country.currency.code)
          .map((c) => c.currency.code)
      ),
    ];
    const wrong = sampleN(codeDistractors, optsCount - 1, rng);
    const options = shuffle([...wrong, country.currency.code], rng);
    return {
      type: "choice",
      prompt: `Which currency code does ${country.name} use?`,
      options,
      answer: country.currency.code,
    };
  });
}

function genMapQuestions(ageGroup, rng, pool) {
  const count = ageGroup === "champion" ? 8 : ageGroup === "adventurer" ? 6 : 5;
  const targets = sampleN(pool, count, rng);
  return targets.map((country) => {
    const zoomTo = ageGroup === "champion" ? "world" : country.continent;
    return {
      type: "map-locate",
      prompt: `Tap ${country.name} on the map!`,
      answer: country.code,
      zoomTo,
      countryName: country.name,
    };
  });
}

// ----- Lesson builders -----

const TRACKS = [
  { id: "continents", title: "Continents Quest", gen: genContinentsQuestions },
  { id: "flags", title: "Flag Hunters", gen: genFlagQuestions },
  { id: "capitals", title: "Capital Cities", gen: genCapitalsQuestions },
  { id: "map", title: "Map Locator", gen: genMapQuestions },
  { id: "currencies", title: "World Currencies", gen: genCurrenciesQuestions },
];

function buildLessonsFor(ageGroup) {
  const pool = poolForAgeGroup(ageGroup, COUNTRIES);
  return TRACKS.map((track) => {
    const id = `geo-${track.id}-${ageGroup}`;
    const rng = rngFromString(id);
    return {
      id,
      title: track.title,
      track: track.id,
      concept: CONCEPTS[track.id][ageGroup],
      questions: track.gen(ageGroup, rng, pool),
    };
  });
}

const geographyData = {
  subject: "geography",
  ageGroups: {
    explorer: { lessons: buildLessonsFor("explorer") },
    adventurer: { lessons: buildLessonsFor("adventurer") },
    champion: { lessons: buildLessonsFor("champion") },
  },
};

export default geographyData;
