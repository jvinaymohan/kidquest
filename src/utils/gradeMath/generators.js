import { fractionToString, simplifyFraction, answersMatch } from "../mathMastery/fractions.js";
import { GRADE_PASS_THRESHOLD } from "./constants.js";
import { randInt, pick, shuffle, rngFromString } from "./rng.js";

function choiceOptions(rng, answer, formatter = String) {
  const opts = new Set([formatter(answer)]);
  let guard = 0;
  while (opts.size < 4 && guard++ < 40) {
    const delta = pick(rng, [-3, -2, -1, 1, 2, 3, 4, 5]);
    const candidate = typeof answer === "number" ? answer + delta : answer;
    if (candidate !== answer && candidate > 0) opts.add(formatter(candidate));
  }
  while (opts.size < 4) opts.add(formatter(answer + opts.size));
  return shuffle(rng, [...opts]);
}

function numericQ(id, topic, prompt, answer) {
  return { id, topic, type: "numeric", prompt, answer: String(answer) };
}

function choiceQ(id, topic, prompt, answer, rng, formatter) {
  return {
    id,
    topic,
    type: "choice",
    prompt,
    answer: String(answer),
    options: choiceOptions(rng, answer, formatter),
  };
}

/** Grade 1 — counting, +/- within 20 */
function genGrade1(rng, idx) {
  const kind = idx % 3;
  if (kind === 0) {
    const n = randInt(rng, 1, 10);
    const next = n + 1;
    return choiceQ(`g1-c-${idx}`, "counting", `What comes after ${n}?`, next, rng);
  }
  if (kind === 1) {
    const a = randInt(rng, 1, 10);
    const b = randInt(rng, 1, 10);
    return numericQ(`g1-a-${idx}`, "addition", `${a} + ${b} = ?`, a + b);
  }
  let a = randInt(rng, 5, 20);
  let b = randInt(rng, 1, a);
  return numericQ(`g1-s-${idx}`, "subtraction", `${a} − ${b} = ?`, a - b);
}

/** Grade 2 — +/- within 100, intro mult */
function genGrade2(rng, idx) {
  const kind = idx % 3;
  if (kind === 0) {
    const a = randInt(rng, 10, 99);
    const b = randInt(rng, 1, 99 - a);
    return numericQ(`g2-a-${idx}`, "addition", `${a} + ${b} = ?`, a + b);
  }
  if (kind === 1) {
    const a = randInt(rng, 20, 99);
    const b = randInt(rng, 1, a - 1);
    return numericQ(`g2-s-${idx}`, "subtraction", `${a} − ${b} = ?`, a - b);
  }
  const a = randInt(rng, 2, 5);
  const b = randInt(rng, 2, 10);
  return choiceQ(`g2-m-${idx}`, "multiplication", `${a} × ${b} = ?`, a * b, rng);
}

/** Grade 3 — mult/div facts, fractions intro */
function genGrade3(rng, idx) {
  const kind = idx % 3;
  if (kind === 0) {
    const a = randInt(rng, 2, 12);
    const b = randInt(rng, 2, 12);
    return numericQ(`g3-m-${idx}`, "multiplication", `${a} × ${b} = ?`, a * b);
  }
  if (kind === 1) {
    const b = randInt(rng, 2, 12);
    const q = randInt(rng, 2, 12);
    const a = b * q;
    return numericQ(`g3-d-${idx}`, "division", `${a} ÷ ${b} = ?`, q);
  }
  const den = pick(rng, [2, 3, 4, 6, 8]);
  const num = randInt(rng, 1, den - 1);
  return choiceQ(
    `g3-f-${idx}`,
    "fractions",
    `Which fraction is ${num} out of ${den} parts?`,
    `${num}/${den}`,
    rng,
    String
  );
}

