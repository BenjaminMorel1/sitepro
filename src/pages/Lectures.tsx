import Navbar from "../components/Navbar";
import useDocumentTitle from "../hooks/useDocumentTitle";
import { useLanguage } from "../i18n/LanguageContext";

const STRINGS = {
  fr: {
    pageTitle: "Lectures | Benjamin Morel",
    title: "Lectures",
    description:
      "les livres, articles et vidéos qui m'ont marqué, entre maths, économie et informatique. bientôt en ligne.",
    cta: "bientôt",
    sections: [
      {
        key: "maths",
        icon: "∫ Σ ℙ",
        gradient: "from-emerald-400/20 via-teal-500/10",
        tag: "maths",
        title: "Mathématiques",
        description: "les ouvrages qui m'ont aidé en prépa et en licence, et ceux que je lis par plaisir.",
      },
      {
        key: "eco",
        icon: "€ %",
        gradient: "from-amber-400/20 via-orange-500/10",
        tag: "économie",
        title: "Économie",
        description: "essais et manuels pour comprendre les marchés, les politiques publiques et l'histoire économique.",
      },
      {
        key: "info",
        icon: "</>",
        gradient: "from-sky-400/20 via-indigo-500/10",
        tag: "informatique",
        title: "Informatique",
        description: "programmation, algorithmes et tout ce qui m'a servi à construire mes projets.",
      },
    ],
  },
  en: {
    pageTitle: "Readings | Benjamin Morel",
    title: "Readings",
    description:
      "the books, articles and videos that left a mark on me, across maths, economics and computer science. coming soon.",
    cta: "coming soon",
    sections: [
      {
        key: "maths",
        icon: "∫ Σ ℙ",
        gradient: "from-emerald-400/20 via-teal-500/10",
        tag: "maths",
        title: "Mathematics",
        description: "the books that helped me through prep school and my degree, and the ones I read for fun.",
      },
      {
        key: "eco",
        icon: "€ %",
        gradient: "from-amber-400/20 via-orange-500/10",
        tag: "economics",
        title: "Economics",
        description: "essays and textbooks to understand markets, public policy and economic history.",
      },
      {
        key: "info",
        icon: "</>",
        gradient: "from-sky-400/20 via-indigo-500/10",
        tag: "computer science",
        title: "Computer science",
        description: "programming, algorithms and everything that helped me build my projects.",
      },
    ],
  },
} as const;

const Lectures = () => {
  const { lang } = useLanguage();
  const s = STRINGS[lang];
  useDocumentTitle(s.pageTitle);

  return (
    <>
      <Navbar />
      <section className="relative min-h-screen w-full bg-black text-white px-6 md:px-10 py-24">
        <div className="max-w-[1280px] mx-auto mb-10">
          <h1 className="hero-title text-5xl md:text-7xl font-medium">{s.title}</h1>
          <p className="mt-4 max-w-lg text-[15px] leading-snug text-white/70">{s.description}</p>
        </div>

        <div className="max-w-[1280px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {s.sections.map((section) => (
            <div key={section.key} className="text-left rounded-3xl border border-white/10 bg-neutral-900/40 p-8">
              <div
                className={`h-40 rounded-2xl mb-6 flex items-center justify-center text-5xl font-light bg-gradient-to-br ${section.gradient} to-neutral-900`}
              >
                {section.icon}
              </div>
              <div className="text-xs uppercase tracking-wide text-white/40 mb-2">{section.tag}</div>
              <h2 className="text-2xl font-medium mb-2">{section.title}</h2>
              <p className="text-sm text-white/60 mb-6">{section.description}</p>
              <span className="inline-block rounded-full border border-white/20 text-white/70 text-sm font-normal px-6 py-2.5">
                {s.cta}
              </span>
            </div>
          ))}
        </div>
      </section>
    </>
  );
};

export default Lectures;
