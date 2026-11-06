import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import ShareButton from "../components/ShareButton";
import useDocumentTitle from "../hooks/useDocumentTitle";
import { useLanguage } from "../i18n/LanguageContext";

/* ------------------------------------------------------------------ */
/* page "résumé" : reprend la mise en page de abdussalam.pk/resume     */
/* (fond blanc, grille 12 colonnes de 1170px, liens rouges, cartes     */
/* compétences/outils/technologies, entrées décalées de 2 colonnes,    */
/* pied de page noir plein écran) avec les infos de Benjamin.          */
/* Polices : Contralto/Elza (Adobe Fonts, payantes) remplacées par     */
/* Cormorant Garamond et Inter.                                        */
/* ------------------------------------------------------------------ */

const GITHUB_URL = "https://github.com/BenjaminMorel1";
const YOUTUBE_URL = "https://www.youtube.com/@pardise3604";
const LINKEDIN_URL = "https://www.linkedin.com/in/benjamin-morel-bb839a3ab/";
const SITE_REPO_URL = "https://github.com/BenjaminMorel1/sitepro";
const EMAIL = "benjaminmorelproject@gmail.com";

type Item = { label: string; to?: string; href?: string };
type Entry = { name: string; place: string; role: string; description: string };
type Degree = { title: string; subtitle?: string; school: string };

type Strings = {
  pageTitle: string;
  location: string;
  projectsCta: string;
  button: string;
  skillsLabel: string;
  skills: Item[];
  toolsLabel: string;
  tools: Item[];
  techLabel: string;
  tech: Item[];
  entries: Entry[];
  educationLabel: string;
  education: Degree[];
  tagline: [string, string];
  getInTouch: string;
};

const STRINGS: Record<"fr" | "en", Strings> = {
  fr: {
    pageTitle: "Résumé | Benjamin Morel",
    location: "Paris, France",
    projectsCta: "VOIR LES PROJETS →",
    button: "ME CONTACTER",
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
    tech: [{ label: "Python" }, { label: "Pandas" }, { label: "Jupyter" }],
    entries: [
      {
        name: "Jeux dans le navigateur",
        place: "Balls Crush · Elden Ring",
        role: "Projets personnels",
        description:
          "Balls Crush : casse-briques jouable dans la page, avec combos, bonus et 3 niveaux de difficulté croissante. Elden Ring : action-RPG 3D avec combat à l'épée, roulade, verrouillage de cible et fioles de soin.",
      },
      {
        name: "Animée",
        place: "Film d'animation généré par IA",
        role: "Projet personnel · en cours",
        description:
          "Biographie animée en 3D, de la naissance à 20 ans, entièrement générée par IA (images et vidéos sur ElevenLabs) : un personnage décliné en 7 âges et une première scène, « Paris, le soir ».",
      },
      {
        name: "Ce site",
        place: "React, TypeScript, Tailwind CSS",
        role: "Projet personnel",
        description: "Site personnel avec projets, playlist, blog et lectures, en français et en anglais.",
      },
    ],
    educationLabel: "Formation",
    education: [
      { title: "Licence", subtitle: "Mathématiques · 2026 - 2027", school: "Université Paris Cité, Paris 6ème" },
      { title: "Licence MIASHS", subtitle: "Maths, Info, Économie · 2025 - 2026", school: "Université de Lille – Cité scientifique" },
      { title: "Classe Préparatoire aux Grandes Écoles", subtitle: "CPGE ECG · 2024 - 2025", school: "MyPrepa, Paris 15ème" },
      {
        title: "Baccalauréat",
        subtitle: "Spécialités Mathématiques-Sciences économiques et sociales · 2021 - 2024",
        school: "Lycée Georges Clémenceau, Reims",
      },
    ],
    tagline: ["Étudiant en mathématiques", "à l'Université Paris Cité"],
    getInTouch: "Pour me contacter",
  },
  en: {
    pageTitle: "Résumé | Benjamin Morel",
    location: "Paris, France",
    projectsCta: "SEE THE PROJECTS →",
    button: "CONTACT ME",
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
    tech: [{ label: "Python" }, { label: "Pandas" }, { label: "Jupyter" }],
    entries: [
      {
        name: "Browser games",
        place: "Balls Crush · Elden Ring",
        role: "Personal projects",
        description:
          "Balls Crush: an in-page breakout game with combos, power-ups and 3 levels of rising difficulty. Elden Ring: a 3D action-RPG with sword combat, dodge rolls, target lock-on and healing flasks.",
      },
      {
        name: "Animée",
        place: "AI-generated animated film",
        role: "Personal project · in progress",
        description:
          "An animated 3D biography, from birth to age 20, entirely generated with AI (images and videos on ElevenLabs): one character across 7 ages and a first scene, “Paris, in the evening”.",
      },
      {
        name: "This website",
        place: "React, TypeScript, Tailwind CSS",
        role: "Personal project",
        description: "Personal site with projects, a playlist, a blog and readings, in French and English.",
      },
    ],
    educationLabel: "Education",
    education: [
      { title: "Bachelor's", subtitle: "Mathematics · 2026 - 2027", school: "Université Paris Cité, Paris 6th" },
      { title: "Bachelor's in MIASHS", subtitle: "Math, CS, Economics · 2025 - 2026", school: "University of Lille – Cité Scientifique campus" },
      { title: "CPGE ECG prep program", subtitle: "Top business schools track · 2024 - 2025", school: "MyPrepa, Paris 15th" },
      {
        title: "High school diploma",
        subtitle: "Mathematics-Economics & Social Sciences track · 2021 - 2024",
        school: "Lycée Georges Clémenceau, Reims",
      },
    ],
    tagline: ["Mathematics student", "at Université Paris Cité"],
    getInTouch: "Get in touch at",
  },
};

