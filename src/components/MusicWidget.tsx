import type { ChangeEvent, PointerEvent as ReactPointerEvent } from "react";
import { useEffect, useRef, useState } from "react";
import { musicPlayer, useMusicPlayer } from "../musicPlayer";
import { HOME_TRACK, PLAYLISTS } from "../tracks";
import { useLanguage } from "../i18n/LanguageContext";

const STRINGS = {
  fr: {
    homeTitle: "thème du site",
    homeArtist: "benjamin morel",
    pause: "mettre en pause",
    play: "lire",
    prev: "piste précédente",
    next: "piste suivante",
    stop: "arrêter la musique",
    seek: "avancer dans la musique",
    drag: "glisser pour déplacer",
  },
  en: {
    homeTitle: "site theme",
    homeArtist: "benjamin morel",
    pause: "pause",
    play: "play",
    prev: "previous track",
    next: "next track",
    stop: "stop music",
    seek: "seek in music",
    drag: "drag to move",
  },
} as const;

/* ------------------------------------------------------------------ */
/* securify — mini-lecteur flottant global                             */
/* Monté une seule fois au niveau de l'App : apparaît sur toutes les   */
/* pages dès qu'une piste est chargée, et permet de reprendre/mettre   */
/* en pause, changer de piste (playlist) ou arrêter complètement.      */
/* Déplaçable n'importe où à l'écran (glisser depuis le titre) ; la     */
/* position choisie est retenue d'une session à l'autre.                */
/* ------------------------------------------------------------------ */

const POSITION_KEY = "securify-music-widget-pos";
/* pochette par défaut (thème du site, morceaux sans pochette) */
const DEFAULT_COVER = `${import.meta.env.BASE_URL}og-image.jpg`;
const MARGIN = 12;

type Position = { x: number; y: number };

