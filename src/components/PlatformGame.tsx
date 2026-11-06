import type { PointerEvent as ReactPointerEvent } from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useLanguage } from "../i18n/LanguageContext";

const STRINGS = {
  fr: {
    heading: "Projets",
    intro:
      "un casse-briques codé à la main : lance la balle, enchaîne les blocs sans en rater pour faire grimper ton multiplicateur de combo, et attrape les bonus qui tombent sur 3 niveaux de difficulté croissante.",
    launchHint: "touche, clique ou appuie sur espace pour lancer",
    score: "score :",
    best: "meilleur :",
    combo: (mult: number) => `combo ×${mult}`,
    level: (level: number, total: number) => `niveau ${level}/${total}`,
    soundOn: "son activé",
    soundOff: "son désactivé",
    lives: "vies :",
    idleInstructions:
      "déplace la barre au doigt ou à la souris (ou ← →), lance la balle d'un toucher, d'un clic ou avec espace, et détruis tous les blocs. enchaîne les coups pour booster ton combo, évite les obstacles indestructibles et attrape les bonus qui tombent : barre plus large, vie en plus, ralenti ou multi-balle. appuie sur P pour mettre en pause. 3 niveaux, trois vies perdues et c'est terminé.",
    startGame: "lancer la partie",
    paused: "pause",
    resume: "reprendre",
    levelCleared: (level: number) => `niveau ${level} terminé`,
    startLevel: (level: number) => `lancer le niveau ${level}`,
    gameOver: "partie terminée",
    playAgain: "rejouer",
    allClear: "tout nettoyé",
    allClearedSummary: "3 niveaux terminés",
    bottomHint:
      "déplace la barre, lance la balle, enchaîne les blocs pour des points de combo et attrape les bonus — appuie sur P ou Échap pour mettre en pause.",
  },
  en: {
    heading: "Projects",
    intro:
      "a hand-coded breakout game: launch the ball, chain blocks without missing to grow your combo multiplier, and grab falling bonuses across 3 levels of rising difficulty.",
    launchHint: "tap, click or press space to launch",
    score: "score:",
    best: "best:",
    combo: (mult: number) => `combo ×${mult}`,
    level: (level: number, total: number) => `level ${level}/${total}`,
    soundOn: "sound on",
    soundOff: "sound off",
    lives: "lives:",
    idleInstructions:
      "move the bar with your finger or mouse (or ← →), launch the ball with a tap, a click or space, and smash every block. chain hits to boost your combo, dodge indestructible obstacles and catch falling bonuses: wider bar, extra life, slow motion, or multi-ball. press P to pause. 3 levels, three misses and it's over.",
    startGame: "start game",
    paused: "paused",
    resume: "resume",
    levelCleared: (level: number) => `level ${level} cleared`,
    startLevel: (level: number) => `start level ${level}`,
    gameOver: "game over",
    playAgain: "play again",
    allClear: "all clear",
    allClearedSummary: "all 3 levels cleared",
    bottomHint:
      "move the bar, launch the ball, chain blocks for combo points and catch bonuses — press P or Esc to pause.",
  },
} as const;

/* ------------------------------------------------------------------ */
/* securify — section "platform" : mini-jeu "breakout"                 */
/* Déplace la barre en bas (souris ou ← →) pour renvoyer la balle et   */
/* détruire les blocs. Bonus, obstacles indestructibles et 3 niveaux   */
/* de difficulté croissante. Physique indexée sur le temps réel.       */
/* Extras : balle à lancer soi-même, pause, combos, sons, traînée,     */
/* screen shake et meilleur score persistant.                          */
/* ------------------------------------------------------------------ */

/* téléphone tenu en vertical (au chargement de la page) : plateau en format portrait,
   plus haut que large, avec moins de colonnes de briques ; sinon format paysage habituel */
const PORTRAIT =
  typeof window !== "undefined" && window.matchMedia("(max-width: 767px) and (orientation: portrait)").matches;
const WIDTH = PORTRAIT ? 720 : 1200;
const HEIGHT = PORTRAIT ? 1100 : 720;

const BASE_PADDLE_WIDTH = 165;
const PADDLE_HEIGHT = 20;
const PADDLE_Y = HEIGHT - 45;
const PADDLE_KEY_SPEED = 13; // px par frame-60fps
const PADDLE_GROW_MS = 10_000;

const BALL_RADIUS = 11;
const BASE_BALL_SPEED = 4.6; // px par frame-60fps
const MAX_BALL_SPEED = 8;
const SLOW_MS = 8_000;
const SLOW_FACTOR = 0.55;
const MAX_BALLS = 6;
const SUPER_MULTI_BALLS = 99;
const SUPER_MULTI_CHANCE = 1 / 3;
const TRAIL_LENGTH = 7;

const COLS = PORTRAIT ? 9 : 14;
/* les obstacles des niveaux sont placés sur la grille de 14 colonnes : on les ramène
   proportionnellement sur la grille du format portrait */
const LEVEL_COLS = 14;
const toCol = (col: number) => (COLS === LEVEL_COLS ? col : Math.round((col * (COLS - 1)) / (LEVEL_COLS - 1)));
const BRICK_HEIGHT = 24;
const BRICK_GAP = 6;
const SIDE_OFFSET = 32;
const TOP_OFFSET = 54;
const BRICK_WIDTH = (WIDTH - SIDE_OFFSET * 2 - BRICK_GAP * (COLS - 1)) / COLS;
const ROW_COLORS = ["#f87171", "#fb923c", "#fbbf24", "#a3e635", "#4ade80", "#2dd4bf", "#38bdf8", "#60a5fa"];
const ROW_POINTS = [80, 70, 60, 50, 40, 30, 20, 10];

