import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  getTimeUntilReset,
  getEventState,
  getNextMonday,
  sortEventsByNextOccurrence,
  getTimeUntilEvent,
} from './eventUtils';
import { GameEvent } from '../types/types';

describe('eventUtils', () => {
  describe('getTimeUntilReset', () => {
    afterEach(() => {
      vi.useRealTimers();
    });

    it('returns time in "Xh Ym Zs" format', () => {
      vi.useFakeTimers();
      // Set to 2024-06-10 18:30:45 UTC
      vi.setSystemTime(new Date('2024-06-10T18:30:45Z'));

      const result = getTimeUntilReset();
      expect(result).toBe('5h 29m 15s');
    });

    it('returns near-zero values close to midnight UTC', () => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date('2024-06-10T23:59:00Z'));

      const result = getTimeUntilReset();
      expect(result).toBe('0h 1m 0s');
    });

    it('returns full day at midnight UTC', () => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date('2024-06-10T00:00:00Z'));

      const result = getTimeUntilReset();
      expect(result).toBe('24h 0m 0s');
    });
  });

  describe('getEventState', () => {
    afterEach(() => {
      vi.useRealTimers();
    });

    it('returns inactive for arms-race on Sunday', () => {
      vi.useFakeTimers();
      // Sunday, June 9, 2024
      vi.setSystemTime(new Date('2024-06-09T12:00:00Z'));

      const event: GameEvent = {
        id: 'arms-race',
        name: 'Arms Race',
        type: 'Guild',
        description: 'test',
        scheduleType: 'Weekly-UTC',
        phases: [
          { name: 'Phase 1', description: '', keyTasks: [] },
          { name: 'Phase 2', description: '', keyTasks: [] },
          { name: 'Phase 3', description: '', keyTasks: [] },
          { name: 'Phase 4', description: '', keyTasks: [] },
          { name: 'Phase 5', description: '', keyTasks: [] },
          { name: 'Phase 6', description: '', keyTasks: [] },
        ],
      };

      const state = getEventState(event);
      expect(state.isActive).toBe(false);
      expect(state.activePhaseIndex).toBe(-1);
    });

    it('returns correct phase for arms-race on a weekday', () => {
      vi.useFakeTimers();
      // Wednesday = day 3, so phaseIndex = 2
      vi.setSystemTime(new Date('2024-06-12T12:00:00Z'));

      const event: GameEvent = {
        id: 'arms-race',
        name: 'Arms Race',
        type: 'Guild',
        description: 'test',
        scheduleType: 'Weekly-UTC',
        phases: [
          { name: 'Mon Phase', description: '', keyTasks: [] },
          { name: 'Tue Phase', description: '', keyTasks: [] },
          { name: 'Wed Phase', description: '', keyTasks: [] },
          { name: 'Thu Phase', description: '', keyTasks: [] },
          { name: 'Fri Phase', description: '', keyTasks: [] },
          { name: 'Sat Phase', description: '', keyTasks: [] },
        ],
      };

      const state = getEventState(event);
      expect(state.isActive).toBe(true);
      expect(state.activePhaseIndex).toBe(2);
      expect(state.activePhaseName).toBe('Wed Phase');
    });

    it('returns active for ancient-ruins on weekends', () => {
      vi.useFakeTimers();
      // Saturday
      vi.setSystemTime(new Date('2024-06-08T12:00:00Z'));

      const event: GameEvent = {
        id: 'ancient-ruins',
        name: 'Ancient Ruins',
        type: 'PvE',
        description: 'test',
        scheduleType: 'Weekly-UTC',
      };

      const state = getEventState(event);
      expect(state.isActive).toBe(true);
      expect(state.activePhaseIndex).toBe(0);
    });

    it('returns inactive for ancient-ruins on weekdays', () => {
      vi.useFakeTimers();
      // Tuesday
      vi.setSystemTime(new Date('2024-06-11T12:00:00Z'));

      const event: GameEvent = {
        id: 'ancient-ruins',
        name: 'Ancient Ruins',
        type: 'PvE',
        description: 'test',
        scheduleType: 'Weekly-UTC',
      };

      const state = getEventState(event);
      expect(state.isActive).toBe(false);
    });

    it('returns fallback state for non-scheduled events', () => {
      const event: GameEvent = {
        id: 'custom-event',
        name: 'Custom Event',
        type: 'PvP',
        description: 'test',
        isActive: true,
        activePhaseIndex: 2,
        phases: [
          { name: 'P1', description: '', keyTasks: [] },
          { name: 'P2', description: '', keyTasks: [] },
          { name: 'P3', description: '', keyTasks: [] },
        ],
      };

      const state = getEventState(event);
      expect(state.isActive).toBe(true);
      expect(state.activePhaseIndex).toBe(2);
      expect(state.activePhaseName).toBe('P3');
    });
  });

  describe('getNextMonday', () => {
    afterEach(() => {
      vi.useRealTimers();
    });

    it('returns a future Monday at 00:00 UTC', () => {
      vi.useFakeTimers();
      // Wednesday June 12, 2024
      vi.setSystemTime(new Date('2024-06-12T15:00:00Z'));

      const result = getNextMonday();
      expect(result.getUTCDay()).toBe(1); // Monday
      expect(result.getUTCHours()).toBe(0);
      expect(result.getUTCMinutes()).toBe(0);
      expect(result.getUTCSeconds()).toBe(0);
      // Should be June 17 (next Monday)
      expect(result.getUTCDate()).toBe(17);
    });

    it('returns next day when called on Sunday', () => {
      vi.useFakeTimers();
      // Sunday June 9, 2024
      vi.setSystemTime(new Date('2024-06-09T10:00:00Z'));

      const result = getNextMonday();
      expect(result.getUTCDay()).toBe(1);
      expect(result.getUTCDate()).toBe(10); // June 10 is Monday
    });

    it('returns Monday 7 days out when called on Monday', () => {
      vi.useFakeTimers();
      // Monday June 10, 2024
      vi.setSystemTime(new Date('2024-06-10T10:00:00Z'));

      const result = getNextMonday();
      expect(result.getUTCDay()).toBe(1);
      expect(result.getUTCDate()).toBe(17); // Next Monday
    });
  });

  describe('sortEventsByNextOccurrence', () => {
    it('sorts events by nextOccurrence ascending', () => {
      const events: GameEvent[] = [
        { id: 'c', name: 'C', type: 'PvP', description: '', nextOccurrence: '2024-06-15T00:00:00Z' },
        { id: 'a', name: 'A', type: 'PvP', description: '', nextOccurrence: '2024-06-10T00:00:00Z' },
        { id: 'b', name: 'B', type: 'PvP', description: '', nextOccurrence: '2024-06-12T00:00:00Z' },
      ];

      const sorted = sortEventsByNextOccurrence(events);
      expect(sorted[0].id).toBe('a');
      expect(sorted[1].id).toBe('b');
      expect(sorted[2].id).toBe('c');
    });

    it('puts events without nextOccurrence at the end', () => {
      const events: GameEvent[] = [
        { id: 'no-date', name: 'No Date', type: 'PvP', description: '' },
        { id: 'has-date', name: 'Has Date', type: 'PvP', description: '', nextOccurrence: '2024-06-10T00:00:00Z' },
      ];

      const sorted = sortEventsByNextOccurrence(events);
      expect(sorted[0].id).toBe('has-date');
      expect(sorted[1].id).toBe('no-date');
    });

    it('does not mutate the original array', () => {
      const events: GameEvent[] = [
        { id: 'b', name: 'B', type: 'PvP', description: '', nextOccurrence: '2024-06-15T00:00:00Z' },
        { id: 'a', name: 'A', type: 'PvP', description: '', nextOccurrence: '2024-06-10T00:00:00Z' },
      ];

      sortEventsByNextOccurrence(events);
      expect(events[0].id).toBe('b');
    });
  });

  describe('getTimeUntilEvent', () => {
    afterEach(() => {
      vi.useRealTimers();
    });

    it('returns "Active Now" for past dates', () => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date('2024-06-12T12:00:00Z'));

      expect(getTimeUntilEvent('2024-06-10T00:00:00Z')).toBe('Active Now');
    });

    it('returns days and hours for multi-day durations', () => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date('2024-06-10T00:00:00Z'));

      expect(getTimeUntilEvent('2024-06-13T06:00:00Z')).toBe('3d 6h');
    });

    it('returns hours and minutes for same-day events', () => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date('2024-06-10T10:00:00Z'));

      expect(getTimeUntilEvent('2024-06-10T15:30:00Z')).toBe('5h 30m');
    });

    it('returns minutes only for sub-hour durations', () => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date('2024-06-10T10:00:00Z'));

      expect(getTimeUntilEvent('2024-06-10T10:45:00Z')).toBe('45m');
    });
  });
});
