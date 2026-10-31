// Statistiques de visite via GoatCounter (script chargé dans index.html).
// Le site utilise HashRouter : on envoie nous-mêmes le chemin de chaque page.

type GoatCounter = { count: (vars: { path: string }) => void };

declare global {
  interface Window {
    goatcounter?: GoatCounter;
  }
}

export const trackPageView = (path: string) => {
  if (window.goatcounter?.count) {
    window.goatcounter.count({ path });
    return;
  }
  // script pas encore chargé : on compte dès qu'il l'est
  document
    .querySelector("script[data-goatcounter]")
    ?.addEventListener("load", () => window.goatcounter?.count({ path }), { once: true });
};
