import React, { useMemo } from 'react';
import { Package, Clock, AlertTriangle, TrendingUp, CheckCircle } from 'lucide-react';
import { Badge } from '@/shared/ui/components/badge';
import { cn } from '@/shared/lib/utils';
import { StockpileItem } from '@/shared/types/types';

interface StockpileTrackerProps {
  items: StockpileItem[];
  eventName: string;
  daysUntilEvent?: number;
}

const StockpileTracker: React.FC<StockpileTrackerProps> = ({
  items,
  eventName,
  daysUntilEvent,
}) => {
  const sortedItems = useMemo(
    () => [...items].sort((a, b) => b.pointsPerUnit - a.pointsPerUnit),
    [items]
  );

  const isWithinSavingWindow = (startDays: number): boolean => {
    if (daysUntilEvent == null) return false;
    return daysUntilEvent <= startDays;
  };

  const getSavingProgress = (startDays: number): number => {
    if (daysUntilEvent == null) return 0;
    if (daysUntilEvent >= startDays) return 0;
    if (daysUntilEvent <= 0) return 100;
    return Math.round(((startDays - daysUntilEvent) / startDays) * 100);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Package className="h-5 w-5 text-primary-400" />
          <h3 className="text-title-lg font-bold text-foreground">
            Stockpile Tracker
          </h3>
        </div>
        {daysUntilEvent != null && (
          <Badge
            variant={daysUntilEvent <= 3 ? 'error' : daysUntilEvent <= 7 ? 'warning' : 'primary'}
            size="md"
          >
            <Clock className="h-3.5 w-3.5" />
            {daysUntilEvent <= 0
              ? 'Event Active!'
              : `${daysUntilEvent} day${daysUntilEvent !== 1 ? 's' : ''} until ${eventName}`}
          </Badge>
        )}
      </div>

      {/* Item cards */}
      <div className="space-y-3">
        {sortedItems.map((item, idx) => {
          const inWindow = isWithinSavingWindow(item.startSavingDays);
          const progress = getSavingProgress(item.startSavingDays);

          return (
            <div
              key={idx}
              className={cn(
                'rounded-xl border p-4 transition-colors',
                inWindow
                  ? 'border-warning-700/40 bg-warning-900/10'
                  : 'border-border bg-surface-900/60'
              )}
            >
              {/* Top row: name + points */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="text-body-md font-semibold text-foreground">
                      {item.resource}
                    </h4>
                    {item.conflictNote && (
                      <Badge variant="warning" size="sm">
                        <AlertTriangle className="h-3 w-3" />
                        Conflict
                      </Badge>
                    )}
                  </div>

                  {/* Target and best day */}
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1.5">
                    <span className="text-body-sm text-muted-foreground">
                      Target: <span className="text-foreground font-medium">{item.targetAmount}</span>
                    </span>
                    <span className="text-body-sm text-muted-foreground">
                      Best day: <span className="text-foreground font-medium">{item.bestEventDay}</span>
                    </span>
                  </div>
                </div>

                {/* Points per unit */}
                <div className="text-right shrink-0">
                  <div className="flex items-center gap-1 justify-end">
                    <TrendingUp className="h-3.5 w-3.5 text-success-400" />
                    <span className="text-title-md font-bold text-success-300 tabular-nums">
                      {item.pointsPerUnit.toLocaleString()}
                    </span>
                  </div>
                  <span className="text-label-sm text-muted-foreground">pts/unit</span>
                </div>
              </div>

              {/* Saving timeline bar */}
              <div className="mt-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-label-sm text-muted-foreground">
                    Start saving {item.startSavingDays} days before
                  </span>
                  {daysUntilEvent != null && (
                    <span className="text-label-sm font-medium">
                      {inWindow ? (
                        <span className="flex items-center gap-1 text-warning-300">
                          <CheckCircle className="h-3 w-3" />
                          Saving window open
                        </span>
                      ) : (
                        <span className="text-muted-foreground">Not yet</span>
                      )}
                    </span>
                  )}
                </div>
                <div className="h-1.5 w-full rounded-full bg-surface-700/80 overflow-hidden">
                  <div
                    className={cn(
                      'h-full rounded-full transition-all duration-500',
                      progress >= 100
                        ? 'bg-success-500'
                        : progress > 50
                          ? 'bg-warning-500'
                          : 'bg-primary-500'
                    )}
                    style={{ width: `${Math.min(progress, 100)}%` }}
                  />
                </div>
              </div>

              {/* Conflict note */}
              {item.conflictNote && (
                <div className="mt-2.5 flex items-start gap-2 rounded-lg bg-warning-900/20 border border-warning-700/30 px-3 py-2">
                  <AlertTriangle className="h-3.5 w-3.5 text-warning-400 mt-0.5 shrink-0" />
                  <span className="text-body-sm text-warning-300/90">{item.conflictNote}</span>
                </div>
              )}

              {/* Alternative event note */}
              {item.alternativeEvent && (
                <p className="mt-2 text-body-sm text-muted-foreground">
                  Also useful in:{' '}
                  <span className="text-primary-300 font-medium">{item.alternativeEvent}</span>
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export { StockpileTracker };
export default StockpileTracker;
