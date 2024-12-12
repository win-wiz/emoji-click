import { AVAILABLE_LOCALES } from "@/locales/config";
import { db } from "@/server/db";
import { emoji, emojiKeywords, emojiLanguage } from "../db/schema";
import { eq, and, sql } from "drizzle-orm";

export async function fetchEmojiProfileByFullCode(fullCode: string, lang: AVAILABLE_LOCALES) {

  try {
    const profilePrepare = db
      .select({
        code: emoji.code,
        fullCode: emoji.fullCode,
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
    
    const data: Record<string, any> = profile[0] || {};
    data.keywords = keywords;

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