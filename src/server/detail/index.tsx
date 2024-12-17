import { AVAILABLE_LOCALES } from "@/locales/config";
import { db } from "@/server/db";
import { emoji, emojiKeywords, emojiLanguage } from "../db/schema";
import { eq, and, sql, inArray } from "drizzle-orm";
import { supportLang } from "@/utils";

export async function fetchEmojiProfileByFullCode(fullCode: string, initLang: AVAILABLE_LOCALES) {

  const lang = supportLang.includes(initLang) ? initLang : 'en';

  try {
    const profilePrepare = db
      .select({
        code: emoji.code,
        fullCode: emoji.fullCode,
        emotion: emoji.emotion,
        related: emoji.related,
        name: emojiLanguage.name,
        meaning: emojiLanguage.meaning,
        usageExample: emojiLanguage.usageExample,
        searchTips: emojiLanguage.searchTips,
        crossCulturalUsage: emojiLanguage.crossCulturalUsage,
        easterCulturalUsage: emojiLanguage.easterCulturalUsage,
        westernCulturalUsage: emojiLanguage.westernCulturalUsage,
        socialSetting: emojiLanguage.socialSetting,
        workSetting: emojiLanguage.workSetting,
        createdAt: emojiLanguage.createdAt,
        
      })
      .from(emojiLanguage)
      .leftJoin(emoji, eq(emojiLanguage.fullCode, emoji.fullCode))
      .where(and(eq(emojiLanguage.fullCode, fullCode), eq(emojiLanguage.language, lang)))
      .prepare();


    const profile = await profilePrepare.execute();

    const keywordsPrepare = db
      .select({
        baseCode: emojiKeywords.baseCode,
        tag: emojiKeywords.tag,
        contents: sql<string>`GROUP_CONCAT(${emojiKeywords.content})`,
      })
      .from(emojiKeywords)
      .where(and(eq(emojiKeywords.baseCode, fullCode), eq(emojiKeywords.language, lang)))
      .groupBy(emojiKeywords.baseCode, emojiKeywords.tag)
      .prepare();

    // 查找关键字
    const keywordsResult = await keywordsPrepare.execute();

    const keywords = keywordsResult.reduce<Array<{
      baseCode: string;
      tags: Array<{
        tag: string;
        contents: string[];
      }>;
    }>>((acc, curr) => {
      const existingEntry = acc.find(entry => entry.baseCode === curr.baseCode);
      if (existingEntry) {
        existingEntry.tags.push({
          tag: curr.tag!,
          contents: curr.contents.split(','),
        });
      } else {
        acc.push({
          baseCode: curr.baseCode!,
          tags: [{
            tag: curr.tag!,
            contents: curr.contents.split(','),
          }],
        });
      }
      return acc;
    }, []);

    // console.log('keywords====>>>', keywords)

    // 查找相关推荐
    const related = profile[0]?.related?.split(',') || [];
    const recommandsPrepare = db
      .select({
        fullCode: emoji.fullCode,
        code: emoji.code,
        name: emojiLanguage.name,
      })
      .from(emoji)
      .innerJoin(emojiLanguage, and(eq(emojiLanguage.fullCode, emoji.fullCode), eq(emojiLanguage.language, lang)))
      .where(inArray(emoji.code, related))
      .prepare();

    const recommands = await recommandsPrepare.execute() || [];
    
    const data: Record<string, any> = profile[0] || {};
    data.keywords = keywords;
    data.recommands = recommands;

    return {
      success: true,
      message: 'Successfully fetched emoji profile by full code',
      data
    }

  } catch (error) {
    console.error('Failed to fetch emoji profile by full code:', error)
    return {
      success: false,
      message: 'Failed to fetch emoji profile by full code',
      data: null
    }
  }
}