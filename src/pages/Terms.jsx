import { LegalPageLayout } from "../components/legal/LegalPageLayout";
import { LEGAL_CONTACT_EMAIL } from "../data/legal";

export default function Terms() {
  return (
    <LegalPageLayout title="Terms of Use">
      <p>
        By using KidQuest, you agree to these terms. If you do not agree, do not use the service. If
        you are under 18, your parent or guardian must accept these terms on your behalf.
      </p>

      <h2 className="font-display text-lg font-extrabold text-ink mt-4">The service</h2>
      <p>
        KidQuest offers educational games, lessons, and family tools. Content is provided for learning
        and entertainment, not as professional advice (medical, legal, financial, etc.).
      </p>

      <h2 className="font-display text-lg font-extrabold text-ink mt-4">Accounts</h2>
      <ul className="list-disc pl-5 space-y-2">
        <li>You must provide accurate information and keep your password secure.</li>
        <li>Parents and guardians are responsible for children&apos;s use of their accounts.</li>
        <li>Teachers may create classrooms and assignments for educational purposes.</li>
        <li>We may suspend accounts that violate these terms or harm other users.</li>
      </ul>

      <h2 className="font-display text-lg font-extrabold text-ink mt-4">Acceptable use</h2>
      <ul className="list-disc pl-5 space-y-2">
        <li>Use KidQuest for lawful, educational, and respectful purposes.</li>
        <li>Do not harass others, post harmful content, or attempt to bypass safety features.</li>
        <li>Do not scrape, reverse-engineer, or overload our systems.</li>
        <li>Do not share account credentials or parent PINs.</li>
      </ul>

      <h2 className="font-display text-lg font-extrabold text-ink mt-4">User content</h2>
      <p>
        Content you create (such as journals or stories) remains yours. You grant us a limited license
        to store and display it back to you within the app. We may remove content that violates these
        terms. Community submissions from adults are moderated before any child can see them.
      </p>

      <h2 className="font-display text-lg font-extrabold text-ink mt-4">Social features</h2>
      <p>
        KidQuest does not offer open chat between children. Friends and competitions use invite codes
        and asynchronous challenges under parent-aware rules described in our Privacy Policy.
      </p>

      <h2 className="font-display text-lg font-extrabold text-ink mt-4">Disclaimer</h2>
      <p>
        The service is provided &quot;as is.&quot; We do not guarantee uninterrupted access or that every
        lesson will meet your educational requirements.
      </p>

      <h2 className="font-display text-lg font-extrabold text-ink mt-4">Changes</h2>
      <p>
        We may update these terms. Continued use after changes means acceptance. Material changes will
        be noted in the app or by email where appropriate.
      </p>

      <h2 className="font-display text-lg font-extrabold text-ink mt-4">Contact</h2>
      <p>
        <a href={`mailto:${LEGAL_CONTACT_EMAIL}`} className="text-primary underline">
          {LEGAL_CONTACT_EMAIL}
        </a>
      </p>
    </LegalPageLayout>
  );
}
