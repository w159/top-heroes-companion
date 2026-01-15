/**
 * TaskMaster Type Definitions
 * Core types for task management and auto-implementation
 */

export type TaskStatus = 
  | 'backlog'
  | 'ready'
  | 'in_progress'
  | 'review'
  | 'testing'
  | 'blocked'
  | 'done'
  | 'cancelled';

export type TaskPriority = 'low' | 'medium' | 'high' | 'critical';

export type TaskType = 
  | 'feature'
  | 'bugfix'
  | 'refactor'
  | 'test'
  | 'documentation'
  | 'chore';

export interface Task {
  id: string;
  title: string;
  description?: string;
  type: TaskType;
  status: TaskStatus;
  priority: TaskPriority;
  assignee?: string;
  reviewer?: string;
  tester?: string;
  
  // Relationships
  dependencies: string[]; // Task IDs this task depends on
  blocks: string[]; // Task IDs blocked by this task
  relatedTasks: string[];
  
  // Metadata
  created: Date;
  updated: Date;
  started?: Date;
  completed?: Date;
  
  // Estimation
  estimatedTime?: number; // minutes
  actualTime?: number; // minutes
  
  // Files
  files: string[];
  
  // Labels/Tags
  labels: string[];
  
  // Success criteria
  acceptanceCriteria?: string[];
  definition of Done?: string[];
  
  // Notes
  notes?: string;
}

export interface TaskList {
  id: string;
  name: string;
  description?: string;
  tasks: Task[];
  created: Date;
  updated: Date;
}

export interface TaskDependencyGraph {
  tasks: Map<string, Task>;
  adjacencyList: Map<string, string[]>;
  criticalPath: string[];
}
