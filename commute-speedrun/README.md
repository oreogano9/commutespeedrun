# AeroScope FCO Tracker

Airport business + flight data tracker focused on Fiumicino (FCO/LIRF). Built with React + TypeScript, Vite, Tailwind v4, Motion, and GSAP.

## Stack
- React + TypeScript (Vite)
- Tailwind v4 + CSS variables
- Motion (Framer Motion) + GSAP
- Netlify Functions proxy (for live FCO data)

## Run locally
```bash
npm install
npm run dev
```

The app defaults to demo mode (preloaded FCO-style flights).

## Live FCO data (recommended)
This project ships with a Netlify Function that calls the AeroDataBox API through API.Market and normalizes the response for the UI.

### 1) Get an API key
Sign up for AeroDataBox via API.Market and obtain an `x-magicapi-key`.

### 2) Set environment variables
In Netlify (or your hosting env):
- `AERODATABOX_API_KEY` = your API key

In the Vite build environment:
- `VITE_FLIGHT_MODE=live`
- `VITE_FLIGHT_API_BASE=/api/fco-flights`

### 3) Deploy to Netlify
Netlify will pick up:
- `netlify/functions/fco-flights.js`
- `netlify.toml`

The function returns normalized flights for FCO (ICAO: LIRF). The UI pulls from `/api/fco-flights` automatically.

## API adapter details
The function calls:
- `GET https://prod.api.market/api/v1/aedbx/aerodatabox/flights/airports/icao/LIRF`

Query params used:
- `direction=Arrival|Departure`
- `offsetMinutes=-120`
- `durationMinutes=720`
- `withLeg=true`

## Customization
- Demo data: `src/data/demoFlights.ts`
- Dashboard UI: `src/App.tsx`
- Theme tokens: `src/index.css`

## Build
```bash
npm run build
npm run preview
```
