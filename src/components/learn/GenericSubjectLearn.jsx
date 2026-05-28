import { Link } from "react-router-dom";
import { getLessonsFor } from "../../data/subjects";
import { FlashcardDeck } from "./FlashcardDeck";
import { useAppStore } from "../../store/useAppStore";

export function GenericSubjectLearn({ subjectId, subjectName }) {
  const ageGroup = useAppStore((s) => s.ageGroup);
  const lessons = getLessonsFor(subjectId, ageGroup).slice(0, 6);
  const cards = lessons.flatMap((l) =>
    (l.concepts ?? []).slice(0, 2).map((c) => ({
      front: c.title ?? l.title,
      back: c.body ?? c.text ?? "Explore more in lessons!",
    }))
  );

  if (!cards.length) {
    return (
      <p className="text-sm font-bold text-ink/65">
        Learn cards coming soon — try the lesson path first.{" "}
        <Link to={`/subject/${subjectId}`} className="text-primary underline">
          Lessons
        </Link>
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm font-bold text-ink/65">
        Phase 1 · Learn — flip through key ideas for {subjectName}.
      </p>
      <FlashcardDeck cards={cards} />
      <Link
        to={`/lesson/${lessons[0]?.id}`}
        className="text-center text-sm font-display font-extrabold text-primary"
      >
        Start first lesson →
      </Link>
    </div>
  );
}
