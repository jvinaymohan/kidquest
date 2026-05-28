import { usePreferencesStore } from "../../store/usePreferencesStore";

export function ParentConsentGate({ ageGroup, onConsented, children }) {
  const parentConsentAt = usePreferencesStore((s) => s.parentConsentAt);
  const setParentConsent = usePreferencesStore((s) => s.setParentConsent);

  const needsConsent = ageGroup === "explorer" && !parentConsentAt;

  if (!needsConsent) return children;

  return (
    <div className="chunky-card p-4 border-[3px] border-amber-300 bg-amber-50">
      <p className="font-display font-extrabold text-amber-900">Parent permission needed</p>
      <p className="text-sm font-bold text-amber-900/80 mt-1">
        For explorers under 13, a parent should approve social features (friends, sharing).
      </p>
      <button
        type="button"
        onClick={() => {
          setParentConsent();
          onConsented?.();
        }}
        className="mt-3 chunky-btn bg-primary text-white font-extrabold px-4 py-2"
      >
        A parent approves — continue
      </button>
    </div>
  );
}
