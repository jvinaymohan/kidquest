export function calculateNextReview(item, quality) {
  let { easeFactor = 2.5, interval = 1, repetitions = 0 } = item;

  if (quality >= 3) {
    if (repetitions === 0) interval = 1;
    else if (repetitions === 1) interval = 6;
    else interval = Math.round(interval * easeFactor);
    repetitions += 1;
  } else {
    repetitions = 0;
    interval = 1;
  }

  easeFactor = Math.max(
    1.3,
    easeFactor + 0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02)
  );

  const nextReviewDate = new Date();
  nextReviewDate.setDate(nextReviewDate.getDate() + interval);

  return {
    easeFactor,
    interval,
    repetitions,
    nextReviewDate: nextReviewDate.toISOString().slice(0, 10),
  };
}

export function qualityFromResponse({ correct, responseMs }) {
  if (!correct) return 0;
  if (responseMs < 3000) return 5;
  if (responseMs < 6000) return 4;
  return 3;
}
