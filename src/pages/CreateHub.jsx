import { useNavigate } from "react-router-dom";
import { ComingSoonPanel } from "../components/ui/ComingSoonPanel";

export default function CreateHub() {
  const navigate = useNavigate();
  return (
    <ComingSoonPanel
      title="Create"
      subtitle="Life Explorer, journals, and stories are coming soon."
      onBack={() => navigate("/home")}
    />
  );
}
