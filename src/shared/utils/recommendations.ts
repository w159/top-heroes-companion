
import { UserData, UserHero, GameEvent, SpendProfile } from '../types/types';
import { HEROES } from '../types/constants';
import { calculateQueueInfluence, getEventState } from './index';

export type RecommendationPriority = 'High' | 'Medium' | 'Low';

export interface UpgradeRecommendation {
  heroId: string;
  heroName: string;
  score: number;
  reason: string;
  recommendedLevel: number;
  recommendedStars: number;
  timelineDays: number;
}

export interface EventStrategyRecommendation {
  eventId: string;
  eventName: string;
  priority: RecommendationPriority;
  focus: string;
  actions: string[];
}

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

export interface StrategyBenchmark {
  baselineInfluence: number;
  projectedInfluenceWithUpgrades: number;
  projectedGainPercent: number;
}

type TierWeightMap = Record<string, number>;

const tierWeights: TierWeightMap = {
  S: 5,
  A: 4,
  B: 3,
  C: 2,
  D: 1,
};

const rarityWeights: Record<string, number> = {
  Mythic: 3,
  Legendary: 2,
  Epic: 1,
  Rare: 0.5,
};

function getServerPhase(serverGroup: string): 'Early' | 'Mid' | 'Late' {
  const lower = serverGroup.toLowerCase();
  if (lower.includes('new') || lower.includes('1-30') || lower.includes('1-60')) return 'Early';
  if (lower.includes('60') || lower.includes('80') || lower.includes('mid')) return 'Mid';
  if (lower.includes('100') || lower.includes('late') || lower.includes('+')) return 'Late';
  return 'Mid';
}

function getRoleWeight(role: string): number {
  if (role === 'DPS' || role === 'Damage Dealer') return 1.4;
  if (role === 'Support' || role === 'Supporter' || role === 'Healer') return 1.25;
  if (role === 'Tank' || role === 'Controller') return 1.15;
  return 1;
}

function normalizeSpendProfile(spendProfile?: SpendProfile): SpendProfile {
  if (spendProfile === 'LowSpender' || spendProfile === 'Whale' || spendProfile === 'F2P') {
    return spendProfile;
  }
  return 'F2P';
}

function getProgressSpendProfile(data: UserData): SpendProfile {
  return normalizeSpendProfile(data.progressModel?.spendProfile);
}

function estimateDailyUpgradeCapacity(spendProfile: SpendProfile): number {
  if (spendProfile === 'Whale') return 2.5;
  if (spendProfile === 'LowSpender') return 1.6;
  return 1;
}

function getHeroMeta(heroId: string) {
  return HEROES.find(h => h.id === heroId);
}

