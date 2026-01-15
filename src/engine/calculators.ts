/**
 * Strategic Calculation Utilities
 * Core mathematical functions for optimization algorithms
 */

import { Resources, HeroState, UpgradeStep, UpgradeAction, UserHero } from '../types/strategic';
import { Rarity } from '../types';

// ============================================================================
// RESOURCE CALCULATION
// ============================================================================

/**
 * Calculate the weighted value of resources
 * Different resources have different value based on rarity and acquisition difficulty
 */
export function calculateResourceValue(resources: Resources): number {
  const weights = {
    gold: 0.001,
    gems: 1.0,
    soulStones: 50,
    skillBooks: 2,
    traitStones: 3,
    experienceBottles: 0.5,
    petEssence: 5,
    relicFragments: 10,
  };

  let totalValue = 0;
  
  totalValue += (resources.gold || 0) * weights.gold;
  totalValue += (resources.gems || 0) * weights.gems;
  totalValue += (resources.soulStones || 0) * weights.soulStones;
  totalValue += (resources.skillBooks || 0) * weights.skillBooks;
  totalValue += (resources.traitStones || 0) * weights.traitStones;
  totalValue += (resources.experienceBottles || 0) * weights.experienceBottles;
  totalValue += (resources.petEssence || 0) * weights.petEssence;
  totalValue += (resources.relicFragments || 0) * weights.relicFragments;
  
  // Ascension stones (weighted by rarity)
  if (resources.ascensionStones) {
    const ascensionWeights = {
      Rare: 10,
      Epic: 25,
      Legendary: 75,
      Mythic: 200,
    };
    
    Object.entries(resources.ascensionStones).forEach(([rarity, count]) => {
      totalValue += count * (ascensionWeights[rarity as Rarity] || 0);
    });
  }
  
  return totalValue;
}

/**
 * Check if player has sufficient resources
 */
export function hasResources(available: Resources, required: Resources): boolean {
  if ((available.gold || 0) < (required.gold || 0)) return false;
  if ((available.gems || 0) < (required.gems || 0)) return false;
  if ((available.soulStones || 0) < (required.soulStones || 0)) return false;
  if ((available.skillBooks || 0) < (required.skillBooks || 0)) return false;
  if ((available.traitStones || 0) < (required.traitStones || 0)) return false;
  
  // Check hero shards
  if (required.heroShards) {
    for (const [heroId, count] of Object.entries(required.heroShards)) {
      if ((available.heroShards?.[heroId] || 0) < count) return false;
    }
  }
  
  // Check ascension stones
  if (required.ascensionStones) {
    for (const [rarity, count] of Object.entries(required.ascensionStones)) {
      if ((available.ascensionStones?.[rarity as Rarity] || 0) < count) return false;
    }
  }
  
  return true;
}

/**
 * Subtract resources
 */
export function subtractResources(from: Resources, amount: Resources): Resources {
  return {
    ...from,
    gold: (from.gold || 0) - (amount.gold || 0),
    gems: (from.gems || 0) - (amount.gems || 0),
    soulStones: (from.soulStones || 0) - (amount.soulStones || 0),
    skillBooks: (from.skillBooks || 0) - (amount.skillBooks || 0),
    traitStones: (from.traitStones || 0) - (amount.traitStones || 0),
    experienceBottles: (from.experienceBottles || 0) - (amount.experienceBottles || 0),
    petEssence: (from.petEssence || 0) - (amount.petEssence || 0),
    relicFragments: (from.relicFragments || 0) - (amount.relicFragments || 0),
    heroShards: subtractHeroShards(from.heroShards || {}, amount.heroShards || {}),
    ascensionStones: subtractAscensionStones(from.ascensionStones || {}, amount.ascensionStones || {}),
  };
}

function subtractHeroShards(
  from: Record<string, number>,
  amount: Record<string, number>
): Record<string, number> {
  const result = { ...from };
  Object.entries(amount).forEach(([heroId, count]) => {
    result[heroId] = (result[heroId] || 0) - count;
  });
  return result;
}

