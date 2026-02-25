import { describe, it, expect } from 'vitest';
import { TIER_WEIGHTS, RARITY_WEIGHTS, getRoleWeight } from './strategicWeights';

describe('strategicWeights', () => {
  describe('TIER_WEIGHTS', () => {
    it('has correct weight for S tier', () => {
      expect(TIER_WEIGHTS.S).toBe(5);
    });

    it('has correct weight for A tier', () => {
      expect(TIER_WEIGHTS.A).toBe(4);
    });

    it('has correct weight for B tier', () => {
      expect(TIER_WEIGHTS.B).toBe(3);
    });

    it('has correct weight for C tier', () => {
      expect(TIER_WEIGHTS.C).toBe(2);
    });

    it('has correct weight for D tier', () => {
      expect(TIER_WEIGHTS.D).toBe(1);
    });

    it('has descending values from S to D', () => {
      expect(TIER_WEIGHTS.S).toBeGreaterThan(TIER_WEIGHTS.A);
      expect(TIER_WEIGHTS.A).toBeGreaterThan(TIER_WEIGHTS.B);
      expect(TIER_WEIGHTS.B).toBeGreaterThan(TIER_WEIGHTS.C);
      expect(TIER_WEIGHTS.C).toBeGreaterThan(TIER_WEIGHTS.D);
    });
  });

  describe('RARITY_WEIGHTS', () => {
    it('has correct weight for Mythic', () => {
      expect(RARITY_WEIGHTS.Mythic).toBe(3);
    });

    it('has correct weight for Legendary', () => {
      expect(RARITY_WEIGHTS.Legendary).toBe(2);
    });

    it('has correct weight for Epic', () => {
      expect(RARITY_WEIGHTS.Epic).toBe(1);
    });

    it('has correct weight for Rare', () => {
      expect(RARITY_WEIGHTS.Rare).toBe(0.5);
    });

    it('has descending values from Mythic to Rare', () => {
      expect(RARITY_WEIGHTS.Mythic).toBeGreaterThan(RARITY_WEIGHTS.Legendary);
      expect(RARITY_WEIGHTS.Legendary).toBeGreaterThan(RARITY_WEIGHTS.Epic);
      expect(RARITY_WEIGHTS.Epic).toBeGreaterThan(RARITY_WEIGHTS.Rare);
    });
  });

  describe('getRoleWeight', () => {
    it('returns 1.4 for DPS', () => {
      expect(getRoleWeight('DPS')).toBe(1.4);
    });

    it('returns 1.4 for Damage Dealer (alias)', () => {
      expect(getRoleWeight('Damage Dealer')).toBe(1.4);
    });

    it('returns 1.25 for Support', () => {
      expect(getRoleWeight('Support')).toBe(1.25);
    });

    it('returns 1.25 for Supporter (alias)', () => {
      expect(getRoleWeight('Supporter')).toBe(1.25);
    });

    it('returns 1.25 for Healer (alias)', () => {
      expect(getRoleWeight('Healer')).toBe(1.25);
    });

    it('returns 1.15 for Tank', () => {
      expect(getRoleWeight('Tank')).toBe(1.15);
    });

    it('returns 1.15 for Controller', () => {
      expect(getRoleWeight('Controller')).toBe(1.15);
    });

    it('returns 1 for unknown roles', () => {
      expect(getRoleWeight('Unknown')).toBe(1);
      expect(getRoleWeight('')).toBe(1);
      expect(getRoleWeight('Ranger')).toBe(1);
    });
  });
});
