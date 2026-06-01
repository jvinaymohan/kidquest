import { Flag } from "../quiz/Flag";
import { WorldMap } from "./WorldMap";
import { getCountry } from "../../data/geography/countries";

/** Rich feedback when a geography question is missed. */
export function CountryWrongAnswerPanel({ countryCode, correctAnswer }) {
  const country = getCountry(countryCode);
  if (!country) {
    return (
      <div className="rounded-2xl bg-error/10 px-4 py-3 text-center ring-2 ring-error/30">
        <p className="font-display text-lg font-extrabold text-error">
          Correct answer: {correctAnswer}
        </p>
      </div>
    );
  }

  const extraFacts = [
    country.capital && `Capital: ${country.capital}`,
    country.currency?.name && `Currency: ${country.currency.name}`,
    country.subregion && `Region: ${country.subregion}`,
  ].filter(Boolean);

  return (
    <div className="rounded-2xl bg-gradient-to-br from-error/10 via-white to-geography/10 p-4 ring-2 ring-error/25 flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <Flag code={country.code} size="lg" />
        <div className="text-left min-w-0">
          <p className="font-display text-xl font-extrabold text-ink leading-tight">
            {country.name} {country.flag ?? "🌍"}
          </p>
          <p className="text-sm font-bold text-ink/60">{country.continent}</p>
        </div>
      </div>

      <p className="text-sm font-bold text-error text-left">
        Correct answer: <span className="font-display font-extrabold">{correctAnswer}</span>
      </p>

      <ul className="text-left text-sm font-bold text-ink/75 space-y-1">
        {extraFacts.map((f) => (
          <li key={f}>• {f}</li>
        ))}
        <li>• {country.funFact}</li>
      </ul>

      <div className="rounded-xl overflow-hidden ring-1 ring-ink/10">
        <WorldMap
          zoomTo={country.continent}
          revealCode={country.code}
          highlightedCodes={[country.code]}
          interactive={false}
        />
      </div>
    </div>
  );
}
