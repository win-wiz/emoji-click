import { AVAILABLE_LOCALES } from "@/locales/config";
import { supportLang } from "@/utils";
import { emojiGame } from "@/server/db/schema";
import { db } from "@/server/db";
import { eq, and } from "drizzle-orm";


export async function fetchEmojiGame(initLang: AVAILABLE_LOCALES, code: string) {

  const lang = supportLang.includes(initLang) ? initLang : 'en';

  // console.log('lang===>>>', lang);
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

    console.log('返回的结果===>>>', result);
    return {
      success: true,
      data: result
    };
  } catch (error) {
    return {
      success: false,
      error: "Failed to fetch emoji game"
    };
  }
}

export async function fetchEmojiGameForMeta(initLang: AVAILABLE_LOCALES, code: string) {

  const lang = supportLang.includes(initLang) ? initLang : 'en';

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
      error: "Failed to fetch emoji game"
    };
  }
}