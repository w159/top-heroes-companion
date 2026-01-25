# Project Structure

## Overview

This project follows a **feature-based architecture** with clean separation of concerns.

```
/src
├── /app                    # Application entry point
├── /features              # Feature modules (heroes, events, gear, etc.)
├── /core                  # Business logic (Clean Architecture)
├── /shared                # Shared/reusable code
├── /assets                # Static assets
├── /data                  # JSON data files
└── /styles                # Global styles
```

## Directory Details

### `/src/app`
Application bootstrap and routing.

- `main.tsx` - ReactDOM entry point
- `App.tsx` - Main component with routes and layout

### `/src/features`
Feature-based organization. Each feature is self-contained.

```
/heroes
  /components       # HeroCard, HeroGrid, SkillCard, etc.
  /pages           # Dashboard, Heroes, HeroDetail, Roster
  /hooks           # Custom hooks (useHeroFilter, etc.)
  /types           # Feature-specific types

/events
  /pages           # Events, GiftCodes

/team
  /pages           # TeamBuilder

/gear
  /pages           # Gear, Pets, Relics

/guides
  /pages           # Guides

/settings
  /pages           # Settings
```

### `/src/core`
Business logic following Clean Architecture principles.

```
/domain
  interfaces.ts    # Pure interfaces (IDataRepository, IRAGService, etc.)

/application
  RAGService.ts              # Semantic search service
  ContentUpdateService.ts    # Version tracking
  PurchaseService.ts         # Purchase analytics

/infrastructure
  LocalStorageAdapter.ts     # Browser storage
  DataRepository.ts          # Data access
  RAGContentLoader.ts        # RAG content indexing

ServiceContainer.ts          # Dependency injection
```

### `/src/shared`
Reusable components, hooks, and utilities used across features.

```
/components        # Reusable components
/layouts           # MainLayout
/ui                # UI primitives (LoadingSpinner, etc.)
/hooks             # Custom React hooks
/utils             # Utility functions, storage helpers
/types             # Shared TypeScript types
```

### `/src/data`
Game data JSON files.

- `heroes.json`
- `heroesEnhanced.json`
- `eventGuides.json`
- `gameGuides.json`

### `/src/styles`
Global CSS files.

- `main.css` - Main design system

## Import Patterns

### Using Path Aliases

```typescript
// Core services
import { services } from '@core/ServiceContainer';
import type { IRAGService } from '@core/domain/interfaces';

// Feature components
import HeroCard from '@features/heroes/components/HeroCard';
import Dashboard from '@features/heroes/pages/Dashboard';

// Shared utilities
import { useLocalStorage } from '@shared/hooks/useLocalStorage';
import MainLayout from '@shared/layouts/MainLayout';
import { LoadingSpinner } from '@shared/ui/LoadingSpinner';
```

### Relative Imports
Within the same feature, use relative imports:

```typescript
// Inside /features/heroes/pages/Heroes.tsx
import HeroCard from '../components/HeroCard';
import { useHeroFilter } from '../hooks/useHeroFilter';
```

## File Naming Conventions

- **Components**: PascalCase (`HeroCard.tsx`)
- **Pages**: PascalCase (`Dashboard.tsx`)
- **Hooks**: camelCase with `use` prefix (`useHeroFilter.ts`)
- **Utils**: camelCase (`formatDate.ts`)
- **Types**: PascalCase (`HeroTypes.ts` or co-located in file)
- **Styles**: kebab-case (`main.css`)

## Adding New Features

1. Create feature folder: `/src/features/my-feature`
2. Add subfolders: `/components`, `/pages`, `/hooks`, `/types`
3. Create page components
4. Add routes in `/src/app/App.tsx`
5. Use shared components from `/src/shared`

Example:

```bash
mkdir -p src/features/clans/{components,pages,hooks}
touch src/features/clans/pages/Clans.tsx
```

Then in `App.tsx`:

```typescript
const Clans = lazy(() => import('@features/clans/pages/Clans'));

// In routes:
<Route path="/clans" element={<Clans />} />
```

## Best Practices

1. **Feature Independence**: Features should be self-contained
2. **Single Responsibility**: Each file has one clear purpose
3. **No Circular Dependencies**: Use dependency injection
4. **Shared Code**: Only put truly reusable code in `/shared`
5. **Type Safety**: Export types from feature folders
6. **Lazy Loading**: Use React.lazy() for pages

## Anti-Patterns to Avoid

❌ Don't create god components
❌ Don't share feature-specific code between features
❌ Don't put business logic in components
❌ Don't mix concerns (UI + data fetching in same component)
❌ Don't use default exports for utilities

✅ Do keep components focused
✅ Do use services for business logic
✅ Do separate concerns (container/presenter pattern)
✅ Do use named exports for utilities
✅ Do use path aliases for cleaner imports
