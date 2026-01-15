import { describe, it, expect } from 'vitest';
import { recommendHeroUpgrades, recommendResourcePlan, recommendEventStrategies, simulateProgression } from './recommendations';
import { UserData, UserHero } from '../types';
import { EVENTS } from '../constants';

// Mock User Data
const mockUserData: UserData = {
  roster: [
    { id: 'adjudicator', name: 'Adjudicator', level: 100, stars: 5, power: 50000, faction: 'League', rarity: 'Mythic', role: 'Support', gear: {}, tier: 'S', awakening: 0, isOwned: true },
    { id: 'paragon', name: 'Paragon', level: 80, stars: 3, power: 30000, faction: 'League', rarity: 'Legendary', role: 'Tank', gear: {}, tier: 'A', awakening: 0, isOwned: true },
    { id: 'blacksmith', name: 'Blacksmith', level: 60, stars: 2, power: 15000, faction: 'Horde', rarity: 'Epic', role: 'Warrior', gear: {}, tier: 'B', awakening: 0, isOwned: true },
  ] as UserHero[],
  inventory: {
    diamonds: 5000,
    gold: 1000000,
    experience: 500000,
    stamina: 100,
    speedups: { generic: 600, building: 0, training: 0, research: 0 },
    shards: { generic: { legendary: 10, mythic: 5 }, specific: {} },
    guildCoins: 0,
    ruinsCoins: 0,
    arenaTokens: 0,
  },
  buildings: { castle: 20, trainingGrounds: 15 },
  research: { economy: {}, military: {} },
  settings: {
    serverGroup: '1000', // Early-Mid game
    mainFaction: 'League',
  },
  queues: [
    {
        id: 1,
        name: 'Main',
        heroIds: ['adjudicator', 'paragon'],
        petId: null,
        petLevel: 0,
        petStars: 0,
        relics: {},
        soldierType: 'Infantry',
        soldierTier: 3,
        castleSkinId: null,
        marchSkinId: null
    }
  ],
  redeemedCodes: [],
  lastUpdated: new Date().toISOString(),
  progressModel: {
      spendProfile: 'LowSpender',
      snapshots: []
  },
  teamPresets: []
};

describe('Recommendation Engine', () => {

  describe('recommendHeroUpgrades', () => {
    it('should return recommendations sorted by score', () => {
      const recs = recommendHeroUpgrades(mockUserData, 3);
      expect(recs.length).toBeGreaterThan(0);
      expect(recs.length).toBeLessThanOrEqual(3);

      // Verify sorting
      for (let i = 0; i < recs.length - 1; i++) {
        expect(recs[i].score).toBeGreaterThanOrEqual(recs[i + 1].score);
      }
    });

    it('should prioritize main faction heroes', () => {
        const recs = recommendHeroUpgrades(mockUserData, 3);
        const topRec = recs[0];
        // Adjudicator is League (Main Faction) + Mythic + Used in Queue + S Tier
        expect(topRec.heroId).toBe('adjudicator');
        expect(topRec.reason).toContain('League Faction Synergy');
    });

    it('should suggest level targets based on spend profile', () => {
      const recs = recommendHeroUpgrades(mockUserData, 3);
      const topRec = recs[0];
      // LowSpender target increment is 20
      expect(topRec.recommendedLevel).toBe(120); // 100 + 20
    });
  });

  describe('recommendResourcePlan', () => {
    it('should generate a plan based on current resources', () => {
      const plan = recommendResourcePlan(mockUserData);
      expect(plan).toBeDefined();
      expect(plan.focus).toBeDefined();
      expect(plan.warnings).toBeDefined();
    });

    it('should warn about low diamonds for events', () => {
      const poorUserData = {
          ...mockUserData,
          inventory: { ...mockUserData.inventory, diamonds: 100 }
      };
      const plan = recommendResourcePlan(poorUserData);
      expect(plan.warnings.some(w => w.includes('Diamond reserve critical'))).toBe(true);
    });

    it('should adjust savings targets for Whales', () => {
        const whaleUserData: UserData = {
            ...mockUserData,
            progressModel: { ...mockUserData.progressModel!, spendProfile: 'Whale' }
        };
        const plan = recommendResourcePlan(whaleUserData);
        // Whales have higher targets
        expect(plan.targets.diamonds).toBeGreaterThan(mockUserData.inventory.diamonds);
    });
  });

  describe('recommendEventStrategies', () => {
    it('should return strategies for events', () => {
      const strategies = recommendEventStrategies(mockUserData, EVENTS);
      expect(strategies).toBeDefined();
      expect(Array.isArray(strategies)).toBe(true);
    });

    it('should prioritize active events', () => {
        const strategies = recommendEventStrategies(mockUserData, EVENTS);
        if (strategies.length > 0) {
            expect(strategies[0]).toHaveProperty('priority');
            expect(strategies[0]).toHaveProperty('actions');
        }
    });
  });

  describe('simulateProgression', () => {
      it('should project influence growth', () => {
          const sim = simulateProgression({ userData: mockUserData, days: 30 });
          expect(sim).toBeDefined();
          expect(sim.projectedTotalInfluence).toBeGreaterThan(0);
          expect(sim.keyMilestones.length).toBeGreaterThan(0);
      });
  });

});