function subtractAscensionStones(
  from: Record<Rarity, number>,
  amount: Record<Rarity, number>
): Record<Rarity, number> {
  const result = { ...from };
  Object.entries(amount).forEach(([rarity, count]) => {
    result[rarity as Rarity] = (result[rarity as Rarity] || 0) - count;
  });
  return result;
}

// ============================================================================
// UPGRADE COST CALCULATION
// ============================================================================

/**
 * Calculate cost for level up
 */
export function getLevelUpCost(currentLevel: number, targetLevel: number, rarity: Rarity): Resources {
  // Base cost formula: baseGold * level^1.5 * rarityMultiplier
  const rarityMultipliers = {
    Rare: 1.0,
    Epic: 1.5,
    Legendary: 2.5,
    Mythic: 4.0,
  };
  
  let totalGold = 0;
  let totalExp = 0;
  
  for (let level = currentLevel; level < targetLevel; level++) {
    const baseCost = 1000 * Math.pow(level, 1.5) * rarityMultipliers[rarity];
    totalGold += baseCost;
    totalExp += baseCost * 0.5;
  }
  
  return {
    gold: Math.floor(totalGold),
    experienceBottles: Math.floor(totalExp / 500), // 500 exp per bottle
    heroShards: {},
    ascensionStones: {},
  };
}

/**
 * Calculate cost for star promotion
 */
export function getStarPromotionCost(currentStars: number, rarity: Rarity, heroId: string): Resources {
  // Shard cost based on rarity and star level
  const shardCosts = {
    Rare: [20, 40, 60, 80, 100],
    Epic: [30, 60, 90, 120, 150],
    Legendary: [50, 100, 150, 200, 250],
    Mythic: [80, 160, 240, 320, 400],
  };
  
  if (currentStars >= 5) {
    return { gold: 0, heroShards: {}, ascensionStones: {} };
  }
  
  const shardCost = shardCosts[rarity][currentStars];
  
  return {
    gold: shardCost * 5000,
    heroShards: { [heroId]: shardCost },
    ascensionStones: {},
  };
}

/**
 * Calculate cost for awakening
 */
export function getAwakeningCost(currentAwakening: number, rarity: Rarity, heroId: string): Resources {
  if (currentAwakening >= 5) {
    return { gold: 0, heroShards: {}, ascensionStones: {} };
  }
  
  // Awakening costs scale dramatically
  const costs = [
    { shards: 50, stones: 1, gold: 100000 },
    { shards: 75, stones: 2, gold: 200000 },
    { shards: 100, stones: 3, gold: 400000 },
    { shards: 150, stones: 5, gold: 800000 },
    { shards: 200, stones: 8, gold: 1600000 },
  ];
  
  const cost = costs[currentAwakening];
  
  return {
    gold: cost.gold,
    soulStones: cost.stones,
    heroShards: { [heroId]: cost.shards },
    ascensionStones: { [rarity]: cost.stones },
  };
}

/**
 * Calculate cost for skill upgrade
 */
export function getSkillUpgradeCost(currentLevel: number): Resources {
  // Skill books needed: level * 50 + (level^2 * 10)
  const books = Math.floor(currentLevel * 50 + Math.pow(currentLevel, 2) * 10);
  const gold = books * 1000;
  
  return {
    gold,
    skillBooks: books,
    heroShards: {},
    ascensionStones: {},
  };
}

/**
 * Calculate cost for trait upgrade
 */
export function getTraitUpgradeCost(currentLevel: number): Resources {
  // Trait stones needed: 10 per level, gold scales
  const stones = 10;
  const gold = Math.floor(currentLevel * 5000 + Math.pow(currentLevel, 1.5) * 1000);
  
  return {
    gold,
    traitStones: stones,
    heroShards: {},
    ascensionStones: {},
  };
}

// ============================================================================
// POWER CALCULATION
// ============================================================================

/**
 * Calculate power gain from level up
 */
