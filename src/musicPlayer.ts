import { useSyncExternalStore } from "react";

/* ------------------------------------------------------------------ */
/* securify — lecteur audio global partagé                             */
/* Un seul élément <audio> vivant au niveau module : la musique        */
/* continue quand on change de page. Le bouton flottant et la page     */
/* "music" pilotent tous les deux ce lecteur (une seule piste à la     */
/* fois), et s'abonnent à son état via useMusicPlayer().               */
/* ------------------------------------------------------------------ */

export type PlayerState = {
  src: string | null;
  playing: boolean;
  loading: boolean;
  current: number;
  duration: number;
};

type PlayOptions = { volume?: number; loop?: boolean };

let audio: HTMLAudioElement | null = null;
let state: PlayerState = { src: null, playing: false, loading: false, current: 0, duration: 0 };
const listeners = new Set<() => void>();

function emit(patch: Partial<PlayerState>) {
  state = { ...state, ...patch };
  for (const listener of listeners) listener();
}

// création paresseuse : rien ne se télécharge avant le premier play (fichiers ~40-100 Mo)
function ensureAudio(): HTMLAudioElement {
  if (audio) return audio;
  const a = new Audio();
  a.preload = "none";
  a.addEventListener("timeupdate", () => emit({ current: a.currentTime }));
  a.addEventListener("loadedmetadata", () => emit({ duration: a.duration }));
  a.addEventListener("durationchange", () => emit({ duration: a.duration }));
  a.addEventListener("waiting", () => emit({ loading: true }));
  a.addEventListener("canplay", () => emit({ loading: false }));
  a.addEventListener("play", () => emit({ playing: true }));
  a.addEventListener("pause", () => emit({ playing: false }));
  a.addEventListener("ended", () => emit({ playing: false }));
  audio = a;
  return a;
}

function play(src: string, options?: PlayOptions) {
  const a = ensureAudio();
  if (state.src !== src) {
    a.pause();
    a.src = src;
    a.currentTime = 0;
    emit({ src, current: 0, duration: 0 });
  }
  a.volume = options?.volume ?? 0.5;
  a.loop = options?.loop ?? false;
  emit({ loading: true });
  a.play()
    .then(() => emit({ loading: false }))
    .catch(() => emit({ loading: false }));
}

export const musicPlayer = {
  play,
  pause() {
    audio?.pause();
  },
  // arrête complètement la lecture et efface la piste (masque le mini-lecteur)
  stop() {
    if (audio) {
      audio.pause();
      audio.removeAttribute("src");
      audio.load();
    }
    emit({ src: null, playing: false, loading: false, current: 0, duration: 0 });
  },
  // toggle sur une piste : reprend/coupe si c'est déjà elle, sinon bascule dessus
  toggle(src: string, options?: PlayOptions) {
    if (state.src === src && audio && !audio.paused) {
      audio.pause();
    } else {
      play(src, options);
    }
  },
  seek(time: number) {
    if (!audio || !isFinite(audio.duration)) return;
    audio.currentTime = time;
    emit({ current: time });
  },
};

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot(): PlayerState {
  return state;
}

export function useMusicPlayer(): PlayerState {
  return useSyncExternalStore(subscribe, getSnapshot);
}
