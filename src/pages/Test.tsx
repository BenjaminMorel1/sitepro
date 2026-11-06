import { useRef } from "react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import Navbar from "../components/Navbar";
import CustomCursor from "../components/CustomCursor";
import AppShowcase from "../components/AppShowcase";
import shotBallsCrush from "../assets/game-ballscrush.jpg";
import shotEldenRing from "../assets/game-eldenring.jpg";
import useDocumentTitle from "../hooks/useDocumentTitle";
import { useLanguage } from "../i18n/LanguageContext";
import { scrollToElement } from "../smoothScroll";

// Page d'essai des effets : phrase d'ouverture animée mot par mot, flèche,
// bandeau défilant, cartes qui apparaissent au défilement, téléphones de l'appli
// StudyApp, curseur personnalisé.

// bordeaux de l'Université Paris Cité, éclairci pour rester lisible sur fond noir
const ACCENT = "#dd5a7e";

// un morceau de phrase : texte simple, lien interne (to), lien externe (href)
// ou bouton qui fait défiler jusqu'aux jeux (games)
type Segment = { text: string; to?: string; href?: string; games?: true };

const STRINGS: Record<
  "fr" | "en",
  {
    pageTitle: string;
    intro: Segment[];
    scrollLabel: string;
    marquee: string[];
    gamesHeading: string;
    games: { title: string; tag: string; description: string; image: string; to?: string; href?: string }[];
  }
> = {
  fr: {
    pageTitle: "Intro | Benjamin Morel",
    intro: [
      { text: "Benjamin Morel ✳ étudiant en " },
      { text: "Licence 3 de mathématiques", to: "/contact" },
      { text: " à l'" },
      { text: "Université Paris Cité", to: "/contact" },
      { text: ", passé par une " },
      { text: "prépa ECG", to: "/contact" },
      { text: " et une " },
      { text: "licence MIASHS", to: "/contact" },
      { text: " à Lille. J'ai codé " },
      { text: "deux jeux", games: true },
      { text: " jouables dans le navigateur et " },
      { text: "ce site", href: "https://github.com/BenjaminMorel1/sitepro" },
      { text: ", et j'écoute beaucoup trop " },
      { text: "ma playlist", to: "/music" },
      { text: "." },
    ],
    scrollLabel: "descendre vers les jeux",
    marquee: ["Mathématiques", "Informatique", "Économie", "Université Paris Cité", "Jeux vidéo", "Musique"],
    gamesHeading: "Deux jeux, codés à la main.",
    games: [
      {
        title: "Balls Crush",
        tag: "casse-briques · dans la page",
        description: "Combos, bonus et 3 niveaux de difficulté croissante.",
        image: shotBallsCrush,
        to: "/platform",
      },
      {
        title: "Elden Ring",
        tag: "action-RPG 3D · nouvel onglet",
        description: "Combat à l'épée, roulade, verrouillage de cible et fioles de soin.",
        image: shotEldenRing,
        href: `${import.meta.env.BASE_URL}games/elden-ring.html`,
      },
    ],
  },
  en: {
    pageTitle: "Intro | Benjamin Morel",
    intro: [
      { text: "Benjamin Morel ✳ " },
      { text: "3rd-year Mathematics", to: "/contact" },
      { text: " student at " },
      { text: "Université Paris Cité", to: "/contact" },
      { text: ", by way of a " },
      { text: "CPGE ECG prep program", to: "/contact" },
      { text: " and a " },
      { text: "MIASHS Bachelor's", to: "/contact" },
      { text: " in Lille. I built " },
      { text: "two games", games: true },
      { text: " you can play in your browser and " },
      { text: "this website", href: "https://github.com/BenjaminMorel1/sitepro" },
      { text: ", and I listen to " },
      { text: "my playlist", to: "/music" },
      { text: " way too much." },
    ],
    scrollLabel: "scroll down to the games",
    marquee: ["Mathematics", "Computer science", "Economics", "Université Paris Cité", "Video games", "Music"],
    gamesHeading: "Two games, coded by hand.",
    games: [
      {
        title: "Balls Crush",
        tag: "breakout · in this page",
        description: "Combos, power-ups and 3 levels of rising difficulty.",
        image: shotBallsCrush,
        to: "/platform",
      },
      {
        title: "Elden Ring",
        tag: "3D action-RPG · new tab",
        description: "Sword combat, dodge rolls, target lock-on and healing flasks.",
        image: shotEldenRing,
        href: `${import.meta.env.BASE_URL}games/elden-ring.html`,
      },
    ],
  },
};

const word = {
  hidden: { opacity: 0, y: "0.4em" },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const } },
};

const linkClass = "italic hover:underline underline-offset-4 decoration-1";

// texte simple découpé en mots animés ; les espaces restent du texte normal pour
// que les retours à la ligne se fassent entre les mots
const AnimatedText = ({ text }: { text: string }) =>
  text.split(/(\s+)/).map((part, i) =>
    /^\s*$/.test(part) ? (
      part
    ) : (
      <motion.span key={i} variants={word} className="inline-block">
        {part}
      </motion.span>
    )
  );

