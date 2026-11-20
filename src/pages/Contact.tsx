import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import ShareButton from "../components/ShareButton";
import logoMyPrepa from "../assets/logo-myprepa.png";
import logoLille from "../assets/logo-lille.png";
import logoParisCite from "../assets/logo-paris-cite.png";
import useDocumentTitle from "../hooks/useDocumentTitle";
import { useLanguage } from "../i18n/LanguageContext";

/* ------------------------------------------------------------------ */
/* page « à propos » : fusion des anciennes pages Résumé et Contact.   */
/* Mise en page reprise de abdussalam.pk/resume (grille 12 colonnes    */
/* de 1170px, cartes compétences/outils/technologies, entrées décalées */
/* de 2 colonnes, pied de page noir plein écran).                      */
/* Polices : Contralto/Elza (Adobe Fonts, payantes) remplacées par     */
/* Cormorant Garamond et Inter.                                        */
/* ------------------------------------------------------------------ */

const GITHUB_URL = "https://github.com/BenjaminMorel1";
const YOUTUBE_URL = "https://www.youtube.com/@pardise3604";
const LINKEDIN_URL = "https://www.linkedin.com/in/benjamin-morel-bb839a3ab/";
const SITE_REPO_URL = "https://github.com/BenjaminMorel1/sitepro";
const RAYONN_URL = "https://rayonn-541fe.web.app/";
const EMAIL = "benjaminmorelproject@gmail.com";

type Item = { label: string; to?: string; href?: string };
type Entry = { name: string; place: string; role: string; description: string; link?: Item };

type Strings = {
  pageTitle: string;
  location: string;
  projectsCta: string;
  writeMe: string;
  aboutLabel: string;
  about: string;
  skillsLabel: string;
  skills: Item[];
  toolsLabel: string;
  tools: Item[];
  techLabel: string;
  tech: Item[];
  projectsLabel: string;
  entries: Entry[];
  educationLabel: string;
  timeline: { years: string; title: string; place: string }[];
  tagline: [string, string];
  getInTouch: string;
  privacy: string;
};

