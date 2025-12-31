import { db } from "@/server/db";
import { emoji, emojiKeywords, emojiLanguage, emojiSearchTips, emojiType } from "@/server/db/schema";
import { NextResponse } from "next/server";
import { like, and, eq, desc, sql, inArray, or } from "drizzle-orm";
import { AVAILABLE_LOCALES, DEFAULT_LOCALE } from "@/locales/config";
import { emojiAiSearch } from "@/aiModal/emoji-ai-search";
import { supportLang } from "@/utils";
import { doubaoGenerateEmoji } from "@/aiModal/open-ai-char";
import { getCached, setCached, getOrSetCached, getKVNamespace } from "@/utils/kv-cache";

export const runtime = 'edge';

// 添加缓存配置
const CACHE_TTL = 60 * 60; // 1小时缓存
const SEARCH_CACHE_TTL = 60 * 5; // 搜索结果缓存5分钟
const AI_CACHE_TTL = 60 * 30; // AI结果缓存30分钟

// 限流配置 - 放宽限制，减少限流判断 CPU 消耗
const RATE_LIMIT_WINDOW = 60 * 1000; // 1分钟窗口
const MAX_REQUESTS_PER_MINUTE = 30; // 每分钟最多 30 次请求
const MAX_REQUESTS_PER_HOUR = 300; // 每小时最多 300 次请求
const AI_RATE_LIMIT = 10; // AI搜索每分钟最多 10 次
const BAN_DURATION = 30 * 60 * 1000; // 封禁 30 分钟

// 内存缓存(Edge Runtime简单实现)
// const searchCache = new Map<string, { data: any; timestamp: number }>();
// const aiCache = new Map<string, { data: any; timestamp: number }>();

// 限流存储
const rateLimitMap = new Map<string, { count: number; hourCount: number; aiCount: number; resetTime: number; hourResetTime: number; aiResetTime: number }>();
const bannedIPs = new Map<string, number>(); // IP -> 封禁到期时间

// 全局封禁检查缓存 (IP -> 检查时间)
// 用于减少对 KV 的读取，如果 10秒内检查过该IP且未封禁，则不再查 KV
const checkedCleanIPs = new Map<string, number>();
const CHECKED_CLEAN_TTL = 10 * 1000; // 10秒

// 已知爬虫User-Agent特征
const BOT_PATTERNS = [
  /bot/i,
  /crawl/i,
  /spider/i,
  /scrape/i,
  /wget/i,
  /curl/i,
  /python/i,
  /java(?!script)/i,
  /http/i,
  /axios/i,
  /fetch/i,
  /requests/i,
  /scraper/i,
  /phantom/i,
  /headless/i,
  /selenium/i,
  /puppeteer/i,
];

// 缓存清理函数
function cleanCache(cache: Map<string, { data: any; timestamp: number }>, ttl: number) {
  const now = Date.now();
  for (const [key, value] of cache.entries()) {
    if (now - value.timestamp > ttl * 1000) {
      cache.delete(key);
    }
  }
}

// 检测爬虫
function isBot(userAgent: string | null): boolean {
  if (!userAgent || userAgent.length < 10) return true; // 无UA或UA过短
  return BOT_PATTERNS.some(pattern => pattern.test(userAgent));
}

// 获取客户端IP
function getClientIP(request: Request): string {
  const headers = request.headers;
  // Cloudflare headers
  const cfConnectingIP = headers.get('cf-connecting-ip');
  if (cfConnectingIP) return cfConnectingIP;
  
  // 其他常见headers
  const xForwardedFor = headers.get('x-forwarded-for');
  if (xForwardedFor) return xForwardedFor.split(',')[0]?.trim() || 'unknown';
  
  const xRealIP = headers.get('x-real-ip');
  if (xRealIP) return xRealIP;
  
  return 'unknown';
}

// 异步设置全局封禁
async function setGlobalBan(ip: string, durationMs: number) {
  try {
    const kv = await getKVNamespace();
    if (!kv) return;
    
    // 写入 KV，标记该 IP 被封禁
    // Key: ban:IP, Value: timestamp
    const banKey = `ban:${ip}`;
    await kv.put(banKey, Date.now().toString(), {
      expirationTtl: Math.ceil(durationMs / 1000)
    });
    console.log(`[GlobalBan] IP ${ip} banned for ${durationMs/1000}s`);
  } catch (error) {
    console.error('[GlobalBan] Failed to set global ban:', error);
  }
}

