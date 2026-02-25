/**
 * Implementation Strategy Selection and Code Generation
 * Determines optimal implementation approach and generates templates
 */

import { Task, TaskType } from './types';
import {
  ImplementationContext,
  ImplementationStrategy,
} from './implementationTypes';

export class ImplementationStrategySelector {
  /**
   * Select optimal implementation strategy based on task type
   */
  selectStrategy(context: ImplementationContext): ImplementationStrategy {
    const { task } = context;

    // Determine task type
    const taskType = this.determineTaskType(task);

    // Generate strategy
    switch (taskType) {
      case 'feature':
        return this.createFeatureStrategy(context);
      case 'bugfix':
        return this.createBugfixStrategy(context);
      case 'refactor':
        return this.createRefactorStrategy(context);
      case 'test':
        return this.createTestStrategy(context);
      case 'documentation':
        return this.createDocumentationStrategy(context);
      default:
        return this.createGenericStrategy(context);
    }
  }

  private determineTaskType(task: Task): TaskType {
    const title = task.title.toLowerCase();
    const description = (task.description || '').toLowerCase();

    if (title.includes('test') || description.includes('test')) {
      return 'test';
    }
    if (title.includes('fix') || title.includes('bug')) {
      return 'bugfix';
    }
    if (title.includes('refactor') || title.includes('clean')) {
      return 'refactor';
    }
    if (title.includes('doc') || title.includes('documentation')) {
      return 'documentation';
    }

    return 'feature';
  }

  private createFeatureStrategy(_context: ImplementationContext): ImplementationStrategy {
    const designAction = { type: 'create' as const, target: 'docs/feature-design.md', reason: 'Document architecture decisions' };
    const componentAction = { type: 'create' as const, target: 'src/components/NewFeature.tsx', content: this.generateComponentTemplate('NewFeature'), reason: 'Create main component' };
    const testAction = { type: 'create' as const, target: 'src/components/NewFeature.test.tsx', content: this.generateTestTemplate('NewFeature'), reason: 'Ensure quality and prevent regressions' };

    return {
      type: 'feature',
      steps: [
        { number: 1, title: 'Research and design', description: 'Research existing patterns and design component architecture', actions: [designAction], validation: ['Design reviewed'], estimatedTime: 15, dependencies: [], status: 'pending' },
        { number: 2, title: 'Create component structure', description: 'Set up files and basic structure', actions: [componentAction], validation: ['Files created', 'No syntax errors'], estimatedTime: 10, dependencies: [1], status: 'pending' },
        { number: 3, title: 'Implement core logic', description: 'Implement main functionality', actions: [], validation: ['Logic implemented', 'Type errors resolved'], estimatedTime: 30, dependencies: [2], status: 'pending' },
        { number: 4, title: 'Add error handling', description: 'Add comprehensive error handling and validation', actions: [], validation: ['Error cases handled', 'Edge cases covered'], estimatedTime: 15, dependencies: [3], status: 'pending' },
        { number: 5, title: 'Write tests', description: 'Create comprehensive test suite', actions: [testAction], validation: ['Tests written', 'Coverage > 80%', 'All tests pass'], estimatedTime: 20, dependencies: [4], status: 'pending' },
        { number: 6, title: 'Integration and documentation', description: 'Integrate with system and update documentation', actions: [], validation: ['Integrated successfully', 'Documentation updated'], estimatedTime: 10, dependencies: [5], status: 'pending' },
      ],
      estimatedTime: 100,
      requiredFiles: ['src/components/NewFeature.tsx', 'src/components/NewFeature.test.tsx'],
      testFiles: ['src/components/NewFeature.test.tsx'],
      validationChecks: [
        { name: 'TypeScript Check', type: 'type', command: 'npm run type-check', required: true, timeout: 30 },
        { name: 'Linting', type: 'lint', command: 'npm run lint', required: true, timeout: 20 },
        { name: 'Tests', type: 'test', command: 'npm test', required: true, timeout: 60 },
        { name: 'Build', type: 'build', command: 'npm run build', required: true, timeout: 120 },
      ],
    };
  }

  private createBugfixStrategy(_context: ImplementationContext): ImplementationStrategy {
    return {
      type: 'bugfix',
      steps: [
        { number: 1, title: 'Reproduce issue', description: 'Create failing test that reproduces the bug', actions: [], validation: ['Test reproduces bug'], estimatedTime: 10, dependencies: [], status: 'pending' },
        { number: 2, title: 'Identify root cause', description: 'Debug and identify the source of the issue', actions: [], validation: ['Root cause identified'], estimatedTime: 15, dependencies: [1], status: 'pending' },
        { number: 3, title: 'Implement fix', description: 'Apply minimal fix to resolve issue', actions: [], validation: ['Test now passes', 'No regressions'], estimatedTime: 15, dependencies: [2], status: 'pending' },
        { number: 4, title: 'Add regression tests', description: 'Ensure the bug cannot reoccur', actions: [], validation: ['Regression tests added'], estimatedTime: 10, dependencies: [3], status: 'pending' },
        { number: 5, title: 'Verify side effects', description: 'Check for unintended consequences', actions: [], validation: ['All tests pass', 'No new issues'], estimatedTime: 5, dependencies: [4], status: 'pending' },
      ],
      estimatedTime: 55,
      requiredFiles: [],
      testFiles: [],
      validationChecks: [
        { name: 'All Tests', type: 'test', command: 'npm test', required: true, timeout: 60 },
      ],
    };
  }

