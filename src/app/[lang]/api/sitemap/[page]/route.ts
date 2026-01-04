import { db } from "@/server/db";
import { emojiLanguage } from "@/server/db/schema";
import { generateSitemapXml, SITEMAP_INDEX_PAGE_SIZE, SitemapUrl } from "@/utils";
import { NextRequest, NextResponse } from "next/server";
import { getOrSetCached } from "@/utils/kv-cache";

export const runtime = 'edge';

export async function GET(req: NextRequest, { params }: { params: { page: string } }) {

  // 优先从路由参数获取 page，兼容旧的 query 参数方式
  const pageParam = params?.page || req.nextUrl.searchParams.get('page') || '1';
  const page = parseInt(pageParam, 10) || 1;

  const limitPage = SITEMAP_INDEX_PAGE_SIZE;
  const offset = (page - 1) * limitPage;

  // 使用 KV 缓存，7天缓存，sitemap 数据基本不变
  const emojis = await getOrSetCached(
    'sitemap',
    `page_${page}`,
    async () => {
      const emojiPrepare = db
        .select({
          baseCode: emojiLanguage.fullCode,
          language: emojiLanguage.language,
        })
        .from(emojiLanguage)
        // 添加排序以确保分页确定性，并利用 (fullCode, language) 覆盖索引进行扫描
        // 这将避免全表扫描，只扫描索引，显著提高 offset 性能
        .orderBy(emojiLanguage.fullCode, emojiLanguage.language)
        .limit(limitPage)
        .offset(offset)
        .prepare();

      return await emojiPrepare.execute();
    },
    86400 * 7 // 7天缓存
  ).catch(() => []);
  const dynamicUrls: SitemapUrl[] = emojis.map((emoji: Record<string, any>) => ({
    loc: `https://emojis.click/${emoji.language}/${emoji.baseCode}`,
    lastmod: new Date().toISOString(),
    changefreq: 'daily',
    priority: 0.8,
  }));
  const urls = [...dynamicUrls];
  const xml = generateSitemapXml(urls);
  const response = new NextResponse(xml, {
    headers: { 'Content-Type': 'application/xml' },
  });
  return response;
}