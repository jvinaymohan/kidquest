import { LegalPageLayout } from "../components/legal/LegalPageLayout";
import { LEGAL_CONTACT_EMAIL } from "../data/legal";

export default function Privacy() {
  return (
    <LegalPageLayout title="Privacy Policy">
      <p>
        KidQuest (&quot;we,&quot; &quot;our&quot;) provides a learning app for children and families. This policy
        explains what we collect, why, and your choices. We design for minimal data collection and
        parent control.
      </p>

      <h2 className="font-display text-lg font-extrabold text-ink mt-4">Who this applies to</h2>
      <p>
        Children under 13 should use KidQuest with a parent or guardian who creates or approves the
        account. Parents, teachers, and guardians are responsible for supervising use.
      </p>

      <h2 className="font-display text-lg font-extrabold text-ink mt-4">Information we collect</h2>
      <ul className="list-disc pl-5 space-y-2">
        <li>
          <strong>Account:</strong> email address, password (stored securely by our auth provider),
          display name, age group, avatar choices, and role (kid, parent, or teacher).
        </li>
        <li>
          <strong>Learning progress:</strong> lesson scores, multiplication mastery, badges, streaks,
          time per subject, and similar educational records.
        </li>
        <li>
          <strong>Optional creations:</strong> Life Explorer entries (map pins, journals, stories) you
          choose to save — private by default.
        </li>
        <li>
          <strong>Technical:</strong> basic device/browser data needed to run the app and prevent abuse.
        </li>
      </ul>

      <h2 className="font-display text-lg font-extrabold text-ink mt-4">What we do not do</h2>
      <ul className="list-disc pl-5 space-y-2">
        <li>No open chat between children.</li>
        <li>No public profiles for minors.</li>
        <li>No selling of personal information.</li>
        <li>No behavioral advertising targeted at children.</li>
        <li>No precise location tracking or sharing.</li>
      </ul>

      <h2 className="font-display text-lg font-extrabold text-ink mt-4">How we use information</h2>
      <p>
        To provide learning features, sync progress across devices, show leaderboards (display name and
        scores only), support classrooms and assignments, improve the product, and keep the platform
        safe.
      </p>

      <h2 className="font-display text-lg font-extrabold text-ink mt-4">Parent rights</h2>
      <p>
        Parents and guardians may review progress in the app, export data from Settings, request
        correction, or ask us to delete an account by emailing{" "}
        <a href={`mailto:${LEGAL_CONTACT_EMAIL}`} className="text-primary underline">
          {LEGAL_CONTACT_EMAIL}
        </a>
        . We will verify the request comes from the account holder or parent.
      </p>

      <h2 className="font-display text-lg font-extrabold text-ink mt-4">Third-party services</h2>
      <p>
        We use Supabase (authentication and database hosting) and Vercel (app hosting). Google
        sign-in is optional if enabled. These providers process data under their terms and our
        configuration.
      </p>

      <h2 className="font-display text-lg font-extrabold text-ink mt-4">Security</h2>
      <p>
        We use industry-standard practices including encrypted connections and row-level security on
        cloud data. No system is 100% secure; please use a strong password and change the default
        parent PIN.
      </p>

      <h2 className="font-display text-lg font-extrabold text-ink mt-4">Contact</h2>
      <p>
        Questions or deletion requests:{" "}
        <a href={`mailto:${LEGAL_CONTACT_EMAIL}`} className="text-primary underline">
          {LEGAL_CONTACT_EMAIL}
        </a>
      </p>
    </LegalPageLayout>
  );
}
