import { useEffect, useRef } from "react";
import Navbar from "../components/Navbar";
import useDocumentTitle from "../hooks/useDocumentTitle";
import { useLanguage } from "../i18n/LanguageContext";

/* ------------------------------------------------------------------ */
/* page « VFX » : petit labo d'effets visuels temps réel, codés à la    */
/* main en Canvas 2D (aucune librairie). Chaque effet réagit à la       */
/* souris ou au doigt, et ne tourne que quand il est visible à l'écran  */
/* (économie de batterie). Mouvement réduit : une seule image fixe.     */
/* ------------------------------------------------------------------ */

const STRINGS = {
  fr: {
    pageTitle: "VFX | Benjamin Morel",
    title: "VFX",
    intro:
      "un petit labo d'effets visuels en temps réel, codés à la main en JavaScript (Canvas, sans librairie). bouge la souris ou ton doigt dessus.",
    hint: "touche / survole",
    effects: [
      { name: "particules", text: "un nuage de particules attiré par ton curseur ; maintiens appuyé pour les repousser." },
      { name: "champ de flux", text: "des milliers de traits qui suivent des courants invisibles ; touche pour changer le courant." },
      { name: "ondes", text: "une surface d'eau simulée : chaque toucher crée une onde qui se propage et rebondit." },
      { name: "hyperespace", text: "un champ d'étoiles ; maintiens appuyé pour passer en vitesse lumière." },
      { name: "texte en particules", text: "le mot est fait de particules qui s'écartent quand tu passes dessus, puis reviennent." },
    ],
  },
  en: {
    pageTitle: "VFX | Benjamin Morel",
    title: "VFX",
    intro:
      "a small lab of real-time visual effects, hand-coded in JavaScript (Canvas, no library). move your mouse or finger over them.",
    hint: "touch / hover",
    effects: [
      { name: "particles", text: "a cloud of particles pulled toward your cursor; hold down to push them away." },
      { name: "flow field", text: "thousands of strokes following invisible currents; tap to change the current." },
      { name: "ripples", text: "a simulated water surface: every touch creates a wave that spreads and bounces." },
      { name: "hyperspace", text: "a starfield; hold down to jump to light speed." },
      { name: "particle text", text: "the word is made of particles that scatter when you pass over it, then come back." },
    ],
  },
} as const;

/* ---------- boucle canvas commune ---------- */

type Pointer = { x: number; y: number; inside: boolean; down: boolean; clicks: number };
type Frame = (ctx: CanvasRenderingContext2D, w: number, h: number, dt: number, p: Pointer) => void;
type Setup = (w: number, h: number) => Frame;

const reducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function useCanvasEffect(setup: Setup) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = 0;
    let h = 0;
    let frame: Frame = () => {};
    const resize = () => {
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      frame = setup(w, h);
    };
    resize();

    const p: Pointer = { x: w / 2, y: h / 2, inside: false, down: false, clicks: 0 };
    const pos = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      p.x = e.clientX - r.left;
      p.y = e.clientY - r.top;
    };
    const onMove = (e: PointerEvent) => {
      pos(e);
      p.inside = true;
    };
    const onDown = (e: PointerEvent) => {
      pos(e);
      p.inside = true;
      p.down = true;
      p.clicks += 1;
    };
    const onUp = () => {
      p.down = false;
    };
    const onLeave = (e: PointerEvent) => {
      if (e.pointerType === "mouse") p.inside = false;
      p.down = false;
    };
    canvas.addEventListener("pointermove", onMove);
    canvas.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    canvas.addEventListener("pointerleave", onLeave);
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    // mouvement réduit : une seule image
    if (reducedMotion()) {
      for (let i = 0; i < 60; i++) frame(ctx, w, h, 1, p);
      return () => ro.disconnect();
    }

    // ne tourne que quand l'effet est visible
    let raf = 0;
    let visible = false;
    let last = performance.now();
    const loop = (now: number) => {
      const dt = Math.min(3, (now - last) / 16.67);
      last = now;
      frame(ctx, w, h, dt, p);
      raf = requestAnimationFrame(loop);
    };
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !visible) {
        visible = true;
        last = performance.now();
        raf = requestAnimationFrame(loop);
      } else if (!entry.isIntersecting && visible) {
        visible = false;
        cancelAnimationFrame(raf);
      }
    });
    io.observe(canvas);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      canvas.removeEventListener("pointerleave", onLeave);
    };
  }, [setup]);

  return ref;
}

