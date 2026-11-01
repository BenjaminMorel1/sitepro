export type Track = { title: string; artist: string; src: string };

/* chemins relatifs au dossier public, préfixés par la base du site (/site/ en ligne) */
const asset = (path: string) => `${import.meta.env.BASE_URL}${path}`;

/* piste d'ambiance jouée sur la page d'accueil — hors playlist */
export const HOME_TRACK = asset("music.mp3");

/* playlist affichée sur la page "musique" */
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
