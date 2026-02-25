/**
 * Event Strategy Optimizer
 *
 * Implements multi-objective optimization for event participation decisions.
 * Uses Pareto optimization to balance reward maximization vs effort minimization.
 *
 * Core Algorithm:
 * 1. Analyze player state and event requirements
 * 2. Calculate required effort for different rank targets
 * 3. Predict rewards for each target rank
 * 4. Compute ROI (reward value per hour of effort)
 * 5. Identify optimal participation strategy
 * 6. Generate actionable recommendations
 *
 * @module eventStrategyOptimizer
 */

import {
  GameEvent,
  EventStrategy,
  EventEffort,
  EventRecommendation,
  PreparationStep,
  EventRisk,
  AlternativeStrategy,
  PlayerState,
  Resources,
  ParticipationLevel,
  RankPrediction,
  EventPerformance,
  MultiEventStrategy,
  EventScheduleEntry,
  EventConflict,
  ConflictResolution,
} from '../types/strategic';
import { calculateResourceValue } from './calculators';
import {
  getRankDifficultyMultiplier,
  estimateResourceRequirements,
  estimateConsumableRequirements,
  calculateExpectedRewards,
  hasEnoughResources,
  getDailyResourceIncome,
  calculateResourceDeficit,
} from './eventRewards';
import {
  EvaluatedOption,
  predictRankAchievementConfidence,
  determineParticipationLevel,
  selectOptimalHeroTeam,
  calculateEventPriority,
  calculateStrategyScore,
  selectOptimalStrategy,
  generateReasoning,
  predictFinalRank,
} from './eventRanking';
import {
  generateRecommendations,
  createPreparationPlan,
  identifyEventRisks,
  generateAlternativeStrategies,
  createSkipStrategy,
} from './eventPreparation';
import { optimizeMultiEventStrategy } from './multiEventStrategy';

// ============================================================================
// MAIN OPTIMIZER FUNCTION
// ============================================================================

/**
 * Optimize event participation strategy
 */
export function optimizeEventStrategy(
  event: GameEvent,
  playerState: PlayerState,
  historicalData?: EventPerformance[]
): EventStrategy {
  // Step 1: Check basic eligibility
  if (!isEligibleForEvent(event, playerState)) {
    return createSkipStrategy(event, 'Player does not meet event requirements');
  }

  // Step 2: Calculate effort for different rank targets
  const rankOptions = generateRankOptions(event, playerState);

  // Step 3: Evaluate each option
  const evaluatedOptions = rankOptions.map(option =>
    evaluateRankOption(option, event, playerState, historicalData)
  );

  // Step 4: Select optimal strategy using multi-objective optimization
  const optimalOption = selectOptimalStrategy(evaluatedOptions, playerState);

  // Step 5: Generate detailed recommendations
  const recommendations = generateRecommendations(optimalOption, event, playerState);

  // Step 6: Identify risks and alternatives
  const risks = identifyEventRisks(optimalOption, event, playerState);
  const alternatives = generateAlternativeStrategies(evaluatedOptions, optimalOption);

  // Step 7: Create preparation plan
  const preparationSteps = createPreparationPlan(optimalOption, event, playerState);

  return {
    event,
    participation: optimalOption.participationLevel,
    targetRank: optimalOption.targetRank,
    confidenceScore: optimalOption.confidence,
    requiredEffort: optimalOption.effort,
    expectedRewards: optimalOption.rewards,
    roi: optimalOption.roi,
    recommendations,
    heroComposition: optimalOption.heroTeam,
    preparationSteps,
    risks,
    alternatives,
    reasoning: optimalOption.reasoning,
    priority: optimalOption.priority,
  };
}

// ============================================================================
// ELIGIBILITY AND RANK OPTIONS
// ============================================================================

/**
 * Check if player meets basic event requirements
 */
function isEligibleForEvent(event: GameEvent, playerState: PlayerState): boolean {
  if (playerState.powerLevel < event.minPowerLevel) return false;
  if (playerState.castleLevel < event.minCastleLevel) return false;

  if (event.requiredHeroes && event.requiredHeroes.length > 0) {
    const playerHeroIds = playerState.ownedHeroes.map(h => h.heroId);
    if (!event.requiredHeroes.every(id => playerHeroIds.includes(id))) return false;
  }

  return true;
}

interface RankOption {
  targetRank: number;
  rewardTier: string;
  baseRewards: Resources;
}

