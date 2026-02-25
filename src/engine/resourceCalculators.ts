/**
 * Resource Calculation Utilities
 * Functions for resource valuation, comparison, and manipulation
 */

import { Resources } from '@/types/strategic';
import { Rarity } from '@/shared/types/types';

// ============================================================================
// RESOURCE VALUATION
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

// ============================================================================
// RESOURCE COMPARISON & MANIPULATION
// ============================================================================

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
  from: Partial<Record<Rarity, number>>,
  amount: Partial<Record<Rarity, number>>
): Partial<Record<Rarity, number>> {
  const result = { ...from };
  Object.entries(amount).forEach(([rarity, count]) => {
    result[rarity as Rarity] = (result[rarity as Rarity] || 0) - count;
  });
  return result;
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
    ascensionStones: {} as Record<Rarity, number>,
  };

  return baseIncome;
}

/**
 * Add two resource objects together
 */
export function addResources(a: Resources, b: Resources): Resources {
  return {
    gold: (a.gold || 0) + (b.gold || 0),
    gems: (a.gems || 0) + (b.gems || 0),
    soulStones: (a.soulStones || 0) + (b.soulStones || 0),
    skillBooks: (a.skillBooks || 0) + (b.skillBooks || 0),
    traitStones: (a.traitStones || 0) + (b.traitStones || 0),
    experienceBottles: (a.experienceBottles || 0) + (b.experienceBottles || 0),
    petEssence: (a.petEssence || 0) + (b.petEssence || 0),
    relicFragments: (a.relicFragments || 0) + (b.relicFragments || 0),
    heroShards: { ...a.heroShards, ...b.heroShards },
    ascensionStones: { ...a.ascensionStones, ...b.ascensionStones },
  };
}
