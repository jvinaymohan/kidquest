import { formatMs } from "./multiplicationScoring";

export function createSpeedRunCardDataUrl({ kidName, score, totalTimeMs, medalLabel }) {
  const width = 1080;
  const height = 1080;
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");

  const grad = ctx.createLinearGradient(0, 0, width, height);
  grad.addColorStop(0, "#0D1B2A");
  grad.addColorStop(1, "#1E3A8A");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, width, height);

  ctx.fillStyle = "#FFD700";
  ctx.font = "700 74px sans-serif";
  ctx.fillText("KidQuest Speed Run", 84, 170);

  ctx.fillStyle = "#FFFFFF";
  ctx.font = "700 56px sans-serif";
  ctx.fillText(kidName || "KidQuest Hero", 84, 280);

  ctx.font = "700 170px sans-serif";
  ctx.fillStyle = "#00D4FF";
  ctx.fillText(`${score}/50`, 84, 520);

  ctx.font = "700 96px sans-serif";
  ctx.fillStyle = "#FFD700";
  ctx.fillText(formatMs(totalTimeMs), 84, 660);

  ctx.font = "700 58px sans-serif";
  ctx.fillStyle = "#FFFFFF";
  ctx.fillText(`Medal: ${medalLabel}`, 84, 760);

  ctx.globalAlpha = 0.18;
  ctx.fillStyle = "#FFFFFF";
  for (let i = 0; i < 12; i += 1) {
    ctx.beginPath();
    ctx.arc(120 + i * 78, 900, 10 + (i % 3) * 6, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;
  ctx.fillStyle = "#FFFFFF";
  ctx.font = "600 36px sans-serif";
  ctx.fillText("Trained on KidQuest · kidquest.app", 84, 1010);

  return canvas.toDataURL("image/png");
}

export function downloadDataUrl(filename, dataUrl) {
  const a = document.createElement("a");
  a.href = dataUrl;
  a.download = filename;
  a.click();
}
