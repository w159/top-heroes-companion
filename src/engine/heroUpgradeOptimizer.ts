/**
 * Hero Upgrade Path Optimizer
 * Dynamic programming algorithm for optimal hero progression
 */

import {
  PlayerState,
  Resources,
  UserHero,
  UpgradePath,
  UpgradeStep,
  UpgradeAction,
  HeroState,
  Bottleneck,
  PriorityFactors,
} from '../types/strategic';
import { Hero, Rarity } from '../types';
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
  calculatePriorityScore,
  hasResources,
  subtractResources,
  estimateDaysToAcquireResources,
  getDailyResourceIncome,
  identifyBottlenecks,
} from './calculators';

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
  
  // Calculate daily income for time estimation
  const dailyIncome = getDailyResourceIncome(
    playerState.castleLevel,
    playerState.spendProfile
  );
  
  // Generate upgrade paths for each hero
  for (const hero of playerState.ownedHeroes) {
    const path = generateHeroUpgradePath(
      hero,
      playerState,
      dailyIncome
    );
    
    if (path) {
      paths.push(path);
    }
  }
  
  // Sort by priority score (ROI + meta relevance + synergy)
  paths.sort((a, b) => b.priority - a.priority);
  
  // Return top N paths
  return paths.slice(0, maxPaths);
}

/**
 * Generate complete upgrade path for a single hero
 */
function generateHeroUpgradePath(
  hero: UserHero,
  playerState: PlayerState,
  dailyIncome: Resources
): UpgradePath | null {
  // Get hero data (rarity, etc.)
  const rarity = getRarity(hero.heroId);
  if (!rarity) return null;
  
  // Current state
  const currentState: HeroState = {
    level: hero.level,
    stars: hero.stars,
    awakening: hero.awakening,
    skillLevels: hero.skillLevels || [1, 1, 1],
    traitLevels: hero.traitLevels || [1, 1, 1, 1],
    power: hero.power,
  };
  
  // Target state (maximum possible)
  const targetState: HeroState = {
    level: Math.min(hero.level + 50, getMaxLevel(playerState.castleLevel)), // Incremental goals
    stars: 5,
    awakening: 5,
    skillLevels: [15, 15, 15],
    traitLevels: [30, 30, 30, 30],
    power: 0, // Will be calculated
  };
  
  // Generate all possible upgrade steps
  const allSteps = generateAllUpgradeSteps(
    hero.heroId,
    currentState,
    targetState,
    rarity
  );
  
  // Sort by ROI
  allSteps.sort((a, b) => b.roi - a.roi);
  
  // Select steps using greedy algorithm with constraints
  const selectedSteps = selectOptimalSteps(
    allSteps,
    playerState.resources,
    dailyIncome
  );
  
  // Calculate total cost and power gain
  let totalCost: Resources = {
    gold: 0,
    gems: 0,
    heroShards: {},
    ascensionStones: {},
  };
  
  let totalPowerGain = 0;
  let totalTime = 0;
  
  for (const step of selectedSteps) {
    totalCost = addResources(totalCost, step.cost);
    totalPowerGain += step.powerGain;
  }
  
  // Estimate time to complete
  totalTime = estimateDaysToAcquireResources(totalCost, dailyIncome);
  
  // Calculate overall ROI
  const overallROI = calculateROI(totalPowerGain, totalCost);
  
  // Calculate priority factors
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
  
  // Identify bottlenecks
  const bottlenecks = identifyBottlenecks(
    totalCost,
    playerState.resources,
    dailyIncome
  );
  
  // Update target state power
  targetState.power = currentState.power + totalPowerGain;
  
  return {
    heroId: hero.heroId,
    currentState,
    targetState,
    steps: selectedSteps,
    totalCost,
    totalTime,
    powerGain: totalPowerGain,
    roi: overallROI,
    priority,
    bottlenecks,
  };
}

// ============================================================================
// STEP GENERATION
// ============================================================================

/**
 * Generate all possible upgrade steps
 */
