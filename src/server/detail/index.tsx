import { AVAILABLE_LOCALES } from "@/locales/config";
import { db } from "@/server/db";
import { emoji, emojiKeywords, emojiLanguage } from "../db/schema";
import { eq, and, sql, inArray, count } from "drizzle-orm";
import { supportLang } from "@/utils";
import { getOrSetCached } from "@/utils/kv-cache";

export async function fetchEmojiProfileByFullCode(fullCode: string, initLang: AVAILABLE_LOCALES) {

  const lang = supportLang.includes(initLang) ? initLang : 'en';

  // 使用 KV 缓存，7天缓存，表情详情数据基本不变
  return await getOrSetCached(
    'emojiProfile',
    `${fullCode}:${lang}`,
    async () => {
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
        content: emojiKeywords.content, // 单条查询，避免 GROUP_CONCAT
      })
      .from(emojiKeywords)
      .where(and(eq(emojiKeywords.baseCode, fullCode), eq(emojiKeywords.language, lang)))
      .prepare();

    // 查找关键字
    const keywordsResult = await keywordsPrepare.execute();

    // 在应用层聚合，避免数据库 GROUP_CONCAT 消耗 CPU
    const keywords = keywordsResult.reduce<Array<{
      baseCode: string;
      tags: Array<{
        tag: string;
        contents: string[];
      }>;
    }>>((acc, curr) => {
      const existingEntry = acc.find(entry => entry.baseCode === curr.baseCode);
      if (existingEntry) {
        const existingTag = existingEntry.tags.find(t => t.tag === curr.tag);
        if (existingTag) {
          existingTag.contents.push(curr.content!);
        } else {
          existingEntry.tags.push({
            tag: curr.tag!,
            contents: [curr.content!],
          });
        }
      } else {
        acc.push({
          baseCode: curr.baseCode!,
          tags: [{
            tag: curr.tag!,
            contents: [curr.content!],
          }],
        });
      }
      return acc;
    }, []);

    // console.log('keywords====>>>', keywords)

    // 查找相关推荐
    const related = profile[0]?.related?.split(',') || [];
    let recommands: { fullCode: string | null; code: string | null; name: string | null; }[] = [];

    if (related.length > 0) {
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

      recommands = await recommandsPrepare.execute();
    }
    
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
    },
    86400 * 7 // 7天缓存 - 表情详情数据基本不变
  ).catch(error => {
    console.error('Failed to fetch emoji profile:', error);
    return {
      success: false,
      message: 'Failed to fetch emoji profile by full code',
      data: null
    };
  });
}

export async function fetchGenerateMetadata(lang: AVAILABLE_LOCALES, fullCode: string) {
  // 使用 KV 缓存，7天缓存，SEO 元数据基本不变
  return await getOrSetCached(
    'emojiMetadata',
    `${fullCode}:${lang}`,
    async () => {
      const metadataPrepare = db
        .select({
          name: emojiLanguage.name,
          meaning: emojiLanguage.meaning,
          code: emoji.code,
        })
        .from(emojiLanguage)
        .leftJoin(emoji, eq(emojiLanguage.fullCode, emoji.fullCode))
        .where(and(eq(emojiLanguage.fullCode, fullCode), eq(emojiLanguage.language, lang)))
        .prepare();

      const metadata = await metadataPrepare.execute();

      return {
        data: metadata[0]
      }
    },
    86400 * 7 // 7天缓存
  ).catch(() => ({ data: null }));
}

export async function getEmojiLanguageCount() {
  return db
    .select({ count: count() })
    .from(emojiLanguage)
    .execute();
}
