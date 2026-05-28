import { ErrorBoundary } from "./ErrorBoundary";

export function RouteErrorBoundary({ children, label = "this page" }) {
  return (
    <ErrorBoundary
      renderFallback={({ reset }) => (
        <div className="chunky-card p-6 text-center my-4">
          <div className="text-4xl mb-2" aria-hidden>
            🛠️
          </div>
          <h2 className="font-display text-xl font-extrabold">Hmm, {label} hit a snag</h2>
          <p className="text-sm font-bold text-ink/65 mt-1">Your progress is safe. Try again or head home.</p>
          <div className="flex gap-2 justify-center mt-4">
            <button type="button" onClick={reset} className="chunky-btn bg-secondary text-white text-sm px-4 py-2">
              Try again
            </button>
            <a href="/home" className="chunky-btn bg-primary text-white text-sm px-4 py-2">
              Home
            </a>
          </div>
        </div>
      )}
    >
      {children}
    </ErrorBoundary>
  );
}
