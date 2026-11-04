import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import avatar from "../assets/avatar.png";
import logoMyPrepa from "../assets/logo-myprepa.png";
import logoLille from "../assets/logo-lille.png";
import logoParisCite from "../assets/logo-paris-cite.png";
import useDocumentTitle from "../hooks/useDocumentTitle";
import { useLanguage } from "../i18n/LanguageContext";

const GITHUB_URL = "https://github.com/BenjaminMorel1";
const YOUTUBE_URL = "https://www.youtube.com/@pardise3604";
const EMAIL = "benjaminmorelproject@gmail.com";

// mise en page inspirée d'une fiche académique : identité, présentation, parcours, projets
const STRINGS = {
  fr: {
    pageTitle: "Contact | Benjamin Morel",
    heading: "Contact",
    name: "Benjamin Morel",
    affiliation: "Licence Mathématiques, Université Paris Cité — Paris 6ème",
    aboutLabel: "Présentation.",
    about:
      "Étudiant de 20 ans en licence de mathématiques à l'Université Paris Cité, après une classe préparatoire ECG et une licence MIASHS à Lille. Je m'intéresse aux mathématiques, à l'informatique et à l'économie, et je partage ici mes projets.",
    timelineLabel: "Formation.",
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
    projectsLabel: "Projets.",
    projects: [
      {
        title: "Balls Crush",
        description: "Casse-briques jouable dans la page : combos, bonus et 3 niveaux de difficulté croissante.",
      },
      {
        title: "Elden Ring",
        description: "Action-RPG 3D dans le navigateur : combat à l'épée, roulade, verrouillage de cible et fioles de soin.",
      },
    ],
    projectsLink: "voir les projets →",
  },
  en: {
    pageTitle: "Contact | Benjamin Morel",
    heading: "Contact",
    name: "Benjamin Morel",
    affiliation: "Bachelor's in Mathematics, Université Paris Cité — Paris 6th",
    aboutLabel: "About.",
    about:
      "20-year-old student doing a Bachelor's in Mathematics at Université Paris Cité, after a CPGE ECG prep program and a MIASHS Bachelor's in Lille. I'm interested in mathematics, computer science and economics, and I share my projects here.",
    timelineLabel: "Education.",
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
    projectsLabel: "Projects.",
    projects: [
      {
        title: "Balls Crush",
        description: "In-page breakout game: combos, power-ups and 3 levels of rising difficulty.",
      },
      {
        title: "Elden Ring",
        description: "3D action-RPG in the browser: sword combat, dodge rolls, target lock-on and healing flasks.",
      },
    ],
    projectsLink: "see the projects →",
  },
} as const;

// logos par formation, dans le même ordre que timeline (du plus récent au plus ancien)
const LOGOS: (string | null)[] = [logoParisCite, logoLille, logoMyPrepa, null];

const SectionLabel = ({ children }: { children: string }) => (
  <h2 className="text-white text-lg md:text-xl font-semibold">{children}</h2>
);

const Contact = () => {
  const { lang } = useLanguage();
  const s = STRINGS[lang];
  useDocumentTitle(s.pageTitle);

  return (
    <section className="relative min-h-screen w-full bg-black">
      <Navbar />

      {/* avatar à droite du nom, même taille/position que sur la home */}
      <img
        src={avatar}
        alt="Benjamin Morel"
        className="absolute z-20 left-[clamp(9rem,16vmin,15rem)] top-[clamp(0.75rem,2vmin,1.5rem)] h-[clamp(3.5rem,18vmin,18rem)] w-[clamp(3.5rem,18vmin,18rem)] md:h-[clamp(3.5rem,min(18vmin,13vw),18rem)] md:w-[clamp(3.5rem,min(18vmin,13vw),18rem)] shrink-0 rounded-full object-cover ring-1 ring-white/30"
      />

      {/* contenu en haut de page (plus centré verticalement) : il défile s'il dépasse l'écran */}
      <div className="flex flex-col items-start px-6 md:px-24 pt-[clamp(7rem,24vmin,20rem)] pb-24">
        <h1 className="hero-title text-white font-medium text-[12vw] md:text-[6vw]">{s.heading}</h1>

        <div className="mt-10 flex flex-col gap-12 max-w-3xl w-full">
          {/* identité et coordonnées */}
          <div className="flex flex-col gap-2">
            <p className="text-white text-2xl md:text-3xl font-medium">{s.name}</p>
            <p className="text-white/60 text-sm md:text-base">{s.affiliation}</p>
            <a
              href={`mailto:${EMAIL}`}
              className="text-white/80 hover:text-white text-sm md:text-base underline underline-offset-4 w-fit"
            >
              {EMAIL}
            </a>
            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noreferrer"
              className="text-white/80 hover:text-white text-sm md:text-base underline underline-offset-4 w-fit"
            >
              github.com/BenjaminMorel1
            </a>
            <a
              href={YOUTUBE_URL}
              target="_blank"
              rel="noreferrer"
              className="text-white/80 hover:text-white text-sm md:text-base underline underline-offset-4 w-fit"
            >
              youtube.com/@pardise3604
            </a>
          </div>

          <div className="flex flex-col gap-3">
            <SectionLabel>{s.aboutLabel}</SectionLabel>
            <p className="text-white/70 text-sm md:text-base leading-relaxed">{s.about}</p>
          </div>

          <div className="flex flex-col gap-4">
            <SectionLabel>{s.timelineLabel}</SectionLabel>
            <div className="flex flex-col gap-5">
              {s.timeline.map((item, i) => (
                <div key={item.years} className="grid grid-cols-[6.5rem_1fr] md:grid-cols-[8rem_2.5rem_1fr] gap-x-4 items-start">
                  <p className="text-white/50 text-sm tabular-nums pt-0.5">{item.years}</p>
                  {/* logo masqué sur mobile, faute de place */}
                  <div className="hidden md:block h-10 w-10">
                    {LOGOS[i] && <img src={LOGOS[i]} alt="" className="h-10 w-10 object-contain" />}
                  </div>
                  <div>
                    <p className="text-white text-sm md:text-base font-medium">{item.title}</p>
                    <p className="text-white/60 text-sm">{item.place}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <SectionLabel>{s.projectsLabel}</SectionLabel>
            <div className="flex flex-col gap-4">
              {s.projects.map((project) => (
                <div key={project.title}>
                  <p className="text-white text-sm md:text-base font-medium">{project.title}</p>
                  <p className="text-white/60 text-sm">{project.description}</p>
                </div>
              ))}
            </div>
            <Link to="/platform" className="text-white/80 hover:text-white text-sm underline underline-offset-4 w-fit">
              {s.projectsLink}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
