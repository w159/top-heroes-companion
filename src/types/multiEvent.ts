/**
 * Multi-Event Optimization & Schedule Types
 */

import { Faction } from '../shared/types/types';
import { Resources } from './playerState';
import {
  EventType,
  EventDifficulty,
  GameEvent,
  EventStrategy,
  EventEffort,
  ParticipationLevel,
} from './eventStrategy';

// ============================================================================
// SCHEDULE & RECURRING EVENT TYPES
// ============================================================================

/**
 * Event schedule with all upcoming events
 */
export interface EventSchedule {
  server: string;
  currentEvents: GameEvent[];
  upcomingEvents: GameEvent[];
  recurringEvents: RecurringEvent[];
  lastUpdated: Date;
}

/**
 * Recurring event pattern
 */
export interface RecurringEvent {
  eventType: EventType;
  name: string;
  frequency: 'daily' | 'weekly' | 'biweekly' | 'monthly';
  dayOfWeek?: number; // 0-6 for weekly events
  dayOfMonth?: number; // 1-31 for monthly events
  nextOccurrence: Date;
  typicalRewards: Resources;
  recommendedParticipation: ParticipationLevel;
}

// ============================================================================
// MULTI-EVENT OPTIMIZATION TYPES
// ============================================================================

/**
 * Multi-event optimization result
 */
export interface MultiEventStrategy {
  timeframe: {
    start: Date;
    end: Date;
    days: number;
  };

  // Events to participate in
  selectedEvents: EventStrategy[];
  skippedEvents: Array<{
    event: GameEvent;
    reason: string;
  }>;

  // Resource planning
  totalResourcesNeeded: Resources;
  resourceAllocation: Record<string, Resources>; // eventId -> resources

  // Time planning
  totalTimeRequired: number; // hours
  timeAllocation: Record<string, number>; // eventId -> hours
  schedule: EventScheduleEntry[];

  // Outcomes
  expectedTotalRewards: Resources;
  overallROI: number;
  feasibility: number; // 0-100

  // Conflicts
  conflicts: EventConflict[];
  resolutions: ConflictResolution[];
}

/**
 * Event schedule entry for calendar
 */
export interface EventScheduleEntry {
  event: GameEvent;
  startTime: Date;
  endTime: Date;
  allocatedTime: number; // hours
  priority: number;
  conflicts: string[]; // Other event IDs
}

/**
 * Event timing conflict
 */
export interface EventConflict {
  events: string[]; // Event IDs in conflict
  type: 'time_overlap' | 'resource_conflict' | 'hero_requirement_overlap';
  severity: 'minor' | 'major' | 'blocking';
  description: string;
}

/**
 * Conflict resolution
 */
export interface ConflictResolution {
  conflict: EventConflict;
  resolution: string;
  tradeoffs: string[];
  impact: string;
}

/**
 * Event meta analysis
 */
export interface EventMetaAnalysis {
  server: string;
  period: {
    start: Date;
    end: Date;
  };

  // Participation patterns
  averageParticipation: Record<EventType, number>;
  competitionLevel: Record<EventType, EventDifficulty>;

  // Reward analysis
  bestROIEvents: Array<{
    eventType: EventType;
    averageROI: number;
    frequency: number;
  }>;

  // Hero requirements
  mostUsefulHeroes: Array<{
    heroId: string;
    eventTypes: EventType[];
    usageFrequency: number;
  }>;

  // Recommendations
  mustAttendEvents: EventType[];
  optionalEvents: EventType[];
  skipRecommendations: EventType[];
}
