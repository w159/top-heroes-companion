/**
 * Strategic Planning & Recommendation System Types
 * Comprehensive type definitions for the recommendation engine
 */

import { Hero, Faction, Rarity, SpendProfile } from '../types';

// ============================================================================
// CORE STRATEGIC TYPES
// ============================================================================

export interface PlayerState {
  userId: string;
  server: string;
  powerLevel: number;
  castleLevel: number;
  spendProfile: SpendProfile;
  vipLevel: number;
  daysSinceStart: number;
  
  // Resources
  resources: Resources;
  
  // Heroes
  ownedHeroes: UserHero[];
  focusedHeroes: string[]; // Hero IDs player is prioritizing
  
  // Progress
  campaignProgress: number; // Max chapter completed
  towerProgress: Record<Faction, number>;
  behemothLevel: number;
  
  // Metadata
  lastUpdated: Date;
  goals: ProgressionGoals;
}

export interface Resources {
  gold: number;
  gems: number;
  
  // Hero Resources
  heroShards: Record<string, number>; // heroId -> count
  soulStones: number;
  ascensionStones: Record<Rarity, number>;
  
  // Enhancement Resources
  skillBooks: number;
  traitStones: number;
  experienceBottles: number;
  
  // Equipment
  equipmentChests: Record<string, number>;
  enhancementMaterials: Record<string, number>;
  
  // Pets & Relics
  petEssence: number;
  relicFragments: number;
  
  // Event Resources
  eventTokens: Record<string, number>;
  
  // Time-based
  dailyTasksCompleted: number;
  weeklyTasksCompleted: number;
}

export interface UserHero {
  heroId: string;
  level: number;
  stars: number; // 0-5
  awakening: number; // 0-5
  skillLevels: number[]; // [ult, active1, active2, passive1, ...]
  traitLevels: number[]; // [trait1, trait2, trait3, trait4]
  power: number;
  equipment: Equipment[];
  isOwned: boolean;
}

export interface Equipment {
  slot: 'weapon' | 'armor' | 'accessory' | 'boots';
  tier: number;
  enhancement: number;
  quality: Rarity;
}

export interface ProgressionGoals {
  primary: Goal;
  secondary: Goal[];
  timeframe: number; // days
  priorities: Priority[];
}

export interface Goal {
  type: 'power' | 'campaign' | 'pvp_rank' | 'event_rank' | 'collection';
  target: number | string;
  deadline?: Date;
  importance: number; // 1-10
}

export interface Priority {
  category: 'heroes' | 'equipment' | 'pets' | 'relics' | 'research';
  weight: number; // 0-1
}

// ============================================================================
// RECOMMENDATION ENGINE TYPES
// ============================================================================

export interface Recommendation {
  id: string;
  type: RecommendationType;
  title: string;
  description: string;
  priority: number; // 1-100
  confidence: number; // 0-1
  
  // What to do
  actions: Action[];
  
  // Expected outcomes
  expectedResults: ExpectedResult[];
  
  // Requirements
  requirements: Requirement[];
  
  // Timeline
  timeline: TimelineStep[];
  
  // Alternatives
  alternatives: Recommendation[];
  
  // Validation
  reasoning: string[];
  dataSource: string[];
  lastValidated: Date;
  
  // User feedback
  userRating?: number;
  adopted?: boolean;
}

export type RecommendationType = 
  | 'hero_upgrade'
  | 'team_composition'
  | 'resource_allocation'
  | 'event_strategy'
  | 'equipment_priority'
  | 'pet_development'
  | 'relic_investment'
  | 'research_path'
  | 'campaign_push'
  | 'pvp_optimization';

export interface Action {
  id: string;
  type: string;
  description: string;
  target: string; // Hero ID, resource type, etc.
  parameters: Record<string, any>;
  cost: Resources;
  estimatedTime: number; // hours
  dependencies: string[]; // Other action IDs
}

export interface ExpectedResult {
  metric: string;
  currentValue: number;
  expectedValue: number;
  improvement: number;
  timeToAchieve: number; // days
  confidence: number; // 0-1
}

export interface Requirement {
  type: 'resource' | 'hero' | 'level' | 'time' | 'completion';
  description: string;
  isMet: boolean;
  howToMeet?: string;
}

export interface TimelineStep {
  day: number;
  milestone: string;
  actions: string[];
  checkpoints: string[];
}

// ============================================================================
// OPTIMIZATION ALGORITHM TYPES
// ============================================================================

