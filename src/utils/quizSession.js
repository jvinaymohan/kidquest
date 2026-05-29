const DEFAULT_MIN_QUESTIONS = 10;
const DEFAULT_RETRY_GAP = 2;

function clampPositiveInt(value, fallback) {
  const n = Number(value);
  if (!Number.isFinite(n) || n <= 0) return fallback;
  return Math.floor(n);
}

function shuffle(array) {
  const next = [...array];
  for (let i = next.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [next[i], next[j]] = [next[j], next[i]];
  }
  return next;
}

function createCycle(uniqueCount) {
  const sourceIndices = Array.from({ length: uniqueCount }, (_, i) => i);
  return { order: shuffle(sourceIndices), pointer: 0 };
}

function takeFromCycle(cycle) {
  if (cycle.order.length === 0) return null;
  if (cycle.pointer >= cycle.order.length) {
    cycle.order = shuffle(cycle.order);
    cycle.pointer = 0;
  }
  const next = cycle.order[cycle.pointer];
  cycle.pointer += 1;
  return next;
}

export function createQuizSession(questions = [], options = {}) {
  const minQuestions = clampPositiveInt(options.minQuestions, DEFAULT_MIN_QUESTIONS);
  const retryGap = clampPositiveInt(options.retryGap, DEFAULT_RETRY_GAP);
  const uniqueCount = questions.length;

  if (uniqueCount === 0) {
    return {
      queue: [],
      attempts: 0,
      answered: [],
      mastered: new Set(),
      done: true,
      minQuestions,
      retryGap,
      cycle: createCycle(0),
    };
  }

  const cycle = createCycle(uniqueCount);
  const queue = [];
  while (queue.length < minQuestions) {
    queue.push(takeFromCycle(cycle));
  }

  return {
    queue,
    attempts: 0,
    answered: [],
    mastered: new Set(),
    done: false,
    minQuestions,
    retryGap,
    cycle,
  };
}

export function getCurrentQuestion(session, questions) {
  const idx = session.queue[0];
  if (idx == null) return null;
  return { question: questions[idx], sourceIndex: idx };
}

export function submitQuizAnswer(session, wasCorrect) {
  if (session.done || session.queue.length === 0) return session;

  const [current, ...rest] = session.queue;
  const mastered = new Set(session.mastered);
  if (wasCorrect) mastered.add(current);

  let queue = [...rest];
  if (!wasCorrect) {
    const retryInsertAt = Math.min(session.retryGap, queue.length);
    queue.splice(retryInsertAt, 0, current);
  }

  const attempts = session.attempts + 1;
  while (attempts + queue.length < session.minQuestions) {
    const nextIdx = takeFromCycle(session.cycle);
    if (nextIdx == null) break;
    queue.push(nextIdx);
  }

  const allMastered = mastered.size >= session.cycle.order.length;
  if (!allMastered && queue.length === 0) {
    const remaining = session.cycle.order.filter((idx) => !mastered.has(idx));
    queue = shuffle(remaining);
  }

  const done = allMastered && attempts >= session.minQuestions;
  return {
    ...session,
    queue,
    attempts,
    answered: [...session.answered, { sourceIndex: current, correct: Boolean(wasCorrect) }],
    mastered,
    done,
  };
}
