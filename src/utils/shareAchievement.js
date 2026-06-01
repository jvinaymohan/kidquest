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

async function copyToClipboard(text) {
  if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      /* fall through to textarea fallback */
    }
  }

  if (typeof document === "undefined") return false;

  try {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.setAttribute("readonly", "");
    ta.style.position = "fixed";
    ta.style.left = "-9999px";
    ta.style.top = "0";
    document.body.appendChild(ta);
    ta.focus();
    ta.select();
    const ok = document.execCommand("copy");
    document.body.removeChild(ta);
    return ok;
  } catch {
    return false;
  }
}

/** Web Share API with clipboard fallback. Returns { ok, method, error? }. */
export async function shareAchievement({ text, title = "KidQuest", url }) {
  const shareUrl = url ?? buildInviteUrl();
  const payload = text.includes(shareUrl) ? text : `${text}\n${shareUrl}`;

  if (typeof navigator !== "undefined" && navigator.share) {
    try {
      const candidates = [
        { title, text: payload },
        { title, url: shareUrl },
        { title, text: payload.split("\n")[0], url: shareUrl },
      ];

      for (const data of candidates) {
        if (navigator.canShare && !navigator.canShare(data)) continue;
        await navigator.share(data);
        return { ok: true, method: "share" };
      }
    } catch (err) {
      if (err?.name === "AbortError") return { ok: false, method: "cancel" };
    }
  }

  if (await copyToClipboard(payload)) {
    return { ok: true, method: "copy" };
  }

  return { ok: false, method: "none", error: "Could not share or copy link" };
}
