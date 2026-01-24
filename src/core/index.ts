/**
 * Core Module Exports
 * Central export point for all core services and types
 */

// Service Container (primary import point)
export { ServiceContainer, services } from './ServiceContainer';

// Domain Interfaces
export type {
  IDataRepository,
  IUserDataRepository,
  IStorageService,
  IContentUpdateService,
  IRAGService,
  IPurchaseService,
  IHeroOptimizationService,
  IEventOptimizationService,
  ContentVersion,
  ContentMetadata,
  UpdateRecord,
  DocumentChunk,
  SearchResult,
  RAGQuery,
  RAGResponse,
  Purchase,
  SpendAnalytics,
  ROIAnalysis,
} from './domain/interfaces';

// Application Services (for direct instantiation in tests)
export { ContentUpdateService } from './application/ContentUpdateService';
export { RAGService } from './application/RAGService';
export { PurchaseService } from './application/PurchaseService';

// Infrastructure (for testing/mocking)
export { LocalStorageAdapter } from './infrastructure/LocalStorageAdapter';
export { DataRepository } from './infrastructure/DataRepository';
export { RAGContentLoader } from './infrastructure/RAGContentLoader';
