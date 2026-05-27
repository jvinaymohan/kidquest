import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { COUNTRIES, CONTINENTS } from "../../data/geography/countries";
import { Flag } from "../quiz/Flag";
import { FlashcardDeck } from "../learn/FlashcardDeck";

export function CountryGallery({ onSelectCountry }) {
  const [query, setQuery] = useState("");
  const [continent, setContinent] = useState("all");
  const [mode, setMode] = useState("browse");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return COUNTRIES.filter((c) => {
      if (continent !== "all" && c.continent !== continent) return false;
      if (!q) return true;
      return c.name.toLowerCase().includes(q) || c.code.toLowerCase().includes(q);
    });
  }, [query, continent]);

  const flagCards = useMemo(
    () =>
      filtered.slice(0, 40).map((c) => ({
        front: <Flag code={c.code} size="xl" />,
        back: (
          <div>
            <div className="font-display text-2xl font-extrabold">{c.name}</div>
            <div className="text-sm font-bold text-ink/60 mt-1">{c.continent}</div>
          </div>
        ),
      })),
    [filtered]
  );

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm font-bold text-ink/70">
        Explore all {COUNTRIES.length} countries — no quiz pressure, just curiosity.
      </p>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setMode("browse")}
          className={`flex-1 py-2 rounded-pill font-display font-extrabold text-sm border-[2.5px] ${mode === "browse" ? "bg-white border-ink/20 shadow-chunkySm" : "border-transparent text-ink/60"}`}
        >
          Browse
        </button>
        <button
          type="button"
          onClick={() => setMode("flags")}
          className={`flex-1 py-2 rounded-pill font-display font-extrabold text-sm border-[2.5px] ${mode === "flags" ? "bg-white border-ink/20 shadow-chunkySm" : "border-transparent text-ink/60"}`}
        >
          Flag flashcards
        </button>
      </div>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-ink/40" size={18} />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search country..."
          className="w-full pl-10 pr-4 py-3 rounded-chunky border-[3px] border-ink/15 font-bold focus-ring"
        />
      </div>
      <div className="flex flex-wrap gap-2">
        <FilterChip active={continent === "all"} onClick={() => setContinent("all")} label="All" />
        {CONTINENTS.map((c) => (
          <FilterChip key={c} active={continent === c} onClick={() => setContinent(c)} label={c} />
        ))}
      </div>
      {mode === "flags" ? (
        <FlashcardDeck cards={flagCards} emptyMessage="No countries match your search." />
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-[50vh] overflow-y-auto no-scrollbar">
          {filtered.map((c) => (
            <button
              key={c.code}
              type="button"
              onClick={() => onSelectCountry(c.code)}
              className="chunky-card p-3 flex items-center gap-2 text-left focus-ring hover:-translate-y-0.5 transition"
            >
              <Flag code={c.code} size="md" />
              <span className="font-display font-extrabold text-sm truncate">{c.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function FilterChip({ active, onClick, label }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-3 py-1 rounded-pill text-xs font-display font-extrabold border-[2.5px] focus-ring ${
        active ? "bg-primary text-white border-ink/20" : "bg-white border-ink/15 text-ink/70"
      }`}
    >
      {label}
    </button>
  );
}