function generateAllUpgradeSteps(
  heroId: string,
  current: HeroState,
  target: HeroState,
  rarity: Rarity
): UpgradeStep[] {
  const steps: UpgradeStep[] = [];
  let stepNumber = 0;
  
  // Level up steps
  if (current.level < target.level) {
    // Break into increments of 10 levels
    for (let level = current.level; level < target.level; level += 10) {
      const toLevel = Math.min(level + 10, target.level);
      const cost = getLevelUpCost(level, toLevel, rarity);
      const powerGain = getLevelUpPowerGain(level, toLevel, rarity);
      const roi = calculateROI(powerGain, cost);
      
      steps.push({
        stepNumber: stepNumber++,
        action: 'level_up',
        fromValue: level,
        toValue: toLevel,
        cost,
        powerGain,
        roi,
        dependencies: [],
        recommendedOrder: 0,
      });
    }
  }
  
  // Star promotion steps
  for (let stars = current.stars; stars < target.stars; stars++) {
    const cost = getStarPromotionCost(stars, rarity, heroId);
    const powerGain = getStarPromotionPowerGain(stars, rarity);
    const roi = calculateROI(powerGain, cost);
    
    steps.push({
      stepNumber: stepNumber++,
      action: 'star_promotion',
      fromValue: stars,
      toValue: stars + 1,
      cost,
      powerGain,
      roi,
      dependencies: [],
      recommendedOrder: 0,
    });
  }
  
  // Awakening steps
  for (let awakening = current.awakening; awakening < target.awakening; awakening++) {
    const cost = getAwakeningCost(awakening, rarity, heroId);
    const powerGain = getAwakeningPowerGain(awakening, rarity);
    const roi = calculateROI(powerGain, cost);
    
    // Awakening requires max stars
    const dependencies = awakening > 0 ? ['star_promotion_5'] : [];
    
    steps.push({
      stepNumber: stepNumber++,
      action: 'awakening',
      fromValue: awakening,
      toValue: awakening + 1,
      cost,
      powerGain,
      roi,
      dependencies,
      recommendedOrder: 0,
    });
  }
  
  // Skill upgrade steps
  for (let i = 0; i < current.skillLevels.length; i++) {
    const currentLevel = current.skillLevels[i];
    const targetLevel = target.skillLevels[i];
    
    // Break into increments of 3 levels
    for (let level = currentLevel; level < targetLevel; level += 3) {
      const toLevel = Math.min(level + 3, targetLevel);
      
      for (let l = level; l < toLevel; l++) {
        const cost = getSkillUpgradeCost(l);
        const powerGain = getSkillUpgradePowerGain(l);
        const roi = calculateROI(powerGain, cost);
        
        steps.push({
          stepNumber: stepNumber++,
          action: 'skill_upgrade',
          fromValue: l,
          toValue: l + 1,
          cost,
          powerGain,
          roi,
          dependencies: [],
          recommendedOrder: 0,
        });
      }
    }
  }
  
  // Trait upgrade steps
  for (let i = 0; i < current.traitLevels.length; i++) {
    const currentLevel = current.traitLevels[i];
    const targetLevel = target.traitLevels[i];
    
    // Break into increments of 5 levels
    for (let level = currentLevel; level < targetLevel; level += 5) {
      const toLevel = Math.min(level + 5, targetLevel);
      
      for (let l = level; l < toLevel; l++) {
        const cost = getTraitUpgradeCost(l);
        const powerGain = getTraitUpgradePowerGain(l);
        const roi = calculateROI(powerGain, cost);
        
        steps.push({
          stepNumber: stepNumber++,
          action: 'trait_upgrade',
          fromValue: l,
          toValue: l + 1,
          cost,
          powerGain,
          roi,
          dependencies: [],
          recommendedOrder: 0,
        });
      }
    }
  }
  
  return steps;
}

/**
 * Select optimal steps using greedy algorithm with resource constraints
 * This is a variant of the fractional knapsack problem
 */
function selectOptimalSteps(
  allSteps: UpgradeStep[],
  availableResources: Resources,
  dailyIncome: Resources
): UpgradeStep[] {
  const selected: UpgradeStep[] = [];
  let remainingResources = { ...availableResources };
  
  // Sort by ROI (already sorted)
  // Greedy selection: take highest ROI steps that we can afford
  for (const step of allSteps) {
    // Check if we have resources (considering future income)
    const daysNeeded = estimateDaysToAcquireResources(step.cost, dailyIncome);
    
    // Only select if achievable within reasonable time (< 30 days per step)
    if (daysNeeded <= 30) {
      selected.push(step);
      remainingResources = subtractResources(remainingResources, step.cost);
      
      // Limit to reasonable number of steps
      if (selected.length >= 20) break;
    }
  }
  
  // Assign recommended order
  selected.forEach((step, index) => {
    step.recommendedOrder = index + 1;
  });
  
  return selected;
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Add two resource objects
 */
function addResources(a: Resources, b: Resources): Resources {
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

/**
 * Get hero rarity (mock - should be fetched from hero database)
 */
function getRarity(heroId: string): Rarity | null {
  // This should query the actual hero database
  // For now, return Legendary as default
  return 'Legendary';
}

/**
 * Get maximum level based on castle level
 */
function getMaxLevel(castleLevel: number): number {
  return Math.min(castleLevel * 5, 300);
}

/**
 * Get meta relevance score (0-1)
 * This should be based on current server meta data
 */
function getMetaRelevance(heroId: string): number {
  // Mock implementation - should query meta database
  // High-tier heroes have higher relevance
  const s_tier = ['tidecaller', 'rose-agent', 'altar-marshal', 'tree-guard'];
  if (s_tier.includes(heroId)) return 0.9;
  return 0.5;
}

/**
 * Get team synergy score (0-1)
 * Based on how well hero fits with focused heroes
 */
function getTeamSynergy(heroId: string, focusedHeroes: string[]): number {
  // Mock implementation - should check bond partners and faction synergy
  let synergy = 0.5; // Base synergy
  
  // Check if hero is already focused
  if (focusedHeroes.includes(heroId)) {
    synergy += 0.2;
  }
  
  // Check for bond partners in focused heroes
  // This should query the bond database
  
  return Math.min(synergy, 1.0);
}

/**
 * Get event utility score (0-1)
 * Based on upcoming events and hero's usefulness
 */
function getEventUtility(heroId: string): number {
  // Mock implementation - should check upcoming events
  // and hero's role/faction requirements
  return 0.6;
}

// ============================================================================
// EXPORT UTILITIES
// ============================================================================

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

/**
 * Get quick recommendations (top 3 actions)
 */
export function getQuickRecommendations(
  playerState: PlayerState
): string[] {
  const paths = optimizeHeroUpgrades(playerState, 3);
  
  return paths.map(path => {
    const topStep = path.steps[0];
    if (!topStep) return `Focus on ${path.heroId}`;
    
    return `${path.heroId}: ${formatAction(topStep.action)} ` +
           `${topStep.fromValue} → ${topStep.toValue} ` +
           `(+${topStep.powerGain} power)`;
  });
}