const STRINGS: Record<"fr" | "en", Strings> = {
  fr: {
    pageTitle: "À propos | Benjamin Morel",
    location: "Paris, France",
    projectsCta: "VOIR LES PROJETS →",
    writeMe: "M'ÉCRIRE",
    aboutLabel: "Présentation",
    about:
      "Étudiant de 20 ans en licence de mathématiques à l'Université Paris Cité, après une classe préparatoire ECG et une licence MIASHS à Lille. Je m'intéresse aux mathématiques, à l'informatique et à l'économie, et je développe des applications et des projets créatifs.",
    skillsLabel: "COMPÉTENCES",
    skills: [
      { label: "Analyse et algèbre" },
      { label: "Probabilités et statistiques" },
      { label: "Raisonnement et démonstration" },
      { label: "Modélisation mathématique" },
      { label: "Algorithmique" },
      { label: "Économie (micro et macro)" },
      { label: "Développement web →", href: SITE_REPO_URL },
      { label: "Création de jeux dans le navigateur →", to: "/platform" },
      { label: "Langues : français (natif), anglais" },
    ],
    toolsLabel: "OUTILS",
    tools: [
      { label: "Papier & crayon" },
      { label: "LaTeX" },
      { label: "VS Code" },
      { label: "Git & GitHub →", href: GITHUB_URL },
      { label: "Excel / Google Sheets" },
      { label: "Jupyter Notebook" },
      { label: "Claude Code (extension VS Code)" },
    ],
    techLabel: "TECHNOLOGIES",
    tech: [{ label: "Python" }, { label: "Pandas" }, { label: "Jupyter" }, { label: "React" }, { label: "Firebase" }],
    projectsLabel: "Projets",
    entries: [
      {
        name: "Mala",
        place: "Appli de révision",
        role: "Projet personnel · en ligne",
        description:
          "Réviser ensemble, comme on s'entraîne : sessions d'étude avec leur profil de concentration, fil d'activité entre amis, carte des bibliothèques, groupes et défis. React, Vite, Firebase et Mapbox.",
        link: { label: "OUVRIR L'APPLI ↗", href: RAYONN_URL },
      },
      {
        name: "Jeux",
        place: "La prairie peinte · Chessmata · Balls Crush · Elden Ring",
        role: "Projets personnels",
        description:
          "Balls Crush : casse-briques jouable dans la page, avec combos, bonus et 3 niveaux de difficulté croissante. Elden Ring : action-RPG 3D avec combat à l'épée, roulade, verrouillage de cible et fioles de soin. La prairie peinte : exploration 3D peinte touche par touche comme une toile à l'huile. Chessmata : échecs 3D en ligne contre des amis ou des IA, avec classement Elo (version personnalisée du projet open source).",
        link: { label: "JOUER →", to: "/platform" },
      },
      {
        name: "Animée",
        place: "Film d'animation généré par IA",
        role: "Projet personnel · en cours",
        description:
          "Biographie animée en 3D, de la naissance à 20 ans, entièrement générée par IA (images et vidéos sur ElevenLabs) : un personnage décliné en 7 âges et une première scène, « Paris, le soir ».",
        link: { label: "VOIR →", to: "/animation-2-1" },
      },
      {
        name: "Ce site",
        place: "React, TypeScript, Tailwind CSS",
        role: "Projet personnel",
        description: "Site personnel avec projets, playlist et animation, en français et en anglais.",
        link: { label: "CODE SOURCE ↗", href: SITE_REPO_URL },
      },
    ],
    educationLabel: "Formation.",
    timeline: [
      { years: "2026 - 2027", title: "Licence Mathématiques", place: "Université Paris Cité, Paris 6ème" },
      { years: "2025 - 2026", title: "Licence MIASHS (Maths, Info, Économie)", place: "Université de Lille – Cité scientifique" },
      { years: "2024 - 2025", title: "Classe Préparatoire aux Grandes Écoles (CPGE ECG)", place: "MyPrepa, Paris 15ème" },
      {
        years: "2021 - 2024",
        title: "Baccalauréat spécialités Mathématiques-Sciences économiques et sociales",
        place: "Lycée Georges Clémenceau, Reims",
      },
    ],
    tagline: ["Étudiant en mathématiques", "à l'Université Paris Cité"],
    getInTouch: "Pour me contacter",
    privacy: "Ce site utilise Google Analytics et GoatCounter pour compter les visites.",
  },
  en: {
    pageTitle: "About | Benjamin Morel",
    location: "Paris, France",
    projectsCta: "SEE THE PROJECTS →",
    writeMe: "EMAIL ME",
    aboutLabel: "About",
    about:
      "20-year-old student doing a Bachelor's in Mathematics at Université Paris Cité, after a CPGE ECG prep program and a MIASHS Bachelor's in Lille. I'm interested in mathematics, computer science and economics, and I build apps and creative projects.",
    skillsLabel: "SKILLS",
    skills: [
      { label: "Analysis and algebra" },
      { label: "Probability and statistics" },
      { label: "Reasoning and proof" },
      { label: "Mathematical modelling" },
      { label: "Algorithms" },
      { label: "Economics (micro and macro)" },
      { label: "Web development →", href: SITE_REPO_URL },
      { label: "Browser game development →", to: "/platform" },
      { label: "Languages: French (native), English" },
    ],
    toolsLabel: "TOOLS",
    tools: [
      { label: "Paper & Pencil" },
      { label: "LaTeX" },
      { label: "VS Code" },
      { label: "Git & GitHub →", href: GITHUB_URL },
      { label: "Excel / Google Sheets" },
      { label: "Jupyter Notebook" },
      { label: "Claude Code (VS Code extension)" },
    ],
    techLabel: "TECHNOLOGIES",
    tech: [{ label: "Python" }, { label: "Pandas" }, { label: "Jupyter" }, { label: "React" }, { label: "Firebase" }],
    projectsLabel: "Projects",
    entries: [
      {
        name: "Mala",
        place: "Study app",
        role: "Personal project · live",
        description:
          "Study together, like you train: study sessions with their focus profile, a feed with friends, a map of libraries, groups and challenges. React, Vite, Firebase and Mapbox.",
        link: { label: "OPEN THE APP ↗", href: RAYONN_URL },
      },
      {
        name: "Games",
        place: "The painted meadow · Chessmata · Balls Crush · Elden Ring",
        role: "Personal projects",
        description:
          "Balls Crush: an in-page breakout game with combos, power-ups and 3 levels of rising difficulty. Elden Ring: a 3D action-RPG with sword combat, dodge rolls, target lock-on and healing flasks. The painted meadow: a 3D exploration painted stroke by stroke like an oil canvas. Chessmata: online 3D chess against friends or AI agents, with Elo ranking (a customised take on the open-source project).",
        link: { label: "PLAY →", to: "/platform" },
      },
      {
        name: "Animée",
        place: "AI-generated animated film",
        role: "Personal project · in progress",
        description:
          "An animated 3D biography, from birth to age 20, entirely generated with AI (images and videos on ElevenLabs): one character across 7 ages and a first scene, “Paris, in the evening”.",
        link: { label: "WATCH →", to: "/animation-2-1" },
      },
      {
        name: "This website",
        place: "React, TypeScript, Tailwind CSS",
        role: "Personal project",
        description: "Personal site with projects, a playlist and an animation, in French and English.",
        link: { label: "SOURCE CODE ↗", href: SITE_REPO_URL },
      },
    ],
    educationLabel: "Education.",
    timeline: [
      { years: "2026 - 2027", title: "Bachelor's in Mathematics", place: "Université Paris Cité, Paris 6th" },
      { years: "2025 - 2026", title: "Bachelor's in MIASHS (Math, CS, Economics)", place: "University of Lille – Cité Scientifique campus" },
      { years: "2024 - 2025", title: "Two-year intensive prep program for top business schools (CPGE ECG)", place: "MyPrepa, Paris 15th" },
      {
        years: "2021 - 2024",
        title: "High school diploma, Mathematics-Economics & Social Sciences track",
        place: "Lycée Georges Clémenceau, Reims",
      },
    ],
    tagline: ["Mathematics student", "at Université Paris Cité"],
    getInTouch: "Get in touch at",
    privacy: "This site uses Google Analytics and GoatCounter to count visits.",
  },
};

