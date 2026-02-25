import { UserData, SpendProfile } from '../types/types';
import { calculateQueueInfluence } from './calculations';
import {
  getServerPhase,
  normalizeSpendProfile,
  getProgressSpendProfile,
  recommendHeroUpgrades,
} from './heroRecommendations';
import { recommendEventStrategies } from './eventRecommendations';

export interface ResourcePlanRecommendation {
  spendProfile: SpendProfile;
  dailyDiamondBudget: number;
  weeklyFocusEvents: string[];
  notes: string[];
  focus: string;
  warnings: string[];
  targets: Record<string, number>;
}

export interface ScenarioSimulationInput {
  days: number;
  userData: UserData;
  targetSpendProfile?: SpendProfile;
}

export interface ScenarioSimulationResult {
  days: number;
  currentInfluence: number;
  projectedTotalInfluence: number;
  projectedDeltaInfluence: number;
  spendProfile: SpendProfile;
  keyMilestones: string[];
}

export interface RecommendationTestResult {
  name: string;
  passed: boolean;
  details?: string;
}

export function recommendResourcePlan(userData: UserData): ResourcePlanRecommendation {
  const spendProfile = getProgressSpendProfile(userData);
  const serverPhase = getServerPhase(userData.settings.serverGroup);

  let dailyDiamondBudget = 0;
  const weeklyFocusEvents: string[] = [];
  const notes: string[] = [];
  let focus = 'Balanced Growth';
  const warnings: string[] = [];
  const targets: Record<string, number> = {};

  // Inventory Check
  if (userData.inventory) {
    if (userData.inventory.diamonds < 1000) {
        warnings.push('Diamond reserve critical (< 1000). Halt all non-essential spending.');
    }
    if (userData.inventory.stamina >= 100) {
        warnings.push('Stamina near cap. Use immediately to avoid waste.');
    }
  }

  // Budgeting Logic
  switch (spendProfile) {
    case 'F2P':
      dailyDiamondBudget = 200;
      weeklyFocusEvents.push('Arms Race (Research/Building)');
      notes.push('\u{1F48E} STRICT SAVING: Only spend diamonds on VIP points (early) or Castle shields.');
      notes.push('Never speed up training with diamonds.');
      notes.push('Hoard gold heads/shards for "Consumption Events" only.');
      focus = 'Resource Hoarding';
      targets['diamonds'] = 20000;
      break;
    case 'LowSpender':
      dailyDiamondBudget = 600;
      weeklyFocusEvents.push('Arms Race');
      weeklyFocusEvents.push('Daily Deals ($1)');
      notes.push('\u{1F48E} VALUE FOCUS: Buy stamina refreshes during events.');
      notes.push('Purchase the "Monthly Card" for best ROI.');
      notes.push('Save speedups for Friday/Saturday major events.');
      focus = 'Efficient Growth';
      targets['diamonds'] = 10000;
      break;
    case 'Whale':
      dailyDiamondBudget = 3000;
      weeklyFocusEvents.push('ALL Ranking Events');
      weeklyFocusEvents.push('New Hero Banners');
      notes.push('\u{1F48E} DOMINANCE: Maximize daily stamina purchases.');
      notes.push('Buy out the VIP shop speedups weekly.');
      notes.push('Focus on exclusive gear packs for main carry.');
      focus = 'Leaderboard Dominance';
      targets['diamonds'] = 50000;
      break;
  }

  // Phase Logic
  if (serverPhase === 'Early') {
    notes.push('Build Phase: Rush Castle 25 ASAP. Ignore non-core research.');
    if (spendProfile === 'F2P') notes.push('Do not invest in purple heroes past level 40.');
  } else if (serverPhase === 'Mid') {
    notes.push('Consolidation: Standardize 2 full marching queues.');
    notes.push('Start hoarding for KvK (Server War).');
  } else {
    notes.push('War Phase: All resources to T4/T5 troop maintenance.');
    notes.push('Min-max artifact stats.');
  }

  return {
    spendProfile,
    dailyDiamondBudget,
    weeklyFocusEvents,
    notes,
    focus,
    warnings,
    targets,
  };
}

export function simulateProgression(input: ScenarioSimulationInput): ScenarioSimulationResult {
  const spendProfile = normalizeSpendProfile(input.targetSpendProfile || getProgressSpendProfile(input.userData));

  // Calculate base influence correctly
  const baseInfluence = input.userData.queues.reduce(
    (sum, queue) => sum + calculateQueueInfluence(queue, input.userData.roster),
    0
  );

  // Fallback if queues are empty
  const actualBase = baseInfluence > 0 ? baseInfluence : input.userData.roster.reduce((sum, h) => sum + (h.power || 0), 0) / 3;

  const dailyGrowthRate =
    spendProfile === 'Whale' ? 0.045 : spendProfile === 'LowSpender' ? 0.025 : 0.012;

  const projectedDeltaInfluence = Math.round(actualBase * dailyGrowthRate * input.days);
  const projectedTotalInfluence = actualBase + projectedDeltaInfluence;

  const keyMilestones: string[] = [];

  if (input.days >= 14) keyMilestones.push('Unlock Tier 3 Troops');
  if (input.days >= 30) keyMilestones.push('First Mythic Awakened');
  if (input.days >= 60) keyMilestones.push('Full T4 Troop March');
  if (input.days >= 90) keyMilestones.push('Castle Level 30 Cap');

  return {
    days: input.days,
    currentInfluence: actualBase,
    projectedTotalInfluence,
    projectedDeltaInfluence,
    spendProfile,
    keyMilestones,
  };
}

export function runRecommendationSelfTests(sampleData: UserData): RecommendationTestResult[] {
  const results: RecommendationTestResult[] = [];

  // Test 1: Sorting
  const upgrades = recommendHeroUpgrades(sampleData, 10);
  const sortedUpgrades = [...upgrades].sort((a, b) => b.score - a.score);
  const orderingOk =
    upgrades.length === sortedUpgrades.length &&
    upgrades.every((rec, index) => rec.heroId === sortedUpgrades[index].heroId);
  results.push({
    name: 'Algorithm Sorting Integrity',
    passed: orderingOk,
    details: orderingOk ? undefined : 'Upgrade recommendations not sorted by priority score',
  });

  // Test 2: Progression Logic
  const simulation = simulateProgression({ days: 30, userData: sampleData });
  const growthOk = simulation.projectedTotalInfluence >= simulation.currentInfluence;
  results.push({
    name: 'Growth Simulation Validity',
    passed: growthOk,
    details: growthOk ? undefined : 'Projected influence < Current influence (Impossible state)',
  });

  // Test 3: Resource Plan Alignment
  const resourcePlan = recommendResourcePlan(sampleData);
  const profileOk = ['F2P', 'LowSpender', 'Whale'].includes(resourcePlan.spendProfile);
  results.push({
    name: 'Resource Profile Consistency',
    passed: profileOk,
    details: profileOk ? undefined : `Invalid spend profile detected: ${resourcePlan.spendProfile}`,
  });

  // Test 4: Event Coverage
  const events = recommendEventStrategies(sampleData, [{ id: 'arms-race', name: 'Arms Race', type: 'PvE', description: 'Test event' }]);
  const armsRaceOk = events.some(e => e.eventId === 'arms-race' && e.priority === 'High');
  results.push({
    name: 'Critical Event Detection',
    passed: armsRaceOk,
    details: armsRaceOk ? undefined : 'Failed to prioritize Arms Race event',
  });

  return results;
}
