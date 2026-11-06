import { useState } from "react";
import { useLanguage } from "../i18n/LanguageContext";

/* bouton « Partager » : ouvre le menu de partage du téléphone (Messages, WhatsApp,
   Instagram…) avec le lien de la page ; sur un navigateur qui ne le permet pas
   (la plupart des ordinateurs), copie le lien et affiche « lien copié ». */

const STRINGS = {
  fr: { share: "partager", copied: "lien copié" },
  en: { share: "share", copied: "link copied" },
} as const;

export default function ShareButton({ title, className = "" }: { title: string; className?: string }) {
  const { lang } = useLanguage();
  const s = STRINGS[lang];
  const [copied, setCopied] = useState(false);

  const share = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title, url });
      } catch {
        /* partage annulé par le visiteur */
      }
      return;
    }
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      /* presse-papiers indisponible */
    }
  };

  return (
    <button onClick={share} className={`inline-flex items-center gap-2 ${className}`}>
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M12 3v12M7 8l5-5 5 5" />
        <path d="M5 13v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6" />
      </svg>
      {copied ? s.copied : s.share}
    </button>
  );
}
