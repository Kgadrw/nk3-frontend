/**
 * Global API Cache System
 * Caches API responses to reduce redundant requests and improve performance
 */

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number; // Time to live in milliseconds
}

class APICache {
  private cache: Map<string, CacheEntry<any>> = new Map();
  private defaultTTL: number = 5 * 60 * 1000; // 5 minutes default

  /**
   * Get cached data if it exists and is still valid
   */
  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    
    if (!entry) {
      // Try to load from localStorage
      return this.loadFromStorage<T>(key);
    }

    // Check if cache is still valid
    const now = Date.now();
    if (now - entry.timestamp > entry.ttl) {
      // Cache expired, remove it
      this.cache.delete(key);
      this.removeFromStorage(key);
      return null;
    }

    return entry.data as T;
  }

  /**
   * Set cache data with optional TTL
   */
  set<T>(key: string, data: T, ttl?: number): void {
    const entry: CacheEntry<T> = {
      data,
      timestamp: Date.now(),
      ttl: ttl || this.defaultTTL,
    };

    this.cache.set(key, entry);
    
    // Also save to localStorage for persistence
    this.saveToStorage(key, entry);
  }

  /**
   * Check if cache exists and is valid
   */
  has(key: string): boolean {
    const entry = this.cache.get(key);
    
    if (!entry) {
      // Check localStorage
      return this.hasInStorage(key);
    }

    const now = Date.now();
    if (now - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      this.removeFromStorage(key);
      return false;
    }

    return true;
  }

  /**
   * Invalidate cache for a specific key
   */
  invalidate(key: string): void {
    this.cache.delete(key);
    this.removeFromStorage(key);
  }

  /**
   * Invalidate all cache
   */
  clear(): void {
    this.cache.clear();
    if (typeof window !== 'undefined') {
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith('api_cache_')) {
          localStorage.removeItem(key);
        }
      });
    }
  }

  /**
   * Invalidate cache for multiple keys matching a pattern
   */
  invalidatePattern(pattern: string): void {
    const regex = new RegExp(pattern);
    const keysToDelete: string[] = [];

    this.cache.forEach((_, key) => {
      if (regex.test(key)) {
        keysToDelete.push(key);
      }
    });

    keysToDelete.forEach(key => {
      this.invalidate(key);
    });
  }

  /**
   * Save to localStorage
   */
  private saveToStorage(key: string, entry: CacheEntry<any>): void {
    if (typeof window === 'undefined') return;

    try {
      const storageKey = `api_cache_${key}`;
      const data = {
        ...entry,
        // Store as JSON string
        data: JSON.stringify(entry.data),
      };
      localStorage.setItem(storageKey, JSON.stringify(data));
    } catch (error) {
      // localStorage might be full or unavailable
      console.warn('Failed to save to localStorage:', error);
    }
  }

  /**
   * Load from localStorage
   */
  private loadFromStorage<T>(key: string): T | null {
    if (typeof window === 'undefined') return null;

    try {
      const storageKey = `api_cache_${key}`;
      const stored = localStorage.getItem(storageKey);
      
      if (!stored) return null;

      const entry: CacheEntry<any> = JSON.parse(stored);
      
      // Check if cache is still valid
      const now = Date.now();
      if (now - entry.timestamp > entry.ttl) {
        // Expired, remove it
        localStorage.removeItem(storageKey);
        return null;
      }

      // Parse the data back
      entry.data = JSON.parse(entry.data);
      
      // Restore to memory cache
      this.cache.set(key, entry);

      return entry.data as T;
    } catch (error) {
      // Failed to parse, remove corrupted data
      const storageKey = `api_cache_${key}`;
      localStorage.removeItem(storageKey);
      return null;
    }
  }

  /**
   * Check if key exists in storage
   */
  private hasInStorage(key: string): boolean {
    if (typeof window === 'undefined') return false;

    try {
      const storageKey = `api_cache_${key}`;
      const stored = localStorage.getItem(storageKey);
      
      if (!stored) return false;

      const entry: CacheEntry<any> = JSON.parse(stored);
      const now = Date.now();
      
      if (now - entry.timestamp > entry.ttl) {
        localStorage.removeItem(storageKey);
        return false;
      }

      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Remove from storage
   */
  private removeFromStorage(key: string): void {
    if (typeof window === 'undefined') return;

    try {
      const storageKey = `api_cache_${key}`;
      localStorage.removeItem(storageKey);
    } catch (error) {
      // Ignore errors
    }
  }
}

// Export singleton instance
export const apiCache = new APICache();

/**
 * Cached fetch function
 * @param url - API endpoint URL
 * @param options - Fetch options
 * @param ttl - Cache TTL in milliseconds (default: 5 minutes)
 * @returns Promise with cached or fresh data
 */
export async function cachedFetch<T = any>(
  url: string,
  options?: RequestInit,
  ttl?: number
): Promise<T> {
  // Use URL as cache key (include method if not GET)
  const method = options?.method || 'GET';
  const cacheKey = `${method}_${url}`;

  // Check cache first
  const cached = apiCache.get<T>(cacheKey);
  if (cached !== null) {
    return Promise.resolve(cached);
  }

  // Fetch fresh data
  try {
    const response = await fetch(url, options);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      throw new Error('Invalid response content type');
    }

    const data = await response.json();

    // Cache the response
    apiCache.set(cacheKey, data, ttl);

    return data;
  } catch (error) {
    // If fetch fails, try to return stale cache if available
    const staleCache = apiCache.get<T>(cacheKey);
    if (staleCache !== null) {
      console.warn('Fetch failed, using stale cache:', error);
      return staleCache;
    }
    throw error;
  }
}

/**
 * Invalidate cache for a specific API endpoint
 */
export function invalidateCache(url: string, method: string = 'GET'): void {
  const cacheKey = `${method}_${url}`;
  apiCache.invalidate(cacheKey);
}

/**
 * Invalidate all caches matching a pattern
 */
export function invalidateCachePattern(pattern: string): void {
  apiCache.invalidatePattern(pattern);
}
