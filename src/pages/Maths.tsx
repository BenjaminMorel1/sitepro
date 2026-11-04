import SubPage from "./SubPage";
import { useLanguage } from "../i18n/LanguageContext";

const STRINGS = {
  fr: {
    pageTitle: "Maths | Benjamin Morel",
    title: "Maths",
    description:
      "Securify a été conçu pour offrir aux startups une protection des données de niveau entreprise, sans la complexité qui va avec.",
  },
  en: {
    pageTitle: "Maths | Benjamin Morel",
    title: "Maths",
    description:
      "Securify was built to give startups enterprise-grade data protection without the enterprise complexity.",
  },
} as const;

const Maths = () => {
  const { lang } = useLanguage();
  const s = STRINGS[lang];

  return <SubPage pageTitle={s.pageTitle} title={s.title} description={s.description} />;
};

export default Maths;
