import Navbar from "../components/Navbar";
import useDocumentTitle from "../hooks/useDocumentTitle";
import heroImage from "../assets/solutions-hero.jpg";
import { useLanguage } from "../i18n/LanguageContext";

/* ------------------------------------------------------------------ */
/* "HEAVYWEIGHT" — design system brutaliste appliqué à la page         */
/* Solutions. Palette Concrete/Ink, Anton + Space Grotesk, grain,      */
/* mix-blend-difference, hover line-through, images N&B → couleur.     */
/* Composant autonome (police + grain injectés localement) pour rester */
/* facile à retirer entièrement si besoin.                             */
/* ------------------------------------------------------------------ */

const GRAIN_BG =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";

const ARCHITECTURE_SPECS = ["AES-256", "TLS 1.3", "SOC 2 TYPE II", "ZERO TRUST"] as const;
const ALL_REGIONS = ["US", "EU", "APAC"] as const;

const STRINGS = {
  fr: {
    pageTitle: "Solutions | Benjamin Morel",
    heroLine1: "Défense",
    heroLine2: "conçue.",
    heroParagraph:
      "une infrastructure de sécurité modulaire pour les équipes qui avancent vite et ne peuvent pas se permettre d'improviser. chiffrement, contrôle d'accès et surveillance, assemblés sur mesure.",
    viewModules: "voir les modules",
    imageCaption: "solutions 004",
    modulesHeading: "modules",
    active: "actif",
    architectureHeading: "architecture",
    deploymentHeading: "statut de déploiement",
    trustedByHeading: "ils nous font confiance",
    modules: [
      { code: "MOD-01", name: "noyau de chiffrement" },
      { code: "MOD-02", name: "contrôle d'accès" },
      { code: "MOD-03", name: "surveillance des menaces" },
      { code: "MOD-04", name: "moteur de conformité" },
      { code: "MOD-05", name: "réponse aux incidents" },
    ],
    deployments: [
      { name: "noyau de chiffrement", regions: ["US", "EU", "APAC"], span: "col-span-12 md:col-span-6" },
      { name: "surveillance des menaces", regions: ["US", "EU"], span: "col-span-12 md:col-span-3 md:mt-16" },
      { name: "contrôle d'accès", regions: ["US", "EU", "APAC"], span: "col-span-12 md:col-span-3" },
      { name: "moteur de conformité", regions: ["US"], span: "col-span-12 md:col-span-4 md:mt-8" },
      { name: "réponse aux incidents", regions: ["US", "EU"], span: "col-span-12 md:col-span-5" },
      { name: "résidence des données", regions: ["EU"], span: "col-span-12 md:col-span-3 md:mt-24" },
    ],
    testimonials: [
      { quote: "nous avons obtenu la certification soc2 en six semaines au lieu de six mois.", handle: "@ops.lead", rotate: "rotate-1" },
      { quote: "le seul fournisseur dont la documentation semble écrite par un ingénieur.", handle: "@cto.startup", rotate: "-rotate-1" },
      { quote: "la réponse aux incidents a réduit notre mttr de 70%.", handle: "@security.eng", rotate: "rotate-2" },
      { quote: "confiance zéro, friction nulle.", handle: "@platform.team", rotate: "-rotate-2" },
    ],
    footerColumns: [
      { title: "solutions", links: ["chiffrement", "contrôle d'accès", "surveillance", "conformité"] },
      { title: "entreprise", links: ["à propos", "carrières", "presse"] },
      { title: "ressources", links: ["docs", "changelog", "statut"] },
    ],
  },
  en: {
    pageTitle: "Solutions | Benjamin Morel",
    heroLine1: "Engineered",
    heroLine2: "defense.",
    heroParagraph:
      "modular security infrastructure for teams who ship fast and can't afford to guess. encryption, access control and monitoring, assembled to fit.",
    viewModules: "view modules",
    imageCaption: "solutions 004",
    modulesHeading: "modules",
    active: "active",
    architectureHeading: "architecture",
    deploymentHeading: "deployment status",
    trustedByHeading: "trusted by",
    modules: [
      { code: "MOD-01", name: "Encryption Core" },
      { code: "MOD-02", name: "Access Control" },
      { code: "MOD-03", name: "Threat Monitoring" },
      { code: "MOD-04", name: "Compliance Engine" },
      { code: "MOD-05", name: "Incident Response" },
    ],
    deployments: [
      { name: "Encryption Core", regions: ["US", "EU", "APAC"], span: "col-span-12 md:col-span-6" },
      { name: "Threat Monitoring", regions: ["US", "EU"], span: "col-span-12 md:col-span-3 md:mt-16" },
      { name: "Access Control", regions: ["US", "EU", "APAC"], span: "col-span-12 md:col-span-3" },
      { name: "Compliance Engine", regions: ["US"], span: "col-span-12 md:col-span-4 md:mt-8" },
      { name: "Incident Response", regions: ["US", "EU"], span: "col-span-12 md:col-span-5" },
      { name: "Data Residency", regions: ["EU"], span: "col-span-12 md:col-span-3 md:mt-24" },
    ],
    testimonials: [
      { quote: "we shipped soc2 in six weeks instead of six months.", handle: "@ops.lead", rotate: "rotate-1" },
      { quote: "the only vendor whose docs read like an engineer wrote them.", handle: "@cto.startup", rotate: "-rotate-1" },
      { quote: "incident response cut our mttr by 70%.", handle: "@security.eng", rotate: "rotate-2" },
      { quote: "zero trust, actually zero friction.", handle: "@platform.team", rotate: "-rotate-2" },
    ],
    footerColumns: [
      { title: "solutions", links: ["encryption", "access control", "monitoring", "compliance"] },
      { title: "company", links: ["about", "careers", "press"] },
      { title: "resources", links: ["docs", "changelog", "status"] },
    ],
  },
} as const;

