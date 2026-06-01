import { useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Globe2 } from "lucide-react";
import { useAppStore } from "../store/useAppStore";
import { useGeographyStore } from "../store/useGeographyStore";
import {
  CONTINENTS,
  GEO_TIERS,
  GEO_TRACKS,
} from "../data/geography/mastery";
import { COUNTRIES } from "../data/geography/countries";
import { ProgressRing } from "../components/ui/ProgressRing";

export default function GeographyMastery() {
  const navigate = useNavigate();
  const { tierId } = useParams();
  const ageGroup = useAppStore((s) => s.ageGroup);
  const mastery = useGeographyStore((s) => s.mastery);
  const masteredCount = useGeographyStore((s) => s.masteredCountryCount);

  const [continent, setContinent] = useState(null);

  const tier = GEO_TIERS.find((t) => t.id === tierId);

  if (tierId && !tier) {
    return (
      <div className="text-center p-6">
        <p className="font-display font-extrabold">Tier not found</p>
        <Link to="/geography/mastery" className="text-geography font-bold mt-2 inline-block">
          Back to mastery
        </Link>
      </div>
    );
  }

  if (!tierId) {
    return (
      <div className="flex flex-col gap-4 pb-8">
        <button
          type="button"
          onClick={() => navigate("/subject/geography")}
          className="self-start flex items-center gap-1 font-display font-extrabold text-ink/70 focus-ring rounded-pill px-2 py-1"
        >
          <ChevronLeft size={20} /> Geography
        </button>

        <header className="rounded-3xl bg-gradient-to-br from-[#E1F5EE] via-white to-[#B5E8E1]/40 p-5 ring-1 ring-geography/20 text-center">
          <Globe2 className="mx-auto text-geography" size={36} />
          <h1 className="mt-2 font-display text-2xl font-extrabold text-geography">
            Geography Mastery
          </h1>
          <p className="mt-1 text-sm font-bold text-ink/60">
            {masteredCount()} / {COUNTRIES.length} countries in your deck
          </p>
        </header>

        <ul className="flex flex-col gap-3">
          {GEO_TIERS.map((t, i) => {
            const pct = t.masteryTarget
              ? Math.min(1, masteredCount() / t.masteryTarget)
              : (mastery[t.id]?.sessions ?? 0) > 0
              ? 0.5
              : 0;
            return (
              <motion.li
                key={t.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <button
                  type="button"
                  onClick={() => navigate(`/geography/mastery/${t.id}`)}
                  className="w-full text-left rounded-3xl p-4 flex items-center gap-3 focus-ring ring-1 ring-ink/[0.08] shadow-sm bg-white hover:shadow-md"
                >
                  <span className="text-3xl">{t.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <p className="font-display font-extrabold text-lg text-geography">{t.title}</p>
                    <p className="text-xs font-medium text-ink/55 mt-0.5">{t.blurb}</p>
                    <p className="text-[10px] font-bold text-ink/45 mt-1">
                      {t.questionCount} questions per session
                    </p>
                  </div>
                  <ProgressRing value={pct} size={48} stroke={6} color="var(--geography)">
                    <span className="text-[10px] font-extrabold">
                      {Math.round(pct * 100)}%
                    </span>
                  </ProgressRing>
                  <ChevronRight className="text-ink/25 shrink-0" size={20} />
                </button>
              </motion.li>
            );
          })}
        </ul>

        <p className="text-[11px] font-medium text-ink/45 text-center px-2">
          Missed countries go to your review deck — spaced repetition until mastery.
        </p>
      </div>
    );
  }

  if (tier.id === "regional" && !continent) {
    return (
      <div className="flex flex-col gap-4 pb-8">
        <button
          type="button"
          onClick={() => navigate("/geography/mastery")}
          className="self-start flex items-center gap-1 font-display font-extrabold text-ink/70 focus-ring rounded-pill px-2 py-1"
        >
          <ChevronLeft size={20} /> Mastery tiers
        </button>
        <h1 className="font-display text-2xl font-extrabold text-center text-geography">
          Pick a continent
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {CONTINENTS.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setContinent(c)}
              className="chunky-card p-4 text-left focus-ring hover:shadow-md"
            >
              <p className="font-display font-extrabold text-lg">{c}</p>
              <p className="text-xs font-bold text-ink/55 mt-1">
                {COUNTRIES.filter((x) => x.continent === c).length} countries
              </p>
            </button>
          ))}
        </div>
      </div>
    );
  }

  const pickContinent = tier.id === "regional" ? continent : null;

  return (
    <div className="flex flex-col gap-4 pb-8">
      <button
        type="button"
        onClick={() =>
          tier.id === "regional" && continent
            ? setContinent(null)
            : navigate("/geography/mastery")
        }
        className="self-start flex items-center gap-1 font-display font-extrabold text-ink/70 focus-ring rounded-pill px-2 py-1"
      >
        <ChevronLeft size={20} /> Back
      </button>

      <h1 className="font-display text-2xl font-extrabold text-center text-geography">
        {tier.emoji} {tier.title}
        {pickContinent && ` · ${pickContinent}`}
      </h1>
      <p className="text-sm font-bold text-ink/60 text-center">
        Choose a track — {tier.questionCount} questions
      </p>

      <ul className="flex flex-col gap-3">
        {GEO_TRACKS.map((track) => (
          <li key={track.id}>
            <button
              type="button"
              onClick={() => {
                const qs = new URLSearchParams();
                if (pickContinent) qs.set("continent", pickContinent);
                qs.set("track", track.id);
                navigate(
                  `/geography/mastery/${tier.id}/session?${qs.toString()}`
                );
              }}
              className="w-full text-left rounded-3xl p-4 flex items-center gap-3 focus-ring ring-1 ring-ink/[0.08] shadow-sm bg-white hover:shadow-md"
            >
              <span className="text-2xl">{track.emoji}</span>
              <div className="flex-1">
                <p className="font-display font-extrabold">{track.title}</p>
              </div>
              <ChevronRight className="text-ink/25" size={20} />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
