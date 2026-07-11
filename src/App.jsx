import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import AuroraBackground from "./components/background/AuroraBackground.jsx";
import PageTransition from "./components/animations/PageTransition.jsx";
import { usePageTitle } from "./hooks/usePageTitle.js";
import Home from "./pages/Home.jsx";
import Devices from "./pages/Devices.jsx";
import Socials from "./pages/Socials.jsx";
import Projects from "./pages/Projects.jsx";
import ValorantStats from "./pages/ValorantStats.jsx";
import LastfmNowPlaying from "./pages/LastfmNowPlaying.jsx";
import NotFound from "./pages/NotFound.jsx";

export default function App() {
  const location = useLocation();
  usePageTitle();

  return (
    <>
      <AuroraBackground />
      <AnimatePresence mode="wait" initial={false}>
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<PageTransition><Home /></PageTransition>} />
          <Route path="/devices" element={<PageTransition><Devices /></PageTransition>} />
          <Route path="/socials" element={<PageTransition><Socials /></PageTransition>} />
          <Route path="/projects" element={<PageTransition><Projects /></PageTransition>} />
          <Route path="/valorant-stats" element={<PageTransition><ValorantStats /></PageTransition>} />
          <Route path="/lastfm-now-playing" element={<PageTransition><LastfmNowPlaying /></PageTransition>} />
          <Route path="*" element={<PageTransition><NotFound /></PageTransition>} />
        </Routes>
      </AnimatePresence>
    </>
  );
}
