/**
 * Event Preparation & Risk Functions
 *
 * Handles preparation plans, risk identification, recommendations,
 * alternative strategies, and skip strategy generation.
 */

import {
  GameEvent,
  EventStrategy,
  EventRecommendation,
  PreparationStep,
  EventRisk,
  AlternativeStrategy,
  PlayerState,
  Resources,
} from '@/types/strategic';
import { EvaluatedOption, calculateStrategyScore } from './eventRanking';

// ============================================================================
// RECOMMENDATIONS
// ============================================================================

/**
 * Generate actionable recommendations
 */
export function generateRecommendations(
  option: EvaluatedOption,
  event: GameEvent,
  playerState: PlayerState
): EventRecommendation[] {
  const recommendations: EventRecommendation[] = [];

  // Preparation recommendations
  if (option.effort.preparationTime > 0) {
    recommendations.push({
      category: 'preparation',
      priority: 'high',
      action: `Begin preparation ${option.effort.preparationTime} days before event starts`,
      reasoning: 'Resource acquisition takes time',
      impact: 'Ensures readiness for optimal performance',
      timeframe: `${option.effort.preparationTime} days`,
    });
  }

  // Hero recommendations
  recommendations.push({
    category: 'preparation',
    priority: 'high',
    action: `Prepare your strongest ${option.heroTeam.length} heroes: ${option.heroTeam.join(', ')}`,
    reasoning: 'Optimal team composition for this event type',
    impact: 'Maximizes performance and efficiency',
  });

  // Execution recommendations
  recommendations.push({
    category: 'execution',
    priority: 'medium',
    action: `Allocate ${option.effort.dailyTimeRequired.toFixed(1)} hours per day`,
    reasoning: `Total ${option.effort.timeInvestment.toFixed(1)} hours needed over ${event.duration / 24} days`,
    impact: 'Achieves target rank with consistent effort',
  });

  // Resource management
  if (option.effort.resourcesNeeded.gems > 0) {
    recommendations.push({
      category: 'optimization',
      priority: 'medium',
      action: `Reserve ${option.effort.resourcesNeeded.gems} gems for event refreshes`,
      reasoning: 'Gems provide highest efficiency for rank pushing',
      impact: 'Maintains competitive pace without resource depletion',
    });
  }

  // Timing optimization
  const eventDuration = event.duration / 24;
  recommendations.push({
    category: 'optimization',
    priority: 'low',
    action: `Focus effort in the final ${Math.max(1, eventDuration * 0.3).toFixed(0)} days`,
    reasoning: 'Late push is more resource-efficient in competitive events',
    impact: 'Reduces total resource expenditure while maintaining rank',
  });

  return recommendations;
}

// ============================================================================
// PREPARATION PLAN
// ============================================================================

/**
 * Create detailed preparation plan
 */
export function createPreparationPlan(
  option: EvaluatedOption,
  event: GameEvent,
  playerState: PlayerState
): PreparationStep[] {
  const steps: PreparationStep[] = [];
  const prepDays = option.effort.preparationTime;

  if (prepDays === 0) {
    steps.push({
      step: 1,
      title: 'Ready to participate',
      description: 'You have all required resources and heroes prepared',
      timeRequired: 0,
      status: 'completed',
    });
    return steps;
  }

  // Step 1: Resource acquisition
  steps.push({
    step: 1,
    title: 'Acquire required resources',
    description: `Gather ${option.effort.resourcesNeeded.gold} gold, ${option.effort.resourcesNeeded.gems} gems, and other materials`,
    timeRequired: prepDays * 0.4,
    deadline: new Date(event.startDate.getTime() - (prepDays * 0.6 * 24 * 60 * 60 * 1000)),
    status: 'pending',
  });

  // Step 2: Hero preparation
  steps.push({
    step: 2,
    title: 'Strengthen hero team',
    description: `Ensure ${option.heroTeam.join(', ')} meet minimum power requirements`,
    timeRequired: prepDays * 0.3,
    deadline: new Date(event.startDate.getTime() - (prepDays * 0.3 * 24 * 60 * 60 * 1000)),
    status: 'pending',
  });

  // Step 3: Strategy review
  steps.push({
    step: 3,
    title: 'Review event mechanics',
    description: 'Understand scoring system and optimal strategies',
    timeRequired: 1,
    deadline: new Date(event.startDate.getTime() - (1 * 24 * 60 * 60 * 1000)),
    status: 'pending',
  });

  // Step 4: Final check
  steps.push({
    step: 4,
    title: 'Final readiness check',
    description: 'Verify all resources, heroes, and consumables are prepared',
    timeRequired: 0.5,
    deadline: event.startDate,
    status: 'pending',
  });

  return steps;
}

