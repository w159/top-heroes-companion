import React from 'react';
import { AlertTriangle, ArrowRight, Zap, Shield } from 'lucide-react';
import { Badge } from '@/shared/ui/components/badge';
import { cn } from '@/shared/lib/utils';

export interface ResourceConflict {
  resource: string;
  events: Array<{
    eventId: string;
    eventName: string;
    day: string;
    pointsPerUnit: number;
  }>;
  recommendation: string;
  multiplier: string;
}

interface ResourceConflictAlertProps {
  conflicts: ResourceConflict[];
}

const ResourceConflictAlert: React.FC<ResourceConflictAlertProps> = ({ conflicts }) => {
  if (!conflicts || conflicts.length === 0) return null;

  return (
    <div className="rounded-xl border border-warning-700/40 bg-warning-900/10 overflow-hidden">
      {/* Banner header */}
      <div className="flex items-center gap-2 px-4 py-3 bg-warning-900/30 border-b border-warning-700/30">
        <AlertTriangle className="h-4 w-4 text-warning-400" />
        <h4 className="text-title-md font-bold text-warning-200">
          Resource Conflicts Detected
        </h4>
        <Badge variant="warning" size="sm" className="ml-auto">
          {conflicts.length} conflict{conflicts.length !== 1 ? 's' : ''}
        </Badge>
      </div>

      {/* Conflict entries */}
      <div className="divide-y divide-warning-700/20">
        {conflicts.map((conflict, idx) => {
          // Find the recommended (highest value) event
          const sortedEvents = [...conflict.events].sort(
            (a, b) => b.pointsPerUnit - a.pointsPerUnit
          );
          const bestEvent = sortedEvents[0];

          return (
            <div key={idx} className="px-4 py-3 space-y-2.5">
              {/* Resource name + multiplier */}
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-warning-400" />
                  <span className="text-body-md font-semibold text-foreground">
                    {conflict.resource}
                  </span>
                </div>
                <Badge variant="gold" size="sm">
                  <Zap className="h-3 w-3" />
                  {conflict.multiplier}
                </Badge>
              </div>

              {/* Side-by-side comparison */}
              <div className="flex items-center gap-2 flex-wrap">
                {conflict.events.map((event, eventIdx) => {
                  const isBest = event.eventId === bestEvent.eventId;
                  return (
                    <React.Fragment key={event.eventId}>
                      {eventIdx > 0 && (
                        <ArrowRight
                          className={cn(
                            'h-4 w-4 shrink-0',
                            isBest ? 'text-success-400' : 'text-muted-foreground'
                          )}
                        />
                      )}
                      <div
                        className={cn(
                          'flex-1 min-w-[120px] rounded-lg border px-3 py-2 text-center',
                          isBest
                            ? 'border-success-700/40 bg-success-900/20'
                            : 'border-surface-700/60 bg-surface-800/40'
                        )}
                      >
                        <p
                          className={cn(
                            'text-body-sm font-medium truncate',
                            isBest ? 'text-success-200' : 'text-muted-foreground'
                          )}
                        >
                          {event.eventName}
                        </p>
                        <p className="text-label-sm text-muted-foreground mt-0.5">
                          {event.day}
                        </p>
                        <p
                          className={cn(
                            'text-title-md font-bold tabular-nums mt-1',
                            isBest ? 'text-success-300' : 'text-surface-400'
                          )}
                        >
                          {event.pointsPerUnit.toLocaleString()}
                          <span className="text-label-sm font-normal ml-1">pts</span>
                        </p>
                        {isBest && (
                          <Badge variant="success" size="sm" className="mt-1.5">
                            Recommended
                          </Badge>
                        )}
                      </div>
                    </React.Fragment>
                  );
                })}
              </div>

              {/* Recommendation text */}
              <p className="text-body-sm text-warning-300/90 italic">
                {conflict.recommendation}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export { ResourceConflictAlert };
export default ResourceConflictAlert;
