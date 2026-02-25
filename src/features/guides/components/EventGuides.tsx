import React from 'react';
import { ChevronDown, Sparkles } from 'lucide-react';
import { Card, CardContent } from '../../../shared/ui/components/card';
import { cn } from '../../../shared/lib/utils';
import eventGuides from '../../../data/eventGuides.json';

interface EventGuidesProps {
  expandedEvent: string | null;
  onToggleEvent: (eventId: string) => void;
}

export const EventGuides: React.FC<EventGuidesProps> = ({ expandedEvent, onToggleEvent }) => {
  return (
    <div className="space-y-3 pt-4">
      {eventGuides.events.map((event) => (
        <Card
          key={event.id}
          variant="outlined"
          className="overflow-hidden"
        >
          <button
            onClick={() => onToggleEvent(event.id)}
            className="w-full p-4 flex items-center justify-between gap-4 hover:bg-surface-800/50 transition-colors"
          >
            <div className="text-left">
              <h3 className="text-title-md font-semibold">{event.name}</h3>
              <p className="text-body-sm text-muted-foreground">
                {event.type} {'\u2022'} {event.frequency}
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
                          <span className="text-primary-400">{'\u2022'}</span>
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
  );
};
