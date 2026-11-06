export type Track = { title: string; artist: string; src: string };

/* chemins relatifs au dossier public, préfixés par la base du site (/site/ en ligne) */
const asset = (path: string) => `${import.meta.env.BASE_URL}${path}`;

/* piste d'ambiance jouée sur la page d'accueil — hors playlist */
export const HOME_TRACK = asset("music.mp3");

/* playlist principale affichée sur la page "musique"
   (onglet masqué : ses fichiers sont rangés dans music-masquee/ à la racine, voir LISEZMOI.md) */
export const TRACKS: Track[] = [
  { title: "gimme! gimme! gimme! (a man after midnight)", artist: "abba", src: asset("music/abba-gimme-gimme-gimme.mp3") },
  { title: "lay all your love on me", artist: "abba", src: asset("music/abba-lay-all-your-love-on-me.mp3") },
  { title: "mamma mia", artist: "abba", src: asset("music/abba-mamma-mia.mp3") },
  { title: "super trouper", artist: "abba", src: asset("music/abba-super-trouper.mp3") },
  { title: "the winner takes it all", artist: "abba", src: asset("music/abba-the-winner-takes-it-all.mp3") },
  { title: "piano man", artist: "billy joel", src: asset("music/billy-joel-piano-man.mp3") },
  { title: "vienna", artist: "billy joel", src: asset("music/billy-joel-vienna.mp3") },
  { title: "knockin' on heaven's door", artist: "bob dylan", src: asset("music/bob-dylan-knockin-on-heavens-door.mp3") },
  { title: "streets of philadelphia", artist: "bruce springsteen", src: asset("music/bruce-springsteen-streets-of-philadelphia.mp3") },
  { title: "feel good inc.", artist: "gorillaz", src: asset("music/gorillaz-feel-good-inc.mp3") },
  { title: "the blonde", artist: "tv girl", src: asset("music/tv-girl-the-blonde.mp3") },
];

/* deuxième playlist "?" — ajoute des morceaux ici (fichiers dans public/music/) */
export const TRACKS_2: Track[] = [
  { title: "downtown train", artist: "yowshi", src: asset("music/yowshi-downtown-train.mp3") },
  { title: "love me not", artist: "ravyn lenae", src: asset("music/ravyn-lenae-love-me-not.mp3") },
];

/* hidden : onglet masqué sur la page (à remettre plus tard en retirant hidden) */
export type Playlist = { key: string; name: string; tracks: Track[]; hidden?: boolean };

/* les playlists de la page "musique", dans l'ordre des onglets */
export const PLAYLISTS: Playlist[] = [
  { key: "mystery", name: "?", tracks: TRACKS_2 },
  { key: "main", name: "playlist", tracks: TRACKS, hidden: true },
];
