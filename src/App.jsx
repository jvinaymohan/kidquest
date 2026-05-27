import { BrowserRouter, Navigate, Route, Routes, useLocation } from "react-router-dom";
import { useAppStore } from "./store/useAppStore";
import { AppShell } from "./components/layout/AppShell";
import Onboarding from "./pages/Onboarding";
import Home from "./pages/Home";
import Subject from "./pages/Subject";
import Lesson from "./pages/Lesson";
import Results from "./pages/Results";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";

function RequireOnboarded({ children }) {
  const onboarded = useAppStore((s) => s.onboarded);
  const location = useLocation();
  if (!onboarded && location.pathname !== "/onboarding") {
    return <Navigate to="/onboarding" replace />;
  }
  return children;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/onboarding" element={<Onboarding />} />
        <Route
          element={
            <RequireOnboarded>
              <AppShell />
            </RequireOnboarded>
          }
        >
          <Route path="/" element={<Navigate to="/home" replace />} />
          <Route path="/home" element={<Home />} />
          <Route path="/subject/:subjectId" element={<Subject />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/settings" element={<Settings />} />
        </Route>

        <Route
          element={
            <RequireOnboarded>
              <AppShell hideTop hideBottom />
            </RequireOnboarded>
          }
        >
          <Route path="/lesson/:lessonId" element={<Lesson />} />
          <Route path="/results/:lessonId" element={<Results />} />
        </Route>

        <Route path="*" element={<Navigate to="/home" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