/** Grade 4 — multi-digit mult/div, decimals */
function genGrade4(rng, idx) {
  const kind = idx % 3;
  if (kind === 0) {
    const a = randInt(rng, 11, 99);
    const b = randInt(rng, 2, 9);
    return numericQ(`g4-m-${idx}`, "multiplication", `${a} × ${b} = ?`, a * b);
  }
  if (kind === 1) {
    const b = randInt(rng, 2, 12);
    const q = randInt(rng, 5, 99);
    const a = b * q;
    return numericQ(`g4-d-${idx}`, "division", `${a} ÷ ${b} = ?`, q);
  }
  const whole = randInt(rng, 1, 9);
  const tenth = randInt(rng, 1, 9);
  const prompt = `${whole}.${tenth} + 0.${10 - tenth} = ?`;
  const ans = whole + 1;
  return choiceQ(`g4-dec-${idx}`, "decimals", prompt, ans, rng);
}

/** Grade 5 — fraction/decimal ops, volume */
function genGrade5(rng, idx) {
  const kind = idx % 3;
  if (kind === 0) {
    const den = pick(rng, [4, 5, 8, 10]);
    const n1 = randInt(rng, 1, den - 1);
    const n2 = randInt(rng, 1, den - 1);
    const sum = simplifyFraction(n1 + n2, den);
    return numericQ(
      `g5-f-${idx}`,
      "fractions",
      `${n1}/${den} + ${n2}/${den} = ?`,
      fractionToString(sum.num, sum.den)
    );
  }
  if (kind === 1) {
    const a = randInt(rng, 1, 9);
    const b = randInt(rng, 1, 9);
    const c = randInt(rng, 1, 5);
    return choiceQ(
      `g5-v-${idx}`,
      "volume",
      `A box is ${a} × ${b} × ${c} cm. Volume?`,
      a * b * c,
      rng
    );
  }
  const a = randInt(rng, 10, 99);
  const b = randInt(rng, 1, 9);
  const t = randInt(rng, 1, 9);
  return numericQ(`g5-d-${idx}`, "decimals", `${a}.${t} × 10 = ?`, Number(`${a}${t}`));
}

/** Grade 6 — ratios, negatives, expressions */
function genGrade6(rng, idx) {
  const kind = idx % 3;
  if (kind === 0) {
    const a = randInt(rng, 2, 6);
    const b = randInt(rng, 2, 6);
    const scale = randInt(rng, 2, 5);
    return choiceQ(
      `g6-r-${idx}`,
      "ratios",
      `Ratio ${a}:${b} — if first part is ${a * scale}, second is?`,
      b * scale,
      rng
    );
  }
  if (kind === 1) {
    const a = randInt(rng, 5, 20);
    const b = randInt(rng, 1, a - 1);
    return numericQ(`g6-n-${idx}`, "negatives", `${b} − ${a} = ?`, b - a);
  }
  const x = randInt(rng, 2, 9);
  const c = randInt(rng, 2, 20);
  return numericQ(`g6-e-${idx}`, "expressions", `${x} + ${c} = ?`, x + c);
}

/** Grade 7 — proportions, percent, algebra */
function genGrade7(rng, idx) {
  const kind = idx % 3;
  if (kind === 0) {
    const pct = pick(rng, [10, 20, 25, 50]);
    const of = randInt(rng, 2, 20) * 10;
    return numericQ(`g7-p-${idx}`, "percent", `${pct}% of ${of} = ?`, (pct * of) / 100);
  }
  if (kind === 1) {
    const a = randInt(rng, 2, 8);
    const b = randInt(rng, 2, 8);
    const k = randInt(rng, 2, 5);
    return choiceQ(
      `g7-pr-${idx}`,
      "proportions",
      `${a}/${b} = ${a * k}/?`,
      b * k,
      rng
    );
  }
  const x = randInt(rng, 2, 9);
  const add = randInt(rng, 3, 15);
  const total = x + add;
  return numericQ(`g7-a-${idx}`, "algebra", `x + ${add} = ${total}. x = ?`, x);
}

