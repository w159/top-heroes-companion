/**
 * Stockpile Planner
 *
 * Resource planning engine that helps players decide when to save or spend
 * resources based on upcoming events. Resolves conflicts when multiple events
 * compete for the same resource and generates actionable timelines.
 *
 * Core responsibilities:
 * 1. Generate stockpile recommendations per spend profile
 * 2. Detect and resolve resource conflicts across events
 * 3. Build day-by-day saving timelines
 * 4. Provide per-resource spend-or-save advice
 *
 * @module stockpilePlanner
 */

import { SpendProfile, StockpileItem } from '../shared/types/types';
import {
  RESOURCE_PRIORITY_TABLE,
  STOCKPILE_PLANS,
  getResourceConflicts,
} from '../data/eventScoringData';

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

interface ProfileModifier {
  targetMultiplier: number;
  includeGemItems: boolean;
  includePremium: boolean;
  focusResources: string[];
}

const PROFILE_MODIFIERS: Record<SpendProfile, ProfileModifier> = {
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
// RECOMMENDATION GENERATION
// ============================================================================

/**
 * Generate stockpile recommendations for upcoming events.
 *
 * For each event the function:
 * - Looks up the stockpile plan from STOCKPILE_PLANS
 * - Checks for resource conflicts across all upcoming events
 * - Recommends the higher-value event when a conflict exists
 * - Applies spend-profile modifiers to filter and adjust targets
 *
 * Results are sorted by urgency (critical first) then by pointsValue descending.
 */
export function generateStockpileRecommendations(
  upcomingEventIds: string[],
  spendProfile: SpendProfile,
): StockpileRecommendation[] {
  const modifier = PROFILE_MODIFIERS[spendProfile];
  const conflicts = getResourceConflicts(upcomingEventIds);

  // Build a lookup of the best event per conflicting resource
  const bestEventForResource = new Map<string, { eventId: string; pointsPerUnit: number }>();
  for (const conflict of conflicts) {
    const sorted = [...conflict.events].sort(
      (a, b) => b.pointsPerUnit - a.pointsPerUnit,
    );
    if (sorted.length > 0) {
      bestEventForResource.set(conflict.resource, {
        eventId: sorted[0].eventId,
        pointsPerUnit: sorted[0].pointsPerUnit,
      });
    }
  }

  const recommendations: StockpileRecommendation[] = [];

  for (const eventId of upcomingEventIds) {
    const plan: StockpileItem[] | undefined = STOCKPILE_PLANS[eventId];
    if (!plan) continue;

    for (const item of plan) {
      // Filter by spend profile
      if (!isResourceRelevant(item.resource, modifier)) continue;

      // If this resource is contested, only recommend for the best event
      const bestEvent = bestEventForResource.get(item.resource);
      if (bestEvent && bestEvent.eventId !== eventId) {
        // This is not the optimal event for this resource — skip or mark partial
        recommendations.push({
          resource: item.resource,
          action: 'spend',
          targetEvent: eventId,
          targetDay: item.bestEventDay,
          reason: `Better saved for a higher-value event (${bestEvent.eventId})`,
          pointsValue: item.pointsPerUnit,
          urgency: 'low',
          daysUntilNeeded: item.startSavingDays,
        });
        continue;
      }

      const urgency = determineUrgency(item);

      recommendations.push({
        resource: item.resource,
        action: 'save',
        targetEvent: eventId,
        targetDay: item.bestEventDay,
        reason: buildSaveReason(item, modifier),
        pointsValue: Math.round(item.pointsPerUnit * modifier.targetMultiplier),
        urgency,
        daysUntilNeeded: item.startSavingDays,
      });
    }
  }

  // Sort: urgency order (critical > high > medium > low), then pointsValue desc
  const urgencyOrder: Record<string, number> = {
    critical: 0,
    high: 1,
    medium: 2,
    low: 3,
  };

  recommendations.sort((a, b) => {
    const urgDiff = urgencyOrder[a.urgency] - urgencyOrder[b.urgency];
    if (urgDiff !== 0) return urgDiff;
    return b.pointsValue - a.pointsValue;
  });

  return recommendations;
}

// ============================================================================
// CONFLICT RESOLUTION
// ============================================================================

/**
 * Identify resources that appear in multiple upcoming events and recommend
 * the optimal allocation for each.
 *
 * Uses RESOURCE_PRIORITY_TABLE and getResourceConflicts to find overlapping
 * resource demands, then returns a clear recommendation with a multiplier
 * showing how much better the optimal choice is.
 */
export function resolveResourceConflicts(
  upcomingEventIds: string[],
): ResourceConflict[] {
  const rawConflicts = getResourceConflicts(upcomingEventIds);
  const resolved: ResourceConflict[] = [];

  for (const conflict of rawConflicts) {
    if (conflict.events.length < 2) continue;

    // Sort events by points-per-unit descending to find the best one
    const sorted = [...conflict.events].sort(
      (a, b) => b.pointsPerUnit - a.pointsPerUnit,
    );

    const best = sorted[0];
    const secondBest = sorted[1];

    // Calculate how much better the optimal choice is
    const ratio =
      secondBest.pointsPerUnit > 0
        ? (best.pointsPerUnit / secondBest.pointsPerUnit).toFixed(1)
        : 'N/A';

    // Look up any global priority notes
    const priorityEntry = RESOURCE_PRIORITY_TABLE[conflict.resource];
    const priorityNote = priorityEntry
      ? ` (Global priority: ${priorityEntry})`
      : '';

    resolved.push({
      resource: conflict.resource,
      events: sorted,
      recommendation:
        `Save for ${best.eventName} (${best.day}) — ` +
        `${best.pointsPerUnit} pts/unit vs ${secondBest.pointsPerUnit} pts/unit.` +
        priorityNote,
      multiplier: `${ratio}x`,
    });
  }

  return resolved;
}

// ============================================================================
// TIMELINE GENERATION
// ============================================================================

/**
 * Build a chronological, day-by-day timeline of when to start saving each
 * resource. Works backwards from each event's start date by the item's
 * startSavingDays value.
 *
 * @param upcomingEventIds - IDs of upcoming events to plan for
 * @param eventDates - Map of eventId to ISO date string for the event start
 * @returns Sorted array of timeline entries grouped by date
 */
export function generateStockpileTimeline(
  upcomingEventIds: string[],
  eventDates: Record<string, string>,
): StockpileTimeline[] {
  const actionsByDate = new Map<
    string,
    Array<{ resource: string; action: string; targetEvent: string }>
  >();

  for (const eventId of upcomingEventIds) {
    const plan: StockpileItem[] | undefined = STOCKPILE_PLANS[eventId];
    if (!plan) continue;

    const eventDateStr = eventDates[eventId];
    if (!eventDateStr) continue;

    const eventDate = new Date(eventDateStr);

    for (const item of plan) {
      // Calculate the save-start date by subtracting startSavingDays
      const saveDate = new Date(eventDate);
      saveDate.setDate(saveDate.getDate() - item.startSavingDays);

      const dateKey = saveDate.toISOString().split('T')[0];

      if (!actionsByDate.has(dateKey)) {
        actionsByDate.set(dateKey, []);
      }

      actionsByDate.get(dateKey)!.push({
        resource: item.resource,
        action: `Start saving (target: ${item.targetAmount})`,
        targetEvent: eventId,
      });
    }
  }

  // Convert map to sorted array
  const now = new Date();
  const timeline: StockpileTimeline[] = [];

  const entries = Array.from(actionsByDate.entries());
  for (const [dateStr, actions] of entries) {
    const date = new Date(dateStr);
    const diffMs = date.getTime() - now.getTime();
    const daysFromNow = Math.round(diffMs / (1000 * 60 * 60 * 24));

    timeline.push({
      daysFromNow,
      date: dateStr,
      actions,
    });
  }

  timeline.sort((a, b) => a.daysFromNow - b.daysFromNow);

  return timeline;
}

// ============================================================================
// SINGLE-RESOURCE ADVICE
// ============================================================================

/**
 * For a specific resource, check all upcoming events and determine whether to
 * spend it now or save it.
 *
 * Returns the single best recommendation — the event where this resource
 * yields the highest points value.
 */
export function getSpendOrSaveAdvice(
  resource: string,
  upcomingEventIds: string[],
): StockpileRecommendation {
  let bestItem: StockpileItem | null = null;
  let bestEventId: string | null = null;

  for (const eventId of upcomingEventIds) {
    const plan: StockpileItem[] | undefined = STOCKPILE_PLANS[eventId];
    if (!plan) continue;

    for (const item of plan) {
      if (item.resource.toLowerCase() !== resource.toLowerCase()) continue;

      if (!bestItem || item.pointsPerUnit > bestItem.pointsPerUnit) {
        bestItem = item;
        bestEventId = eventId;
      }
    }
  }

  // No upcoming event uses this resource — safe to spend
  if (!bestItem || !bestEventId) {
    return {
      resource,
      action: 'spend',
      targetEvent: 'none',
      targetDay: 'N/A',
      reason: 'No upcoming event benefits significantly from this resource. Safe to spend.',
      pointsValue: 0,
      urgency: 'low',
      daysUntilNeeded: Infinity,
    };
  }

  const urgency = determineUrgency(bestItem);

  // Determine action based on urgency and how soon the event is
  const action: 'save' | 'spend' | 'partial' =
    urgency === 'critical' || urgency === 'high'
      ? 'save'
      : bestItem.startSavingDays <= 3
        ? 'partial'
        : 'save';

  const conflictSuffix = bestItem.conflictNote
    ? ` Note: ${bestItem.conflictNote}`
    : '';

  return {
    resource,
    action,
    targetEvent: bestEventId,
    targetDay: bestItem.bestEventDay,
    reason:
      `Best used during ${bestEventId} on ${bestItem.bestEventDay} ` +
      `(${bestItem.pointsPerUnit} pts/unit). ` +
      `Start saving ${bestItem.startSavingDays} days before.` +
      conflictSuffix,
    pointsValue: bestItem.pointsPerUnit,
    urgency,
    daysUntilNeeded: bestItem.startSavingDays,
  };
}

// ============================================================================
// INTERNAL HELPERS
// ============================================================================

/**
 * Check whether a resource is relevant for the given spend profile.
 */
function isResourceRelevant(resource: string, modifier: ProfileModifier): boolean {
  const lower = resource.toLowerCase();

  // Whale profile considers everything
  if (modifier.focusResources.length === 0) return true;

  // Filter out gem-buyable items for F2P
  if (!modifier.includeGemItems && lower.includes('gem')) return false;

  // Filter out premium resources for non-whale
  if (!modifier.includePremium && lower.includes('premium')) return false;

  // Check if the resource matches any focus resource keyword
  return modifier.focusResources.some((focus) =>
    lower.includes(focus.toLowerCase()),
  );
}

/**
 * Determine urgency based on how soon saving should start.
 */
function determineUrgency(
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
function buildSaveReason(item: StockpileItem, modifier: ProfileModifier): string {
  const baseReason =
    `Save ${item.targetAmount} for ${item.bestEventDay} ` +
    `(${item.pointsPerUnit} pts/unit).`;

  const profileNote =
    modifier.targetMultiplier < 1
      ? ` Adjusted target for your spend profile (×${modifier.targetMultiplier}).`
      : '';

  const altNote = item.alternativeEvent
    ? ` Alternative: ${item.alternativeEvent}.`
    : '';

  const conflictNote = item.conflictNote ? ` ${item.conflictNote}` : '';

  return baseReason + profileNote + altNote + conflictNote;
}