const Test = () => {
  const { lang } = useLanguage();
  const s = STRINGS[lang];
  useDocumentTitle(s.pageTitle);
  const gamesRef = useRef<HTMLElement>(null);
  const goToGames = () => gamesRef.current && scrollToElement(gamesRef.current);

  return (
    // fondu à l'arrivée sur la page (opacité seule : un transform casserait la navbar fixe)
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.35, ease: "easeInOut" }}
      className="bg-white dark:bg-black text-[#141414] dark:text-white"
    >
      <CustomCursor />
      <Navbar />

      {/* écran d'ouverture : une seule phrase, mots-clés en couleur et cliquables */}
      <section className="relative flex min-h-screen items-center justify-center px-6 md:px-24 pt-24 pb-32">
        <motion.p
          initial="hidden"
          animate="visible"
          transition={{ staggerChildren: 0.035, delayChildren: 0.2 }}
          className="font-display font-light text-center text-[#141414]/90 dark:text-white/90 max-w-5xl text-[clamp(1.6rem,3.4vw,3.25rem)] leading-[1.25]"
        >
          {s.intro.map((seg, i) => {
            if (!seg.to && !seg.href && !seg.games) return <AnimatedText key={i} text={seg.text} />;
            const inner = (
              <motion.span variants={word} className="inline-block">
                {seg.text}
              </motion.span>
            );
            if (seg.to)
              return (
                <Link key={i} to={seg.to} className={linkClass} style={{ color: ACCENT }}>
                  {inner}
                </Link>
              );
            if (seg.href)
              return (
                <a key={i} href={seg.href} target="_blank" rel="noreferrer" className={linkClass} style={{ color: ACCENT }}>
                  {inner}
                </a>
              );
            return (
              <button key={i} type="button" onClick={goToGames} className={linkClass} style={{ color: ACCENT }}>
                {inner}
              </button>
            );
          })}
        </motion.p>

        {/* flèche animée qui fait descendre jusqu'aux jeux */}
        <motion.button
          type="button"
          onClick={goToGames}
          aria-label={s.scrollLabel}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 p-3 text-[#141414]/70 dark:text-white/70 hover:text-[#141414] dark:hover:text-white"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        >
          <svg width="36" height="18" viewBox="0 0 36 18" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M1 1l17 15L35 1" />
          </svg>
        </motion.button>
      </section>

      {/* bandeau de texte qui défile ; contenu dupliqué pour une boucle sans saut */}
      <div className="marquee overflow-hidden border-y border-[#141414]/10 dark:border-white/10 py-6">
        <div className="marquee-track flex w-max">
          {[0, 1].map((copy) => (
            <div key={copy} aria-hidden={copy === 1} className="flex shrink-0">
              {s.marquee.map((item) => (
                <span key={item} className="font-display italic font-light text-[clamp(2.5rem,7vw,6rem)] whitespace-nowrap px-8">
                  {item}
                  <span className="pl-16" style={{ color: ACCENT }}>
                    ✳
                  </span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* cartes des jeux : l'image se dévoile du bas vers le haut au défilement */}
      <section ref={gamesRef} className="px-6 md:px-24 py-32">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.8 }}
          className="font-display font-light text-[clamp(2rem,4.5vw,4rem)] mb-16"
        >
          {s.gamesHeading}
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-14">
          {s.games.map((game, i) => {
            // le déclencheur « visible à l'écran » est sur la carte entière : un élément
            // entièrement masqué par clip-path n'est jamais vu comme visible par le navigateur
            const delay = i * 0.15;
            const card = (
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }}>
                <motion.div
                  variants={{
                    hidden: { clipPath: "inset(100% 0% 0% 0%)" },
                    visible: { clipPath: "inset(0% 0% 0% 0%)", transition: { duration: 1.1, ease: [0.76, 0, 0.24, 1], delay } },
                  }}
                  className="overflow-hidden rounded-2xl"
                >
                  {/* zoom au survol sur un conteneur à part, pour ne pas gêner l'animation d'entrée */}
                  <div className="transition-transform duration-700 group-hover:scale-105">
                    <motion.img
                      src={game.image}
                      alt={game.title}
                      variants={{
                        hidden: { scale: 1.25 },
                        visible: { scale: 1, transition: { duration: 1.4, ease: [0.22, 1, 0.36, 1], delay } },
                      }}
                      className="aspect-[16/9] w-full object-cover"
                    />
                  </div>
                </motion.div>
                <motion.div
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0, transition: { duration: 0.7, delay: 0.4 + delay } },
                  }}
                  className="mt-6"
                >
                  <p className="text-xs uppercase tracking-wide text-[#141414]/40 dark:text-white/40">{game.tag}</p>
                  <h3 className="mt-2 text-2xl md:text-3xl font-medium transition-transform duration-500 group-hover:translate-x-3">
                    {game.title} <span style={{ color: ACCENT }}>→</span>
                  </h3>
                  <p className="mt-2 text-sm text-[#141414]/60 dark:text-white/60">{game.description}</p>
                </motion.div>
              </motion.div>
            );
            return game.to ? (
              <Link key={game.title} to={game.to} className="group block">
                {card}
              </Link>
            ) : (
              <a key={game.title} href={game.href} target="_blank" rel="noopener noreferrer" className="group block">
                {card}
              </a>
            );
          })}
        </div>
      </section>

      <AppShowcase />
    </motion.div>
  );
};

export default Test;
