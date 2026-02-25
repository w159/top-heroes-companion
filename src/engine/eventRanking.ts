/**
 * Event Ranking & Prediction Functions
 * Handles rank prediction, confidence scoring, and strategy selection.
 */

import {
  GameEvent, EventEffort, PlayerState, Resources,
  ParticipationLevel, RankPrediction, EventPerformance,
} from '../types/strategic';
import { calculateResourceValue } from './calculators';

export interface EvaluatedOption {
  targetRank: number;
  participationLevel: ParticipationLevel;
  effort: EventEffort;
  rewards: Resources;
  roi: number;
  confidence: number;
  heroTeam: string[];
  reasoning: string;
  priority: number;
}

/**
 * Predict confidence in achieving target rank
 */
export function predictRankAchievementConfidence(
  targetRank: number,
  event: GameEvent,
  playerState: PlayerState,
  historicalData?: EventPerformance[]
): number {
  let confidence = 50; // Base 50%

  // Power level vs requirements
  const powerRatio = playerState.powerLevel / event.minPowerLevel;
  if (powerRatio >= 2.0) confidence += 30;
  else if (powerRatio >= 1.5) confidence += 20;
  else if (powerRatio >= 1.2) confidence += 10;
  else confidence -= 10;

  // Historical performance
  if (historicalData && historicalData.length > 0) {
    const avgRank = historicalData.reduce((sum, p) => sum + p.finalRank, 0) / historicalData.length;
    if (targetRank >= avgRank * 1.2) confidence += 15;
    else if (targetRank >= avgRank) confidence += 10;
    else if (targetRank >= avgRank * 0.8) confidence -= 5;
    else confidence -= 15;
  }

  // Competition level
  if (event.difficulty === 'extreme') confidence -= 15;
  else if (event.difficulty === 'hard') confidence -= 10;
  else if (event.difficulty === 'easy') confidence += 10;

  // Rank difficulty
  if (targetRank === 1) confidence -= 30;
  else if (targetRank <= 3) confidence -= 20;
  else if (targetRank <= 10) confidence -= 10;

  return Math.max(0, Math.min(100, confidence));
}

/**
 * Determine participation level based on effort and ROI
 */
export function determineParticipationLevel(effort: EventEffort, roi: number): ParticipationLevel {
  if (roi >= 50 && effort.timeInvestment <= 20) return 'maximal';
  if (roi >= 25 && effort.timeInvestment <= 40) return 'moderate';
  if (roi >= 10 || effort.timeInvestment <= 10) return 'minimal';
  return 'skip';
}

/**
 * Select optimal hero team for event
 */
export function selectOptimalHeroTeam(event: GameEvent, playerState: PlayerState): string[] {
  // If event specifies required heroes, use those
  if (event.requiredHeroes && event.requiredHeroes.length > 0) {
    return event.requiredHeroes;
  }

  // Faction-specific event
  if (event.requiredFaction) {
    return playerState.ownedHeroes
      .filter(h => h.faction === event.requiredFaction)
      .sort((a, b) => (b.power || 0) - (a.power || 0))
      .slice(0, 5)
      .map(h => h.heroId);
  }

  // General: use strongest synergistic team
  const focusedHeroes = playerState.focusedHeroes;
  const strongestHeroes = playerState.ownedHeroes
    .sort((a, b) => (b.power || 0) - (a.power || 0))
    .slice(0, 5)
    .map(h => h.heroId);

  // Prioritize focused heroes if they're strong enough
  return [...focusedHeroes, ...strongestHeroes].slice(0, 5);
}

/**
 * Calculate event priority score
 */
export function calculateEventPriority(
  event: GameEvent,
  effort: EventEffort,
  rewards: Resources,
  confidence: number,
  playerState: PlayerState
): number {
  let priority = 50; // Base priority

  // Event priority
  priority += event.priority * 5;

  // ROI factor
  const resourceValue = calculateResourceValue(rewards);
  const roi = effort.timeInvestment > 0 ? resourceValue / effort.timeInvestment : 0;
  if (roi >= 100) priority += 20;
  else if (roi >= 50) priority += 15;
  else if (roi >= 25) priority += 10;
  else if (roi < 10) priority -= 10;

  // Confidence factor
  priority += (confidence - 50) / 5;

  // Effort factor (lower effort = higher priority)
  if (effort.timeInvestment <= 10) priority += 10;
  else if (effort.timeInvestment <= 20) priority += 5;
  else if (effort.timeInvestment >= 40) priority -= 10;

  // Urgency
  if (effort.urgency === 'high') priority += 15;
  else if (effort.urgency === 'low') priority -= 5;

  return Math.max(0, Math.min(100, priority));
}

