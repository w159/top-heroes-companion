import React from 'react';
import {
  AlertTriangle, CheckCircle, CheckSquare, Square, Star,
  Target, Sparkles, Zap as Lightning, TrendingUp, ChevronRight, Circle,
} from 'lucide-react';
import { Badge } from '../../../shared/ui/components/badge';
import { cn } from '../../../shared/lib/utils';
import type { GameEvent, EventPhase, SpendProfile } from '../../../shared/types/types';
import type { EventColorSet } from '../lib/eventUtils';
import ScoringTable from './ScoringTable';
import StockpileTracker from './StockpileTracker';

interface PhaseContentProps {
  event: GameEvent;
  phase: EventPhase;
  phaseIdx: number;
  colors: EventColorSet;
  expandedPhases: Record<string, boolean>;
  checkedItems: Record<string, boolean>;
  onTogglePhase: (eventId: string, phaseIdx: number) => void;
  onToggleCheckItem: (key: string) => void;
  spendProfile: SpendProfile;
}

const PhaseContent: React.FC<PhaseContentProps> = ({
  event, phase, phaseIdx, colors,
  expandedPhases, checkedItems,
  onTogglePhase, onToggleCheckItem, spendProfile,
}) => {
  const phaseKey = `${event.id}-${phaseIdx}`;
  const isPhaseExpanded = expandedPhases[phaseKey];

  return (
    <div
      className={cn(
        'rounded-xl border-2 overflow-hidden transition-all duration-300',
        event.criticalDays?.includes(phaseIdx + 1)
          ? 'border-gold-500/50 bg-gold-500/5'
          : 'border-border bg-surface-900/50'
      )}
    >
      {/* Phase Header */}
      <button
        onClick={() => onTogglePhase(event.id, phaseIdx)}
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
              <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-gold-500 flex items-center justify-center">
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
                      onClick={() => onToggleCheckItem(prepKey)}
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
                      onClick={() => onToggleCheckItem(taskKey)}
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

export default PhaseContent;
