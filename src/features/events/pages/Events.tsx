import React from 'react';
import { Zap as Lightning, Hourglass, Star, Lock } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/shared/ui/components/tabs';
import { Badge } from '@/shared/ui/components/badge';
import { Alert, AlertTitle, AlertDescription } from '@/shared/ui/components/alert';
import { cn } from '@/shared/lib/utils';
import { useEvents } from '../hooks/useEvents';
import type { EventTab } from '../hooks/useEvents';
import EventHeader from '../components/EventHeader';
import EventCard from '../components/EventCard';
import type { GameEvent, SpendProfile } from '@/shared/types/types';

interface EventListProps {
  events: GameEvent[];
  tabLabel: string;
  expandedEventId: string | null;
  spendProfile: SpendProfile;
  resourceConflicts: Record<string, string[]>;
  expandedPhases: Record<string, boolean>;
  checkedItems: Record<string, boolean>;
  onToggle: (id: string) => void;
  onSetSpendProfile: (profile: SpendProfile) => void;
  onTogglePhase: (eventId: string, phaseIdx: number) => void;
  onToggleCheckItem: (key: string) => void;
}

const EventList: React.FC<EventListProps> = ({
  events, tabLabel,
  expandedEventId, spendProfile, resourceConflicts,
  expandedPhases, checkedItems,
  onToggle, onSetSpendProfile, onTogglePhase, onToggleCheckItem,
}) => {
  if (events.length === 0) {
    return (
      <Alert variant="default" className="py-12 text-center border-surface-700/30">
        <Lock className="w-10 h-10 mx-auto mb-3 text-muted-foreground/30" />
        <AlertTitle className="text-headline-sm pl-0">No {tabLabel} events</AlertTitle>
        <AlertDescription className="text-muted-foreground pl-0">
          Check back later for upcoming operations
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-4">
      {events.map(event => (
        <EventCard
          key={event.id}
          event={event}
          isExpanded={expandedEventId === event.id}
          spendProfile={spendProfile}
          resourceConflicts={resourceConflicts}
          expandedPhases={expandedPhases}
          checkedItems={checkedItems}
          onToggle={onToggle}
          onSetSpendProfile={onSetSpendProfile}
          onTogglePhase={onTogglePhase}
          onToggleCheckItem={onToggleCheckItem}
        />
      ))}
    </div>
  );
};

const TAB_CONFIG: Array<{ id: EventTab; icon: React.FC<React.SVGProps<SVGSVGElement>>; label: string }> = [
  { id: 'active', icon: Lightning, label: 'Active' },
  { id: 'upcoming', icon: Hourglass, label: 'Upcoming' },
  { id: 'seasonal', icon: Star, label: 'Seasonal' },
];

const Events: React.FC = () => {
  const {
    activeTab, setActiveTab,
    expandedEventId, expandedPhases, checkedItems,
    resetCountdown, spendProfile, setSpendProfile,
    activeEvents, inactiveEvents, seasonalEvents,
    resourceConflicts,
    toggleEvent, togglePhase, toggleCheckItem,
  } = useEvents();

  const eventsByTab: Record<EventTab, GameEvent[]> = {
    active: activeEvents,
    upcoming: inactiveEvents,
    seasonal: seasonalEvents,
  };

  const countByTab: Record<EventTab, number> = {
    active: activeEvents.length,
    upcoming: inactiveEvents.length,
    seasonal: seasonalEvents.length,
  };

  const sharedProps = {
    expandedEventId,
    spendProfile,
    resourceConflicts,
    expandedPhases,
    checkedItems,
    onToggle: toggleEvent,
    onSetSpendProfile: setSpendProfile,
    onTogglePhase: togglePhase,
    onToggleCheckItem: toggleCheckItem,
  };

  return (
    <div className="space-y-6 animate-in">
      <EventHeader
        resetCountdown={resetCountdown}
        activeCount={activeEvents.length}
        upcomingCount={inactiveEvents.length}
      />

      <Tabs
        value={activeTab}
        onValueChange={(value) => setActiveTab(value as EventTab)}
        className="w-full"
      >
        <TabsList className="w-full h-auto gap-2 bg-surface-800/60 p-1.5 rounded-xl">
          {TAB_CONFIG.map(tab => {
            const TabIcon = tab.icon;
            const count = countByTab[tab.id];
            return (
              <TabsTrigger
                key={tab.id}
                value={tab.id}
                className={cn(
                  'flex-1 flex items-center justify-center gap-2 sm:gap-3 px-4 py-3 rounded-xl',
                  'text-label-lg font-semibold transition-all',
                  'data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary-500/20 data-[state=active]:to-tertiary-500/20',
                  'data-[state=active]:border-2 data-[state=active]:border-primary-500',
                  'data-[state=active]:text-foreground data-[state=active]:shadow-lg data-[state=active]:shadow-primary-500/20',
                  'data-[state=inactive]:text-muted-foreground data-[state=inactive]:hover:text-foreground data-[state=inactive]:hover:bg-surface-700',
                )}
              >
                <TabIcon className={cn(
                  'w-5 h-5',
                  'group-data-[state=active]:text-primary-400',
                )} />
                <span className="hidden sm:inline">{tab.label}</span>
                <Badge
                  variant={activeTab === tab.id ? 'primary' : 'default'}
                  size="sm"
                  className={cn(activeTab !== tab.id && 'bg-surface-700')}
                >
                  {count}
                </Badge>
              </TabsTrigger>
            );
          })}
        </TabsList>

        {TAB_CONFIG.map(tab => (
          <TabsContent key={tab.id} value={tab.id} className="mt-4">
            <EventList
              events={eventsByTab[tab.id]}
              tabLabel={tab.label.toLowerCase()}
              {...sharedProps}
            />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default Events;
