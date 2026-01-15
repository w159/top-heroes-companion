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
