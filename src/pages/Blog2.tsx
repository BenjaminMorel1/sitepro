import SubPage from "./SubPage";
import { useLanguage } from "../i18n/LanguageContext";

const STRINGS = {
  fr: {
    pageTitle: "Blog 2 | Benjamin Morel",
    title: "Blog",
    description:
      "De courts billets sur ce que je code et ce que j'apprends : les coulisses de mes projets, des idées en vrac et ce qui m'a marqué récemment. Premiers articles bientôt.",
  },
  en: {
    pageTitle: "Blog 2 | Benjamin Morel",
    title: "Blog",
    description:
      "Short posts about what I build and what I learn: behind the scenes of my projects, loose ideas and whatever caught my attention lately. First posts coming soon.",
  },
} as const;

const Blog2 = () => {
  const { lang } = useLanguage();
  const s = STRINGS[lang];

  return <SubPage pageTitle={s.pageTitle} title={s.title} description={s.description} />;
};

export default Blog2;