// 检查全局封禁
async function checkGlobalBan(ip: string): Promise<boolean> {
  const now = Date.now();
  
  // 1. 检查本地"白名单"缓存 (最近检查过且未封禁)
  const lastCheck = checkedCleanIPs.get(ip);
  if (lastCheck && now - lastCheck < CHECKED_CLEAN_TTL) {
    return false; // 认为是干净的
  }
  
  // 2. 检查 KV
  try {
    const kv = await getKVNamespace();
    if (!kv) return false;
    
    const banKey = `ban:${ip}`;
    const isBanned = await kv.get(banKey);
    
    if (isBanned) {
      // 确实被封禁了，更新本地封禁列表，避免下次再查 KV
      bannedIPs.set(ip, now + BAN_DURATION); // 同步到本地封禁
      return true;
    } else {
      // 未被封禁，更新本地"白名单"
      checkedCleanIPs.set(ip, now);
      // 防止 Map 无限增长
      if (checkedCleanIPs.size > 5000) {
        // 简单清理，删除最早的 key (这里简化为清空或随机删，为性能考虑)
        // Edge Runtime 下通常不会存活太久，简单清理即可
        if (Math.random() < 0.1) checkedCleanIPs.clear();
      }
      return false;
    }
  } catch (error) {
    console.error('[GlobalBan] Check failed:', error);
    return false; // 故障时默认放行
  }
}

// 限流检查
async function checkRateLimit(ip: string, isAiSearch = false): Promise<{ allowed: boolean; reason?: string }> {
  const now = Date.now();
  
  // 检查是否在封禁列表中 (本地内存)
  const banExpiry = bannedIPs.get(ip);
  if (banExpiry && now < banExpiry) {
    return { 
      allowed: false, 
      reason: `IP已被封禁，请${Math.ceil((banExpiry - now) / 60000)}分钟后重试` 
    };
  } else if (banExpiry) {
    bannedIPs.delete(ip); // 解除过期封禁
  }
  
  // 检查全局封禁 (KV) - 仅在本地未封禁时检查
  // 注意：为了不阻塞每个请求，这里可以作为前置检查，或者只在请求频率较高时检查
  // 策略：所有搜索请求都做检查，但有 checkedCleanIPs 保护，性能损耗可控
  const isGloballyBanned = await checkGlobalBan(ip);
  if (isGloballyBanned) {
    return {
      allowed: false,
      reason: `IP已被全局封禁，请稍后重试`
    };
  }
  
  // 获取或创建限流记录
  let record = rateLimitMap.get(ip);
  if (!record || now > record.resetTime) {
    record = { 
      count: 0, 
      hourCount: 0,
      aiCount: 0,
      resetTime: now + RATE_LIMIT_WINDOW,
      hourResetTime: now + 60 * 60 * 1000,
      aiResetTime: now + RATE_LIMIT_WINDOW
    };
    rateLimitMap.set(ip, record);
  }
  
  // 重置小时计数器
  if (now > record.hourResetTime) {
    record.hourCount = 0;
    record.hourResetTime = now + 60 * 60 * 1000;
  }
  
  // 重置AI计数器
  if (isAiSearch && now > record.aiResetTime) {
    record.aiCount = 0;
    record.aiResetTime = now + RATE_LIMIT_WINDOW;
  }
  
  // 检查小时限制
  if (record.hourCount >= MAX_REQUESTS_PER_HOUR) {
    // 超过小时限制，封禁IP (本地 + 全局)
    bannedIPs.set(ip, now + BAN_DURATION);
    // 异步触发全局封禁，不阻塞当前响应
    setGlobalBan(ip, BAN_DURATION).catch(console.error);
    
    return { 
      allowed: false, 
      reason: '请求过于频繁，已被暂时封禁1小时' 
    };
  }
  
  // 检查分钟限制
  if (record.count >= MAX_REQUESTS_PER_MINUTE) {
    return { 
      allowed: false, 
      reason: `请求过于频繁，请${Math.ceil((record.resetTime - now) / 1000)}秒后重试` 
    };
  }
  
  // 检查AI搜索限制
  if (isAiSearch && record.aiCount >= AI_RATE_LIMIT) {
    return { 
      allowed: false, 
      reason: `AI搜索请求过于频繁，请${Math.ceil((record.aiResetTime - now) / 1000)}秒后重试` 
    };
  }
  
  // 更新计数
  record.count++;
  record.hourCount++;
  if (isAiSearch) {
    record.aiCount++;
  }
  
  // 定期清理过期记录 - 提高阈值，减少清理频率
  if (rateLimitMap.size > 20000) { // 从 10000 提高到 20000
    for (const [key, value] of rateLimitMap.entries()) {
      if (now > value.resetTime && now > value.hourResetTime) {
        rateLimitMap.delete(key);
      }
    }
  }
  
  return { allowed: true };
}