// ============================================================================
// RISK IDENTIFICATION
// ============================================================================

/**
 * Identify potential risks
 */
export function identifyEventRisks(
  option: EvaluatedOption,
  event: GameEvent,
  playerState: PlayerState
): EventRisk[] {
  const risks: EventRisk[] = [];

  // Competition risk
  if (event.difficulty === 'extreme' || event.crossServer) {
    risks.push({
      type: 'competition',
      severity: event.difficulty === 'extreme' ? 'high' : 'medium',
      description: 'High competition level may make target rank difficult to achieve',
      mitigation: 'Consider more conservative rank target or increase effort',
      impact: 'May fall short of target rank by 10-30 positions',
    });
  }

  // Resource risk
  if (option.effort.preparationTime > 3) {
    risks.push({
      type: 'resources',
      severity: 'medium',
      description: 'Limited time to acquire all needed resources',
      mitigation: 'Prioritize essential resources, consider gem purchases for F2P alternatives',
      impact: 'May need to reduce participation level if resources unavailable',
    });
  }

  // Time commitment risk
  if (option.effort.dailyTimeRequired > 3) {
    risks.push({
      type: 'time',
      severity: 'medium',
      description: `High daily time commitment (${option.effort.dailyTimeRequired.toFixed(1)} hours/day)`,
      mitigation: 'Plan schedule ahead, consider dropping to lower rank target',
      impact: 'Burnout or inability to maintain participation',
    });
  }

  // Hero strength risk
  const powerRatio = playerState.powerLevel / event.minPowerLevel;
  if (powerRatio < 1.3) {
    risks.push({
      type: 'hero_strength',
      severity: 'high',
      description: 'Hero power may be insufficient for competitive performance',
      mitigation: 'Upgrade key heroes before event starts, focus on synergy',
      impact: 'May require significantly more time/resources to achieve target',
    });
  }

  return risks;
}

// ============================================================================
// ALTERNATIVE STRATEGIES
// ============================================================================

/**
 * Generate alternative strategies
 */
export function generateAlternativeStrategies(
  allOptions: EvaluatedOption[],
  selectedOption: EvaluatedOption
): AlternativeStrategy[] {
  const alternatives: AlternativeStrategy[] = [];

  // Show top 3 alternatives
  const otherOptions = allOptions
    .filter(opt => opt.targetRank !== selectedOption.targetRank)
    .sort((a, b) => calculateStrategyScore(b, {} as PlayerState) - calculateStrategyScore(a, {} as PlayerState))
    .slice(0, 3);

  for (const option of otherOptions) {
    const isMoreAggressive = option.targetRank < selectedOption.targetRank;

    alternatives.push({
      approach: isMoreAggressive ? `More aggressive: Target rank ${option.targetRank}` :
                `More conservative: Target rank ${option.targetRank}`,
      targetRank: option.targetRank,
      effort: option.effort,
      expectedRewards: option.rewards,
      roi: option.roi,
      pros: isMoreAggressive ?
        ['Higher rewards', 'Better exclusive items'] :
        ['Lower time commitment', 'Higher success probability', 'Less stressful'],
      cons: isMoreAggressive ?
        ['Much higher time investment', 'Lower success probability', 'Higher resource cost'] :
        ['Lower rewards', 'Missing top-tier exclusive items'],
    });
  }

  return alternatives;
}

// ============================================================================
// SKIP STRATEGY
// ============================================================================

/**
 * Create skip strategy
 */
export function createSkipStrategy(event: GameEvent, reason: string): EventStrategy {
  return {
    event,
    participation: 'skip',
    targetRank: -1,
    confidenceScore: 0,
    requiredEffort: {
      timeInvestment: 0,
      dailyTimeRequired: 0,
      resourcesNeeded: {} as Resources,
      consumablesNeeded: {},
      heroesRequired: [],
      minHeroPower: 0,
      recommendedPower: 0,
      preparationTime: 0,
      urgency: 'low',
    },
    expectedRewards: {} as Resources,
    roi: 0,
    recommendations: [{
      category: 'execution',
      priority: 'critical',
      action: 'Skip this event',
      reasoning: reason,
      impact: 'Focus resources on better opportunities',
    }],
    heroComposition: [],
    preparationSteps: [],
    risks: [],
    alternatives: [],
    reasoning: reason,
    priority: 0,
  };
}
