import { Link } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { LEGAL_LAST_UPDATED } from "../../data/legal";

export function LegalPageLayout({ title, children }) {
  return (
    <div className="min-h-screen bg-cream px-4 py-8 max-w-2xl mx-auto">
      <Link
        to="/landing"
        className="inline-flex items-center gap-1 text-sm font-bold text-ink/70 focus-ring rounded px-2 py-1 mb-4"
      >
        <ChevronLeft size={18} /> Back
      </Link>
      <h1 className="font-display text-3xl font-extrabold mb-1">{title}</h1>
      <p className="text-xs font-bold text-ink/50 mb-6">Last updated: {LEGAL_LAST_UPDATED}</p>
      <article className="chunky-card p-6 prose-legal text-sm font-bold text-ink/80 space-y-4 leading-relaxed">
        {children}
      </article>
      <nav className="flex flex-wrap gap-4 mt-6 text-xs font-bold text-primary">
        <Link to="/privacy">Privacy Policy</Link>
        <Link to="/terms">Terms of Use</Link>
        <Link to="/about">About us</Link>
        <Link to="/register">Create account</Link>
      </nav>
    </div>
  );
}
