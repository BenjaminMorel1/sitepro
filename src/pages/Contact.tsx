import Navbar from "../components/Navbar";
import avatar from "../assets/avatar.png";
import logoMyPrepa from "../assets/logo-myprepa.png";
import logoLille from "../assets/logo-lille.png";
import logoParisCite from "../assets/logo-paris-cite.png";
import useDocumentTitle from "../hooks/useDocumentTitle";
import { useLanguage } from "../i18n/LanguageContext";

const STRINGS = {
  fr: {
    pageTitle: "Contact | Securify",
    heading: "contact",
    education: [
      {
        title: "Baccalauréat spécialités Mathématiques-Sciences économiques et sociales",
        place: "Lycée Georges Clémenceau, Reims",
        years: "2021-2024",
      },
      {
        title: "Classe Préparatoire aux Grandes Écoles (CPGE ECG)",
        place: "MyPrepa, Paris 15ème",
        years: "2024-2025",
      },
      {
        title: "Licence 2 MIASHS (Maths, Info, Économie)",
        place: "Université de Lille – Cité scientifique",
        years: "2025-2026",
      },
      {
        title: "Licence 3 Mathématiques",
        place: "Université Paris Cité, Paris 6ème",
        years: "2026-2027",
      },
    ],
  },
  en: {
    pageTitle: "Contact | Securify",
    heading: "contact",
    education: [
      {
        title: "High school diploma, Mathematics-Economics & Social Sciences track",
        place: "Lycée Georges Clémenceau, Reims",
        years: "2021-2024",
      },
      {
        title: "Two-year intensive prep program for top business schools (CPGE ECG)",
        place: "MyPrepa, Paris 15th",
        years: "2024-2025",
      },
      {
        title: "2nd year Bachelor's in MIASHS (Math, CS, Economics)",
        place: "University of Lille – Cité Scientifique campus",
        years: "2025-2026",
      },
      {
        title: "3rd year Bachelor's in Mathematics",
        place: "Université Paris Cité, Paris 6th",
        years: "2026-2027",
      },
    ],
  },
} as const;

// logos par formation, dans le même ordre que education
const LOGOS: (string | null)[] = [null, logoMyPrepa, logoLille, logoParisCite];

type EducationItem = (typeof STRINGS)["fr"]["education"][number] | (typeof STRINGS)["en"]["education"][number];

const EducationEntry = ({ item, logo }: { item: EducationItem; logo: string | null }) => (
  <div className="relative border-l border-white/20 pl-4">
    {/* logo dans la marge gauche : ne décale pas le texte */}
    {logo && (
      <img
        src={logo}
        alt=""
        className="hidden md:block absolute right-full top-1/2 -translate-y-1/2 mr-4 h-12 w-12 object-contain"
      />
    )}
    <p className="text-white text-base md:text-lg font-medium">{item.title}</p>
    <p className="text-white/60 text-sm mt-1">{item.place}</p>
    <p className="text-white/40 text-sm">{item.years}</p>
  </div>
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
        className="absolute z-20 left-[clamp(9rem,16vmin,15rem)] top-[clamp(0.75rem,2vmin,1.5rem)] h-[clamp(3.5rem,18vmin,18rem)] w-[clamp(3.5rem,18vmin,18rem)] shrink-0 rounded-full object-cover ring-1 ring-white/30"
      />

      <div className="flex min-h-screen flex-col items-start justify-center px-6 md:px-24 pt-24">
        <h1 className="hero-title text-white font-medium text-[12vw] md:text-[6vw]">{s.heading}</h1>

        <div className="relative mt-10 flex flex-col gap-6 max-w-xl">
          {s.education.slice(0, -1).map((item, i) => (
            <EducationEntry key={item.title} item={item} logo={LOGOS[i]} />
          ))}
          {/* dernière formation hors flux pour ne pas recentrer le reste de la page */}
          <div className="absolute left-0 top-full mt-6 w-full">
            <EducationEntry item={s.education[s.education.length - 1]} logo={LOGOS[s.education.length - 1]} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
