/**
 * Multi-Event Optimization Functions
 *
 * Handles optimization across multiple concurrent/upcoming events,
 * including conflict detection, resolution, and resource/time allocation.
 */

import {
  GameEvent,
  EventStrategy,
  PlayerState,
  Resources,
  MultiEventStrategy,
  EventScheduleEntry,
  EventConflict,
  ConflictResolution,
} from '@/types/strategic';
import { calculateResourceValue } from './calculators';
import { optimizeEventStrategy } from './eventStrategyOptimizer';
import { sumResources } from './eventRewards';

// ============================================================================
// MAIN MULTI-EVENT OPTIMIZER
// ============================================================================

/**
 * Optimize participation across multiple concurrent/upcoming events
 */
export function optimizeMultiEventStrategy(
  events: GameEvent[],
  playerState: PlayerState,
  timeframe: { start: Date; end: Date }
): MultiEventStrategy {
  // Step 1: Generate strategy for each event
  const strategies = events.map(event => optimizeEventStrategy(event, playerState));

  // Step 2: Identify conflicts
  const conflicts = identifyEventConflicts(events, strategies);

  // Step 3: Resolve conflicts and select events
  const { selected, skipped, resolutions } = resolveConflicts(strategies, conflicts, playerState);

  // Step 4: Create resource allocation plan
  const resourceAllocation = allocateResourcesAcrossEvents(selected);

  // Step 5: Create time allocation plan
  const timeAllocation = allocateTimeAcrossEvents(selected);

  // Step 6: Create schedule
  const schedule = createEventSchedule(selected);

  // Step 7: Calculate totals
  const totalResources = sumResources(Object.values(resourceAllocation));
  const totalTime = Object.values(timeAllocation).reduce((sum, t) => sum + t, 0);
  const totalRewards = sumResources(selected.map(s => s.expectedRewards));
  const overallROI = totalTime > 0 ? calculateResourceValue(totalRewards) / totalTime : 0;

  // Step 8: Calculate feasibility
  const feasibility = calculateMultiEventFeasibility(selected, playerState);

  const days = (timeframe.end.getTime() - timeframe.start.getTime()) / (1000 * 60 * 60 * 24);

  return {
    timeframe: { ...timeframe, days },
    selectedEvents: selected,
    skippedEvents: skipped,
    totalResourcesNeeded: totalResources,
    resourceAllocation,
    totalTimeRequired: totalTime,
    timeAllocation,
    schedule,
    expectedTotalRewards: totalRewards,
    overallROI,
    feasibility,
    conflicts,
    resolutions,
  };
}

// ============================================================================
// CONFLICT DETECTION
// ============================================================================

/**
 * Identify conflicts between events
 */
function identifyEventConflicts(
  events: GameEvent[],
  strategies: EventStrategy[]
): EventConflict[] {
  const conflicts: EventConflict[] = [];

  // Check for time overlaps
  for (let i = 0; i < events.length; i++) {
    for (let j = i + 1; j < events.length; j++) {
      const event1 = events[i];
      const event2 = events[j];

      const overlaps = checkTimeOverlap(event1, event2);
      if (overlaps) {
        conflicts.push({
          events: [event1.id, event2.id],
          type: 'time_overlap',
          severity: 'major',
          description: `${event1.name} and ${event2.name} run concurrently`,
        });
      }
    }
  }

  return conflicts;
}

/**
 * Check if two events overlap in time
 */
function checkTimeOverlap(event1: GameEvent, event2: GameEvent): boolean {
  return event1.startDate <= event2.endDate && event2.startDate <= event1.endDate;
}

// ============================================================================
// CONFLICT RESOLUTION
// ============================================================================

/**
 * Resolve conflicts and select optimal event mix
 */
function resolveConflicts(
  strategies: EventStrategy[],
  conflicts: EventConflict[],
  playerState: PlayerState
): {
  selected: EventStrategy[];
  skipped: Array<{ event: GameEvent; reason: string }>;
  resolutions: ConflictResolution[];
} {
  // Sort by priority
  const sorted = [...strategies].sort((a, b) => b.priority - a.priority);

  const selected: EventStrategy[] = [];
  const skipped: Array<{ event: GameEvent; reason: string }> = [];
  const resolutions: ConflictResolution[] = [];

  for (const strategy of sorted) {
    // Check if this event conflicts with already selected events
    const hasConflict = conflicts.some(c =>
      c.events.includes(strategy.event.id) &&
      c.events.some(id => selected.some(s => s.event.id === id))
    );

    if (hasConflict) {
      skipped.push({
        event: strategy.event,
        reason: 'Conflicts with higher priority events',
      });
    } else {
      selected.push(strategy);
    }
  }

  return { selected, skipped, resolutions };
}

// ============================================================================
// RESOURCE & TIME ALLOCATION
// ============================================================================

/**
 * Allocate resources across selected events
 */
function allocateResourcesAcrossEvents(strategies: EventStrategy[]): Record<string, Resources> {
  const allocation: Record<string, Resources> = {};

  for (const strategy of strategies) {
    allocation[strategy.event.id] = strategy.requiredEffort.resourcesNeeded;
  }

  return allocation;
}

/**
 * Allocate time across selected events
 */
function allocateTimeAcrossEvents(strategies: EventStrategy[]): Record<string, number> {
  const allocation: Record<string, number> = {};

  for (const strategy of strategies) {
    allocation[strategy.event.id] = strategy.requiredEffort.timeInvestment;
  }

  return allocation;
}

/**
 * Create event schedule
 */
function createEventSchedule(strategies: EventStrategy[]): EventScheduleEntry[] {
  return strategies.map(strategy => ({
    event: strategy.event,
    startTime: strategy.event.startDate,
    endTime: strategy.event.endDate,
    allocatedTime: strategy.requiredEffort.timeInvestment,
    priority: strategy.priority,
    conflicts: [],
  }));
}

// ============================================================================
// FEASIBILITY
// ============================================================================

/**
 * Calculate feasibility of multi-event plan
 */
function calculateMultiEventFeasibility(
  strategies: EventStrategy[],
  playerState: PlayerState
): number {
  // Check resource availability
  const totalNeeded = sumResources(strategies.map(s => s.requiredEffort.resourcesNeeded));
  const resourceScore = Math.min(100, (playerState.resources.gold / totalNeeded.gold) * 100);

  // Check time availability
  const totalTime = strategies.reduce((sum, s) => sum + s.requiredEffort.timeInvestment, 0);
  const maxReasonableTime = strategies.length * 30; // 30 hours per event max
  const timeScore = Math.min(100, (maxReasonableTime / totalTime) * 100);

  // Average confidence
  const avgConfidence = strategies.reduce((sum, s) => sum + s.confidenceScore, 0) / strategies.length;

  // Combined feasibility
  return (resourceScore * 0.3 + timeScore * 0.3 + avgConfidence * 0.4);
}
