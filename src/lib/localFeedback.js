const KEY = "kidquest-local-feedback";

export function saveLocalFeedback(entry) {
  try {
    const list = JSON.parse(localStorage.getItem(KEY) ?? "[]");
    list.push({ ...entry, savedAt: new Date().toISOString() });
    localStorage.setItem(KEY, JSON.stringify(list.slice(-50)));
  } catch {
    /* ignore */
  }
}

export function readLocalFeedback() {
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? "[]");
  } catch {
    return [];
  }
}
