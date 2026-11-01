import SubPage from "./SubPage";
import { useLanguage } from "../i18n/LanguageContext";

const STRINGS = {
  fr: {
    pageTitle: "Entreprise | Benjamin Morel",
    title: "Entreprise",
    description:
      "Securify a été conçu pour offrir aux startups une protection des données de niveau entreprise, sans la complexité qui va avec.",
  },
  en: {
    pageTitle: "Company | Benjamin Morel",
    title: "Company",
    description:
      "Securify was built to give startups enterprise-grade data protection without the enterprise complexity.",
  },
} as const;

const Company = () => {
  const { lang } = useLanguage();
  const s = STRINGS[lang];

  return <SubPage pageTitle={s.pageTitle} title={s.title} description={s.description} />;
};

export default Company;