// logos par formation, dans le même ordre que timeline (du plus récent au plus ancien)
const LOGOS: (string | null)[] = [logoParisCite, logoLille, logoMyPrepa, null];

/* couleurs : thème blanc = celles de la page d'origine (encre #141414, liens #ec0600) ;
   thème noir (classe "dark") = celles du reste du site */
const SANS = { fontFamily: '"Inter", sans-serif' };
const SERIF = { fontFamily: '"Cormorant Garamond", Georgia, serif' };

/* conteneur 1170px + grille 12 colonnes (gouttière 30px), colonnes empilées sur mobile */
const Container = ({ children, className = "" }: { children: ReactNode; className?: string }) => (
  <div className={`mx-auto w-full max-w-[1200px] px-[15px] ${className}`}>
    <div className="grid grid-cols-1 gap-x-[30px] gap-y-[30px] md:grid-cols-12">{children}</div>
  </div>
);

const ItemLine = ({ item, className = "text-[#ec0600] dark:text-white hover:underline" }: { item: Item; className?: string }) => {
  if (item.to)
    return (
      <Link to={item.to} className={className}>
        {item.label}
      </Link>
    );
  if (item.href)
    return (
      <a href={item.href} target="_blank" rel="noreferrer" className={className}>
        {item.label}
      </a>
    );
  return <span>{item.label}</span>;
};

/* carte "COMPÉTENCES / OUTILS / TECHNOLOGIES" : fond #f9fafe, padding 40/32/48 */
const ListCard = ({ label, items }: { label: string; items: Item[] }) => (
  <div className="md:col-span-4 bg-[#f9fafe] dark:bg-neutral-900/60 px-8 pt-10 pb-12">
    <p className="text-[12px] font-bold tracking-[1px]" style={SANS}>
      {label}
    </p>
    <ul className="mt-4 flex flex-col text-[16px] leading-[24px]" style={SANS}>
      {items.map((item) => (
        <li key={item.label}>
          <ItemLine item={item} />
        </li>
      ))}
    </ul>
  </div>
);

