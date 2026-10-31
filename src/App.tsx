import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Platform from "./pages/Platform";
import Solutions from "./pages/Solutions";
import Company from "./pages/Company";
import Contact from "./pages/Contact";
import MusicPage from "./MusicPage";
import MusicWidget from "./components/MusicWidget";
import { LanguageProvider } from "./i18n/LanguageContext";

const App = () => {
  return (
    <LanguageProvider>
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