export function getLevelUpPowerGain(currentLevel: number, targetLevel: number, rarity: Rarity): number {
  // Power formula: base * (1 + level * 0.05) * rarityMultiplier
  const rarityMultipliers = {
    Rare: 1.0,
    Epic: 1.3,
    Legendary: 1.7,
    Mythic: 2.2,
  };
  
  const basePower = 100;
  const multiplier = rarityMultipliers[rarity];
  
  const currentPower = basePower * (1 + currentLevel * 0.05) * multiplier;
  const targetPower = basePower * (1 + targetLevel * 0.05) * multiplier;
  
  return Math.floor(targetPower - currentPower);
}

/**
 * Calculate power gain from star promotion
 */
export function getStarPromotionPowerGain(currentStars: number, rarity: Rarity): number {
  // Each star adds 20% base power * rarity multiplier
  const rarityMultipliers = {
    Rare: 500,
    Epic: 800,
    Legendary: 1200,
    Mythic: 2000,
  };
  
  return Math.floor(rarityMultipliers[rarity] * (currentStars + 1) * 0.2);
}

/**
 * Calculate power gain from awakening
 */
export function getAwakeningPowerGain(currentAwakening: number, rarity: Rarity): number {
  // Awakening provides major power spikes
  const gains = [5000, 8000, 12000, 18000, 25000];
  const rarityMultipliers = {
    Rare: 0.5,
    Epic: 0.8,
    Legendary: 1.2,
    Mythic: 1.8,
  };
  
  return Math.floor(gains[currentAwakening] * rarityMultipliers[rarity]);
}

/**
 * Calculate power gain from skill upgrade
 */
export function getSkillUpgradePowerGain(currentLevel: number): number {
  // Skills provide moderate, linear power gains
  return Math.floor(300 + currentLevel * 50);
}

/**
 * Calculate power gain from trait upgrade
 */
export function getTraitUpgradePowerGain(currentLevel: number): number {
  // Traits provide small but consistent gains
  return Math.floor(200 + currentLevel * 30);
}

// ============================================================================
// ROI CALCULATION
// ============================================================================

/**
 * Calculate Return on Investment (Power per resource unit)
 */
export function calculateROI(powerGain: number, cost: Resources): number {
  const resourceValue = calculateResourceValue(cost);
  if (resourceValue === 0) return 0;
  return powerGain / resourceValue;
}

/**
 * Compare two upgrade paths by ROI
 */
export function compareByROI(a: UpgradeStep, b: UpgradeStep): number {
  return b.roi - a.roi;
}

// ============================================================================
// TIME ESTIMATION
// ============================================================================

/**
 * Estimate days to acquire resources (F2P perspective)
 */
export function estimateDaysToAcquireResources(
  needed: Resources,
  dailyIncome: Resources
): number {
  // Calculate how many days needed for each resource type
  const days: number[] = [];
  
  if (needed.gold) {
    days.push(Math.ceil(needed.gold / (dailyIncome.gold || 1000)));
  }
  if (needed.gems) {
    days.push(Math.ceil(needed.gems / (dailyIncome.gems || 50)));
  }
  if (needed.skillBooks) {
    days.push(Math.ceil(needed.skillBooks / (dailyIncome.skillBooks || 100)));
  }
  if (needed.traitStones) {
    days.push(Math.ceil(needed.traitStones / (dailyIncome.traitStones || 50)));
  }
  if (needed.soulStones) {
    days.push(Math.ceil(needed.soulStones / (dailyIncome.soulStones || 2)));
  }
  
  // Return the maximum (bottleneck resource)
  return days.length > 0 ? Math.max(...days) : 0;
}

/**
 * Get estimated daily resource income based on player level and spend profile
 */
