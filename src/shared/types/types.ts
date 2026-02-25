
export type Faction = 'Nature' | 'League' | 'Horde';
export type Rarity = 'Mythic' | 'Legendary' | 'Epic' | 'Rare';
export type Role = 'Tank' | 'DPS' | 'Support' | 'Supporter' | 'Healer' | 'Controller' | 'Hybrid' | 'Damage Dealer';
export type Tier = 'S' | 'A' | 'B' | 'C' | 'D';
export type SpendProfile = 'F2P' | 'LowSpender' | 'Whale';

export interface Skill {
  name: string;
  type: 'Ultimate' | 'Active' | 'Passive';
  description: string;
}

export interface Bond {
  partnerId: string;
  bonus: string;
}

export interface HeroSkin {
  name: string;
  bonus?: string;
  imageUrl?: string;
}

export interface SpecializedWeapon {
  name: string;
  description: string;
  unlockRequirement?: string;
}

export interface ExclusiveGear {
  name: string;
  statBonus: string;
  description?: string;
}

export interface Hero {
  id: string;
  name: string;
  faction: Faction;
  rarity: Rarity;
  role: Role;
  tier?: Tier;
  image?: string;
  imageUrl?: string;
  description?: string;
  skills?: Skill[];
  gear_set?: string;
  unique_weapon?: string;
  positions?: string[];
  recommendedSets?: string[];
  bonds?: Bond[];
  skins?: HeroSkin[];
  specialWeapon?: SpecializedWeapon;
  exclusiveGear?: ExclusiveGear;
}

export interface UserHero extends Hero {
  level: number;
  stars: number;
  awakening: number;
  power: number;
  gear?: Record<string, string | number | boolean>;
  isOwned: boolean;
  notes?: string;
}

export interface Pet {
  id: string;
  name: string;
  rarity: Rarity;
  description: string;
  skillName: string;
  skillDescription: string;
  baseInfluence: number;
  imageUrl?: string;
}

export type RelicType = 'Attack' | 'Defense' | 'Assist';

export interface Relic {
  id: string;
  name: string;
  type: RelicType;
  rarity: Rarity;
  description: string;
  baseInfluence: number;
  statBonus: string;
  imageUrl?: string;
}

export interface Skin {
  id: string;
  name: string;
  type: 'Castle' | 'March';
  bonus: string;
  baseInfluence: number;
  imageUrl?: string;
}

export interface Queue {
  id: number;
  name: string;
  heroIds: (string | null)[];
  petId: string | null;
  petLevel: number;
  petStars: number;
  relics: {
      [key in RelicType]?: {
          id: string;
          level: number;
      } | null;
  };
  soldierType: 'Infantry' | 'Archer' | 'Mage' | null;
  soldierTier: number;
  castleSkinId: string | null;
  marchSkinId: string | null;
}

export type EfficiencyTier = 'S' | 'A' | 'B' | 'C';

export interface ScoringAction {
  action: string;
  points: number;
  unit?: string; // e.g., "per 1 min", "each", "per 100"
  efficiency: EfficiencyTier;
  notes?: string;
}

export interface StockpileItem {
  resource: string;
  targetAmount: string; // e.g., "50-100+"
  startSavingDays: number; // days before event
  pointsPerUnit: number;
  bestEventDay: string; // which day to use it
  alternativeEvent?: string;
  conflictNote?: string; // e.g., "Save for KvK Day 4 if KvK is within 2 weeks"
}

export interface EventPhase {
    name: string;
    description: string;
    preparation?: string[];
    keyTasks: string[];
    tips?: string[];
    pointsStrategy?: string;
    scoringActions?: ScoringAction[];
    stockpileTargets?: StockpileItem[];
    victoryPoints?: number;
    doNotDo?: string[];
    exploits?: string[];
}

export interface EventReward {
  name: string;
  rarity: Rarity;
}

export interface GameEvent {
  id: string;
  name: string;
  type: 'Guild' | 'PvP' | 'PvP Arena' | 'PvE' | 'Daily' | 'Seasonal' | 'Server War' | 'Bi-Weekly';
  description: string;
  phases?: EventPhase[];
  preparationChecklist?: string[];
  rewardsHighlight?: string[];
  isActive?: boolean;
  activePhaseIndex?: number;
  scheduleType?: 'Weekly-UTC' | 'Bi-Weekly' | 'Manual' | 'Daily';
  // Critical scheduling information
  nextOccurrence?: string; // ISO date string for next event start
  duration?: string; // e.g., "6 days", "2 days", "24 hours"
  frequency?: string; // e.g., "Weekly on Mondays", "Every 2 weeks"
  preparationTime?: string; // How far in advance to prepare, e.g., "2 weeks before"
  criticalDays?: number[]; // Which days are most important (1-indexed)
  scoringDataKey?: string; // key into eventScoringData lookup
}

export interface GiftCode {
  code: string;
  rewards: string;
  isActive: boolean;
  addedDate?: string;
}

export interface ProgressSnapshot {
  date: string;
  totalInfluence: number;
  notes?: string;
}

export interface PlayerProgressModel {
  spendProfile: SpendProfile;
  snapshots: ProgressSnapshot[];
}

export interface UserInventory {
  diamonds: number;
  gold: number;
  experience: number;
  stamina: number;
  speedups: {
    generic: number;
    building: number;
    training: number;
    research: number;
  };
  shards: {
    generic: {
      legendary: number;
      mythic: number;
    };
    specific: Record<string, number>;
  };
  guildCoins: number;
  ruinsCoins: number;
  arenaTokens: number;
}

export interface UserBuildings {
  castle: number;
  trainingGrounds: number;
}

export interface UserResearch {
  economy: Record<string, number>;
  military: Record<string, number>;
}

export interface UserData {
  roster: UserHero[];
  inventory: UserInventory;
  buildings: UserBuildings;
  research: UserResearch;
  redeemedCodes: string[];
  settings: {
    mainFaction: Faction;
    serverGroup: string;
  };
  queues: Queue[];
  teamPresets: TeamPreset[];
  lastUpdated: string;
  progressLog?: ProgressSnapshot[];
  progressModel?: PlayerProgressModel;
}

export interface TeamPreset {
  id: string;
  name: string;
  heroIds: (string | null)[];
}
