# Musiques de l'onglet « playlist » (masqué)

Ces 11 MP3 sont ceux de la playlist principale (`TRACKS` dans `src/tracks.ts`),
dont l'onglet est masqué (`hidden: true`). Ils sont rangés ici, hors de `public/`,
pour ne pas alourdir le site publié (~88 Mo) tant que l'onglet est masqué.

Pour remettre la playlist : déplacer ces fichiers dans `public/music/`
et retirer `hidden: true` dans `src/tracks.ts`.

## x-cool/

`tienanh109-x-cool.mp3` : retiré de la playlist « ? ». Pour le remettre : le replacer dans
`public/music/` et rajouter sa ligne dans `TRACKS_2` (src/tracks.ts).

## doubt/

`twenty-one-pilots-doubt-demo.mp3` + `doubt.lrc` (paroles synchronisées) + `code/` (easter egg :
site en noir et blanc + paroles). Pour tout remettre :
- MP3 → `public/music/`, `doubt.lrc` → `public/lyrics/`
- `code/DoubtEasterEgg.tsx` → `src/components/`, `code/SyncedLyrics.tsx` → `src/components/doubt/`
- recoller `code/styles-paroles.css` à la fin de `src/index.css` (+ l'import Playfair Display)
- `src/tracks.ts` : `export const DOUBT_SRC = asset("music/twenty-one-pilots-doubt-demo.mp3");`
  et la ligne `{ title: "doubt (demo)", artist: "twenty one pilots", src: DOUBT_SRC }` dans TRACKS_2
- `src/App.tsx` : importer `DoubtEasterEgg` et ajouter `<DoubtEasterEgg />` après `<MusicWidget />`
