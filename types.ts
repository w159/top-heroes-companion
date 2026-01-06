
export type Faction = 'Nature' | 'League' | 'Horde';
export type Rarity = 'Mythic' | 'Legendary' | 'Epic' | 'Rare';
export type Role = 'Tank' | 'DPS' | 'Support' | 'Healer' | 'Controller' | 'Hybrid';
export type Tier = 'S' | 'A' | 'B' | 'C' | 'D';

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
  tier: Tier;
  imageUrl?: string;
  description?: string;
  skills?: Skill[];
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

export interface EventPhase {
    name: string;
    description: string;
    keyTasks: string[];
    tips?: string[];
    pointsStrategy?: string;
}

export interface EventReward {
  name: string;
  rarity: Rarity;
}

export interface GameEvent {
  id: string;
  name: string;
  type: 'Recurring' | 'Special' | 'Season';
  description: string;
  phases?: EventPhase[]; 
  preparationChecklist?: string[];
  rewardsHighlight?: string[];
  isActive?: boolean;
  activePhaseIndex?: number;
  scheduleType?: 'Weekly-UTC' | 'Manual';
}

export interface GiftCode {
  code: string;
  rewards: string;
  isActive: boolean;
  addedDate?: string;
}

export interface UserData {
  roster: UserHero[];
  redeemedCodes: string[];
  settings: {
    mainFaction: Faction;
    serverGroup: string;
  };
  queues: Queue[];
  teamPresets: TeamPreset[];
  lastUpdated: string;
}

export interface TeamPreset {
  id: string;
  name: string;
  heroIds: (string | null)[];
}