const START_LIVES = 3;
const MAX_LIVES = 5;

const POWERUP_CHANCE = 0.22;
const POWERUP_WIDTH = 68;
const POWERUP_HEIGHT = 26;
const POWERUP_SPEED = 3; // px par frame-60fps

const SHAKE_MS = 150;
const MAX_COMBO_MULTIPLIER = 4;

const BEST_KEY = "securify-breakout-best";
const SOUND_KEY = "securify-breakout-sound";

// un frame "logique" vaut 1/60s ; on borne l'écart pour éviter les à-coups
// après un onglet mis en arrière-plan (sinon la balle pourrait traverser un bloc ou la barre).
const MAX_FRAME_SCALE = 3;

type Brick = { x: number; y: number; row: number; alive: boolean };
type Obstacle = { x: number; y: number };
type Ball = { x: number; y: number; dx: number; dy: number; stuck: boolean; trail: { x: number; y: number }[] };
type Particle = { x: number; y: number; vx: number; vy: number; life: number; maxLife: number; color: string };
type Phase = "idle" | "playing" | "paused" | "levelup" | "over" | "won";
type PowerUpType = "grow" | "life" | "slow" | "multi" | "supermulti";
type PowerUp = { x: number; y: number; type: PowerUpType };

const POWERUP_STYLE: Record<PowerUpType, { color: string; label: string }> = {
  grow: { color: "#4ade80", label: "WIDE" },
  life: { color: "#f472b6", label: "+1" },
  slow: { color: "#38bdf8", label: "SLOW" },
  multi: { color: "#facc15", label: "MULTI" },
  supermulti: { color: "#a78bfa", label: "×99" },
};
const POWERUP_TYPES = Object.keys(POWERUP_STYLE) as PowerUpType[];
const REGULAR_POWERUP_TYPES = POWERUP_TYPES.filter((t) => t !== "supermulti");

// 3 niveaux : le nombre de rangées, les obstacles indestructibles (position en
// grille row/col) et le multiplicateur de vitesse de balle montent en difficulté.
type LevelConfig = { rows: number; obstacles: { row: number; col: number }[]; speedMultiplier: number };

const LEVELS: LevelConfig[] = [
  { rows: 5, obstacles: [], speedMultiplier: 1 },
  {
    rows: 7,
    obstacles: [
      { row: 3, col: 3 },
      { row: 3, col: 10 },
      { row: 5, col: 6 },
      { row: 5, col: 7 },
    ],
    speedMultiplier: 1.15,
  },
  {
    rows: 8,
    obstacles: [
      { row: 2, col: 2 },
      { row: 2, col: 11 },
      { row: 4, col: 1 },
      { row: 4, col: 12 },
      { row: 5, col: 6 },
      { row: 5, col: 7 },
      { row: 6, col: 3 },
      { row: 6, col: 10 },
    ],
    speedMultiplier: 1.3,
  },
];

/* petite vibration du téléphone (Android ; sans effet ailleurs) */
function vibrate(pattern: number | number[]) {
  try {
    navigator.vibrate?.(pattern);
  } catch {
    /* non disponible */
  }
}

function gridPosition(row: number, col: number) {
  return {
    x: SIDE_OFFSET + col * (BRICK_WIDTH + BRICK_GAP),
    y: TOP_OFFSET + row * (BRICK_HEIGHT + BRICK_GAP),
  };
}

function createLevel(levelIndex: number): { bricks: Brick[]; obstacles: Obstacle[] } {
  const config = LEVELS[levelIndex];
  const obstacleCells = new Set(config.obstacles.map((o) => `${o.row},${toCol(o.col)}`));
  const bricks: Brick[] = [];
  const obstacles: Obstacle[] = [];

  for (let row = 0; row < config.rows; row++) {
    for (let col = 0; col < COLS; col++) {
      const { x, y } = gridPosition(row, col);
      if (obstacleCells.has(`${row},${col}`)) {
        obstacles.push({ x, y });
      } else {
        bricks.push({ x, y, row, alive: true });
      }
    }
  }

  return { bricks, obstacles };
}

// la balle démarre collée à la barre : le joueur la lance lui-même (clic ou espace)
function spawnStuckBall(paddleX: number, paddleWidth: number): Ball {
  return {
    x: paddleX + paddleWidth / 2,
    y: PADDLE_Y - BALL_RADIUS - 1,
    dx: 0,
    dy: 0,
    stuck: true,
    trail: [],
  };
}

// le super multi a 1 chance sur 3 de tomber ; les autres bonus se partagent le reste
function randomPowerUpType(): PowerUpType {
  if (Math.random() < SUPER_MULTI_CHANCE) return "supermulti";
  return REGULAR_POWERUP_TYPES[Math.floor(Math.random() * REGULAR_POWERUP_TYPES.length)];
}

