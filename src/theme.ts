import { useSyncExternalStore } from "react";

/* thème du site : "light" (blanc, par défaut) ou "dark" (noir, anciennes couleurs).
   Le noir pose la classe "dark" sur <html> : les pages ont des variantes dark: avec
   leurs couleurs d'origine. La page d'accueil et le menu ne changent pas.
   index.html pose la classe avant le premier rendu pour éviter un flash. */
export type Theme = "dark" | "light";

const STORAGE_KEY = "sitepro-theme";

const readTheme = (): Theme => {
  try {
    return localStorage.getItem(STORAGE_KEY) === "dark" ? "dark" : "light";
  } catch {
    return "light";
  }
};

let theme: Theme = readTheme();
const listeners = new Set<() => void>();

const apply = () => document.documentElement.classList.toggle("dark", theme === "dark");
apply();

export const setTheme = (next: Theme) => {
  theme = next;
  apply();
  try {
    localStorage.setItem(STORAGE_KEY, next);
  } catch {
    /* stockage indisponible : le choix ne sera juste pas retenu */
  }
  listeners.forEach((l) => l());
};

export const toggleTheme = () => setTheme(theme === "dark" ? "light" : "dark");

const subscribe = (l: () => void) => {
  listeners.add(l);
  return () => listeners.delete(l);
};

export const useTheme = () => useSyncExternalStore(subscribe, () => theme);
