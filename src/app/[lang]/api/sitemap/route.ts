import { db } from "@/server/db";
import { emojiLanguage } from "@/server/db/schema";
import { generateSitemapXml, SitemapUrl } from "@/utils";
import { NextResponse } from "next/server";

export const runtime = 'edge';

export async function GET() {
  const emojiPrepare = db.select({
    baseCode: emojiLanguage.fullCode,
    language: emojiLanguage.language,
  }).from(emojiLanguage).prepare();

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