/* ---------- 1. particules ---------- */

const particlesSetup: Setup = (w, h) => {
  const n = Math.round(Math.min(1400, (w * h) / 220));
  const pts = Array.from({ length: n }, () => ({
    x: Math.random() * w,
    y: Math.random() * h,
    vx: 0,
    vy: 0,
    hue: 200 + Math.random() * 120,
  }));
  return (ctx, w, h, dt, p) => {
    ctx.fillStyle = "rgba(5,6,12,0.22)";
    ctx.fillRect(0, 0, w, h);
    const tx = p.inside ? p.x : w / 2 + Math.cos(performance.now() / 1400) * w * 0.25;
    const ty = p.inside ? p.y : h / 2 + Math.sin(performance.now() / 1100) * h * 0.25;
    const push = p.down ? -1.8 : 1;
    for (const q of pts) {
      const dx = tx - q.x;
      const dy = ty - q.y;
      const d2 = dx * dx + dy * dy + 400;
      const f = (push * 900) / d2;
      q.vx = (q.vx + dx * f * 0.02 * dt) * 0.96;
      q.vy = (q.vy + dy * f * 0.02 * dt) * 0.96;
      q.x += q.vx * dt;
      q.y += q.vy * dt;
      if (q.x < 0 || q.x > w) q.vx *= -1;
      if (q.y < 0 || q.y > h) q.vy *= -1;
      const sp = Math.min(1, Math.hypot(q.vx, q.vy) / 6);
      ctx.fillStyle = `hsla(${q.hue + sp * 60}, 90%, ${55 + sp * 25}%, 0.9)`;
      ctx.fillRect(q.x, q.y, 1.6 + sp * 1.4, 1.6 + sp * 1.4);
    }
  };
};

/* ---------- 2. champ de flux ---------- */

const flowSetup: Setup = (w, h) => {
  const n = Math.round(Math.min(1800, (w * h) / 160));
  let seed = Math.random() * 1000;
  let lastClicks = 0;
  const pts = Array.from({ length: n }, () => ({ x: Math.random() * w, y: Math.random() * h, life: Math.random() * 200 }));
  const angle = (x: number, y: number, t: number) =>
    Math.sin(x * 0.006 + seed) * 2.1 + Math.cos(y * 0.007 - seed * 0.7) * 1.9 + Math.sin((x + y) * 0.003 + t * 0.0002) * 1.3;
  let first = true;
  return (ctx, w, h, dt, p) => {
    if (first || p.clicks !== lastClicks) {
      lastClicks = p.clicks;
      seed = Math.random() * 1000;
      ctx.fillStyle = "#05060c";
      ctx.fillRect(0, 0, w, h);
      first = false;
    }
    ctx.fillStyle = "rgba(5,6,12,0.035)";
    ctx.fillRect(0, 0, w, h);
    const t = performance.now();
    ctx.lineWidth = 1;
    for (const q of pts) {
      const a = angle(q.x, q.y, t);
      const nx = q.x + Math.cos(a) * 1.4 * dt;
      const ny = q.y + Math.sin(a) * 1.4 * dt;
      const hue = (a * 40 + 200 + t * 0.01) % 360;
      ctx.strokeStyle = `hsla(${hue}, 85%, 62%, 0.35)`;
      ctx.beginPath();
      ctx.moveTo(q.x, q.y);
      ctx.lineTo(nx, ny);
      ctx.stroke();
      q.x = nx;
      q.y = ny;
      q.life -= dt;
      if (q.life < 0 || q.x < 0 || q.x > w || q.y < 0 || q.y > h) {
        q.x = Math.random() * w;
        q.y = Math.random() * h;
        q.life = 80 + Math.random() * 200;
      }
    }
  };
};

/* ---------- 3. ondes (simulation d'eau à 2 tampons) ---------- */

