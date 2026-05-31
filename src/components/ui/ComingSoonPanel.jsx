import { ChevronLeft } from "lucide-react";
import { Button } from "./Button";

export function ComingSoonPanel({ title, subtitle, onBack, backLabel = "Home" }) {
  return (
    <div className="flex flex-col gap-4 py-4">
      {onBack && (
        <button
          type="button"
          onClick={onBack}
          className="self-start flex items-center gap-1 rounded-pill px-2 py-1 font-display font-extrabold text-ink/70 focus-ring"
        >
          <ChevronLeft size={20} /> {backLabel}
        </button>
      )}
      <div className="chunky-card p-8 text-center">
        <p className="text-4xl" aria-hidden>
          🚧
        </p>
        <h1 className="mt-3 font-display text-2xl font-extrabold">{title}</h1>
        <p className="mt-2 text-sm font-bold text-ink/60">{subtitle}</p>
        <p className="mt-4 text-xs font-semibold text-ink/50">
          Geography, Multiplication Camp, and Solar System are ready to play from Home.
        </p>
        {onBack && (
          <Button className="mt-6 w-full" onClick={onBack}>
            Back to Home
          </Button>
        )}
      </div>
    </div>
  );
}
