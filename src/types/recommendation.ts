/**
 * Recommendation Engine & Optimization Algorithm Types
 */

import { Rarity } from '../shared/types/types';
import { Resources } from './playerState';

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
  parameters: Record<string, unknown>;
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