const rippleSetup: Setup = (w, h) => {
  const scale = 4;
  const cols = Math.max(2, Math.ceil(w / scale));
  const rows = Math.max(2, Math.ceil(h / scale));
  let cur = new Float32Array(cols * rows);
  let prev = new Float32Array(cols * rows);
  const img = new ImageData(cols, rows);
  const off = document.createElement("canvas");
  off.width = cols;
  off.height = rows;
  const offCtx = off.getContext("2d")!;
  let lastClicks = 0;
  let lastDrop = 0;
  const drop = (x: number, y: number, power: number) => {
    const cx = Math.round(x / scale);
    const cy = Math.round(y / scale);
    for (let j = -3; j <= 3; j++)
      for (let i = -3; i <= 3; i++) {
        const xx = cx + i;
        const yy = cy + j;
        if (xx > 0 && yy > 0 && xx < cols - 1 && yy < rows - 1 && i * i + j * j <= 9) prev[yy * cols + xx] += power;
      }
  };
  return (ctx, w, h, _dt, p) => {
    const now = performance.now();
    if (p.clicks !== lastClicks) {
      lastClicks = p.clicks;
      drop(p.x, p.y, 900);
    } else if (p.inside && p.down) drop(p.x, p.y, 120);
    else if (p.inside && now - lastDrop > 60) {
      drop(p.x, p.y, 40);
      lastDrop = now;
    }
    // gouttes de pluie de temps en temps
    if (Math.random() < 0.03) drop(Math.random() * w, Math.random() * h, 400);

    for (let y = 1; y < rows - 1; y++)
      for (let x = 1; x < cols - 1; x++) {
        const i = y * cols + x;
        cur[i] = ((prev[i - 1] + prev[i + 1] + prev[i - cols] + prev[i + cols]) / 2 - cur[i]) * 0.975;
      }
    const d = img.data;
    for (let y = 1; y < rows - 1; y++)
      for (let x = 1; x < cols - 1; x++) {
        const i = y * cols + x;
        const slope = cur[i - 1] - cur[i + 1] + cur[i - cols] - cur[i + cols];
        const light = Math.max(-60, Math.min(120, slope * 0.6));
        const o = i * 4;
        d[o] = 10 + light * 0.6;
        d[o + 1] = 40 + y * (90 / rows) + light;
        d[o + 2] = 90 + y * (100 / rows) + light * 1.2;
        d[o + 3] = 255;
      }
    offCtx.putImageData(img, 0, 0);
    ctx.imageSmoothingEnabled = true;
    ctx.drawImage(off, 0, 0, w, h);
    const tmp = prev;
    prev = cur;
    cur = tmp;
  };
};

/* ---------- 4. hyperespace ---------- */

const warpSetup: Setup = (w, h) => {
  const stars = Array.from({ length: 700 }, () => ({ x: (Math.random() - 0.5) * w * 2, y: (Math.random() - 0.5) * h * 2, z: Math.random() * w }));
  let speed = 2;
  return (ctx, w, h, dt, p) => {
    speed += ((p.down ? 38 : 2.5) - speed) * 0.06 * dt;
    const streak = Math.min(1, speed / 38);
    ctx.fillStyle = `rgba(2,3,10,${0.55 - streak * 0.35})`;
    ctx.fillRect(0, 0, w, h);
    const cx = p.inside ? w / 2 + (p.x - w / 2) * 0.25 : w / 2;
    const cy = p.inside ? h / 2 + (p.y - h / 2) * 0.25 : h / 2;
    for (const s of stars) {
      const pz = s.z;
      s.z -= speed * dt;
      if (s.z < 1) {
        s.x = (Math.random() - 0.5) * w * 2;
        s.y = (Math.random() - 0.5) * h * 2;
        s.z = w;
        continue;
      }
      const k = 160 / s.z;
      const pk = 160 / pz;
      const x = cx + s.x * k;
      const y = cy + s.y * k;
      const px = cx + s.x * pk;
      const py = cy + s.y * pk;
      const b = Math.min(1, 1.2 - s.z / w);
      ctx.strokeStyle = `rgba(${180 + streak * 75},${200 + streak * 40},255,${b})`;
      ctx.lineWidth = Math.max(0.6, 2.2 * b);
      ctx.beginPath();
      ctx.moveTo(px, py);
      ctx.lineTo(x, y);
      ctx.stroke();
    }
  };
};

/* ---------- 5. texte en particules ---------- */