// 清理过期封禁
function cleanBannedIPs() {
  const now = Date.now();
  for (const [ip, expiry] of bannedIPs.entries()) {
    if (now > expiry) {
      bannedIPs.delete(ip);
    }
  }
  if (bannedIPs.size > 1000) {
    bannedIPs.clear();
  }
}

// 获取缓存
function getCache<T>(cache: Map<string, { data: any; timestamp: number }>, key: string, ttl: number): T | null {
  const cached = cache.get(key);
  if (cached && Date.now() - cached.timestamp < ttl * 1000) {
    return cached.data as T;
  }
  return null;
}

// 设置缓存
function setCache<T>(cache: Map<string, { data: any; timestamp: number }>, key: string, data: T): void {
  cache.set(key, { data, timestamp: Date.now() });
  // 定期清理过期缓存
  if (cache.size > 1000) {
    cleanCache(cache, 0);
  }
}

function handleResponse(response: Record<string, any>[]) {
  // TODO 调用豆包api，根据语义查找相关的表情
  const emojiRegex = /[\p{Emoji}]/gu;
  const validEmojiRegex = /^[\u{00A9}\u{00AE}\u{203C}\u{2049}\u{2122}\u{2139}\u{2194}-\u{2199}\u{21A9}-\u{21AA}\u{231A}-\u{231B}\u{2328}\u{23CF}\u{23E9}-\u{23F3}\u{23F8}-\u{23FA}\u{24C2}\u{25AA}-\u{25AB}\u{25B6}\u{25C0}\u{25FB}-\u{25FE}\u{2600}-\u{2604}\u{260E}\u{2611}\u{2614}-\u{2615}\u{2618}\u{261D}\u{2620}\u{2622}-\u{2623}\u{2626}\u{262A}\u{262E}-\u{262F}\u{2638}-\u{263A}\u{2640}\u{2642}\u{2648}-\u{2653}\u{2660}\u{2663}\u{2665}-\u{2666}\u{2668}\u{267B}\u{267F}\u{2692}-\u{2697}\u{2699}\u{269B}-\u{269C}\u{26A0}-\u{26A1}\u{26AA}-\u{26AB}\u{26B0}-\u{26B1}\u{26BD}-\u{26BE}\u{26C4}-\u{26C5}\u{26C8}\u{26CE}-\u{26CF}\u{26D1}\u{26D3}-\u{26D4}\u{26E9}-\u{26EA}\u{26F0}-\u{26F5}\u{26F7}-\u{26FA}\u{26FD}\u{2702}\u{2705}\u{2708}-\u{270D}\u{270F}\u{2712}\u{2714}\u{2716}\u{271D}\u{2721}\u{2728}\u{2733}-\u{2734}\u{2744}\u{2747}\u{274C}\u{274E}\u{2753}-\u{2755}\u{2757}\u{2763}-\u{2764}\u{2795}-\u{2797}\u{27A1}\u{27B0}\u{27BF}\u{2934}-\u{2935}\u{2B05}-\u{2B07}\u{2B1B}-\u{2B1C}\u{2B50}\u{2B55}\u{3030}\u{303D}\u{3297}\u{3299}\u{1F004}\u{1F0CF}\u{1F170}-\u{1F171}\u{1F17E}-\u{1F17F}\u{1F18E}\u{1F191}-\u{1F19A}\u{1F1E6}-\u{1F1FF}\u{1F201}-\u{1F202}\u{1F21A}\u{1F22F}\u{1F232}-\u{1F23A}\u{1F250}-\u{1F251}\u{1F300}-\u{1F321}\u{1F324}-\u{1F393}\u{1F396}-\u{1F397}\u{1F399}-\u{1F39B}\u{1F39E}-\u{1F3F0}\u{1F3F3}-\u{1F3F5}\u{1F3F7}-\u{1F4FD}\u{1F4FF}-\u{1F53D}\u{1F549}-\u{1F54E}\u{1F550}-\u{1F567}\u{1F56F}-\u{1F570}\u{1F573}-\u{1F57A}\u{1F587}\u{1F58A}-\u{1F58D}\u{1F590}\u{1F595}-\u{1F596}\u{1F5A4}-\u{1F5A5}\u{1F5A8}\u{1F5B1}-\u{1F5B2}\u{1F5BC}\u{1F5C2}-\u{1F5C4}\u{1F5D1}-\u{1F5D3}\u{1F5DC}-\u{1F5DE}\u{1F5E1}\u{1F5E3}\u{1F5E8}\u{1F5EF}\u{1F5F3}\u{1F5FA}-\u{1F64F}\u{1F680}-\u{1F6C5}\u{1F6CB}-\u{1F6D2}\u{1F6E0}-\u{1F6E5}\u{1F6E9}\u{1F6EB}-\u{1F6EC}\u{1F6F0}\u{1F6F3}-\u{1F6F8}\u{1F910}-\u{1F93A}\u{1F93C}-\u{1F93E}\u{1F940}-\u{1F945}\u{1F947}-\u{1F94C}\u{1F950}-\u{1F96B}\u{1F980}-\u{1F997}\u{1F9C0}\u{1F9D0}-\u{1F9E6}\u{200D}\u{20E3}\u{FE0F}\u{E0020}-\u{E007F}\u{2388}\u{2605}\u{2607}-\u{260D}\u{260F}-\u{2610}\u{2612}\u{2616}-\u{2617}\u{2619}-\u{261C}\u{261E}-\u{261F}\u{2621}\u{2624}-\u{2625}\u{2627}-\u{2629}\u{262B}-\u{262D}\u{2630}-\u{2637}\u{263B}-\u{263F}\u{2641}\u{2643}-\u{2647}\u{2654}-\u{265F}\u{2661}-\u{2662}\u{2664}\u{2667}\u{2669}-\u{267A}\u{267C}-\u{267E}\u{2680}-\u{2691}\u{2698}\u{269A}\u{269D}-\u{269F}\u{26A2}-\u{26A9}\u{26AC}-\u{26AF}\u{26B2}-\u{26BC}\u{26BF}-\u{26C3}\u{26C6}-\u{26C7}\u{26C9}-\u{26CD}\u{26D0}\u{26D2}\u{26D5}-\u{26E8}\u{26EB}-\u{26EF}\u{26F6}\u{26FB}-\u{26FC}\u{26FE}-\u{2701}\u{2703}-\u{2704}\u{270E}\u{2710}-\u{2711}\u{2765}-\u{2767}\u{1F000}-\u{1F003}\u{1F005}-\u{1F0CE}\u{1F0D0}-\u{1F0FF}\u{1F10D}-\u{1F10F}\u{1F12F}\u{1F16C}-\u{1F16F}\u{1F1AD}-\u{1F1E5}\u{1F203}-\u{1F20F}\u{1F23C}-\u{1F23F}\u{1F249}-\u{1F24F}\u{1F252}-\u{1F2FF}\u{1F322}-\u{1F323}\u{1F394}-\u{1F395}\u{1F398}\u{1F39C}-\u{1F39D}\u{1F3F1}-\u{1F3F2}\u{1F3F6}\u{1F4FE}\u{1F53E}-\u{1F548}\u{1F54F}\u{1F568}-\u{1F56E}\u{1F571}-\u{1F572}\u{1F57B}-\u{1F586}\u{1F588}-\u{1F589}\u{1F58E}-\u{1F58F}\u{1F591}-\u{1F594}\u{1F597}-\u{1F5A3}\u{1F5A6}-\u{1F5A7}\u{1F5A9}-\u{1F5B0}\u{1F5B3}-\u{1F5BB}\u{1F5BD}-\u{1F5C1}\u{1F5C5}-\u{1F5D0}\u{1F5D4}-\u{1F5DB}\u{1F5DF}-\u{1F5E0}\u{1F5E2}\u{1F5E4}-\u{1F5E7}\u{1F5E9}-\u{1F5EE}\u{1F5F0}-\u{1F5F2}\u{1F5F4}-\u{1F5F9}\u{1F6C6}-\u{1F6CA}\u{1F6D3}-\u{1F6DF}\u{1F6E6}-\u{1F6E8}\u{1F6EA}\u{1F6ED}-\u{1F6EF}\u{1F6F1}-\u{1F6F2}\u{1F6F9}-\u{1F6FF}\u{1F774}-\u{1F77F}\u{1F7D5}-\u{1F7FF}\u{1F80C}-\u{1F80F}\u{1F848}-\u{1F84F}\u{1F85A}-\u{1F85F}\u{1F888}-\u{1F88F}\u{1F8AE}-\u{1F90F}\u{1F93F}\u{1F94D}-\u{1F94F}\u{1F96C}-\u{1F97F}\u{1F998}-\u{1F9BF}\u{1F9C1}-\u{1F9CF}]$/u;
  const emojisFilters = response.map(item => {
    const emoji = item.code.match(emojiRegex)?.[0];
    return {
      ...item,
      code: emoji || item.code // 如果没有找到emoji，保留原始code
    };
  }).filter(item => item.code);
  
  // aiEmojiList.push(...emojisFilters.filter(item => validEmojiRegex.test(item.code)));
  return emojisFilters.filter(item => validEmojiRegex.test(item.code));
}