export function recommendHeroUpgrades(userData: UserData, limit = 5): UpgradeRecommendation[] {
  const spendProfile = getProgressSpendProfile(userData);
  const dailyCapacityFactor = estimateDailyUpgradeCapacity(spendProfile);
  const serverPhase = getServerPhase(userData.settings.serverGroup);

  // 1. Analyze Usage
  const heroUsage = new Map<string, number>();
  const factionUsage = new Map<string, number>();

  userData.queues.forEach(queue => {
    queue.heroIds.forEach(id => {
      if (!id) return;
      const current = heroUsage.get(id) || 0;
      heroUsage.set(id, current + 1);

      const hero = userData.roster.find(h => h.id === id);
      if (hero) {
        const fCount = factionUsage.get(hero.faction) || 0;
        factionUsage.set(hero.faction, fCount + 1);
      }
    });
  });

  // Determine dominant faction
  let dominantFaction = '';
  let maxFactionCount = 0;
  factionUsage.forEach((count, faction) => {
    if (count > maxFactionCount) {
      maxFactionCount = count;
      dominantFaction = faction;
    }
  });

  const recommendations: UpgradeRecommendation[] = userData.roster.map((hero: UserHero) => {
    const meta = getHeroMeta(hero.id);
    const tier = meta?.tier || hero.tier || 'C';

    // Weights
    const tierWeight = tierWeights[tier] || 2;
    const rarityWeight = rarityWeights[hero.rarity] || 1;
    const roleWeight = getRoleWeight(hero.role);

    // Bonuses
    const usageCount = heroUsage.get(hero.id) || 0;
    const usageBonus = 1 + usageCount * 0.25; // High priority for used heroes

    const levelFactor = 1 + Math.max(0, 120 - hero.level) / 300;
    const starFactor = 1 + Math.max(0, 10 - hero.stars) / 40;

    // Synergy Bonus
    let synergyBonus = 1;
    if (hero.faction === dominantFaction) synergyBonus += 0.15;
    if (hero.faction === userData.settings.mainFaction) synergyBonus += 0.1;

    // Bond Logic
    let bondBonus = 1;
    if (meta?.bonds) {
      const activeBonds = meta.bonds.filter(bond =>
        userData.roster.some(h => h.id === bond.partnerId && h.level > 1)
      );
      bondBonus += activeBonds.length * 0.05;
    }

    // Phase Adjustment
    let phaseBonus = 1;
    if (serverPhase === 'Early' && (roleWeight > 1.3 || hero.rarity === 'Legendary')) {
       // Early game: focus on DPS and easier-to-star Legendaries
       phaseBonus = 1.1;
    } else if (serverPhase === 'Late' && hero.rarity === 'Mythic') {
       // Late game: Mythics are king
       phaseBonus = 1.2;
    }

    const score = tierWeight * rarityWeight * roleWeight * usageBonus * levelFactor * starFactor * synergyBonus * bondBonus * phaseBonus;

    // Targets
    const targetLevelIncrement = spendProfile === 'Whale' ? 40 : spendProfile === 'LowSpender' ? 20 : 10;
    const recommendedLevel = hero.level + targetLevelIncrement;
    const recommendedStars = Math.min(hero.stars + 1, 15);
    const requiredUpgradeUnits = targetLevelIncrement * tierWeight;
    const timelineDays = Math.max(1, Math.round(requiredUpgradeUnits / dailyCapacityFactor));

    const reasonParts: string[] = [];
    if (usageCount > 0) reasonParts.push('In Active Queue');
    if (hero.faction === dominantFaction) reasonParts.push(`${dominantFaction} Faction Synergy`);
    if (meta?.bonds && bondBonus > 1) reasonParts.push('Active Bonds');
    if (roleWeight > 1.3) reasonParts.push('Main Carry');
    if (tier === 'S') reasonParts.push('Meta S-Tier');
    if (hero.rarity === 'Mythic') reasonParts.push('Mythic Scale');

    const reason = reasonParts.slice(0, 3).join(' • ') || 'Solid Investment';

    return {
      heroId: hero.id,
      heroName: hero.name,
      score,
      reason,
      recommendedLevel,
      recommendedStars,
      timelineDays,
    };
  });

  recommendations.sort((a, b) => b.score - a.score);

  return recommendations.slice(0, limit);
}

