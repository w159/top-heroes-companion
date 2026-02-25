# Data Completeness Audit - February 2026

## Summary
Complete rewrite of `src/shared/types/constants.ts` and role icon fixes across hero components.

## Changes Made

### constants.ts - Complete Rewrite
- **HEROES**: 67 entries (many fabricated) → 50 real game heroes aligned with heroes.json
- **PETS**: empty [] → 11 pets (3 Uncommon, 8 Rare)
- **RELICS**: empty [] → 14 relics (9 faction-specific, 5 universal)
- **SKINS**: empty [] → 8 skins (4 Castle, 4 March)
- **EVENTS**: 11 → 16 events (added Guild Race, Frostfield Battle, Mine Vein Battle, Citadel Clash, Guild Rush)
- **GIFT_CODES**: 2 → 32 codes (26 active, 6 expired)

### Bug Fixes
- Guard hero: Fixed faction from League → Horde (matching heroes.json)
- Heroes.tsx getRoleIcon: Added Damage Dealer, Supporter, Controller, Healer mappings
- HeroCard.tsx getRoleIcon: Added Damage Dealer → Sword, Supporter → Heart mappings

### Key Data Architecture
- **heroes.json** = source of truth (50 heroes, uses roles: Damage Dealer, Supporter, Controller, Healer, Tank, Support)
- **constants.ts** = enriched data for app features (uses roles: DPS, Support, Controller, Healer, Tank)
- **HeroDetail.tsx** normalizes roles when recruiting: Damage Dealer→DPS, Supporter→Support
- Heroes page reads from heroes.json directly, other features (events, pets, relics, skins) from constants.ts

### Removed Fabricated Heroes
Valkyrie, Saint, Astro-Hunter, Grand Master, Royal Knight, Wild Girl, Night Blade, Demon King, Rose Agent, Ent Elder, Bloodlust Bear, Blade Master, Reaper, Voodoo Doctor, Beast Tamer, Bone Breaker, Goblin Rogue, Ogre Brute, Troll Priest, plus ~20 more
