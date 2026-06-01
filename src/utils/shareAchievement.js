const DEFAULT_ORIGIN =
  typeof window !== "undefined" ? window.location.origin : "https://kidquest-indol.vercel.app";

export function buildInviteUrl(ref = "share") {
  return `${DEFAULT_ORIGIN}/landing?ref=${encodeURIComponent(ref)}`;
}

export function buildStreakShareText({ kidName, streak }) {
  const name = kidName || "I";
  return `${name}'${name.endsWith("s") ? "" : "s"} on a ${streak}-day streak in KidQuest! 🚀 Can you beat it?`;
}

export function buildSessionShareText({ kidName, title, detail }) {
  const name = kidName || "I";
  const parts = [`${name} just ${title} on KidQuest! 🎉`];
  if (detail) parts.push(detail);
  parts.push("Join the quest!");
  return parts.join(" ");
}

/** Web Share API with clipboard fallback. Returns { ok, method }. */
export async function shareAchievement({ text, title = "KidQuest", url }) {
  const shareUrl = url ?? buildInviteUrl();
  const payload = text.includes(shareUrl) ? text : `${text}\n${shareUrl}`;

  if (typeof navigator !== "undefined" && navigator.share) {
    try {
      await navigator.share({ title, text: payload, url: shareUrl });
      return { ok: true, method: "share" };
    } catch (err) {
      if (err?.name === "AbortError") return { ok: false, method: "cancel" };
    }
  }

  if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(payload);
      return { ok: true, method: "copy" };
    } catch {
      /* fall through */
    }
  }

  return { ok: false, method: "none" };
}