/* titre en capitales 32/40, gras */
const BigLabel = ({ children }: { children: ReactNode }) => (
  <h2 className="uppercase text-[26px] leading-[34px] md:text-[32px] md:leading-[40px] font-bold tracking-[0.5px]" style={SANS}>
    {children}
  </h2>
);

const Contact = () => {
  const { lang } = useLanguage();
  const s = STRINGS[lang];
  useDocumentTitle(s.pageTitle);

  return (
    <div className="min-h-screen w-full bg-white dark:bg-black text-[#141414] dark:text-white">
      <Navbar />

      {/* en-tête : nom, formation, coordonnées, boutons de contact */}
      <section className="pt-36 md:pt-40">
        <Container className="md:min-h-[240px] md:items-end">
          <div className="md:col-span-8 md:self-end">
            <h1 className="pb-2 text-[52px] leading-[60px] md:text-[84px] md:leading-[96px] font-light" style={SERIF}>
              BENJAMIN MOREL
            </h1>
            <p className="text-[18px] leading-[28px] md:text-[20px] md:leading-[32px]" style={SANS}>
              <a href={`mailto:${EMAIL}`} className="hover:underline">
                {EMAIL}
              </a>
              <br />
              <span className="opacity-60">{s.location}</span>
            </p>
            <p className="mt-4 text-[12px] leading-[20px] font-medium tracking-[1px]" style={SANS}>
              <Link to="/platform" className="text-[#6b6b6b] dark:text-white/60 hover:underline">
                {s.projectsCta}
              </Link>
            </p>
          </div>
          {/* contact en un tap : pleine largeur sur téléphone */}
          <div className="md:col-span-4 md:self-end grid grid-cols-2 gap-3 md:flex md:flex-wrap md:justify-end" style={SANS}>
            <a
              href={`mailto:${EMAIL}`}
              className="flex items-center justify-center border border-[#141414] bg-[#141414] px-6 py-4 text-[12px] tracking-[2px] text-white transition-colors hover:bg-white hover:text-[#141414] dark:border-white dark:bg-white dark:text-black dark:hover:bg-black dark:hover:text-white"
            >
              {s.writeMe}
            </a>
            <a
              href={LINKEDIN_URL}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center border border-[#141414]/30 dark:border-white/40 px-6 py-4 text-[12px] tracking-[2px] hover:border-[#141414] dark:hover:border-white transition-colors"
            >
              LINKEDIN
            </a>
            {/* partager la page (menu de partage du téléphone, ou copie du lien) */}
            <ShareButton
              title="Benjamin Morel"
              className="col-span-2 border border-[#141414]/30 dark:border-white/40 px-6 py-4 text-[12px] uppercase tracking-[2px] text-[#141414] dark:text-white hover:border-[#141414] dark:hover:border-white transition-colors"
            />
          </div>
        </Container>
      </section>

      {/* présentation */}
      <section className="mt-[72px]">
        <Container>
          <div className="md:col-span-8">
            <p className="text-[12px] font-bold tracking-[1px] uppercase" style={SANS}>
              {s.aboutLabel}
            </p>
            <p className="mt-4 text-[18px] leading-[28px] md:text-[20px] md:leading-[32px]" style={SANS}>
              {s.about}
            </p>
          </div>
        </Container>
      </section>

      {/* formation : même présentation que l'ancienne page Contact, juste après la présentation */}
      <section className="mt-[72px]">
        <Container>
          <div className="md:col-span-8 flex flex-col gap-4">
            <h2 className="text-[#141414] dark:text-white text-lg md:text-xl font-semibold">{s.educationLabel}</h2>
            <div className="flex flex-col gap-5">
              {s.timeline.map((item, i) => (
                <div key={item.years} className="grid grid-cols-[6.5rem_1fr] md:grid-cols-[8rem_2.5rem_1fr] gap-x-4 items-start">
                  <p className="text-[#141414]/50 dark:text-white/50 text-sm tabular-nums pt-0.5">{item.years}</p>
                  {/* logo masqué sur mobile, faute de place */}
                  <div className="hidden md:block h-10 w-10">
                    {LOGOS[i] && (
                      <img
                        src={LOGOS[i]}
                        alt=""
                        /* le logo de Lille est blanc : passé en noir en thème blanc pour rester visible */
                        className={`h-10 w-10 object-contain ${LOGOS[i] === logoLille ? "brightness-0 dark:brightness-100" : ""}`}
                      />
                    )}
                  </div>
                  <div>
                    <p className="text-[#141414] dark:text-white text-sm md:text-base font-medium">{item.title}</p>
                    <p className="text-[#141414]/60 dark:text-white/60 text-sm">{item.place}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* compétences / outils / technologies */}
      <section className="mt-[72px]">
        <Container>
          <ListCard label={s.skillsLabel} items={s.skills} />
          <ListCard label={s.toolsLabel} items={s.tools} />
          <ListCard label={s.techLabel} items={s.tech} />
        </Container>
      </section>

      {/* projets : décalés de 2 colonnes */}
      <section className="pt-[72px] md:pt-[120px] md:pb-4">
        <Container>
          <div className="md:col-span-8 md:col-start-3">
            <p className="text-[12px] font-bold tracking-[1px] uppercase" style={SANS}>
              {s.projectsLabel}
            </p>
          </div>
        </Container>
      </section>
      {s.entries.map((entry) => (
        <section key={entry.name}>
          <Container className="py-12 md:py-16">
            <div className="md:col-span-8 md:col-start-3">
              <div className="pb-4">
                <BigLabel>
                  {entry.name}
                  <br />
                  <span className="opacity-60">{entry.place}</span>
                </BigLabel>
              </div>
              <p className="pb-4 text-[18px] leading-[24px] opacity-50" style={SANS}>
                {entry.role}
              </p>
              <p className="text-[16px] leading-[24px]" style={SANS}>
                {entry.description}
              </p>
              {entry.link && (
                <p className="mt-4 text-[12px] leading-[20px] font-medium tracking-[1px]" style={SANS}>
                  <ItemLine item={entry.link} className="text-[#ec0600] dark:text-white hover:underline" />
                </p>
              )}
            </div>
          </Container>
        </section>
      ))}

      <div className="h-[72px]" />
      {/* pied de page noir plein écran */}
      <section className="flex min-h-screen items-center bg-black">
        <Container>
          <div className="md:col-span-8 md:col-start-3 pt-14 text-center">
            <p className="hidden md:block pb-2 text-[112px] leading-[112px] font-bold tracking-[0.5px] text-white" style={SERIF}>
              BENJAMIN MOREL
            </p>
            <p className="md:hidden pb-2 text-[32px] leading-[40px] font-black tracking-[0.5px] text-[#757575]" style={SANS}>
              BENJAMIN MOREL
            </p>
            <p className="pb-14 text-[16px] leading-[24px] tracking-[0.3px] text-[#939393]" style={SANS}>
              {s.tagline[0]}
              <br />
              {s.tagline[1]}
            </p>
            <p className="text-[16px] leading-[24px] tracking-[0.3px] text-[#939393]" style={SANS}>
              {s.getInTouch}
            </p>
            <p className="text-[20px] leading-[32px] md:text-[28px] md:leading-[40px] break-words" style={SANS}>
              <a href={`mailto:${EMAIL}`} className="text-white hover:underline">
                {EMAIL}
              </a>
            </p>
            <p className="py-14 text-[12px] leading-[16px] font-black tracking-[2px] text-white" style={SANS}>
              <a href={LINKEDIN_URL} target="_blank" rel="noreferrer" className="hover:underline">
                LINKEDIN
              </a>
              &nbsp; / &nbsp;
              <a href={GITHUB_URL} target="_blank" rel="noreferrer" className="hover:underline">
                GITHUB
              </a>
              &nbsp; / &nbsp;
              <a href={YOUTUBE_URL} target="_blank" rel="noreferrer" className="hover:underline">
                YOUTUBE
              </a>
            </p>
            {/* mention de la mesure d'audience (demandée par les conditions de Google Analytics) */}
            <p className="pb-10 text-[12px] leading-[16px] text-[#6b6b6b]" style={SANS}>
              {s.privacy}
            </p>
          </div>
        </Container>
      </section>
    </div>
  );
};

export default Contact;
