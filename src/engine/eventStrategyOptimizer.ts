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

// ============================================================================
// MAIN OPTIMIZER FUNCTION
// ============================================================================

/**
 * Optimize event participation strategy
 * 
 * Analyzes a game event and player state to determine:
 * - Whether to participate and at what level
 * - Target rank to aim for
 * - Required effort and resources
 * - Expected rewards and ROI
 * - Step-by-step preparation plan
 * 
 * @param event - The game event to analyze
 * @param playerState - Current player state
 * @param historicalData - Past event performance (optional)
 * @returns Optimal event strategy
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
// ELIGIBILITY AND PREPARATION
// ============================================================================

/**
 * Check if player meets basic event requirements
 */
function isEligibleForEvent(event: GameEvent, playerState: PlayerState): boolean {
  // Power level check
  if (playerState.powerLevel < event.minPowerLevel) {
    return false;
  }
  
  // Castle level check
  if (playerState.castleLevel < event.minCastleLevel) {
    return false;
  }
  
  // Required heroes check
  if (event.requiredHeroes && event.requiredHeroes.length > 0) {
    const playerHeroIds = playerState.ownedHeroes.map(h => h.heroId);
    const hasAllRequired = event.requiredHeroes.every(id => playerHeroIds.includes(id));
    if (!hasAllRequired) {
      return false;
    }
  }
  
  return true;
}

/**
 * Generate potential rank target options
 */
interface RankOption {
  targetRank: number;
  rewardTier: string;
  baseRewards: Resources;
}

