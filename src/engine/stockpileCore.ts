/**
 * Stockpile Planner Core Functions
 * Resource planning engine that helps players decide when to save or spend
 * resources based on upcoming events.
 */

import { SpendProfile, StockpileItem } from '@/shared/types/types';
import {
  RESOURCE_PRIORITY_TABLE,
  STOCKPILE_PLANS,
  getResourceConflicts,
} from '@/data/eventScoringData';
import {
  StockpileRecommendation,
  ResourceConflict,
  StockpileTimeline,
  PROFILE_MODIFIERS,
  isResourceRelevant,
  determineUrgency,
  buildSaveReason,
} from './stockpileTypes';

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
 */
export function resolveResourceConflicts(
  upcomingEventIds: string[],
): ResourceConflict[] {
  const rawConflicts = getResourceConflicts(upcomingEventIds);
  const resolved: ResourceConflict[] = [];

  for (const conflict of rawConflicts) {
    if (conflict.events.length < 2) continue;

    const sorted = [...conflict.events]
      .sort((a, b) => b.pointsPerUnit - a.pointsPerUnit)
      .map((e) => ({
        eventId: e.eventId,
        eventName: e.eventId,
        day: e.day,
        pointsPerUnit: e.pointsPerUnit,
      }));

    const best = sorted[0];
    const secondBest = sorted[1];

    const ratio =
      secondBest.pointsPerUnit > 0
        ? (best.pointsPerUnit / secondBest.pointsPerUnit).toFixed(1)
        : 'N/A';

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
 * resource.
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

