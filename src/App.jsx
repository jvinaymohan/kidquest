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
import About from "./pages/About";
import Impact from "./pages/Impact";
import MultiplicationHub from "./pages/MultiplicationHub";
import MultiplicationTable from "./pages/MultiplicationTable";
import MultiplicationLearn from "./pages/MultiplicationLearn";
import MultiplicationPractice from "./pages/MultiplicationPractice";
import MultiplicationDrill from "./pages/MultiplicationDrill";
import MultiplicationBoss from "./pages/MultiplicationBoss";
import MultiplicationSpeedRun from "./pages/MultiplicationSpeedRun";
import MultiplicationResults from "./pages/MultiplicationResults";
import MultiplicationReview from "./pages/MultiplicationReview";
import ExploreHub from "./pages/ExploreHub";
import CreateHub from "./pages/CreateHub";
import CompeteHub from "./pages/CompeteHub";

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
          <Route path="/explore" element={<ExploreHub />} />
          <Route path="/create" element={<CreateHub />} />
          <Route path="/compete" element={<CompeteHub />} />
          <Route path="/subject/:subjectId" element={<Subject />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/about" element={<About />} />
          <Route path="/impact" element={<Impact />} />
          <Route path="/multiplication" element={<MultiplicationHub />} />
          <Route path="/multiplication/review" element={<MultiplicationReview />} />
          <Route path="/multiplication/table/:tableNumber" element={<MultiplicationTable />} />
          <Route path="/multiplication/table/:tableNumber/learn" element={<MultiplicationLearn />} />
          <Route path="/multiplication/table/:tableNumber/practice" element={<MultiplicationPractice />} />
          <Route path="/multiplication/table/:tableNumber/drill" element={<MultiplicationDrill />} />
          <Route path="/multiplication/table/:tableNumber/boss" element={<MultiplicationBoss />} />
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
          <Route path="/multiplication/speed-run" element={<MultiplicationSpeedRun />} />
          <Route path="/multiplication/results" element={<MultiplicationResults />} />
        </Route>

        <Route path="*" element={<Navigate to="/home" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
