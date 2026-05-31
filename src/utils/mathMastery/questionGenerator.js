import {
  answersMatch,
  fractionToString,
  gcd,
  mixedToString,
  simplifyFraction,
} from "./fractions";

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/** Random integer with exactly `digits` digits (1 → 1–9, 2 → 10–99, …). */
export function randomNDigit(digits) {
  if (digits <= 1) return randInt(1, 9);
  const min = 10 ** (digits - 1);
  const max = 10 ** digits - 1;
  return randInt(min, max);
}

function pickDenominators(level) {
  const pools = [
    [2, 3, 4, 5, 6, 8, 10],
    [2, 3, 4, 5, 6, 7, 8, 9, 10, 12],
    [2, 3, 4, 5, 6, 8, 10, 12],
    [2, 3, 4, 5, 6, 7, 8, 9, 10, 12],
    [2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 15],
  ];
  return pools[Math.min(level - 1, pools.length - 1)];
}

function generateAddition(level) {
  const a = randomNDigit(level);
  const b = randomNDigit(level);
  return {
    questionText: `${a} + ${b} = ?`,
    answer: String(a + b),
    operands: [a, b],
    hintMax: Math.max(a, b) + 10,
  };
}

function generateSubtraction(level) {
  let a = randomNDigit(level);
  let b = randomNDigit(level);
  if (level <= 3) {
    if (b > a) [a, b] = [b, a];
    return {
      questionText: `${a} − ${b} = ?`,
      answer: String(a - b),
      operands: [a, b],
      hintMax: a + 5,
    };
  }
  // Level 4–5: may be negative
  return {
    questionText: `${a} − ${b} = ?`,
    answer: String(a - b),
    operands: [a, b],
    hintMax: Math.max(a, b) + 10,
  };
}

function generateMultiplication(level) {
  const a = randomNDigit(level);
  const b = level <= 2 ? randInt(1, 12) : randomNDigit(Math.min(level, 2));
  return {
    questionText: `${a} × ${b} = ?`,
    answer: String(a * b),
    operands: [a, b],
  };
}

function generateDivision(level) {
  const divisor = level <= 2 ? randInt(2, 12) : randomNDigit(Math.min(level, 2));
  const quotient = randomNDigit(Math.min(level, 3));
  if (level <= 3) {
    const dividend = divisor * quotient;
    return {
      questionText: `${dividend} ÷ ${divisor} = ?`,
      answer: String(quotient),
      operands: [dividend, divisor],
    };
  }
  const remainder = randInt(0, divisor - 1);
  const dividend = divisor * quotient + remainder;
  const answer = remainder === 0 ? String(quotient) : `${quotient} R ${remainder}`;
  return {
    questionText: `${dividend} ÷ ${divisor} = ?`,
    answer,
    operands: [dividend, divisor],
    hasRemainder: remainder > 0,
  };
}

function generateFractions(level) {
  const dens = pickDenominators(level);

  if (level === 1) {
    const den = dens[randInt(0, dens.length - 1)];
    const n1 = randInt(1, den - 1);
    const n2 = randInt(1, den - 1);
    const sum = simplifyFraction(n1 + n2, den);
    return {
      questionText: `${n1}/${den} + ${n2}/${den} = ?`,
      answer: fractionToString(sum.num, sum.den),
      operands: [n1, n2, den],
    };
  }

  if (level === 2) {
    const d1 = dens[randInt(0, dens.length - 1)];
    let d2 = dens[randInt(0, dens.length - 1)];
    while (d2 === d1) d2 = dens[randInt(0, dens.length - 1)];
    const n1 = randInt(1, d1 - 1);
    const n2 = randInt(1, d2 - 1);
    const lcm = (d1 * d2) / gcd(d1, d2);
    const sum = simplifyFraction(n1 * (lcm / d1) + n2 * (lcm / d2), lcm);
    return {
      questionText: `${n1}/${d1} + ${n2}/${d2} = ?`,
      answer: fractionToString(sum.num, sum.den),
      operands: [n1, n2, d1, d2],
    };
  }

  if (level === 3) {
    const den = dens[randInt(0, dens.length - 1)];
    const w1 = randInt(0, 3);
    const w2 = randInt(0, 3);
    const n1 = randInt(1, den - 1);
    const n2 = randInt(1, den - 1);
    const totalNum = w1 * den + n1 + w2 * den + n2;
    const sum = simplifyFraction(totalNum, den);
    const whole = Math.floor(sum.num / sum.den);
    const rem = sum.num % sum.den;
    const answer = mixedToString(whole, rem, sum.den);
    return {
      questionText: `${mixedToString(w1, n1, den)} + ${mixedToString(w2, n2, den)} = ?`,
      answer,
      operands: [w1, n1, w2, n2, den],
    };
  }

  if (level === 4) {
    const den = dens[randInt(0, dens.length - 1)];
    const improper = randInt(den + 1, den * 3);
    const n2 = randInt(1, den - 1);
    const sum = simplifyFraction(improper + n2, den);
    return {
      questionText: `${improper}/${den} + ${n2}/${den} = ?`,
      answer: fractionToString(sum.num, sum.den),
      operands: [improper, n2, den],
    };
  }

  // Level 5: multi-step — add two different-denominator fractions, then add a whole
  const d1 = dens[randInt(0, dens.length - 1)];
  let d2 = dens[randInt(0, dens.length - 1)];
  while (d2 === d1) d2 = dens[randInt(0, dens.length - 1)];
  const n1 = randInt(1, d1 - 1);
  const n2 = randInt(1, d2 - 1);
  const whole = randInt(1, 5);
  const lcm = (d1 * d2) / gcd(d1, d2);
  const fracSum = simplifyFraction(n1 * (lcm / d1) + n2 * (lcm / d2), lcm);
  const total = simplifyFraction(whole * lcm + fracSum.num, lcm);
  const w = Math.floor(total.num / total.den);
  const rem = total.num % total.den;
  const answer = rem === 0 ? String(w) : mixedToString(w, rem, total.den);
  return {
    questionText: `${n1}/${d1} + ${n2}/${d2} + ${whole} = ?`,
    answer,
    operands: [n1, n2, d1, d2, whole],
  };
}

export function generateQuestion(operation, level) {
  const lvl = Math.min(5, Math.max(1, level));
  switch (operation) {
    case "addition":
      return generateAddition(lvl);
    case "subtraction":
      return generateSubtraction(lvl);
    case "multiplication":
      return generateMultiplication(lvl);
    case "division":
      return generateDivision(lvl);
    case "fractions":
      return generateFractions(lvl);
    default:
      return generateAddition(1);
  }
}

export function checkAnswer(userInput, correctAnswer) {
  return answersMatch(userInput, correctAnswer);
}
