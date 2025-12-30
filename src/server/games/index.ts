import { AVAILABLE_LOCALES } from "@/locales/config";
import { supportLang } from "@/utils";
import { emojiGame } from "@/server/db/schema";
import { db } from "@/server/db";
import { eq, and } from "drizzle-orm";
import { getOrSetCached } from "@/utils/kv-cache";


export async function fetchEmojiGame(initLang: AVAILABLE_LOCALES, code: string) {

  const lang = supportLang.includes(initLang) ? initLang : 'en';

  // 使用 KV 缓存，7天缓存，游戏数据基本不变
  return await getOrSetCached(
    'emojiGame',
    `${code}:${lang}`,
    async () => {
      try {
        const emojiGamePrepare = db
          .select({
            name: emojiGame.name,
            code: emojiGame.code,
            coverImageUrl: emojiGame.coverImageUrl,
            iframeUrl: emojiGame.iframeUrl,
            starting: emojiGame.starting,
            briefDesc: emojiGame.briefDesc,
            detailDesc: emojiGame.detailDesc,
            basicRule: emojiGame.basicRule,
            advancedSkills: emojiGame.advancedSkills,
            benefits: emojiGame.benefits,
            features: emojiGame.features,
            levelDesc: emojiGame.levelDesc,
            gameSecret: emojiGame.gameSecret,
            faq: emojiGame.faq,
          })
          .from(emojiGame)
          .where(and(eq(emojiGame.language, lang), eq(emojiGame.code, code)))
          .prepare();

        const result = await emojiGamePrepare.execute();

        return {
          success: true,
          data: result
        };
      } catch (error) {
        return {
          success: false,
          data: [],
          error: "Failed to fetch emoji game"
        };
      }
    },
    86400 * 7 // 7天缓存 - 游戏数据基本不变
  ).catch(error => {
    console.error('Failed to fetch emoji game:', error);
    return {
      success: false,
      data: [],
      error: "Failed to fetch emoji game"
    };
  });
}

export async function fetchEmojiGameForMeta(initLang: AVAILABLE_LOCALES, code: string) {

  const lang = supportLang.includes(initLang) ? initLang : 'en';

  // 使用 KV 缓存，7天缓存，SEO 元数据基本不变
  return await getOrSetCached(
    'emojiGameMeta',
    `${code}:${lang}`,
    async () => {
      try {
        const emojiGamePrepare = db
          .select({
            name: emojiGame.name,
            briefDesc: emojiGame.briefDesc,
          })
          .from(emojiGame)
          .where(and(eq(emojiGame.language, lang), eq(emojiGame.code, code)))
          .prepare();

        const result = await emojiGamePrepare.execute();

        return {
          success: true,
          data: result
        };
      } catch (error) {
        return {
          success: false,
          data: [],
          error: "Failed to fetch emoji game meta"
        };
      }
    },
    86400 * 7 // 7天缓存 - SEO 元数据基本不变
  ).catch(error => {
    console.error('Failed to fetch emoji game meta:', error);
    return {
      success: false,
      data: [],
      error: "Failed to fetch emoji game meta"
    };
  });
}