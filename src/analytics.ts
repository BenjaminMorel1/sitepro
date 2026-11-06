// Statistiques de visite :
//  - GoatCounter (script chargé dans index.html), sans cookies ;
//  - Google Analytics 4, chargé ici si GA_MEASUREMENT_ID est rempli.
// Le site utilise HashRouter : on envoie nous-mêmes le chemin de chaque page.

/* identifiant GA4 (Admin > Flux de données > Web), ex. "G-ABC123XYZ9" ; vide = GA4 désactivé */
const GA_MEASUREMENT_ID = "G-B61J1J0RHB";

/* Pas de bandeau cookies (site entre amis, choix du propriétaire) : la mesure est active pour
   tous les visiteurs, partout. Publicité et signaux Google restent désactivés.
   Pour exiger un consentement dans certains pays (ex. UE), ajouter un second
   gtag("consent", "default", { ...consent, analytics_storage: "denied", region: ["FR", ...] }). */

type GoatCounter = { count: (vars: { path: string }) => void };

declare global {
  interface Window {
    goatcounter?: GoatCounter;
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

/* ---------- Google Analytics 4 ---------- */

const initGA = () => {
  if (!GA_MEASUREMENT_ID || window.gtag) return;
  window.dataLayer = window.dataLayer || [];
  // gtag doit pousser l'objet `arguments` (et non un tableau) pour que GA le reconnaisse
  window.gtag = function gtag() {
    // eslint-disable-next-line prefer-rest-params
    window.dataLayer!.push(arguments);
  };
  const consent = { analytics_storage: "granted", ad_storage: "denied", ad_user_data: "denied", ad_personalization: "denied" };
  window.gtag("consent", "default", consent);
  window.gtag("js", new Date());
  // pages vues envoyées à la main (HashRouter), pas de pub ni de signaux Google
  window.gtag("config", GA_MEASUREMENT_ID, { send_page_view: false, allow_google_signals: false });

  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  document.head.appendChild(script);
};

initGA();

const trackGA = (path: string) => {
  if (!window.gtag) return;
  // attend la mise à jour du titre par la page (useDocumentTitle) ; URL sans « # »
  // pour que GA4 distingue les pages (ex. https://…/sitepro/resume)
  setTimeout(() => {
    const base = `${window.location.origin}${import.meta.env.BASE_URL}`.replace(/\/$/, "");
    window.gtag?.("event", "page_view", {
      page_location: `${base}${path}`,
      page_title: document.title,
    });
  }, 0);
};

/* ---------- GoatCounter ---------- */

const trackGoatCounter = (path: string) => {
  if (window.goatcounter?.count) {
    window.goatcounter.count({ path });
    return;
  }
  // script pas encore chargé : on compte dès qu'il l'est
  document
    .querySelector("script[data-goatcounter]")
    ?.addEventListener("load", () => window.goatcounter?.count({ path }), { once: true });
};

export const trackPageView = (path: string) => {
  trackGoatCounter(path);
  trackGA(path);
};
