import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const FlagMaps = {
  en: '🇺🇸', // 英语
  zh: '🇨🇳', // 简体中文 
  cs: '🇨🇿', // 捷克语
  fr: '🇫🇷', // 法语
  de: '🇩🇪', // 德语
  es: '🇪🇸', // 西班牙语
  it: '🇮🇹', // 意大利语
  ja: '🇯🇵', // 日语
  ko: '🇰🇷', // 韩语
  nl: '🇳🇱', // 荷兰语
  'pt-BR': '🇵🇷',  // 巴西葡萄牙语
  ru: '🇷🇺', // 俄语
  uk: '🇺🇦', // 乌克兰语
  vi: '🇻🇳', // 越南语
  'zh-TW': '🇨🇳', // 繁体中文
  pt: '🇵🇹', // 葡萄牙语
  da: '🇩🇰', // 丹麦语
  el: '🇬🇷', // 希腊语
  no: '🇳🇴', // 挪威语
  fi: '🇫🇮', // 芬兰语
  sv: '🇸🇪', // 瑞典语
  th: '🇹🇭', // 泰语
  id: '🇮🇩', // 印度尼西亚语
  hi: '🇮🇳', // 印地语
  bn: '🇧🇩', // 孟加拉语
  ms: '🇲🇾', // 马来语
  tr: '🇹🇷', // 土耳其语
}

export function getLocaleFlag(locale: string) {
  return FlagMaps[locale as keyof typeof FlagMaps] || '🌐';
}

// 优化防抖函数
export function debounce(fn: Function, delay: number) {
  let timeoutId: NodeJS.Timeout
  const debouncedFn = function (this: any, ...args: any[]) {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => fn.apply(this, args), delay)
  }
  debouncedFn.cancel = () => clearTimeout(timeoutId)
  return debouncedFn
}

export const fetcher = (...args: Parameters<typeof fetch>) => fetch(...args).then((res) => res.json());

export const supportLang = ['zh', 'en', 'fr', 'es', 'pt', 'zh-TW'];

export interface SitemapUrl {
  loc: string
  lastmod: string
  changefreq: 'daily' | 'weekly' | 'monthly' | 'yearly'
  priority: number
}

export function generateSitemapXml(urls: SitemapUrl[]) {
  let xml = '<?xml version="1.0" encoding="UTF-8"?>'
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'
  urls.forEach(url => {
    xml += `<url>
              <loc>${url.loc}</loc>
              <lastmod>${url.lastmod}</lastmod>
              <changefreq>${url.changefreq}</changefreq>
              <priority>${url.priority}</priority>
            </url>`
  })
  xml += '</urlset>'
  return xml
}

export const SITEMAP_INDEX_PAGE_SIZE = 2000;

export function generateSitemapIndexXml(urls: string[]) {
  let xml = '<?xml version="1.0" encoding="UTF-8"?>'
  xml += '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'
  urls.forEach(url => {
    xml += `<sitemap>
              <loc>${url}</loc>
              <lastmod>${new Date().toISOString()}</lastmod>
            </sitemap>`
  })
  xml += '</sitemapindex>'
  return xml
}