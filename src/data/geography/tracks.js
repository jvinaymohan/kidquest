/** Geography hub track metadata (lessons use ids `geo-{id}-{ageGroup}`). */
export const GEO_TRACKS = [
  {
    id: "continents",
    title: "Continents Quest",
    emoji: "🌍",
    blurb: "Which continent is each country in?",
    color: "#2A9D8F",
    accent: "#E1F5EE",
  },
  {
    id: "flags",
    title: "Flag Hunters",
    emoji: "🚩",
    blurb: "Recognize flags from around the world.",
    color: "#9B5DE5",
    accent: "#EEEDFE",
  },
  {
    id: "capitals",
    title: "Capital Cities",
    emoji: "🏛️",
    blurb: "Match countries to their capitals.",
    color: "#3A86FF",
    accent: "#E6F1FB",
  },
  {
    id: "map",
    title: "Map Locator",
    emoji: "📍",
    blurb: "Tap countries on the interactive map.",
    color: "#D85A30",
    accent: "#FAECE7",
  },
  {
    id: "currencies",
    title: "World Currencies",
    emoji: "💰",
    blurb: "Learn money used in each country.",
    color: "#BA7517",
    accent: "#FAEEDA",
  },
];

export function geographyLessonId(trackId, ageGroup) {
  return `geo-${trackId}-${ageGroup}`;
}
