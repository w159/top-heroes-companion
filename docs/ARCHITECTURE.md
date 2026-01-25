# Architecture Documentation - Top Heroes Companion v2.0

## Overview

Top Heroes Companion has been refactored using **Clean Architecture** principles to provide better separation of concerns, testability, and maintainability. The application now features advanced agentic capabilities, RAG-powered chat assistance, and comprehensive purchase tracking analytics.

## Architecture Layers

```
┌─────────────────────────────────────────────────┐
│         Presentation Layer (React UI)           │
│     Components, Pages, State Management         │
└─────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────┐
│       Application Layer (Use Cases)             │
│  ContentUpdateService, RAGService,              │
│  PurchaseService, Optimization Engines          │
└─────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────┐
│           Domain Layer (Entities)               │
│    Interfaces, Business Logic, Types            │
└─────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────┐
│    Infrastructure Layer (External Concerns)     │
│  LocalStorageAdapter, DataRepository,           │
│  RAGContentLoader                               │
└─────────────────────────────────────────────────┘
```

## Directory Structure

```
/src
  /core
    /domain
      interfaces.ts              # Pure business logic interfaces
    /application
      ContentUpdateService.ts    # Content versioning & updates
      RAGService.ts              # Semantic search & response generation
      PurchaseService.ts         # Purchase tracking & ROI analytics
    /infrastructure
      LocalStorageAdapter.ts     # Storage implementation
      DataRepository.ts          # Data access layer
      RAGContentLoader.ts        # RAG content indexing
    ServiceContainer.ts          # Dependency injection container

  /engine
    calculators.ts               # Strategic calculations
    heroUpgradeOptimizer.ts     # Hero upgrade paths
    eventStrategyOptimizer.ts   # Event optimization

  /taskmaster
    autoImplement.ts            # Agentic automation system

/components
  ChatAssistantEnhanced.tsx     # RAG-powered chat interface
  PremiumLayout.tsx             # Main layout wrapper
  [other UI components]

/pages
  SettingsEnhanced.tsx          # Settings with purchase tracking
  Dashboard.tsx                 # Main dashboard
  Heroes.tsx                    # Hero library
  [other page components]

/utils
  dataManager.ts               # [DEPRECATED - Use ServiceContainer]
  storage.ts                   # [DEPRECATED - Use LocalStorageAdapter]
  apiCache.ts                  # API caching layer
  performance.ts               # Performance monitoring
```

## Core Services

### 1. ServiceContainer

**Purpose**: Central dependency injection container that initializes all services with proper dependencies.

**Usage**:
```typescript
import { services } from './src/core/ServiceContainer';

// Access any service
const heroes = await services.dataRepository.getHeroes();
const analytics = await services.purchase.getAnalytics();
```

**Services Provided**:
- `storage`: IStorageService
- `dataRepository`: IDataRepository & IUserDataRepository
- `contentUpdate`: IContentUpdateService
- `rag`: IRAGService
- `purchase`: IPurchaseService

### 2. RAGService

**Purpose**: Provides semantic search and response generation using TF-IDF indexing.

**Features**:
- Lightweight browser-based implementation (no heavy vector embeddings)
- Indexes content from `/rag-content` directory
- TF-IDF scoring for relevance ranking
- Context-aware response synthesis
- Source attribution

**Usage**:
```typescript
// Search knowledge base
const results = await services.rag.search({
  query: "best Nature team composition",
  filters: { category: ['team_composition', 'heroes'] }
});

// Generate response with sources
const response = await services.rag.generateResponse(
  { query: "best Nature team" },
  results
);
```

**How it Works**:
1. Content is tokenized and indexed using TF-IDF
2. Queries are scored against document chunks
3. Top results are retrieved and ranked
4. Responses are synthesized from high-scoring chunks
5. Sources are cited for transparency

### 3. ContentUpdateService

**Purpose**: Manages automatic content updates with versioning and freshness tracking.

**Features**:
- Version tracking for all game content categories
- Update history with changelog
- Staleness detection (7-day threshold)
- Batch update support

**Usage**:
```typescript
// Check for updates (automatic every 24h)
const metadata = await services.contentUpdate.checkForUpdates();

// Apply manual update
await services.contentUpdate.applyUpdate('heroes', newHeroData);

// Check content freshness
const freshness = services.contentUpdate.getContentFreshness();
if (freshness.heroes.isStale) {
  // Notify user
}
```

### 4. PurchaseService

**Purpose**: Tracks in-game purchases and calculates ROI analytics.

**Features**:
- Purchase history tracking
- Spending analytics (total, average, trends)
- ROI calculation vs F2P
- Spend efficiency metrics
- Smart recommendations

