import { useSyncExternalStore } from "react";

/* thème du site : par défaut il suit le mode sombre / clair de l'appareil (et ses
   changements) ; si le visiteur choisit « noir » ou « blanc » avec le bouton du menu,
   son choix l'emporte et est retenu. Sombre : classe "dark" sur <html>.
   index.html pose la classe avant le premier rendu pour éviter un flash. */
export type Theme = "dark" | "light";

const STORAGE_KEY = "sitepro-theme";
const query = window.matchMedia("(prefers-color-scheme: dark)");

const readChoice = (): Theme | null => {
  try {
    const v = localStorage.getItem(STORAGE_KEY);
    return v === "dark" || v === "light" ? v : null;
  } catch {
    return null;
  }
};

let choice = readChoice();
const current = (): Theme => choice ?? (query.matches ? "dark" : "light");
const listeners = new Set<() => void>();

const apply = () => {
  document.documentElement.classList.toggle("dark", current() === "dark");
  listeners.forEach((l) => l());
};
apply();
query.addEventListener("change", apply);

export const setTheme = (next: Theme) => {
  choice = next;
  try {
    localStorage.setItem(STORAGE_KEY, next);
  } catch {
    /* stockage indisponible : le choix ne sera juste pas retenu */
  }
  apply();
};

export const toggleTheme = () => setTheme(current() === "dark" ? "light" : "dark");

const subscribe = (l: () => void) => {
  listeners.add(l);
  return () => listeners.delete(l);
};

export const useTheme = () => useSyncExternalStore(subscribe, current);
