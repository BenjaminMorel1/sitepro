import Lenis from "lenis";
import "lenis/dist/lenis.css";

// Défilement fluide (Lenis) sur tout le site, désactivé si le visiteur a demandé
// à réduire les animations : on garde alors le défilement natif du navigateur.

let lenis: Lenis | null = null;

export const startSmoothScroll = () => {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return () => {};
  lenis = new Lenis({ autoRaf: true });
  return () => {
    lenis?.destroy();
    lenis = null;
  };
};

export const scrollToTop = () => {
  if (lenis) lenis.scrollTo(0, { immediate: true });
  else window.scrollTo(0, 0);
};

export const scrollToElement = (el: HTMLElement) => {
  if (lenis) lenis.scrollTo(el, { duration: 1.4 });
  else el.scrollIntoView({ behavior: "smooth" });
};
