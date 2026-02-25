/**
 * Core Player State & Resource Types
 */

import { Faction, Rarity, SpendProfile } from '../shared/types/types';

// ============================================================================
// CORE STRATEGIC TYPES
// ============================================================================

export interface PlayerState {
  userId: string;
  server: string;
  powerLevel: number;
  castleLevel: number;
  spendProfile: SpendProfile;
  vipLevel: number;
  daysSinceStart: number;

  // Resources
  resources: Resources;

  // Heroes
  ownedHeroes: UserHero[];
  focusedHeroes: string[]; // Hero IDs player is prioritizing

  // Progress
  campaignProgress: number; // Max chapter completed
  towerProgress: Record<Faction, number>;
  behemothLevel: number;

  // Metadata
  lastUpdated: Date;
  goals: ProgressionGoals;
}

export interface Resources {
  gold: number;
  gems: number;

  // Hero Resources
  heroShards: Record<string, number>; // heroId -> count
  soulStones: number;
  ascensionStones: Record<Rarity, number>;

  // Enhancement Resources
  skillBooks: number;
  traitStones: number;
  experienceBottles: number;

  // Equipment
  equipmentChests?: Record<string, number>;
  enhancementMaterials?: Record<string, number>;
  equipmentMaterials?: Record<string, number>;
  enchantmentScrolls?: number;
  refreshTickets?: number;

  // Pets & Relics
  petEssence?: number;
  relicFragments?: number;

  // Event Resources
  eventTokens?: Record<string, number>;

  // Time-based
  dailyTasksCompleted?: number;
  weeklyTasksCompleted?: number;
}

export interface UserHero {
  heroId: string;
  level: number;
  stars: number; // 0-5
  awakening: number; // 0-5
  skillLevels: number[]; // [ult, active1, active2, passive1, ...]
  traitLevels: number[]; // [trait1, trait2, trait3, trait4]
  power: number;
  equipment: Equipment[];
  isOwned: boolean;
  faction?: Faction;
}

export interface Equipment {
  slot: 'weapon' | 'armor' | 'accessory' | 'boots';
  tier: number;
  enhancement: number;
  quality: Rarity;
}

export interface ProgressionGoals {
  primary: Goal;
  secondary: Goal[];
  timeframe: number; // days
  priorities: Priority[];
}

export interface Goal {
  type: 'power' | 'campaign' | 'pvp_rank' | 'event_rank' | 'collection';
  target: number | string;
  deadline?: Date;
  importance: number; // 1-10
}

export interface Priority {
  category: 'heroes' | 'equipment' | 'pets' | 'relics' | 'research';
  weight: number; // 0-1
}
