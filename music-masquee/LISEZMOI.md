# Musiques de l'onglet « playlist » (masqué)

Ces 11 MP3 sont ceux de la playlist principale (`TRACKS` dans `src/tracks.ts`),
dont l'onglet est masqué (`hidden: true`). Ils sont rangés ici, hors de `public/`,
pour ne pas alourdir le site publié (~88 Mo) tant que l'onglet est masqué.

Pour remettre la playlist : déplacer ces fichiers dans `public/music/`
et retirer `hidden: true` dans `src/tracks.ts`.
