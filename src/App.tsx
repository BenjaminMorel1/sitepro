import { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { MotionConfig } from "motion/react";
import Home from "./pages/Home";
import Platform from "./pages/Platform";
import Blog from "./pages/Blog";
import Lectures from "./pages/Lectures";
import Blog2 from "./pages/Blog2";
import Contact from "./pages/Contact";
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
          <Route path="/blog" element={<Blog />} />
          <Route path="/lectures" element={<Lectures />} />
          <Route path="/blog2" element={<Blog2 />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/test" element={<Test />} />
        </Routes>
        <MusicWidget />
      </LanguageProvider>
    </MotionConfig>
  );
};

export default App;