**Usage**:
```typescript
// Record a purchase
await services.purchase.recordPurchase({
  type: 'battle_pass',
  name: 'Season 5 Battle Pass',
  costUSD: 9.99,
  rewards: { gems: 1000, heroes: ['pyromancer'] }
});

// Get analytics
const analytics = await services.purchase.getAnalytics();
console.log(`Total spent: $${analytics.totalSpent}`);

// Calculate ROI
const roi = await services.purchase.calculateROI(2000000); // Target 2M power
console.log(`Days saved vs F2P: ${roi.timeToGoalF2P - roi.timeToGoalWithSpend}`);
```

## Data Flow

### Reading Game Data
```
Component
  → ServiceContainer.dataRepository
    → DataRepository.getHeroes()
      → LocalStorageAdapter.get()
        → localStorage (with 5min cache)
```

### RAG Chat Flow
```
User Query
  → ChatAssistantEnhanced
    → RAGService.search()
      → TF-IDF scoring
      → Top results returned
    → RAGService.generateResponse()
      → Context synthesis
      → Response with sources
```

### Purchase Tracking Flow
```
User Input
  → SettingsEnhanced
    → PurchaseService.recordPurchase()
      → LocalStorageAdapter.set()
    → PurchaseService.getAnalytics()
      → Cached aggregation (1h TTL)
      → Spending trends, ROI
```

## Key Design Patterns

### 1. Dependency Injection
- All services receive dependencies via constructor
- ServiceContainer manages initialization
- Easy to mock for testing

### 2. Repository Pattern
- Abstracts data access behind interfaces
- Swappable storage implementations
- Centralized data management

### 3. Singleton Pattern
- ServiceContainer is singleton
- LocalStorageAdapter instance shared
- Ensures consistent state

### 4. Strategy Pattern
- RAG response synthesis varies by query type
- ROI calculation adapts to spend profile
- Extensible without modification

## Performance Optimizations

### Bundle Size
- Lazy loading for all routes
- Code splitting by page
- TF-IDF (lightweight) instead of neural embeddings
- Current: **63.62 KB gzipped**

### Caching Strategy
- **In-memory cache**: 5 min TTL (LocalStorageAdapter)
- **localStorage cache**: Persistent with version check
- **Analytics cache**: 1 hour TTL (PurchaseService)
- **RAG index cache**: Persistent (reindex on demand)

### Data Loading
- Parallel loading via Promise.all() where possible
- Lazy RAG initialization (on first chat open)
- Preload critical data on app start

## Security & Privacy

- **Local-first**: No data leaves the device
- **No backend**: All processing happens in browser
- **Export/Import**: User controls their data
- **Versioning**: Prevents data corruption from old versions

## Testing Strategy

All services are designed for easy unit testing:

```typescript
// Example test
const mockStorage = {
  get: jest.fn(),
  set: jest.fn(),
  // ...
};

const purchaseService = new PurchaseService(mockStorage);
await purchaseService.recordPurchase({...});

expect(mockStorage.set).toHaveBeenCalled();
```

## Migration from Old Architecture

### Before (v1.x)
```typescript
import { HEROES } from './constants';
const heroes = HEROES; // Static data
```

### After (v2.0)
```typescript
import { services } from './src/core/ServiceContainer';
const heroes = await services.dataRepository.getHeroes(); // Dynamic, versioned
```

### Backward Compatibility
- Old localStorage keys are migrated automatically
- Version checks prevent data loss
- Export format supports both versions

## Future Enhancements

1. **Service Worker**: Offline support for RAG
2. **Web Workers**: Move TF-IDF indexing off main thread
3. **Remote Updates**: Fetch game data from API
4. **Advanced Analytics**: Power progression prediction ML
5. **Collaborative Filtering**: Recommend teams based on user success

## Troubleshooting

### "RAG index not initialized"
- Wait for chat to open (index loads lazily)
- Check browser console for errors
- Clear localStorage and refresh

### "Update check failed"
- Content update requires network (future feature)
- Currently uses local versioning only

### "Purchase analytics not showing"
- Record at least one purchase first
- Check localStorage for `app_purchases_v2` key

## Contributing

When adding new features:

1. Define interfaces in `src/core/domain/interfaces.ts`
2. Implement in `src/core/application/` or `src/core/infrastructure/`
3. Register in `ServiceContainer.ts`
4. Use dependency injection (no direct imports of implementations)
5. Follow clean architecture: UI → Application → Domain → Infrastructure

---

**Version**: 2.0.0
**Last Updated**: 2026-01-24
**Architecture**: Clean Architecture + SOLID Principles
