import baseMath from "./math.json";
import { MULTIPLICATION_LESSONS } from "./math/multiplication";

function mergeLessons(ageGroup) {
  const base = baseMath.ageGroups[ageGroup]?.lessons ?? [];
  const mul = MULTIPLICATION_LESSONS[ageGroup] ?? [];
  return [...base, ...mul];
}

const mathData = {
  subject: "math",
  ageGroups: {
    explorer: { lessons: mergeLessons("explorer") },
    adventurer: { lessons: mergeLessons("adventurer") },
    champion: { lessons: mergeLessons("champion") },
  },
};

export default mathData;
