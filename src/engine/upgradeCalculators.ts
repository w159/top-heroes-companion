/**
 * Upgrade Cost & Power Gain Calculators
 * Functions for computing upgrade costs and resulting power gains
 */

import { Resources, UpgradeStep } from '@/types/strategic';
import { Rarity } from '@/shared/types/types';
import { calculateResourceValue } from './resourceCalculators';

// ============================================================================
// UPGRADE COST CALCULATION
// ============================================================================

/**
 * Calculate cost for level up
 */
export function getLevelUpCost(currentLevel: number, targetLevel: number, rarity: Rarity): Resources {
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
    experienceBottles: Math.floor(totalExp / 500),
    heroShards: {},
    ascensionStones: {} as Record<Rarity, number>,
  };
}

/**
 * Calculate cost for star promotion
 */
export function getStarPromotionCost(currentStars: number, rarity: Rarity, heroId: string): Resources {
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
    ascensionStones: {} as Record<Rarity, number>,
  };
}

/**
 * Calculate cost for awakening
 */
export function getAwakeningCost(currentAwakening: number, rarity: Rarity, heroId: string): Resources {
  if (currentAwakening >= 5) {
    return { gold: 0, heroShards: {}, ascensionStones: {} };
  }

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
    ascensionStones: { [rarity]: cost.stones } as Record<Rarity, number>,
  };
}

/**
 * Calculate cost for skill upgrade
 */
export function getSkillUpgradeCost(currentLevel: number): Resources {
  const books = Math.floor(currentLevel * 50 + Math.pow(currentLevel, 2) * 10);
  const gold = books * 1000;

  return {
    gold,
    skillBooks: books,
    heroShards: {},
    ascensionStones: {} as Record<Rarity, number>,
  };
}

/**
 * Calculate cost for trait upgrade
 */
export function getTraitUpgradeCost(currentLevel: number): Resources {
  const stones = 10;
  const gold = Math.floor(currentLevel * 5000 + Math.pow(currentLevel, 1.5) * 1000);

  return {
    gold,
    traitStones: stones,
    heroShards: {},
    ascensionStones: {} as Record<Rarity, number>,
  };
}

// ============================================================================
// POWER GAIN CALCULATION
// ============================================================================

/**
 * Calculate power gain from level up
 */
export function getLevelUpPowerGain(currentLevel: number, targetLevel: number, rarity: Rarity): number {
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
  return Math.floor(300 + currentLevel * 50);
}

/**
 * Calculate power gain from trait upgrade
 */
export function getTraitUpgradePowerGain(currentLevel: number): number {
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