  private createRefactorStrategy(_context: ImplementationContext): ImplementationStrategy {
    return {
      type: 'refactor',
      steps: [
        { number: 1, title: 'Analyze current structure', description: 'Understand existing code and dependencies', actions: [], validation: ['Structure documented'], estimatedTime: 15, dependencies: [], status: 'pending' },
        { number: 2, title: 'Plan incremental changes', description: 'Design refactoring approach', actions: [], validation: ['Plan approved'], estimatedTime: 10, dependencies: [1], status: 'pending' },
        { number: 3, title: 'Ensure test coverage', description: 'Add tests for current behavior', actions: [], validation: ['Coverage adequate'], estimatedTime: 20, dependencies: [2], status: 'pending' },
        { number: 4, title: 'Refactor incrementally', description: 'Apply changes step by step', actions: [], validation: ['Tests still pass', 'Behavior unchanged'], estimatedTime: 40, dependencies: [3], status: 'pending' },
        { number: 5, title: 'Verify behavior unchanged', description: 'Comprehensive testing', actions: [], validation: ['All tests pass', 'Performance maintained'], estimatedTime: 15, dependencies: [4], status: 'pending' },
      ],
      estimatedTime: 100,
      requiredFiles: [],
      testFiles: [],
      validationChecks: [
        { name: 'Tests', type: 'test', command: 'npm test', required: true, timeout: 60 },
        { name: 'Type Check', type: 'type', command: 'npm run type-check', required: true, timeout: 30 },
      ],
    };
  }

  private createTestStrategy(_context: ImplementationContext): ImplementationStrategy {
    return {
      type: 'test',
      steps: [
        { number: 1, title: 'Identify test gaps', description: 'Analyze coverage and find untested paths', actions: [], validation: ['Gaps identified'], estimatedTime: 10, dependencies: [], status: 'pending' },
        { number: 2, title: 'Write unit tests', description: 'Add comprehensive unit tests', actions: [], validation: ['Unit tests added'], estimatedTime: 30, dependencies: [1], status: 'pending' },
        { number: 3, title: 'Add integration tests', description: 'Test component interactions', actions: [], validation: ['Integration tests added'], estimatedTime: 20, dependencies: [2], status: 'pending' },
        { number: 4, title: 'Include edge cases', description: 'Test boundary conditions', actions: [], validation: ['Edge cases covered'], estimatedTime: 15, dependencies: [3], status: 'pending' },
      ],
      estimatedTime: 75,
      requiredFiles: [],
      testFiles: [],
      validationChecks: [
        { name: 'Tests Pass', type: 'test', command: 'npm test', required: true, timeout: 60 },
        { name: 'Coverage Check', type: 'custom', command: 'npm run test:coverage', required: true, timeout: 90 },
      ],
    };
  }

  private createDocumentationStrategy(_context: ImplementationContext): ImplementationStrategy {
    return {
      type: 'documentation',
      steps: [
        { number: 1, title: 'Review code', description: 'Understand what needs documentation', actions: [], validation: ['Code reviewed'], estimatedTime: 10, dependencies: [], status: 'pending' },
        { number: 2, title: 'Write documentation', description: 'Create clear, comprehensive docs', actions: [], validation: ['Documentation complete'], estimatedTime: 30, dependencies: [1], status: 'pending' },
        { number: 3, title: 'Add examples', description: 'Include code examples and use cases', actions: [], validation: ['Examples added'], estimatedTime: 15, dependencies: [2], status: 'pending' },
        { number: 4, title: 'Review and polish', description: 'Ensure clarity and correctness', actions: [], validation: ['Documentation reviewed'], estimatedTime: 10, dependencies: [3], status: 'pending' },
      ],
      estimatedTime: 65,
      requiredFiles: [],
      testFiles: [],
      validationChecks: [],
    };
  }

  private createGenericStrategy(_context: ImplementationContext): ImplementationStrategy {
    return {
      type: 'feature',
      steps: [
        { number: 1, title: 'Analyze requirements', description: 'Understand what needs to be done', actions: [], validation: ['Requirements clear'], estimatedTime: 10, dependencies: [], status: 'pending' },
        { number: 2, title: 'Implement changes', description: 'Make necessary modifications', actions: [], validation: ['Changes implemented'], estimatedTime: 30, dependencies: [1], status: 'pending' },
        { number: 3, title: 'Test changes', description: 'Verify functionality', actions: [], validation: ['Tests pass'], estimatedTime: 15, dependencies: [2], status: 'pending' },
      ],
      estimatedTime: 55,
      requiredFiles: [],
      testFiles: [],
      validationChecks: [],
    };
  }

  generateComponentTemplate(name: string): string {
    const componentName = this.toPascalCase(name);
    return `import React from 'react';

export interface ${componentName}Props {
  // Add props here
}

export const ${componentName}: React.FC<${componentName}Props> = (props) => {
  return (
    <div className="${this.toKebabCase(name)}">
      <h2>${name}</h2>
      {/* Add component content */}
    </div>
  );
};

export default ${componentName};
`;
  }

  generateTestTemplate(name: string): string {
    const componentName = this.toPascalCase(name);
    return `import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import ${componentName} from './${componentName}';

describe('${componentName}', () => {
  it('should render successfully', () => {
    render(<${componentName} />);
    expect(screen.getByText('${name}')).toBeInTheDocument();
  });

  it('should handle props correctly', () => {
    // Add test cases
  });

  it('should handle user interactions', () => {
    // Add interaction tests
  });
});
`;
  }

  private toPascalCase(str: string): string {
    return str
      .split(/[\s_-]+/)
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join('');
  }

  private toKebabCase(str: string): string {
    return str
      .split(/[\s_]+/)
      .join('-')
      .toLowerCase();
  }
}
