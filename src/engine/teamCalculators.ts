/**
 * Team & Priority Calculation Utilities
 * Functions for priority scoring, team synergy, and bottleneck detection
 */

import { Resources } from '@/types/strategic';

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
    requiredAmount: number,
    availableAmount: number,
    dailyIncomeAmount: number
  ) => {
    if (requiredAmount > availableAmount) {
      const shortage = requiredAmount - availableAmount;
      const daysNeeded = Math.ceil(shortage / dailyIncomeAmount);
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
