import { Outlet, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { TopBar } from "./TopBar";
import { BottomNav } from "./BottomNav";

export function AppShell({ hideTop = false, hideBottom = false }) {
  const location = useLocation();
  return (
    <div className="min-h-screen flex flex-col">
      {!hideTop && <TopBar />}
      <main className="flex-1 relative overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="px-4 py-5 max-w-2xl mx-auto"
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>
      {!hideBottom && <BottomNav />}
    </div>
  );
}
