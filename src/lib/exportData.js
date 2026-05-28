/** GDPR-style export of local + profile snapshot. */

export function buildExportBundle() {
  const keys = [
    "kidquest-state-v1",
    "kidquest-multiplication-v1",
    "kidquest-geography-v1",
    "kidquest-life-explorer-v1",
    "kidquest-preferences-v1",
  ];
  const snapshot = { exportedAt: new Date().toISOString(), stores: {} };
  keys.forEach((key) => {
    try {
      const raw = localStorage.getItem(key);
      if (raw) snapshot.stores[key] = JSON.parse(raw);
    } catch {
      /* skip */
    }
  });
  return snapshot;
}

export function downloadExportJson() {
  const data = buildExportBundle();
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `kidquest-export-${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
}
