import React from 'react';
import {
  Calendar, Clock, ChevronDown, ChevronUp, Info, Star, Shield,
  Gift, Zap as Lightning, Trophy, Play, Timer, Hourglass, AlertCircle,
} from 'lucide-react';
import { Card, CardContent } from '../../../shared/ui/components/card';
import { Badge } from '../../../shared/ui/components/badge';
import { Chip } from '../../../shared/ui/components/chip';
import { cn } from '../../../shared/lib/utils';
import type { GameEvent, SpendProfile } from '../../../shared/types/types';
import { getEventState, getTimeUntilEvent } from '../../../shared/utils';
import { getEventIcon, getEventColorClass } from '../lib/eventUtils';
import type { EventColorSet } from '../lib/eventUtils';
import { getResourceConflicts } from '../../../data/eventScoringData';
import ResourceConflictAlert from './ResourceConflictAlert';
import PhaseContent from './PhaseContent';

interface EventCardProps {
  event: GameEvent;
  isExpanded: boolean;
  spendProfile: SpendProfile;
  resourceConflicts: ReturnType<typeof getResourceConflicts>;
  expandedPhases: Record<string, boolean>;
  checkedItems: Record<string, boolean>;
  onToggle: (id: string) => void;
  onSetSpendProfile: (profile: SpendProfile) => void;
  onTogglePhase: (eventId: string, phaseIdx: number) => void;
  onToggleCheckItem: (key: string) => void;
}

