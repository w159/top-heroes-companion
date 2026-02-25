import React, { useState, useEffect, useMemo } from 'react';
import { EVENTS } from '../../../shared/types/constants';
import { GameEvent, SpendProfile } from '../../../shared/types/types';
import { getEventState, getTimeUntilReset, getTimeUntilEvent, sortEventsByNextOccurrence, useUserData } from '../../../shared/utils';
import {
  Calendar, Clock, AlertTriangle, CheckCircle, ChevronDown, ChevronUp,
  Sword, Hammer, UserPlus, Zap, Info, Target, Trophy, CheckSquare,
  Square, Star, Shield, Flame, Users, Gift, BookOpen, Sparkles,
  TrendingUp, Award, Lock, Unlock, ChevronRight, Circle, Play,
  Coins, Gem, Swords, Crown, Skull, Heart, Zap as Lightning,
  MapPin, Timer, Hourglass, AlertCircle, TrendingDown, BarChart3,
  Percent, ArrowUp, ArrowRight, Package, Layers, Filter
} from 'lucide-react';
import { Card, CardContent, CardHeader } from '../../../shared/ui/components/card';
import { Button } from '../../../shared/ui/components/button';
import { Badge } from '../../../shared/ui/components/badge';
import { Chip } from '../../../shared/ui/components/chip';
import { cn } from '../../../shared/lib/utils';
import ScoringTable from '../components/ScoringTable';
import StockpileTracker from '../components/StockpileTracker';
import ResourceConflictAlert from '../components/ResourceConflictAlert';
import { getResourceConflicts } from '../../../data/eventScoringData';
import './events.css';

type EventTab = 'active' | 'upcoming' | 'seasonal';

