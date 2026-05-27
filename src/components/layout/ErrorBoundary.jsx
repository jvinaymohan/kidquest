import { Component } from "react";

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    if (typeof console !== "undefined") {
      console.error("KidQuest error:", error, info);
    }
  }

  reset = () => this.setState({ hasError: false, error: null });

  hardReset = () => {
    try {
      localStorage.removeItem("kidquest-state-v1");
    } catch {}
    window.location.href = "/";
  };

  render() {
    if (!this.state.hasError) return this.props.children;
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-bg">
        <div className="chunky-card p-6 max-w-md w-full text-center">
          <div className="text-6xl mb-2" aria-hidden>😅</div>
          <h1 className="font-display text-2xl font-extrabold">Oops! Something tripped us up.</h1>
          <p className="font-body font-bold text-ink/70 mt-1">
            Don't worry — your progress is saved. Try going back home, or reset if it keeps happening.
          </p>
          <div className="grid grid-cols-2 gap-3 mt-4">
            <button
              onClick={this.reset}
              className="chunky-btn bg-secondary text-white"
            >
              Try again
            </button>
            <button
              onClick={() => (window.location.href = "/")}
              className="chunky-btn bg-primary text-white"
            >
              Go Home
            </button>
          </div>
          <button
            onClick={this.hardReset}
            className="mt-3 text-xs font-bold text-ink/50 underline focus-ring rounded px-2 py-1"
          >
            Reset everything
          </button>
        </div>
      </div>
    );
  }
}