const EventCard: React.FC<EventCardProps> = ({
  event, isExpanded, spendProfile, resourceConflicts,
  expandedPhases, checkedItems,
  onToggle, onSetSpendProfile, onTogglePhase, onToggleCheckItem,
}) => {
  const Icon = getEventIcon(event);
  const colors = getEventColorClass(event);
  const eventState = getEventState(event);

  return (
    <Card
      variant="filled"
      className={cn(
        'overflow-hidden transition-all duration-300 border-2',
        colors.border,
        isExpanded && `shadow-lg ${colors.glow}`,
        event.isActive && 'ring-2 ring-primary-500/30'
      )}
    >
      {/* Card Header - Clickable */}
      <button
        onClick={() => onToggle(event.id)}
        className={cn(
          'w-full p-4 sm:p-6 flex items-center justify-between gap-4',
          colors.bg,
          'hover:brightness-110 transition-all text-left'
        )}
      >
        <div className="flex items-center gap-4 flex-1 min-w-0">
          {/* Large Icon */}
          <div className={cn(
            'relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center flex-shrink-0',
            'bg-gradient-to-br',
            colors.gradient
          )}>
            <Icon className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
            {event.isActive && (
              <div className="absolute inset-0 rounded-2xl opacity-20 bg-current" />
            )}
          </div>

          <div className="flex-1 min-w-0">
            {/* Title Row */}
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <h3 className="text-title-lg sm:text-headline-sm font-bold truncate">
                {event.name}
              </h3>
              {event.isActive && (
                <Badge variant="primary" size="sm">
                  <Lightning className="w-3 h-3" />
                  LIVE
                </Badge>
              )}
              {event.criticalDays && event.criticalDays.length > 0 && (
                <Badge variant="warning" size="sm">
                  <Star className="w-3 h-3" />
                  HIGH VALUE
                </Badge>
              )}
            </div>

            {/* Meta Tags */}
            <div className="flex flex-wrap gap-2">
              <Chip variant="assist" size="sm">
                <Shield className="w-3 h-3" />
                {event.type}
              </Chip>
              {event.frequency && (
                <Chip variant="assist" size="sm">
                  <Clock className="w-3 h-3" />
                  {event.frequency}
                </Chip>
              )}
              {event.nextOccurrence && (
                <Chip variant="filter" selected size="sm" className={colors.text}>
                  <Timer className="w-3 h-3" />
                  {event.isActive ? 'Active Now' : getTimeUntilEvent(event.nextOccurrence)}
                </Chip>
              )}
            </div>
          </div>
        </div>

        {/* Expand Button */}
        <div className={cn(
          'w-12 h-12 rounded-xl border-2 flex items-center justify-center flex-shrink-0',
          'transition-all hover:scale-105',
          colors.border,
          colors.bg
        )}>
          {isExpanded ? (
            <ChevronUp className={cn('w-6 h-6', colors.text)} />
          ) : (
            <ChevronDown className={cn('w-6 h-6', colors.text)} />
          )}
        </div>
      </button>

      {/* Card Body - Expanded Content */}
      {isExpanded && (
        <CardContent className="p-4 sm:p-6 space-y-6 animate-in border-t border-border">
          {/* F2P / Whale Toggle */}
          <div className="flex items-center gap-2">
            <span className="text-label-sm text-muted-foreground uppercase tracking-wider">Strategy for:</span>
            {(['F2P', 'LowSpender', 'Whale'] as SpendProfile[]).map(profile => (
              <button
                key={profile}
                onClick={() => onSetSpendProfile(profile)}
                className={cn(
                  'px-3 py-1.5 rounded-lg text-label-sm font-semibold transition-all',
                  spendProfile === profile
                    ? profile === 'Whale'
                      ? 'bg-gold-500/20 text-gold-400 border border-gold-500/50'
                      : profile === 'LowSpender'
                        ? 'bg-tertiary-500/20 text-tertiary-400 border border-tertiary-500/50'
                        : 'bg-success-500/20 text-success-400 border border-success-500/50'
                    : 'bg-surface-800 text-muted-foreground border border-border hover:border-primary-500/30'
                )}
              >
                {profile === 'LowSpender' ? 'Low Spender' : profile}
              </button>
            ))}
          </div>

          {/* Resource Conflict Alerts */}
          {event.scoringDataKey && resourceConflicts.length > 0 && (
            <ResourceConflictAlert conflicts={resourceConflicts} />
          )}

          {/* Description */}
          <div className={cn('flex gap-4 p-4 rounded-xl border-l-4', colors.bg, colors.border)}>
            <div className={cn(
              'w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0',
              'bg-gradient-to-br',
              colors.gradient
            )}>
              <Info className="w-6 h-6 text-white" />
            </div>
            <p className="text-body-md text-muted-foreground leading-relaxed">
              {event.description}
            </p>
          </div>

          {/* Stats Grid */}
          {(event.duration || event.preparationTime || event.criticalDays) && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {event.duration && (
                <div className="flex items-center gap-4 p-4 bg-surface-800 rounded-xl border border-border">
                  <div className="w-11 h-11 rounded-lg bg-primary-500/20 flex items-center justify-center">
                    <Hourglass className="w-5 h-5 text-primary-400" />
                  </div>
                  <div>
                    <p className="text-label-sm text-muted-foreground uppercase tracking-wider">Duration</p>
                    <p className="text-title-md font-semibold">{event.duration}</p>
                  </div>
                </div>
              )}
              {event.preparationTime && (
                <div className="flex items-center gap-4 p-4 bg-warning-500/10 rounded-xl border border-warning-500/30">
                  <div className="w-11 h-11 rounded-lg bg-warning-500/20 flex items-center justify-center">
                    <AlertCircle className="w-5 h-5 text-warning-400" />
                  </div>
                  <div>
                    <p className="text-label-sm text-muted-foreground uppercase tracking-wider">Prep Time</p>
                    <p className="text-title-md font-semibold text-warning-400">{event.preparationTime}</p>
                  </div>
                </div>
              )}
              {event.criticalDays && event.criticalDays.length > 0 && (
                <div className="flex items-center gap-4 p-4 bg-gold-500/10 rounded-xl border border-gold-500/30">
                  <div className="w-11 h-11 rounded-lg bg-gold-500/20 flex items-center justify-center">
                    <Star className="w-5 h-5 text-gold-400" />
                  </div>
                  <div>
                    <p className="text-label-sm text-muted-foreground uppercase tracking-wider">Critical Days</p>
                    <p className="text-title-md font-semibold text-gold-400">
                      {event.criticalDays.map(d => `Day ${d}`).join(', ')}
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Active Phase Banner */}
          {event.isActive && eventState.isActive && event.phases && eventState.activePhaseIndex >= 0 && (
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary-500/20 to-primary-600/10 border-2 border-primary-500 p-6">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-3">
                  <Play className="w-5 h-5 text-primary-400" />
                  <span className="text-label-lg font-bold text-primary-400 uppercase tracking-widest">
                    ACTIVE NOW
                  </span>
                </div>
                <h4 className="text-headline-sm font-bold mb-2">
                  {event.phases[eventState.activePhaseIndex].name}
                </h4>
                <p className="text-body-md text-muted-foreground">
                  {event.phases[eventState.activePhaseIndex].description}
                </p>
              </div>
            </div>
          )}

          {/* Phases Timeline */}
          {event.phases && event.phases.length > 0 && (
            <div>
              <div className="flex items-center gap-3 mb-4">
                <Calendar className={cn('w-6 h-6', colors.text)} />
                <h4 className="text-title-lg font-bold">Event Phases & Strategy</h4>
                <div className={cn('flex-1 h-0.5 rounded', colors.bg)} />
              </div>

              <div className="space-y-3">
                {event.phases.map((phase, idx) => (
                  <PhaseContent
                    key={idx}
                    event={event}
                    phase={phase}
                    phaseIdx={idx}
                    colors={colors}
                    expandedPhases={expandedPhases}
                    checkedItems={checkedItems}
                    onTogglePhase={onTogglePhase}
                    onToggleCheckItem={onToggleCheckItem}
                    spendProfile={spendProfile}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Rewards Section */}
          {event.rewardsHighlight && event.rewardsHighlight.length > 0 && (
            <div>
              <div className="flex items-center gap-3 mb-4">
                <Trophy className="w-6 h-6 text-success-400" />
                <h4 className="text-title-lg font-bold">Rewards & Incentives</h4>
                <div className="flex-1 h-0.5 rounded bg-success-500/20" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {event.rewardsHighlight.map((reward, idx) => (
                  <div
                    key={idx}
                    className="group flex items-center gap-3 p-4 bg-success-500/10 border border-success-500/30 rounded-xl hover:border-success-500/50 hover:shadow-lg hover:shadow-success-500/20 transition-all"
                  >
                    <div className="w-11 h-11 rounded-lg bg-gradient-to-br from-success-500 to-success-600 flex items-center justify-center">
                      <Gift className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-body-md font-medium">{reward}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      )}
    </Card>
  );
};

export default EventCard;
