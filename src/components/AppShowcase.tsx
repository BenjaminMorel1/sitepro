import { useEffect, useRef } from "react";
import { motion } from "motion/react";
import Flickity from "flickity";
import "flickity/css/flickity.css";
import { useLanguage } from "../i18n/LanguageContext";

// Section « appli mobile » : une bande continue de 12 téléphones montrant le
// parcours dans l'appli RayOnn 2, découpée en 4 pages de la largeur de l'écran
// (les téléphones à cheval entre deux pages sont coupés). Mêmes proportions que
// le carrousel de référence : tout est relatif à la largeur du carrousel, donc la
// bande garde le même rendu quelle que soit la largeur. Le glissement est fait par
// Flickity, la même bibliothèque, avec les mêmes réglages.

const STRINGS = {
  fr: {
    label: "Application web",
    title: "RayOnn 2, réviser ensemble, comme on s'entraîne.",
    description:
      "Enregistre tes sessions d'étude avec leur profil de concentration, partage-les avec tes amis, trouve une bibliothèque sur la carte et relève des défis en groupe.",
    stack: "React · Vite · Firebase · Mapbox",
    carousel: "Écrans de l'appli RayOnn 2",
    open: "Ouvrir l'appli",
    screen: "Écran",
  },
  en: {
    label: "Web app",
    title: "RayOnn 2, study together, like you train.",
    description:
      "Log your study sessions with their focus profile, share them with friends, find a library on the map and take on group challenges.",
    stack: "React · Vite · Firebase · Mapbox",
    carousel: "RayOnn 2 app screens",
    open: "Open the app",
    screen: "Screen",
  },
} as const;

// téléphones prêts à l'emploi : captures de l'appli placées dans le cadre officiel
// Apple iPhone 11 Pro (Apple Design Resources), barre d'état comprise, dans l'ordre
// du parcours (rayonn-phone-01.webp … rayonn-phone-12.webp)
const PHONES = Object.entries(
  import.meta.glob<string>("../assets/rayonn-phone-*.webp", { eager: true, import: "default" })
)
  .sort(([a], [b]) => a.localeCompare(b))
  .map(([, src]) => src);

// version en ligne de l'appli
const RAYONN_URL = "https://rayonn-541fe.web.app/";

// bande en % de la largeur d'une page, mesurée sur le carrousel de référence :
// début, largeur d'un téléphone, pas entre deux
const PAGES = 4;
const STRIP_START = 39.09;
const PHONE_WIDTH = 21.86;
const PHONE_PITCH = 24.98;

// 21,86 % de la largeur du carrousel (~315 × 630 px sur un écran de 1440 px) ; l'image
// est coupée au bord du téléphone, sans marge
const Phone = ({ src, alt, left }: { src: string; alt: string; left: number }) => (
  <img
    src={src}
    alt={alt}
    draggable={false}
    style={{ left: `${left}cqw` }}
    className="absolute top-[4.49cqw] w-[21.86cqw] select-none"
  />
);

const AppShowcase = () => {
  const { lang } = useLanguage();
  const s = STRINGS[lang];
  const carouselRef = useRef<HTMLDivElement>(null);

  // Flickity avec les réglages du carrousel de référence, sans défilement automatique.
  // L'attraction est à 0.027 au lieu des 0.025 déclarés : sa version de Flickity (intégrée
  // à son thème) va un peu plus vite, et 0.027 reproduit la vitesse mesurée sur son site.
  useEffect(() => {
    if (!carouselRef.current) return;
    const flickity = new Flickity(carouselRef.current, {
      accessibility: true,
      adaptiveHeight: true,
      autoPlay: false,
      cellAlign: "center",
      draggable: ">1",
      dragThreshold: 3,
      freeScrollFriction: 0.075,
      friction: 0.28,
      pageDots: false,
      pauseAutoPlayOnHover: false,
      percentPosition: true,
      prevNextButtons: false,
      resize: true,
      selectedAttraction: 0.027,
      setGallerySize: true,
      wrapAround: false,
    });
    return () => flickity.destroy();
  }, [lang]);

  return (
    <section className="relative overflow-hidden border-t border-white/10 pt-32 pb-28">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.8 }}
        className="mx-auto max-w-3xl px-6 text-center"
      >
        <p className="text-xs uppercase tracking-[0.2em] text-white/40">{s.label}</p>
        <h2 className="font-display mt-4 font-light text-[clamp(2rem,4.5vw,4rem)] leading-[1.1]">{s.title}</h2>
        <p className="mx-auto mt-6 max-w-xl text-sm md:text-base text-white/60">{s.description}</p>
        <p className="mt-6 inline-block rounded-full border border-white/15 px-5 py-2 text-xs tracking-wide text-white/70">
          {s.stack}
        </p>
        <div className="mt-8">
          <a
            href={RAYONN_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block rounded-full bg-white px-6 py-2.5 text-sm text-black transition-colors hover:bg-neutral-200"
          >
            {s.open} ↗
          </a>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 1, delay: 0.2 }}
        className="mt-20"
      >
        {/* 4 pages de la largeur du carrousel, comme les 4 images de la référence :
            chaque page montre sa portion de la même bande de téléphones (grand vide à
            gauche, 12 téléphones espacés de 3,5 %, vide à droite), d'où les téléphones
            coupés entre deux pages. Clé sur la langue : Flickity déplace les éléments,
            on le recrée plutôt que de laisser React les mettre à jour. */}
        <div key={lang} ref={carouselRef} aria-label={s.carousel} className="cursor-grab outline-none active:cursor-grabbing">
          {Array.from({ length: PAGES }, (_, page) => (
            // sur petit écran, chaque page est plus large que l'écran (on glisse dedans) :
            // les téléphones restent assez grands pour être lisibles
            <div key={page} className="w-[260%] sm:w-[170%] lg:w-full [container-type:inline-size]">
              {/* seuls les téléphones qui touchent cette page sont rendus ; page de la même hauteur que les diapos de la référence */}
              <div className="relative h-[52.77cqw] select-none overflow-hidden">
                {PHONES.map((src, i) => {
                  const left = STRIP_START + i * PHONE_PITCH - page * 100;
                  if (left > 100 || left + PHONE_WIDTH < 0) return null;
                  return <Phone key={src} src={src} left={left} alt={left >= 0 ? `${s.screen} ${i + 1}` : ""} />;
                })}
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
};

export default AppShowcase;
