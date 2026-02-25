/**
 * TaskMaster Auto-Implementation System
 * Orchestration layer: ties together analysis, strategy, and execution
 */

import { Task } from './types';
import { ImplementationResult } from './implementationTypes';
import { PreImplementationAnalyzer } from './codeAnalysis';
import { ImplementationStrategySelector } from './codeGeneration';
import { ProgressiveImplementationExecutor } from './qualityChecks';

// Re-export all types and classes for backward compatibility
export type {
  ImplementationContext,
  CodebasePatterns,
  CodingConventions,
  TestCoverageInfo,
  DependencyInfo,
  Risk,
  ImplementationStrategy,
  ImplementationStep,
  Action,
  ValidationCheck,
  ImplementationResult,
  ImplementationError,
  RecoveryStrategy,
  QualityMetrics,
} from './implementationTypes';

export { PreImplementationAnalyzer } from './codeAnalysis';
export { ImplementationStrategySelector } from './codeGeneration';
export { ProgressiveImplementationExecutor } from './qualityChecks';

// ============================================================================
// MAIN AUTO-IMPLEMENTATION FUNCTION
// ============================================================================

export async function autoImplementTask(task: Task): Promise<ImplementationResult> {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`\u{1F916} AUTO-IMPLEMENTATION: ${task.title}`);
  console.log(`${'='.repeat(60)}\n`);

  // Phase 1: Pre-implementation analysis
  const analyzer = new PreImplementationAnalyzer();
  const context = await analyzer.analyzeTask(task);

  // Show risks
  if (context.risks.length > 0) {
    console.log(`\u26A0\uFE0F  Identified ${context.risks.length} risk(s):`);
    context.risks.forEach(risk => {
      console.log(`   - [${risk.severity}] ${risk.description}`);
      console.log(`     Mitigation: ${risk.mitigation}`);
    });
    console.log();
  }

  // Phase 2: Strategy selection
  const selector = new ImplementationStrategySelector();
  const strategy = selector.selectStrategy(context);

  // Phase 3: Progressive execution
  const executor = new ProgressiveImplementationExecutor();
  const result = await executor.execute(strategy, context);

  // Phase 4: Post-implementation
  if (result.success) {
    console.log(`\n\u2705 Implementation complete!`);
    console.log(`   Ready for: Review and merge`);
  } else {
    console.log(`\n\u274C Implementation incomplete`);
    console.log(`   Errors: ${result.errors.length}`);
    console.log(`   Next steps: Review errors and apply recovery strategies`);
  }

  return result;
}
