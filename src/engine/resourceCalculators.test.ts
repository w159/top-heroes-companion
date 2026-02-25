import { describe, it, expect } from 'vitest';
import {
  calculateResourceValue,
  hasResources,
  subtractResources,
  addResources,
  estimateDaysToAcquireResources,
  getDailyResourceIncome,
} from './resourceCalculators';
import { Resources } from '@/types/playerState';

const emptyResources: Resources = {
  gold: 0,
  gems: 0,
  soulStones: 0,
  skillBooks: 0,
  traitStones: 0,
  experienceBottles: 0,
  heroShards: {},
  ascensionStones: {} as Resources['ascensionStones'],
};

const makeResources = (overrides: Partial<Resources> = {}): Resources => ({
  ...emptyResources,
  ...overrides,
});

describe('resourceCalculators', () => {
  describe('calculateResourceValue', () => {
    it('returns 0 for empty resources', () => {
      expect(calculateResourceValue(emptyResources)).toBe(0);
    });

    it('weights gold at 0.001', () => {
      const resources = makeResources({ gold: 10000 });
      expect(calculateResourceValue(resources)).toBe(10);
    });

    it('weights gems at 1.0', () => {
      const resources = makeResources({ gems: 100 });
      expect(calculateResourceValue(resources)).toBe(100);
    });

    it('weights soul stones at 50', () => {
      const resources = makeResources({ soulStones: 5 });
      expect(calculateResourceValue(resources)).toBe(250);
    });

    it('weights skill books at 2', () => {
      const resources = makeResources({ skillBooks: 10 });
      expect(calculateResourceValue(resources)).toBe(20);
    });

    it('sums multiple resource types', () => {
      const resources = makeResources({
        gold: 1000,   // 1
        gems: 50,     // 50
        skillBooks: 5, // 10
      });
      expect(calculateResourceValue(resources)).toBe(61);
    });

    it('includes ascension stone values weighted by rarity', () => {
      const resources = makeResources({
        ascensionStones: {
          Rare: 10,       // 10 * 10 = 100
          Epic: 5,        // 5 * 25 = 125
          Legendary: 2,   // 2 * 75 = 150
          Mythic: 1,      // 1 * 200 = 200
        },
      });
      expect(calculateResourceValue(resources)).toBe(575);
    });
  });

  describe('hasResources', () => {
    it('returns true when available exceeds required', () => {
      const available = makeResources({ gold: 5000, gems: 100 });
      const required = makeResources({ gold: 3000, gems: 50 });
      expect(hasResources(available, required)).toBe(true);
    });

    it('returns true when resources are exactly equal', () => {
      const resources = makeResources({ gold: 1000 });
      expect(hasResources(resources, resources)).toBe(true);
    });

    it('returns false when gold is insufficient', () => {
      const available = makeResources({ gold: 100 });
      const required = makeResources({ gold: 500 });
      expect(hasResources(available, required)).toBe(false);
    });

    it('returns false when gems are insufficient', () => {
      const available = makeResources({ gems: 10 });
      const required = makeResources({ gems: 50 });
      expect(hasResources(available, required)).toBe(false);
    });

    it('checks hero shards per hero', () => {
      const available = makeResources({ heroShards: { 'hero-a': 10, 'hero-b': 5 } });
      const required = makeResources({ heroShards: { 'hero-a': 5 } });
      expect(hasResources(available, required)).toBe(true);
    });

    it('returns false when hero shards are insufficient', () => {
      const available = makeResources({ heroShards: { 'hero-a': 3 } });
      const required = makeResources({ heroShards: { 'hero-a': 10 } });
      expect(hasResources(available, required)).toBe(false);
    });

    it('checks ascension stones by rarity', () => {
      const available = makeResources({
        ascensionStones: { Rare: 10, Epic: 5, Legendary: 0, Mythic: 0 },
      });
      const required = makeResources({
        ascensionStones: { Rare: 5, Epic: 0, Legendary: 0, Mythic: 0 },
      });
      expect(hasResources(available, required)).toBe(true);
    });

    it('returns false when ascension stones are insufficient', () => {
      const available = makeResources({
        ascensionStones: { Rare: 1, Epic: 0, Legendary: 0, Mythic: 0 },
      });
      const required = makeResources({
        ascensionStones: { Rare: 5, Epic: 0, Legendary: 0, Mythic: 0 },
      });
      expect(hasResources(available, required)).toBe(false);
    });
  });

  describe('subtractResources', () => {
    it('subtracts each resource type', () => {
      const from = makeResources({ gold: 5000, gems: 200, skillBooks: 50 });
      const amount = makeResources({ gold: 1000, gems: 50, skillBooks: 10 });

      const result = subtractResources(from, amount);
      expect(result.gold).toBe(4000);
      expect(result.gems).toBe(150);
      expect(result.skillBooks).toBe(40);
    });

    it('allows negative results', () => {
      const from = makeResources({ gold: 100 });
      const amount = makeResources({ gold: 500 });

      const result = subtractResources(from, amount);
      expect(result.gold).toBe(-400);
    });

    it('subtracts hero shards per hero', () => {
      const from = makeResources({ heroShards: { 'h1': 10, 'h2': 5 } });
      const amount = makeResources({ heroShards: { 'h1': 3 } });

      const result = subtractResources(from, amount);
      expect(result.heroShards?.['h1']).toBe(7);
      expect(result.heroShards?.['h2']).toBe(5);
    });
  });

  describe('addResources', () => {
    it('adds all resource types', () => {
      const a = makeResources({ gold: 1000, gems: 50, skillBooks: 10 });
      const b = makeResources({ gold: 2000, gems: 100, skillBooks: 20 });

      const result = addResources(a, b);
      expect(result.gold).toBe(3000);
      expect(result.gems).toBe(150);
      expect(result.skillBooks).toBe(30);
    });

    it('handles zero values', () => {
      const a = makeResources({ gold: 500 });
      const result = addResources(a, emptyResources);
      expect(result.gold).toBe(500);
      expect(result.gems).toBe(0);
    });

    it('includes pet essence and relic fragments', () => {
      const a = makeResources({ petEssence: 10, relicFragments: 5 });
      const b = makeResources({ petEssence: 20, relicFragments: 15 });

      const result = addResources(a, b);
      expect(result.petEssence).toBe(30);
      expect(result.relicFragments).toBe(20);
    });
  });

  describe('estimateDaysToAcquireResources', () => {
    it('returns 0 when no resources are needed', () => {
      expect(estimateDaysToAcquireResources(emptyResources, emptyResources)).toBe(0);
    });

    it('returns the bottleneck (highest days needed)', () => {
      const needed = makeResources({ gold: 100000, gems: 500 });
      const daily = makeResources({ gold: 50000, gems: 100 });

      // gold: ceil(100000/50000)=2, gems: ceil(500/100)=5
      expect(estimateDaysToAcquireResources(needed, daily)).toBe(5);
    });

    it('uses default daily income when not specified', () => {
      const needed = makeResources({ gems: 200 });
      const daily = makeResources({}); // gems defaults to 50

      // ceil(200/50) = 4
      expect(estimateDaysToAcquireResources(needed, daily)).toBe(4);
    });

    it('handles soul stone bottleneck', () => {
      const needed = makeResources({ soulStones: 10 });
      const daily = makeResources({}); // soulStones defaults to 2

      expect(estimateDaysToAcquireResources(needed, daily)).toBe(5);
    });
  });

  describe('getDailyResourceIncome', () => {
    it('scales gold with castle level', () => {
      const low = getDailyResourceIncome(5, 'F2P');
      const high = getDailyResourceIncome(30, 'F2P');
      expect(high.gold).toBeGreaterThan(low.gold!);
    });

    it('returns more gems for spenders', () => {
      const f2p = getDailyResourceIncome(10, 'F2P');
      const low = getDailyResourceIncome(10, 'LowSpender');
      const whale = getDailyResourceIncome(10, 'Whale');

      expect(f2p.gems).toBe(100);
      expect(low.gems).toBe(300);
      expect(whale.gems).toBe(1000);
    });

    it('returns more soul stones for spenders', () => {
      const f2p = getDailyResourceIncome(10, 'F2P');
      const whale = getDailyResourceIncome(10, 'Whale');

      expect(f2p.soulStones).toBe(2);
      expect(whale.soulStones).toBe(15);
    });

    it('scales skill books with castle level', () => {
      const income = getDailyResourceIncome(20, 'F2P');
      expect(income.skillBooks).toBe(150 + 20 * 5);
    });

    it('scales experience bottles with castle level', () => {
      const income = getDailyResourceIncome(15, 'F2P');
      expect(income.experienceBottles).toBe(200 + 15 * 10);
    });
  });
});