// rebond sur les murs gauche/droite/haut, avec repositionnement pour ne jamais rester "collé"
function bounceOffWalls(ball: Ball): boolean {
  let bounced = false;
  if (ball.x - BALL_RADIUS <= 0) {
    ball.x = BALL_RADIUS;
    ball.dx = Math.abs(ball.dx);
    bounced = true;
  } else if (ball.x + BALL_RADIUS >= WIDTH) {
    ball.x = WIDTH - BALL_RADIUS;
    ball.dx = -Math.abs(ball.dx);
    bounced = true;
  }
  if (ball.y - BALL_RADIUS <= 0) {
    ball.y = BALL_RADIUS;
    ball.dy = Math.abs(ball.dy);
    bounced = true;
  }
  return bounced;
}

// rebond sur la barre : l'angle dépend du point d'impact (centre = tout droit, bords = angle serré)
function bounceOffPaddle(ball: Ball, paddleX: number, paddleWidth: number, speed: number) {
  ball.y = PADDLE_Y - BALL_RADIUS;
  const hit = (ball.x - (paddleX + paddleWidth / 2)) / (paddleWidth / 2);
  ball.dx = hit * speed;
  ball.dy = -Math.sqrt(Math.max(speed * speed - ball.dx * ball.dx, speed * 0.6));
}

// réflexion physique cercle/rectangle : on cherche le point du rectangle le plus
// proche du centre de la balle, on réfléchit la vitesse autour de cette normale,
// puis on repousse la balle hors du rectangle. Gère correctement les coins
// (rebond en diagonale) contrairement à un simple "inverse dx ou dy".
function bounceOffRect(ball: Ball, rectX: number, rectY: number, rectW: number, rectH: number) {
  const closestX = Math.max(rectX, Math.min(ball.x, rectX + rectW));
  const closestY = Math.max(rectY, Math.min(ball.y, rectY + rectH));
  const dx = ball.x - closestX;
  const dy = ball.y - closestY;
  const dist = Math.hypot(dx, dy) || 0.0001;
  const nx = dx / dist;
  const ny = dy / dist;

  const dot = ball.dx * nx + ball.dy * ny;
  ball.dx -= 2 * dot * nx;
  ball.dy -= 2 * dot * ny;

  const overlap = BALL_RADIUS - dist;
  if (overlap > 0) {
    ball.x += nx * overlap;
    ball.y += ny * overlap;
  }
}

function hitTestRect(ball: Ball, rectX: number, rectY: number, rectW: number, rectH: number) {
  return (
    ball.x + BALL_RADIUS > rectX &&
    ball.x - BALL_RADIUS < rectX + rectW &&
    ball.y + BALL_RADIUS > rectY &&
    ball.y - BALL_RADIUS < rectY + rectH
  );
}

function spawnParticles(particles: Particle[], x: number, y: number, color: string) {
  for (let i = 0; i < 8; i++) {
    const angle = (Math.PI * 2 * i) / 8 + Math.random() * 0.5;
    const speed = 2 + Math.random() * 3;
    particles.push({
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      life: 400 + Math.random() * 200,
      maxLife: 500,
      color,
    });
  }
}

function loadBest(): number {
  try {
    const value = Number(localStorage.getItem(BEST_KEY));
    return Number.isFinite(value) && value > 0 ? value : 0;
  } catch {
    return 0;
  }
}

function loadSoundOn(): boolean {
  try {
    return localStorage.getItem(SOUND_KEY) !== "off";
  } catch {
    return true;
  }
}