export function recommendEventStrategies(userData: UserData, events: GameEvent[]): EventStrategyRecommendation[] {
  const spendProfile = getProgressSpendProfile(userData);
  const mainFaction = userData.settings.mainFaction;

  return events.map(event => {
    const state = getEventState(event);
    const isActive = state.isActive;
    const actions: string[] = [];
    let focus = '';
    let priority: RecommendationPriority = 'Medium';

    const lowerId = event.id.toLowerCase();
    const lowerName = event.name.toLowerCase();

    // Event Specific Logic
    if (lowerId.includes('arms') || lowerName.includes('arms race')) {
      focus = 'Daily Routine Anchor';
      priority = 'High';

      actions.push('Align daily activities with current 4-hour phase');
      if (isActive && event.phases && state.activePhaseIndex !== undefined) {
         const phase = event.phases[state.activePhaseIndex];
         actions.push(`CURRENT PHASE: ${phase?.name || 'Unknown'}`);
         if (phase?.name?.includes('Train')) actions.push('Use speedups on troops now');
         if (phase?.name?.includes('Hero')) actions.push('Use EXP books and shards now');
      } else {
         actions.push('Check next phase timer before spending speedups');
      }

      if (spendProfile === 'F2P') actions.push('Save resources for "City Building" and "Research" phases for max points');

    } else if (lowerName.includes('guild expedition') || lowerName.includes('boss')) {
      focus = 'Guild Boss Damage';
      priority = 'High';
      actions.push('Equip single-target DPS loadout');
      actions.push('Challenge immediately after server reset for max attempts');
      actions.push('Coordinate buffs with guild leadership');

    } else if (lowerId === 'kingdom-war' || lowerName.includes('kvk')) {
      focus = 'Server War (PvP)';
      priority = 'High';
      actions.push('Hospital capacity check: Heal before engaging');
      actions.push('Enable "War Mode" talents if available');
      if (mainFaction === 'Nature') actions.push('Nature main: Focus on defending structures with sustain');
      if (mainFaction === 'League') actions.push('League main: Rally leader for objectives');
      if (mainFaction === 'Horde') actions.push('Horde main: Swarm field battles');

    } else if (lowerName.includes('ruins') || lowerName.includes('ancient')) {
      focus = 'Exploration & Puzzles';
      priority = 'Medium';
      actions.push('Save stamina for ruin tiles');
      actions.push('Scout tiles before marching to avoid counters');

    } else if (lowerName.includes('arena') || lowerName.includes('duel')) {
      focus = 'PvP Ladder';
      priority = 'Medium';
      actions.push('Refresh opponents to find favorable matchups');
      actions.push('Check enemy defense formation before attacking');
      if (spendProfile !== 'Whale') actions.push('Avoid top 10 whales; target active but lower power players');

    } else {
      // Generic Fallback
      focus = 'Standard Participation';
      priority = isActive ? 'Medium' : 'Low';
      actions.push('Complete daily free attempts');
      actions.push('Check reward thresholds vs resource cost');
    }

    // Active Phase Generic Logic
    if (isActive && event.phases && typeof state.activePhaseIndex === 'number' && state.activePhaseIndex >= 0) {
      const phase = event.phases[state.activePhaseIndex];
      if (phase && !lowerId.includes('arms')) { // Arms race already handled
        actions.push(`Current Phase: ${phase.name}`);
        if (phase.keyTasks.length > 0) {
          actions.push(`Focus: ${phase.keyTasks.slice(0, 2).join(', ')}`);
        }
      }
    }

    return {
      eventId: event.id,
      eventName: event.name,
      priority,
      focus,
      actions,
    };
  });
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
    if (userData.inventory.stamina >= 100) { // Assuming cap around 100-120
        warnings.push('Stamina near cap. Use immediately to avoid waste.');
    }
  }

  // Budgeting Logic
  switch (spendProfile) {
    case 'F2P':
      dailyDiamondBudget = 200;
      weeklyFocusEvents.push('Arms Race (Research/Building)');
      notes.push('💎 STRICT SAVING: Only spend diamonds on VIP points (early) or Castle shields.');
      notes.push('Never speed up training with diamonds.');
      notes.push('Hoard gold heads/shards for "Consumption Events" only.');
      focus = 'Resource Hoarding';
      targets['diamonds'] = 20000;
      break;
    case 'LowSpender':
      dailyDiamondBudget = 600;
      weeklyFocusEvents.push('Arms Race');
      weeklyFocusEvents.push('Daily Deals ($1)');
      notes.push('💎 VALUE FOCUS: Buy stamina refreshes during events.');
      notes.push('Purchase the "Monthly Card" for best ROI.');
      notes.push('Save speedups for Friday/Saturday major events.');
      focus = 'Efficient Growth';
      targets['diamonds'] = 10000;
      break;
    case 'Whale':
      dailyDiamondBudget = 3000;
      weeklyFocusEvents.push('ALL Ranking Events');
      weeklyFocusEvents.push('New Hero Banners');
      notes.push('💎 DOMINANCE: Maximize daily stamina purchases.');
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

export function benchmarkUpgradeStrategy(userData: UserData, horizonDays: number): StrategyBenchmark {
  const baselineInfluence = userData.queues.reduce(
    (sum, queue) => sum + calculateQueueInfluence(queue, userData.roster),
    0
  );

  const upgrades = recommendHeroUpgrades(userData, 5);
  // Create a hypothetical roster
  const upgradedRoster: UserHero[] = userData.roster.map(hero => {
    const rec = upgrades.find(r => r.heroId === hero.id);
    if (!rec) return hero;

    // Simple linear power scaling approximation
    // Level up power + Star up power
    // This is a simplified model for benchmarking
    const levelDiff = rec.recommendedLevel - hero.level;
    const starDiff = rec.recommendedStars - hero.stars;

    const powerGrowth = (hero.power || 1000) * (0.05 * levelDiff + 0.1 * starDiff);

    return {
      ...hero,
      level: rec.recommendedLevel,
      stars: rec.recommendedStars,
      power: (hero.power || 1000) + powerGrowth
    };
  });

  const upgradedInfluence = userData.queues.reduce(
    (sum, queue) => sum + calculateQueueInfluence(queue, upgradedRoster),
    0
  );

  const gainPercent =
    baselineInfluence === 0
      ? 0
      : ((upgradedInfluence - baselineInfluence) / baselineInfluence) * 100;

  return {
    baselineInfluence,
    projectedInfluenceWithUpgrades: upgradedInfluence,
    projectedGainPercent: Math.round(gainPercent * 10) / 10,
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
  const events = recommendEventStrategies(sampleData, [{ id: 'arms-race', name: 'Arms Race', type: 'Recurring', description: 'Test event' }]);
  const armsRaceOk = events.some(e => e.eventId === 'arms-race' && e.priority === 'High');
  results.push({
    name: 'Critical Event Detection',
    passed: armsRaceOk,
    details: armsRaceOk ? undefined : 'Failed to prioritize Arms Race event',
  });

  return results;
}
