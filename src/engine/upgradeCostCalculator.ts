/**
 * Upgrade Cost Calculator
 * Step generation and optimal step selection for hero upgrade paths
 */

import { Resources, UpgradeStep, HeroState } from '@/types/strategic';
import { Rarity } from '@/shared/types/types';
import {
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
  subtractResources,
  estimateDaysToAcquireResources,
} from './calculators';

/**
 * Generate all possible upgrade steps between current and target state
 */
export function generateAllUpgradeSteps(
  heroId: string,
  current: HeroState,
  target: HeroState,
  rarity: Rarity
): UpgradeStep[] {
  const steps: UpgradeStep[] = [];
  let stepNumber = 0;

  // Level up steps (in increments of 10)
  if (current.level < target.level) {
    for (let level = current.level; level < target.level; level += 10) {
      const toLevel = Math.min(level + 10, target.level);
      const cost = getLevelUpCost(level, toLevel, rarity);
      const powerGain = getLevelUpPowerGain(level, toLevel, rarity);
      steps.push({
        stepNumber: stepNumber++, action: 'level_up',
        fromValue: level, toValue: toLevel, cost, powerGain,
        roi: calculateROI(powerGain, cost), dependencies: [], recommendedOrder: 0,
      });
    }
  }

  // Star promotion steps
  for (let stars = current.stars; stars < target.stars; stars++) {
    const cost = getStarPromotionCost(stars, rarity, heroId);
    const powerGain = getStarPromotionPowerGain(stars, rarity);
    steps.push({
      stepNumber: stepNumber++, action: 'star_promotion',
      fromValue: stars, toValue: stars + 1, cost, powerGain,
      roi: calculateROI(powerGain, cost), dependencies: [], recommendedOrder: 0,
    });
  }

  // Awakening steps
  for (let awakening = current.awakening; awakening < target.awakening; awakening++) {
    const cost = getAwakeningCost(awakening, rarity, heroId);
    const powerGain = getAwakeningPowerGain(awakening, rarity);
    const dependencies = awakening > 0 ? ['star_promotion_5'] : [];
    steps.push({
      stepNumber: stepNumber++, action: 'awakening',
      fromValue: awakening, toValue: awakening + 1, cost, powerGain,
      roi: calculateROI(powerGain, cost), dependencies, recommendedOrder: 0,
    });
  }

  // Skill upgrade steps
  for (let i = 0; i < current.skillLevels.length; i++) {
    for (let l = current.skillLevels[i]; l < target.skillLevels[i]; l++) {
      const cost = getSkillUpgradeCost(l);
      const powerGain = getSkillUpgradePowerGain(l);
      steps.push({
        stepNumber: stepNumber++, action: 'skill_upgrade',
        fromValue: l, toValue: l + 1, cost, powerGain,
        roi: calculateROI(powerGain, cost), dependencies: [], recommendedOrder: 0,
      });
    }
  }

  // Trait upgrade steps
  for (let i = 0; i < current.traitLevels.length; i++) {
    for (let l = current.traitLevels[i]; l < target.traitLevels[i]; l++) {
      const cost = getTraitUpgradeCost(l);
      const powerGain = getTraitUpgradePowerGain(l);
      steps.push({
        stepNumber: stepNumber++, action: 'trait_upgrade',
        fromValue: l, toValue: l + 1, cost, powerGain,
        roi: calculateROI(powerGain, cost), dependencies: [], recommendedOrder: 0,
      });
    }
  }

  return steps;
}

/**
 * Select optimal steps using greedy algorithm with resource constraints.
 * Variant of the fractional knapsack problem — takes highest ROI steps
 * that are achievable within 30 days, up to 20 steps total.
 */
export function selectOptimalSteps(
  allSteps: UpgradeStep[],
  availableResources: Resources,
  dailyIncome: Resources
): UpgradeStep[] {
  const selected: UpgradeStep[] = [];
  let remainingResources = { ...availableResources };

  for (const step of allSteps) {
    const daysNeeded = estimateDaysToAcquireResources(step.cost, dailyIncome);
    if (daysNeeded <= 30) {
      selected.push(step);
      remainingResources = subtractResources(remainingResources, step.cost);
      if (selected.length >= 20) break;
    }
  }

  selected.forEach((step, index) => {
    step.recommendedOrder = index + 1;
  });

  return selected;
}
