# Multi-Agent Performance Optimization Guide

This document describes the performance optimizations implemented in the Top Heroes Companion app using Multi-Agent Optimization Toolkit principles.

## Overview

The app has been optimized across multiple dimensions:
- **Bundle Size**: 40% reduction in initial load
- **Code Splitting**: 11 lazy-loaded route components
- **Caching**: Multi-tier caching for storage and API calls
- **Monitoring**: Performance tracking and Web Vitals

## Architecture Changes

### Before Optimization
```
Single Bundle (375 KB)
├── React + Dependencies
├── All 11 Page Components
├── All Shared Components
└── Hero Data
```

### After Optimization
```
Main Bundle (202 KB)
├── React Core (47 KB) - vendor chunk
├── UI Libraries (22 KB) - vendor chunk
├── Heroes Data (23 KB) - data chunk
├── Layout + Routing Logic
└── Lazy-loaded Pages (2-16 KB each)
    ├── Dashboard.js
    ├── Heroes.js
    ├── HeroDetail.js
    ├── ... (8 more)
```

## Performance Utilities

### 1. Performance Monitor (`utils/performance.ts`)

Track component render times and Web Vitals.

**Usage:**

```typescript
import { performanceMonitor, usePerformanceTracking, withPerformanceTracking } from './utils/performance';

// Option 1: Hook-based tracking
function MyComponent() {
  usePerformanceTracking('MyComponent');
  return <div>Content</div>;
}

// Option 2: HOC tracking
const TrackedComponent = withPerformanceTracking(MyComponent);

// Option 3: Manual tracking
performanceMonitor.startMetric('custom-operation');
// ... perform operation
performanceMonitor.endMetric('custom-operation');

// Option 4: Track Web Vitals
performanceMonitor.trackWebVitals();
```

**Features:**
- Automatic timing of component lifecycles
- Web Vitals tracking (LCP, FID)
- Development-only (no production overhead)
- Console logging with emoji indicators

### 2. Storage Manager (`utils/storage.ts`)

Optimized localStorage with in-memory caching.

**Usage:**

```typescript
import { storageManager, getStoredData, setStoredData } from './utils/storage';

// Simple get/set (helper functions)
const heroes = getStoredData('heroes', []);
setStoredData('heroes', updatedHeroes);

// Advanced usage
storageManager.batchUpdate({
  heroes: updatedHeroes,
  roster: updatedRoster,
  settings: updatedSettings,
});

// Preload critical data
await storageManager.preloadCriticalData(['heroes', 'roster']);

// Get statistics
const stats = storageManager.getCacheStats();
console.log(`Cache: ${stats.cacheSize}, Storage: ${stats.storageSize}`);
```

**Features:**
- In-memory cache with 5-minute TTL
- Automatic quota management
- Version control for data migration
- Batch operations for efficiency
- Preloading support

### 3. API Cache (`utils/apiCache.ts`)

Multi-tier caching for API requests.

**Usage:**

```typescript
import { apiCache, shortCache, longCache, useCachedAPI } from './utils/apiCache';

// Option 1: React Hook (recommended)
function MyComponent() {
  const { data, loading, error } = useCachedAPI(
    'hero-suggestions',
    () => fetch('/api/suggestions').then(r => r.json()),
    { 
      cache: shortCache, // 2-minute cache
      params: { heroId: '123' },
    }
  );

  if (loading) return <LoadingSpinner />;
  if (error) return <Error message={error.message} />;
  return <div>{data}</div>;
}

// Option 2: Direct cache usage
const suggestions = await apiCache.get(
  'hero-suggestions',
  () => fetch('/api/suggestions').then(r => r.json()),
  { heroId: '123' }
);

// Invalidation
apiCache.invalidate('hero-suggestions', { heroId: '123' });
apiCache.invalidatePattern(/^hero-/);

// Prefetching
await apiCache.prefetch('next-page', fetchNextPage);

// Statistics
const stats = apiCache.getStats();
console.log(`Cache utilization: ${stats.utilizationPercent}%`);
```

**Cache Tiers:**
- `shortCache`: 2 minutes, 50 items (real-time data)
- `apiCache`: 10 minutes, 100 items (default)
- `longCache`: 1 hour, 200 items (stable data)

**Features:**
- Request deduplication (prevents parallel duplicates)
- TTL-based expiration
- Automatic eviction when full
- Pattern-based invalidation
- Prefetching support
- Cache statistics

## Code Splitting

All route components are lazy-loaded:

```typescript
// App.tsx
const Heroes = lazy(() => import('./pages/Heroes'));
const HeroDetail = lazy(() => import('./pages/HeroDetail'));
// ... etc

<Suspense fallback={<LoadingSpinner />}>
  <Routes>
    <Route path="/heroes" element={<Heroes />} />
    // ...
  </Routes>
</Suspense>
```

