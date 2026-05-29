import { useEffect } from "react";
import { BrowserRouter, Navigate, Route, Routes, useLocation } from "react-router-dom";
import { useAppStore } from "./store/useAppStore";
import { useAuthStore } from "./store/useAuthStore";
import { isSupabaseEnabled } from "./lib/supabaseClient";
import { AppShell } from "./components/layout/AppShell";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import InviteRequest from "./pages/InviteRequest";
import ForgotPassword from "./pages/ForgotPassword";
import AuthCallback from "./pages/AuthCallback";
import ReviewHub from "./pages/ReviewHub";
import GeographyReview from "./pages/GeographyReview";
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
import GeographySprint from "./pages/GeographySprint";
import DailyDuel from "./pages/DailyDuel";
import Friends from "./pages/Friends";
import LifeExplorer from "./pages/LifeExplorer";
import LifeMap from "./pages/LifeMap";
import LifeJournal from "./pages/LifeJournal";
import LifeStory from "./pages/LifeStory";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import AdminDashboard from "./pages/AdminDashboard";
import { RequireAdmin } from "./components/auth/RequireAdmin";
import { GlobalFeedback } from "./components/feedback/GlobalFeedback";

function RequireOnboarded({ children }) {
  const onboarded = useAppStore((s) => s.onboarded);
  const session = useAuthStore((s) => s.session);
  const authReady = useAuthStore((s) => s.initialized);
  const location = useLocation();

  if (isSupabaseEnabled && !authReady) {
    return (
      <div className="min-h-screen grid place-items-center bg-bg">
        <p className="font-display text-lg font-extrabold text-ink/60">Loading KidQuest…</p>
      </div>
    );
  }

  if (isSupabaseEnabled && !session) {
    return <Navigate to="/landing" replace state={{ from: location.pathname }} />;
  }
  if (!onboarded && location.pathname !== "/onboarding") {
    return <Navigate to="/onboarding" replace />;
  }
  return children;
}

function PublicOnly({ children }) {
  const session = useAuthStore((s) => s.session);
  if (isSupabaseEnabled && session) {
    return <Navigate to="/home" replace />;
  }
  return children;
}

export default function App() {
  const initAuth = useAuthStore((s) => s.init);

  useEffect(() => {
    initAuth();
  }, [initAuth]);

  return (
    <BrowserRouter>
      <GlobalFeedback />
      <Routes>
        <Route
          path="/landing"
          element={
            <PublicOnly>
              <Landing />
            </PublicOnly>
          }
        />
        <Route
          path="/login"
          element={
            <PublicOnly>
              <Login />
            </PublicOnly>
          }
        />
        <Route
          path="/register"
          element={
            <PublicOnly>
              <Register />
            </PublicOnly>
          }
        />
        <Route path="/invite-request" element={<InviteRequest />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/auth/callback" element={<AuthCallback />} />
        <Route
          path="/admin"
          element={
            <RequireAdmin>
              <AppShell hideBottom />
            </RequireAdmin>
          }
        >
          <Route index element={<AdminDashboard />} />
        </Route>
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
          <Route path="/review" element={<ReviewHub />} />
          <Route path="/review/geography" element={<GeographyReview />} />
          <Route path="/explore" element={<ExploreHub />} />
          <Route path="/create" element={<CreateHub />} />
          <Route path="/compete" element={<CompeteHub />} />
          <Route path="/compete/geography-sprint" element={<GeographySprint />} />
          <Route path="/compete/daily-duel" element={<DailyDuel />} />
          <Route path="/compete/friends" element={<Friends />} />
          <Route path="/life" element={<LifeExplorer />} />
          <Route path="/life/map" element={<LifeMap />} />
          <Route path="/life/journal/:journalType" element={<LifeJournal />} />
          <Route path="/life/story" element={<LifeStory />} />
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
