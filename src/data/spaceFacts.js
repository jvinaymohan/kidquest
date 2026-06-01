export const SPACE_FACTS = [
  "A day on Venus is longer than its year!",
  "Neptune's winds can blow faster than 1,200 mph!",
  "One million Earths could fit inside the Sun.",
  "Footprints on the Moon could last millions of years.",
  "Saturn's rings are mostly made of ice and rock.",
  "Jupiter has at least 95 moons!",
  "A spoonful of a neutron star weighs billions of tons.",
  "Light from the Sun takes about 8 minutes to reach Earth.",
  "Mars has the tallest volcano in the solar system — Olympus Mons!",
  "The Milky Way has over 100 billion stars.",
  "A black hole's gravity is so strong, light can't escape!",
  "Astronauts grow slightly taller in space.",
  "The International Space Station orbits Earth every 90 minutes.",
  "Uranus spins on its side — like a rolling ball!",
  "Shooting stars are really tiny space rocks burning up.",
];

export function dailySpaceFact(date = new Date()) {
  const day = date.getFullYear() * 366 + date.getMonth() * 31 + date.getDate();
  return SPACE_FACTS[day % SPACE_FACTS.length];
}