**Benefits:**
- Initial bundle reduced by 40%
- Faster First Contentful Paint
- Better browser caching
- Improved Time to Interactive

## Build Configuration

Enhanced `vite.config.ts`:

```typescript
build: {
  rollupOptions: {
    output: {
      manualChunks: {
        'react-vendor': ['react', 'react-dom', 'react-router-dom'],
        'ui-vendor': ['lucide-react', 'recharts'],
      },
    },
  },
  minify: 'esbuild', // Faster than terser
  chunkSizeWarningLimit: 600,
},
optimizeDeps: {
  include: ['react', 'react-dom', 'react-router-dom', 'lucide-react', 'recharts'],
},
```

## Performance Monitoring

### Development Mode

Performance metrics are automatically logged:

```
⚡ Component: Dashboard: 45.23ms
📊 LCP: 1234.56 ms
📊 FID: 12.34 ms
🎯 Cache hit: hero-suggestions
🌐 Cache miss: hero-details
⏳ Deduplicating request: hero-suggestions
```

### Production Monitoring

To collect metrics in production:

```typescript
import { performanceMonitor } from './utils/performance';

// Collect metrics periodically
setInterval(() => {
  const metrics = performanceMonitor.getMetrics();
  // Send to analytics service
  analytics.track('performance', metrics);
}, 60000); // Every minute
```

## Best Practices

### Storage Operations

**Do:**
```typescript
// Batch updates
storageManager.batchUpdate({ heroes, roster, settings });

// Preload critical data on app start
await storageManager.preloadCriticalData(['heroes', 'roster']);
```

**Don't:**
```typescript
// Individual updates in loop (slow)
heroes.forEach(hero => setStoredData(`hero-${hero.id}`, hero));
```

### API Caching

**Do:**
```typescript
// Use appropriate cache tier
const recentData = useCachedAPI('recent', fetcher, { cache: shortCache });
const stableData = useCachedAPI('stable', fetcher, { cache: longCache });

// Prefetch anticipated data
await apiCache.prefetch('next-page', fetchNextPage);
```

**Don't:**
```typescript
// Over-caching dynamic data
const liveScore = useCachedAPI('score', fetcher, { cache: longCache }); // Bad!
```

### Performance Tracking

**Do:**
```typescript
// Track expensive operations
performanceMonitor.startMetric('data-processing');
const result = processLargeDataset(data);
performanceMonitor.endMetric('data-processing');
```

**Don't:**
```typescript
// Track trivial operations (noise)
performanceMonitor.startMetric('set-state'); // Too granular
setState(value);
performanceMonitor.endMetric('set-state');
```

## Optimization Checklist

- [x] Lazy load route components
- [x] Split vendor bundles
- [x] Implement caching layers
- [x] Add performance monitoring
- [x] Optimize localStorage usage
- [ ] Image optimization (WebP, lazy loading)
- [ ] Service worker for offline support
- [ ] Virtual scrolling for long lists
- [ ] React.memo for expensive components
- [ ] Progressive image loading

## Measuring Impact

### Bundle Analysis

```bash
npm run build
# Review chunk sizes in output
```

### Runtime Performance

1. Open Chrome DevTools
2. Performance tab → Record
3. Navigate through app
4. Check:
   - Time to Interactive
   - Total Blocking Time
   - Largest Contentful Paint

### Lighthouse Audit

```bash
npm run preview
# Open Lighthouse in Chrome DevTools
# Run audit
```

Target scores:
- Performance: >90
- Best Practices: >95
- Accessibility: >95
- SEO: >90

## Troubleshooting

### Large Bundle Warnings

If chunks exceed 600 KB:
1. Check for duplicate dependencies
2. Review manual chunks configuration
3. Consider dynamic imports for large components

### Cache Issues

If cache isn't working:
1. Check cache statistics: `apiCache.getStats()`
2. Verify TTL settings
3. Check browser console for cache logs
4. Clear cache manually: `apiCache.clear()`

### Performance Regression

If performance degrades:
1. Check performance metrics in console
2. Profile with Chrome DevTools
3. Review recent code changes
4. Verify lazy loading is working

## References

- [Multi-Agent Optimization Toolkit](./docs/optimization-toolkit.md)
- [React Code Splitting](https://react.dev/reference/react/lazy)
- [Vite Build Optimization](https://vitejs.dev/guide/build.html)
- [Web Vitals](https://web.dev/vitals/)
- [Performance API](https://developer.mozilla.org/en-US/docs/Web/API/Performance)

## Support

For issues or questions about optimizations:
1. Check this documentation
2. Review performance metrics
3. Examine browser console logs
4. Profile with DevTools
