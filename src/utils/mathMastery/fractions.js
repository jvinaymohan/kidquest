export function gcd(a, b) {
  a = Math.abs(a);
  b = Math.abs(b);
  while (b) {
    [a, b] = [b, a % b];
  }
  return a || 1;
}

export function simplifyFraction(num, den) {
  if (den === 0) return { num: 0, den: 1 };
  const sign = den < 0 ? -1 : 1;
  num = sign * Math.abs(num);
  den = Math.abs(den);
  const g = gcd(num, den);
  return { num: num / g, den: den / g };
}

export function fractionToString(num, den) {
  const { num: n, den: d } = simplifyFraction(num, den);
  if (d === 1) return String(n);
  return `${n}/${d}`;
}

export function mixedToString(whole, num, den) {
  const { num: n, den: d } = simplifyFraction(num, den);
  if (whole === 0 && n === 0) return "0";
  if (whole === 0) return `${n}/${d}`;
  if (n === 0) return String(whole);
  return `${whole} ${n}/${d}`;
}

/** Parse "3/4", "1 1/2", "9", "9 R 2" into comparable value or string key */
export function normalizeAnswer(raw) {
  const s = String(raw ?? "").trim().toLowerCase().replace(/\s+/g, " ");
  if (!s) return "";
  const mixed = s.match(/^(-?\d+)\s+(\d+)\/(\d+)$/);
  if (mixed) return `${mixed[1]} ${mixed[2]}/${mixed[3]}`;
  const frac = s.match(/^(-?\d+)\/(\d+)$/);
  if (frac) {
    const { num, den } = simplifyFraction(Number(frac[1]), Number(frac[2]));
    return den === 1 ? String(num) : `${num}/${den}`;
  }
  const rem = s.match(/^(-?\d+)\s*r\s*(\d+)$/i);
  if (rem) return `${rem[1]} R ${rem[2]}`;
  return s;
}

export function answersMatch(user, correct) {
  return normalizeAnswer(user) === normalizeAnswer(correct);
}

export function fractionToDecimal(num, den) {
  return num / den;
}
