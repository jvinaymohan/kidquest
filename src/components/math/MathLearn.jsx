import { TimesTableGrid } from "./TimesTableGrid";
import { FlashcardDrill } from "./FlashcardDrill";
import { useLearnTimer } from "../../hooks/useLearnTimer";

export function MathLearn() {
  useLearnTimer("math");

  return (
    <div className="flex flex-col gap-6">
      <div className="chunky-card p-4 bg-gradient-to-br from-[#C5DBFF] to-white">
        <h2 className="font-display font-extrabold text-lg">Times tables practice</h2>
        <p className="text-sm font-bold text-ink/70 mt-1">
          Build speed with numbers you&apos;ll use every day — shopping, sports, cooking, and class.
        </p>
      </div>
      <section>
        <h3 className="font-display font-extrabold text-lg mb-2">Times table grid</h3>
        <TimesTableGrid />
      </section>
      <section>
        <h3 className="font-display font-extrabold text-lg mb-2">Flashcard drill</h3>
        <FlashcardDrill />
      </section>
    </div>
  );
}
