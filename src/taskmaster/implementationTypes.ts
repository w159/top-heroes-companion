/**
 * Auto-Implementation Type Definitions
 * Core types for the TaskMaster implementation system
 */

import { Task } from './types';

export interface ImplementationContext {
  task: Task;
  codebasePatterns: CodebasePatterns;
  conventions: CodingConventions;
  testCoverage: TestCoverageInfo;
  dependencies: DependencyInfo;
  risks: Risk[];
}

export interface CodebasePatterns {
  componentStructure: string[];
  namingConventions: Record<string, string>;
  commonImports: string[];
  testPatterns: string[];
  errorHandlingPatterns: string[];
}

export interface CodingConventions {
  style: 'typescript' | 'javascript';
  framework: string[];
  testFramework: string;
  linter: string;
  formatter: string;
}

export interface TestCoverageInfo {
  currentCoverage: number; // 0-100
  targetCoverage: number;
  uncoveredFiles: string[];
  criticalPaths: string[];
}

export interface DependencyInfo {
  installed: string[];
  required: string[];
  conflicts: string[];
  versions: Record<string, string>;
}

export interface Risk {
  type: 'breaking_change' | 'performance' | 'security' | 'complexity';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  mitigation: string;
}

export interface ImplementationStrategy {
  type: 'feature' | 'bugfix' | 'refactor' | 'test' | 'documentation';
  steps: ImplementationStep[];
  estimatedTime: number; // minutes
  requiredFiles: string[];
  testFiles: string[];
  validationChecks: ValidationCheck[];
}

export interface ImplementationStep {
  number: number;
  title: string;
  description: string;
  actions: Action[];
  validation: string[];
  estimatedTime: number;
  dependencies: number[]; // Step numbers
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
}

export interface Action {
  type: 'create' | 'modify' | 'delete' | 'test' | 'lint' | 'format';
  target: string; // File path or command
  content?: string;
  reason: string;
}

export interface ValidationCheck {
  name: string;
  type: 'lint' | 'test' | 'type' | 'build' | 'custom';
  command: string;
  required: boolean;
  timeout: number; // seconds
}

export interface ImplementationResult {
  success: boolean;
  completedSteps: number;
  totalSteps: number;
  filesChanged: string[];
  testsAdded: number;
  testsPassed: number;
  errors: ImplementationError[];
  warnings: string[];
  duration: number; // seconds
  qualityMetrics: QualityMetrics;
}

export interface ImplementationError {
  step: number;
  type: string;
  message: string;
  stackTrace?: string;
  recovery?: RecoveryStrategy;
}

export interface RecoveryStrategy {
  strategy: 'retry' | 'skip' | 'manual' | 'rollback';
  description: string;
  actions: string[];
}

export interface QualityMetrics {
  lintScore: number; // 0-100
  testCoverage: number; // 0-100
  typeErrors: number;
  complexity: number;
  performanceScore: number;
}