const textSetup: Setup = (w, h) => {
  const off = document.createElement("canvas");
  off.width = Math.max(1, Math.round(w));
  off.height = Math.max(1, Math.round(h));
  const o = off.getContext("2d")!;
  o.fillStyle = "#fff";
  o.textAlign = "center";
  o.textBaseline = "middle";
  o.font = `800 ${Math.min(h * 0.75, w * 0.38)}px "Readex Pro", system-ui, sans-serif`;
  o.fillText("VFX", w / 2, h / 2);
  const data = o.getImageData(0, 0, off.width, off.height).data;
  const step = Math.max(4, Math.round(Math.min(w, h) / 70));
  const pts: { x: number; y: number; hx: number; hy: number; vx: number; vy: number }[] = [];
  for (let y = 0; y < off.height; y += step)
    for (let x = 0; x < off.width; x += step)
      if (data[(y * off.width + x) * 4 + 3] > 128) pts.push({ x: Math.random() * w, y: Math.random() * h, hx: x, hy: y, vx: 0, vy: 0 });
  return (ctx, w, h, dt, p) => {
    ctx.fillStyle = "rgba(5,6,12,0.35)";
    ctx.fillRect(0, 0, w, h);
    const radius = Math.min(w, h) * (p.down ? 0.35 : 0.18);
    for (const q of pts) {
      q.vx += (q.hx - q.x) * 0.012 * dt;
      q.vy += (q.hy - q.y) * 0.012 * dt;
      if (p.inside) {
        const dx = q.x - p.x;
        const dy = q.y - p.y;
        const d = Math.hypot(dx, dy);
        if (d < radius && d > 0.1) {
          const f = ((radius - d) / radius) * 3.2;
          q.vx += (dx / d) * f * dt;
          q.vy += (dy / d) * f * dt;
        }
      }
      q.vx *= 0.86;
      q.vy *= 0.86;
      q.x += q.vx * dt;
      q.y += q.vy * dt;
      const away = Math.min(1, Math.hypot(q.x - q.hx, q.y - q.hy) / 60);
      ctx.fillStyle = `hsl(${30 + away * 300}, 95%, ${70 - away * 15}%)`;
      ctx.fillRect(q.x - 1.2, q.y - 1.2, step * 0.55, step * 0.55);
    }
  };
};

const SETUPS: Setup[] = [particlesSetup, flowSetup, rippleSetup, warpSetup, textSetup];

/* ---------- carte d'un effet ---------- */

const EffectCard = ({ setup, index, name, text, hint }: { setup: Setup; index: number; name: string; text: string; hint: string }) => {
  const ref = useCanvasEffect(setup);
  return (
    <figure className={index === 0 ? "md:col-span-2" : ""}>
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#05060c]">
        <canvas
          ref={ref}
          className={`block w-full touch-none select-none ${index === 0 ? "h-[62vh] min-h-[360px]" : "h-[46vh] min-h-[300px]"}`}
          aria-label={`${name} — ${text}`}
        />
        <span className="pointer-events-none absolute left-4 top-4 rounded-full bg-black/40 px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-white/70 backdrop-blur">
          {String(index + 1).padStart(2, "0")} · {hint}
        </span>
      </div>
      <figcaption className="mt-3 px-1">
        <p className="text-lg font-medium text-white">{name}</p>
        <p className="mt-1 text-sm text-white/55">{text}</p>
      </figcaption>
    </figure>
  );
};

const Vfx = () => {
  const { lang } = useLanguage();
  const s = STRINGS[lang];
  useDocumentTitle(s.pageTitle);

  return (
    <section className="min-h-screen w-full bg-black text-white">
      <Navbar />
      <div className="mx-auto max-w-[1280px] px-6 md:px-10 pt-32 md:pt-40 pb-24">
        <h1 className="hero-title text-[22vw] md:text-[12vw] font-medium leading-none">{s.title}</h1>
        <p className="mt-6 max-w-xl text-base md:text-lg leading-relaxed text-white/70">{s.intro}</p>
        <div className="mt-14 grid gap-10 md:grid-cols-2">
          {s.effects.map((e, i) => (
            <EffectCard key={e.name} setup={SETUPS[i]} index={i} name={e.name} text={e.text} hint={s.hint} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Vfx;
