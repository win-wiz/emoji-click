import { db } from "@/server/db";
import { emoji, emojiKeywords, emojiLanguage, emojiSearchTips, emojiType } from "@/server/db/schema";
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
      try {
        // TODO 调用豆包api，根据语义查找相关的表情
        // const response: Record<string, any>[] = await emojiAiSearch(q, lang as AVAILABLE_LOCALES);
        const response: Record<string, any>[] = await emojiAiSearch(q, lang as AVAILABLE_LOCALES);
        // 过滤非code的emoji
        // const validEmojiRegex = /^[\u{1F300}-\u{1F5FF}\u{1F900}-\u{1F9FF}\u{1F600}-\u{1F64F}\u{1F680}-\u{1F6FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F1E6}-\u{1F1FF}\u{1F191}-\u{1F251}\u{1F004}\u{1F0CF}\u{1F170}-\u{1F171}\u{1F17E}-\u{1F17F}\u{1F18E}\u{3030}\u{2B50}\u{2B55}\u{2934}-\u{2935}\u{2B05}-\u{2B07}\u{2B1B}-\u{2B1C}\u{3297}\u{3299}\u{303D}\u{00A9}\u{00AE}\u{2122}\u{23F3}\u{24C2}\u{23E9}-\u{23EF}\u{25B6}\u{23F8}-\u{23FA}]$/u;
        // aiEmojiList.push(...response.filter(item => validEmojiRegex.test(item.code)));
        // console.log('response===>>>', response[0]?.code?.length);
        // for (const item of response) {
        //   console.log('item===>>>', item.code.length);
        // }
        aiEmojiList.push(...response.filter(item => [2, 3].includes(item.code.length)));
      } catch (error) {
        console.error('解析 emojiAiSearch 返回数据错误:', error);
        // 解析失败时，返回空数组
        aiEmojiList.push([]);
      }
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

export async function GET(request: Request) { 

  const { searchParams } = new URL(request.url);
  
  let lang = searchParams.get('lang') || DEFAULT_LOCALE;

  lang = supportLang.includes(lang) ? lang : 'en';

  const keywordsPrepare = db
    .select({
      content: emojiSearchTips.content
    })
    .from(emojiSearchTips)
    .where(eq(emojiSearchTips.language, lang))
    .orderBy(sql`RANDOM()`)
    .limit(10)
    .prepare();

  const keywords = await keywordsPrepare.execute();

  return NextResponse.json({
    data: keywords,
    status: 200,
  });
}