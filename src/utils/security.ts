/**
 * 安全工具函数
 * 用于防爬虫、限流等安全措施
 */

// 常见爬虫特征
export const KNOWN_BOT_PATTERNS = [
  // 搜索引擎爬虫（这些通常是善意的，可以选择性允许）
  /googlebot/i,
  /bingbot/i,
  /slurp/i,
  /duckduckbot/i,
  /baiduspider/i,
  /yandexbot/i,
  /sogou/i,
  
  // 恶意爬虫
  /bot/i,
  /crawl/i,
  /spider/i,
  /scrape/i,
  /wget/i,
  /curl/i,
  /python-requests/i,
  /python/i,
  /java(?!script)/i,
  /go-http-client/i,
  /okhttp/i,
  /axios/i,
  /node-fetch/i,
  /phantom/i,
  /headless/i,
  /selenium/i,
  /puppeteer/i,
  /playwright/i,
];

// 搜索引擎爬虫（善意的）
export const GOOD_BOTS = [
  /googlebot/i,
  /bingbot/i,
  /slurp/i, // Yahoo
  /duckduckbot/i,
  /baiduspider/i,
  /yandexbot/i,
];

/**
 * 检测是否为爬虫
 * @param userAgent - User-Agent字符串
 * @param allowGoodBots - 是否允许搜索引擎爬虫
 */
export function detectBot(userAgent: string | null, allowGoodBots = true): {
  isBot: boolean;
  botType?: 'good' | 'suspicious';
  pattern?: string;
} {
  if (!userAgent || userAgent.length < 10) {
    return { isBot: true, botType: 'suspicious' };
  }

  // 检查是否为善意爬虫
  if (allowGoodBots) {
    for (const pattern of GOOD_BOTS) {
      if (pattern.test(userAgent)) {
        return { isBot: true, botType: 'good', pattern: pattern.toString() };
      }
    }
  }

  // 检查是否为可疑爬虫
  for (const pattern of KNOWN_BOT_PATTERNS) {
    if (pattern.test(userAgent)) {
      return { isBot: true, botType: 'suspicious', pattern: pattern.toString() };
    }
  }

  return { isBot: false };
}

/**
 * 验证请求来源
 */
export function validateReferer(referer: string | null, allowedDomains: string[]): boolean {
  if (!referer) return true; // 允许无referer的请求（直接访问）
  
  try {
    const url = new URL(referer);
    return allowedDomains.some(domain => 
      url.hostname === domain || url.hostname.endsWith(`.${domain}`)
    );
  } catch {
    return false;
  }
}

/**
 * 简单的请求指纹生成
 */
export function generateFingerprint(
  ip: string,
  userAgent: string | null,
  acceptLanguage: string | null
): string {
  const parts = [
    ip,
    userAgent || 'unknown',
    acceptLanguage || 'unknown',
  ];
  return parts.join('|');
}

/**
 * 检测异常请求模式
 */
export function detectAnomalousPattern(requests: {
  timestamp: number;
  path: string;
}[]): {
  isSuspicious: boolean;
  reason?: string;
} {
  if (requests.length === 0) return { isSuspicious: false };

  // 检查请求频率
  const now = Date.now();
  const recentRequests = requests.filter(r => now - r.timestamp < 10000); // 10秒内
  
  if (recentRequests.length > 30) {
    return { 
      isSuspicious: true, 
      reason: '10秒内请求超过30次' 
    };
  }

  // 检查是否请求了大量不同的路径
  const uniquePaths = new Set(recentRequests.map(r => r.path));
  if (uniquePaths.size > 20) {
    return { 
      isSuspicious: true, 
      reason: '短时间内访问了大量不同路径' 
    };
  }

  // 检查是否有规律性模式（可能是自动化脚本）
  const intervals: number[] = [];
  for (let i = 1; i < recentRequests.length; i++) {
    const current = recentRequests[i];
    const previous = recentRequests[i - 1];
    if (current && previous) {
      intervals.push(current.timestamp - previous.timestamp);
    }
  }
  
  // 如果间隔非常规律（标准差很小），可能是脚本
  if (intervals.length > 5) {
    const avg = intervals.reduce((a, b) => a + b, 0) / intervals.length;
    const variance = intervals.reduce((sum, val) => sum + Math.pow(val - avg, 2), 0) / intervals.length;
    const stdDev = Math.sqrt(variance);
    
    if (stdDev < 100 && avg < 1000) { // 间隔小于1秒且非常规律
      return { 
        isSuspicious: true, 
        reason: '请求间隔过于规律，疑似自动化脚本' 
      };
    }
  }

  return { isSuspicious: false };
}

/**
 * IP黑名单检查（示例）
 */
export function isBlacklistedIP(ip: string): boolean {
  // 这里可以维护一个IP黑名单
  const blacklist: string[] = [
    // '123.456.789.0',
  ];
  return blacklist.includes(ip);
}

/**
 * 生成安全日志
 */
export function logSecurityEvent(event: {
  type: 'bot_detected' | 'rate_limit' | 'ban' | 'suspicious_pattern';
  ip: string;
  userAgent?: string;
  path?: string;
  reason?: string;
  timestamp?: number;
}): void {
  const logEntry = {
    ...event,
    timestamp: event.timestamp || Date.now(),
    date: new Date().toISOString(),
  };
  
  // 在生产环境中，这里应该发送到日志服务
  // 例如：Cloudflare Analytics, Sentry, DataDog 等
  console.warn('[Security Event]', JSON.stringify(logEntry));
}
