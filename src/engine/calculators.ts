/**
 * Strategic Calculation Utilities — Barrel Re-export
 *
 * All calculation functions have been organized into focused modules:
 * - resourceCalculators: resource valuation, comparison, time estimation
 * - upgradeCalculators: upgrade cost/power/ROI calculations
 * - teamCalculators: priority scoring, synergy, bottleneck detection
 *
 * This barrel preserves the original import path so existing consumers
 * continue to work without changes.
 */

export {
  calculateResourceValue,
  hasResources,
  subtractResources,
  addResources,
  estimateDaysToAcquireResources,
  getDailyResourceIncome,
} from './resourceCalculators';

export {
  getLevelUpCost,
  getStarPromotionCost,
  getAwakeningCost,
  getSkillUpgradeCost,
  getTraitUpgradeCost,
  getLevelUpPowerGain,
  getStarPromotionPowerGain,
  getAwakeningPowerGain,
  getSkillUpgradePowerGain,
  getTraitUpgradePowerGain,
  calculateROI,
  compareByROI,
} from './upgradeCalculators';

export {
  calculatePriorityScore,
  calculateTeamSynergy,
  identifyBottlenecks,
} from './teamCalculators';

export type { PriorityFactors } from './teamCalculators';
