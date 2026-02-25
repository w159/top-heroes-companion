/**
 * Simulation, Testing, Validation, Educational & Progress Tracking Types
 */

import { PlayerState, Resources } from './playerState';

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
  parameters: Record<string, unknown>;
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
  expected: unknown;
  actual: unknown;
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
  consensus: unknown;
  confidence: number;
  conflicts: DataConflict[];
  resolution: 'consensus' | 'priority' | 'manual' | 'latest';
  lastValidated: Date;
}

export interface DataSourceValue {
  source: string;
  value: unknown;
  timestamp: Date;
  confidence: number;
}

export interface DataConflict {
  field: string;
  values: DataSourceValue[];
  resolution: unknown;
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
