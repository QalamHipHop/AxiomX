/**
 * Advanced Caching Utility with Redis Integration
 * Provides high-performance caching for market data and routing results
 */

import { createClient, RedisClientType } from 'redis';
import { CacheEntry } from './types';

export class CacheManager {
  private client: RedisClientType;
  private isConnected: boolean = false;
  private localCache: Map<string, CacheEntry<any>> = new Map();

  constructor(redisUrl?: string) {
    this.client = createClient({
      url: redisUrl || process.env.REDIS_URL || 'redis://localhost:6379',
    });

    this.setupEventHandlers();
  }

  private setupEventHandlers(): void {
    this.client.on('error', (err) => {
      console.error('Redis Client Error:', err);
      this.isConnected = false;
    });

    this.client.on('connect', () => {
      console.log('Redis Client Connected');
      this.isConnected = true;
    });
  }

  async connect(): Promise<void> {
    if (!this.isConnected) {
      await this.client.connect();
    }
  }

  async disconnect(): Promise<void> {
    if (this.isConnected) {
      await this.client.disconnect();
      this.isConnected = false;
    }
  }

  /**
   * Set cache entry with TTL
   */
  async set<T>(key: string, data: T, ttlSeconds: number = 300): Promise<void> {
    const entry: CacheEntry<T> = {
      data,
      timestamp: Date.now(),
      ttl: ttlSeconds,
      key,
    };

    // Always update local cache
    this.localCache.set(key, entry);

    // Try to update Redis if connected
    if (this.isConnected) {
      try {
        await this.client.setEx(key, ttlSeconds, JSON.stringify(entry));
      } catch (error) {
        console.warn(`Failed to set Redis cache for key ${key}:`, error);
      }
    }
  }

  /**
   * Get cache entry
   */
  async get<T>(key: string): Promise<T | null> {
    // Try Redis first if connected
    if (this.isConnected) {
      try {
        const data = await this.client.get(key);
        if (data) {
          const entry = JSON.parse(data) as CacheEntry<T>;
          this.localCache.set(key, entry);
          return entry.data;
        }
      } catch (error) {
        console.warn(`Failed to get Redis cache for key ${key}:`, error);
      }
    }

    // Fall back to local cache
    const entry = this.localCache.get(key);
    if (entry) {
      const age = (Date.now() - entry.timestamp) / 1000;
      if (age < entry.ttl) {
        return entry.data as T;
      } else {
        this.localCache.delete(key);
      }
    }

    return null;
  }

  /**
   * Delete cache entry
   */
  async delete(key: string): Promise<void> {
    this.localCache.delete(key);

    if (this.isConnected) {
      try {
        await this.client.del(key);
      } catch (error) {
        console.warn(`Failed to delete Redis cache for key ${key}:`, error);
      }
    }
  }

  /**
   * Clear all cache
   */
  async clear(): Promise<void> {
    this.localCache.clear();

    if (this.isConnected) {
      try {
        await this.client.flushDb();
      } catch (error) {
        console.warn('Failed to clear Redis cache:', error);
      }
    }
  }

  /**
   * Get cache statistics
   */
  getStats(): { localSize: number; isRedisConnected: boolean } {
    return {
      localSize: this.localCache.size,
      isRedisConnected: this.isConnected,
    };
  }
}

// Singleton instance
let cacheManagerInstance: CacheManager | null = null;

export function getCacheManager(): CacheManager {
  if (!cacheManagerInstance) {
    cacheManagerInstance = new CacheManager();
  }
  return cacheManagerInstance;
}