function generateRankOptions(event: GameEvent, playerState: PlayerState): RankOption[] {
  const options: RankOption[] = [];
  
  // Define key rank thresholds based on typical reward tiers
  const rankThresholds = [1, 3, 10, 50, 100, 500, 1000, 5000];
  
  for (const rank of rankThresholds) {
    // Only consider realistic ranks based on server competition
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

interface EvaluatedOption {
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
 * Evaluate a specific rank target option
 */
function evaluateRankOption(
  option: RankOption,
  event: GameEvent,
  playerState: PlayerState,
  historicalData?: EventPerformance[]
): EvaluatedOption {
  // Calculate required effort
  const effort = calculateRequiredEffort(option.targetRank, event, playerState);
  
  // Calculate expected rewards
  const rewards = calculateExpectedRewards(option.targetRank, event);
  
  // Calculate ROI
  const resourceValue = calculateResourceValue(rewards);
  const roi = effort.timeInvestment > 0 ? resourceValue / effort.timeInvestment : 0;
  
  // Predict confidence in achieving rank
  const confidence = predictRankAchievementConfidence(
    option.targetRank,
    event,
    playerState,
    historicalData
  );
  
  // Determine participation level
  const participationLevel = determineParticipationLevel(effort, roi);
  
  // Select optimal hero team
  const heroTeam = selectOptimalHeroTeam(event, playerState);
  
  // Calculate priority score
  const priority = calculateEventPriority(event, effort, rewards, confidence, playerState);
  
  // Generate reasoning
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
  // Base time per event type
  const baseTimeRequirements: Record<string, number> = {
    server_battle: 20,
    tower_rush: 15,
    boss_raid: 10,
    treasure_hunt: 8,
    hero_trial: 12,
    season_event: 25,
    guild_war: 30,
    arena_tournament: 18,
    campaign_blitz: 6,
    collection_event: 10,
  };
  
  const baseTime = baseTimeRequirements[event.type] || 15;
  
  // Rank difficulty multiplier
  const rankMultiplier = getRankDifficultyMultiplier(targetRank, event);
  
  // Player power adjustment (weaker players need more time)
  const powerRatio = playerState.powerLevel / event.minPowerLevel;
  const powerMultiplier = Math.max(0.5, Math.min(2.0, 2.0 / powerRatio));
  
  // Total time investment
  const totalTime = baseTime * rankMultiplier * powerMultiplier;
  const dailyTime = totalTime / (event.duration / 24);
  
  // Resource requirements
  const resourcesNeeded = estimateResourceRequirements(targetRank, event, playerState);
  
  // Consumables (energy, tickets, etc.)
  const consumablesNeeded = estimateConsumableRequirements(targetRank, event);
  
  // Hero requirements
  const heroesRequired = identifyRequiredHeroes(event, playerState);
  const minHeroPower = event.minPowerLevel * 0.2; // Per hero
  const recommendedPower = minHeroPower * 1.5;
  
  // Preparation time
  const preparationTime = calculatePreparationTime(
    resourcesNeeded,
    heroesRequired,
    playerState
  );
  
  // Urgency
  const daysUntilEvent = (event.startDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24);
  const urgency = daysUntilEvent < 3 ? 'high' : daysUntilEvent < 7 ? 'medium' : 'low';
  
  return {
    timeInvestment: totalTime,
    dailyTimeRequired: dailyTime,
    resourcesNeeded,
    consumablesNeeded,
    heroesRequired,
    minHeroPower,
    recommendedPower,
    preparationTime,
    urgency,
  };
}

/**
 * Get difficulty multiplier based on target rank
 */
function getRankDifficultyMultiplier(targetRank: number, event: GameEvent): number {
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
function estimateResourceRequirements(
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
function estimateConsumableRequirements(
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
 * Identify required heroes for event
 */
function identifyRequiredHeroes(event: GameEvent, playerState: PlayerState): string[] {
  // Event-specific requirements
  if (event.requiredHeroes) {
    return event.requiredHeroes;
  }
  
  // Faction-specific events
  if (event.requiredFaction) {
    return playerState.ownedHeroes
      .filter(h => h.faction === event.requiredFaction)
      .slice(0, 5)
      .map(h => h.heroId);
  }
  
  // General: use player's strongest heroes
  return playerState.ownedHeroes
    .sort((a, b) => (b.power || 0) - (a.power || 0))
    .slice(0, 5)
    .map(h => h.heroId);
}

/**
 * Calculate preparation time needed
 */
function calculatePreparationTime(
  resourcesNeeded: Resources,
  heroesRequired: string[],
  playerState: PlayerState
): number {
  // Check if player has required resources
  const hasResources = hasEnoughResources(playerState.resources, resourcesNeeded);
  
  if (hasResources) {
    return 0; // Already prepared
  }
  
  // Estimate days to acquire missing resources
  const dailyIncome = getDailyResourceIncome(playerState);
  const missingValue = calculateResourceDeficit(
    playerState.resources,
    resourcesNeeded
  );
  
  const daysNeeded = Math.ceil(missingValue / calculateResourceValue(dailyIncome));
  return Math.max(1, Math.min(14, daysNeeded)); // Cap at 2 weeks
}

/**
 * Check if player has enough resources
 */
function hasEnoughResources(available: Resources, needed: Resources): boolean {
  if (available.gold < needed.gold) return false;
  if (available.gems < needed.gems) return false;
  if (available.experienceBottles < needed.experienceBottles) return false;
  return true;
}

/**
 * Get daily resource income
 */
function getDailyResourceIncome(playerState: PlayerState): Resources {
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
function calculateResourceDeficit(available: Resources, needed: Resources): number {
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
    enchantmentScrolls: Math.max(0, needed.enchantmentScrolls - available.enchantmentScrolls),
    refreshTickets: Math.max(0, needed.refreshTickets - available.refreshTickets),
  };
  
  return calculateResourceValue(deficit);
}

/**
 * Calculate expected rewards for target rank
 */
function calculateExpectedRewards(targetRank: number, event: GameEvent): Resources {
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
 * Predict confidence in achieving target rank
 */
function predictRankAchievementConfidence(
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
function determineParticipationLevel(effort: EventEffort, roi: number): ParticipationLevel {
  // High ROI and reasonable effort = maximal
  if (roi >= 50 && effort.timeInvestment <= 20) {
    return 'maximal';
  }
  
  // Good ROI and moderate effort = moderate
  if (roi >= 25 && effort.timeInvestment <= 40) {
    return 'moderate';
  }
  
  // Low ROI or high effort = minimal
  if (roi >= 10 || effort.timeInvestment <= 10) {
    return 'minimal';
  }
  
  // Very low ROI = skip
  return 'skip';
}

/**
 * Select optimal hero team for event
 */
function selectOptimalHeroTeam(event: GameEvent, playerState: PlayerState): string[] {
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
function calculateEventPriority(
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
 * Generate reasoning for strategy
 */
function generateReasoning(
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

// ============================================================================
// STRATEGY SELECTION
// ============================================================================

/**
 * Select optimal strategy from evaluated options
 */
function selectOptimalStrategy(
  options: EvaluatedOption[],
  playerState: PlayerState
): EvaluatedOption {
  // Multi-objective optimization:
  // 1. Maximize ROI
  // 2. Maximize confidence
  // 3. Minimize effort
  // 4. Consider player goals
  
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
 * Calculate overall strategy score
 */
function calculateStrategyScore(option: EvaluatedOption, playerState: PlayerState): number {
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

// ============================================================================
// RECOMMENDATIONS AND PLANNING
// ============================================================================

/**
 * Generate actionable recommendations
 */
function generateRecommendations(
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

/**
 * Create detailed preparation plan
 */
function createPreparationPlan(
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

/**
 * Identify potential risks
 */
function identifyEventRisks(
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

/**
 * Generate alternative strategies
 */
function generateAlternativeStrategies(
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
    const isMoreConservative = option.targetRank > selectedOption.targetRank;
    
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

/**
 * Create skip strategy
 */
function createSkipStrategy(event: GameEvent, reason: string): EventStrategy {
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

// ============================================================================
// RANK PREDICTION
// ============================================================================

/**
 * Predict final rank based on current points and trends
 */
export function predictFinalRank(
  currentPoints: number,
  currentRank: number,
  event: GameEvent,
  hoursRemaining: number,
  historicalTrends?: any
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

// ============================================================================
// MULTI-EVENT OPTIMIZATION
// ============================================================================

/**
 * Optimize participation across multiple concurrent/upcoming events
 */
export function optimizeMultiEventStrategy(
  events: GameEvent[],
  playerState: PlayerState,
  timeframe: { start: Date; end: Date }
): MultiEventStrategy {
  // Step 1: Generate strategy for each event
  const strategies = events.map(event => optimizeEventStrategy(event, playerState));
  
  // Step 2: Identify conflicts
  const conflicts = identifyEventConflicts(events, strategies);
  
  // Step 3: Resolve conflicts and select events
  const { selected, skipped, resolutions } = resolveConflicts(strategies, conflicts, playerState);
  
  // Step 4: Create resource allocation plan
  const resourceAllocation = allocateResourcesAcrossEvents(selected);
  
  // Step 5: Create time allocation plan
  const timeAllocation = allocateTimeAcrossEvents(selected);
  
  // Step 6: Create schedule
  const schedule = createEventSchedule(selected);
  
  // Step 7: Calculate totals
  const totalResources = sumResources(Object.values(resourceAllocation));
  const totalTime = Object.values(timeAllocation).reduce((sum, t) => sum + t, 0);
  const totalRewards = sumResources(selected.map(s => s.expectedRewards));
  const overallROI = totalTime > 0 ? calculateResourceValue(totalRewards) / totalTime : 0;
  
  // Step 8: Calculate feasibility
  const feasibility = calculateMultiEventFeasibility(selected, playerState);
  
  const days = (timeframe.end.getTime() - timeframe.start.getTime()) / (1000 * 60 * 60 * 24);
  
  return {
    timeframe: { ...timeframe, days },
    selectedEvents: selected,
    skippedEvents: skipped,
    totalResourcesNeeded: totalResources,
    resourceAllocation,
    totalTimeRequired: totalTime,
    timeAllocation,
    schedule,
    expectedTotalRewards: totalRewards,
    overallROI,
    feasibility,
    conflicts,
    resolutions,
  };
}

/**
 * Identify conflicts between events
 */
function identifyEventConflicts(
  events: GameEvent[],
  strategies: EventStrategy[]
): EventConflict[] {
  const conflicts: EventConflict[] = [];
  
  // Check for time overlaps
  for (let i = 0; i < events.length; i++) {
    for (let j = i + 1; j < events.length; j++) {
      const event1 = events[i];
      const event2 = events[j];
      
      const overlaps = checkTimeOverlap(event1, event2);
      if (overlaps) {
        conflicts.push({
          events: [event1.id, event2.id],
          type: 'time_overlap',
          severity: 'major',
          description: `${event1.name} and ${event2.name} run concurrently`,
        });
      }
    }
  }
  
  return conflicts;
}

/**
 * Check if two events overlap in time
 */
function checkTimeOverlap(event1: GameEvent, event2: GameEvent): boolean {
  return event1.startDate <= event2.endDate && event2.startDate <= event1.endDate;
}

/**
 * Resolve conflicts and select optimal event mix
 */
function resolveConflicts(
  strategies: EventStrategy[],
  conflicts: EventConflict[],
  playerState: PlayerState
): {
  selected: EventStrategy[];
  skipped: Array<{ event: GameEvent; reason: string }>;
  resolutions: ConflictResolution[];
} {
  // Sort by priority
  const sorted = [...strategies].sort((a, b) => b.priority - a.priority);
  
  const selected: EventStrategy[] = [];
  const skipped: Array<{ event: GameEvent; reason: string }> = [];
  const resolutions: ConflictResolution[] = [];
  
  for (const strategy of sorted) {
    // Check if this event conflicts with already selected events
    const hasConflict = conflicts.some(c => 
      c.events.includes(strategy.event.id) &&
      c.events.some(id => selected.some(s => s.event.id === id))
    );
    
    if (hasConflict) {
      skipped.push({
        event: strategy.event,
        reason: 'Conflicts with higher priority events',
      });
    } else {
      selected.push(strategy);
    }
  }
  
  return { selected, skipped, resolutions };
}

/**
 * Allocate resources across selected events
 */
function allocateResourcesAcrossEvents(strategies: EventStrategy[]): Record<string, Resources> {
  const allocation: Record<string, Resources> = {};
  
  for (const strategy of strategies) {
    allocation[strategy.event.id] = strategy.requiredEffort.resourcesNeeded;
  }
  
  return allocation;
}

/**
 * Allocate time across selected events
 */
function allocateTimeAcrossEvents(strategies: EventStrategy[]): Record<string, number> {
  const allocation: Record<string, number> = {};
  
  for (const strategy of strategies) {
    allocation[strategy.event.id] = strategy.requiredEffort.timeInvestment;
  }
  
  return allocation;
}

/**
 * Create event schedule
 */
function createEventSchedule(strategies: EventStrategy[]): EventScheduleEntry[] {
  return strategies.map(strategy => ({
    event: strategy.event,
    startTime: strategy.event.startDate,
    endTime: strategy.event.endDate,
    allocatedTime: strategy.requiredEffort.timeInvestment,
    priority: strategy.priority,
    conflicts: [],
  }));
}

/**
 * Sum resources
 */
function sumResources(resources: Resources[]): Resources {
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
    total.enchantmentScrolls += r.enchantmentScrolls || 0;
    total.refreshTickets += r.refreshTickets || 0;
  }
  
  return total;
}

/**
 * Calculate feasibility of multi-event plan
 */
function calculateMultiEventFeasibility(
  strategies: EventStrategy[],
  playerState: PlayerState
): number {
  // Check resource availability
  const totalNeeded = sumResources(strategies.map(s => s.requiredEffort.resourcesNeeded));
  const resourceScore = Math.min(100, (playerState.resources.gold / totalNeeded.gold) * 100);
  
  // Check time availability
  const totalTime = strategies.reduce((sum, s) => sum + s.requiredEffort.timeInvestment, 0);
  const maxReasonableTime = strategies.length * 30; // 30 hours per event max
  const timeScore = Math.min(100, (maxReasonableTime / totalTime) * 100);
  
  // Average confidence
  const avgConfidence = strategies.reduce((sum, s) => sum + s.confidenceScore, 0) / strategies.length;
  
  // Combined feasibility
  return (resourceScore * 0.3 + timeScore * 0.3 + avgConfidence * 0.4);
}

// ============================================================================
// EXPORTS
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
};
