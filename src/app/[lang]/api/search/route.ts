import { db } from "@/server/db";
import { emoji, emojiKeywords, emojiLanguage, emojiType } from "@/server/db/schema";
import { NextResponse } from "next/server";
import { like, or, and, eq, desc, sql, inArray } from "drizzle-orm";
import { AVAILABLE_LOCALES, DEFAULT_LOCALE } from "@/locales/config";
import { emojiAiSearch } from "@/aiModal/emoji-ai-search";
import { supportLang } from "@/utils";

export const runtime = 'edge';

export async function POST(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    let lang = searchParams.get('lang') || DEFAULT_LOCALE;

    lang = supportLang.includes(lang) ? lang : 'en';

    const { keyword } = await request.json() as { keyword: string };

    const q = keyword.trim();
    // const searchPrepare = db
    //   .select({
    //     fullCode: emoji.fullCode,
    //     code: emoji.code,
    //     name: emojiLanguage.name,
    //     hot: emoji.hot,
    //     type: emojiType.type,
    //     typeName: emojiType.name
    //   })
    //   .from(emojiKeywords)
    //   .leftJoin(emoji, eq(emojiKeywords.baseCode, emoji.fullCode))
    //   .leftJoin(emojiLanguage, and(
    //     eq(emoji.fullCode, emojiLanguage.fullCode), 
    //     eq(emojiLanguage.language, lang)
    //   ))
    //   .leftJoin(emojiType, and(
    //     eq(emoji.type, emojiType.type), 
    //     eq(emojiType.language, lang)
    //   ))
    //   .where(and(
    //     eq(emojiKeywords.language, lang), 
    //     eq(emoji.diversity, 0),  
    //     // like(emojiKeywords.content, `%${q}%`)
    //     or(
    //         like(sql`LOWER(${emojiKeywords.content})`, `%${q.toLowerCase()}%`),
    //         like(sql`LOWER(${emojiLanguage.name})`, `%${q.toLowerCase()}%`)
    //       )
    //   ))
    //   .groupBy(emoji.fullCode, emoji.code, emojiLanguage.name, emoji.hot, emojiType.type, emojiType.name)
    //   .orderBy(desc(emoji.hot))
    //   .prepare();
    // 第一步， 匹配关键字
    const keywordPrepare = db
      .select({
        baseCode: emojiKeywords.baseCode
      })
      .from(emojiKeywords)
      .where(and(
        eq(emojiKeywords.language, lang),
        like(sql`LOWER(${emojiKeywords.content})`, `%${q.toLowerCase()}%`)
      ))
      .groupBy(emojiKeywords.baseCode)
      .prepare();

    const searchResults = await keywordPrepare.execute();  
    // console.log('searchResults===>>>', searchResults);

    const aiEmojiList: Record<string, any>[] = [];
    const emojiList: Record<string, any>[] = [];
    
    // 没有匹配到关键词，则调用豆包api，根据语义查找相关的表情
    if (searchResults.length === 0) {
      // TODO 调用豆包api，根据语义查找相关的表情
      const response: Record<string, any>[] = await emojiAiSearch(q, lang as AVAILABLE_LOCALES);
      aiEmojiList.push(...response);
    } else {
      const baseCodes: string[] = searchResults.map(item => item.baseCode).filter(code => code !== null);
      // 第二步： 根据 baseCode 查询 emoji 信息
      const emojiPrepare = db
        .select({
          fullCode: emoji.fullCode,
          code: emoji.code,
          name: emojiLanguage.name,
          hot: emoji.hot,
          type: emojiType.type,
          typeName: emojiType.name
        })
        .from(emoji)
        .leftJoin(emojiLanguage, and(
          eq(emoji.fullCode, emojiLanguage.fullCode),
          eq(emojiLanguage.language, lang)
        ))
        .leftJoin(emojiType, and(
          eq(emoji.type, emojiType.type),
          eq(emojiType.language, lang)
        ))
        .where(
          and(
            inArray(emoji.fullCode, baseCodes),
            eq(emoji.diversity, 0)
          )
        )
        .orderBy(desc(emoji.hot))
        .prepare();

      const emojiResults = await emojiPrepare.execute();
      // console.log('emojiResults===>>>', emojiResults);
      emojiList.push(...emojiResults);
    }

    const reulst: Record<string, any>[] = [...aiEmojiList, ...emojiList];
    
    return NextResponse.json({
      results: reulst,
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