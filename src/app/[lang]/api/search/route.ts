import { db } from "@/server/db";
import { emoji, emojiKeywords, emojiLanguage, emojiType } from "@/server/db/schema";
import { NextResponse } from "next/server";
import { like, or, and, eq, desc } from "drizzle-orm";
import { DEFAULT_LOCALE } from "@/locales/config";

export const runtime = 'edge';

// 验证搜索关键词
function validateSearchQuery(q: string): boolean {
  // 添加你的验证逻辑，例如：
  // - 长度限制
  // - 特殊字符过滤
  // - 敏感词检查等
  return q.length > 0 && q.length <= 100;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const lang = searchParams.get('lang') || DEFAULT_LOCALE;

    const q = searchParams.get('q') ? decodeURIComponent(searchParams.get('q')!).trim() : '';

    const searchPrepare = db
      .select({
        fullCode: emoji.fullCode,
        code: emoji.code,
        name: emojiLanguage.name,
        hot: emoji.hot,
        type: emojiType.type,
        typeName: emojiType.name
      })
      .from(emojiKeywords)
      .leftJoin(emoji, eq(emojiKeywords.baseCode, emoji.fullCode))
      .leftJoin(emojiLanguage, and(
        eq(emoji.fullCode, emojiLanguage.fullCode), 
        eq(emojiLanguage.language, lang)
      ))
      .leftJoin(emojiType, and(
        eq(emoji.type, emojiType.type), 
        eq(emojiType.language, lang)
      ))
      .where(and(
        eq(emojiKeywords.language, lang), 
        eq(emoji.diversity, 0),  
        like(emojiKeywords.content, `%${q}%`)
      ))
      .groupBy(emoji.fullCode, emoji.code, emojiLanguage.name, emoji.hot, emojiType.type, emojiType.name)
      .orderBy(desc(emoji.hot))
      .prepare();
    

    // 验证搜索关键词
    if (!validateSearchQuery(q)) {
      return NextResponse.json(
        { 
          error: '无效的搜索关键词',
          status: 400 
        },
      );
    }

    const searchResults = await searchPrepare.execute();  

    // console.log('搜索关键词:', q);
    // console.log('搜索结果:', searchResults);
    
    return NextResponse.json({
      results: searchResults,
      status: 200,
    });
  } catch (error) {
    console.error('搜索接口错误:', error);
    return NextResponse.json(
      { error: '搜索请求处理失败' },
      { status: 500 }
    );
  }
}