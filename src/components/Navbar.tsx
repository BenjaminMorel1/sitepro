import { Link } from "react-router-dom";
import logo from "../assets/logo-bm.png";
import { useLanguage } from "../i18n/LanguageContext";

const NAV_LINKS = [
  { key: "platform", to: "/platform", fr: "plateforme", en: "platform" },
  { key: "music", to: "/music", fr: "musique", en: "music" },
  { key: "solutions", to: "/solutions", fr: "solutions", en: "solutions" },
  { key: "company", to: "/company", fr: "entreprise", en: "company" },
  { key: "contact", to: "/contact", fr: "contact", en: "contact" },
] as const;

const GET_STARTED = { fr: "commencer", en: "get started" };

const Navbar = () => {
  const { lang, toggleLang } = useLanguage();

  return (
    <nav className="absolute top-0 left-0 right-0 z-20 px-6 md:px-10 pt-6 flex items-center justify-between gap-4">
      {/* pilule gauche : logo + marque */}
      <Link to="/" className="flex items-center gap-2 bg-neutral-900/90 backdrop-blur rounded-full pl-4 pr-6 py-3">
        <img src={logo} alt="Benjamin Morel" className="h-4 w-auto object-contain" />
        <span className="text-white text-sm font-normal tracking-tight">Benjamin Morel</span>
      </Link>

      {/* pilule centrale : liens (cachée sur mobile) */}
      <div className="hidden md:flex items-center gap-1 bg-neutral-900/90 backdrop-blur rounded-full px-3 py-2">
        {NAV_LINKS.map(({ key, to, fr, en }) => (
          <Link
            key={key}
            to={to}
            className="text-neutral-300 hover:text-white transition-colors text-sm px-5 py-2 rounded-full"
          >
            {lang === "fr" ? fr : en}
          </Link>
        ))}
      </div>

      {/* droite : switch de langue + bouton */}
      <div className="flex items-center gap-3">
        <button
          onClick={toggleLang}
          aria-label={lang === "fr" ? "switch to english" : "passer en français"}
          className="flex items-center gap-1 bg-neutral-900/90 backdrop-blur rounded-full px-1 py-1 text-xs font-medium"
        >
          <span className={`px-3 py-2 rounded-full transition-colors ${lang === "fr" ? "bg-white text-black" : "text-neutral-400"}`}>
            fr
          </span>
          <span className={`px-3 py-2 rounded-full transition-colors ${lang === "en" ? "bg-white text-black" : "text-neutral-400"}`}>
            en
          </span>
        </button>

        <button className="bg-white text-black text-sm font-normal rounded-full px-6 py-3 hover:bg-neutral-200 transition-colors">
          {lang === "fr" ? GET_STARTED.fr : GET_STARTED.en}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