export interface UpgradePath {
  heroId: string;
  currentState: HeroState;
  targetState: HeroState;
  steps: UpgradeStep[];
  totalCost: Resources;
  totalTime: number; // days
  powerGain: number;
  roi: number; // Power per weighted resource unit
  priority: number;
  bottlenecks: Bottleneck[];
}

export interface HeroState {
  level: number;
  stars: number;
  awakening: number;
  skillLevels: number[];
  traitLevels: number[];
  power: number;
}

export interface UpgradeStep {
  stepNumber: number;
  action: UpgradeAction;
  fromValue: number;
  toValue: number;
  cost: Resources;
  powerGain: number;
  roi: number;
  dependencies: string[];
  recommendedOrder: number;
}

export type UpgradeAction = 
  | 'level_up'
  | 'star_promotion'
  | 'awakening'
  | 'skill_upgrade'
  | 'trait_upgrade'
  | 'equipment_enhance';

export interface Bottleneck {
  resource: string;
  shortage: number;
  estimatedTimeToAcquire: number; // days
  acquisitionMethods: string[];
}

// ============================================================================
// EVENT STRATEGY TYPES
// ============================================================================

export interface EventStrategy {
  eventId: string;
  eventName: string;
  participation: ParticipationLevel;
  targetRank: number;
  targetRewards: Reward[];
  
  requiredEffort: EventEffort;
  preparation: PreparationPlan;
  execution: ExecutionPlan;
  
  roi: number; // Reward value / effort
  confidence: number;
  alternatives: EventStrategy[];
}

export type ParticipationLevel = 'skip' | 'minimal' | 'moderate' | 'competitive' | 'maximal';

export interface EventEffort {
  timeInvestment: number; // hours
  resourcesNeeded: Resources;
  heroesRequired: string[];
  powerThreshold: number;
  preparationDays: number;
  dailyCommitment: number; // hours per day
}

export interface PreparationPlan {
  startDate: Date;
  endDate: Date;
  tasks: PreparationTask[];
  checkpoints: Checkpoint[];
}

export interface PreparationTask {
  task: string;
  deadline: Date;
  priority: number;
  estimatedTime: number; // hours
  status: 'pending' | 'in_progress' | 'completed';
}

export interface Checkpoint {
  date: Date;
  criteria: string[];
  fallbackPlan?: string;
}

export interface ExecutionPlan {
  phases: EventPhase[];
  strategies: string[];
  contingencies: Contingency[];
}

export interface EventPhase {
  phase: number;
  name: string;
  duration: number; // hours
  objectives: string[];
  tactics: string[];
  resourceUsage: Resources;
}

export interface Contingency {
  trigger: string;
  response: string;
  impactOnGoal: 'none' | 'minor' | 'major' | 'critical';
}

export interface Reward {
  type: string;
  amount: number;
  value: number; // Estimated resource value
}

// ============================================================================
// RESOURCE ALLOCATION TYPES
// ============================================================================

export interface ResourcePlan {
  planId: string;
  timeHorizon: number; // days
  allocation: AllocationMatrix;
  priorities: AllocationPriority[];
  timeline: AllocationTimeline[];
  expectedOutcome: PlanOutcome;
  alternatives: ResourcePlan[];
  confidence: number;
}

export interface AllocationMatrix {
  resources: Record<string, ResourceAllocation>;
  totalValue: number;
  efficiency: number;
}

export interface ResourceAllocation {
  resource: string;
  amount: number;
  allocations: {
    category: string;
    amount: number;
    priority: number;
    expectedReturn: number;
  }[];
}

export interface AllocationPriority {
  category: string;
  weight: number;
  rationale: string;
}

export interface AllocationTimeline {
  day: number;
  allocations: Record<string, number>;
  milestones: string[];
}

export interface PlanOutcome {
  powerGain: number;
  progressionRate: number;
  resourceEfficiency: number;
  goalAchievementProbability: number;
  risks: Risk[];
}

export interface Risk {
  description: string;
  probability: number; // 0-1
  impact: 'low' | 'medium' | 'high' | 'critical';
  mitigation: string;
}

// ============================================================================
// META ANALYSIS TYPES
// ============================================================================

export interface MetaAnalysis {
  server: string;
  timestamp: Date;
  topHeroes: HeroMetaRank[];
  topTeams: TeamComposition[];
  trends: MetaTrend[];
  counters: CounterStrategy[];
  recommendations: MetaRecommendation[];
}

