/**
 * Domain Layer - Core Interfaces
 * Pure business logic interfaces with no implementation details
 */

import { Hero, GameEvent, Pet, Relic, Skin, GiftCode, UserHero } from '../../../types';

// ============================================================================
// REPOSITORY INTERFACES
// ============================================================================

export interface IDataRepository {
  getHeroes(): Promise<Hero[]>;
  getEvents(): Promise<GameEvent[]>;
  getPets(): Promise<Pet[]>;
  getRelics(): Promise<Relic[]>;
  getSkins(): Promise<Skin[]>;
  getGiftCodes(): Promise<GiftCode[]>;

  updateHeroes(heroes: Hero[]): Promise<void>;
  updateEvents(events: GameEvent[]): Promise<void>;
  updatePets(pets: Pet[]): Promise<void>;
  updateRelics(relics: Relic[]): Promise<void>;
  updateSkins(skins: Skin[]): Promise<void>;
  updateGiftCodes(codes: GiftCode[]): Promise<void>;
}

export interface IUserDataRepository {
  getUserHeroes(): Promise<UserHero[]>;
  saveUserHero(hero: UserHero): Promise<void>;
  deleteUserHero(heroId: string): Promise<void>;

  exportData(): Promise<string>;
  importData(data: string): Promise<void>;
}

export interface IStorageService {
  get<T>(key: string, defaultValue: T): T;
  set<T>(key: string, value: T): void;
  remove(key: string): void;
  clear(): void;
  batchUpdate(updates: Record<string, any>): void;
}

// ============================================================================
// CONTENT UPDATE INTERFACES
// ============================================================================

export interface ContentVersion {
  version: string;
  lastUpdated: Date;
  changelog: string[];
}

export interface ContentMetadata {
  heroes: ContentVersion;
  events: ContentVersion;
  pets: ContentVersion;
  relics: ContentVersion;
  skins: ContentVersion;
  codes: ContentVersion;
}

export interface IContentUpdateService {
  checkForUpdates(): Promise<ContentMetadata>;
  getCurrentVersions(): ContentMetadata;
  applyUpdate(category: keyof ContentMetadata, data: any[]): Promise<void>;
  getUpdateHistory(): UpdateRecord[];
}

export interface UpdateRecord {
  category: string;
  version: string;
  timestamp: Date;
  itemsUpdated: number;
}

// ============================================================================
// RAG INTERFACES
// ============================================================================

export interface DocumentChunk {
  id: string;
  content: string;
  source: string;
  category: string;
  metadata: Record<string, any>;
}

export interface SearchResult {
  chunk: DocumentChunk;
  score: number;
  relevance: number;
}

export interface RAGQuery {
  query: string;
  context?: string[];
  filters?: {
    category?: string[];
    source?: string[];
  };
}

export interface RAGResponse {
  answer: string;
  sources: SearchResult[];
  confidence: number;
}

export interface IRAGService {
  indexContent(chunks: DocumentChunk[]): Promise<void>;
  search(query: RAGQuery): Promise<SearchResult[]>;
  generateResponse(query: RAGQuery, results: SearchResult[]): Promise<RAGResponse>;
  reindex(): Promise<void>;
}

// ============================================================================
// PURCHASE TRACKING INTERFACES
// ============================================================================

export interface Purchase {
  id: string;
  timestamp: Date;
  type: 'diamonds' | 'battle_pass' | 'special_offer' | 'subscription';
  name: string;
  costUSD: number;
  rewards: {
    gems?: number;
    heroes?: string[];
    resources?: Record<string, number>;
  };
}

export interface SpendAnalytics {
  totalSpent: number;
  purchaseCount: number;
  averagePurchase: number;
  spendingTrend: {
    date: Date;
    amount: number;
  }[];
  categoryBreakdown: Record<string, number>;
}

export interface ROIAnalysis {
  spendProfile: 'F2P' | 'LowSpender' | 'Whale';
  currentPower: number;
  projectedPowerF2P: number;
  projectedPowerWithSpend: number;
  timeToGoalF2P: number; // days
  timeToGoalWithSpend: number; // days
  efficiency: number; // power gained per $ spent
  recommendation: string;
}

export interface IPurchaseService {
  recordPurchase(purchase: Omit<Purchase, 'id' | 'timestamp'>): Promise<void>;
  getPurchaseHistory(): Promise<Purchase[]>;
  getAnalytics(): Promise<SpendAnalytics>;
  calculateROI(targetPower: number): Promise<ROIAnalysis>;
  clearHistory(): Promise<void>;
}

// ============================================================================
// OPTIMIZATION INTERFACES
// ============================================================================

export interface IHeroOptimizationService {
  getUpgradePath(heroId: string, targetLevel: number): Promise<any>;
  calculateOptimalTeam(faction: string): Promise<string[]>;
}

export interface IEventOptimizationService {
  optimizeEventStrategy(eventId: string, playerState: any): Promise<any>;
  scheduleEvents(events: GameEvent[]): Promise<any>;
}