function loadPosition(): Position | null {
  try {
    const raw = localStorage.getItem(POSITION_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (typeof parsed?.x === "number" && typeof parsed?.y === "number") return parsed;
  } catch {
    /* stockage indisponible : on retombe sur la position par défaut */
  }
  return null;
}

function savePosition(pos: Position) {
  try {
    localStorage.setItem(POSITION_KEY, JSON.stringify(pos));
  } catch {
    /* stockage indisponible : la position ne sera juste pas retenue */
  }
}

function formatTime(s: number): string {
  if (!isFinite(s)) return "0:00";
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, "0")}`;
}

export default function MusicWidget() {
  const { lang } = useLanguage();
  const s = STRINGS[lang];
  const { src, playing, loading, current, duration } = useMusicPlayer();

  const widgetRef = useRef<HTMLDivElement>(null);
  const dragOffset = useRef<{ dx: number; dy: number } | null>(null);
  const dragStart = useRef<{ x: number; y: number } | null>(null);
  // le glissement ne s'engage qu'après avoir dépassé un petit seuil de mouvement,
  // pour ignorer les micro-tremblements de la souris (et les simples clics)
  const dragEngaged = useRef(false);
  // court historique des dernières positions (fenêtre glissante) pour estimer la
  // vitesse réelle du geste au lâcher, plutôt qu'un seul delta bruité
  const moveHistory = useRef<{ x: number; y: number; t: number }[]>([]);
  const momentumId = useRef<number | null>(null);
  const [pos, setPos] = useState<Position | null>(loadPosition);

  // interrompt le glissement inertiel en cours si le composant disparaît
  useEffect(() => () => {
    if (momentumId.current != null) cancelAnimationFrame(momentumId.current);
  }, []);

  // garde le widget visible si la fenêtre est redimensionnée après un déplacement
  useEffect(() => {
    if (!pos) return;
    const clampToViewport = () => {
      const el = widgetRef.current;
      const w = el?.offsetWidth ?? 288;
      const h = el?.offsetHeight ?? 180;
      setPos((p) =>
        p
          ? {
              x: Math.min(Math.max(MARGIN, p.x), Math.max(MARGIN, window.innerWidth - w - MARGIN)),
              y: Math.min(Math.max(MARGIN, p.y), Math.max(MARGIN, window.innerHeight - h - MARGIN)),
            }
          : p
      );
    };
    addEventListener("resize", clampToViewport);
    return () => removeEventListener("resize", clampToViewport);
  }, [pos]);

  /* la playlist qui contient la piste en cours : suivant/précédent restent dedans */
  const tracks = PLAYLISTS.find((p) => p.tracks.some((t) => t.src === src))?.tracks ?? [];
  const trackIndex = tracks.findIndex((t) => t.src === src);
  const track = trackIndex >= 0 ? tracks[trackIndex] : null;
  const title = track ? track.title : s.homeTitle;
  const artist = track ? track.artist : s.homeArtist;
  const cover = track?.cover ?? DEFAULT_COVER;
  const canChangeTrack = trackIndex >= 0;

  const toggle = () => {
    if (src) musicPlayer.toggle(src, { volume: src === HOME_TRACK ? 0.35 : 0.6, loop: src === HOME_TRACK });
  };

  const playAt = (index: number) => {
    if (!tracks.length) return;
    const next = tracks[(index + tracks.length) % tracks.length];
    musicPlayer.play(next.src, { volume: 0.6 });
  };

  /* écran verrouillé / centre de contrôle du téléphone (Media Session) :
     titre, artiste, pochette, et boutons lecture/pause/précédent/suivant/avance */
  const actionsRef = useRef({ toggle, playAt, trackIndex });
  useEffect(() => {
    actionsRef.current = { toggle, playAt, trackIndex };
  });
  useEffect(() => {
    if (!("mediaSession" in navigator)) return;
    const ms = navigator.mediaSession;
    if (!src) {
      ms.metadata = null;
      return;
    }
    ms.metadata = new MediaMetadata({
      title,
      artist,
      album: "benjamin morel",
      artwork: [{ src: new URL(cover, window.location.href).href, sizes: "512x512", type: "image/jpeg" }],
    });
    const set = (action: MediaSessionAction, handler: MediaSessionActionHandler | null) => {
      try {
        ms.setActionHandler(action, handler);
      } catch {
        /* action non gérée par ce navigateur */
      }
    };
    set("play", () => actionsRef.current.toggle());
    set("pause", () => musicPlayer.pause());
    set("previoustrack", canChangeTrack ? () => actionsRef.current.playAt(actionsRef.current.trackIndex - 1) : null);
    set("nexttrack", canChangeTrack ? () => actionsRef.current.playAt(actionsRef.current.trackIndex + 1) : null);
    set("seekto", (d) => {
      if (d.seekTime !== undefined) musicPlayer.seek(d.seekTime);
    });
  }, [src, title, artist, cover, canChangeTrack]);
  useEffect(() => {
    if ("mediaSession" in navigator) navigator.mediaSession.playbackState = src ? (playing ? "playing" : "paused") : "none";
  }, [src, playing]);

  /* téléphone : la barre du bas ne doit pas cacher la fin des pages */
  useEffect(() => {
    if (!src) return;
    const mq = window.matchMedia("(max-width: 767px)");
    const apply = () => {
      document.body.style.paddingBottom = mq.matches ? "calc(76px + env(safe-area-inset-bottom))" : "";
    };
    apply();
    mq.addEventListener("change", apply);
    return () => {
      mq.removeEventListener("change", apply);
      document.body.style.paddingBottom = "";
    };
  }, [src]);

  if (!src) return null;

  const seek = (e: ChangeEvent<HTMLInputElement>) => {
    musicPlayer.seek(Number(e.target.value));
  };

  const clamp = (next: Position): Position => {
    const el = widgetRef.current;
    const w = el?.offsetWidth ?? 288;
    const h = el?.offsetHeight ?? 180;
    return {
      x: Math.min(Math.max(MARGIN, next.x), Math.max(MARGIN, window.innerWidth - w - MARGIN)),
      y: Math.min(Math.max(MARGIN, next.y), Math.max(MARGIN, window.innerHeight - h - MARGIN)),
    };
  };

  // glissement inertiel après le lâcher : la position continue sur sa lancée puis
  // ralentit progressivement (friction), comme si on lâchait un objet en mouvement
  const startMomentum = (initial: { vx: number; vy: number }) => {
    let { vx, vy } = initial;
    let lastT: number | null = null;
    const friction = 0.94; // fraction de vitesse conservée toutes les ~16ms

    const step = (t: number) => {
      const dt = lastT == null ? 16 : t - lastT;
      lastT = t;
      const decay = Math.pow(friction, dt / 16);
      vx *= decay;
      vy *= decay;

      setPos((p) => {
        if (!p) return p;
        return clamp({ x: p.x + vx * dt, y: p.y + vy * dt });
      });

      if (Math.hypot(vx, vy) > 0.02) {
        momentumId.current = requestAnimationFrame(step);
      } else {
        momentumId.current = null;
        setPos((p) => {
          if (p) savePosition(p);
          return p;
        });
      }
    };
    momentumId.current = requestAnimationFrame(step);
  };

  // durée de la fenêtre glissante utilisée pour estimer la vitesse au lâcher
  const VELOCITY_WINDOW_MS = 80;
  // si le dernier mouvement enregistré date de plus longtemps que ça avant le
  // lâcher, la souris était déjà immobile : pas de glissement (sinon un vieux
  // mouvement rapide suivi d'une pause donnerait un lancer fantôme)
  const STALE_MOVE_MS = 60;
  // distance minimale (px) avant de considérer que l'utilisateur fait vraiment
  // glisser le widget, plutôt qu'un simple clic ou un tremblement de la souris
  const DRAG_THRESHOLD = 6;

  const onDragPointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    const el = widgetRef.current;
    if (!el) return;
    if (momentumId.current != null) {
      cancelAnimationFrame(momentumId.current);
      momentumId.current = null;
    }
    const rect = el.getBoundingClientRect();
    dragOffset.current = { dx: e.clientX - rect.left, dy: e.clientY - rect.top };
    dragStart.current = { x: e.clientX, y: e.clientY };
    dragEngaged.current = false;
    moveHistory.current = [];
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const onDragPointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (!dragOffset.current) return;

    if (!dragEngaged.current) {
      const start = dragStart.current;
      if (!start || Math.hypot(e.clientX - start.x, e.clientY - start.y) < DRAG_THRESHOLD) return;
      dragEngaged.current = true;
    }

    const next = clamp({ x: e.clientX - dragOffset.current.dx, y: e.clientY - dragOffset.current.dy });
    const now = performance.now();
    moveHistory.current.push({ x: next.x, y: next.y, t: now });
    const cutoff = now - VELOCITY_WINDOW_MS;
    while (moveHistory.current.length > 1 && moveHistory.current[0].t < cutoff) moveHistory.current.shift();
    setPos(next);
  };

  const endDrag = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (!dragOffset.current) return;
    const wasEngaged = dragEngaged.current;
    dragOffset.current = null;
    dragStart.current = null;
    dragEngaged.current = false;
    e.currentTarget.releasePointerCapture(e.pointerId);

    if (!wasEngaged) {
      moveHistory.current = [];
      return;
    }

    const history = moveHistory.current;
    moveHistory.current = [];
    const newest = history[history.length - 1];
    const oldest = history[0];
    const now = performance.now();

    let vel = { vx: 0, vy: 0 };
    if (newest && oldest && now - newest.t < STALE_MOVE_MS) {
      const dt = newest.t - oldest.t;
      if (dt > 4) vel = { vx: (newest.x - oldest.x) / dt, vy: (newest.y - oldest.y) / dt };
    }

    if (Math.hypot(vel.vx, vel.vy) > 0.03) {
      startMomentum(vel);
    } else {
      setPos((p) => {
        if (p) savePosition(p);
        return p;
      });
    }
  };

  const progress = isFinite(duration) && duration > 0 ? Math.min(100, (current / duration) * 100) : 0;

  return (
    <>
    {/* téléphone : barre fine en bas, sur toute la largeur, comme les applis de musique */}
    <div
      className="md:hidden fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-neutral-900/95 backdrop-blur text-white"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      {/* progression (touchable pour avancer) */}
      <div className="relative h-1 w-full bg-white/10">
        <div className="absolute inset-y-0 left-0 bg-white" style={{ width: `${progress}%` }} />
        <input
          type="range"
          min={0}
          max={isFinite(duration) && duration > 0 ? duration : 0}
          step={0.1}
          value={current}
          onChange={seek}
          disabled={!isFinite(duration) || duration === 0}
          aria-label={s.seek}
          className="absolute -top-2 left-0 h-5 w-full cursor-pointer opacity-0"
        />
      </div>
      <div className="flex items-center gap-3 px-3 py-2">
        <img src={cover} alt="" className="h-11 w-11 shrink-0 rounded-md object-cover" />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium">{title}</p>
          <p className="truncate text-xs text-white/50">{artist}</p>
        </div>
        {canChangeTrack && (
          <button onClick={() => playAt(trackIndex - 1)} aria-label={s.prev} className="p-1.5 text-white/70">
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden="true">
              <path d="M7 5a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h1a1 1 0 0 0 1-1v-4.6l8.47 5.4A1 1 0 0 0 18 17.9V6.1a1 1 0 0 0-1.53-.85L8 10.6V6a1 1 0 0 0-1-1H7Z" />
            </svg>
          </button>
        )}
        <button
          onClick={toggle}
          aria-label={playing ? s.pause : s.play}
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-black ${loading ? "opacity-50" : ""}`}
        >
          {playing ? (
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
              <rect x="6" y="5" width="4" height="14" rx="1" />
              <rect x="14" y="5" width="4" height="14" rx="1" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" className="h-4 w-4 translate-x-[1px]" fill="currentColor" aria-hidden="true">
              <path d="M8 5.5v13a1 1 0 0 0 1.53.85l10-6.5a1 1 0 0 0 0-1.7l-10-6.5A1 1 0 0 0 8 5.5Z" />
            </svg>
          )}
        </button>
        {canChangeTrack && (
          <button onClick={() => playAt(trackIndex + 1)} aria-label={s.next} className="p-1.5 text-white/70">
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden="true">
              <path d="M17 5a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1h-1a1 1 0 0 1-1-1v-4.6l-8.47 5.4A1 1 0 0 1 6 17.9V6.1a1 1 0 0 1 1.53-.85L16 10.6V6a1 1 0 0 1 1-1h1Z" />
            </svg>
          </button>
        )}
        <button onClick={() => musicPlayer.stop()} aria-label={s.stop} className="p-1.5 text-white/50">
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true">
            <path strokeLinecap="round" d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>
      </div>
    </div>

    {/* ordinateur / tablette : carte flottante déplaçable */}
    <div
      ref={widgetRef}
      style={pos ? { left: pos.x, top: pos.y } : undefined}
      className={`hidden md:block fixed z-40 w-72 rounded-2xl border border-white/10 bg-neutral-900/95 backdrop-blur p-4 text-white shadow-lg shadow-black/40 ${
        pos ? "" : "bottom-6 left-6"
      }`}
    >
      <div className="flex items-center justify-between gap-2">
        <div
          className="min-w-0 flex-1 select-none"
          title={s.drag}
          onPointerDown={onDragPointerDown}
          onPointerMove={onDragPointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          style={{ touchAction: "none" }}
        >
          <p className="truncate text-sm font-medium">{title}</p>
          <p className="truncate text-xs text-white/50">{artist}</p>
        </div>
        <button
          onClick={() => musicPlayer.stop()}
          aria-label={s.stop}
          className="shrink-0 text-white/50 hover:text-white transition-colors"
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true">
            <path strokeLinecap="round" d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>
      </div>

      <div className="mt-3 flex items-center justify-center gap-5">
        <button
          onClick={() => playAt(trackIndex - 1)}
          disabled={!canChangeTrack}
          aria-label={s.prev}
          className="text-white/70 hover:text-white transition-colors disabled:opacity-25 disabled:hover:text-white/70"
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden="true">
            <path d="M7 5a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h1a1 1 0 0 0 1-1v-4.6l8.47 5.4A1 1 0 0 0 18 17.9V6.1a1 1 0 0 0-1.53-.85L8 10.6V6a1 1 0 0 0-1-1H7Z" />
          </svg>
        </button>

        <button
          onClick={toggle}
          aria-label={playing ? s.pause : s.play}
          className={`flex h-10 w-10 items-center justify-center rounded-full bg-white text-black hover:bg-neutral-200 transition-colors ${
            loading ? "opacity-50" : ""
          }`}
        >
          {playing ? (
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
              <rect x="6" y="5" width="4" height="14" rx="1" />
              <rect x="14" y="5" width="4" height="14" rx="1" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" className="h-4 w-4 translate-x-[1px]" fill="currentColor" aria-hidden="true">
              <path d="M8 5.5v13a1 1 0 0 0 1.53.85l10-6.5a1 1 0 0 0 0-1.7l-10-6.5A1 1 0 0 0 8 5.5Z" />
            </svg>
          )}
        </button>

        <button
          onClick={() => playAt(trackIndex + 1)}
          disabled={!canChangeTrack}
          aria-label={s.next}
          className="text-white/70 hover:text-white transition-colors disabled:opacity-25 disabled:hover:text-white/70"
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden="true">
            <path d="M17 5a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1h-1a1 1 0 0 1-1-1v-4.6l-8.47 5.4A1 1 0 0 1 6 17.9V6.1a1 1 0 0 1 1.53-.85L16 10.6V6a1 1 0 0 1 1-1h1Z" />
          </svg>
        </button>
      </div>

      <div className="mt-3 flex items-center gap-2">
        <span className="w-9 shrink-0 text-right text-[11px] tabular-nums text-white/50">{formatTime(current)}</span>
        <input
          type="range"
          min={0}
          max={isFinite(duration) && duration > 0 ? duration : 0}
          step={0.1}
          value={current}
          onChange={seek}
          disabled={!isFinite(duration) || duration === 0}
          aria-label={s.seek}
          className="h-1 w-full cursor-pointer accent-white disabled:opacity-30"
        />
        <span className="w-9 shrink-0 text-[11px] tabular-nums text-white/50">{formatTime(duration)}</span>
      </div>
    </div>
    </>
  );
}
