export type Track = { title: string; artist: string; src: string };

/* piste d'ambiance jouée sur la page d'accueil — hors playlist */
export const HOME_TRACK = "/music.flac";

/* playlist affichée sur la page "musique" */
export const TRACKS: Track[] = [
  { title: "gimme! gimme! gimme! (a man after midnight)", artist: "abba", src: "/music/abba-gimme-gimme-gimme.flac" },
  { title: "lay all your love on me", artist: "abba", src: "/music/abba-lay-all-your-love-on-me.flac" },
  { title: "mamma mia", artist: "abba", src: "/music/abba-mamma-mia.flac" },
  { title: "super trouper", artist: "abba", src: "/music/abba-super-trouper.flac" },
  { title: "the winner takes it all", artist: "abba", src: "/music/abba-the-winner-takes-it-all.flac" },
  { title: "piano man", artist: "billy joel", src: "/music/billy-joel-piano-man.flac" },
  { title: "vienna", artist: "billy joel", src: "/music/billy-joel-vienna.flac" },
  { title: "knockin' on heaven's door", artist: "bob dylan", src: "/music/bob-dylan-knockin-on-heavens-door.flac" },
  { title: "streets of philadelphia", artist: "bruce springsteen", src: "/music/bruce-springsteen-streets-of-philadelphia.flac" },
  { title: "feel good inc.", artist: "gorillaz", src: "/music/gorillaz-feel-good-inc.flac" },
  { title: "the blonde", artist: "tv girl", src: "/music/tv-girl-the-blonde.flac" },
];
