# Ngo Bao Minh — Portfolio (v2)

A full rebuild of the original static site as a React 19 + Vite + Tailwind CSS
+ Framer Motion single-page application. Every page, link, project entry,
device spec, social link, and the live VALORANT stats integration from the
original site are preserved — only the design and tech stack changed.

## Stack

- React 19 + Vite 6
- Tailwind CSS 3
- Framer Motion (page transitions, scroll reveals, magnetic buttons, animated nav)
- Lucide React icons
- React Router (`HashRouter`, so it deploys cleanly to GitHub Pages with no server config)

## Getting started

```bash
npm install
npm run dev       # local dev server
npm run build      # production build → dist/
npm run preview    # preview the production build locally
```

## Project structure

```
src/
 ├── assets/            portrait + site icon
 ├── components/
 │    ├── ui/            Card, RrRing, MatchRow, BrandIcon, buttons, etc.
 │    ├── layout/         Layout shell, Footer
 │    ├── background/    AuroraBackground (reactive global background)
 │    ├── navigation/     Navbar
 │    └── animations/    Reveal / Stagger / PageTransition helpers
 ├── pages/               Home, Devices, Socials, Projects, ValorantStats, NotFound
 ├── hooks/                usePointerField, useValorantStats
 ├── contexts/            ThemeContext (light/dark, persisted to localStorage)
 ├── utils/                valorant.js — ported 1:1 data/parsing logic
 ├── styles/               index.css — theme tokens (CSS variables) for both themes
 ├── App.jsx
 └── main.jsx
```

## VALORANT Stats — unchanged business logic

`src/utils/valorant.js` is a direct port of the original `script.js` fetch
and parsing logic: same HenrikDev + Valorant-API endpoints, same request
order (`Promise.all` for account/mmr/matches/mmr-history, then competitive
tiers/agents/maps, then a conditional player-card fetch), same fallback
chains for rank names, tier numbers, RR, and match stats. Only the DOM
writing was replaced with React state via the `useValorantStats` hook —
nothing about what is requested or how responses are parsed has changed.

## Deploying to GitHub Pages

This project uses `HashRouter`, so no extra server rewrite rules are needed.

1. `npm run build`
2. Push the contents of `dist/` to the `gh-pages` branch (or your Pages
   source branch/folder) of `nbminh3908.github.io`.
3. Done — routes like `#/devices` and `#/valorant-stats` work out of the box.

If you'd rather have clean URLs (`/devices` instead of `/#/devices`), switch
to `BrowserRouter` in `src/main.jsx` and add a `404.html` that redirects to
`index.html` (the standard GitHub Pages SPA trick).
