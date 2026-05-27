import { useState } from "react";
import { CountryGallery } from "./CountryGallery";
import { CountryDetail } from "./CountryDetail";
import { WorldMap } from "./WorldMap";
import { useLearnTimer } from "../../hooks/useLearnTimer";

export function GeographyLearn() {
  useLearnTimer("geography");
  const [detailCode, setDetailCode] = useState(null);
  const [mapContinent, setMapContinent] = useState("world");
  const [subTab, setSubTab] = useState("browse");

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-2">
        <SubTab active={subTab === "browse"} onClick={() => setSubTab("browse")} label="Countries" />
        <SubTab active={subTab === "map"} onClick={() => setSubTab("map")} label="World map" />
      </div>
      {subTab === "browse" ? (
        <CountryGallery onSelectCountry={setDetailCode} />
      ) : (
        <div className="flex flex-col gap-3">
          <p className="text-sm font-bold text-ink/70">Tap any country to learn about it.</p>
          <div className="flex flex-wrap gap-2">
            {["world", ...["Africa", "Asia", "Europe", "Americas", "Oceania"]].map((z) => (
              <button
                key={z}
                type="button"
                onClick={() => setMapContinent(z)}
                className={`px-3 py-1 rounded-pill text-xs font-display font-extrabold border-[2.5px] focus-ring ${
                  mapContinent === z ? "bg-secondary text-white border-ink/20" : "bg-white border-ink/15"
                }`}
              >
                {z === "world" ? "Whole world" : z}
              </button>
            ))}
          </div>
          <WorldMap
            zoomTo={mapContinent}
            interactive
            onCountryClick={(code) => setDetailCode(code)}
          />
        </div>
      )}
      {detailCode && <CountryDetail code={detailCode} onClose={() => setDetailCode(null)} />}
    </div>
  );
}

function SubTab({ active, onClick, label }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex-1 py-2 rounded-pill font-display font-extrabold text-sm border-[2.5px] focus-ring ${
        active ? "bg-white border-ink/20 shadow-chunkySm" : "border-transparent text-ink/60"
      }`}
    >
      {label}
    </button>
  );
}
