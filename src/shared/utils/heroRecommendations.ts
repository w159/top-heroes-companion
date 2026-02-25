import { UserData, UserHero, SpendProfile } from '../types/types';
import { HEROES } from '../types/constants';
import { calculateQueueInfluence } from './calculations';

export interface UpgradeRecommendation {
  heroId: string;
  heroName: string;
  score: number;
  reason: string;
  recommendedLevel: number;
  recommendedStars: number;
  timelineDays: number;
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

export function getServerPhase(serverGroup: string): 'Early' | 'Mid' | 'Late' {
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

export function normalizeSpendProfile(spendProfile?: SpendProfile): SpendProfile {
  if (spendProfile === 'LowSpender' || spendProfile === 'Whale' || spendProfile === 'F2P') {
    return spendProfile;
  }
  return 'F2P';
}

export function getProgressSpendProfile(data: UserData): SpendProfile {
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

    const reason = reasonParts.slice(0, 3).join(' \u2022 ') || 'Solid Investment';

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

export function benchmarkUpgradeStrategy(userData: UserData, _horizonDays: number): StrategyBenchmark {
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
