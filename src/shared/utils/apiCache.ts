import React from 'react';

/**
 * Multi-Agent API Caching Strategy
 * Implements intelligent request caching with TTL and deduplication
 */

import { logger } from '../lib/logger';

interface CacheConfig {
  ttl: number; // Time to live in milliseconds
  maxSize: number; // Maximum number of cached items
}

interface CachedResponse<T> {
  data: T;
  timestamp: number;
  hash: string;
}

class APICache {
  private cache: Map<string, CachedResponse<unknown>> = new Map();
  private pendingRequests: Map<string, Promise<unknown>> = new Map();
  private config: CacheConfig;

  constructor(config: Partial<CacheConfig> = {}) {
    this.config = {
      ttl: config.ttl || 10 * 60 * 1000, // Default: 10 minutes
      maxSize: config.maxSize || 100,
    };
  }

  /**
   * Generate cache key from request parameters
   */
  private generateKey(endpoint: string, params?: unknown): string {
    const paramsStr = params ? JSON.stringify(params) : '';
    return `${endpoint}:${paramsStr}`;
  }

  /**
   * Generate hash for content-based caching
   */
  private generateHash(data: unknown): string {
    return JSON.stringify(data).split('').reduce((acc, char) => {
      return ((acc << 5) - acc) + char.charCodeAt(0);
    }, 0).toString(36);
  }

  /**
   * Check if cached response is still valid
   */
  private isValid(cached: CachedResponse<unknown>): boolean {
    return Date.now() - cached.timestamp < this.config.ttl;
  }

  /**
   * Evict oldest entries when cache is full
   */
  private evictOldest(): void {
    if (this.cache.size < this.config.maxSize) return;

    const entries = Array.from(this.cache.entries());
    entries.sort((a, b) => a[1].timestamp - b[1].timestamp);
    
    // Remove oldest 20%
    const toRemove = Math.ceil(this.config.maxSize * 0.2);
    entries.slice(0, toRemove).forEach(([key]) => {
      this.cache.delete(key);
    });
  }

  /**
   * Get cached response or fetch new one
   */
  async get<T>(
    endpoint: string,
    fetcher: () => Promise<T>,
    params?: unknown
  ): Promise<T> {
    const key = this.generateKey(endpoint, params);

    // Check cache first
    const cached = this.cache.get(key);
    if (cached && this.isValid(cached)) {
      logger.debug('Cache hit:', endpoint);
      return cached.data as T;
    }

    // Check if request is already pending (deduplication)
    const pending = this.pendingRequests.get(key);
    if (pending) {
      logger.debug('Deduplicating request:', endpoint);
      return pending as Promise<T>;
    }

    // Make new request
    logger.debug('Cache miss:', endpoint);
    const requestPromise = fetcher()
      .then(data => {
        // Store in cache
        this.evictOldest();
        this.cache.set(key, {
          data,
          timestamp: Date.now(),
          hash: this.generateHash(data),
        });

        // Remove from pending
        this.pendingRequests.delete(key);

        return data;
      })
      .catch(error => {
        // Remove from pending on error
        this.pendingRequests.delete(key);
        throw error;
      });

    // Store pending request
    this.pendingRequests.set(key, requestPromise);

    return requestPromise;
  }

  /**
   * Invalidate specific cache entry
   */
  invalidate(endpoint: string, params?: unknown): void {
    const key = this.generateKey(endpoint, params);
    this.cache.delete(key);
  }

  /**
   * Invalidate all cache entries matching pattern
   */
  invalidatePattern(pattern: RegExp): void {
    Array.from(this.cache.keys())
      .filter(key => pattern.test(key))
      .forEach(key => this.cache.delete(key));
  }

  /**
   * Clear all cache
   */
  clear(): void {
    this.cache.clear();
    this.pendingRequests.clear();
  }

  /**
   * Get cache statistics
   */
  getStats() {
    return {
      size: this.cache.size,
      maxSize: this.config.maxSize,
      utilizationPercent: (this.cache.size / this.config.maxSize) * 100,
      pendingRequests: this.pendingRequests.size,
    };
  }

  /**
   * Prefetch data for anticipated requests
   */
  async prefetch<T>(
    endpoint: string,
    fetcher: () => Promise<T>,
    params?: unknown
  ): Promise<void> {
    const key = this.generateKey(endpoint, params);
    
    // Skip if already cached
    if (this.cache.has(key)) return;

    try {
      await this.get(endpoint, fetcher, params);
    } catch (error) {
      logger.error('Prefetch failed for', endpoint, error);
    }
  }
}

// Create singleton instances for different cache scopes
export const apiCache = new APICache({ ttl: 10 * 60 * 1000, maxSize: 100 }); // 10 min
export const shortCache = new APICache({ ttl: 2 * 60 * 1000, maxSize: 50 }); // 2 min
export const longCache = new APICache({ ttl: 60 * 60 * 1000, maxSize: 200 }); // 1 hour

/**
 * React hook for cached API calls
 */
export function useCachedAPI<T>(
  endpoint: string,
  fetcher: () => Promise<T>,
  options: { cache?: APICache; params?: unknown; enabled?: boolean } = {}
) {
  const [data, setData] = React.useState<T | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<Error | null>(null);

  const { cache = apiCache, params, enabled = true } = options;

  React.useEffect(() => {
    if (!enabled) {
      setLoading(false);
      return;
    }

    let cancelled = false;

    const fetchData = async () => {
      try {
        setLoading(true);
        const result = await cache.get(endpoint, fetcher, params);
        if (!cancelled) {
          setData(result);
          setError(null);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err as Error);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      cancelled = true;
    };
  }, [endpoint, JSON.stringify(params), enabled]);

  return { data, loading, error };
}

