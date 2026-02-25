// Barrel re-export — all existing imports from './recommendations' keep working
export type { UpgradeRecommendation, StrategyBenchmark } from './heroRecommendations';
export {
  recommendHeroUpgrades,
  benchmarkUpgradeStrategy,
  getServerPhase,
  normalizeSpendProfile,
  getProgressSpendProfile,
} from './heroRecommendations';

export type { RecommendationPriority, EventStrategyRecommendation } from './eventRecommendations';
export { recommendEventStrategies } from './eventRecommendations';

export type {
  ResourcePlanRecommendation,
  ScenarioSimulationInput,
  ScenarioSimulationResult,
  RecommendationTestResult,
} from './resourceRecommendations';
export {
  recommendResourcePlan,
  simulateProgression,
  runRecommendationSelfTests,
} from './resourceRecommendations';
