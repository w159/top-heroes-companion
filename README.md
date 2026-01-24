# Top Heroes Companion v2.0

![Top Heroes Companion logo](assets/logo.svg)

**AI-Powered Guild Operations Kit for TBB (The Blue Boots)**

![Stylized cartoon blue workboots for The Blue Boots guild](assets/blue-boots.jpeg)

Top Heroes Companion is an intelligent tactical companion app for the **TBB guild - The Blue Boots**. Now featuring **RAG-powered chat assistance**, **automatic content updates**, and **purchase ROI analytics** to help commanders optimize progression and make data-driven spending decisions.

## What it does

### Core Features
- **Dashboard insights**: Total power, roster status, faction breakdown, and active code alerts
- **Hero database**: Filter by faction, role, rarity, and tier; add heroes to your roster in one click
- **Roster management**: Track levels, stars, and upgrades with quick edit tools
- **Queue builder**: Configure five marches with heroes, pets, relics, and skins while avoiding duplicates
- **Event playbooks**: Weekly event phases, prep checklists, and strategy notes
- **Gift codes**: Track active/expired codes and mark redeemed rewards

### New in v2.0 ✨

#### 🤖 RAG-Powered Chat Assistant
- **Semantic search** over comprehensive game knowledge base
- **Context-aware responses** for heroes, teams, gear, strategies
- **Source citations** for every answer
- **Lightweight TF-IDF indexing** (no heavy dependencies)
- Ask anything: "Best Nature team?", "How does awakening work?", "F2P tips?"

#### 📊 Purchase Tracking & ROI Analytics
- **Track all in-game purchases** (diamonds, battle pass, offers, subscriptions)
- **Spending analytics**: Total spent, purchase count, average spend, monthly trends
- **ROI calculation**: Power gained per dollar, time saved vs F2P
- **Smart recommendations** based on your spending profile
- **Spend efficiency metrics** to optimize your budget

#### 🔄 Automatic Content Updates
- **Versioning system** for heroes, events, pets, relics, skins, and codes
- **Freshness tracking** with staleness detection (7-day threshold)
- **Update history** with changelog
- **Automatic checks** every 24 hours
- Visual indicators for outdated content

#### 🏗️ Clean Architecture
- **Separation of concerns**: Domain → Application → Infrastructure → Presentation
- **Dependency injection** via ServiceContainer
- **Testable**: All services use interfaces
- **Maintainable**: SOLID principles throughout
- **Optimized**: Still under 75KB gzipped

### Local-First & Privacy
- **All data stored in browser** localStorage
- **No backend required** - works completely offline
- **Export/Import**: Full data portability
- **Your data never leaves your device**

## How it works

![Data flow diagram for the Top Heroes Companion app](assets/app-diagram.svg)

## Built for TBB (The Blue Boots)

This app is crafted for **TBB** to coordinate upgrades, align queue strategies, and share event prep across guildmates. The visual language and emblem reflect the Blue Boots identity.

## Tech stack

### Frontend
- **React 19** + TypeScript
- **Vite** for lightning-fast dev/build
- **React Router** for navigation
- **Recharts** for dashboard visuals
- **Lucide icons** for beautiful UI

### Architecture (v2.0)
- **Clean Architecture** (Domain → Application → Infrastructure → Presentation)
- **Dependency Injection** via ServiceContainer
- **TF-IDF RAG** for semantic search (browser-based, no heavy dependencies)
- **Strategic Optimization** engines for events and hero upgrades
- **LocalStorage** with in-memory caching (5min TTL)

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

## Usage Guide

### Chat Assistant
1. Click the floating chat button (bottom right)
2. Ask questions about heroes, teams, gear, strategies
3. Get instant, accurate answers with source citations
4. Examples:
   - "What's the best Nature team composition?"
   - "How does awakening work?"
   - "F2P tips for early game?"
   - "Which gear for Pyromancer?"

### Purchase Tracking
1. Navigate to **Settings → Purchase Tracking**
2. Click **Record Purchase**
3. Fill in purchase details (type, name, cost)
4. View spending analytics and ROI automatically
5. Get personalized recommendations

### Content Updates
1. Navigate to **Settings → Content Updates**
2. View content freshness (days since last update)
3. Click **Check for Updates** to refresh
4. Stale content (7+ days) is highlighted

### Data Management
1. Navigate to **Settings → General**
2. **Export Data**: Download JSON backup
3. **Import Data**: Restore from backup file
4. Use for transferring data between devices

## Architecture

See [ARCHITECTURE.md](./ARCHITECTURE.md) for detailed documentation on:
- Clean architecture layers
- Service container and dependency injection
- RAG implementation details
- Purchase tracking system
- Content update mechanism
- Performance optimizations

## Environment

No API keys required! The app works completely offline with:
- **Local RAG**: TF-IDF indexing in browser
- **Local storage**: All data in localStorage
- **No backend**: Pure client-side application

## Data & privacy

All data lives in **localStorage** on your device:
- Roster data, queues, and settings
- Purchase history and analytics
- RAG index and content cache
- Content version metadata

**Privacy features:**
- No tracking or analytics
- No external API calls
- No data leaves your device
- Full export/import control