export async function POST(request: Request) {
  try {
    // 获取客户端IP和User-Agent
    const clientIP = getClientIP(request);
    const userAgent = request.headers.get('user-agent');
    
    // 检测爬虫
    if (isBot(userAgent)) {
      console.warn(`检测到爬虫访问: IP=${clientIP}, UA=${userAgent}`);
      return NextResponse.json(
        { error: '检测到异常访问，请使用正常浏览器访问' },
        { status: 403 }
      );
    }
    
    const { searchParams } = new URL(request.url);

    let lang = searchParams.get('lang') || DEFAULT_LOCALE;

    lang = supportLang.includes(lang) ? lang : 'en';

    const { keyword } = await request.json() as { keyword: string };

    const q = keyword.trim();
    
    // 检查输入合法性
    if (!q || q.length > 100) {
      return NextResponse.json(
        { error: '搜索关键词无效' },
        { status: 400 }
      );
    }
    
    // 预先检查是否需要AI搜索(用于限流)
    const willNeedAI = q.length > 0;
    
    // 限流检查(暂不判断AI)
    const rateLimitCheck = await checkRateLimit(clientIP, false);
    if (!rateLimitCheck.allowed) {
      console.warn(`限流拦截: IP=${clientIP}, 原因=${rateLimitCheck.reason}`);
      return NextResponse.json(
        { error: rateLimitCheck.reason },
        { 
          status: 429,
          headers: {
            'Retry-After': '60',
            'X-RateLimit-Limit': MAX_REQUESTS_PER_MINUTE.toString(),
          }
        }
      );
    }
    
    // 检查KV缓存
    const cacheKey = `${lang}:${q.toLowerCase()}`;
    // 使用统一的 KV 缓存工具 (含内存 L1 缓存)
    const cachedResult = await getCached<any[]>('search', cacheKey);
    if (cachedResult) {
      return NextResponse.json({
        results: cachedResult,
        status: 200,
        cached: true,
        source: 'kv',
      });
    }
    // 第一步， 匹配关键字 - 优化查询
    const lowerQ = q.toLowerCase();
    
    // 并行执行两个查询以提高性能
    const [keywordContentResults, keywordNameResults] = await Promise.all([
      db
        .selectDistinct({
          baseCode: emojiKeywords.baseCode
        })
        .from(emojiKeywords)
        .where(and(
          eq(emojiKeywords.language, lang),
          // 使用 contentLower 字段代替 LOWER() 函数，可以利用索引
          // 去掉前缀通配符 % 以启用索引前缀搜索，避免全表扫描
          like(emojiKeywords.contentLower, `${lowerQ}%`)
        ))
        .limit(50) // 进一步减少限制数量，减少数据库负载
        .execute(),
      db
        .selectDistinct({
          baseCode: emojiLanguage.fullCode
        })
        .from(emojiLanguage)
        .where(and(
          eq(emojiLanguage.language, lang),
          // 使用 nameLower 字段代替 LOWER() 函数，可以利用索引
          // 去掉前缀通配符 % 以启用索引前缀搜索，避免全表扫描
          like(emojiLanguage.nameLower, `${lowerQ}%`)
        ))
        .limit(50) // 进一步减少限制数量，减少数据库负载
        .execute()
    ]);

    let searchResults = [];
    // console.log('keywordNameResults===>>>', keywordNameResults);
    // searchResults = [...keywordContentResults, ...keywordNameResults];
    searchResults = [...keywordNameResults];
  
    for (const item of keywordContentResults) {
      if (searchResults.find(result => result.baseCode === item.baseCode)) {
        continue;
      }
      searchResults.push(item);
    }

    const aiEmojiList: Record<string, any>[] = [];
    const emojiList: Record<string, any>[] = [];
    
    // 没有匹配到关键词，则调用豆包api，根据语义查找相关的表情
    if (searchResults.length === 0) {
      // AI搜索额外限流检查
      const aiRateLimitCheck = await checkRateLimit(clientIP, true);
      if (!aiRateLimitCheck.allowed) {
        console.warn(`AI搜索限流: IP=${clientIP}, 原因=${aiRateLimitCheck.reason}`);
        return NextResponse.json(
          { error: aiRateLimitCheck.reason },
          { status: 429 }
        );
      }
      
      // 检查AI KV缓存
      const aiCacheKey = `${lang}:${q.toLowerCase()}`;
      const cachedAiResult = await getCached<any[]>('ai', aiCacheKey);
      
      if (cachedAiResult) {
        aiEmojiList.push(...cachedAiResult);
      } else {
        let response: Record<string, any>[] = [];
        try {
          // 添加超时控制
          const timeoutPromise = new Promise<never>((_, reject) => 
            setTimeout(() => reject(new Error('AI请求超时')), 8000)
          );
          
          response = await Promise.race([
            emojiAiSearch(q, lang as AVAILABLE_LOCALES),
            timeoutPromise
          ]) as Record<string, any>[];
          
          const processedResponse = handleResponse(response);
          aiEmojiList.push(...processedResponse);
          // 缓存AI结果到KV
          await setCached('ai', aiCacheKey, processedResponse, AI_CACHE_TTL);
        } catch (error) {
          // 快速失败，不再尝试第二个AI
          console.error('AI搜索失败:', error);
          aiEmojiList.push([]);
        }
      }
    } else {
      const baseCodes: string[] = searchResults.map(item => item.baseCode).filter(code => code !== null);
      
      // 优化：减少批次大小和并发数，降低 CPU 消耗
      const batchSize = 30; // 从 100 降低到 30
      const maxResults = 100; // 从 200 降低到 100
      
      // 并行获取 Emoji 类型映射，避免在循环中 JOIN
      const typeMapPromise = getOrSetCached(
        'emojiTypeMap',
        lang,
        async () => {
          const types = await db
            .select({
              type: emojiType.type,
              name: emojiType.name
            })
            .from(emojiType)
            .where(eq(emojiType.language, lang))
            .execute();
            
          return types.reduce((acc, curr) => {
            if (curr.type !== null && curr.name !== null) {
              acc[curr.type] = curr.name;
            }
            return acc;
          }, {} as Record<number, string>);
        },
        86400 // 缓存 1 天
      );

      // 分批查询，但并行处理
      const batches = [];
      for (let i = 0; i < baseCodes.length && emojiList.length < maxResults; i += batchSize) {
        batches.push(baseCodes.slice(i, i + batchSize));
        if (batches.length >= 2) break; // 最多 2 个批次并行，减少 CPU 消耗
      }
      
      // 并行执行所有查询和类型获取
      const [typeMap, ...batchResults] = await Promise.all([
        typeMapPromise,
        ...batches.map(batch => 
          db
            .select({
              fullCode: emoji.fullCode,
              code: emoji.code,
              name: emojiLanguage.name,
              hot: emoji.hot,
              type: emoji.type,
              // typeName: emojiType.name // 移除 JOIN，改为内存映射
            })
            .from(emoji)
            .leftJoin(emojiLanguage, and(
              eq(emoji.fullCode, emojiLanguage.fullCode),
              eq(emojiLanguage.language, lang)
            ))
            // 移除 emojiType JOIN，改用内存映射
            // .leftJoin(emojiType, and(
            //   eq(emoji.type, emojiType.type),
            //   eq(emojiType.language, lang)
            // ))
            .where(
              and(
                inArray(emoji.fullCode, batch),
                or(eq(emoji.diversity, 0), eq(emoji.hot, 1))
              )
            )
            .orderBy(desc(emoji.hot))
            .limit(30) // 减少每批次限制，降低 CPU 消耗
            .execute()
        )
      ]);
      
      // 合并结果并填充 typeName
      for (const results of batchResults) {
        const resultsWithTypeName = results.map(item => ({
          ...item,
          typeName: item.type !== null ? typeMap[item.type] : null
        }));
        emojiList.push(...resultsWithTypeName);
        if (emojiList.length >= maxResults) {
          break;
        }
      }
    }

    // 最多返回 100 条，减少数据传输和 CPU 消耗
    const result: Record<string, any>[] = [...aiEmojiList, ...emojiList].slice(0, 100);
    
    // 设置KV缓存 (同时也写入内存缓存)
    await setCached('search', cacheKey, result, SEARCH_CACHE_TTL);
    
    return NextResponse.json({
      results: result,
      status: 200,
      cached: false,
    }, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
        'X-RateLimit-Limit': MAX_REQUESTS_PER_MINUTE.toString(),
        'X-RateLimit-Remaining': (MAX_REQUESTS_PER_MINUTE - (rateLimitMap.get(clientIP)?.count || 0)).toString(),
      }
    });
  } catch (error: any) {
    // 优化数据库表不存在的报错信息
    if (error?.message?.includes('no such table')) {
      console.error('Database Error: Table not found. Please run "npm run db:migrate:local" to initialize the database.');
      return NextResponse.json(
        { error: 'Database not initialized' },
        { status: 500 }
      );
    }

    console.error('搜索接口错误:', error);
    return NextResponse.json(
      { error: '搜索请求处理失败' },
      { status: 500 }
    );
  } finally {
    // 定期清理
    if (Math.random() < 0.01) { // 1%概率清理
      cleanBannedIPs();
    }
  }
}