export interface HeroMetaRank {
  heroId: string;
  rank: number;
  usage: number; // 0-1, percentage of top players using
  winRate: number; // 0-1
  trend: 'rising' | 'stable' | 'falling';
  tier: string;
  reasons: string[];
}

export interface TeamComposition {
  name: string;
  heroes: string[];
  winRate: number;
  usage: number;
  strengths: string[];
  weaknesses: string[];
  counters: string[];
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface MetaTrend {
  type: 'hero' | 'team' | 'strategy';
  subject: string;
  direction: 'increasing' | 'decreasing';
  magnitude: number;
  startDate: Date;
  predictedDuration: number; // days
  confidence: number;
}

export interface CounterStrategy {
  target: string; // Hero or team name
  counters: CounterOption[];
  effectiveness: number; // 0-1
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface CounterOption {
  type: 'hero' | 'team' | 'tactic';
  description: string;
  heroes?: string[];
  effectiveness: number;
  requirements: string[];
}

export interface MetaRecommendation {
  recommendation: string;
  category: 'invest' | 'develop' | 'avoid' | 'counter';
  priority: number;
  timeHorizon: 'immediate' | 'short' | 'medium' | 'long';
  reasoning: string[];
}

// ============================================================================
// SIMULATION & TESTING TYPES
// ============================================================================

export interface Scenario {
  id: string;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  category: string;
  
  initialState: PlayerState;
  objectives: ScenarioObjective[];
  constraints: ScenarioConstraint[];
  
  optimalSolution: Solution;
  acceptableSolutions: Solution[];
  
  learningPoints: LearningPoint[];
  relatedConcepts: string[];
}


// ============================================================================
// EVENT STRATEGY SYSTEM TYPES
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

/**
 * Event schedule with all upcoming events
 */
export interface EventSchedule {
  server: string;
  currentEvents: GameEvent[];
  upcomingEvents: GameEvent[];
  recurringEvents: RecurringEvent[];
  lastUpdated: Date;
}

/**
 * Recurring event pattern
 */
export interface RecurringEvent {
  eventType: EventType;
  name: string;
  frequency: 'daily' | 'weekly' | 'biweekly' | 'monthly';
  dayOfWeek?: number; // 0-6 for weekly events
  dayOfMonth?: number; // 1-31 for monthly events
  nextOccurrence: Date;
  typicalRewards: Resources;
  recommendedParticipation: ParticipationLevel;
}

/**
 * Multi-event optimization result
 */
export interface MultiEventStrategy {
  timeframe: {
    start: Date;
    end: Date;
    days: number;
  };
  
  // Events to participate in
  selectedEvents: EventStrategy[];
  skippedEvents: Array<{
    event: GameEvent;
    reason: string;
  }>;
  
  // Resource planning
  totalResourcesNeeded: Resources;
  resourceAllocation: Record<string, Resources>; // eventId -> resources
  
  // Time planning
  totalTimeRequired: number; // hours
  timeAllocation: Record<string, number>; // eventId -> hours
  schedule: EventScheduleEntry[];
  
  // Outcomes
  expectedTotalRewards: Resources;
  overallROI: number;
  feasibility: number; // 0-100
  
  // Conflicts
  conflicts: EventConflict[];
  resolutions: ConflictResolution[];
}

/**
 * Event schedule entry for calendar
 */
export interface EventScheduleEntry {
  event: GameEvent;
  startTime: Date;
  endTime: Date;
  allocatedTime: number; // hours
  priority: number;
  conflicts: string[]; // Other event IDs
}

/**
 * Event timing conflict
 */
export interface EventConflict {
  events: string[]; // Event IDs in conflict
  type: 'time_overlap' | 'resource_conflict' | 'hero_requirement_overlap';
  severity: 'minor' | 'major' | 'blocking';
  description: string;
}

/**
 * Conflict resolution
 */
export interface ConflictResolution {
  conflict: EventConflict;
  resolution: string;
  tradeoffs: string[];
  impact: string;
}

/**
 * Event meta analysis
 */
export interface EventMetaAnalysis {
  server: string;
  period: {
    start: Date;
    end: Date;
  };
  
  // Participation patterns
  averageParticipation: Record<EventType, number>;
  competitionLevel: Record<EventType, EventDifficulty>;
  
  // Reward analysis
  bestROIEvents: Array<{
    eventType: EventType;
    averageROI: number;
    frequency: number;
  }>;
  
