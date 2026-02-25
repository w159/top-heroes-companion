import React from 'react';
import { Zap as Lightning, Hourglass, Star, Lock } from 'lucide-react';
import { Card } from '../../../shared/ui/components/card';
import { Badge } from '../../../shared/ui/components/badge';
import { cn } from '../../../shared/lib/utils';
import { useEvents } from '../hooks/useEvents';
import type { EventTab } from '../hooks/useEvents';
import EventHeader from '../components/EventHeader';
import EventCard from '../components/EventCard';

const Events: React.FC = () => {
  const {
    activeTab, setActiveTab,
    expandedEventId, expandedPhases, checkedItems,
    resetCountdown, spendProfile, setSpendProfile,
    activeEvents, inactiveEvents, seasonalEvents,
    resourceConflicts, currentEvents,
    toggleEvent, togglePhase, toggleCheckItem,
  } = useEvents();

  const tabData = [
    { id: 'active' as EventTab, icon: Lightning, label: 'Active', count: activeEvents.length },
    { id: 'upcoming' as EventTab, icon: Hourglass, label: 'Upcoming', count: inactiveEvents.length },
    { id: 'seasonal' as EventTab, icon: Star, label: 'Seasonal', count: seasonalEvents.length },
  ];

  return (
    <div className="space-y-6 animate-in">
      {/* Header */}
      <EventHeader
        resetCountdown={resetCountdown}
        activeCount={activeEvents.length}
        upcomingCount={inactiveEvents.length}
      />

      {/* Tabs */}
      <Card variant="filled" className="p-2">
        <div className="flex gap-2">
          {tabData.map(tab => {
            const TabIcon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'flex-1 flex items-center justify-center gap-2 sm:gap-3 px-4 py-3 rounded-xl',
                  'text-label-lg font-semibold transition-all',
                  isActive
                    ? 'bg-gradient-to-r from-primary-500/20 to-tertiary-500/20 border-2 border-primary-500 text-foreground shadow-lg shadow-primary-500/20'
                    : 'text-muted-foreground hover:text-foreground hover:bg-surface-700'
                )}
              >
                <TabIcon className={cn('w-5 h-5', isActive && 'text-primary-400')} />
                <span className="hidden sm:inline">{tab.label}</span>
                <Badge
                  variant={isActive ? 'primary' : 'default'}
                  size="sm"
                  className={cn(!isActive && 'bg-surface-700')}
                >
                  {tab.count}
                </Badge>
              </button>
            );
          })}
        </div>
      </Card>

      {/* Events List */}
      <div className="space-y-4">
        {currentEvents.length > 0 ? (
          currentEvents.map(event => (
            <EventCard
              key={event.id}
              event={event}
              isExpanded={expandedEventId === event.id}
              spendProfile={spendProfile}
              resourceConflicts={resourceConflicts}
              expandedPhases={expandedPhases}
              checkedItems={checkedItems}
              onToggle={toggleEvent}
              onSetSpendProfile={setSpendProfile}
              onTogglePhase={togglePhase}
              onToggleCheckItem={toggleCheckItem}
            />
          ))
        ) : (
          <Card variant="outlined" className="text-center py-16">
            <Lock className="w-16 h-16 mx-auto mb-4 text-muted-foreground/30" />
            <h3 className="text-headline-sm font-medium mb-2">No {activeTab} events</h3>
            <p className="text-body-md text-muted-foreground">
              Check back later for upcoming operations
            </p>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Events;
