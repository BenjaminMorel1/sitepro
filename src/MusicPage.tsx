import type { ChangeEvent } from "react";
import { useCallback } from "react";
import Navbar from "./components/Navbar";
import useDocumentTitle from "./hooks/useDocumentTitle";
import { musicPlayer, useMusicPlayer } from "./musicPlayer";
import { TRACKS } from "./tracks";
import { useLanguage } from "./i18n/LanguageContext";

const STRINGS = {
  fr: {
    pageTitle: "Musique | Securify",
    heading: "musique",
    paragraph:
      "une petite playlist, chargée un morceau à la fois — rien ne se télécharge avant que tu cliques sur play, et la musique continue pendant que tu navigues sur le site.",
    pause: (title: string) => `mettre en pause ${title}`,
    play: (title: string) => `lire ${title}`,
    seek: (title: string) => `avancer dans ${title}`,
  },
  en: {
    pageTitle: "Music | Securify",
    heading: "music",
    paragraph:
      "a small playlist, loaded one track at a time — nothing downloads until you hit play, and the music keeps playing while you browse the site.",
    pause: (title: string) => `pause ${title}`,
    play: (title: string) => `play ${title}`,
    seek: (title: string) => `seek in ${title}`,
  },
} as const;

/* ------------------------------------------------------------------ */
/* securify — page "music" : playlist branchée sur le lecteur audio    */
/* global. Une piste à la fois, rien ne se télécharge avant un clic    */
/* (preload="none", fichiers ~40-100 Mo chacun), et la lecture         */
/* continue quand on quitte la page.                                   */
/* ------------------------------------------------------------------ */

function formatTime(s: number): string {
  if (!isFinite(s)) return "0:00";
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, "0")}`;
}

const MusicPage = () => {
  const { lang } = useLanguage();
  const s = STRINGS[lang];
  useDocumentTitle(s.pageTitle);

  const { src, playing, loading, current, duration } = useMusicPlayer();

  const handleTrackClick = useCallback((index: number) => {
    musicPlayer.toggle(TRACKS[index].src, { volume: 0.6 });
  }, []);

  const seek = (e: ChangeEvent<HTMLInputElement>) => {
    musicPlayer.seek(Number(e.target.value));
  };

  return (
    <section className="relative min-h-screen w-full bg-black text-white">
      <Navbar />

      <div className="px-6 pt-40 pb-24 md:px-10">
        <h1 className="hero-title text-white font-medium text-[16vw] md:text-[9vw] leading-none">
          {s.heading}
        </h1>
        <p className="mt-4 text-sm text-white/70">{s.paragraph}</p>

        <div className="mt-12 max-w-3xl">
          {TRACKS.map((track, index) => {
            const isActive = src === track.src;
            return (
              <div
                key={track.src}
                className="flex items-center gap-4 border-b border-white/10 px-2 py-4 transition-colors hover:bg-white/5"
              >
                <span className="w-6 shrink-0 text-sm tabular-nums text-white/40">
                  {String(index + 1).padStart(2, "0")}
                </span>

                <button
                  onClick={() => handleTrackClick(index)}
                  aria-label={isActive && playing ? s.pause(track.title) : s.play(track.title)}
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border transition-colors ${
                    isActive ? "border-white bg-white text-black" : "border-white/20 text-white hover:border-white/50"
                  } ${isActive && loading ? "opacity-50" : ""}`}
                >
                  {isActive && playing ? (
                    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="currentColor" aria-hidden="true">
                      <rect x="6" y="5" width="4" height="14" rx="1" />
                      <rect x="14" y="5" width="4" height="14" rx="1" />
                    </svg>
                  ) : (
                    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 translate-x-[1px]" fill="currentColor" aria-hidden="true">
                      <path d="M8 5.5v13a1 1 0 0 0 1.53.85l10-6.5a1 1 0 0 0 0-1.7l-10-6.5A1 1 0 0 0 8 5.5Z" />
                    </svg>
                  )}
                </button>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm text-white">{track.title}</p>
                  <p className="truncate text-xs text-white/50">{track.artist}</p>
                </div>

                {isActive && (
                  <div className="flex shrink-0 items-center gap-3">
                    <span className="w-9 text-right text-[11px] tabular-nums text-white/50">
                      {formatTime(current)}
                    </span>
                    <input
                      type="range"
                      min={0}
                      max={isFinite(duration) && duration > 0 ? duration : 0}
                      step={0.1}
                      value={current}
                      onChange={seek}
                      disabled={!isFinite(duration) || duration === 0}
                      aria-label={s.seek(track.title)}
                      className="h-1 w-24 cursor-pointer accent-white disabled:opacity-30 sm:w-40"
                    />
                    <span className="w-9 text-[11px] tabular-nums text-white/50">{formatTime(duration)}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default MusicPage;
