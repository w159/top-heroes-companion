/**
 * Event Reward Calculation Functions
 *
 * Handles resource estimation, reward calculation, and resource management
 * for event strategy optimization.
 */

import {
  GameEvent,
  Resources,
  PlayerState,
} from '../types/strategic';
import { calculateResourceValue } from './calculators';

/**
 * Get difficulty multiplier based on target rank
 */
export function getRankDifficultyMultiplier(targetRank: number, event: GameEvent): number {
  // Top ranks require exponentially more effort
  if (targetRank === 1) return 5.0;
  if (targetRank <= 3) return 3.5;
  if (targetRank <= 10) return 2.5;
  if (targetRank <= 50) return 2.0;
  if (targetRank <= 100) return 1.5;
  if (targetRank <= 500) return 1.2;
  return 1.0;
}

/**
 * Estimate resource requirements for target rank
 */
export function estimateResourceRequirements(
  targetRank: number,
  event: GameEvent,
  playerState: PlayerState
): Resources {
  // Base resources needed (scales with rank difficulty)
  const multiplier = getRankDifficultyMultiplier(targetRank, event);

  // Typical resource consumption per event
  const baseConsumption: Resources = {
    gold: 500000 * multiplier,
    gems: 200 * multiplier,
    heroShards: {},
    soulStones: 0,
    ascensionStones: {},
    skillBooks: 0,
    traitStones: 0,
    experienceBottles: 100 * multiplier,
    equipmentMaterials: {},
    enchantmentScrolls: 0,
    refreshTickets: Math.ceil(10 * multiplier),
  };

  return baseConsumption;
}

/**
 * Estimate consumable requirements (energy, tickets, etc.)
 */
export function estimateConsumableRequirements(
  targetRank: number,
  event: GameEvent
): Record<string, number> {
  const multiplier = getRankDifficultyMultiplier(targetRank, event);

  return {
    energy: Math.ceil(500 * multiplier),
    eventTickets: Math.ceil(50 * multiplier),
    refreshes: Math.ceil(5 * multiplier),
  };
}

/**
 * Calculate expected rewards for target rank
 */
export function calculateExpectedRewards(targetRank: number, event: GameEvent): Resources {
  // Find reward tier for target rank
  const rewardTier = event.rewards.ranking.find(
    r => targetRank >= r.minRank && targetRank <= r.maxRank
  );

  if (!rewardTier) {
    return event.rewards.participation;
  }

  // Combine participation rewards + rank rewards + milestone rewards
  const combinedRewards: Resources = { ...event.rewards.participation };

  // Add rank rewards
  if (rewardTier.rewards) {
    combinedRewards.gold += rewardTier.rewards.gold || 0;
    combinedRewards.gems += rewardTier.rewards.gems || 0;
    combinedRewards.soulStones += rewardTier.rewards.soulStones || 0;
    // ... add other resources
  }

  return combinedRewards;
}

/**
 * Check if player has enough resources
 */
export function hasEnoughResources(available: Resources, needed: Resources): boolean {
  if (available.gold < needed.gold) return false;
  if (available.gems < needed.gems) return false;
  if (available.experienceBottles < needed.experienceBottles) return false;
  return true;
}

/**
 * Get daily resource income
 */
export function getDailyResourceIncome(playerState: PlayerState): Resources {
  // Base income by castle level and spend profile
  const baseGold = playerState.castleLevel * 10000;
  const baseGems = playerState.spendProfile === 'F2P' ? 100 :
                   playerState.spendProfile === 'low_spender' ? 300 : 1000;

  return {
    gold: baseGold,
    gems: baseGems,
    heroShards: {},
    soulStones: 5,
    ascensionStones: {},
    skillBooks: 2,
    traitStones: 1,
    experienceBottles: 50,
    equipmentMaterials: {},
    enchantmentScrolls: 1,
    refreshTickets: 5,
  };
}

/**
 * Calculate resource deficit value
 */
export function calculateResourceDeficit(available: Resources, needed: Resources): number {
  const deficit: Resources = {
    gold: Math.max(0, needed.gold - available.gold),
    gems: Math.max(0, needed.gems - available.gems),
    heroShards: {},
    soulStones: Math.max(0, needed.soulStones - available.soulStones),
    ascensionStones: {},
    skillBooks: Math.max(0, needed.skillBooks - available.skillBooks),
    traitStones: Math.max(0, needed.traitStones - available.traitStones),
    experienceBottles: Math.max(0, needed.experienceBottles - available.experienceBottles),
    equipmentMaterials: {},
    enchantmentScrolls: Math.max(0, (needed.enchantmentScrolls || 0) - (available.enchantmentScrolls || 0)),
    refreshTickets: Math.max(0, (needed.refreshTickets || 0) - (available.refreshTickets || 0)),
  };

  return calculateResourceValue(deficit);
}

/**
 * Sum resources
 */
export function sumResources(resources: Resources[]): Resources {
  const total: Resources = {
    gold: 0,
    gems: 0,
    heroShards: {},
    soulStones: 0,
    ascensionStones: {},
    skillBooks: 0,
    traitStones: 0,
    experienceBottles: 0,
    equipmentMaterials: {},
    enchantmentScrolls: 0,
    refreshTickets: 0,
  };

  for (const r of resources) {
    total.gold += r.gold || 0;
    total.gems += r.gems || 0;
    total.soulStones += r.soulStones || 0;
    total.skillBooks += r.skillBooks || 0;
    total.traitStones += r.traitStones || 0;
    total.experienceBottles += r.experienceBottles || 0;
    total.enchantmentScrolls = (total.enchantmentScrolls || 0) + (r.enchantmentScrolls || 0);
    total.refreshTickets = (total.refreshTickets || 0) + (r.refreshTickets || 0);
  }

  return total;
}
