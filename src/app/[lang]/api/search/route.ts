import { db } from "@/server/db";
import { emoji, emojiKeywords, emojiLanguage, emojiSearchTips, emojiType } from "@/server/db/schema";
import { NextResponse } from "next/server";
import { like, and, eq, desc, sql, inArray, or } from "drizzle-orm";
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
    const keywordContentPrepare = db
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

    const keywordNamePrepare = db
      .select({
        baseCode: emojiLanguage.fullCode
      })
      .from(emojiLanguage)
      .where(and(
        eq(emojiLanguage.language, lang),
        like(sql`LOWER(${emojiLanguage.name})`, `%${q.toLowerCase()}%`)
      ))
      .groupBy(emojiLanguage.fullCode)
      .prepare();

    let searchResults = [];
    const keywordContentResults = await keywordContentPrepare.execute();
    const keywordNameResults = await keywordNamePrepare.execute();
    // console.log('keywordNameResults===>>>', keywordNameResults);
    // searchResults = [...keywordContentResults, ...keywordNameResults];
    searchResults = [...keywordNameResults];
  
    for (const item of keywordContentResults) {
      if (searchResults.find(result => result.baseCode === item.baseCode)) {
        continue;
      }
      searchResults.push(item);
    }

    let aiEmojiList: Record<string, any>[] = [];
    const emojiList: Record<string, any>[] = [];
    
    // 没有匹配到关键词，则调用豆包api，根据语义查找相关的表情
    if (searchResults.length === 0) {
      try {
        // TODO 调用豆包api，根据语义查找相关的表情
        const emojiRegex = /[\p{Emoji}]/gu;
        // const response: Record<string, any>[] = await emojiAiSearch(q, lang as AVAILABLE_LOCALES);
        const response: Record<string, any>[] = await emojiAiSearch(q, lang as AVAILABLE_LOCALES);
        // 过滤非code的emoji
        console.log(response);
        const validEmojiRegex = /^[\u{00A9}\u{00AE}\u{203C}\u{2049}\u{2122}\u{2139}\u{2194}-\u{2199}\u{21A9}-\u{21AA}\u{231A}-\u{231B}\u{2328}\u{23CF}\u{23E9}-\u{23F3}\u{23F8}-\u{23FA}\u{24C2}\u{25AA}-\u{25AB}\u{25B6}\u{25C0}\u{25FB}-\u{25FE}\u{2600}-\u{2604}\u{260E}\u{2611}\u{2614}-\u{2615}\u{2618}\u{261D}\u{2620}\u{2622}-\u{2623}\u{2626}\u{262A}\u{262E}-\u{262F}\u{2638}-\u{263A}\u{2640}\u{2642}\u{2648}-\u{2653}\u{2660}\u{2663}\u{2665}-\u{2666}\u{2668}\u{267B}\u{267F}\u{2692}-\u{2697}\u{2699}\u{269B}-\u{269C}\u{26A0}-\u{26A1}\u{26AA}-\u{26AB}\u{26B0}-\u{26B1}\u{26BD}-\u{26BE}\u{26C4}-\u{26C5}\u{26C8}\u{26CE}-\u{26CF}\u{26D1}\u{26D3}-\u{26D4}\u{26E9}-\u{26EA}\u{26F0}-\u{26F5}\u{26F7}-\u{26FA}\u{26FD}\u{2702}\u{2705}\u{2708}-\u{270D}\u{270F}\u{2712}\u{2714}\u{2716}\u{271D}\u{2721}\u{2728}\u{2733}-\u{2734}\u{2744}\u{2747}\u{274C}\u{274E}\u{2753}-\u{2755}\u{2757}\u{2763}-\u{2764}\u{2795}-\u{2797}\u{27A1}\u{27B0}\u{27BF}\u{2934}-\u{2935}\u{2B05}-\u{2B07}\u{2B1B}-\u{2B1C}\u{2B50}\u{2B55}\u{3030}\u{303D}\u{3297}\u{3299}\u{1F004}\u{1F0CF}\u{1F170}-\u{1F171}\u{1F17E}-\u{1F17F}\u{1F18E}\u{1F191}-\u{1F19A}\u{1F1E6}-\u{1F1FF}\u{1F201}-\u{1F202}\u{1F21A}\u{1F22F}\u{1F232}-\u{1F23A}\u{1F250}-\u{1F251}\u{1F300}-\u{1F321}\u{1F324}-\u{1F393}\u{1F396}-\u{1F397}\u{1F399}-\u{1F39B}\u{1F39E}-\u{1F3F0}\u{1F3F3}-\u{1F3F5}\u{1F3F7}-\u{1F4FD}\u{1F4FF}-\u{1F53D}\u{1F549}-\u{1F54E}\u{1F550}-\u{1F567}\u{1F56F}-\u{1F570}\u{1F573}-\u{1F57A}\u{1F587}\u{1F58A}-\u{1F58D}\u{1F590}\u{1F595}-\u{1F596}\u{1F5A4}-\u{1F5A5}\u{1F5A8}\u{1F5B1}-\u{1F5B2}\u{1F5BC}\u{1F5C2}-\u{1F5C4}\u{1F5D1}-\u{1F5D3}\u{1F5DC}-\u{1F5DE}\u{1F5E1}\u{1F5E3}\u{1F5E8}\u{1F5EF}\u{1F5F3}\u{1F5FA}-\u{1F64F}\u{1F680}-\u{1F6C5}\u{1F6CB}-\u{1F6D2}\u{1F6E0}-\u{1F6E5}\u{1F6E9}\u{1F6EB}-\u{1F6EC}\u{1F6F0}\u{1F6F3}-\u{1F6F8}\u{1F910}-\u{1F93A}\u{1F93C}-\u{1F93E}\u{1F940}-\u{1F945}\u{1F947}-\u{1F94C}\u{1F950}-\u{1F96B}\u{1F980}-\u{1F997}\u{1F9C0}\u{1F9D0}-\u{1F9E6}\u{200D}\u{20E3}\u{FE0F}\u{E0020}-\u{E007F}\u{2388}\u{2605}\u{2607}-\u{260D}\u{260F}-\u{2610}\u{2612}\u{2616}-\u{2617}\u{2619}-\u{261C}\u{261E}-\u{261F}\u{2621}\u{2624}-\u{2625}\u{2627}-\u{2629}\u{262B}-\u{262D}\u{2630}-\u{2637}\u{263B}-\u{263F}\u{2641}\u{2643}-\u{2647}\u{2654}-\u{265F}\u{2661}-\u{2662}\u{2664}\u{2667}\u{2669}-\u{267A}\u{267C}-\u{267E}\u{2680}-\u{2691}\u{2698}\u{269A}\u{269D}-\u{269F}\u{26A2}-\u{26A9}\u{26AC}-\u{26AF}\u{26B2}-\u{26BC}\u{26BF}-\u{26C3}\u{26C6}-\u{26C7}\u{26C9}-\u{26CD}\u{26D0}\u{26D2}\u{26D5}-\u{26E8}\u{26EB}-\u{26EF}\u{26F6}\u{26FB}-\u{26FC}\u{26FE}-\u{2701}\u{2703}-\u{2704}\u{270E}\u{2710}-\u{2711}\u{2765}-\u{2767}\u{1F000}-\u{1F003}\u{1F005}-\u{1F0CE}\u{1F0D0}-\u{1F0FF}\u{1F10D}-\u{1F10F}\u{1F12F}\u{1F16C}-\u{1F16F}\u{1F1AD}-\u{1F1E5}\u{1F203}-\u{1F20F}\u{1F23C}-\u{1F23F}\u{1F249}-\u{1F24F}\u{1F252}-\u{1F2FF}\u{1F322}-\u{1F323}\u{1F394}-\u{1F395}\u{1F398}\u{1F39C}-\u{1F39D}\u{1F3F1}-\u{1F3F2}\u{1F3F6}\u{1F4FE}\u{1F53E}-\u{1F548}\u{1F54F}\u{1F568}-\u{1F56E}\u{1F571}-\u{1F572}\u{1F57B}-\u{1F586}\u{1F588}-\u{1F589}\u{1F58E}-\u{1F58F}\u{1F591}-\u{1F594}\u{1F597}-\u{1F5A3}\u{1F5A6}-\u{1F5A7}\u{1F5A9}-\u{1F5B0}\u{1F5B3}-\u{1F5BB}\u{1F5BD}-\u{1F5C1}\u{1F5C5}-\u{1F5D0}\u{1F5D4}-\u{1F5DB}\u{1F5DF}-\u{1F5E0}\u{1F5E2}\u{1F5E4}-\u{1F5E7}\u{1F5E9}-\u{1F5EE}\u{1F5F0}-\u{1F5F2}\u{1F5F4}-\u{1F5F9}\u{1F6C6}-\u{1F6CA}\u{1F6D3}-\u{1F6DF}\u{1F6E6}-\u{1F6E8}\u{1F6EA}\u{1F6ED}-\u{1F6EF}\u{1F6F1}-\u{1F6F2}\u{1F6F9}-\u{1F6FF}\u{1F774}-\u{1F77F}\u{1F7D5}-\u{1F7FF}\u{1F80C}-\u{1F80F}\u{1F848}-\u{1F84F}\u{1F85A}-\u{1F85F}\u{1F888}-\u{1F88F}\u{1F8AE}-\u{1F90F}\u{1F93F}\u{1F94D}-\u{1F94F}\u{1F96C}-\u{1F97F}\u{1F998}-\u{1F9BF}\u{1F9C1}-\u{1F9CF}]$/u;
        const emojisFilters = response.map(item => {
          const emoji = item.code.match(emojiRegex)?.[0];
          return {
            ...item,
            code: emoji || item.code // 如果没有找到emoji，保留原始code
          };
        }).filter(item => item.code);
        
        aiEmojiList.push(...emojisFilters.filter(item => validEmojiRegex.test(item.code)));
        // console.log('response===>>>', response[0]?.code?.length);
        // for (const item of response) {
        //   console.log('item===>>>', item.code.length);
        // }
        // aiEmojiList.push(...response.filter(item => [2, 3].includes(item.code.length)));
      } catch (error) {
        console.error('解析 emojiAiSearch 返回数据错误:', error);
        // 解析失败时，返回空数组
        aiEmojiList.push([]);
      }
    } else {
      const baseCodes: string[] = searchResults.map(item => item.baseCode).filter(code => code !== null);
      
      // 分批查询
      for (let i = 0; i < baseCodes.length; i += 50) {
        const batch = baseCodes.slice(i, i + 50);
        // const emojiResults = await emojiPrepare.execute();
        const emojiResults = await db
          .select({
            fullCode: emoji.fullCode,
            code: emoji.code,
            name: emojiLanguage.name,
            hot: emoji.hot,
            type: emoji.type,
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
              inArray(emoji.fullCode, batch),
              or(eq(emoji.diversity, 0), eq(emoji.hot, 1))
            )
          )
          .orderBy(desc(emoji.hot))
          .limit(100);

          emojiList.push(...emojiResults);
          if (emojiList.length >= 300) {
            break;
          }
      }
    }

    // 最多返回500条
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