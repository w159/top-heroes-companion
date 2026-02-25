/**
 * Event Strategy System Types
 */

import { Faction, Rarity } from '@/shared/types/types';
import { Resources, PlayerState } from './playerState';

// ============================================================================
// EVENT TYPE ENUMS
// ============================================================================

/**
 * Game event types
 */
export type EventType =
  | 'server_battle'      // Cross-server PvP
  | 'tower_rush'         // Faction tower climbing
  | 'boss_raid'          // Guild boss battles
  | 'treasure_hunt'      // Resource gathering
  | 'hero_trial'         // Hero-specific challenges
  | 'season_event'       // Limited-time seasonal events
  | 'guild_war'          // Guild vs Guild
  | 'arena_tournament'   // PvP tournament
  | 'campaign_blitz'     // Campaign speed runs
  | 'collection_event';  // Hero collection missions

/**
 * Participation level strategy
 */
export type ParticipationLevel = 'skip' | 'minimal' | 'moderate' | 'maximal';

/**
 * Event difficulty and competition level
 */
export type EventDifficulty = 'easy' | 'medium' | 'hard' | 'extreme';

// ============================================================================
// GAME EVENT TYPES
// ============================================================================

/**
 * Game event definition
 */
export interface GameEvent {
  id: string;
  name: string;
  type: EventType;
  difficulty: EventDifficulty;

  // Timing
  startDate: Date;
  endDate: Date;
  duration: number; // hours

  // Requirements
  minPowerLevel: number;
  minCastleLevel: number;
  requiredHeroes?: string[]; // Specific heroes needed
  requiredFaction?: Faction;

  // Rewards structure
  rewards: EventRewards;
  rankRewards: RankReward[];

  // Competition
  expectedParticipants: number;
  serverWide: boolean;
  crossServer: boolean;

  // Meta
  tags: string[];
  priority: number; // How important this event is (1-10)
}

/**
 * Event rewards structure
 */
export interface EventRewards {
  participation: Resources; // Base rewards for participating
  milestone: MilestoneReward[];
  ranking: RankReward[];
  exclusive: ExclusiveReward[];
}

/**
 * Milestone reward (points-based)
 */
export interface MilestoneReward {
  points: number;
  rewards: Resources;
  items?: string[];
}

/**
 * Rank-based reward
 */
export interface RankReward {
  minRank: number;
  maxRank: number;
  rewards: Resources;
  exclusiveItems?: string[];
  gems: number;
  heroShards?: Record<string, number>;
}

/**
 * Exclusive event rewards
 */
export interface ExclusiveReward {
  itemId: string;
  itemName: string;
  rarity: Rarity;
  quantity: number;
  requiresRank?: number;
}

// ============================================================================
// STRATEGY TYPES
// ============================================================================

/**
 * Event participation strategy recommendation
 */
export interface EventStrategy {
  event: GameEvent;

  // Recommended approach
  participation: ParticipationLevel;
  targetRank: number;
  confidenceScore: number; // 0-100, confidence in achieving target

  // Effort analysis
  requiredEffort: EventEffort;
  expectedRewards: Resources;
  roi: number; // Reward value per hour of effort

  // Strategy details
  recommendations: EventRecommendation[];
  heroComposition: string[]; // Optimal team for this event
  preparationSteps: PreparationStep[];

  // Risk assessment
  risks: EventRisk[];
  alternatives: AlternativeStrategy[];

  // Meta
  reasoning: string;
  priority: number; // 0-100
}

/**
 * Effort required for event participation
 */
export interface EventEffort {
  // Time investment
  timeInvestment: number; // Total hours needed
  dailyTimeRequired: number; // Hours per day

  // Resources needed
  resourcesNeeded: Resources;
  consumablesNeeded: Record<string, number>; // Energy, tickets, etc.

  // Hero requirements
  heroesRequired: string[];
  minHeroPower: number;
  recommendedPower: number;

  // Preparation
  preparationTime: number; // Days needed to prepare
  urgency: 'low' | 'medium' | 'high';
}

/**
 * Specific event recommendation
 */
export interface EventRecommendation {
  category: 'preparation' | 'execution' | 'optimization' | 'recovery';
  priority: 'low' | 'medium' | 'high' | 'critical';
  action: string;
  reasoning: string;
  impact: string;
  timeframe?: string;
}

/**
 * Preparation step for event
 */
export interface PreparationStep {
  step: number;
  title: string;
  description: string;
  timeRequired: number; // hours
  resources?: Resources;
  deadline?: Date; // Complete by this date
  status?: 'pending' | 'in_progress' | 'completed';
}

/**
 * Event participation risk
 */
export interface EventRisk {
  type: 'competition' | 'resources' | 'time' | 'hero_strength' | 'meta';
  severity: 'low' | 'medium' | 'high';
  description: string;
  mitigation: string;
  impact: string;
}

/**
 * Alternative strategy option
 */
export interface AlternativeStrategy {
  approach: string;
  targetRank: number;
  effort: EventEffort;
  expectedRewards: Resources;
  roi: number;
  pros: string[];
  cons: string[];
}

/**
 * Rank prediction model data
 */
export interface RankPrediction {
  event: string;

  // Player's position
  currentPoints: number;
  projectedPoints: number;
  currentRank: number;
  projectedRank: number;
  confidence: number; // 0-100

  // Competition analysis
  topPlayerPoints: number;
  averageTopTenPoints: number;
  cutoffRanks: Record<number, number>; // rank -> points needed

  // Recommendations
  pointsNeededForTarget: number;
  effortNeededForTarget: number; // hours
  feasibility: 'easy' | 'achievable' | 'difficult' | 'unrealistic';

  // Updates
  lastUpdated: Date;
  trend: 'improving' | 'stable' | 'declining';
}

/**
 * Event performance tracking
 */
export interface EventPerformance {
  eventId: string;
  userId: string;

  // Participation
  participated: boolean;
  participationLevel: ParticipationLevel;

  // Results
  finalRank: number;
  finalPoints: number;
  rewardsEarned: Resources;

  // Effort
  timeInvested: number; // hours
  resourcesSpent: Resources;

  // Analysis
  roi: number;
  targetMet: boolean;
  efficiency: number; // 0-100

  // Learning
  lessonsLearned: string[];
  nextTimeStrategy: string;
}