const Events: React.FC = () => {
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
    }, 1000);
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

  const getEventIcon = (event: GameEvent) => {
    const name = event.name.toLowerCase();
    if (name.includes('arms') || name.includes('war')) return Swords;
    if (name.includes('battlefield') || name.includes('glory')) return Target;
    if (name.includes('boss')) return Flame;
    if (name.includes('arena')) return Trophy;
    if (name.includes('chess')) return Layers;
    if (name.includes('kingdom')) return Crown;
    if (name.includes('dark') || name.includes('invasion')) return Skull;
    if (name.includes('loot') || name.includes('wheel') || name.includes('dice')) return Gift;
    if (name.includes('bounty') || name.includes('hunt')) return BookOpen;
    return Calendar;
  };

  const getEventColorClass = (event: GameEvent) => {
    if (event.isActive) return {
      border: 'border-primary-500',
      bg: 'bg-primary-500/10',
      text: 'text-primary-400',
      gradient: 'from-primary-500 to-primary-600',
      glow: 'shadow-primary-500/30'
    };

    if (event.type === 'Guild') return {
      border: 'border-tertiary-500',
      bg: 'bg-tertiary-500/10',
      text: 'text-tertiary-400',
      gradient: 'from-tertiary-500 to-tertiary-600',
      glow: 'shadow-tertiary-500/30'
    };

    if (event.type === 'PvP' || event.type === 'PvP Arena' || event.type === 'Server War') return {
      border: 'border-error-500',
      bg: 'bg-error-500/10',
      text: 'text-error-400',
      gradient: 'from-error-500 to-error-600',
      glow: 'shadow-error-500/30'
    };

    if (event.type === 'Seasonal') return {
      border: 'border-gold-500',
      bg: 'bg-gold-500/10',
      text: 'text-gold-400',
      gradient: 'from-gold-500 to-gold-600',
      glow: 'shadow-gold-500/30'
    };

    return {
      border: 'border-success-500',
      bg: 'bg-success-500/10',
      text: 'text-success-400',
      gradient: 'from-success-500 to-success-600',
      glow: 'shadow-success-500/30'
    };
  };

  const renderPhaseContent = (event: GameEvent, phase: any, phaseIdx: number, colors: ReturnType<typeof getEventColorClass>) => {
    const phaseKey = `${event.id}-${phaseIdx}`;
    const isPhaseExpanded = expandedPhases[phaseKey];

    return (
      <div
        key={phaseIdx}
        className={cn(
          'rounded-xl border-2 overflow-hidden transition-all duration-300',
          event.criticalDays?.includes(phaseIdx + 1)
            ? 'border-gold-500/50 bg-gold-500/5'
            : 'border-border bg-surface-900/50'
        )}
      >
        {/* Phase Header */}
        <button
          onClick={() => togglePhase(event.id, phaseIdx)}
          className="w-full flex items-center justify-between p-4 hover:bg-surface-800/50 transition-colors"
        >
          <div className="flex items-center gap-4">
            {/* Phase Number Badge */}
            <div className={cn(
              'relative w-12 h-12 rounded-lg flex items-center justify-center',
              'bg-gradient-to-br font-bold text-lg text-white',
              colors.gradient
            )}>
              {phaseIdx + 1}
              {event.criticalDays?.includes(phaseIdx + 1) && (
                <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-gold-500 flex items-center justify-center animate-pulse">
                  <Star className="w-3 h-3 text-white" />
                </div>
              )}
            </div>

            <div className="text-left">
              <h5 className="text-title-md font-semibold">{phase.name}</h5>
              {event.criticalDays?.includes(phaseIdx + 1) && (
                <Badge variant="warning" size="sm" className="mt-1">HIGH VALUE</Badge>
              )}
            </div>
          </div>

          <ChevronRight className={cn(
            'w-5 h-5 text-muted-foreground transition-transform duration-300',
            isPhaseExpanded && 'rotate-90'
          )} />
        </button>

        {/* Phase Content */}
        {isPhaseExpanded && (
          <div className="p-4 pt-0 space-y-4 animate-in">
            <p className={cn(
              'text-body-md text-muted-foreground pl-4 border-l-2',
              colors.border
            )}>
              {phase.description}
            </p>

            {/* Preparation Section */}
            {phase.preparation && phase.preparation.length > 0 && (
              <div className="bg-warning-500/10 border border-warning-500/30 rounded-xl p-4">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-warning-500 flex items-center justify-center">
                    <AlertTriangle className="w-5 h-5 text-white" />
                  </div>
                  <h6 className="text-label-lg font-semibold text-warning-400 uppercase tracking-wider">
                    Prepare BEFORE This Phase
                  </h6>
                </div>

                <div className="space-y-2">
                  {phase.preparation.map((item: string, prepIdx: number) => {
                    const prepKey = `${phaseKey}-prep-${prepIdx}`;
                    const isChecked = checkedItems[prepKey];

                    return (
                      <button
                        key={prepIdx}
                        onClick={() => toggleCheckItem(prepKey)}
                        className={cn(
                          'w-full flex items-start gap-3 p-3 rounded-lg transition-all text-left',
                          'border border-warning-500/20 hover:border-warning-500/40',
                          isChecked ? 'bg-surface-900/60 opacity-60' : 'bg-surface-900/30'
                        )}
                      >
                        <div className="mt-0.5">
                          {isChecked ? (
                            <CheckCircle className="w-5 h-5 text-warning-500" />
                          ) : (
                            <Circle className="w-5 h-5 text-warning-500/50" />
                          )}
                        </div>
                        <span className={cn(
                          'text-body-md',
                          isChecked && 'line-through text-muted-foreground'
                        )}>
                          {item}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Key Tasks Section */}
            {phase.keyTasks && phase.keyTasks.length > 0 && (
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <Target className={cn('w-5 h-5', colors.text)} />
                  <h6 className="text-label-lg font-semibold uppercase tracking-wider">
                    During This Phase - Execute
                  </h6>
                </div>

                <div className="space-y-2">
                  {phase.keyTasks.map((task: string, taskIdx: number) => {
                    const taskKey = `${phaseKey}-task-${taskIdx}`;
                    const isChecked = checkedItems[taskKey];

                    return (
                      <button
                        key={taskIdx}
                        onClick={() => toggleCheckItem(taskKey)}
                        className={cn(
                          'w-full flex items-start gap-3 p-3 rounded-lg transition-all text-left',
                          'border-l-2 bg-surface-800/30 hover:bg-surface-800/50',
                          colors.border,
                          isChecked && 'opacity-50'
                        )}
                      >
                        <div className="mt-0.5">
                          {isChecked ? (
                            <CheckSquare className={cn('w-4 h-4', colors.text)} />
                          ) : (
                            <Square className="w-4 h-4 text-muted-foreground" />
                          )}
                        </div>
                        <span className={cn(
                          'text-body-sm',
                          isChecked && 'line-through text-muted-foreground'
                        )}>
                          {task}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Scoring Table */}
            {phase.scoringActions && phase.scoringActions.length > 0 && (
              <ScoringTable
                actions={phase.scoringActions}
                dayName={phase.name}
                victoryPoints={phase.victoryPoints}
                doNotDo={phase.doNotDo}
                exploits={phase.exploits}
                spendProfile={spendProfile}
              />
            )}

            {/* Stockpile Targets */}
            {phase.stockpileTargets && phase.stockpileTargets.length > 0 && (
              <StockpileTracker
                items={phase.stockpileTargets}
                eventName={event.name}
              />
            )}

            {/* Legacy Points Strategy (fallback for phases without scoring tables) */}
            {phase.pointsStrategy && (!phase.scoringActions || phase.scoringActions.length === 0) && (
              <div className="bg-primary-500/10 border border-primary-500/30 rounded-xl p-4">
                <div className="flex items-center gap-3 mb-3">
                  <TrendingUp className="w-5 h-5 text-primary-400" />
                  <h6 className="text-label-lg font-semibold text-primary-400 uppercase tracking-wider">
                    Points Strategy & Optimization
                  </h6>
                </div>
                <pre className="text-body-sm text-muted-foreground whitespace-pre-wrap">
                  {phase.pointsStrategy}
                </pre>
              </div>
            )}

            {/* Pro Tips */}
            {phase.tips && phase.tips.length > 0 && (
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <Sparkles className="w-5 h-5 text-tertiary-400" />
                  <h6 className="text-label-lg font-semibold text-tertiary-400 uppercase tracking-wider">
                    Pro Tips & Advanced Tactics
                  </h6>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {phase.tips.map((tip: string, tipIdx: number) => (
                    <div
                      key={tipIdx}
                      className="flex items-start gap-3 p-3 bg-tertiary-500/10 border border-tertiary-500/20 rounded-lg"
                    >
                      <Lightning className="w-4 h-4 text-tertiary-400 mt-0.5 flex-shrink-0" />
                      <span className="text-body-sm text-muted-foreground">{tip}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  const renderEventCard = (event: GameEvent) => {
    const Icon = getEventIcon(event);
    const colors = getEventColorClass(event);
    const isExpanded = expandedEventId === event.id;
    const eventState = getEventState(event);

    return (
      <Card
        key={event.id}
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
          onClick={() => toggleEvent(event.id)}
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
                <div className="absolute inset-0 rounded-2xl animate-ping opacity-30 bg-current" />
              )}
            </div>

            <div className="flex-1 min-w-0">
              {/* Title Row */}
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <h3 className="text-title-lg sm:text-headline-sm font-bold truncate">
                  {event.name}
                </h3>
                {event.isActive && (
                  <Badge variant="primary" size="sm" className="animate-pulse">
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
                  onClick={() => setSpendProfile(profile)}
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
                  {event.phases.map((phase, idx) => renderPhaseContent(event, phase, idx, colors))}
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

  const tabData = [
    { id: 'active' as EventTab, icon: Lightning, label: 'Active', count: activeEvents.length },
    { id: 'upcoming' as EventTab, icon: Hourglass, label: 'Upcoming', count: inactiveEvents.length },
    { id: 'seasonal' as EventTab, icon: Star, label: 'Seasonal', count: seasonalEvents.length },
  ];

  return (
    <div className="space-y-6 animate-in">
      {/* Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-tertiary-500/20 via-primary-500/10 to-secondary-500/20 border border-tertiary-500/30 p-6 sm:p-8">
        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-tertiary-500/30 to-transparent rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-primary-500/20 to-transparent rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

        <div className="relative z-10">
          <div className="flex flex-col sm:flex-row sm:items-center gap-6 mb-6">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-tertiary-500 to-primary-500 flex items-center justify-center shadow-lg shadow-tertiary-500/30">
              <Swords className="w-10 h-10 text-white" />
            </div>
            <div>
              <h1 className="text-headline-lg sm:text-display-sm font-bold bg-gradient-to-r from-white via-tertiary-300 to-primary-300 bg-clip-text text-transparent">
                Event Command Center
              </h1>
              <p className="text-body-md text-muted-foreground mt-1">
                Tactical briefings • Strategic planning • Victory optimization
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card variant="filled" className="p-4 border border-border/50 hover:border-primary-500/50 transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary-500/20 flex items-center justify-center">
                  <Clock className="w-6 h-6 text-primary-400" />
                </div>
                <div>
                  <p className="text-label-sm text-muted-foreground uppercase tracking-wider">Next Reset</p>
                  <p className="text-title-lg font-bold font-mono">{resetCountdown}</p>
                </div>
              </div>
            </Card>

            <Card variant="filled" className="p-4 border border-primary-500/30 hover:border-primary-500/50 transition-colors shadow-sm shadow-primary-500/20">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary-500/20 flex items-center justify-center animate-pulse">
                  <Lightning className="w-6 h-6 text-primary-400" />
                </div>
                <div>
                  <p className="text-label-sm text-muted-foreground uppercase tracking-wider">Active Events</p>
                  <p className="text-title-lg font-bold text-primary-400">{activeEvents.length}</p>
                </div>
              </div>
            </Card>

            <Card variant="filled" className="p-4 border border-gold-500/30 hover:border-gold-500/50 transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-gold-500/20 flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-gold-400" />
                </div>
                <div>
                  <p className="text-label-sm text-muted-foreground uppercase tracking-wider">Upcoming</p>
                  <p className="text-title-lg font-bold text-gold-400">{inactiveEvents.length}</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>

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
          currentEvents.map(renderEventCard)
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
