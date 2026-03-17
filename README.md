# Commute Speedrun Livesplit

A speedrun-inspired commute tracker that logs splits, compares pace vs PB, and saves history locally. Built with React + TypeScript, Vite, Tailwind v4, Motion (Framer Motion), and GSAP.

## Stack
- React + TypeScript (Vite)
- Tailwind v4 + CSS variables
- Motion (Framer Motion) + GSAP
- LocalStorage persistence (offline-first)

## Run locally
```bash
npm install
npm run dev
```

## Build
```bash
npm run build
npm run preview
```

## Notes
- Data is stored in `localStorage` under `commute-speedrun-history-v1`.
- Use Export/Import to move runs between devices.