// 随机关键词缓存
const keywordsCache = new Map<string, { data: any; timestamp: number }>();

export async function GET(request: Request) { 
  // GET请求也进行限流和爬虫检查
  const clientIP = getClientIP(request);
  const userAgent = request.headers.get('user-agent');
  
  // 检测爬虫(GET请求限制稍宽松)
  if (isBot(userAgent)) {
    console.warn(`GET请求检测到爬虫: IP=${clientIP}, UA=${userAgent}`);
    return NextResponse.json(
      { error: '检测到异常访问' },
      { status: 403 }
    );
  }
  
  // 限流检查(GET请求使用相同限流)
  const rateLimitCheck = await checkRateLimit(clientIP, false);
  if (!rateLimitCheck.allowed) {
    return NextResponse.json(
      { error: rateLimitCheck.reason },
      { status: 429 }
    );
  }
  
  const { searchParams } = new URL(request.url);
  
  let lang = searchParams.get('lang') || DEFAULT_LOCALE;
  lang = supportLang.includes(lang) ? lang : 'en';

  // 使用KV缓存获取随机关键词
  const keywords = await getOrSetCached(
    'keywords',
    lang,
    async () => {
      const keywordsResult = await db
        .select({
          content: emojiSearchTips.content
        })
        .from(emojiSearchTips)
        .where(eq(emojiSearchTips.language, lang))
        .limit(50) // 限制数量，减少 CPU 消耗
        .execute();
      
      // 在应用层随机打乱，避免数据库 RANDOM() 消耗 CPU
      return keywordsResult.sort(() => Math.random() - 0.5).slice(0, 10);
    },
    300 // 5分钟缓存
  );

  return NextResponse.json({
    data: keywords,
    status: 200,
    cached: true,
  }, {
    headers: {
      'Cache-Control': 'public, s-maxage=300',
    }
  });
}