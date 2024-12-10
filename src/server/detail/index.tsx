import { AVAILABLE_LOCALES } from "@/locales/config";
import { db } from "@/server/db";
import { emoji, emojiLanguage } from "../db/schema";
import { eq, and } from "drizzle-orm";

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

    return {
      success: true,
      message: 'Successfully fetched emoji profile by full code',
      data: profile
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