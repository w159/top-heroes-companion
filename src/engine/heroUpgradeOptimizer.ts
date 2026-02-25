/**
 * Hero Upgrade Path Optimizer
 * Dynamic programming algorithm for optimal hero progression
 */

import {
  PlayerState,
  Resources,
  UserHero,
  UpgradePath,
  UpgradeAction,
  HeroState,
} from '@/types/strategic';
import { Rarity } from '@/shared/types/types';
import {
  calculateROI,
  calculatePriorityScore,
  addResources,
  estimateDaysToAcquireResources,
  getDailyResourceIncome,
  identifyBottlenecks,
} from './calculators';
import type { PriorityFactors } from './teamCalculators';
import { generateAllUpgradeSteps, selectOptimalSteps } from './upgradeCostCalculator';

// ============================================================================
// MAIN OPTIMIZER
// ============================================================================

/**
 * Generate optimal upgrade paths for all heroes
 * Uses dynamic programming to maximize power gain within resource constraints
 */
export function optimizeHeroUpgrades(
  playerState: PlayerState,
  maxPaths: number = 10
): UpgradePath[] {
  const paths: UpgradePath[] = [];
  const dailyIncome = getDailyResourceIncome(playerState.castleLevel, playerState.spendProfile);

  for (const hero of playerState.ownedHeroes) {
    const path = generateHeroUpgradePath(hero, playerState, dailyIncome);
    if (path) paths.push(path);
  }

  paths.sort((a, b) => b.priority - a.priority);
  return paths.slice(0, maxPaths);
}

/**
 * Format upgrade path for display
 */
export function formatUpgradePath(path: UpgradePath): string {
  const lines: string[] = [];
  lines.push(`Hero: ${path.heroId}`);
  lines.push(`Priority: ${path.priority}/100`);
  lines.push(`Total Power Gain: +${path.powerGain.toLocaleString()}`);
  lines.push(`ROI: ${path.roi.toFixed(2)} power/resource`);
  lines.push(`Time to Complete: ${path.totalTime} days`);
  lines.push('');
  lines.push('Upgrade Steps:');
  path.steps.slice(0, 10).forEach((step, i) => {
    lines.push(
      `${i + 1}. ${formatAction(step.action)} ` +
      `${step.fromValue} → ${step.toValue} ` +
      `(+${step.powerGain} power, ROI: ${step.roi.toFixed(2)})`
    );
  });
  if (path.steps.length > 10) {
    lines.push(`... and ${path.steps.length - 10} more steps`);
  }
  if (path.bottlenecks.length > 0) {
    lines.push('');
    lines.push('Resource Bottlenecks:');
    path.bottlenecks.forEach(b => {
      lines.push(`- ${b.resource}: need ${b.shortage} more (~${b.daysNeeded} days)`);
    });
  }
  return lines.join('\n');
}

/**
 * Get quick recommendations (top 3 actions)
 */
export function getQuickRecommendations(playerState: PlayerState): string[] {
  const paths = optimizeHeroUpgrades(playerState, 3);
  return paths.map(path => {
    const topStep = path.steps[0];
    if (!topStep) return `Focus on ${path.heroId}`;
    return `${path.heroId}: ${formatAction(topStep.action)} ` +
           `${topStep.fromValue} → ${topStep.toValue} ` +
           `(+${topStep.powerGain} power)`;
  });
}

// ============================================================================
// INTERNAL: PATH GENERATION
// ============================================================================

function generateHeroUpgradePath(
  hero: UserHero,
  playerState: PlayerState,
  dailyIncome: Resources
): UpgradePath | null {
  const rarity = getRarity(hero.heroId);
  if (!rarity) return null;

  const currentState: HeroState = {
    level: hero.level, stars: hero.stars, awakening: hero.awakening,
    skillLevels: hero.skillLevels || [1, 1, 1],
    traitLevels: hero.traitLevels || [1, 1, 1, 1],
    power: hero.power,
  };

  const targetState: HeroState = {
    level: Math.min(hero.level + 50, getMaxLevel(playerState.castleLevel)),
    stars: 5, awakening: 5,
    skillLevels: [15, 15, 15], traitLevels: [30, 30, 30, 30],
    power: 0,
  };

  const allSteps = generateAllUpgradeSteps(hero.heroId, currentState, targetState, rarity);
  allSteps.sort((a, b) => b.roi - a.roi);
  const selectedSteps = selectOptimalSteps(allSteps, playerState.resources, dailyIncome);

  let totalCost: Resources = { gold: 0, gems: 0, heroShards: {}, ascensionStones: {} as Record<Rarity, number> };
  let totalPowerGain = 0;
  for (const step of selectedSteps) {
    totalCost = addResources(totalCost, step.cost);
    totalPowerGain += step.powerGain;
  }

  const totalTime = estimateDaysToAcquireResources(totalCost, dailyIncome);
  const overallROI = calculateROI(totalPowerGain, totalCost);
  const priorityFactors: PriorityFactors = {
    roi: overallROI,
    metaRelevance: getMetaRelevance(hero.heroId),
    teamSynergy: getTeamSynergy(hero.heroId, playerState.focusedHeroes),
    eventUtility: getEventUtility(hero.heroId),
    currentPower: currentState.power,
    targetPower: currentState.power + totalPowerGain,
    timeToComplete: totalTime,
  };
  const priority = calculatePriorityScore(priorityFactors);
  const bottlenecks = identifyBottlenecks(totalCost, playerState.resources, dailyIncome);
  targetState.power = currentState.power + totalPowerGain;

  return {
    heroId: hero.heroId, currentState, targetState,
    steps: selectedSteps, totalCost, totalTime,
    powerGain: totalPowerGain, roi: overallROI, priority, bottlenecks,
  };
}

// ============================================================================
// INTERNAL HELPERS
// ============================================================================

function getRarity(heroId: string): Rarity | null {
  return 'Legendary';
}

function getMaxLevel(castleLevel: number): number {
  return Math.min(castleLevel * 5, 300);
}

function getMetaRelevance(heroId: string): number {
  const s_tier = ['tidecaller', 'rose-agent', 'altar-marshal', 'tree-guard'];
  if (s_tier.includes(heroId)) return 0.9;
  return 0.5;
}

function getTeamSynergy(heroId: string, focusedHeroes: string[]): number {
  let synergy = 0.5;
  if (focusedHeroes.includes(heroId)) synergy += 0.2;
  return Math.min(synergy, 1.0);
}

function getEventUtility(heroId: string): number {
  return 0.6;
}

function formatAction(action: UpgradeAction): string {
  const labels = {
    level_up: 'Level Up',
    star_promotion: 'Star Promotion',
    awakening: 'Awakening',
    skill_upgrade: 'Skill Upgrade',
    trait_upgrade: 'Trait Upgrade',
    equipment_enhance: 'Equipment Enhance',
  };
  return labels[action] || action;
}
