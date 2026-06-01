import { Link } from "react-router-dom";
import { GoogleSignInButton } from "../auth/GoogleSignInButton";
import { isGoogleOAuthEnabled } from "../../lib/featureFlags";
import { GETTING_STARTED_ITEMS } from "./elegantContent";

export function LandingGettingStarted() {
  return (
    <section className="landing-getting-started" aria-labelledby="landing-getting-started-title">
      <h2 id="landing-getting-started-title" className="landing-section-label">
        Getting started
      </h2>
      <div className="landing-start-row">
        {GETTING_STARTED_ITEMS.map((item) => (
          <Link key={item.to} to={item.to} className="landing-start-card focus-ring">
            <span className="landing-start-icon" aria-hidden>
              {item.icon}
            </span>
            <span className="landing-start-label">{item.label}</span>
            <span className="landing-start-sub">{item.sub}</span>
          </Link>
        ))}
      </div>
      {isGoogleOAuthEnabled && (
        <div className="landing-google-wrap">
          <div className="landing-google-divider" aria-hidden>
            <span>or</span>
          </div>
          <GoogleSignInButton />
        </div>
      )}
    </section>
  );
}