/**
 * Calculate overall strategy score
 */
export function calculateStrategyScore(option: EvaluatedOption, playerState: PlayerState): number {
  const weights = {
    roi: 0.35,
    confidence: 0.25,
    priority: 0.20,
    effortInverse: 0.20,
  };

  // Normalize metrics
  const roiScore = Math.min(100, option.roi * 2); // ROI up to 50 = 100 score
  const confidenceScore = option.confidence;
  const priorityScore = option.priority;
  const effortScore = Math.max(0, 100 - option.effort.timeInvestment * 2);

  const totalScore =
    roiScore * weights.roi +
    confidenceScore * weights.confidence +
    priorityScore * weights.priority +
    effortScore * weights.effortInverse;

  return totalScore;
}

/**
 * Select optimal strategy from evaluated options
 */
export function selectOptimalStrategy(
  options: EvaluatedOption[],
  playerState: PlayerState
): EvaluatedOption {
  // Score each option
  const scoredOptions = options.map(option => ({
    ...option,
    score: calculateStrategyScore(option, playerState),
  }));

  // Return highest scoring option
  scoredOptions.sort((a, b) => b.score - a.score);
  return scoredOptions[0];
}

/**
 * Generate reasoning for strategy
 */
export function generateReasoning(
  targetRank: number,
  effort: EventEffort,
  rewards: Resources,
  roi: number,
  confidence: number
): string {
  const resourceValue = calculateResourceValue(rewards);

  let reasoning = `Target rank ${targetRank} offers rewards worth ${resourceValue.toFixed(0)} value `;
  reasoning += `for ${effort.timeInvestment.toFixed(1)} hours of effort (ROI: ${roi.toFixed(1)}). `;
  reasoning += `Confidence in achieving this rank: ${confidence}%. `;

  if (roi >= 50) {
    reasoning += 'Excellent return on investment - highly recommended.';
  } else if (roi >= 25) {
    reasoning += 'Good return on investment - recommended for most players.';
  } else if (roi >= 10) {
    reasoning += 'Moderate return - consider if resources allow.';
  } else {
    reasoning += 'Low return on investment - may not be worth the effort.';
  }

  return reasoning;
}

/**
 * Predict final rank based on current points and trends
 */
export function predictFinalRank(
  currentPoints: number,
  currentRank: number,
  event: GameEvent,
  hoursRemaining: number,
  historicalTrends?: unknown
): RankPrediction {
  // Calculate projected points based on current pace
  const hoursElapsed = event.duration - hoursRemaining;
  const pointsPerHour = hoursElapsed > 0 ? currentPoints / hoursElapsed : 0;
  const projectedPoints = currentPoints + (pointsPerHour * hoursRemaining * 0.8); // 80% efficiency assumption

  // Estimate rank cutoffs based on competition
  const cutoffRanks = estimateRankCutoffs(event, hoursRemaining);

  // Find projected rank
  let projectedRank = currentRank;
  for (const [rank, points] of Object.entries(cutoffRanks)) {
    if (projectedPoints >= points) {
      projectedRank = parseInt(rank);
      break;
    }
  }

  // Calculate confidence
  const rankChange = Math.abs(projectedRank - currentRank);
  const confidence = Math.max(40, 90 - rankChange * 2);

  // Determine trend
  const trend = projectedRank < currentRank ? 'improving' :
                projectedRank > currentRank ? 'declining' : 'stable';

  return {
    event: event.id,
    currentPoints,
    projectedPoints,
    currentRank,
    projectedRank,
    confidence,
    topPlayerPoints: cutoffRanks[1] || projectedPoints * 2,
    averageTopTenPoints: cutoffRanks[10] || projectedPoints * 1.5,
    cutoffRanks,
    pointsNeededForTarget: 0, // Would calculate based on target
    effortNeededForTarget: 0,
    feasibility: 'achievable',
    lastUpdated: new Date(),
    trend,
  };
}

/**
 * Estimate rank cutoff points
 */
function estimateRankCutoffs(event: GameEvent, hoursRemaining: number): Record<number, number> {
  // This would use historical data + current trends
  // For now, use simple estimates based on event difficulty
  const baseMultiplier = {
    'easy': 1.0,
    'medium': 1.5,
    'hard': 2.0,
    'extreme': 3.0,
  }[event.difficulty];

  const basePoints = 10000 * baseMultiplier;

  return {
    1: basePoints * 3.0,
    3: basePoints * 2.5,
    10: basePoints * 2.0,
    50: basePoints * 1.5,
    100: basePoints * 1.2,
    500: basePoints * 1.0,
    1000: basePoints * 0.8,
    5000: basePoints * 0.5,
  };
}
