import { useState } from "react";
import Navbar from "../components/Navbar";
import PlatformGame from "../components/PlatformGame";
import AppShowcase from "../components/AppShowcase";
import rayonnPreview from "../assets/rayonn-phone-01.webp";
import useDocumentTitle from "../hooks/useDocumentTitle";
import { useLanguage } from "../i18n/LanguageContext";

const STRINGS = {
  fr: {
    pageTitle: "Projets | Benjamin Morel",
    heading: "Projets",
    intro:
      "notre plateforme neutralise les menaces couche par couche. teste par toi-même avec ces deux mini-jeux — choisis ton camp.",
    back: "← retour aux projets",
    games: {
      rayonn: {
        tag: "appli mobile · dans la page",
        title: "RayOnn",
        description:
          "réviser avec régularité, sans pression : sessions de concentration chronométrées, tâches et habitudes du jour, niveaux et XP pour rester motivé.",
        cta: "découvrir",
      },
      ballscrush: {
        tag: "casse-briques · dans la page",
        title: "Balls Crush",
        description:
          "lance la balle, enchaîne les blocs sans en rater pour faire grimper ton combo, et attrape les bonus qui tombent sur 3 niveaux de difficulté croissante.",
        cta: "jouer",
        icon: "🧱",
      },
      eldenring: {
        tag: "action-RPG 3D · nouvel onglet",
        title: "Elden Ring",
        description:
          "trois seigneurs veillent sur des ruines en cendres. combat à l'épée, roulade, verrouillage de cible, fioles de soin et coup de grâce — le tout dans ton navigateur.",
        cta: "jouer",
        icon: "⚔️",
      },
    },
  },
  en: {
    pageTitle: "Projects | Benjamin Morel",
    heading: "Projects",
    intro:
      "our platform breaks down threats layer by layer. try it yourself with these two mini-games — pick your side.",
    back: "← back to projects",
    games: {
      rayonn: {
        tag: "mobile app · in this page",
        title: "RayOnn",
        description:
          "study consistently, without the pressure: timed focus sessions, daily tasks and habits, levels and XP to stay motivated.",
        cta: "discover",
      },
      ballscrush: {
        tag: "breakout · in this page",
        title: "Balls Crush",
        description:
          "launch the ball, chain blocks without missing to grow your combo, and catch falling bonuses across 3 levels of rising difficulty.",
        cta: "play",
        icon: "🧱",
      },
      eldenring: {
        tag: "3D action-RPG · new tab",
        title: "Elden Ring",
        description:
          "three lords watch over a world of ash. sword combat, dodge rolls, target lock-on, healing flasks and a finishing blow — all in your browser.",
        cta: "play",
        icon: "⚔️",
      },
    },
  },
} as const;

type View = "hub" | "ballscrush" | "rayonn";

