import { getRequestContext } from '@cloudflare/next-on-pages';

/**
 * Cloudflare KV 缓存工具
 * 实现双层缓存策略：内存缓存 + KV 持久化缓存
 */

// 类型定义
interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

// 内存缓存（L1 缓存 - 快速访问）
const memoryCache = new Map<string, CacheEntry<any>>();

// 缓存配置
const MEMORY_CACHE_MAX_SIZE = 500; // 内存缓存最大条目数
const MEMORY_CACHE_TTL = 60 * 1000; // 内存缓存默认1分钟

/**
 * 获取 KV 命名空间
 * 开发环境和生产环境自动适配
 */
export async function getKVNamespace(): Promise<KVNamespace | null> {
  try {
    if (typeof process !== 'undefined' && process.env.NODE_ENV === 'development') {
      // 开发环境：从 cloudflare next-on-pages 获取
      const { env } = getRequestContext();
      return (env as any).EMOJI_CACHE as KVNamespace;
    } else {
      // 生产环境：直接从 process.env 获取
      return (process.env as any).EMOJI_CACHE as KVNamespace;
    }
  } catch (error) {
    console.warn('KV namespace not available:', error);
    return null;
  }
}

/**
 * 生成缓存 key
 */
function getCacheKey(namespace: string, key: string): string {
  return `${namespace}:${key}`;
}

/**
 * 清理过期的内存缓存
 */
function cleanMemoryCache(): void {
  const now = Date.now();
  const keysToDelete: string[] = [];

  for (const [key, entry] of memoryCache.entries()) {
    if (now - entry.timestamp > entry.ttl) {
      keysToDelete.push(key);
    }
  }

  keysToDelete.forEach(key => memoryCache.delete(key));

  // 如果缓存过大，删除最旧的条目
  if (memoryCache.size > MEMORY_CACHE_MAX_SIZE) {
    const entries = Array.from(memoryCache.entries());
    entries.sort((a, b) => a[1].timestamp - b[1].timestamp);
    
    const toDelete = entries.slice(0, memoryCache.size - MEMORY_CACHE_MAX_SIZE);
    toDelete.forEach(([key]) => memoryCache.delete(key));
  }
}

/**
 * 从缓存获取数据
 * 优先从内存缓存读取，失败则从 KV 读取
 */
export async function getCached<T>(
  namespace: string,
  key: string,
  options?: {
    skipMemory?: boolean; // 跳过内存缓存
  }
): Promise<T | null> {
  const cacheKey = getCacheKey(namespace, key);
  const now = Date.now();

  // L1: 检查内存缓存
  if (!options?.skipMemory) {
    const memoryEntry = memoryCache.get(cacheKey);
    if (memoryEntry && now - memoryEntry.timestamp < memoryEntry.ttl) {
      return memoryEntry.data as T;
    }
  }

  // L2: 检查 KV 缓存
  try {
    const kv = await getKVNamespace();
    if (!kv) {
      return null;
    }

    const kvData = await kv.get<CacheEntry<T>>(cacheKey, 'json');
    if (kvData && now - kvData.timestamp < kvData.ttl) {
      // 回填到内存缓存
      memoryCache.set(cacheKey, {
        data: kvData.data,
        timestamp: kvData.timestamp,
        ttl: Math.min(kvData.ttl, MEMORY_CACHE_TTL),
      });
      
      return kvData.data;
    }

    // KV 中的数据已过期，删除
    if (kvData) {
      await kv.delete(cacheKey);
    }
  } catch (error) {
    console.error('KV get error:', error);
  }

  return null;
}

/**
 * 设置缓存
 * 同时写入内存缓存和 KV
 */
export async function setCached<T>(
  namespace: string,
  key: string,
  data: T,
  ttlSeconds: number
): Promise<void> {
  const cacheKey = getCacheKey(namespace, key);
  const ttlMs = ttlSeconds * 1000;
  const entry: CacheEntry<T> = {
    data,
    timestamp: Date.now(),
    ttl: ttlMs,
  };

  // L1: 写入内存缓存
  memoryCache.set(cacheKey, {
    ...entry,
    ttl: Math.min(ttlMs, MEMORY_CACHE_TTL),
  });

  // 定期清理内存缓存
  if (Math.random() < 0.1) { // 10% 概率清理
    cleanMemoryCache();
  }

  // L2: 写入 KV（异步，不阻塞）
  try {
    const kv = await getKVNamespace();
    if (!kv) {
      return;
    }

    await kv.put(cacheKey, JSON.stringify(entry), {
      expirationTtl: ttlSeconds,
    });
  } catch (error) {
    console.error('KV set error:', error);
  }
}

/**
 * 删除缓存
 */
export async function deleteCached(
  namespace: string,
  key: string
): Promise<void> {
  const cacheKey = getCacheKey(namespace, key);

  // 删除内存缓存
  memoryCache.delete(cacheKey);

  // 删除 KV 缓存
  try {
    const kv = await getKVNamespace();
    if (kv) {
      await kv.delete(cacheKey);
    }
  } catch (error) {
    console.error('KV delete error:', error);
  }
}

/**
 * 批量删除缓存（按前缀）
 */
export async function deleteCachedByPrefix(
  namespace: string,
  prefix: string
): Promise<void> {
  const fullPrefix = getCacheKey(namespace, prefix);

  // 删除内存缓存
  for (const key of memoryCache.keys()) {
    if (key.startsWith(fullPrefix)) {
      memoryCache.delete(key);
    }
  }

  // KV 不支持批量删除，需要列出所有 key 再删除
  try {
    const kv = await getKVNamespace();
    if (!kv) {
      return;
    }

    const list = await kv.list({ prefix: fullPrefix });
    await Promise.all(
      list.keys.map(({ name }) => kv.delete(name))
    );
  } catch (error) {
    console.error('KV batch delete error:', error);
  }
}

/**
 * 获取或设置缓存（缓存穿透保护）
 */
export async function getOrSetCached<T>(
  namespace: string,
  key: string,
  fetcher: () => Promise<T>,
  ttlSeconds: number
): Promise<T> {
  // 尝试从缓存获取
  const cached = await getCached<T>(namespace, key);
  if (cached !== null) {
    return cached;
  }

  // 缓存未命中，调用 fetcher 获取数据
  const data = await fetcher();

  // 写入缓存（异步，不阻塞返回）
  setCached(namespace, key, data, ttlSeconds).catch(err => {
    console.error('Failed to set cache:', err);
  });

  return data;
}

/**
 * 清空所有缓存（用于调试）
 */
export async function clearAllCache(namespace?: string): Promise<void> {
  if (namespace) {
    // 清空特定命名空间
    const prefix = `${namespace}:`;
    for (const key of memoryCache.keys()) {
      if (key.startsWith(prefix)) {
        memoryCache.delete(key);
      }
    }
  } else {
    // 清空所有内存缓存
    memoryCache.clear();
  }

  console.log(`Cache cleared for namespace: ${namespace || 'all'}`);
}

/**
 * 获取缓存统计信息
 */
export function getCacheStats() {
  return {
    memorySize: memoryCache.size,
    memoryMaxSize: MEMORY_CACHE_MAX_SIZE,
  };
}
