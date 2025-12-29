/*
 * For more info see
 * https://nextjs.org/docs/app/building-your-application/routing/internationalization
 * */
import { type NextRequest, NextResponse } from 'next/server'
import { locales, DEFAULT_LOCALE } from '@/locales/config'

// 全局限流配置
const GLOBAL_RATE_LIMIT = 100; // 每分钟最多100次请求
const BAN_THRESHOLD = 300; // 5分钟超过300次封禁1小时
const BAN_DURATION = 60 * 60 * 1000; // 封禁1小时

// 爬虫特征列表(与 API中保持一致)
const SUSPICIOUS_PATTERNS = [
  /bot/i, /crawl/i, /spider/i, /scrape/i,
  /wget/i, /curl/i, /python/i, /java(?!script)/i,
  /http/i, /axios/i, /requests/i,
];

// 简单的内存存储
const requestCounts = new Map<string, { count: number; timestamp: number; total: number }>();
const bannedIPs = new Map<string, number>();

function getClientIP(request: NextRequest): string {
  const cfIP = request.headers.get('cf-connecting-ip');
  if (cfIP) return cfIP;
  
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0]?.trim() || 'unknown';
  
  return request.ip || 'unknown';
}

function isSuspiciousUA(ua: string | null): boolean {
  if (!ua || ua.length < 10) return true;
  return SUSPICIOUS_PATTERNS.some(pattern => pattern.test(ua));
}

function checkGlobalRateLimit(ip: string): { allowed: boolean; reason?: string } {
  const now = Date.now();
  
  // 检查封禁
  const banExpiry = bannedIPs.get(ip);
  if (banExpiry && now < banExpiry) {
    return { allowed: false, reason: 'banned' };
  } else if (banExpiry) {
    bannedIPs.delete(ip);
  }
  
  // 获取或初始化计数
  let record = requestCounts.get(ip);
  if (!record || now - record.timestamp > 60000) {
    record = { count: 0, timestamp: now, total: 0 };
    requestCounts.set(ip, record);
  }
  
  record.count++;
  record.total++;
  
  // 5分钟总计数检查
  if (record.total > BAN_THRESHOLD) {
    bannedIPs.set(ip, now + BAN_DURATION);
    return { allowed: false, reason: 'abuse' };
  }
  
  // 每分钟限制
  if (record.count > GLOBAL_RATE_LIMIT) {
    return { allowed: false, reason: 'rate_limit' };
  }
  
  // 清理过期记录
  if (requestCounts.size > 5000) {
    for (const [key, value] of requestCounts.entries()) {
      if (now - value.timestamp > 300000) { // 5分钟
        requestCounts.delete(key);
      }
    }
  }
  
  return { allowed: true };
}

export function middleware(request: NextRequest) {
  const nextUrl = (request as unknown as NextRequest).nextUrl
  const pathname = nextUrl.pathname
  const params = nextUrl.searchParams
  
  // 获取IP和UA
  const clientIP = getClientIP(request);
  const userAgent = request.headers.get('user-agent');
  
  // API路径的额外防护
  if (pathname.includes('/api/')) {
    // 检测爬虫
    if (isSuspiciousUA(userAgent)) {
      console.warn(`[Middleware] 爬虫拦截: IP=${clientIP}, UA=${userAgent}, Path=${pathname}`);
      return new NextResponse(
        JSON.stringify({ error: '访问被拒绝' }),
        { status: 403, headers: { 'content-type': 'application/json' } }
      );
    }
    
    // 全局限流
    const rateLimitResult = checkGlobalRateLimit(clientIP);
    if (!rateLimitResult.allowed) {
      console.warn(`[Middleware] 限流拦截: IP=${clientIP}, 原因=${rateLimitResult.reason}, Path=${pathname}`);
      return new NextResponse(
        JSON.stringify({ 
          error: rateLimitResult.reason === 'banned' 
            ? '您的IP已被暂时封禁' 
            : '请求过于频繁，请稍后重试' 
        }),
        { 
          status: 429,
          headers: { 
            'content-type': 'application/json',
            'Retry-After': '60'
          } 
        }
      );
    }
  }
  
  const pathnameIsMissingLocale = locales.every(
    (locale) =>
      !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  )

  // console.log('pathnameIsMissingLocale', pathnameIsMissingLocale);
  // console.log('pathname', pathname);
  if (pathname.endsWith('//')) {
    const newUrl = new URL(request.url)
    newUrl.pathname = pathname.replace(/\/+$/, '')
    return NextResponse.redirect(newUrl)
  }
  
  // Redirect if there is no locale
  if (pathnameIsMissingLocale) {
    // e.g. incoming request is /products
    // The new URL is now /en-US/products
    return NextResponse.redirect(
      new URL(
        `/${DEFAULT_LOCALE}/${pathname}?${params.toString()}`,
        request.url
      )
    )
  }
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images - .svg, .png, .jpg, .jpeg, .gif, .webp
     * - .txt files
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.*\\.(?:svg|png|jpg|jpeg|gif|webp|txt|html)$).*)'
  ]
}
