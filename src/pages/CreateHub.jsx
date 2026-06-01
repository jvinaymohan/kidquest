import { Palette } from "lucide-react";
import { HubPageLayout } from "../components/layout/HubPageLayout";

export default function CreateHub() {
  return (
    <HubPageLayout
      title="Create"
      subtitle="Life Explorer, journals, and stories are coming soon."
      icon={<Palette className="mx-auto text-[#ff8fa3]" size={36} aria-hidden />}
    >
      <div className="hub-glass-panel p-8 text-center">
        <p className="text-4xl" aria-hidden>
          🚧
        </p>
        <p className="mt-3 font-display text-lg font-extrabold text-white">
          We&apos;re building this world!
        </p>
        <p className="mt-2 text-sm font-bold text-white/55">
          Use Explore or Play from the bottom nav while you wait.
        </p>
      </div>
    </HubPageLayout>
  );
}
