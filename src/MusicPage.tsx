import type { ChangeEvent } from "react";
import { useCallback, useState } from "react";
import Navbar from "./components/Navbar";
import useDocumentTitle from "./hooks/useDocumentTitle";
import { musicPlayer, useMusicPlayer } from "./musicPlayer";
import { PLAYLISTS } from "./tracks";
import { useLanguage } from "./i18n/LanguageContext";

const STRINGS = {
  fr: {
    pageTitle: "Playlist | Benjamin Morel",
    heading: "Playlist",
    paragraph:
      "la musique continue pendant que tu navigues sur le site, et sur téléphone elle reste en arrière-plan, même quand tu changes d'appli ou que tu verrouilles l'écran.",
    pause: (title: string) => `mettre en pause ${title}`,
    play: (title: string) => `lire ${title}`,
    seek: (title: string) => `avancer dans ${title}`,
    empty: "rien ici pour l'instant.",
    tabs: "choisir une playlist",
  },
  en: {
    pageTitle: "Playlist | Benjamin Morel",
    heading: "Playlist",
    paragraph:
      "the music keeps playing while you browse the site, and on your phone it stays in the background, even when you switch apps or lock the screen.",
    pause: (title: string) => `pause ${title}`,
    play: (title: string) => `play ${title}`,
    seek: (title: string) => `seek in ${title}`,
    empty: "nothing here yet.",
    tabs: "choose a playlist",
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

  /* onglet ouvert par défaut : la playlist "?" */
  const [activeKey, setActiveKey] = useState("mystery");
  const playlist = PLAYLISTS.find((p) => p.key === activeKey) ?? PLAYLISTS[0];
  const tracks = playlist.tracks;

  const handleTrackClick = useCallback(
    (index: number) => {
      musicPlayer.toggle(tracks[index].src, { volume: 0.6 });
    },
    [tracks]
  );

  const seek = (e: ChangeEvent<HTMLInputElement>) => {
    musicPlayer.seek(Number(e.target.value));
  };

  return (
    <section className="relative min-h-screen w-full bg-white dark:bg-black text-[#141414] dark:text-white">
      <Navbar />

      <div className="px-6 pt-40 pb-24 md:px-10">
        <h1 className="hero-title text-[#141414] dark:text-white font-medium text-[16vw] md:text-[9vw] leading-none">
          {s.heading}
        </h1>
        <p className="mt-4 text-sm text-[#141414]/70 dark:text-white/70">{s.paragraph}</p>

        <div role="tablist" aria-label={s.tabs} className="mt-10 flex gap-2">
          {PLAYLISTS.filter((p) => !p.hidden).map((p) => {
            const selected = p.key === playlist.key;
            return (
              <button
                key={p.key}
                role="tab"
                aria-selected={selected}
                onClick={() => setActiveKey(p.key)}
                className={`rounded-full border px-4 py-1.5 text-sm transition-colors ${
                  selected ? "border-[#141414] dark:border-white bg-[#141414] dark:bg-white text-white dark:text-black" : "border-[#141414]/20 dark:border-white/20 text-[#141414]/70 dark:text-white/70 hover:border-[#141414]/50 dark:hover:border-white/50 hover:text-[#141414] dark:hover:text-white"
                }`}
              >
                {p.name}
              </button>
            );
          })}
        </div>

        <div role="tabpanel" className="mt-8 max-w-3xl">
          {tracks.length === 0 && <p className="px-2 py-4 text-sm text-[#141414]/40 dark:text-white/40">{s.empty}</p>}
          {tracks.map((track, index) => {
            const isActive = src === track.src;
            return (
              <div
                key={track.src}
                className="flex items-center gap-4 border-b border-[#141414]/10 dark:border-white/10 px-2 py-4 transition-colors hover:bg-[#141414]/5 dark:hover:bg-white/5"
              >
                <span className="w-6 shrink-0 text-sm tabular-nums text-[#141414]/40 dark:text-white/40">
                  {String(index + 1).padStart(2, "0")}
                </span>

                <button
                  onClick={() => handleTrackClick(index)}
                  aria-label={isActive && playing ? s.pause(track.title) : s.play(track.title)}
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border transition-colors ${
                    isActive ? "border-[#141414] dark:border-white bg-[#141414] dark:bg-white text-white dark:text-black" : "border-[#141414]/20 dark:border-white/20 text-[#141414] dark:text-white hover:border-[#141414]/50 dark:hover:border-white/50"
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
                  <p className="truncate text-sm text-[#141414] dark:text-white">{track.title}</p>
                  <p className="truncate text-xs text-[#141414]/50 dark:text-white/50">{track.artist}</p>
                </div>

                {isActive && (
                  // sur téléphone, la progression est dans la barre du bas (MusicWidget)
                  <div className="hidden sm:flex shrink-0 items-center gap-3">
                    <span className="w-9 text-right text-[11px] tabular-nums text-[#141414]/50 dark:text-white/50">
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
                      className="h-1 w-24 cursor-pointer accent-[#141414] dark:accent-white disabled:opacity-30 sm:w-40"
                    />
                    <span className="w-9 text-[11px] tabular-nums text-[#141414]/50 dark:text-white/50">{formatTime(duration)}</span>
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
