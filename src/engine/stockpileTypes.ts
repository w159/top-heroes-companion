/**
 * Stockpile Planner Types & Configuration
 * Interfaces and spend profile modifiers for stockpile planning
 */

import { SpendProfile, StockpileItem } from '@/shared/types/types';

// ============================================================================
// INTERFACES
// ============================================================================

export interface StockpileRecommendation {
  resource: string;
  action: 'save' | 'spend' | 'partial';
  targetEvent: string;
  targetDay: string;
  reason: string;
  pointsValue: number;
  urgency: 'critical' | 'high' | 'medium' | 'low';
  daysUntilNeeded: number;
}

export interface ResourceConflict {
  resource: string;
  events: Array<{
    eventId: string;
    eventName: string;
    day: string;
    pointsPerUnit: number;
  }>;
  recommendation: string;
  multiplier: string;
}

export interface StockpileTimeline {
  daysFromNow: number;
  date: string;
  actions: Array<{
    resource: string;
    action: string;
    targetEvent: string;
  }>;
}

// ============================================================================
// SPEND PROFILE MODIFIERS
// ============================================================================

export interface ProfileModifier {
  targetMultiplier: number;
  includeGemItems: boolean;
  includePremium: boolean;
  focusResources: string[];
}

export const PROFILE_MODIFIERS: Record<SpendProfile, ProfileModifier> = {
  F2P: {
    targetMultiplier: 0.6,
    includeGemItems: false,
    includePremium: false,
    focusResources: [
      'stamina',
      'daily rewards',
      'arena tokens',
      'guild coins',
      'speedups',
      'experience',
      'gold',
    ],
  },
  LowSpender: {
    targetMultiplier: 0.85,
    includeGemItems: true,
    includePremium: false,
    focusResources: [
      'stamina',
      'daily rewards',
      'gems',
      'arena tokens',
      'guild coins',
      'speedups',
      'experience',
      'gold',
      'hero shards',
    ],
  },
  Whale: {
    targetMultiplier: 1.0,
    includeGemItems: true,
    includePremium: true,
    focusResources: [], // empty means all resources are considered
  },
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Check whether a resource is relevant for the given spend profile.
 */
export function isResourceRelevant(resource: string, modifier: ProfileModifier): boolean {
  const lower = resource.toLowerCase();

  if (modifier.focusResources.length === 0) return true;

  if (!modifier.includeGemItems && lower.includes('gem')) return false;

  if (!modifier.includePremium && lower.includes('premium')) return false;

  return modifier.focusResources.some((focus) =>
    lower.includes(focus.toLowerCase()),
  );
}

/**
 * Determine urgency based on how soon saving should start.
 */
export function determineUrgency(
  item: StockpileItem,
): 'critical' | 'high' | 'medium' | 'low' {
  if (item.startSavingDays <= 2) return 'critical';
  if (item.startSavingDays <= 5) return 'high';
  if (item.startSavingDays <= 10) return 'medium';
  return 'low';
}

/**
 * Build a human-readable reason string for a save recommendation.
 */
export function buildSaveReason(item: StockpileItem, modifier: ProfileModifier): string {
  const baseReason =
    `Save ${item.targetAmount} for ${item.bestEventDay} ` +
    `(${item.pointsPerUnit} pts/unit).`;

  const profileNote =
    modifier.targetMultiplier < 1
      ? ` Adjusted target for your spend profile (x${modifier.targetMultiplier}).`
      : '';

  const altNote = item.alternativeEvent
    ? ` Alternative: ${item.alternativeEvent}.`
    : '';

  const conflictNote = item.conflictNote ? ` ${item.conflictNote}` : '';

  return baseReason + profileNote + altNote + conflictNote;
}
