import { getEmojiLanguageCount } from "@/server/detail";
import { generateSitemapIndexXml, SITEMAP_INDEX_PAGE_SIZE } from "@/utils";
import { NextResponse } from "next/server";

export const runtime = 'edge';

export async function GET() {

  const totalCount = await getEmojiLanguageCount();
  const totalPages = Math.ceil((totalCount?.[0]?.count || 0) / SITEMAP_INDEX_PAGE_SIZE);

  const urls: string[] = [];

  let i = 1;
  while (i <= totalPages) {
    urls.push(`https://emojis.click/en/api/sitemap/${i}`);
    i++;
  }

  const sitemapIndex = generateSitemapIndexXml(urls);

  const response = new NextResponse(sitemapIndex);
  response.headers.set('Content-Type', 'application/xml');
  return response;
}