import { describe, it, expect } from 'vitest';
import {
  calculateHeroPower,
  calculateQueueInfluence,
  calculateTotalInfluence,
  calculateProgressTrend,
  getFactionAdvantage,
  addProgressSnapshot,
} from './calculations';
import { UserHero, Queue, UserData } from '../types/types';

const makeQueue = (overrides: Partial<Queue> = {}): Queue => ({
  id: 1,
  name: 'Queue 1',
  heroIds: [],
  petId: null,
  petLevel: 0,
  petStars: 0,
  relics: {},
  soldierType: null,
  soldierTier: 0,
  castleSkinId: null,
  marchSkinId: null,
  ...overrides,
});

const makeHero = (overrides: Partial<UserHero> = {}): UserHero => ({
  id: 'hero-1',
  name: 'Test Hero',
  rarity: 'Epic',
  faction: 'Nature',
  role: 'DPS',
  level: 1,
  stars: 0,
  awakening: 0,
  power: 0,
  isOwned: true,
  tier: 'B',
  ...overrides,
});

describe('calculations', () => {
  describe('calculateHeroPower', () => {
    it('calculates power for a level-1, 0-star Epic hero', () => {
      const hero = makeHero({ level: 1, stars: 0, rarity: 'Epic' });
      // base=1000, levelMulti=50, starMulti=(0+1)*1.5=1.5, rarityBonus=1.0
      // (1000+50)*1.5*1.0 = 1575
      expect(calculateHeroPower(hero)).toBe(1575);
    });

    it('applies Mythic rarity bonus (1.5x)', () => {
      const hero = makeHero({ level: 10, stars: 2, rarity: 'Mythic' });
      // base=1000, levelMulti=500, starMulti=(2+1)*1.5=4.5, rarityBonus=1.5
      // (1000+500)*4.5*1.5 = 10125
      expect(calculateHeroPower(hero)).toBe(10125);
    });

    it('applies Legendary rarity bonus (1.2x)', () => {
      const hero = makeHero({ level: 5, stars: 1, rarity: 'Legendary' });
      // base=1000, levelMulti=250, starMulti=(1+1)*1.5=3, rarityBonus=1.2
      // (1000+250)*3*1.2 = 4500
      expect(calculateHeroPower(hero)).toBe(4500);
    });

    it('scales with level and stars', () => {
      const low = makeHero({ level: 1, stars: 0 });
      const high = makeHero({ level: 50, stars: 5 });
      expect(calculateHeroPower(high)).toBeGreaterThan(calculateHeroPower(low));
    });
  });

  describe('calculateQueueInfluence', () => {
    it('returns 0 for null/undefined queue', () => {
      expect(calculateQueueInfluence(null as unknown as Queue)).toBe(0);
    });

    it('sums hero power for heroes in the queue', () => {
      const heroes: UserHero[] = [
        makeHero({ id: 'h1', level: 10, stars: 2 }),
        makeHero({ id: 'h2', level: 5, stars: 1 }),
      ];
      const queue = makeQueue({ heroIds: ['h1', 'h2'] });

      const result = calculateQueueInfluence(queue, heroes);
      const expected = calculateHeroPower(heroes[0]) + calculateHeroPower(heroes[1]);
      expect(result).toBe(expected);
    });

    it('skips null hero IDs in the queue', () => {
      const heroes: UserHero[] = [makeHero({ id: 'h1', level: 10, stars: 2 })];
      const queue = makeQueue({ heroIds: ['h1', '', null as unknown as string] });

      const result = calculateQueueInfluence(queue, heroes);
      expect(result).toBe(calculateHeroPower(heroes[0]));
    });

    it('adds soldier tier bonus', () => {
      const queue = makeQueue({ soldierType: 'Infantry', soldierTier: 3 });

      const result = calculateQueueInfluence(queue, []);
      expect(result).toBe(3 * 5000);
    });

    it('defaults soldier tier to 1 when not specified', () => {
      const queue = makeQueue({ soldierType: 'Infantry' });

      const result = calculateQueueInfluence(queue, []);
      expect(result).toBe(5000);
    });
  });

  describe('calculateTotalInfluence', () => {
    it('returns 0 for null/undefined data', () => {
      expect(calculateTotalInfluence(null as unknown as UserData)).toBe(0);
    });

    it('returns 0 for data with no queues', () => {
      expect(calculateTotalInfluence({ queues: [], roster: [] } as unknown as UserData)).toBe(0);
    });

    it('sums influence across all queues', () => {
      const heroes: UserHero[] = [
        makeHero({ id: 'h1', level: 10, stars: 2 }),
      ];
      const data = {
        queues: [
          { id: 'q1', name: 'Q1', heroIds: ['h1'] },
          { id: 'q2', name: 'Q2', heroIds: ['h1'] },
        ],
        roster: heroes,
      } as unknown as UserData;

      const singleQueueInfluence = calculateQueueInfluence(data.queues[0], heroes);
      expect(calculateTotalInfluence(data)).toBe(singleQueueInfluence * 2);
    });
  });

  describe('calculateProgressTrend', () => {
    it('returns 0 for empty snapshots', () => {
      expect(calculateProgressTrend([])).toBe(0);
    });

    it('returns 0 for single snapshot', () => {
      expect(calculateProgressTrend([{ totalInfluence: 1000 }])).toBe(0);
    });

    it('returns 0 when first snapshot is zero', () => {
      expect(calculateProgressTrend([
        { totalInfluence: 0 },
        { totalInfluence: 5000 },
      ])).toBe(0);
    });

    it('calculates positive growth percentage', () => {
      const snapshots = [
        { totalInfluence: 1000 },
        { totalInfluence: 1500 },
      ];
      // (1500-1000)/1000 * 100 = 50
      expect(calculateProgressTrend(snapshots)).toBe(50);
    });

    it('calculates negative growth percentage', () => {
      const snapshots = [
        { totalInfluence: 2000 },
        { totalInfluence: 1500 },
      ];
      // (1500-2000)/2000 * 100 = -25
      expect(calculateProgressTrend(snapshots)).toBe(-25);
    });

    it('uses first and last snapshots, ignoring middle', () => {
      const snapshots = [
        { totalInfluence: 1000 },
        { totalInfluence: 9999 }, // ignored
        { totalInfluence: 2000 },
      ];
      expect(calculateProgressTrend(snapshots)).toBe(100);
    });
  });

  describe('getFactionAdvantage', () => {
    it('Nature beats Horde (1.3x)', () => {
      expect(getFactionAdvantage('Nature', 'Horde')).toBe(1.3);
    });

    it('Horde beats League (1.3x)', () => {
      expect(getFactionAdvantage('Horde', 'League')).toBe(1.3);
    });

    it('League beats Nature (1.3x)', () => {
      expect(getFactionAdvantage('League', 'Nature')).toBe(1.3);
    });

    it('returns 1.0 for same faction', () => {
      expect(getFactionAdvantage('Nature', 'Nature')).toBe(1.0);
    });

    it('returns 1.0 for disadvantaged matchup', () => {
      expect(getFactionAdvantage('Nature', 'League')).toBe(1.0);
    });
  });

  describe('addProgressSnapshot', () => {
    it('appends snapshot to progressLog', () => {
      const data = {
        progressLog: [{ date: '2024-01-01', totalInfluence: 100 }],
        progressModel: { spendProfile: 'F2P' as const, snapshots: [] },
      } as unknown as UserData;

      const snapshot = { date: '2024-02-01', totalInfluence: 200 };
      const result = addProgressSnapshot(data, snapshot);

      expect(result.progressLog).toHaveLength(2);
      expect(result.progressLog[1]).toEqual(snapshot);
    });

    it('updates lastUpdated', () => {
      const data = {
        progressLog: [],
        progressModel: { spendProfile: 'F2P' as const, snapshots: [] },
      } as unknown as UserData;

      const snapshot = { date: '2024-03-15', totalInfluence: 500 };
      const result = addProgressSnapshot(data, snapshot);
      expect(result.lastUpdated).toBe('2024-03-15');
    });

    it('initializes progressLog if missing', () => {
      const data = {} as unknown as UserData;
      const snapshot = { date: '2024-01-01', totalInfluence: 100 };
      const result = addProgressSnapshot(data, snapshot);
      expect(result.progressLog).toHaveLength(1);
    });
  });
});
