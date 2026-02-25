import * as React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from './dialog';
import { Progress } from './progress';
import { Button } from './button';
import { ScrollArea } from './scroll-area';
import { Separator } from './separator';
import { cn } from '@/shared/lib/utils';
import {
  CheckCircle2,
  Circle,
  Loader2,
  XCircle,
  AlertTriangle,
  Clock,
} from 'lucide-react';

// ============================================
// Types
// ============================================

type StepStatus = 'pending' | 'active' | 'completed' | 'error' | 'warning' | 'skipped';

interface OperationStep {
  id: string;
  label: string;
  description?: string;
  status: StepStatus;
  progress?: number;
  statusMessage?: string;
  errorMessage?: string;
  retryable?: boolean;
  durationMs?: number;
}

interface OperationProgressModalProps {
  open: boolean;
  title: string;
  description?: string;
  steps: OperationStep[];
  overallProgress: number;
  estimatedSecondsRemaining?: number | null;
  isComplete: boolean;
  isCancelled?: boolean;
  canCancel?: boolean;
  onCancel?: () => void;
  onRetryStep?: (stepId: string) => void;
  onClose: () => void;
  logEntries?: string[];
}

// ============================================
// Helpers
// ============================================

function StepStatusIcon({ status }: { status: StepStatus }) {
  switch (status) {
    case 'completed':
      return <CheckCircle2 className="h-5 w-5 text-success-400 shrink-0" />;
    case 'active':
      return <Loader2 className="h-5 w-5 text-primary-400 shrink-0 animate-spin" />;
    case 'error':
      return <XCircle className="h-5 w-5 text-error-400 shrink-0" />;
    case 'warning':
      return <AlertTriangle className="h-5 w-5 text-warning-400 shrink-0" />;
    case 'skipped':
      return <Circle className="h-5 w-5 text-muted-foreground/40 shrink-0" />;
    default:
      return <Circle className="h-5 w-5 text-muted-foreground shrink-0" />;
  }
}

function formatDuration(ms: number): string {
  if (ms < 1000) return `${ms}ms`;
  if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`;
  return `${Math.floor(ms / 60000)}m ${Math.round((ms % 60000) / 1000)}s`;
}

function formatEstimate(seconds: number): string {
  if (seconds < 60) return `~${seconds}s remaining`;
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `~${minutes}m ${secs}s remaining`;
}

// ============================================
// Component
// ============================================

function OperationProgressModal({
  open,
  title,
  description,
  steps,
  overallProgress,
  estimatedSecondsRemaining,
  isComplete,
  isCancelled = false,
  canCancel = false,
  onCancel,
  onRetryStep,
  onClose,
  logEntries,
}: OperationProgressModalProps) {
  const completedCount = steps.filter((s) => s.status === 'completed').length;
  const errorCount = steps.filter((s) => s.status === 'error').length;
  const hasErrors = errorCount > 0;

  return (
    <Dialog open={open} onOpenChange={(isOpen) => { if (!isOpen && isComplete) onClose(); }}>
      <DialogContent
        className="sm:max-w-[540px]"
        onInteractOutside={(e) => { if (!isComplete) e.preventDefault(); }}
        onEscapeKeyDown={(e) => { if (!isComplete) e.preventDefault(); }}
      >
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {!isComplete && <Loader2 className="h-5 w-5 animate-spin text-primary-400" />}
            {isComplete && !hasErrors && <CheckCircle2 className="h-5 w-5 text-success-400" />}
            {isComplete && hasErrors && <AlertTriangle className="h-5 w-5 text-warning-400" />}
            {title}
          </DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>

        {/* Overall Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">
              {isCancelled
                ? 'Cancelled'
                : isComplete
                  ? hasErrors
                    ? `Completed with ${errorCount} error${errorCount > 1 ? 's' : ''}`
                    : 'Completed successfully'
                  : `Step ${completedCount + 1} of ${steps.length}`}
            </span>
            <div className="flex items-center gap-3">
              {estimatedSecondsRemaining != null && !isComplete && (
                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  {formatEstimate(estimatedSecondsRemaining)}
                </span>
              )}
              <span className="font-medium tabular-nums text-sm">
                {Math.round(overallProgress)}%
              </span>
            </div>
          </div>
          <Progress value={overallProgress} className="h-2.5" />
        </div>

        <Separator />

        {/* Step List */}
        <ScrollArea className="max-h-[320px] pr-4">
          <div className="space-y-1">
            {steps.map((step) => (
              <div
                key={step.id}
                className={cn(
                  'flex items-start gap-3 rounded-lg px-3 py-2.5 transition-colors',
                  step.status === 'active' && 'bg-accent/50',
                  step.status === 'error' && 'bg-error-950/30'
                )}
              >
                <StepStatusIcon status={step.status} />

                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className={cn(
                      'text-sm font-medium',
                      step.status === 'pending' && 'text-muted-foreground',
                      step.status === 'skipped' && 'text-muted-foreground line-through'
                    )}>
                      {step.label}
                    </span>
                    {step.durationMs != null && (
                      <span className="text-xs text-muted-foreground tabular-nums shrink-0">
                        {formatDuration(step.durationMs)}
                      </span>
                    )}
                  </div>

                  {step.status === 'active' && (
                    <>
                      {step.description && (
                        <p className="text-xs text-muted-foreground">{step.description}</p>
                      )}
                      {step.statusMessage && (
                        <p className="text-xs text-primary-400 font-medium">{step.statusMessage}</p>
                      )}
                      {step.progress != null && (
                        <Progress value={step.progress} className="h-1.5 mt-1" />
                      )}
                    </>
                  )}

                  {step.status === 'error' && (
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-xs text-error-400">{step.errorMessage}</p>
                      {step.retryable && onRetryStep && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-6 px-2 text-xs shrink-0"
                          onClick={() => onRetryStep(step.id)}
                        >
                          Retry
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        {/* Expandable Log */}
        {logEntries && logEntries.length > 0 && (
          <details className="text-xs">
            <summary className="cursor-pointer text-muted-foreground hover:text-foreground transition-colors">
              Show detailed log ({logEntries.length} entries)
            </summary>
            <ScrollArea className="mt-2 max-h-[120px] rounded-md border bg-surface-800/30 p-2">
              <pre className="font-mono text-[10px] leading-relaxed text-muted-foreground whitespace-pre-wrap">
                {logEntries.join('\n')}
              </pre>
            </ScrollArea>
          </details>
        )}

        <DialogFooter className="gap-2 sm:gap-0">
          {!isComplete && canCancel && (
            <Button variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          )}
          {isComplete && (
            <Button onClick={onClose}>
              {hasErrors ? 'Close & Review Errors' : 'Done'}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export { OperationProgressModal };
export type { OperationProgressModalProps, OperationStep, StepStatus };
