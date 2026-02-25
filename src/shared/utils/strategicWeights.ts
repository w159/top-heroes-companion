/**
 * Strategic Weights — single source of truth for scoring/ranking algorithms.
 * Used by recommendation engines, upgrade optimizers, and event rankers.
 */

export const TIER_WEIGHTS: Record<string, number> = {
  S: 5,
  A: 4,
  B: 3,
  C: 2,
  D: 1,
};

export const RARITY_WEIGHTS: Record<string, number> = {
  Mythic: 3,
  Legendary: 2,
  Epic: 1,
  Rare: 0.5,
};

export function getRoleWeight(role: string): number {
  if (role === 'DPS' || role === 'Damage Dealer') return 1.4;
  if (role === 'Support' || role === 'Supporter' || role === 'Healer') return 1.25;
  if (role === 'Tank' || role === 'Controller') return 1.15;
  return 1;
}
