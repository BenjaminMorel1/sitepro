import Navbar from "../components/Navbar";
import useDocumentTitle from "../hooks/useDocumentTitle";
import { useLanguage } from "../i18n/LanguageContext";

const STRINGS = {
  fr: {
    pageTitle: "Maths 2 | Benjamin Morel",
    title: "Maths",
    description:
      "Mes notes de Licence 3 de mathématiques à l'Université Paris Cité : fiches de cours, démonstrations que je trouve belles et petits outils pour visualiser les idées. Bientôt en ligne.",
    sections: {
      prepa: {
        tag: "classe préparatoire · 2 ans",
        title: "Prépa ECG",
        description:
          "mes fiches et exercices de prépa ECG : analyse, algèbre linéaire et probabilités, avec les méthodes à connaître pour les concours.",
        cta: "bientôt",
      },
    },
  },
  en: {
    pageTitle: "Maths 2 | Benjamin Morel",
    title: "Maths",
    description:
      "My notes from my 3rd year of Mathematics at Université Paris Cité: course sheets, proofs I find beautiful and small tools to visualise the ideas. Coming soon.",
    sections: {
      prepa: {
        tag: "prep program · 2 years",
        title: "CPGE ECG",
        description:
          "my sheets and exercises from the ECG prep program: analysis, linear algebra and probability, with the methods you need for the entrance exams.",
        cta: "coming soon",
      },
    },
  },
} as const;

const Maths2 = () => {
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
          <div className="text-left rounded-3xl border border-white/10 bg-neutral-900/40 p-8">
            <div className="h-40 rounded-2xl mb-6 flex items-center justify-center text-5xl font-light bg-gradient-to-br from-emerald-400/20 via-teal-500/10 to-neutral-900">
              ∫ Σ ℙ
            </div>
            <div className="text-xs uppercase tracking-wide text-white/40 mb-2">{s.sections.prepa.tag}</div>
            <h2 className="text-2xl font-medium mb-2">{s.sections.prepa.title}</h2>
            <p className="text-sm text-white/60 mb-6">{s.sections.prepa.description}</p>
            <span className="inline-block rounded-full border border-white/20 text-white/70 text-sm font-normal px-6 py-2.5">
              {s.sections.prepa.cta}
            </span>
          </div>
        </div>
      </section>
    </>
  );
};

export default Maths2;
