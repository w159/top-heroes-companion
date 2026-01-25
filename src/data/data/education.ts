
export interface EducationModule {
  id: string;
  title: string;
  category: 'Basics' | 'Strategy' | 'Events' | 'Advanced';
  difficulty: 'Beginner' | 'Intermediate' | 'Expert';
  readTimeMinutes: number;
  content: string;
  tags: string[];
}

export const EDUCATION_MODULES: EducationModule[] = [
  {
    id: 'basics-resource-management',
    title: 'Resource Management 101',
    category: 'Basics',
    difficulty: 'Beginner',
    readTimeMinutes: 3,
    content: `
# Resource Management Basics

## The Golden Rule
Never spend resources just because you have them. Always save for events.

## Key Resources
- **Diamonds**: The premium currency. Save for Arms Race and key events.
- **Speedups**: Use these to complete research or building upgrades specifically during scoring events.
- **Stamina**: Regenerates over time. Don't let it cap out. Use it for rallies and map farming.

## Storage Protection
Resources in your bag are safe. Resources in your warehouse can be plundered if you are attacked (beyond your warehouse protection limit). Keep resources in item form until you need to spend them.
    `,
    tags: ['resources', 'diamonds', 'speedups'],
  },
  {
    id: 'strategy-hero-synergy',
    title: 'Hero Synergy & Faction Auras',
    category: 'Strategy',
    difficulty: 'Intermediate',
    readTimeMinutes: 5,
    content: `
# Hero Synergy

## Faction Auras
Deploying heroes of the same faction grants stat bonuses to your entire team.
- **3 Heroes**: +10% HP & ATK
- **4 Heroes**: +15% HP & ATK
- **5 Heroes**: +20% HP & ATK
- **6 Heroes**: +25% HP & ATK

## Role Composition
A balanced team typically needs:
- **1-2 Tanks**: Frontline damage absorption.
- **1-2 Supports**: Healers or buffers.
- **2-3 DPS**: Damage dealers (AoE or Single Target).

## Counter-Picking
- **Nature** counters **Water**
- **Water** counters **Fire**
- **Fire** counters **Nature**
    `,
    tags: ['heroes', 'combat', 'factions'],
  },
  {
    id: 'events-arms-race',
    title: 'Mastering the Arms Race',
    category: 'Events',
    difficulty: 'Intermediate',
    readTimeMinutes: 4,
    content: `
# Arms Race Guide

The Arms Race is a rotating daily event that rewards specific actions.

## Schedule (Rotates every 4 hours)
1. **Train Soldiers**
2. **Hero Consumption** (Shards/Skill Books)
3. **City Building** (Construction/Research)
4. **Kill Monsters**
5. **Gather Resources**

## Strategy
- **Sync**: Align your daily activities with the active Arms Race phase.
- **Double Dip**: Try to complete "Daily Tasks" that overlap with the current Arms Race.
- **Hoard**: Save speedups and resources for their respective phases.
    `,
    tags: ['events', 'arms race', 'schedule'],
  },
  {
    id: 'advanced-server-meta',
    title: 'Server Meta Analysis',
    category: 'Advanced',
    difficulty: 'Expert',
    readTimeMinutes: 6,
    content: `
# Server Meta Analysis

## Early Game (Days 1-30)
- **Focus**: Castle Level, Research Speed, Gathering.
- **Combat**: Tier 1-3 troops are disposable. Focus on hero levels.
- **Spending**: High value on "Second Builder" and "Monthly Cards".

## Mid Game (Days 31-90)
- **Focus**: Tier 4 troops, specific Hero sets (Legendary/Mythic).
- **Combat**: Guild wars become frequent. Participation is key.
- **Spending**: Focus on specific hero shards and gear materials.

## Late Game (Day 90+)
- **Focus**: Min-maxing stats, Awakening heroes, high-tier Gear (40+).
- **Combat**: Server vs Server (KvK). Coordination is mandatory.
- **Spending**: Very targeted spending on event-exclusive items.
    `,
    tags: ['meta', 'server', 'progression'],
  },
];