export default function PlatformGame() {
  const { lang } = useLanguage();
  const s = STRINGS[lang];

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);
  const lastTimeRef = useRef(0);
  const keysRef = useRef({ left: false, right: false });

  const levelIndexRef = useRef(0);
  const bricksRef = useRef<Brick[]>([]);
  const obstaclesRef = useRef<Obstacle[]>([]);
  const paddleXRef = useRef((WIDTH - BASE_PADDLE_WIDTH) / 2);
  const paddleWidthRef = useRef(BASE_PADDLE_WIDTH);
  const paddleGrowUntilRef = useRef(0);
  const slowUntilRef = useRef(0);
  const ballsRef = useRef<Ball[]>([]);
  const powerupsRef = useRef<PowerUp[]>([]);
  const particlesRef = useRef<Particle[]>([]);
  const activeBuffsKeyRef = useRef("");
  const shakeRef = useRef({ intensity: 0, until: 0 });
  const comboRef = useRef(0);
  const comboMultShownRef = useRef(1);
  const audioCtxRef = useRef<AudioContext | null>(null);

  const [phase, setPhase] = useState<Phase>("idle");
  const [level, setLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(loadBest);
  const [lives, setLives] = useState(START_LIVES);
  const [activeBuffs, setActiveBuffs] = useState<PowerUpType[]>([]);
  const [comboMult, setComboMult] = useState(1);
  const [soundOn, setSoundOn] = useState(loadSoundOn);

  const scoreRef = useRef(0);
  const livesRef = useRef(START_LIVES);
  const phaseRef = useRef<Phase>("idle");
  const soundOnRef = useRef(soundOn);

  // le phaseRef suit la phase pour les handlers globaux (clavier, visibilitychange)
  const changePhase = useCallback((next: Phase) => {
    phaseRef.current = next;
    setPhase(next);
  }, []);

  /* ------------------------------- audio ------------------------------- */

  // petits sons synthétisés (pas de fichiers) ; volume bas pour rester discret
  const playTone = useCallback(
    (freq: number, durationMs: number, type: OscillatorType = "square", volume = 0.04, delayMs = 0) => {
      if (!soundOnRef.current) return;
      const ctx = audioCtxRef.current;
      if (!ctx) return;
      const t0 = ctx.currentTime + delayMs / 1000;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(volume, t0);
      gain.gain.exponentialRampToValueAtTime(0.0001, t0 + durationMs / 1000);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(t0);
      osc.stop(t0 + durationMs / 1000);
    },
    []
  );

  const ensureAudio = useCallback(() => {
    if (!audioCtxRef.current) {
      try {
        audioCtxRef.current = new AudioContext();
      } catch {
        audioCtxRef.current = null;
      }
    }
    audioCtxRef.current?.resume().catch(() => {});
  }, []);

  const toggleSound = useCallback(() => {
    setSoundOn((on) => {
      const next = !on;
      soundOnRef.current = next;
      try {
        localStorage.setItem(SOUND_KEY, next ? "on" : "off");
      } catch {
        /* stockage indisponible : le réglage ne sera juste pas retenu */
      }
      return next;
    });
  }, []);

  /* ------------------------------- rendu ------------------------------- */

  const triggerShake = useCallback((intensity: number) => {
    shakeRef.current = { intensity, until: performance.now() + SHAKE_MS };
  }, []);

  const draw = useCallback((now: number = performance.now()) => {
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, WIDTH, HEIGHT);
    ctx.save();

    // tremblement d'écran bref quand un bloc casse ou qu'une vie est perdue
    const shake = shakeRef.current;
    if (shake.until > now) {
      const falloff = (shake.until - now) / SHAKE_MS;
      ctx.translate(
        (Math.random() * 2 - 1) * shake.intensity * falloff,
        (Math.random() * 2 - 1) * shake.intensity * falloff
      );
    }

    for (const obstacle of obstaclesRef.current) {
      ctx.fillStyle = "#404040";
      ctx.strokeStyle = "rgba(255,255,255,0.2)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.roundRect(obstacle.x, obstacle.y, BRICK_WIDTH, BRICK_HEIGHT, 4);
      ctx.fill();
      ctx.stroke();
    }

    for (const brick of bricksRef.current) {
      if (!brick.alive) continue;
      ctx.fillStyle = ROW_COLORS[brick.row % ROW_COLORS.length];
      ctx.beginPath();
      ctx.roundRect(brick.x, brick.y, BRICK_WIDTH, BRICK_HEIGHT, 4);
      ctx.fill();
    }

    for (const particle of particlesRef.current) {
      ctx.globalAlpha = Math.max(0, particle.life / particle.maxLife);
      ctx.fillStyle = particle.color;
      ctx.fillRect(particle.x - 3, particle.y - 3, 6, 6);
    }
    ctx.globalAlpha = 1;

    for (const powerup of powerupsRef.current) {
      const style = POWERUP_STYLE[powerup.type];
      ctx.fillStyle = style.color;
      ctx.beginPath();
      ctx.roundRect(powerup.x - POWERUP_WIDTH / 2, powerup.y - POWERUP_HEIGHT / 2, POWERUP_WIDTH, POWERUP_HEIGHT, 9);
      ctx.fill();
      ctx.fillStyle = "#000000";
      ctx.font = "bold 10px sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(style.label, powerup.x, powerup.y + 1);
    }

    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.roundRect(paddleXRef.current, PADDLE_Y, paddleWidthRef.current, PADDLE_HEIGHT, 7);
    ctx.fill();

    // traînée puis balles
    ctx.fillStyle = "#ffffff";
    for (const ball of ballsRef.current) {
      const count = ball.trail.length;
      for (let i = 0; i < count; i++) {
        const t = (i + 1) / count;
        ctx.globalAlpha = t * 0.22;
        ctx.beginPath();
        ctx.arc(ball.trail[i].x, ball.trail[i].y, BALL_RADIUS * (0.4 + t * 0.6), 0, Math.PI * 2);
        ctx.fill();
      }
    }
    ctx.globalAlpha = 1;
    for (const ball of ballsRef.current) {
      ctx.beginPath();
      ctx.arc(ball.x, ball.y, BALL_RADIUS, 0, Math.PI * 2);
      ctx.fill();
    }

    // invite de lancement quand la balle est collée à la barre
    if (ballsRef.current.some((b) => b.stuck)) {
      ctx.fillStyle = "rgba(255,255,255,0.55)";
      ctx.font = "16px sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "alphabetic";
      ctx.fillText(s.launchHint, WIDTH / 2, PADDLE_Y - 56);
    }

    ctx.restore();
  }, [s.launchHint]);

  const stopLoop = useCallback(() => {
    cancelAnimationFrame(rafRef.current);
  }, []);

  /* ------------------------------ gameplay ------------------------------ */

  const saveBest = useCallback(() => {
    setBest((b) => {
      const next = Math.max(b, scoreRef.current);
      try {
        localStorage.setItem(BEST_KEY, String(next));
      } catch {
        /* stockage indisponible : le score ne sera juste pas retenu */
      }
      return next;
    });
  }, []);

  // multiplicateur de combo : ×2 à partir de 4 blocs d'affilée sans toucher la barre,
  // ×3 à 7, ×4 à 10 (plafonné)
  const currentComboMultiplier = useCallback(() => {
    return Math.min(MAX_COMBO_MULTIPLIER, 1 + Math.floor(Math.max(0, comboRef.current - 1) / 3));
  }, []);

  const syncComboDisplay = useCallback(() => {
    const mult = currentComboMultiplier();
    if (mult !== comboMultShownRef.current) {
      comboMultShownRef.current = mult;
      setComboMult(mult);
    }
  }, [currentComboMultiplier]);

  const resetCombo = useCallback(() => {
    comboRef.current = 0;
    syncComboDisplay();
  }, [syncComboDisplay]);

  const launchStuckBalls = useCallback(() => {
    const speed = BASE_BALL_SPEED * LEVELS[levelIndexRef.current].speedMultiplier;
    let launched = false;
    for (const ball of ballsRef.current) {
      if (!ball.stuck) continue;
      ball.stuck = false;
      ball.dx = (Math.random() * 1.2 - 0.6) * speed;
      ball.dy = -Math.sqrt(speed * speed - ball.dx * ball.dx);
      launched = true;
    }
    if (launched) playTone(440, 70, "square", 0.03);
  }, [playTone]);

  const applyPowerUp = useCallback(
    (type: PowerUpType) => {
      const now = performance.now();
      if (type === "grow") {
        paddleWidthRef.current = BASE_PADDLE_WIDTH * 1.6;
        paddleGrowUntilRef.current = now + PADDLE_GROW_MS;
      } else if (type === "life") {
        livesRef.current = Math.min(MAX_LIVES, livesRef.current + 1);
        setLives(livesRef.current);
      } else if (type === "slow") {
        slowUntilRef.current = now + SLOW_MS;
      } else if (type === "multi") {
        const source = ballsRef.current.find((b) => !b.stuck);
        if (source && ballsRef.current.length < MAX_BALLS) {
          const clones: Ball[] = [
            { ...source, dx: source.dx * 0.8 - 1.5, dy: -Math.abs(source.dy), trail: [] },
            { ...source, dx: source.dx * 0.8 + 1.5, dy: -Math.abs(source.dy), trail: [] },
          ];
          ballsRef.current = [...ballsRef.current, ...clones].slice(0, MAX_BALLS);
        }
      } else if (type === "supermulti") {
        // pluie de balles : on complète jusqu'à 99 balles en éventail vers le haut,
        // depuis une balle en jeu (ou la barre s'il n'y en a pas)
        const source = ballsRef.current.find((b) => !b.stuck);
        const originX = source ? source.x : paddleXRef.current + paddleWidthRef.current / 2;
        const originY = source ? source.y : PADDLE_Y - BALL_RADIUS - 1;
        const speed = BASE_BALL_SPEED * LEVELS[levelIndexRef.current].speedMultiplier;
        const toAdd = SUPER_MULTI_BALLS - ballsRef.current.length;
        for (let i = 0; i < toAdd; i++) {
          // angle entre 1.1π et 1.9π : toujours vers le haut, jamais à l'horizontale
          const angle = Math.PI * (1.1 + 0.8 * ((i + Math.random()) / toAdd));
          ballsRef.current.push({
            x: originX,
            y: originY,
            dx: Math.cos(angle) * speed,
            dy: Math.sin(angle) * speed,
            stuck: false,
            trail: [],
          });
        }
        playTone(1046, 200, "square", 0.04, 140);
      }
      // petit arpège ascendant à la prise d'un bonus
      playTone(523, 70, "square", 0.04);
      playTone(784, 90, "square", 0.04, 70);
    },
    [playTone]
  );

  const loseLife = useCallback(() => {
    livesRef.current -= 1;
    setLives(Math.max(0, livesRef.current));
    resetCombo();
    triggerShake(9);
    if (livesRef.current <= 0) {
      stopLoop();
      changePhase("over");
      saveBest();
      playTone(160, 350, "sawtooth", 0.05);
      playTone(105, 450, "sawtooth", 0.05, 160);
      vibrate([80, 60, 160]);
      return;
    }
    playTone(180, 220, "sawtooth", 0.04);
    vibrate(90);
    paddleWidthRef.current = BASE_PADDLE_WIDTH;
    paddleGrowUntilRef.current = 0;
    paddleXRef.current = (WIDTH - paddleWidthRef.current) / 2;
    ballsRef.current = [spawnStuckBall(paddleXRef.current, paddleWidthRef.current)];
  }, [changePhase, playTone, resetCombo, saveBest, stopLoop, triggerShake]);

  const updatePaddle = useCallback((frameScale: number, now: number) => {
    if (keysRef.current.left) paddleXRef.current -= PADDLE_KEY_SPEED * frameScale;
    if (keysRef.current.right) paddleXRef.current += PADDLE_KEY_SPEED * frameScale;
    paddleXRef.current = Math.max(0, Math.min(WIDTH - paddleWidthRef.current, paddleXRef.current));

    if (paddleGrowUntilRef.current > 0 && now >= paddleGrowUntilRef.current) {
      paddleGrowUntilRef.current = 0;
      paddleWidthRef.current = BASE_PADDLE_WIDTH;
    }
  }, []);

  // ne déclenche un re-render que si la liste de buffs affichés a réellement changé
  const syncActiveBuffs = useCallback((now: number) => {
    const buffs: PowerUpType[] = [];
    if (paddleGrowUntilRef.current > now) buffs.push("grow");
    if (slowUntilRef.current > now) buffs.push("slow");
    const key = buffs.join(",");
    if (key !== activeBuffsKeyRef.current) {
      activeBuffsKeyRef.current = key;
      setActiveBuffs(buffs);
    }
  }, []);

  const updatePowerUps = useCallback(
    (frameScale: number) => {
      powerupsRef.current = powerupsRef.current.filter((p) => {
        p.y += POWERUP_SPEED * frameScale;
        const caught =
          p.y + POWERUP_HEIGHT / 2 >= PADDLE_Y &&
          p.y - POWERUP_HEIGHT / 2 <= PADDLE_Y + PADDLE_HEIGHT &&
          p.x >= paddleXRef.current &&
          p.x <= paddleXRef.current + paddleWidthRef.current;
        if (caught) {
          applyPowerUp(p.type);
          return false;
        }
        return p.y - POWERUP_HEIGHT / 2 <= HEIGHT;
      });
    },
    [applyPowerUp]
  );

  const updateParticles = useCallback((dtMs: number) => {
    particlesRef.current = particlesRef.current.filter((p) => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.15; // légère gravité
      p.life -= dtMs;
      return p.life > 0;
    });
  }, []);

  const updateBalls = useCallback(
    (frameScale: number, now: number) => {
      const speedMult = (slowUntilRef.current > now ? SLOW_FACTOR : 1) * frameScale;

      for (const ball of ballsRef.current) {
        // balle collée : elle suit le centre de la barre en attendant le lancement
        if (ball.stuck) {
          ball.x = paddleXRef.current + paddleWidthRef.current / 2;
          ball.y = PADDLE_Y - BALL_RADIUS - 1;
          ball.trail.length = 0;
          continue;
        }

        ball.x += ball.dx * speedMult;
        ball.y += ball.dy * speedMult;

        ball.trail.push({ x: ball.x, y: ball.y });
        if (ball.trail.length > TRAIL_LENGTH) ball.trail.shift();

        if (bounceOffWalls(ball)) {
          playTone(150, 40, "square", 0.02);
        }

        if (
          ball.dy > 0 &&
          ball.y + BALL_RADIUS >= PADDLE_Y &&
          ball.y + BALL_RADIUS <= PADDLE_Y + PADDLE_HEIGHT + 12 &&
          ball.x >= paddleXRef.current &&
          ball.x <= paddleXRef.current + paddleWidthRef.current
        ) {
          const maxSpeed = MAX_BALL_SPEED * LEVELS[levelIndexRef.current].speedMultiplier;
          const baseSpeed = BASE_BALL_SPEED * LEVELS[levelIndexRef.current].speedMultiplier;
          const speed = Math.min(maxSpeed, baseSpeed + scoreRef.current / 400);
          bounceOffPaddle(ball, paddleXRef.current, paddleWidthRef.current, speed);
          resetCombo(); // le combo ne survit pas à un retour sur la barre
          playTone(220, 60, "square", 0.03);
        }

        const brick = bricksRef.current.find((b) => b.alive && hitTestRect(ball, b.x, b.y, BRICK_WIDTH, BRICK_HEIGHT));
        if (brick) {
          brick.alive = false;
          bounceOffRect(ball, brick.x, brick.y, BRICK_WIDTH, BRICK_HEIGHT);
          spawnParticles(particlesRef.current, brick.x + BRICK_WIDTH / 2, brick.y + BRICK_HEIGHT / 2, ROW_COLORS[brick.row % ROW_COLORS.length]);
          comboRef.current += 1;
          syncComboDisplay();
          scoreRef.current += ROW_POINTS[brick.row % ROW_POINTS.length] * currentComboMultiplier();
          setScore(scoreRef.current);
          triggerShake(4);
          // note plus aiguë pour les rangées hautes (qui rapportent plus)
          playTone(320 + (ROW_COLORS.length - brick.row) * 35, 80, "square", 0.035);
          vibrate(12);
          if (Math.random() < POWERUP_CHANCE) {
            powerupsRef.current.push({
              x: brick.x + BRICK_WIDTH / 2,
              y: brick.y + BRICK_HEIGHT / 2,
              type: randomPowerUpType(),
            });
          }
        } else {
          const obstacle = obstaclesRef.current.find((o) => hitTestRect(ball, o.x, o.y, BRICK_WIDTH, BRICK_HEIGHT));
          if (obstacle) {
            bounceOffRect(ball, obstacle.x, obstacle.y, BRICK_WIDTH, BRICK_HEIGHT);
            playTone(110, 70, "triangle", 0.04);
          }
        }
      }

      // retire les balles tombées derrière la barre
      ballsRef.current = ballsRef.current.filter((b) => b.y - BALL_RADIUS <= HEIGHT);
    },
    [currentComboMultiplier, playTone, resetCombo, syncComboDisplay, triggerShake]
  );

  const startLevel = useCallback(
    (levelIndex: number, resetProgress: boolean) => {
      const { bricks, obstacles } = createLevel(levelIndex);
      levelIndexRef.current = levelIndex;
      bricksRef.current = bricks;
      obstaclesRef.current = obstacles;
      paddleWidthRef.current = BASE_PADDLE_WIDTH;
      paddleGrowUntilRef.current = 0;
      slowUntilRef.current = 0;
      paddleXRef.current = (WIDTH - BASE_PADDLE_WIDTH) / 2;
      ballsRef.current = [spawnStuckBall(paddleXRef.current, BASE_PADDLE_WIDTH)];
      powerupsRef.current = [];
      particlesRef.current = [];
      activeBuffsKeyRef.current = "";
      lastTimeRef.current = 0;
      setLevel(levelIndex + 1);
      setActiveBuffs([]);
      resetCombo();

      if (resetProgress) {
        scoreRef.current = 0;
        livesRef.current = START_LIVES;
        setScore(0);
        setLives(START_LIVES);
      }
    },
    [resetCombo]
  );

  const tick = useCallback(
    (time: number) => {
      const frameScale = lastTimeRef.current
        ? Math.min((time - lastTimeRef.current) / (1000 / 60), MAX_FRAME_SCALE)
        : 1;
      const dtMs = frameScale * (1000 / 60);
      lastTimeRef.current = time;

      updatePaddle(frameScale, time);
      syncActiveBuffs(time);
      updatePowerUps(frameScale);
      updateParticles(dtMs);
      updateBalls(frameScale, time);

      if (ballsRef.current.length === 0) {
        loseLife();
        if (livesRef.current <= 0) {
          draw(time);
          return; // partie terminée : on arrête vraiment la boucle
        }
      }

      if (bricksRef.current.every((b) => !b.alive)) {
        stopLoop();
        if (levelIndexRef.current < LEVELS.length - 1) {
          changePhase("levelup");
          playTone(523, 100, "square", 0.04);
          playTone(659, 100, "square", 0.04, 100);
          playTone(784, 160, "square", 0.04, 200);
        } else {
          changePhase("won");
          saveBest();
          playTone(523, 100, "square", 0.04);
          playTone(659, 100, "square", 0.04, 100);
          playTone(784, 100, "square", 0.04, 200);
          playTone(1046, 220, "square", 0.04, 300);
        }
        draw(time);
        return;
      }

      draw(time);
      rafRef.current = requestAnimationFrame(tick);
    },
    [changePhase, draw, loseLife, playTone, saveBest, stopLoop, syncActiveBuffs, updateBalls, updateParticles, updatePaddle, updatePowerUps]
  );

  const start = useCallback(() => {
    ensureAudio();
    startLevel(0, true);
    changePhase("playing");
    draw();
    rafRef.current = requestAnimationFrame(tick);
  }, [changePhase, draw, ensureAudio, startLevel, tick]);

  const continueToNextLevel = useCallback(() => {
    startLevel(levelIndexRef.current + 1, false);
    changePhase("playing");
    draw();
    rafRef.current = requestAnimationFrame(tick);
  }, [changePhase, draw, startLevel, tick]);

  const pause = useCallback(() => {
    if (phaseRef.current !== "playing") return;
    stopLoop();
    changePhase("paused");
  }, [changePhase, stopLoop]);

  const resume = useCallback(() => {
    if (phaseRef.current !== "paused") return;
    changePhase("playing");
    lastTimeRef.current = 0; // évite un énorme delta après la pause
    rafRef.current = requestAnimationFrame(tick);
  }, [changePhase, tick]);

  useEffect(() => () => stopLoop(), [stopLoop]);
  useEffect(() => draw(), [draw]);

  const handlePointerMove = useCallback((e: ReactPointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const scale = WIDTH / rect.width;
    const x = (e.clientX - rect.left) * scale;
    paddleXRef.current = Math.max(0, Math.min(WIDTH - paddleWidthRef.current, x - paddleWidthRef.current / 2));
  }, []);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const playing = phaseRef.current === "playing";
      if (e.key === "ArrowLeft" || e.key === "a") {
        if (playing) e.preventDefault();
        keysRef.current.left = true;
      }
      if (e.key === "ArrowRight" || e.key === "d") {
        if (playing) e.preventDefault();
        keysRef.current.right = true;
      }
      if (e.key === " ") {
        if (playing) {
          e.preventDefault();
          launchStuckBalls();
        } else if (phaseRef.current === "paused") {
          e.preventDefault();
          resume();
        }
      }
      if (e.key === "p" || e.key === "Escape") {
        if (playing) pause();
        else if (phaseRef.current === "paused") resume();
      }
    };
    const onKeyUp = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft" || e.key === "a") keysRef.current.left = false;
      if (e.key === "ArrowRight" || e.key === "d") keysRef.current.right = false;
    };
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
    };
  }, [launchStuckBalls, pause, resume]);

  // pause automatique quand l'onglet passe en arrière-plan
  useEffect(() => {
    const onVisibilityChange = () => {
      if (document.hidden) pause();
    };
    document.addEventListener("visibilitychange", onVisibilityChange);
    return () => document.removeEventListener("visibilitychange", onVisibilityChange);
  }, [pause]);

  return (
    <section id="platform" className="relative min-h-screen w-full bg-black text-white px-6 md:px-10 py-24">
      {/* en-tête de section */}
      <div className="max-w-[1280px] mx-auto mb-10">
        <h2 className="hero-title text-5xl md:text-7xl font-medium">{s.heading}</h2>
        <p className="mt-4 max-w-md text-[15px] leading-snug text-white/70">{s.intro}</p>
      </div>

      {/* zone de jeu */}
      <div className="max-w-[1280px] mx-auto">
        <div
          className="relative w-full select-none overflow-hidden rounded-3xl border border-white/10 bg-neutral-900/40"
          style={{ aspectRatio: `${WIDTH} / ${HEIGHT}` }}
        >
          {/* barre d'état */}
          <div className="pointer-events-none absolute top-4 left-5 right-5 z-20 flex items-center justify-between text-sm text-white/70">
            <span>
              {s.score} <span className="text-white font-medium">{score}</span>
              {best > 0 && <span className="ml-3 text-xs text-white/40">{s.best} {best}</span>}
            </span>
            <span className="flex items-center gap-3">
              {comboMult > 1 && (
                <span className="rounded-full bg-amber-400/20 px-3 py-1 text-xs uppercase tracking-wide text-amber-300">
                  {s.combo(comboMult)}
                </span>
              )}
              {activeBuffs.length > 0 && (
                <span className="flex gap-2 text-xs uppercase tracking-wide text-white/60">
                  {activeBuffs.map((b) => (
                    <span key={b} className="rounded-full bg-white/10 px-3 py-1">
                      {POWERUP_STYLE[b].label.toLowerCase()}
                    </span>
                  ))}
                </span>
              )}
              <span className="text-xs uppercase tracking-wide text-white/50">{s.level(level, LEVELS.length)}</span>
            </span>
            <span className="flex items-center gap-3">
              <button
                onClick={toggleSound}
                className="pointer-events-auto rounded-full bg-white/10 px-3 py-1 text-xs uppercase tracking-wide text-white/60 transition-colors hover:bg-white/20"
              >
                {soundOn ? s.soundOn : s.soundOff}
              </button>
              <span>
                {s.lives}{" "}
                <span className="text-white font-medium tracking-widest">
                  {"●".repeat(lives)}
                  {"○".repeat(Math.max(0, MAX_LIVES - lives))}
                </span>
              </span>
            </span>
          </div>

          <canvas
            ref={canvasRef}
            width={WIDTH}
            height={HEIGHT}
            onPointerMove={phase === "playing" ? handlePointerMove : undefined}
            onPointerDown={phase === "playing" ? launchStuckBalls : undefined}
            className={`absolute inset-0 h-full w-full touch-none ${phase === "playing" ? "cursor-none" : ""}`}
          />

          {/* écran d'accueil */}
          {phase === "idle" && (
            <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-6 bg-black/60 backdrop-blur-sm">
              <p className="max-w-sm text-center text-sm leading-snug text-white/70">{s.idleInstructions}</p>
              <button
                onClick={start}
                className="rounded-full bg-white px-8 py-3 text-sm font-normal text-black transition-colors hover:bg-neutral-200"
              >
                {s.startGame}
              </button>
            </div>
          )}

          {/* pause */}
          {phase === "paused" && (
            <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-4 bg-neutral-950/50 backdrop-blur-sm">
              <p className="hero-title text-4xl font-medium md:text-6xl">{s.paused}</p>
              <p className="text-sm text-white/70">
                {s.score} <span className="text-white">{score}</span>
              </p>
              <button
                onClick={resume}
                className="mt-2 rounded-full bg-white px-8 py-3 text-sm font-normal text-black transition-colors hover:bg-neutral-200"
              >
                {s.resume}
              </button>
            </div>
          )}

          {/* transition de niveau */}
          {phase === "levelup" && (
            <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-4 bg-neutral-950/50 backdrop-blur-sm">
              <p className="hero-title text-4xl font-medium md:text-6xl">{s.levelCleared(level)}</p>
              <p className="text-sm text-white/70">
                {s.score} <span className="text-white">{score}</span>
              </p>
              <button
                onClick={continueToNextLevel}
                className="mt-2 rounded-full bg-white px-8 py-3 text-sm font-normal text-black transition-colors hover:bg-neutral-200"
              >
                {s.startLevel(level + 1)}
              </button>
            </div>
          )}

          {/* écran de fin */}
          {phase === "over" && (
            <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-4 bg-neutral-950/50 backdrop-blur-sm">
              <p className="hero-title text-4xl font-medium md:text-6xl">{s.gameOver}</p>
              <p className="text-sm text-white/70">
                {s.score} <span className="text-white">{score}</span> ·{" "}
                {s.best} <span className="text-white">{Math.max(best, score)}</span>
              </p>
              <button
                onClick={start}
                className="mt-2 rounded-full bg-white px-8 py-3 text-sm font-normal text-black transition-colors hover:bg-neutral-200"
              >
                {s.playAgain}
              </button>
            </div>
          )}

          {/* victoire */}
          {phase === "won" && (
            <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-4 bg-neutral-950/50 backdrop-blur-sm">
              <p className="hero-title text-4xl font-medium md:text-6xl">{s.allClear}</p>
              <p className="text-sm text-white/70">
                {s.allClearedSummary} · {s.score} <span className="text-white">{score}</span> ·{" "}
                {s.best} <span className="text-white">{Math.max(best, score)}</span>
              </p>
              <button
                onClick={start}
                className="mt-2 rounded-full bg-white px-8 py-3 text-sm font-normal text-black transition-colors hover:bg-neutral-200"
              >
                {s.playAgain}
              </button>
            </div>
          )}
        </div>

        <p className="mt-4 text-xs text-white/40">{s.bottomHint}</p>
      </div>
    </section>
  );
}
