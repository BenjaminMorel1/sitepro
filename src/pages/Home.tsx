import Navbar from "../components/Navbar";
import heroPoster from "../assets/hero-poster.jpg";
import avatar from "../assets/avatar.png";
import useDocumentTitle from "../hooks/useDocumentTitle";
import { musicPlayer, useMusicPlayer } from "../musicPlayer";
import { HOME_TRACK } from "../tracks";
import { useLanguage } from "../i18n/LanguageContext";

const STRINGS = {
  fr: {
    pageTitle: "Benjamin Morel | Étudiant & développeur",
    title: "Explorer, créer, partager",
    words: ["explorer", "créer", "partager"],
    paragraph:
      "Salut, moi c'est Benjamin — étudiant de 20 ans à l'université Paris Cité. Je partage ici mes projets et ce qui m'intéresse.",
    stat1Label: "startups nous font confiance",
    stat2Label: "go de données protégées",
    stat3Label: "téléchargements",
  },
  en: {
    pageTitle: "Benjamin Morel | Student & Developer",
    title: "Explore, create, share",
    words: ["explore", "create", "share"],
    paragraph:
      "Hi there, I'm Benjamin — a 20-year-old student at Université Paris Cité. I share my projects and interests here.",
    stat1Label: "startups use",
    stat2Label: "gb data was protected",
    stat3Label: "downloads",
  },
} as const;

const START_MUSIC_LABEL = { fr: "lancer la musique", en: "play music" } as const;

const Home = () => {
  const { lang } = useLanguage();
  const s = STRINGS[lang];
  useDocumentTitle(s.pageTitle);
  const { src } = useMusicPlayer();

  return (
    <section className="relative h-screen w-full overflow-hidden bg-black">
      {/* vidéo de fond — z-0 explicite pour clarté */}
      <video
        className="absolute inset-0 z-0 w-full h-full object-cover"
        autoPlay
        loop
        muted
        playsInline
        preload="metadata"
        poster={heroPoster}
        src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260418_063509_7d167302-4fd4-480b-8260-18ab572333d4.mp4"
      />

      <Navbar />

      {/* avatar à droite du nom dans la navbar — sibling de la navbar (z-30) pour rester devant les pilules même en resize */}
      <img
        src={avatar}
        alt="Benjamin Morel"
        className="absolute z-30 left-[clamp(9rem,16vmin,15rem)] top-[clamp(0.75rem,2vmin,1.5rem)] h-[clamp(3.5rem,18vmin,18rem)] w-[clamp(3.5rem,18vmin,18rem)] md:h-[clamp(3.5rem,min(18vmin,13vw),18rem)] md:w-[clamp(3.5rem,min(18vmin,13vw),18rem)] shrink-0 rounded-full object-cover ring-1 ring-white/30"
      />

      {/* contenu au premier plan — z-10 au-dessus de la vidéo */}
      <div className="relative z-10 h-full w-full">
        {/* titre sémantique unique pour le SEO/l'accessibilité — le rendu visuel reste les 3 mots décalés ci-dessous */}
        <h1 className="sr-only">{s.title}</h1>

        {/* trois mots géants décalés (présentation uniquement, retirés de l'arbre d'accessibilité) */}
        <div aria-hidden="true" className="hero-title absolute text-white font-medium text-[14vw] md:text-[13vw] left-4 md:left-10 top-[18%] transition-transform duration-300 ease-out hover:-translate-y-3">
          {s.words[0]}
        </div>
        <div aria-hidden="true" className="hero-title absolute text-white font-medium text-[14vw] md:text-[13vw] right-4 md:right-10 top-[38%] transition-transform duration-300 ease-out hover:-translate-y-3">
          {s.words[1]}
        </div>
        <div aria-hidden="true" className="hero-title absolute text-white font-medium text-[14vw] md:text-[13vw] left-[18%] md:left-[28%] top-[58%] transition-transform duration-300 ease-out hover:-translate-y-3">
          {s.words[2]}
        </div>

        {/* paragraphe descriptif */}
        <p className="absolute left-6 md:left-10 top-[46%] max-w-[240px] text-[15px] leading-snug text-white/90">
          {s.paragraph}
        </p>

        {/* stat haut-droite */}
        <div className="absolute right-6 md:right-24 top-[14%]">
          <div className="flex items-center gap-3 justify-end">
            <div className="hidden md:block h-px w-24 bg-white/40 rotate-[20deg]" />
            <span className="text-4xl md:text-5xl font-medium tracking-tight text-white">+65k</span>
          </div>
          <div className="text-xs md:text-sm text-white/70 mt-1 text-right">{s.stat1Label}</div>
        </div>

        {/* dégradé bas */}
        <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-b from-transparent to-black" />

        {/* stat bas-gauche */}
        <div className="absolute left-6 md:left-20 bottom-20 md:bottom-24">
          <div className="flex items-center gap-3">
            <span className="text-4xl md:text-5xl font-medium tracking-tight text-white">+1.5b</span>
            <div className="hidden md:block h-px w-24 bg-white/40 rotate-[-20deg]" />
          </div>
          <div className="text-xs md:text-sm text-white/70 mt-1">{s.stat2Label}</div>
        </div>

        {/* stat bas-droite */}
        <div className="absolute right-6 md:right-20 bottom-16 md:bottom-20">
          <div className="flex items-center gap-3 justify-end">
            <div className="hidden md:block h-px w-24 bg-white/40 rotate-[-20deg]" />
            <span className="text-4xl md:text-5xl font-medium tracking-tight text-white">+300k</span>
          </div>
          <div className="text-xs md:text-sm text-white/70 mt-1 text-right">{s.stat3Label}</div>
        </div>
      </div>

      {/* déclenche la musique d'ambiance — masqué une fois lancé, le mini-lecteur flottant prend le relais */}
      {!src && (
        <button
          onClick={() => musicPlayer.toggle(HOME_TRACK, { volume: 0.35, loop: true })}
          aria-label={START_MUSIC_LABEL[lang]}
          className="fixed bottom-6 left-6 z-30 flex h-12 w-12 items-center justify-center rounded-full bg-neutral-900/90 backdrop-blur border border-white/10 text-white hover:bg-neutral-800 transition-colors"
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4 translate-x-[1px]" fill="currentColor" aria-hidden="true">
            <path d="M8 5.5v13a1 1 0 0 0 1.53.85l10-6.5a1 1 0 0 0 0-1.7l-10-6.5A1 1 0 0 0 8 5.5Z" />
          </svg>
        </button>
      )}
    </section>
  );
};

export default Home;
