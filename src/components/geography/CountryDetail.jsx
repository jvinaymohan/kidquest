import { motion } from "framer-motion";
import { X } from "lucide-react";
import { Flag } from "../quiz/Flag";
import { getCountry } from "../../data/geography/countries";

export function CountryDetail({ code, onClose }) {
  const country = getCountry(code);
  if (!country) return null;

  return (
    <motion.div
      className="fixed inset-0 z-50 grid place-items-end sm:place-items-center p-4 bg-ink/40"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      onClick={onClose}
    >
      <motion.div
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-white rounded-chunky border-[4px] border-ink/15 shadow-chunkyXl p-5 w-full max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-3">
            <Flag code={country.code} size="xl" />
            <div>
              <h3 className="font-display text-2xl font-extrabold">{country.name}</h3>
              <p className="text-sm font-bold text-ink/60">
                {country.continent} · {country.subregion}
              </p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="w-10 h-10 grid place-items-center rounded-full border-[2.5px] border-ink/15 focus-ring">
            <X size={20} />
          </button>
        </div>
        <dl className="mt-4 grid grid-cols-2 gap-3 text-sm font-bold">
          <div className="chunky-card p-3 col-span-2 bg-bg">
            <dt className="text-ink/50 text-xs uppercase">Capital</dt>
            <dd className="font-display text-lg">{country.capital || "—"}</dd>
          </div>
          {country.currency && (
            <div className="chunky-card p-3 bg-bg">
              <dt className="text-ink/50 text-xs uppercase">Currency</dt>
              <dd>
                {country.currency.symbol} {country.currency.name}
              </dd>
            </div>
          )}
          <div className="chunky-card p-3 bg-bg">
            <dt className="text-ink/50 text-xs uppercase">Code</dt>
            <dd>{country.code}</dd>
          </div>
        </dl>
        <p className="mt-3 text-sm font-bold text-ink/80 leading-relaxed">{country.funFact}</p>
      </motion.div>
    </motion.div>
  );
}
