import { db } from "@/server/db";
import { emojiLanguage } from "@/server/db/schema";
import { generateSitemapXml, SITEMAP_INDEX_PAGE_SIZE, SitemapUrl } from "@/utils";
import { NextRequest, NextResponse } from "next/server";

export const runtime = 'edge';

export async function GET(req: NextRequest) {

  const page = req.nextUrl.searchParams.get('page') || 1;

  const limitPage = SITEMAP_INDEX_PAGE_SIZE;
  const offset = (+(page || 1) - 1) * limitPage;

  const emojiPrepare = db
    .select({
      baseCode: emojiLanguage.fullCode,
      language: emojiLanguage.language,
    })
    .from(emojiLanguage)
    .limit(limitPage)
    .offset(offset)
    .prepare();

  const emojis = await emojiPrepare.execute();
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