# CLAUDE.md — sitepro

Personal site of Benjamin Morel (student, Université Paris Cité). Talk to the user in **French**. Full project recap: `RESUME.md`.

## Commands
- `npm run dev` — local dev server (Vite, http://localhost:5173, next free port if taken)
- `npm run build` — `tsc -b && vite build` (must pass before publishing)
- `npx tsc -p tsconfig.app.json --noEmit` — quick type-check

## Publishing
- Push to `origin/main` → GitHub Actions (`.github/workflows/deploy.yml`) deploys to GitHub Pages: https://benjaminmorel1.github.io/sitepro/
- The local `main` branch is stale; the working branch is `maj-lectures-contact`. Publish with `git push origin HEAD:main` after checking it is a fast-forward of `origin/main`.
- Only publish when the user asks ("en ligne"). Never commit `public/lyrics/` or `music-masquee/doubt/` (protected lyrics, local only).

## Stack and conventions
- React 19 + TypeScript + Vite 8 + Tailwind 3, `motion` for animations, Lenis for smooth scroll, Flickity for the RayOnn carousel.
- `HashRouter` (GitHub Pages); routes in `src/App.tsx`. Blog, Blog2 and Lectures are commented out (hidden), keep them.
- `vite.config.ts`: `base` is `/sitepro/` for build, `/` in dev.
- Every page is bilingual: texts live in a `STRINGS = { fr, en }` object at the top of the file. Always update **both** languages.
- Dark/light theme via Tailwind `dark:` classes (`src/theme.ts`).
- Analytics: GoatCounter (index.html) + GA4 `G-B61J1J0RHB` (`src/analytics.ts`).
- Code comments are in French.

## RayOnn 2 / Mala showcase
- `src/components/AppShowcase.tsx` (section) and `src/pages/Platform.tsx` (card). Button links to `https://rayonn-541fe.web.app/` (`RAYONN_URL`).
- Screens: `src/assets/rayonn-phone-01…12.webp`, 682×1361 RGBA, iPhone frame with the screen at x 30–652, y 30–1331, radius ≈ 80, 95 px status bar, Dynamic Island at x 247–433, y 47–99. Loaded by glob in name order.
- The app source is `C:\Users\benja\rayonn2` (live version = branch `release-2.4.1`). Its `?demo` mode only works locally, not on the live URL. To redo the screens: serve that version locally, capture it with puppeteer at 390×756 @2x, then put each capture into the frame.
- Back up old screens to `C:\Users\benja\Desktop\site-backups\` before replacing them.
- The app is now named "Mala"; the site still says "RayOnn 2" (renaming not decided yet).
