import { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { MotionConfig } from "motion/react";
import Home from "./pages/Home";
import Platform from "./pages/Platform";
import Solutions from "./pages/Solutions";
import Company from "./pages/Company";
import Contact from "./pages/Contact";
import Parcours from "./pages/Parcours";
import Test from "./pages/Test";
import MusicPage from "./MusicPage";
import MusicWidget from "./components/MusicWidget";
import { LanguageProvider } from "./i18n/LanguageContext";
import { trackPageView } from "./analytics";
import { scrollToTop, startSmoothScroll } from "./smoothScroll";

// compte une visite à chaque changement de page
const PageTracker = () => {
  const { pathname } = useLocation();
  useEffect(() => trackPageView(pathname), [pathname]);
  return null;
};

// chaque nouvelle page s'ouvre en haut
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(scrollToTop, [pathname]);
  return null;
};

const App = () => {
  useEffect(startSmoothScroll, []);

  return (
    // reducedMotion="user" : animations coupées si le visiteur l'a demandé à son système
    <MotionConfig reducedMotion="user">
      <LanguageProvider>
        <PageTracker />
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/platform" element={<Platform />} />
          <Route path="/music" element={<MusicPage />} />
          <Route path="/solutions" element={<Solutions />} />
          <Route path="/company" element={<Company />} />
          <Route path="/parcours" element={<Parcours />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/test" element={<Test />} />
        </Routes>
        <MusicWidget />
      </LanguageProvider>
    </MotionConfig>
  );
};

export default App;
