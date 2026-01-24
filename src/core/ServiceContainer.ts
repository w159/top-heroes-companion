/**
 * Service Container - Dependency Injection
 * Initializes and provides access to all application services
 */

import { LocalStorageAdapter } from './infrastructure/LocalStorageAdapter';
import { DataRepository } from './infrastructure/DataRepository';
import { ContentUpdateService } from './application/ContentUpdateService';
import { RAGService } from './application/RAGService';
import { PurchaseService } from './application/PurchaseService';

import {
  IStorageService,
  IDataRepository,
  IUserDataRepository,
  IContentUpdateService,
  IRAGService,
  IPurchaseService,
} from './domain/interfaces';

export class ServiceContainer {
  private static instance: ServiceContainer;

  // Infrastructure
  public readonly storage: IStorageService;
  public readonly dataRepository: IDataRepository & IUserDataRepository;

  // Application Services
  public readonly contentUpdate: IContentUpdateService;
  public readonly rag: IRAGService;
  public readonly purchase: IPurchaseService;

  private constructor() {
    // Initialize infrastructure layer
    this.storage = new LocalStorageAdapter();
    this.dataRepository = new DataRepository(this.storage);

    // Initialize application services
    this.contentUpdate = new ContentUpdateService(this.dataRepository, this.storage);
    this.rag = new RAGService(this.storage);
    this.purchase = new PurchaseService(this.storage);

    // Bootstrap RAG service
    this.initializeRAG();
  }

  public static getInstance(): ServiceContainer {
    if (!ServiceContainer.instance) {
      ServiceContainer.instance = new ServiceContainer();
    }
    return ServiceContainer.instance;
  }

  private async initializeRAG() {
    // This will be populated with actual RAG content from /rag-content
    // For now, we'll create it when the RAGContentLoader is implemented
    console.log('RAG Service initialized');
  }

  // Helper method to reset all services (useful for testing)
  public reset(): void {
    this.storage.clear();
  }
}

// Export singleton instance
export const services = ServiceContainer.getInstance();