const Platform = () => {
  const { lang } = useLanguage();
  const s = STRINGS[lang];
  const [view, setView] = useState<View>("hub");
  useDocumentTitle(s.pageTitle);

  if (view !== "hub") {
    return (
      <>
        <Navbar />
        <div className="bg-black pt-24">
          <div className="max-w-[1280px] mx-auto px-6 md:px-10">
            <button
              onClick={() => setView("hub")}
              className="text-sm text-white/60 hover:text-white transition-colors"
            >
              {s.back}
            </button>
          </div>
        </div>
        {view === "ballscrush" ? (
          <PlatformGame />
        ) : (
          <div className="bg-black text-white">
            <AppShowcase />
          </div>
        )}
      </>
    );
  }

  return (
    <>
      <Navbar />
      <section className="relative min-h-screen w-full bg-white dark:bg-black text-[#141414] dark:text-white px-6 md:px-10 py-24">
        <div className="max-w-[1280px] mx-auto mb-10">
          <h1 className="hero-title text-5xl md:text-7xl font-medium">{s.heading}</h1>
          <p className="mt-4 max-w-md text-[15px] leading-snug text-[#141414]/70 dark:text-white/70">{s.intro}</p>
        </div>

        <div className="max-w-[1280px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <button
            onClick={() => setView("rayonn")}
            className="group text-left rounded-3xl border border-[#141414]/10 dark:border-white/10 bg-[#f9fafe] dark:bg-neutral-900/40 p-8 transition-colors hover:border-[#141414]/30 dark:hover:border-white/30 hover:bg-[#f0f2f8] dark:hover:bg-neutral-900/70"
          >
            <div className="h-40 rounded-2xl mb-6 flex items-end justify-center overflow-hidden bg-gradient-to-br from-sky-400/20 via-indigo-500/10 to-neutral-900">
              <img src={rayonnPreview} alt="" className="w-24 translate-y-6 select-none" draggable={false} />
            </div>
            <div className="text-xs uppercase tracking-wide text-[#141414]/40 dark:text-white/40 mb-2">{s.games.rayonn.tag}</div>
            <h2 className="text-2xl font-medium mb-2">{s.games.rayonn.title}</h2>
            <p className="text-sm text-[#141414]/60 dark:text-white/60 mb-6">{s.games.rayonn.description}</p>
            <span className="inline-block rounded-full bg-[#141414] dark:bg-white text-white dark:text-black text-sm font-normal px-6 py-2.5 transition-colors group-hover:bg-[#333333] dark:group-hover:bg-neutral-200">
              {s.games.rayonn.cta}
            </span>
          </button>

          <button
            onClick={() => setView("ballscrush")}
            className="group text-left rounded-3xl border border-[#141414]/10 dark:border-white/10 bg-[#f9fafe] dark:bg-neutral-900/40 p-8 transition-colors hover:border-[#141414]/30 dark:hover:border-white/30 hover:bg-[#f0f2f8] dark:hover:bg-neutral-900/70"
          >
            <div className="h-40 rounded-2xl mb-6 flex items-center justify-center text-6xl bg-gradient-to-br from-amber-400/20 via-rose-500/10 to-neutral-900">
              {s.games.ballscrush.icon}
            </div>
            <div className="text-xs uppercase tracking-wide text-[#141414]/40 dark:text-white/40 mb-2">{s.games.ballscrush.tag}</div>
            <h2 className="text-2xl font-medium mb-2">{s.games.ballscrush.title}</h2>
            <p className="text-sm text-[#141414]/60 dark:text-white/60 mb-6">{s.games.ballscrush.description}</p>
            <span className="inline-block rounded-full bg-[#141414] dark:bg-white text-white dark:text-black text-sm font-normal px-6 py-2.5 transition-colors group-hover:bg-[#333333] dark:group-hover:bg-neutral-200">
              {s.games.ballscrush.cta}
            </span>
          </button>

          <a
            href={`${import.meta.env.BASE_URL}games/elden-ring.html`}
            target="_blank"
            rel="noopener noreferrer"
            className="group text-left rounded-3xl border border-[#141414]/10 dark:border-white/10 bg-[#f9fafe] dark:bg-neutral-900/40 p-8 transition-colors hover:border-[#141414]/30 dark:hover:border-white/30 hover:bg-[#f0f2f8] dark:hover:bg-neutral-900/70"
          >
            <div className="h-40 rounded-2xl mb-6 flex items-center justify-center text-6xl bg-gradient-to-br from-orange-700/20 via-neutral-800/40 to-white dark:to-black">
              {s.games.eldenring.icon}
            </div>
            <div className="text-xs uppercase tracking-wide text-[#141414]/40 dark:text-white/40 mb-2">{s.games.eldenring.tag}</div>
            <h2 className="text-2xl font-medium mb-2">{s.games.eldenring.title}</h2>
            <p className="text-sm text-[#141414]/60 dark:text-white/60 mb-6">{s.games.eldenring.description}</p>
            <span className="inline-block rounded-full bg-[#141414] dark:bg-white text-white dark:text-black text-sm font-normal px-6 py-2.5 transition-colors group-hover:bg-[#333333] dark:group-hover:bg-neutral-200">
              {s.games.eldenring.cta}
            </span>
          </a>
        </div>
      </section>
    </>
  );
};

export default Platform;