function generateRankOptions(event: GameEvent, playerState: PlayerState): RankOption[] {
  const options: RankOption[] = [];
  const rankThresholds = [1, 3, 10, 50, 100, 500, 1000, 5000];

  for (const rank of rankThresholds) {
    if (rank > event.expectedParticipants) continue;

    const rewardTier = event.rankRewards.find(
      r => rank >= r.minRank && rank <= r.maxRank
    );

    if (rewardTier) {
      options.push({
        targetRank: rank,
        rewardTier: `Top ${rank}`,
        baseRewards: rewardTier.rewards,
      });
    }
  }

  return options;
}

// ============================================================================
// STRATEGY EVALUATION
// ============================================================================

function evaluateRankOption(
  option: RankOption,
  event: GameEvent,
  playerState: PlayerState,
  historicalData?: EventPerformance[]
): EvaluatedOption {
  const effort = calculateRequiredEffort(option.targetRank, event, playerState);
  const rewards = calculateExpectedRewards(option.targetRank, event);
  const resourceValue = calculateResourceValue(rewards);
  const roi = effort.timeInvestment > 0 ? resourceValue / effort.timeInvestment : 0;
  const confidence = predictRankAchievementConfidence(option.targetRank, event, playerState, historicalData);
  const participationLevel = determineParticipationLevel(effort, roi);
  const heroTeam = selectOptimalHeroTeam(event, playerState);
  const priority = calculateEventPriority(event, effort, rewards, confidence, playerState);
  const reasoning = generateReasoning(option.targetRank, effort, rewards, roi, confidence);

  return {
    targetRank: option.targetRank,
    participationLevel,
    effort,
    rewards,
    roi,
    confidence,
    heroTeam,
    reasoning,
    priority,
  };
}

/**
 * Calculate effort required to achieve target rank
 */
function calculateRequiredEffort(
  targetRank: number,
  event: GameEvent,
  playerState: PlayerState
): EventEffort {
  const baseTimeRequirements: Record<string, number> = {
    server_battle: 20, tower_rush: 15, boss_raid: 10, treasure_hunt: 8,
    hero_trial: 12, season_event: 25, guild_war: 30, arena_tournament: 18,
    campaign_blitz: 6, collection_event: 10,
  };

  const baseTime = baseTimeRequirements[event.type] || 15;
  const rankMultiplier = getRankDifficultyMultiplier(targetRank, event);
  const powerRatio = playerState.powerLevel / event.minPowerLevel;
  const powerMultiplier = Math.max(0.5, Math.min(2.0, 2.0 / powerRatio));

  const totalTime = baseTime * rankMultiplier * powerMultiplier;
  const dailyTime = totalTime / (event.duration / 24);
  const resourcesNeeded = estimateResourceRequirements(targetRank, event, playerState);
  const consumablesNeeded = estimateConsumableRequirements(targetRank, event);
  const heroesRequired = identifyRequiredHeroes(event, playerState);
  const minHeroPower = event.minPowerLevel * 0.2;
  const recommendedPower = minHeroPower * 1.5;
  const preparationTime = calculatePreparationTime(resourcesNeeded, heroesRequired, playerState);

  const daysUntilEvent = (event.startDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24);
  const urgency = daysUntilEvent < 3 ? 'high' : daysUntilEvent < 7 ? 'medium' : 'low';

  return {
    timeInvestment: totalTime, dailyTimeRequired: dailyTime,
    resourcesNeeded, consumablesNeeded, heroesRequired,
    minHeroPower, recommendedPower, preparationTime, urgency,
  };
}

function identifyRequiredHeroes(event: GameEvent, playerState: PlayerState): string[] {
  if (event.requiredHeroes) return event.requiredHeroes;

  if (event.requiredFaction) {
    return playerState.ownedHeroes
      .filter(h => h.faction === event.requiredFaction)
      .slice(0, 5)
      .map(h => h.heroId);
  }

  return playerState.ownedHeroes
    .sort((a, b) => (b.power || 0) - (a.power || 0))
    .slice(0, 5)
    .map(h => h.heroId);
}

function calculatePreparationTime(
  resourcesNeeded: Resources,
  heroesRequired: string[],
  playerState: PlayerState
): number {
  if (hasEnoughResources(playerState.resources, resourcesNeeded)) return 0;

  const dailyIncome = getDailyResourceIncome(playerState);
  const missingValue = calculateResourceDeficit(playerState.resources, resourcesNeeded);
  const daysNeeded = Math.ceil(missingValue / calculateResourceValue(dailyIncome));
  return Math.max(1, Math.min(14, daysNeeded));
}

// ============================================================================
// RE-EXPORTS for backward compatibility
// ============================================================================

export {
  type EvaluatedOption,
  type RankOption,
  calculateRequiredEffort,
  calculateExpectedRewards,
  predictRankAchievementConfidence,
  generateRecommendations,
  createPreparationPlan,
  identifyEventRisks,
  predictFinalRank,
  optimizeMultiEventStrategy,
};
