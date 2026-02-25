import { useState, useEffect, useMemo } from 'react';
import { EVENTS } from '@/shared/types/constants';
import type { GameEvent, SpendProfile } from '@/shared/types/types';
import { getTimeUntilReset, sortEventsByNextOccurrence, useUserData } from '@/shared/utils';
import { getResourceConflicts } from '@/data/eventScoringData';

export type EventTab = 'active' | 'upcoming' | 'seasonal';

const COUNTDOWN_INTERVAL_MS = 1000;

export function useEvents() {
  const { data } = useUserData();
  const [activeTab, setActiveTab] = useState<EventTab>('active');
  const [expandedEventId, setExpandedEventId] = useState<string | null>('guild-arms-race');
  const [expandedPhases, setExpandedPhases] = useState<Record<string, boolean>>({});
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});
  const [resetCountdown, setResetCountdown] = useState<string>(getTimeUntilReset());
  const [spendProfile, setSpendProfile] = useState<SpendProfile>(data?.settings?.mainFaction ? 'F2P' : 'F2P');

  useEffect(() => {
    const timer = setInterval(() => {
      setResetCountdown(getTimeUntilReset());
    }, COUNTDOWN_INTERVAL_MS);
    return () => clearInterval(timer);
  }, []);

  const sortedEvents = sortEventsByNextOccurrence(EVENTS);
  const activeEvents = sortedEvents.filter(e => e.isActive);
  const inactiveEvents = sortedEvents.filter(e => !e.isActive);
  const seasonalEvents = sortedEvents.filter(e => e.type === 'Seasonal');

  const resourceConflicts = useMemo(() => {
    const allEventIds = sortedEvents.filter(e => e.scoringDataKey).map(e => e.scoringDataKey!);
    return getResourceConflicts(allEventIds);
  }, [sortedEvents]);

  const currentEvents = useMemo(() => {
    switch (activeTab) {
      case 'active': return activeEvents;
      case 'upcoming': return inactiveEvents;
      case 'seasonal': return seasonalEvents;
      default: return activeEvents;
    }
  }, [activeTab, activeEvents, inactiveEvents, seasonalEvents]);

  const toggleEvent = (id: string) => {
    setExpandedEventId(expandedEventId === id ? null : id);
  };

  const togglePhase = (eventId: string, phaseIdx: number) => {
    const key = `${eventId}-${phaseIdx}`;
    setExpandedPhases(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const toggleCheckItem = (key: string) => {
    setCheckedItems(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return {
    activeTab,
    setActiveTab,
    expandedEventId,
    expandedPhases,
    checkedItems,
    resetCountdown,
    spendProfile,
    setSpendProfile,
    activeEvents,
    inactiveEvents,
    seasonalEvents,
    resourceConflicts,
    currentEvents,
    toggleEvent,
    togglePhase,
    toggleCheckItem,
  };
}