  // Hero requirements
  mostUsefulHeroes: Array<{
    heroId: string;
    eventTypes: EventType[];
    usageFrequency: number;
  }>;
  
  // Recommendations
  mustAttendEvents: EventType[];
  optionalEvents: EventType[];
  skipRecommendations: EventType[];
}

export interface ScenarioObjective {
  description: string;
  metric: string;
  target: number;
  weight: number;
  timeLimit?: number; // days
}

export interface ScenarioConstraint {
  type: 'resource' | 'time' | 'hero' | 'power';
  description: string;
  limit: number;
}

export interface Solution {
  id: string;
  decisions: Decision[];
  outcome: Outcome;
  score: number;
  explanation: string;
}

export interface Decision {
  type: string;
  description: string;
  parameters: Record<string, any>;
  reasoning: string;
}

export interface Outcome {
  metrics: Record<string, number>;
  achievements: string[];
  timeElapsed: number; // days
  resourcesUsed: Resources;
  efficiency: number;
}

export interface LearningPoint {
  concept: string;
  explanation: string;
  example: string;
  relatedTopics: string[];
}

// ============================================================================
// VALIDATION & TESTING TYPES
// ============================================================================

export interface ValidationResult {
  algorithm: string;
  testCase: string;
  passed: boolean;
  expected: any;
  actual: any;
  error?: string;
  performance: PerformanceMetrics;
}

export interface PerformanceMetrics {
  executionTime: number; // ms
  memoryUsed: number; // bytes
  iterations: number;
  cacheHits: number;
  cacheMisses: number;
}

export interface BenchmarkResult {
  strategy: string;
  playerProfile: string;
  progressionRate: number;
  powerGain: number;
  resourceEfficiency: number;
  goalAchievement: boolean;
  timeToGoal: number; // days
  confidence: number;
}

// ============================================================================
// DATA SOURCE & VALIDATION TYPES
// ============================================================================

export interface DataSource {
  id: string;
  name: string;
  type: 'official' | 'community' | 'wiki' | 'guide';
  url: string;
  priority: number;
  reliability: number; // 0-1
  updateFrequency: 'realtime' | 'daily' | 'weekly' | 'monthly';
  lastSync: Date;
  isActive: boolean;
}

export interface DataValidation {
  dataId: string;
  field: string;
  sources: DataSourceValue[];
  consensus: any;
  confidence: number;
  conflicts: DataConflict[];
  resolution: 'consensus' | 'priority' | 'manual' | 'latest';
  lastValidated: Date;
}

export interface DataSourceValue {
  source: string;
  value: any;
  timestamp: Date;
  confidence: number;
}

export interface DataConflict {
  field: string;
  values: DataSourceValue[];
  resolution: any;
  reasoning: string;
  needsReview: boolean;
}

// ============================================================================
// EDUCATIONAL CONTENT TYPES
// ============================================================================

export interface Tutorial {
  id: string;
  title: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: number; // minutes
  prerequisites: string[];
  
  content: TutorialSection[];
  quiz?: Quiz;
  practiceScenario?: string; // Scenario ID
  
  completionRate: number;
  averageRating: number;
}

export interface TutorialSection {
  title: string;
  content: string;
  media?: {
    type: 'image' | 'video' | 'interactive';
    url: string;
  };
  keyPoints: string[];
  examples: Example[];
}

export interface Example {
  description: string;
  scenario: string;
  goodChoice: string;
  badChoice: string;
  explanation: string;
}

export interface Quiz {
  questions: QuizQuestion[];
  passingScore: number;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

// ============================================================================
// PROGRESS TRACKING TYPES
// ============================================================================

export interface ProgressTracker {
  userId: string;
  startDate: Date;
  currentState: PlayerState;
  history: ProgressSnapshot[];
  trends: ProgressTrend[];
  predictions: Prediction[];
}

export interface ProgressSnapshot {
  date: Date;
  powerLevel: number;
  resources: Resources;
  heroCount: number;
  achievements: string[];
  notes?: string;
}

export interface ProgressTrend {
  metric: string;
  period: number; // days
  averageChange: number;
  trend: 'improving' | 'stable' | 'declining';
  projectedValue: number;
  confidence: number;
}

export interface Prediction {
  goal: string;
  currentProgress: number;
  projectedCompletion: Date;
  probability: number;
  blockers: string[];
  recommendations: string[];
}
