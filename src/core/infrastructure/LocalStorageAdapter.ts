/**
 * Infrastructure Layer - LocalStorage Adapter
 * Implements IStorageService using browser localStorage
 */

import { IStorageService } from '../domain/interfaces';

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  version: string;
}

export class LocalStorageAdapter implements IStorageService {
  private cache: Map<string, { data: unknown; timestamp: number }> = new Map();
  private readonly CACHE_TTL = 5 * 60 * 1000; // 5 minutes
  private readonly VERSION = '2.0.0';

  get<T>(key: string, defaultValue: T): T {
    // Check in-memory cache first
    if (this.cache.has(key)) {
      const cached = this.cache.get(key);
      if (Date.now() - cached.timestamp < this.CACHE_TTL) {
        return cached.data as T;
      }
      this.cache.delete(key);
    }

    // Fetch from localStorage
    try {
      const item = localStorage.getItem(key);
      if (item) {
        const parsed = JSON.parse(item) as CacheEntry<T>;

        // Version check
        if (parsed.version === this.VERSION) {
          this.cache.set(key, {
            data: parsed.data,
            timestamp: Date.now(),
          });
          return parsed.data;
        }
      }
    } catch (error) {
      console.error(`Error reading ${key} from localStorage:`, error);
    }

    return defaultValue;
  }

  set<T>(key: string, value: T): void {
    try {
      const entry: CacheEntry<T> = {
        data: value,
        timestamp: Date.now(),
        version: this.VERSION,
      };

      localStorage.setItem(key, JSON.stringify(entry));

      this.cache.set(key, {
        data: value,
        timestamp: Date.now(),
      });
    } catch (error) {
      console.error(`Error writing ${key} to localStorage:`, error);
      if (error instanceof DOMException && error.name === 'QuotaExceededError') {
        console.warn('localStorage quota exceeded, clearing old data');
        this.clearOldEntries();
      }
    }
  }

  remove(key: string): void {
    this.cache.delete(key);
    localStorage.removeItem(key);
  }

  clear(): void {
    this.cache.clear();
    localStorage.clear();
  }

  batchUpdate(updates: Record<string, unknown>): void {
    Object.entries(updates).forEach(([key, value]) => {
      this.set(key, value);
    });
  }

  clearCache(): void {
    this.cache.clear();
  }

  getCacheStats() {
    return {
      cacheSize: this.cache.size,
      storageSize: Object.keys(localStorage).length,
      estimatedSize: new Blob([JSON.stringify(localStorage)]).size,
    };
  }

  async preloadCriticalData(keys: string[]): Promise<void> {
    keys.forEach(key => {
      try {
        const item = localStorage.getItem(key);
        if (item) {
          const parsed = JSON.parse(item);
          this.cache.set(key, {
            data: parsed.data,
            timestamp: Date.now(),
          });
        }
      } catch (error) {
        console.error(`Error preloading ${key}:`, error);
      }
    });
  }

  private clearOldEntries(): void {
    const keys = Object.keys(localStorage);
    const entries: Array<{ key: string; timestamp: number }> = [];

    keys.forEach(key => {
      try {
        const item = localStorage.getItem(key);
        if (item) {
          const parsed = JSON.parse(item) as CacheEntry<unknown>;
          entries.push({ key, timestamp: parsed.timestamp });
        }
      } catch {
        // Skip invalid entries
      }
    });

    entries.sort((a, b) => a.timestamp - b.timestamp);
    const toRemove = entries.slice(0, Math.floor(entries.length * 0.25));
    toRemove.forEach(({ key }) => localStorage.removeItem(key));
  }
}