export function getDailyResourceIncome(
  castleLevel: number,
  spendProfile: 'F2P' | 'LowSpender' | 'Whale'
): Resources {
  const baseIncome = {
    gold: 50000 + castleLevel * 2000,
    gems: spendProfile === 'F2P' ? 100 : spendProfile === 'LowSpender' ? 300 : 1000,
    skillBooks: 150 + castleLevel * 5,
    traitStones: 75 + castleLevel * 3,
    soulStones: spendProfile === 'F2P' ? 2 : spendProfile === 'LowSpender' ? 5 : 15,
    experienceBottles: 200 + castleLevel * 10,
    heroShards: {},
    ascensionStones: {},
  };
  
  return baseIncome;
}

// ============================================================================
// PRIORITY SCORING
// ============================================================================

/**
 * Calculate upgrade priority score
 * Considers: ROI, meta relevance, team synergy, event utility
 */
export interface PriorityFactors {
  roi: number;
  metaRelevance: number; // 0-1
  teamSynergy: number; // 0-1
  eventUtility: number; // 0-1
  currentPower: number;
  targetPower: number;
  timeToComplete: number; // days
}

export function calculatePriorityScore(factors: PriorityFactors): number {
  // Weighted scoring formula
  const weights = {
    roi: 0.30,
    metaRelevance: 0.25,
    teamSynergy: 0.20,
    eventUtility: 0.15,
    urgency: 0.10, // Based on time to complete
  };
  
  // Normalize ROI (assume max ROI is 100)
  const normalizedROI = Math.min(factors.roi / 100, 1);
  
  // Urgency: Prefer shorter timelines (but not too short)
  const optimalDays = 7;
  const urgency = 1 - Math.abs(factors.timeToComplete - optimalDays) / 30;
  
  const score = 
    normalizedROI * weights.roi +
    factors.metaRelevance * weights.metaRelevance +
    factors.teamSynergy * weights.teamSynergy +
    factors.eventUtility * weights.eventUtility +
    Math.max(0, urgency) * weights.urgency;
  
  return Math.floor(score * 100); // Return 0-100
}

// ============================================================================
// SYNERGY CALCULATION
// ============================================================================

/**
 * Calculate team synergy bonus
 */
export function calculateTeamSynergy(
  heroId: string,
  teamHeroes: string[],
  bonds: Map<string, string[]>
): number {
  let synergyScore = 0;
  
  // Check for bond partners in team
  const heroBonds = bonds.get(heroId) || [];
  for (const bondPartner of heroBonds) {
    if (teamHeroes.includes(bondPartner)) {
      synergyScore += 0.1; // 10% bonus per bond
    }
  }
  
  // Cap at 50% total synergy bonus
  return Math.min(synergyScore, 0.5);
}

// ============================================================================
// BOTTLENECK DETECTION
// ============================================================================

/**
 * Identify resource bottlenecks
 */
export function identifyBottlenecks(
  required: Resources,
  available: Resources,
  dailyIncome: Resources
): Array<{ resource: string; shortage: number; daysNeeded: number }> {
  const bottlenecks: Array<{ resource: string; shortage: number; daysNeeded: number }> = [];
  
  // Check each resource type
  const checkResource = (
    name: string,
    required: number,
    available: number,
    dailyIncome: number
  ) => {
    if (required > available) {
      const shortage = required - available;
      const daysNeeded = Math.ceil(shortage / dailyIncome);
      bottlenecks.push({ resource: name, shortage, daysNeeded });
    }
  };
  
  checkResource('gold', required.gold || 0, available.gold || 0, dailyIncome.gold || 1000);
  checkResource('gems', required.gems || 0, available.gems || 0, dailyIncome.gems || 50);
  checkResource('skillBooks', required.skillBooks || 0, available.skillBooks || 0, dailyIncome.skillBooks || 100);
  checkResource('traitStones', required.traitStones || 0, available.traitStones || 0, dailyIncome.traitStones || 50);
  checkResource('soulStones', required.soulStones || 0, available.soulStones || 0, dailyIncome.soulStones || 2);
  
  // Sort by days needed (longest first)
  return bottlenecks.sort((a, b) => b.daysNeeded - a.daysNeeded);
}
