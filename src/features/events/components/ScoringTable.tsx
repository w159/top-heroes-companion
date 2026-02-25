import React, { useState, useMemo } from 'react';
import { ArrowUpDown, Trophy, Star, TrendingUp, AlertTriangle } from 'lucide-react';
import { Badge } from '../../../shared/ui/components/badge';
import { cn } from '../../../shared/lib/utils';
import { ScoringAction, EfficiencyTier } from '../../../shared/types/types';

interface ScoringTableProps {
  actions: ScoringAction[];
  dayName?: string;
  victoryPoints?: number;
  doNotDo?: string[];
  exploits?: string[];
  spendProfile?: 'F2P' | 'LowSpender' | 'Whale';
}

type SortField = 'action' | 'points' | 'efficiency';
type SortDirection = 'asc' | 'desc';

const TIER_ORDER: Record<EfficiencyTier, number> = { S: 0, A: 1, B: 2, C: 3 };

const TIER_STYLES: Record<EfficiencyTier, string> = {
  S: 'bg-gold-900/60 text-gold-200 border-gold-700/40',
  A: 'bg-success-900/60 text-success-200 border-success-700/40',
  B: 'bg-primary-900/60 text-primary-200 border-primary-700/40',
  C: 'bg-surface-700/80 text-surface-300 border-surface-600/40',
};

const ScoringTable: React.FC<ScoringTableProps> = ({
  actions,
  dayName,
  victoryPoints,
  doNotDo,
  exploits,
  spendProfile,
}) => {
  const [sortField, setSortField] = useState<SortField>('efficiency');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection(field === 'points' ? 'desc' : 'asc');
    }
  };

  const sortedActions = useMemo(() => {
    const sorted = [...actions].sort((a, b) => {
      const dir = sortDirection === 'asc' ? 1 : -1;

      if (sortField === 'efficiency') {
        const tierDiff = TIER_ORDER[a.efficiency] - TIER_ORDER[b.efficiency];
        if (tierDiff !== 0) return tierDiff * dir;
        return (b.points - a.points); // secondary sort by points desc
      }

      if (sortField === 'points') {
        return (a.points - b.points) * dir;
      }

      // action (alphabetical)
      return a.action.localeCompare(b.action) * dir;
    });
    return sorted;
  }, [actions, sortField, sortDirection]);

  const renderTierBadge = (tier: EfficiencyTier) => (
    <Badge
      className={cn(
        'border font-bold',
        TIER_STYLES[tier],
        tier === 'S' && 'animate-pulse'
      )}
      size="sm"
    >
      {tier === 'S' && <Star className="h-3 w-3 fill-current" />}
      {tier}
    </Badge>
  );

  const SortHeader: React.FC<{ field: SortField; label: string; className?: string }> = ({
    field,
    label,
    className,
  }) => (
    <button
      onClick={() => handleSort(field)}
      className={cn(
        'flex items-center gap-1 text-label-sm font-medium text-muted-foreground',
        'hover:text-foreground transition-colors',
        className
      )}
    >
      {label}
      <ArrowUpDown
        className={cn(
          'h-3 w-3',
          sortField === field ? 'text-primary-400' : 'text-surface-600'
        )}
      />
    </button>
  );

  return (
    <div className="space-y-4">
      {/* Header row */}
      <div className="flex flex-wrap items-center gap-2">
        {dayName && (
          <h3 className="text-title-md font-bold text-foreground">{dayName}</h3>
        )}
        {victoryPoints != null && (
          <Badge variant="gold" size="md">
            <Trophy className="h-3.5 w-3.5" />
            Worth {victoryPoints} Victory Points
          </Badge>
        )}
        {spendProfile && (
          <Badge variant="outline" size="sm">
            {spendProfile}
          </Badge>
        )}
      </div>

      {/* Scoring table */}
      <div className="rounded-xl border border-border bg-surface-900/60 overflow-hidden">
        {/* Desktop header */}
        <div className="hidden sm:grid sm:grid-cols-[1fr_100px_100px_80px] gap-4 px-4 py-3 bg-surface-800/60 border-b border-border">
          <SortHeader field="action" label="Action" />
          <SortHeader field="points" label="Points" className="justify-end" />
          <span className="text-label-sm font-medium text-muted-foreground text-right">Unit</span>
          <SortHeader field="efficiency" label="Tier" className="justify-center" />
        </div>

        {/* Rows */}
        <div className="divide-y divide-border">
          {sortedActions.map((item, idx) => (
            <div
              key={idx}
              className={cn(
                'px-4 py-3 transition-colors hover:bg-surface-800/40',
                // Desktop: grid layout
                'sm:grid sm:grid-cols-[1fr_100px_100px_80px] sm:gap-4 sm:items-center',
                // Mobile: flex column
                'flex flex-col gap-2 sm:flex-row'
              )}
            >
              {/* Action name + notes */}
              <div className="flex-1 min-w-0">
                <span className="text-body-md text-foreground">{item.action}</span>
                {item.notes && (
                  <p className="text-body-sm text-muted-foreground mt-0.5">{item.notes}</p>
                )}
              </div>

              {/* Mobile: inline badges row */}
              <div className="flex items-center gap-3 sm:contents">
                <span className="text-body-md font-semibold text-foreground tabular-nums sm:text-right">
                  {item.points.toLocaleString()}
                </span>
                {item.unit && (
                  <span className="text-body-sm text-muted-foreground sm:text-right">
                    {item.unit}
                  </span>
                )}
                {!item.unit && (
                  <span className="text-body-sm text-muted-foreground sm:text-right">&mdash;</span>
                )}
                <div className="ml-auto sm:ml-0 sm:flex sm:justify-center">
                  {renderTierBadge(item.efficiency)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Common Mistakes */}
      {doNotDo && doNotDo.length > 0 && (
        <div className="rounded-xl border border-error-700/40 bg-error-900/20 p-4 space-y-2">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-error-400" />
            <h4 className="text-title-md font-bold text-error-200">Common Mistakes</h4>
          </div>
          <ul className="space-y-1.5 pl-6 list-disc">
            {doNotDo.map((item, idx) => (
              <li key={idx} className="text-body-sm text-error-300/90">
                {item}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Advanced Tactics */}
      {exploits && exploits.length > 0 && (
        <div className="rounded-xl border border-tertiary-700/40 bg-tertiary-900/20 p-4 space-y-2">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-tertiary-400" />
            <h4 className="text-title-md font-bold text-tertiary-200">Advanced Tactics</h4>
          </div>
          <ul className="space-y-1.5 pl-6 list-disc">
            {exploits.map((item, idx) => (
              <li key={idx} className="text-body-sm text-tertiary-300/90">
                {item}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export { ScoringTable };
export default ScoringTable;
