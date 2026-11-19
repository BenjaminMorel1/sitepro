// Après `vite build` : une vraie page HTML par adresse du site, pour que GitHub Pages réponde
// …/sitepro/contact (code 200, bien référencé par Google) au lieu d'une erreur 404.
// Chaque page est une copie de dist/index.html avec son titre, son adresse canonique et sa description.
// GitHub Pages sert dist/contact.html à l'adresse …/contact directement (sans redirection) ; seule « music »,
// dont le dossier existe déjà (les MP3), passe par music/index.html, servie à l'adresse …/music/.
// dist/404.html sert de secours pour toute autre adresse (l'appli React affiche alors la bonne page).
//   node scripts/pages.mjs   (lancé automatiquement par `npm run build`)
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const racine = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const dist = path.join(racine, 'dist');
const SITE = 'https://benjaminmorel1.github.io/sitepro/';

// adresse → titre et description (en français, la langue par défaut du site)
const PAGES = {
  platform: {
    title: 'Projets | Benjamin Morel',
    description: "Mala, l'appli pour réviser ensemble, et trois jeux jouables dans le navigateur.",
  },
  'animation-2-1': {
    title: 'Animation 2.1 | Benjamin Morel',
    description: "Biographie animée en 3D, entièrement générée par IA : « Paris, le soir ».",
  },
  music: { title: 'Playlist | Benjamin Morel', description: 'La playlist de Benjamin Morel, avec paroles synchronisées.', dossier: true },
  contact: {
    title: 'À propos | Benjamin Morel',
    description: "Benjamin Morel, étudiant en licence de mathématiques à l'Université Paris Cité : formation, compétences, projets et contact.",
  },
  resume: { title: 'À propos | Benjamin Morel', description: '', canonical: 'contact' },
  intro: {
    title: 'Projets | Benjamin Morel',
    description: "Mon parcours en une phrase, trois jeux jouables dans le navigateur et Mala, l'appli pour réviser ensemble.",
  },
  bientot: { title: 'Bientôt | Benjamin Morel', description: '' },
};

const echapper = (t) => t.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
const modele = fs.readFileSync(path.join(dist, 'index.html'), 'utf8');

const remplacer = (html, motif, valeur) => {
  if (!motif.test(html)) throw new Error(`motif introuvable dans index.html : ${motif}`);
  return html.replace(motif, valeur);
};

for (const [adresse, page] of Object.entries(PAGES)) {
  const url = `${SITE}${page.canonical ?? adresse}${page.dossier ? '/' : ''}`;
  let html = modele;
  html = remplacer(html, /<title>[^<]*<\/title>/, `<title>${echapper(page.title)}</title>`);
  html = remplacer(html, /<link rel="canonical" href="[^"]*"/, `<link rel="canonical" href="${url}"`);
  html = remplacer(html, /<meta property="og:url" content="[^"]*"/, `<meta property="og:url" content="${url}"`);
  html = remplacer(html, /<meta property="og:title" content="[^"]*"/, `<meta property="og:title" content="${echapper(page.title)}"`);
  if (page.description) {
    html = remplacer(html, /(<meta\s+name="description"\s+content=")[^"]*"/, `$1${echapper(page.description)}"`);
    html = remplacer(html, /(<meta\s+property="og:description"\s+content=")[^"]*"/, `$1${echapper(page.description)}"`);
  }
  if (page.dossier) {
    fs.mkdirSync(path.join(dist, adresse), { recursive: true });
    fs.writeFileSync(path.join(dist, adresse, 'index.html'), html);
  } else {
    fs.writeFileSync(path.join(dist, `${adresse}.html`), html);
  }
}
fs.writeFileSync(path.join(dist, '404.html'), modele);
console.log(`pages : ${Object.keys(PAGES).length} adresses + 404.html`);