/** Grade 8 — linear equations, roots, geometry */
function genGrade8(rng, idx) {
  const kind = idx % 3;
  if (kind === 0) {
    const m = randInt(rng, 2, 5);
    const x = randInt(rng, 2, 9);
    const b = randInt(rng, 1, 10);
    return numericQ(`g8-l-${idx}`, "equations", `${m}x + ${b} = ${m * x + b}. x = ?`, x);
  }
  if (kind === 1) {
    const n = pick(rng, [4, 9, 16, 25, 36]);
    return choiceQ(`g8-r-${idx}`, "roots", `√${n} = ?`, Math.sqrt(n), rng);
  }
  const side = randInt(rng, 3, 12);
  return choiceQ(`g8-g-${idx}`, "geometry", `Square side ${side}. Area?`, side * side, rng);
}

/** Grade 9 — algebra I, systems */
function genGrade9(rng, idx) {
  const kind = idx % 3;
  if (kind === 0) {
    const x = randInt(rng, 2, 9);
    const a = randInt(rng, 2, 5);
    return numericQ(`g9-q-${idx}`, "quadratics", `x² when x = ${x} (x² = ?)`, x * x);
  }
  if (kind === 1) {
    const x = randInt(rng, 2, 8);
    const y = randInt(rng, 2, 8);
    return choiceQ(`g9-s-${idx}`, "systems", `x + y = ${x + y}, x = ${x}. y = ?`, y, rng);
  }
  const b = randInt(rng, 2, 9);
  const exp = randInt(rng, 2, 4);
  return numericQ(`g9-e-${idx}`, "exponents", `${b}^${exp} = ?`, b ** exp);
}

/** Grade 10 — algebra II / geometry foundations */
function genGrade10(rng, idx) {
  const kind = idx % 3;
  if (kind === 0) {
    const a = randInt(rng, 1, 5);
    const b = randInt(rng, 1, 5);
    const c = randInt(rng, 1, 5);
    return numericQ(`g10-p-${idx}`, "polynomials", `(${a}x + ${b}) + (${c}x + ${b}) → coeff of x?`, a + c);
  }
  if (kind === 1) {
    const r = randInt(rng, 2, 9);
    return choiceQ(`g10-c-${idx}`, "geometry", `Circle radius ${r}. Area ≈ πr². r² = ?`, r * r, rng);
  }
  const x = randInt(rng, 2, 9);
  return numericQ(`g10-f-${idx}`, "functions", `f(x) = 2x + 1. f(${x}) = ?`, 2 * x + 1);
}

const GENERATORS = {
  1: genGrade1,
  2: genGrade2,
  3: genGrade3,
  4: genGrade4,
  5: genGrade5,
  6: genGrade6,
  7: genGrade7,
  8: genGrade8,
  9: genGrade9,
  10: genGrade10,
};

export function generateGradeQuestions(grade, count, seed = `${grade}-${Date.now()}`) {
  const g = Math.min(10, Math.max(1, grade));
  const gen = GENERATORS[g];
  const rng = rngFromString(seed);
  const questions = [];
  for (let i = 0; i < count; i++) {
    questions.push(gen(rng, i));
  }
  return questions;
}

export function gradeQuestionAnswerMatches(userInput, question) {
  if (question.type === "choice") {
    return String(userInput).trim() === String(question.answer).trim();
  }
  return answersMatch(userInput, question.answer);
}

export function analyzeWeakTopics(results) {
  const byTopic = {};
  for (const r of results) {
    if (!r.topic) continue;
    if (!byTopic[r.topic]) byTopic[r.topic] = { correct: 0, total: 0 };
    byTopic[r.topic].total += 1;
    if (r.correct) byTopic[r.topic].correct += 1;
  }
  return Object.entries(byTopic)
    .map(([topic, { correct, total }]) => ({
      topic,
      pct: total ? correct / total : 0,
      total,
    }))
    .filter((t) => t.total > 0 && t.pct < GRADE_PASS_THRESHOLD)
    .sort((a, b) => a.pct - b.pct);
}
