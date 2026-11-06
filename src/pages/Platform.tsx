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
      "ce que je construis sur mon temps libre : une appli pour réviser et deux jeux jouables directement dans le navigateur. clique sur une carte pour l'essayer.",
    back: "← retour aux projets",
    games: {
      rayonn: {
        tag: "appli web · dans la page",
        title: "RayOnn 2",
        description:
          "réviser ensemble, comme on s'entraîne : sessions d'étude avec leur profil de concentration, fil d'activité entre amis, carte des bibliothèques, groupes et défis.",
        cta: "découvrir",
      },
      jeux: {
        tag: "2 jeux · dans le navigateur",
        title: "Jeux",
        description: "deux jeux codés à la main, jouables directement dans le navigateur.",
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
        tag: "action-RPG 3D · au clavier, sur ordinateur",
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
      "what I build in my free time: an app for studying and two games you can play right in your browser. click a card to try it.",
    back: "← back to projects",
    games: {
      rayonn: {
        tag: "web app · in this page",
        title: "RayOnn 2",
        description:
          "study together, like you train: study sessions with their focus profile, a feed with friends, a map of libraries, groups and challenges.",
        cta: "discover",
      },
      jeux: {
        tag: "2 games · in your browser",
        title: "Games",
        description: "two hand-coded games you can play right in your browser.",
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
        tag: "3D action-RPG · keyboard, desktop only",
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

        <div className="max-w-[1280px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
          <button
            onClick={() => setView("rayonn")}
            className="group flex flex-col items-start text-left rounded-3xl border border-[#141414]/10 dark:border-white/10 bg-[#f9fafe] dark:bg-neutral-900/40 p-8 transition-colors hover:border-[#141414]/30 dark:hover:border-white/30 hover:bg-[#f0f2f8] dark:hover:bg-neutral-900/70"
          >
            <div className="w-full h-40 rounded-2xl mb-6 flex items-end justify-center overflow-hidden bg-gradient-to-br from-sky-400/20 via-indigo-500/10 to-neutral-900">
              <img src={rayonnPreview} alt="" className="w-24 translate-y-6 select-none" draggable={false} />
            </div>
            <div className="text-xs uppercase tracking-wide text-[#141414]/40 dark:text-white/40 mb-2">{s.games.rayonn.tag}</div>
            <h2 className="text-2xl font-medium mb-2">{s.games.rayonn.title}</h2>
            <p className="text-sm text-[#141414]/60 dark:text-white/60 mb-6">{s.games.rayonn.description}</p>
            <span className="inline-block rounded-full bg-[#141414] dark:bg-white text-white dark:text-black text-sm font-normal px-6 py-2.5 transition-colors group-hover:bg-[#333333] dark:group-hover:bg-neutral-200">
              {s.games.rayonn.cta}
            </span>
          </button>

          {/* carte « Jeux » : Balls Crush et Elden Ring regroupés */}
          <div className="text-left rounded-3xl border border-[#141414]/10 dark:border-white/10 bg-[#f9fafe] dark:bg-neutral-900/40 p-8">
            <div className="h-40 rounded-2xl mb-6 flex items-center justify-center gap-6 text-6xl bg-gradient-to-br from-amber-400/20 via-rose-500/10 to-neutral-900">
              <span>{s.games.ballscrush.icon}</span>
              <span>{s.games.eldenring.icon}</span>
            </div>
            <div className="text-xs uppercase tracking-wide text-[#141414]/40 dark:text-white/40 mb-2">{s.games.jeux.tag}</div>
            <h2 className="text-2xl font-medium mb-2">{s.games.jeux.title}</h2>
            <p className="text-sm text-[#141414]/60 dark:text-white/60 mb-6">{s.games.jeux.description}</p>
            <div className="flex flex-col gap-3">
              <div className="flex gap-4 rounded-2xl border border-[#141414]/10 dark:border-white/10 bg-white/60 dark:bg-black/30 p-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl text-3xl bg-gradient-to-br from-amber-400/20 via-rose-500/10 to-neutral-900">
                  {s.games.ballscrush.icon}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-[11px] uppercase tracking-wide text-[#141414]/40 dark:text-white/40">{s.games.ballscrush.tag}</div>
                  <h3 className="mt-0.5 text-lg font-medium">{s.games.ballscrush.title}</h3>
                  <p className="mt-1 text-sm text-[#141414]/60 dark:text-white/60">{s.games.ballscrush.description}</p>
                  <button onClick={() => setView("ballscrush")} className="inline-block mt-3 rounded-full bg-[#141414] dark:bg-white text-white dark:text-black text-sm font-normal px-5 py-2 transition-colors hover:bg-[#333333] dark:hover:bg-neutral-200">
                    {s.games.ballscrush.cta}
                  </button>
                </div>
              </div>
              <div className="flex gap-4 rounded-2xl border border-[#141414]/10 dark:border-white/10 bg-white/60 dark:bg-black/30 p-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl text-3xl bg-gradient-to-br from-orange-700/20 via-neutral-800/40 to-white dark:to-black">
                  {s.games.eldenring.icon}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-[11px] uppercase tracking-wide text-[#141414]/40 dark:text-white/40">{s.games.eldenring.tag}</div>
                  <h3 className="mt-0.5 text-lg font-medium">{s.games.eldenring.title}</h3>
                  <p className="mt-1 text-sm text-[#141414]/60 dark:text-white/60">{s.games.eldenring.description}</p>
                  <a
                    href={`${import.meta.env.BASE_URL}games/elden-ring.html`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block mt-3 rounded-full bg-[#141414] dark:bg-white text-white dark:text-black text-sm font-normal px-5 py-2 transition-colors hover:bg-[#333333] dark:hover:bg-neutral-200"
                  >
                    {s.games.eldenring.cta}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Platform;
