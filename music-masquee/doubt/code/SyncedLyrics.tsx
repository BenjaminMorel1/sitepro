import { useEffect, useMemo, useState } from "react";
import { musicPlayer } from "../../musicPlayer";

/* ------------------------------------------------------------------ */
/* paroles synchronisées, en grand :                                   */
/*  - une seule typo classique (Playfair Display, classes .lyric-* de  */
/*    index.css) ; chaque mot sort du flou, le mot en cours brille,    */
/*    les mots déjà chantés s'atténuent ;                              */
/*  - chaque phrase a sa propre place à l'écran.                       */
/* Lu dans un fichier .lrc (format standard : une phrase par ligne,    */
/* précédée de son temps [mm:ss.xx]). Sans fichier, rien ne s'affiche. */
/* Les mots d'une phrase sont répartis sur 85 % du temps qui la        */
/* sépare de la suivante (le .lrc ne donne que le début de la phrase). */
/* ------------------------------------------------------------------ */

type Line = { time: number; text: string };

/* décalage des paroles (secondes) : positif = affichées plus tôt, négatif = plus tard */
const LYRICS_OFFSET = 0.5;

/* pseudo-hasard déterministe (0 → 1) : une phrase garde sa place tant qu'elle est affichée */
const seeded = (n: number) => {
  const x = Math.sin(n * 12.9898 + 78.233) * 43758.5453;
  return x - Math.floor(x);
};

const parseLrc = (raw: string): Line[] => {
  const lines: Line[] = [];
  for (const row of raw.split(/\r?\n/)) {
    const stamps = [...row.matchAll(/\[(\d{1,2}):(\d{2}(?:\.\d{1,3})?)\]/g)];
    if (!stamps.length) continue;
    const text = row.replace(/\[[^\]]*\]/g, "").trim();
    for (const m of stamps) lines.push({ time: Number(m[1]) * 60 + Number(m[2]), text });
  }
  return lines.sort((a, b) => a.time - b.time);
};

export default function SyncedLyrics({ url, active }: { url: string; active: boolean }) {
  const [lines, setLines] = useState<Line[] | null>(null);
  // position lue à chaque image (60 fois/s) pour une synchro précise, + décalage
  const [current, setCurrent] = useState(0);
  useEffect(() => {
    if (!active) return;
    let raf = 0;
    const tick = () => {
      setCurrent(musicPlayer.getTime() + LYRICS_OFFSET);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [active]);

  // chargé une seule fois, au premier lancement du morceau
  useEffect(() => {
    if (!active || lines !== null) return;
    fetch(url)
      .then((r) => (r.ok ? r.text() : ""))
      .then((raw) => setLines(raw.trim().startsWith("<") ? [] : parseLrc(raw)))
      .catch(() => setLines([]));
  }, [active, url, lines]);

  const index = useMemo(() => {
    if (!lines?.length) return -1;
    let i = -1;
    for (let k = 0; k < lines.length && lines[k].time <= current + 0.05; k++) i = k;
    return i;
  }, [lines, current]);

  const line = active && index >= 0 && lines?.[index]?.text ? lines[index] : null;

  // mots déjà « chantés » dans la phrase
  let words: string[] = [];
  let shown = 0;
  if (line && lines) {
    const next = lines[index + 1]?.time ?? line.time + 4;
    const span = Math.max(0.4, (next - line.time) * 0.85);
    words = line.text.split(/\s+/);
    shown = Math.min(words.length, Math.floor(((current - line.time) / span) * words.length) + 1);
  }

  if (!line) return null;

  // place propre à chaque phrase
  const r = (k: number) => seeded(index * 7 + k);
  const top = 16 + r(1) * 52; // % de la hauteur
  const align = (["start", "center", "end"] as const)[Math.floor(r(2) * 3)];
  const tilt = (r(3) - 0.5) * 5; // degrés
  const size = 0.9 + r(4) * 0.3;

  return (
    <div
      className="pointer-events-none fixed inset-x-0 z-[36] flex px-[7vw]"
      style={{ top: `${top}%`, justifyContent: align }}
      aria-live="polite"
    >
      <p
        key={`${index}-${line.time}`}
        className="lyric-caption max-w-[min(56rem,86vw)] leading-[1.08]"
        style={{
          transform: `rotate(${tilt}deg)`,
          textAlign: align === "start" ? "left" : align === "end" ? "right" : "center",
          fontSize: `calc(clamp(2.25rem, 6.5vw, 5.5rem) * ${size})`,
        }}
      >
        {words.map((word, i) =>
          i < shown ? (
            <span key={i} className={`lyric-word ${i === shown - 1 ? "lyric-word--now" : "lyric-word--past"}`}>
              {word}
              {i < words.length - 1 ? " " : ""}
            </span>
          ) : null
        )}
      </p>
    </div>
  );
}