/* couleurs et polices relevées sur la page d'origine */
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

const ItemLine = ({ item }: { item: Item }) => {
  const cls = "text-[#ec0600] dark:text-white hover:underline";
  if (item.to)
    return (
      <Link to={item.to} className={cls}>
        {item.label}
      </Link>
    );
  if (item.href)
    return (
      <a href={item.href} target="_blank" rel="noreferrer" className={cls}>
        {item.label}
      </a>
    );
  return <span>{item.label}</span>;
};

/* carte "SKILLS / TOOLS / TECHNOLOGIES" : fond #f9fafe, padding 40/32/48 */
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

const Divider = () => (
  <Container className="pb-[72px]">
    <div className="md:col-span-8 md:col-start-3 h-px bg-[#e5e5e5] dark:bg-white/10" />
  </Container>
);

const Resume = () => {
  const { lang } = useLanguage();
  const s = STRINGS[lang];
  useDocumentTitle(s.pageTitle);

  return (
    <div className="min-h-screen w-full bg-white dark:bg-black text-[#141414] dark:text-white">
      <Navbar />

      {/* en-tête : nom, coordonnées, lien, bouton (hauteur 240px, aligné en bas) */}
      <section className="pt-36 md:pt-40">
        <Container className="md:min-h-[240px] md:items-end">
          <div className="md:col-span-8 md:self-end">
            <p
              className="pb-2 text-[52px] leading-[60px] md:text-[84px] md:leading-[96px] font-light"
              style={SERIF}
            >
              BENJAMIN MOREL
            </p>
            <p className="text-[18px] leading-[28px] md:text-[20px] md:leading-[32px]" style={SANS}>
              <a href={`mailto:${EMAIL}`} className="hover:underline">
                {EMAIL}
              </a>
              <br />
              {s.location}
            </p>
            <p className="mt-4 text-[12px] leading-[20px] font-medium tracking-[1px]" style={SANS}>
              <Link to="/platform" className="text-[#6b6b6b] dark:text-white/60 hover:underline">
                {s.projectsCta}
              </Link>
            </p>
          </div>
          <div className="md:col-span-4 md:self-end flex flex-wrap items-center gap-4 md:justify-end">
            {/* partager le résumé (menu de partage du téléphone, ou copie du lien) */}
            <ShareButton
              title="Benjamin Morel — résumé"
              className="border border-[#141414]/30 dark:border-white/40 px-6 py-4 text-[12px] uppercase tracking-[2px] text-[#141414] dark:text-white hover:border-[#141414] dark:hover:border-white transition-colors"
            />
            <Link
              to="/contact"
              className="group inline-block border border-[#141414] bg-[#141414] px-14 py-4 text-[12px] tracking-[2px] text-white transition-colors hover:bg-white hover:text-[#141414] dark:border-white dark:bg-white dark:text-black dark:hover:bg-black dark:hover:text-white"
              style={SANS}
            >
              {s.button}
            </Link>
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

      {/* entrées (projets à la place de l'expérience) : décalées de 2 colonnes, centrées dans 504px */}
      {s.entries.map((entry) => (
        <section key={entry.name}>
          <Container className="py-16 md:py-0 md:min-h-[504px] md:items-center">
            <div className="md:col-span-8 md:col-start-3">
              <div className="pb-4">
                <BigLabel>
                  {entry.name}
                  <br />
                  {entry.place}
                </BigLabel>
              </div>
              <p className="pb-4 text-[18px] leading-[24px] opacity-50" style={SANS}>
                {entry.role}
              </p>
              <p className="text-[16px] leading-[24px]" style={SANS}>
                {entry.description}
              </p>
            </div>
          </Container>
        </section>
      ))}

      <Divider />

      {/* formation */}
      <section className="bg-white dark:bg-black pb-[72px]">
        <Container>
          <div className="md:col-span-6 md:col-start-3">
            <div className="pb-4">
              <BigLabel>{s.educationLabel}</BigLabel>
            </div>
            <div className="flex flex-col gap-6">
              {s.education.map((d) => (
                <div key={d.school}>
                  <p className="text-[18px] leading-[24px]" style={SANS}>
                    {d.title}
                    {d.subtitle && (
                      <>
                        <br />
                        {d.subtitle}
                      </>
                    )}
                  </p>
                  <p className="mt-1 text-[16px] leading-[24px]" style={SANS}>
                    {d.school}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* pied de page noir plein écran */}
      <section className="flex min-h-screen items-center bg-black">
        <Container>
          <div className="md:col-span-8 md:col-start-3 pt-14 text-center">
            <p
              className="hidden md:block pb-2 text-[112px] leading-[112px] font-bold tracking-[0.5px] text-white"
              style={SERIF}
            >
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
          </div>
        </Container>
      </section>
    </div>
  );
};

export default Resume;
