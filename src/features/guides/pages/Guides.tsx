import React, { useState } from 'react';
import { BookOpen, Zap, Users, Trophy, ChevronDown, ChevronUp, ExternalLink, Star, AlertTriangle, Target, Sparkles, Shield } from 'lucide-react';
import gameGuides from '../../../data/gameGuides.json';
import eventGuides from '../../../data/eventGuides.json';
import { Card, CardContent, CardHeader } from '../../../shared/ui/components/card';
import { Button } from '../../../shared/ui/components/button';
import { Badge } from '../../../shared/ui/components/badge';
import { cn } from '../../../shared/lib/utils';

interface SectionProps {
  title: string;
  icon: React.ReactNode;
  iconColor?: string;
  isExpanded: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

const Section: React.FC<SectionProps> = ({
  title,
  icon,
  iconColor = 'text-primary-400',
  isExpanded,
  onToggle,
  children
}) => {
  return (
    <Card variant="filled" className="overflow-hidden">
      <button
        onClick={onToggle}
        className={cn(
          'w-full p-4 flex items-center justify-between gap-4',
          'hover:bg-surface-700/50 transition-colors',
          isExpanded && 'bg-surface-800/50'
        )}
      >
        <div className="flex items-center gap-3">
          <div className={cn('w-10 h-10 rounded-lg flex items-center justify-center bg-surface-700', iconColor)}>
            {icon}
          </div>
          <h2 className="text-title-lg font-semibold">{title}</h2>
        </div>
        <div className={cn(
          'w-8 h-8 rounded-lg flex items-center justify-center transition-transform',
          'bg-surface-700/50',
          isExpanded && 'rotate-180'
        )}>
          <ChevronDown className="w-5 h-5 text-muted-foreground" />
        </div>
      </button>
      {isExpanded && (
        <CardContent className="p-4 pt-0 animate-in">
          {children}
        </CardContent>
      )}
    </Card>
  );
};

const Guides: React.FC = () => {
  const [expandedSection, setExpandedSection] = useState<string | null>('beginner');
  const [expandedEvent, setExpandedEvent] = useState<string | null>(null);

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const toggleEvent = (eventId: string) => {
    setExpandedEvent(expandedEvent === eventId ? null : eventId);
  };

  return (
    <div className="space-y-6 animate-in">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-tertiary-500 to-tertiary-600 flex items-center justify-center shadow-lg shadow-tertiary-500/30">
          <BookOpen className="w-7 h-7 text-white" />
        </div>
        <div>
          <h1 className="text-headline-lg font-bold">Game Guides</h1>
          <p className="text-body-md text-muted-foreground">
            Comprehensive strategies from community experts
          </p>
        </div>
      </div>

      {/* Core Principles */}
      <Section
        title="Core Gameplay Principles"
        icon={<Zap className="w-5 h-5" />}
        iconColor="text-gold-400"
        isExpanded={expandedSection === 'principles'}
        onToggle={() => toggleSection('principles')}
      >
        <div className="space-y-4 pt-4">
          {gameGuides.corePrinciples.principles.map((principle, idx) => (
            <div
              key={idx}
              className={cn(
                'rounded-xl p-4 border-2',
                principle.importance === 'critical'
                  ? 'bg-error-500/10 border-error-500/50'
                  : 'bg-surface-800/50 border-border'
              )}
            >
              <div className="flex items-start gap-4">
                {principle.importance === 'critical' && (
                  <div className="w-10 h-10 rounded-lg bg-error-500/20 flex items-center justify-center flex-shrink-0">
                    <AlertTriangle className="w-5 h-5 text-error-400" />
                  </div>
                )}
                <div className="flex-1">
                  <h3 className="text-title-md font-semibold mb-2">
                    {principle.title}
                    {principle.importance === 'critical' && (
                      <Badge variant="error" size="sm" className="ml-2">Critical</Badge>
                    )}
                  </h3>
                  <p className="text-body-md text-muted-foreground mb-3">
                    {principle.description}
                  </p>
                  <p className="text-body-sm text-muted-foreground italic mb-4 pl-4 border-l-2 border-primary-500/30">
                    Why: {principle.reasoning}
                  </p>
                  <ul className="space-y-2">
                    {principle.tips.map((tip, tipIdx) => (
                      <li key={tipIdx} className="flex items-start gap-2 text-body-sm">
                        <Sparkles className="w-4 h-4 text-gold-400 mt-0.5 flex-shrink-0" />
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* Beginner Guide */}
      <Section
        title="New Player Roadmap (10 Steps)"
        icon={<BookOpen className="w-5 h-5" />}
        iconColor="text-primary-400"
        isExpanded={expandedSection === 'beginner'}
        onToggle={() => toggleSection('beginner')}
      >
        <div className="space-y-4 pt-4">
          {gameGuides.beginnerGuide.steps.map((step) => (
            <div
              key={step.step}
              className={cn(
                'rounded-xl p-4 border-2',
                step.priority === 'critical'
                  ? 'border-error-500/50 bg-error-500/5'
                  : 'border-primary-500/30 bg-primary-500/5'
              )}
            >
              <div className="flex items-start gap-4">
                <div className={cn(
                  'w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg text-white flex-shrink-0',
                  step.priority === 'critical' ? 'bg-error-500' : 'bg-primary-500'
                )}>
                  {step.step}
                </div>
                <div className="flex-1">
                  <h3 className="text-title-md font-semibold mb-2">{step.title}</h3>
                  <p className="text-body-md text-muted-foreground mb-3">
                    {step.description}
                  </p>

                  {step.rewards && (
                    <div className="bg-success-500/10 border border-success-500/30 rounded-lg px-4 py-2 mb-3">
                      <span className="text-body-sm text-success-400 font-medium">
                        🎁 Rewards: {step.rewards}
                      </span>
                    </div>
                  )}

                  {step.tips && (
                    <ul className="space-y-1">
                      {step.tips.map((tip, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-body-sm text-muted-foreground">
                          <span className="text-primary-400">•</span>
                          {tip}
                        </li>
                      ))}
                    </ul>
                  )}

                  {step.tasks && (
                    <ul className="space-y-1">
                      {step.tasks.map((task, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-body-sm text-muted-foreground">
                          <span className="text-primary-400">•</span>
                          {task}
                        </li>
                      ))}
                    </ul>
                  )}

                  {step.order && (
                    <ol className="space-y-1 list-decimal list-inside">
                      {step.order.map((item, idx) => (
                        <li key={idx} className="text-body-sm text-muted-foreground">{item}</li>
                      ))}
                    </ol>
                  )}

                  {step.priorities && (
                    <ul className="space-y-1">
                      {step.priorities.map((priority, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-body-sm text-muted-foreground">
                          <span className="text-gold-400">{idx + 1}.</span>
                          {priority}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* Faction Guide */}
      <Section
        title="Faction Strategy Guide"
        icon={<Users className="w-5 h-5" />}
        iconColor="text-tertiary-400"
        isExpanded={expandedSection === 'factions'}
        onToggle={() => toggleSection('factions')}
      >
        <div className="space-y-4 pt-4">
          {/* System Info */}
          <div className="bg-primary-500/10 border-2 border-primary-500/30 rounded-xl p-4">
            <div className="flex items-center gap-3 mb-2">
              <Target className="w-5 h-5 text-primary-400" />
              <h3 className="text-title-md font-semibold">{gameGuides.factionGuide.system.name}</h3>
            </div>
            <p className="text-body-md text-muted-foreground mb-2">
              {gameGuides.factionGuide.system.description}
            </p>
            <Badge variant="primary" size="sm">
              {gameGuides.factionGuide.system.damageBonus}
            </Badge>
          </div>

          {/* Factions */}
          {gameGuides.factionGuide.factions.map((faction) => (
            <Card key={faction.name} variant="outlined" className="overflow-hidden">
              <CardContent className="p-4">
                <h3 className="text-headline-sm font-bold mb-2">{faction.name}</h3>
                <p className="text-body-md text-muted-foreground mb-4">
                  {faction.description}
                </p>

                {/* Key Hero */}
                <div className="bg-gold-500/10 border border-gold-500/30 rounded-xl p-4 mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Star className="w-4 h-4 text-gold-400" />
                    <span className="text-label-lg font-semibold text-gold-400">
                      KEY HERO: {faction.keyHero.name}
                    </span>
                  </div>
                  <p className="text-body-sm mb-1">Role: {faction.keyHero.role}</p>
                  <p className="text-body-sm text-muted-foreground">{faction.keyHero.description}</p>
                </div>

                {/* Strengths & Weaknesses */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <div className="bg-success-500/10 rounded-xl p-4">
                    <h4 className="text-label-lg font-semibold text-success-400 mb-3">✓ Strengths</h4>
                    <ul className="space-y-2">
                      {faction.strengths.map((strength, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-body-sm text-muted-foreground">
                          <span className="text-success-400">•</span>
                          {strength}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="bg-error-500/10 rounded-xl p-4">
                    <h4 className="text-label-lg font-semibold text-error-400 mb-3">✗ Weaknesses</h4>
                    <ul className="space-y-2">
                      {faction.weaknesses.map((weakness, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-body-sm text-muted-foreground">
                          <span className="text-error-400">•</span>
                          {weakness}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Lineup */}
                <div className="bg-surface-800 rounded-xl p-4 mb-4">
                  <h4 className="text-label-lg font-semibold mb-3">Recommended Lineup</h4>
                  <div className="grid grid-cols-3 gap-3 text-body-sm">
                    <div>
                      <span className="text-muted-foreground">Front:</span>
                      <p className="font-medium">{faction.recommendedLineup.front.join(', ')}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Middle:</span>
                      <p className="font-medium">{faction.recommendedLineup.middle.join(', ')}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Back:</span>
                      <p className="font-medium">{faction.recommendedLineup.back.join(', ')}</p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-4 text-body-sm">
                  <div><span className="text-muted-foreground">Cost:</span> <span className="font-medium">{faction.buildingCost}</span></div>
                  <div><span className="text-muted-foreground">Best For:</span> <span className="font-medium">{faction.bestFor.join(', ')}</span></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </Section>

      {/* Event Guides */}
      <Section
        title="Event Strategies"
        icon={<Trophy className="w-5 h-5" />}
        iconColor="text-gold-400"
        isExpanded={expandedSection === 'events'}
        onToggle={() => toggleSection('events')}
      >
        <div className="space-y-3 pt-4">
          {eventGuides.events.map((event) => (
            <Card
              key={event.id}
              variant="outlined"
              className="overflow-hidden"
            >
              <button
                onClick={() => toggleEvent(event.id)}
                className="w-full p-4 flex items-center justify-between gap-4 hover:bg-surface-800/50 transition-colors"
              >
                <div className="text-left">
                  <h3 className="text-title-md font-semibold">{event.name}</h3>
                  <p className="text-body-sm text-muted-foreground">
                    {event.type} • {event.frequency}
                  </p>
                </div>
                <ChevronDown className={cn(
                  'w-5 h-5 text-muted-foreground transition-transform',
                  expandedEvent === event.id && 'rotate-180'
                )} />
              </button>

              {expandedEvent === event.id && (
                <CardContent className="p-4 pt-0 border-t border-border animate-in">
                  <p className="text-body-md text-muted-foreground mb-4 pt-4">
                    {event.description}
                  </p>

                  {event.stages && (
                    <div className="mb-4">
                      <h4 className="text-title-sm font-semibold mb-3">Event Stages</h4>
                      <div className="space-y-3">
                        {event.stages.map((stage) => (
                          <div key={stage.stage} className="bg-surface-800 rounded-xl p-4">
                            <div className="flex items-center gap-3 mb-2">
                              <div className="w-8 h-8 rounded-full bg-primary-500/20 flex items-center justify-center">
                                <span className="text-label-lg font-bold text-primary-400">{stage.stage}</span>
                              </div>
                              <h5 className="text-title-sm font-semibold">{stage.name}</h5>
                            </div>
                            <p className="text-body-sm text-muted-foreground mb-2">
                              Focus: {stage.focus}
                            </p>
                            <p className="text-body-sm mb-3">
                              <span className="font-medium">Strategy:</span> {stage.strategy}
                            </p>
                            <ul className="space-y-1">
                              {stage.tips.map((tip, idx) => (
                                <li key={idx} className="flex items-start gap-2 text-body-sm text-muted-foreground">
                                  <Sparkles className="w-3 h-3 text-gold-400 mt-1 flex-shrink-0" />
                                  {tip}
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {event.dailySchedule && (
                    <div className="mb-4">
                      <h4 className="text-title-sm font-semibold mb-3">Daily Schedule</h4>
                      <div className="space-y-2">
                        {event.dailySchedule.map((day, idx) => (
                          <div key={idx} className="bg-surface-800 rounded-lg p-3">
                            <div className="text-title-sm font-semibold mb-1">
                              {day.day}: {day.focus}
                            </div>
                            <div className="text-body-sm text-muted-foreground">
                              {day.strategy}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {event.strategy && (
                    <div className="bg-primary-500/10 border border-primary-500/30 rounded-xl p-4">
                      <h4 className="text-title-sm font-semibold text-primary-400 mb-3 flex items-center gap-2">
                        <Sparkles className="w-4 h-4" />
                        Pro Tips
                      </h4>
                      {Array.isArray(event.strategy.tips) ? (
                        <ul className="space-y-2">
                          {event.strategy.tips.map((tip, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-body-sm text-muted-foreground">
                              <span className="text-primary-400">•</span>
                              {tip}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <div className="space-y-2 text-body-sm">
                          {event.strategy.early_game && <div><span className="font-medium">Early:</span> {event.strategy.early_game}</div>}
                          {event.strategy.mid_game && <div><span className="font-medium">Mid:</span> {event.strategy.mid_game}</div>}
                          {event.strategy.late_game && <div><span className="font-medium">Late:</span> {event.strategy.late_game}</div>}
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      </Section>

      {/* External Resources */}
      <Card variant="filled">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-3">
            <ExternalLink className="w-5 h-5 text-primary-400" />
            <h2 className="text-title-lg font-semibold">External Resources</h2>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {[
            { url: 'https://topheroes.info/', label: 'TopHeroes.info', description: 'Comprehensive Guides & Tools' },
            { url: 'https://www.reddit.com/r/TopHeroes', label: 'r/TopHeroes', description: 'Community Discussion' },
            { url: 'https://topheroes1.fandom.com/wiki/Top_Heroes_Wiki', label: 'Top Heroes Wiki', description: 'Hero Database' },
          ].map((link) => (
            <a
              key={link.url}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                'flex items-center gap-3 p-4 bg-surface-800/50 rounded-xl',
                'hover:bg-surface-800 transition-colors group border border-transparent hover:border-primary-500/30'
              )}
            >
              <div className="w-10 h-10 rounded-lg bg-primary-500/20 flex items-center justify-center">
                <ExternalLink className="w-5 h-5 text-primary-400" />
              </div>
              <div className="flex-1">
                <p className="text-title-sm font-medium group-hover:text-primary-400 transition-colors">
                  {link.label}
                </p>
                <p className="text-body-sm text-muted-foreground">{link.description}</p>
              </div>
            </a>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default Guides;
