/**
 * Meta Analysis Types
 */

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
