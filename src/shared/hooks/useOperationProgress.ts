import { useState, useCallback, useMemo } from 'react';
import type { OperationStep, StepStatus } from '@/shared/ui/components/operation-progress-modal';

interface StepDefinition {
  id: string;
  label: string;
  description?: string;
}

function useOperationProgress(stepDefinitions: StepDefinition[]) {
  const [steps, setSteps] = useState<OperationStep[]>(
    stepDefinitions.map((def) => ({ ...def, status: 'pending' as StepStatus }))
  );
  const [isComplete, setIsComplete] = useState(false);
  const [isCancelled, setIsCancelled] = useState(false);

  const startStep = useCallback((stepId: string, statusMessage?: string) => {
    setSteps((prev) =>
      prev.map((s) =>
        s.id === stepId
          ? { ...s, status: 'active' as StepStatus, statusMessage, progress: 0 }
          : s
      )
    );
  }, []);

  const updateStepProgress = useCallback((stepId: string, progress: number, statusMessage?: string) => {
    setSteps((prev) =>
      prev.map((s) =>
        s.id === stepId
          ? { ...s, progress, ...(statusMessage && { statusMessage }) }
          : s
      )
    );
  }, []);

  const completeStep = useCallback((stepId: string, durationMs?: number) => {
    setSteps((prev) =>
      prev.map((s) =>
        s.id === stepId
          ? { ...s, status: 'completed' as StepStatus, progress: 100, durationMs }
          : s
      )
    );
  }, []);

  const failStep = useCallback((stepId: string, errorMessage: string, retryable = true) => {
    setSteps((prev) =>
      prev.map((s) =>
        s.id === stepId
          ? { ...s, status: 'error' as StepStatus, errorMessage, retryable }
          : s
      )
    );
  }, []);

  const skipStep = useCallback((stepId: string) => {
    setSteps((prev) =>
      prev.map((s) =>
        s.id === stepId
          ? { ...s, status: 'skipped' as StepStatus }
          : s
      )
    );
  }, []);

  const reset = useCallback(() => {
    setSteps(stepDefinitions.map((def) => ({ ...def, status: 'pending' as StepStatus })));
    setIsComplete(false);
    setIsCancelled(false);
  }, [stepDefinitions]);

  const overallProgress = useMemo(() => {
    const total = steps.length;
    if (total === 0) return 0;
    const completed = steps.filter((s) => s.status === 'completed' || s.status === 'skipped').length;
    const activeStep = steps.find((s) => s.status === 'active');
    const activeContribution = activeStep?.progress ? activeStep.progress / 100 : 0;
    return ((completed + activeContribution) / total) * 100;
  }, [steps]);

  return {
    steps,
    overallProgress,
    isComplete,
    isCancelled,
    startStep,
    updateStepProgress,
    completeStep,
    failStep,
    skipStep,
    reset,
    markComplete: () => setIsComplete(true),
    markCancelled: () => {
      setIsCancelled(true);
      setIsComplete(true);
    },
  };
}

export { useOperationProgress };
