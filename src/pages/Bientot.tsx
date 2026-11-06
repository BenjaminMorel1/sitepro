import SubPage from "./SubPage";
import { useLanguage } from "../i18n/LanguageContext";

// page ouverte par le bouton « Commencer » du menu, en attendant la vraie page
const STRINGS = {
  fr: {
    pageTitle: "En développement | Benjamin Morel",
    title: "En développement",
    description: "Cette page est en cours de construction. Reviens bientôt !",
  },
  en: {
    pageTitle: "In development | Benjamin Morel",
    title: "In development",
    description: "This page is under construction. Check back soon!",
  },
} as const;

const Bientot = () => {
  const { lang } = useLanguage();
  const s = STRINGS[lang];
  return <SubPage pageTitle={s.pageTitle} title={s.title} description={s.description} />;
};

export default Bientot;
