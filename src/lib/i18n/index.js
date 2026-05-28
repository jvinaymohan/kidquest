import en from "./locales/en.json";
import es from "./locales/es.json";

const PACKS = { en, es };

let locale = "en";

export function setLocale(next) {
  locale = PACKS[next] ? next : "en";
  if (typeof document !== "undefined") {
    document.documentElement.lang = locale;
    document.documentElement.dir = locale === "ar" ? "rtl" : "ltr";
  }
}

export function getLocale() {
  return locale;
}

export function t(key, vars = {}) {
  const parts = key.split(".");
  let node = PACKS[locale] ?? PACKS.en;
  for (const p of parts) {
    node = node?.[p];
  }
  let str = typeof node === "string" ? node : key;
  Object.entries(vars).forEach(([k, v]) => {
    str = str.replace(`{{${k}}}`, String(v));
  });
  return str;
}

export const LOCALES = [
  { id: "en", label: "English" },
  { id: "es", label: "Español" },
];