const Solutions = () => {
  const { lang } = useLanguage();
  const s = STRINGS[lang];
  useDocumentTitle(s.pageTitle);

  return (
    <div className="relative bg-[#f2f2f2] text-[#0a0a0a]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
      <style>{`
        @import url("https://fonts.googleapis.com/css2?family=Anton&family=Space+Grotesk:wght@400;500;700&display=swap");
      `}</style>

      {/* grain persistant */}
      <div
        className="pointer-events-none fixed inset-0 z-10 opacity-[0.04]"
        style={{ backgroundImage: GRAIN_BG }}
        aria-hidden="true"
      />

      <Navbar />

      {/* ---------------------------------------------------------- */}
      {/* hero asymétrique */}
      {/* ---------------------------------------------------------- */}
      <section className="relative min-h-screen w-full overflow-hidden px-6 pt-40 pb-24 md:px-10">
        <div className="md:w-[42%]">
          <h1
            className="uppercase leading-[0.85] tracking-tighter text-6xl sm:text-7xl md:text-9xl"
            style={{ fontFamily: "'Anton', sans-serif" }}
          >
            {s.heroLine1}
            <br />
            {s.heroLine2}
          </h1>
          <p className="mt-8 max-w-[320px] text-sm leading-relaxed tracking-wide text-[#0a0a0a]/70">
            {s.heroParagraph}
          </p>
          <a
            href="#modules"
            className="mt-8 inline-block border-b-2 border-[#0a0a0a] pb-1 text-xs uppercase tracking-widest hover:line-through"
            style={{ textDecorationThickness: "2px" }}
          >
            {s.viewModules}
          </a>
        </div>

        <div className="pointer-events-none absolute right-[-5%] top-0 h-full w-[65%] md:right-[-8%]">
          <div className="group pointer-events-auto relative h-full w-full overflow-hidden">
            <img
              src={heroImage}
              alt="security infrastructure"
              className="h-full w-full object-cover object-left grayscale transition-all duration-700 ease-out group-hover:scale-105 group-hover:grayscale-0"
            />
            <span
              className="absolute bottom-8 left-4 origin-bottom-left text-[10px] uppercase tracking-[0.3em] text-[#f2f2f2] mix-blend-difference"
              style={{ transform: "rotate(-90deg)" }}
            >
              {s.imageCaption}
            </span>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------- */}
      {/* bande horizontale — modules */}
      {/* ---------------------------------------------------------- */}
      <section id="modules" className="relative px-6 py-24 md:px-10">
        <h2
          className="mb-10 uppercase leading-[0.85] tracking-tighter text-4xl md:text-6xl"
          style={{ fontFamily: "'Anton', sans-serif" }}
        >
          {s.modulesHeading}
        </h2>

        <div className="flex gap-5 overflow-x-auto pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden snap-x snap-mandatory">
          {s.modules.map((mod, i) => (
            <div key={mod.code} className="group w-56 shrink-0 snap-start">
              <div className="relative aspect-[3/4] overflow-hidden bg-[#0a0a0a]">
                <div
                  className="absolute inset-0 flex items-center justify-center text-7xl font-bold text-[#f2f2f2]/10"
                  style={{ fontFamily: "'Anton', sans-serif" }}
                >
                  {String(i + 1).padStart(2, "0")}
                </div>
                <div className="absolute inset-0 bg-[#dc2626] opacity-0 mix-blend-multiply transition-opacity duration-700 group-hover:opacity-30" />
                <span className="absolute right-2 top-2 bg-[#f2f2f2] px-2 py-1 text-[10px] font-bold uppercase text-[#0a0a0a]">
                  {s.active}
                </span>
              </div>
              <div className="mt-3">
                <p className="text-sm font-bold uppercase tracking-wide">{mod.name}</p>
                <p className="text-xs tracking-wide text-[#0a0a0a]/50">{mod.code}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ---------------------------------------------------------- */}
      {/* grille technique */}
      {/* ---------------------------------------------------------- */}
      <section className="relative grid grid-cols-12 gap-6 px-6 py-24 md:px-10">
        <div className="col-span-12 md:sticky md:top-24 md:col-span-4 md:self-start">
          <h2
            className="uppercase leading-[0.85] tracking-tighter text-4xl md:text-6xl"
            style={{ fontFamily: "'Anton', sans-serif" }}
          >
            {s.architectureHeading}
          </h2>
          <div className="mt-8 space-y-6">
            {ARCHITECTURE_SPECS.map((spec) => (
              <p key={spec} className="border-l-2 border-[#0a0a0a] pl-4 text-xs uppercase tracking-widest text-[#0a0a0a]/70">
                {spec}
              </p>
            ))}
          </div>
        </div>

        <div className="col-span-12 grid grid-cols-2 gap-4 md:col-span-8">
          <div className="relative col-span-1 aspect-[4/5] overflow-hidden bg-[#0a0a0a]">
            <span className="absolute left-2 top-2 bg-[#f2f2f2] px-2 py-1 text-[10px] font-bold uppercase text-[#0a0a0a]">
              soc2 type ii
            </span>
          </div>
          <div className="relative col-span-1 aspect-square overflow-hidden bg-[#0a0a0a]/90">
            <span className="absolute bottom-2 right-2 bg-[#f2f2f2] px-2 py-1 text-[10px] font-bold uppercase text-[#0a0a0a]">
              aes-256
            </span>
          </div>
          <div className="relative col-span-2 aspect-[16/7] overflow-hidden bg-[#0a0a0a]/80">
            <span className="absolute left-2 top-2 bg-[#f2f2f2] px-2 py-1 text-[10px] font-bold uppercase text-[#0a0a0a]">
              zero trust
            </span>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------- */}
      {/* grille de déploiement asymétrique */}
      {/* ---------------------------------------------------------- */}
      <section className="relative px-6 py-24 md:px-10">
        <h2
          className="mb-16 uppercase leading-[0.85] tracking-tighter text-4xl md:text-6xl"
          style={{ fontFamily: "'Anton', sans-serif" }}
        >
          {s.deploymentHeading}
        </h2>

        <div className="grid grid-cols-12 gap-4">
          {s.deployments.map((item) => (
            <div key={item.name} className={`${item.span} border border-[#0a0a0a]/10 p-5`}>
              <p className="text-base font-bold uppercase tracking-wide">{item.name}</p>
              <div className="mt-3 flex gap-3 text-xs uppercase tracking-widest">
                {ALL_REGIONS.map((region) => {
                  const available = (item.regions as readonly string[]).includes(region);
                  return (
                    <span key={region} className={available ? "text-[#0a0a0a]" : "text-[#0a0a0a]/40 line-through"} style={{ fontFamily: "'Space Grotesk', monospace" }}>
                      {region}
                    </span>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ---------------------------------------------------------- */}
      {/* preuve sociale en masonry */}
      {/* ---------------------------------------------------------- */}
      <section className="relative px-6 py-24 md:px-10">
        <h2
          className="mb-12 uppercase leading-[0.85] tracking-tighter text-4xl md:text-6xl"
          style={{ fontFamily: "'Anton', sans-serif" }}
        >
          {s.trustedByHeading}
        </h2>

        <div className="columns-1 gap-5 sm:columns-2 md:columns-3">
          {s.testimonials.map((t) => (
            <div
              key={t.handle}
              className={`mb-5 break-inside-avoid border border-[#0a0a0a] p-6 ${t.rotate} bg-[#f2f2f2]`}
            >
              <p className="text-sm leading-relaxed" style={{ fontFamily: "'Space Grotesk', monospace" }}>
                "{t.quote}"
              </p>
              <div className="mt-4 flex items-center gap-2 text-xs uppercase tracking-widest text-[#0a0a0a]/60">
                <span className="h-1.5 w-1.5 rounded-full bg-[#0a0a0a]" />
                {t.handle}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ---------------------------------------------------------- */}
      {/* footer utilitaire */}
      {/* ---------------------------------------------------------- */}
      <footer className="relative overflow-hidden bg-[#0a0a0a] px-6 pt-20 text-[#f2f2f2] md:px-10">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-6">
          {s.footerColumns.map((col) => (
            <div key={col.title}>
              <p className="text-xs uppercase tracking-widest text-[#f2f2f2]/50">{col.title}</p>
              <ul className="mt-4 space-y-2">
                {col.links.map((link) => (
                  <li key={link}>
                    <a href="#" className="text-sm uppercase tracking-wide hover:line-through">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <p
          className="mt-24 select-none whitespace-nowrap text-[#f2f2f2]/10"
          style={{ fontFamily: "'Anton', sans-serif", fontSize: "10vw", lineHeight: 0.85 }}
        >
          securify
        </p>
      </footer>
    </div>
  );
};

export default Solutions;
