/**
 * Optimized LocalStorage Manager with Caching
 * Implements the Multi-Agent Storage Optimization pattern
 */

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  version: string;
}

class StorageManager {
  private cache: Map<string, any> = new Map();
  private readonly CACHE_TTL = 5 * 60 * 1000; // 5 minutes
  private readonly VERSION = '1.0.0';

  /**
   * Get item with in-memory caching
   */
  getItem<T>(key: string, defaultValue: T): T {
    // Check in-memory cache first
    if (this.cache.has(key)) {
      const cached = this.cache.get(key);
      if (Date.now() - cached.timestamp < this.CACHE_TTL) {
        return cached.data as T;
      }
      // Cache expired, remove it
      this.cache.delete(key);
    }

    // Fetch from localStorage
    try {
      const item = localStorage.getItem(key);
      if (item) {
        const parsed = JSON.parse(item) as CacheEntry<T>;
        
        // Version check
        if (parsed.version === this.VERSION) {
          // Update cache
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

  /**
   * Set item with cache update
   */
  setItem<T>(key: string, value: T): void {
    try {
      const entry: CacheEntry<T> = {
        data: value,
        timestamp: Date.now(),
        version: this.VERSION,
      };

      // Update localStorage
      localStorage.setItem(key, JSON.stringify(entry));

      // Update cache
      this.cache.set(key, {
        data: value,
        timestamp: Date.now(),
      });
    } catch (error) {
      console.error(`Error writing ${key} to localStorage:`, error);
      // Handle quota exceeded
      if (error instanceof DOMException && error.name === 'QuotaExceededError') {
        console.warn('localStorage quota exceeded, clearing old data');
        this.clearOldEntries();
      }
    }
  }

  /**
   * Remove item and clear from cache
   */
  removeItem(key: string): void {
    this.cache.delete(key);
    localStorage.removeItem(key);
  }

  /**
   * Batch update for better performance
   */
  batchUpdate(updates: Record<string, any>): void {
    Object.entries(updates).forEach(([key, value]) => {
      this.setItem(key, value);
    });
  }

  /**
   * Clear old entries to free up space
   */
  private clearOldEntries(): void {
    const keys = Object.keys(localStorage);
    const entries: Array<{ key: string; timestamp: number }> = [];

    keys.forEach(key => {
      try {
        const item = localStorage.getItem(key);
        if (item) {
          const parsed = JSON.parse(item) as CacheEntry<any>;
          entries.push({ key, timestamp: parsed.timestamp });
        }
      } catch {
        // Skip invalid entries
      }
    });

    // Sort by timestamp and remove oldest 25%
    entries.sort((a, b) => a.timestamp - b.timestamp);
    const toRemove = entries.slice(0, Math.floor(entries.length * 0.25));
    toRemove.forEach(({ key }) => localStorage.removeItem(key));
  }

  /**
   * Clear all cache
   */
  clearCache(): void {
    this.cache.clear();
  }

  /**
   * Get cache statistics
   */
  getCacheStats() {
    return {
      cacheSize: this.cache.size,
      storageSize: Object.keys(localStorage).length,
      estimatedSize: new Blob([JSON.stringify(localStorage)]).size,
    };
  }

  /**
   * Preload critical data into cache
   */
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
}

// Singleton instance
export const storageManager = new StorageManager();

// Helper functions for common operations
export function getStoredData<T>(key: string, defaultValue: T): T {
  return storageManager.getItem(key, defaultValue);
}

export function setStoredData<T>(key: string, value: T): void {
  storageManager.setItem(key, value);
}

export function removeStoredData(key: string): void {
  storageManager.removeItem(key);
}
