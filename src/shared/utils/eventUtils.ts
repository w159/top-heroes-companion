import { GameEvent } from '../types/types';

export const getTimeUntilReset = (): string => {
    const now = new Date();
    const nextReset = new Date();
    nextReset.setUTCHours(24, 0, 0, 0);

    const diff = nextReset.getTime() - now.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    return `${hours}h ${minutes}m ${seconds}s`;
};

export const getEventState = (event: GameEvent): { isActive: boolean; activePhaseIndex: number; activePhaseName?: string } => {
    const today = new Date();
    const day = today.getUTCDay(); // 0=Sun, 1=Mon... 6=Sat

    if (event.scheduleType === 'Weekly-UTC') {
        if (event.id === 'arms-race') {
            if (day === 0) return { isActive: false, activePhaseIndex: -1 };
            const phaseIndex = day - 1;
            if (event.phases && event.phases[phaseIndex]) {
              return {
                isActive: true,
                    activePhaseIndex: phaseIndex,
                    activePhaseName: event.phases[phaseIndex].name
                };
            }
        }

        // Sunday specific events
        if (event.id === 'ancient-ruins') {
            const isWeekend = day === 0 || day === 6;
            return { isActive: isWeekend, activePhaseIndex: 0 };
        }
    }

    return {
        isActive: !!event.isActive,
        activePhaseIndex: event.activePhaseIndex || 0,
        activePhaseName: event.phases?.[event.activePhaseIndex || 0]?.name
    };
};

/**
 * Get the next Monday 00:00 UTC from now
 */
export const getNextMonday = (): Date => {
  const now = new Date();
  const dayOfWeek = now.getUTCDay();
  const daysUntilMonday = dayOfWeek === 0 ? 1 : 8 - dayOfWeek;
  const nextMonday = new Date(now);
  nextMonday.setUTCDate(now.getUTCDate() + daysUntilMonday);
  nextMonday.setUTCHours(0, 0, 0, 0);
  return nextMonday;
};

/**
 * Get next occurrence of a Chess War event (rotates through 6 phases on 2-day cycles)
 */
export const getNextChessWarPhase = (): { date: Date; phaseIndex: number } => {
  const now = new Date();
  const dayOfWeek = now.getUTCDay();

  // Chess War phases: Mon-Tue (0), Wed-Thu (1), Fri-Sat (2)
  // Then repeats with different activities
  let daysToAdd = 0;
  let phaseIndex = 0;

  if (dayOfWeek === 0) { // Sunday
    daysToAdd = 1; // Next Monday
    phaseIndex = 0;
  } else if (dayOfWeek === 1 || dayOfWeek === 2) { // Mon or Tue
    if (dayOfWeek === 2 && now.getUTCHours() >= 0) {
      daysToAdd = 1; // Wednesday
      phaseIndex = 1;
    } else {
      phaseIndex = 0;
    }
  } else if (dayOfWeek === 3 || dayOfWeek === 4) { // Wed or Thu
    if (dayOfWeek === 4 && now.getUTCHours() >= 0) {
      daysToAdd = 1; // Friday
      phaseIndex = 2;
    } else {
      phaseIndex = 1;
    }
  } else if (dayOfWeek === 5 || dayOfWeek === 6) { // Fri or Sat
    if (dayOfWeek === 6 && now.getUTCHours() >= 0) {
      daysToAdd = 2; // Monday
      phaseIndex = 3; // Next cycle
    } else {
      phaseIndex = 2;
    }
  }

  const nextDate = new Date(now);
  nextDate.setUTCDate(now.getUTCDate() + daysToAdd);
  nextDate.setUTCHours(0, 0, 0, 0);

  return { date: nextDate, phaseIndex };
};

/**
 * Sort events by next occurrence time
 */
export const sortEventsByNextOccurrence = (events: GameEvent[]): GameEvent[] => {
  return [...events].sort((a, b) => {
    const dateA = a.nextOccurrence ? new Date(a.nextOccurrence).getTime() : Infinity;
    const dateB = b.nextOccurrence ? new Date(b.nextOccurrence).getTime() : Infinity;
    return dateA - dateB;
  });
};

/**
 * Format time until event starts
 */
export const getTimeUntilEvent = (eventDate: string): string => {
  const now = new Date().getTime();
  const target = new Date(eventDate).getTime();
  const diff = target - now;

  if (diff <= 0) return 'Active Now';

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  if (days > 0) return `${days}d ${hours}h`;
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
};
