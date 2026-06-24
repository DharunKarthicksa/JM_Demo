/**
 * services/cacheService.ts
 * -----------------------------------------------------------------------------
 * Simple in-memory TTL cache used to memoize GET responses (the Executive
 * Dashboard explicitly relies on cached API responses). Keyed by request URL.
 *
 * This is a shared service consumed by apiService.ts — a clear example of
 * shared-service usage for the analysis tool to pick up.
 */

import { ENV } from '../config/environment';
import logger from '../utils/logger';

interface CacheEntry<T> {
  value: T;
  expiresAt: number;
}

class CacheService {
  private store = new Map<string, CacheEntry<unknown>>();

  /** Read a value if present and not expired. */
  get<T>(key: string): T | undefined {
    const entry = this.store.get(key);
    if (!entry) return undefined;
    if (Date.now() > entry.expiresAt) {
      this.store.delete(key);
      logger.debug('cache expired', key);
      return undefined;
    }
    logger.debug('cache hit', key);
    return entry.value as T;
  }

  /** Store a value with an optional TTL (falls back to env default). */
  set<T>(key: string, value: T, ttlMs: number = ENV.cacheTtlMs): void {
    this.store.set(key, { value, expiresAt: Date.now() + ttlMs });
  }

  /** Remove a single key. */
  invalidate(key: string): void {
    this.store.delete(key);
  }

  /** Clear everything (e.g. on logout). */
  clear(): void {
    this.store.clear();
  }
}

/** Singleton shared across the app. */
export const cacheService = new CacheService();
export default cacheService;
