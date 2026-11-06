import { useEffect } from "react";
import { useMusicPlayer } from "../musicPlayer";
import { DOUBT_SRC } from "../tracks";
import SyncedLyrics from "./doubt/SyncedLyrics";

/* ------------------------------------------------------------------ */
/* easter egg « doubt » : quand doubt (demo) joue (playlist « ? »),    */
/* tout le site passe en noir et blanc, et les paroles s'affichent     */
/* sur la page où l'on se trouve, synchronisées (SyncedLyrics).        */
/* Paroles : fichier public/lyrics/doubt.lrc (ajouté par le            */
/* propriétaire du site).                                              */
/* ------------------------------------------------------------------ */

const LYRICS_URL = `${import.meta.env.BASE_URL}lyrics/doubt.lrc`;

const DoubtEasterEgg = () => {
  const { src, playing } = useMusicPlayer();
  const active = src === DOUBT_SRC && playing;

  // tout le site passe en noir et blanc pendant le morceau (fondu)
  useEffect(() => {
    const root = document.documentElement;
    root.style.transition = "filter 1s ease";
    root.style.filter = active ? "grayscale(1)" : "";
  }, [active]);

  return <SyncedLyrics url={LYRICS_URL} active={active} />;
};

export default DoubtEasterEgg;
