/* thème du site : suit automatiquement le mode sombre / clair de l'appareil
   (téléphone ou ordinateur), y compris quand il change pendant la visite.
   Sombre : classe "dark" sur <html> (les pages ont des variantes dark:).
   index.html pose la classe avant le premier rendu pour éviter un flash. */

const query = window.matchMedia("(prefers-color-scheme: dark)");

const apply = () => document.documentElement.classList.toggle("dark", query.matches);

apply();
query.addEventListener("change", apply);
