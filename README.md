# Top Heroes Companion

![Top Heroes Companion logo](assets/logo.svg)

**Guild operations kit for TBB (The Blue Boots)**

![Stylized cartoon blue workboots for The Blue Boots guild](assets/blue-boots.jpeg)

Top Heroes Companion is a tactical companion app for the **TBB guild - The Blue Boots**. It helps commanders track rosters, plan queues, and prep for weekly events with a fast, visual dashboard designed around the needs of an active guild.

## What it does

- **Dashboard insights**: Total power, roster status, faction breakdown, and active code alerts.
- **Hero database**: Filter by faction, role, rarity, and tier; add heroes to your roster in one click.
- **Roster management**: Track levels, stars, and upgrades with quick edit tools.
- **Queue builder**: Configure five marches with heroes, pets, relics, and skins while avoiding duplicates.
- **Event playbooks**: Weekly event phases, prep checklists, and strategy notes.
- **Gift codes**: Track active/expired codes and mark redeemed rewards.
- **Local-first data**: All data is stored in the browser with easy export/import backups.

## How it works

![Data flow diagram for the Top Heroes Companion app](assets/app-diagram.svg)

## Built for TBB (The Blue Boots)

This app is crafted for **TBB** to coordinate upgrades, align queue strategies, and share event prep across guildmates. The visual language and emblem reflect the Blue Boots identity.

## Tech stack

- React 19 + TypeScript
- Vite for dev/build
- React Router for navigation
- Recharts for dashboard visuals
- Tailwind (CDN) + custom tokens for UI styling
- Lucide icons

## Run locally

**Prerequisites:** Node.js 18+

1. Install dependencies:
   `npm install`
2. Start the dev server:
   `npm run dev`
3. Build for production:
   `npm run build`
4. Preview the production build:
   `npm run preview`

## Environment

No API keys are required for the current feature set. If you later wire AI features, you can place keys in `.env.local` (for example `GEMINI_API_KEY`) and Vite will expose them via `process.env`.

## Data & privacy

All roster data, queues, and settings live in **localStorage** on your device. Use the Settings page to export a JSON backup or import data on another machine.
