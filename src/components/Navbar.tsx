import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import logo from "../assets/logo-bm.png";
import { useLanguage } from "../i18n/LanguageContext";
import { toggleTheme, useTheme } from "../theme";

const NAV_LINKS = [
  { key: "platform", to: "/platform", fr: "projets", en: "projects" },
  { key: "animation-2-1", to: "/animation-2-1", fr: "animation 2.1", en: "animation 2.1" },
  { key: "intro", to: "/intro", fr: "intro", en: "intro" },
  { key: "music", to: "/music", fr: "playlist", en: "playlist" },
  /* masqués pour l'instant, à remettre plus tard :
  { key: "blog", to: "/blog", fr: "blog", en: "blog" },
  { key: "lectures", to: "/lectures", fr: "lectures", en: "readings" },
  { key: "blog2", to: "/blog2", fr: "blog 2", en: "blog 2" },
  */
  { key: "resume", to: "/resume", fr: "résumé", en: "résumé" },
  { key: "contact", to: "/contact", fr: "contact", en: "contact" },
] as const;

const GET_STARTED = { fr: "Commencer", en: "Get started" };

const THEME_LABELS = {
  fr: { dark: "noir", light: "blanc", toDark: "passer en thème noir", toLight: "passer en thème blanc" },
  en: { dark: "dark", light: "light", toDark: "switch to dark theme", toLight: "switch to light theme" },
} as const;

const Navbar = () => {
  const { lang, toggleLang } = useLanguage();
  const theme = useTheme();
  const t = THEME_LABELS[lang];
  const [menuOpen, setMenuOpen] = useState(false);
  const { pathname } = useLocation();
  useEffect(() => setMenuOpen(false), [pathname]);

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

      {/* droite : switch de langue (switch de thème juste en dessous) + bouton */}
      <div className="flex items-center gap-3">
        <div className="relative">
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

        {/* thème noir / blanc pour tout le site, placé sous fr/en sans décaler la barre */}
        <button
          onClick={toggleTheme}
          aria-label={theme === "dark" ? t.toLight : t.toDark}
          className="absolute left-1/2 top-full mt-2 -translate-x-1/2 flex items-center gap-1 bg-neutral-900/90 backdrop-blur rounded-full px-1 py-1 text-xs font-medium whitespace-nowrap"
        >
          <span className={`px-3 py-2 rounded-full transition-colors ${theme === "dark" ? "bg-white text-black" : "text-neutral-400"}`}>
            {t.dark}
          </span>
          <span className={`px-3 py-2 rounded-full transition-colors ${theme === "light" ? "bg-white text-black" : "text-neutral-400"}`}>
            {t.light}
          </span>
        </button>
        </div>


        {/* bouton menu (mobile uniquement) */}
        <button
          onClick={() => setMenuOpen((o) => !o)}
          aria-label={lang === "fr" ? "ouvrir le menu" : "open menu"}
          aria-expanded={menuOpen}
          className="md:hidden bg-neutral-900/90 backdrop-blur rounded-full w-11 h-11 flex flex-col items-center justify-center gap-1.5"
        >
          <span className={`block h-0.5 w-5 bg-white transition-transform ${menuOpen ? "translate-y-1 rotate-45" : ""}`} />
          <span className={`block h-0.5 w-5 bg-white transition-transform ${menuOpen ? "-translate-y-1 -rotate-45" : ""}`} />
        </button>

        <button className="hidden sm:block bg-white text-black text-sm font-normal rounded-full px-6 py-3 hover:bg-neutral-200 transition-colors">
          {lang === "fr" ? GET_STARTED.fr : GET_STARTED.en}
        </button>
      </div>

      {/* menu déroulant mobile */}
      {menuOpen && (
        <div className="md:hidden absolute left-6 right-6 top-full mt-14 flex flex-col bg-neutral-900/95 backdrop-blur rounded-3xl p-3">
          {NAV_LINKS.map(({ key, to, fr, en }) => (
            <Link
              key={key}
              to={to}
              onClick={() => setMenuOpen(false)}
              className="text-neutral-200 hover:text-white text-base px-5 py-3 rounded-2xl hover:bg-white/10"
            >
              {lang === "fr" ? fr : en}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
