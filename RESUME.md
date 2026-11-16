# sitepro : récapitulatif

*Mis à jour le 13/11/2026*

## But du projet

**sitepro** est le site personnel de Benjamin Morel, étudiant de 20 ans à l'université Paris Cité. Il présente son parcours (Reims, Lille, Paris), ses projets et ses goûts : l'appli de révision **RayOnn 2 / Mala**, des jeux dans le navigateur, un film d'animation généré par IA et une playlist musicale.

- En ligne : https://benjaminmorel1.github.io/sitepro/
- Code : https://github.com/BenjaminMorel1/sitepro

### Fonctionnalités prévues
- Une vitrine personnelle bilingue (français / anglais) avec thème clair et thème sombre.
- Des pages projets : l'appli RayOnn 2 / Mala, les jeux, l'animation.
- Un CV (« résumé ») et une page contact.
- Un lecteur de musique qui reste actif d'une page à l'autre.
- Plus tard : remettre en ligne le blog, le blog 2 et la page Lectures, aujourd'hui masqués.

## Ce qui est codé et fonctionne

| Page | Route | Contenu |
|---|---|---|
| Accueil | `/` | Vidéo de fond, titre animé « Explorer, créer, partager », phrase de présentation, statistiques |
| Projets | `/platform` | Cartes RayOnn 2 et jeux (dont Balls Crush, jouable dans la page) |
| RayOnn 2 | `/platform` → carte | Carrousel de 12 captures dans un cadre iPhone (`AppShowcase.tsx`), bouton « Ouvrir l'appli ↗ » vers https://rayonn-541fe.web.app/ |
| Musique | `/music` | Playlist, pochettes, paroles synchronisées |
| Animation | `/animation-2-1` | Film d'animation (version « paris-full ») |
| Résumé | `/resume` | CV : formations, outils, lien GitHub |
| Contact | `/contact` | Coordonnées et mention des statistiques |
| Intro | `/intro` | Page d'essai des effets : phrase animée, bandeau, curseur personnalisé |
| Bientôt | `/bientot` | Page « en développement » |

Fonctions communes :
- Bascule français / anglais (`src/i18n/LanguageContext.tsx`). Chaque page garde ses textes dans un objet `STRINGS = { fr, en }`.
- Thème clair / sombre (`src/theme.ts`).
- Défilement fluide avec Lenis, et retour en haut à chaque changement de page.
- Lecteur de musique persistant (`MusicWidget`). Sur téléphone, il s'affiche en barre et fonctionne aussi écran verrouillé.
- Menu mobile, site adapté au téléphone, appli installable (PWA : `public/manifest.webmanifest`, icônes).
- Statistiques de visite : GoatCounter, sans cookies, et Google Analytics 4 (`G-B61J1J0RHB`), dans `src/analytics.ts`.
- SEO : `sitemap.xml`, `robots.txt`, image `og-image.jpg`, vérification Google Search Console.
- Déploiement automatique sur GitHub Pages à chaque push sur `main`.

### Changements récents (novembre 2026)
- Nouvelle phrase d'accueil, en français et en anglais : « Étudiant de 20 ans à l'université Paris Cité, je développe des applications et des projets créatifs… ». **En ligne.**
- Bouton « Ouvrir l'appli ↗ » vers RayOnn 2. **En ligne.**
- 12 nouvelles captures de RayOnn 2 (version 2.4.1, thème clair « Mala »). **Seulement en local, pas encore publiées.** Les anciennes captures sont sauvegardées dans `Desktop\site-backups\rayonn-v2-captures-2026-11-06\`.

## En cours ou cassé

- **Captures RayOnn 2 non publiées** : elles sont modifiées dans `src/assets/rayonn-phone-*.webp` mais pas encore commitées.
- **Capture de la carte** (écran 4) : les points des bibliothèques sont visibles mais le fond de carte Mapbox est vide, parce que la capture est faite par un Chrome sans affichage. Il faudra la remplacer par une vraie capture faite sur téléphone.
- **Nom de l'appli** : l'appli s'appelle maintenant « Mala », mais le site dit encore « RayOnn 2 ». Le changement de nom reste à décider.
- **Pages masquées** : Blog, Blog 2 et Lectures sont commentées dans `App.tsx`. La page VFX est retirée du site mais son fichier est gardé.
- **`public/lyrics/doubt.lrc`** n'est pas suivi par git. Ce sont des paroles protégées, à garder en local et à ne pas publier.
- **`README.md`** contient encore le texte du modèle Vite et ne décrit pas le projet.
- **Build** : avertissement Vite « chunk > 500 kB ». Ce n'est pas bloquant, on pourra découper le code plus tard.
- Branche git locale `maj-lectures-contact` : elle est au même niveau que `origin/main`. La branche locale `main` est en retard et n'est pas utilisée.

## Choix techniques et pourquoi

| Choix | Raison |
|---|---|
| **React 19 + TypeScript** | Interface en composants réutilisables. Le typage évite les erreurs dans les textes FR/EN et les props. |
| **Vite 8** | Serveur de développement instantané et build rapide. Le site part de ce modèle. |
| **Tailwind CSS 3** | Styles écrits directement dans le JSX, ce qui permet d'itérer vite sur le design, y compris le mode sombre (`dark:`). |
| **motion** (Framer Motion) | Animations d'apparition au défilement, respectueuses de `prefers-reduced-motion`. |
| **Lenis** | Défilement fluide, « premium ». |
| **Flickity** | Carrousel des téléphones RayOnn, réglé pour reproduire un carrousel de référence. |
| **react-router-dom en `HashRouter`** | GitHub Pages ne sait pas rediriger les routes : les URL en `#/page` marchent sans configuration serveur. Les pages vues sont envoyées à la main aux outils de statistiques. |
| **GitHub Pages + GitHub Actions** | Hébergement gratuit, mise en ligne automatique au push sur `main`. `base: '/sitepro/'` en build. |
| **Musiques en MP3, médias allégés** | Respecter la limite de 100 Mo par fichier de GitHub et alléger le site publié (passé de 118 à 31 Mo). |
| **GoatCounter + GA4** | GoatCounter : comptage simple sans cookies. GA4 : statistiques détaillées. Pas de bandeau cookies (choix du propriétaire). |

Architecture :
```
src/
  main.tsx, App.tsx          point d'entrée, routes, lecteur de musique global
  pages/                     une page par route
  components/                Navbar, AppShowcase (RayOnn), MusicWidget, PlatformGame, …
  i18n/LanguageContext.tsx   langue FR/EN
  analytics.ts, theme.ts, smoothScroll.ts, musicPlayer.ts, tracks.ts
  assets/                    images (dont rayonn-phone-01…12.webp)
public/                      musique, pochettes, jeux, icônes, manifest, SEO
music-masquee/               musiques retirées du site, gardées en local
.github/workflows/deploy.yml déploiement GitHub Pages
```

## Prochaines étapes

1. Publier les nouvelles captures RayOnn 2 (commit + push sur `main`).
2. Remplacer la capture de la carte par une vraie capture faite sur téléphone.
3. Décider s'il faut renommer « RayOnn 2 » en « Mala » sur le site (titres, textes FR/EN).
4. Remettre en ligne Blog, Blog 2 et Lectures quand ils seront prêts.
5. Réécrire `README.md` pour décrire le projet.
6. Optionnel : découper le bundle (imports dynamiques par page) pour supprimer l'avertissement de taille.
