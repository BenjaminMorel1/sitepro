import { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import Platform from "./pages/Platform";
import Solutions from "./pages/Solutions";
import Company from "./pages/Company";
import Contact from "./pages/Contact";
import MusicPage from "./MusicPage";
import MusicWidget from "./components/MusicWidget";
import { LanguageProvider } from "./i18n/LanguageContext";
import { trackPageView } from "./analytics";

// compte une visite à chaque changement de page
const PageTracker = () => {
  const { pathname } = useLocation();
  useEffect(() => trackPageView(pathname), [pathname]);
  return null;
};

const App = () => {
  return (
    <LanguageProvider>
      <PageTracker />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/platform" element={<Platform />} />
        <Route path="/music" element={<MusicPage />} />
        <Route path="/solutions" element={<Solutions />} />
        <Route path="/company" element={<Company />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
      <MusicWidget />
    </LanguageProvider>
  );
};

export default App;
