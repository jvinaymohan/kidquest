export function countGeoDueReviews(countries) {
  const today = new Date().toISOString().slice(0, 10);
  return Object.entries(countries ?? {}).filter(
    ([, c]) => c.nextReviewDate && c.nextReviewDate <= today
  ).length;
}
