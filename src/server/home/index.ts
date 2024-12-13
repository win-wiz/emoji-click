import { db } from "@/server/db";
import { emoji, emojiKeywords, emojiLanguage, emojiType } from "@/server/db/schema";
import { eq, sql, and } from "drizzle-orm";
import { AVAILABLE_LOCALES } from "@/locales/config";

// 分类查找表情
export async function fetchEmojiByGroup(lang: AVAILABLE_LOCALES) {
  try {
    const categoryPrepare = db
      .select({
        // 类型信息
        typeId: emojiType.type,
        typeName: emojiType.name,
        typeLanguage: emojiType.language,
        icon: emojiType.icon,
        // 使用 JSON_GROUP_ARRAY 将每个类型的emoji聚合为数组
        emojis: sql<string>`json_group_array(json_object(
          'id', ${emoji.id},
          'code', ${emoji.code},
          'fullCode', ${emoji.fullCode},
          'baseCode', ${emoji.baseCode},
          'type', ${emoji.type},
          'sort', ${emoji.sort},
          'related', ${emoji.related},
          'hot', ${emoji.hot},
          'emotion', ${emoji.emotion},
          'name', ${emojiLanguage.name}
        ))`
      })
      .from(emojiType)
      .leftJoin(emoji, eq(emojiType.type, emoji.type))
      .leftJoin(emojiLanguage, eq(emoji.fullCode, emojiLanguage.fullCode))
      .where(and(eq(emojiType.language, lang), eq(emojiLanguage.language, lang), eq(emoji.diversity, 0)))
      .groupBy(emojiType.type)
      .prepare();


    const result = await categoryPrepare.execute();

    // 处理结果，将JSON字符串解析为对象
    const formattedResult = result.map(item => ({
      id: item.typeId,
      name: item.typeName,
      language: item.typeLanguage,
      icon: item.icon,
      emojis: JSON.parse(item.emojis).filter((e: any) => e.id !== null) // 过滤掉空值
    }));

    return {
      success: true,
      data: formattedResult
    };

  } catch (error) {
    console.error("Error fetching emoji by group:", error);
    return {
      success: false,
      error: "Failed to fetch emoji by group"
    };
  }
}


// 查找热门表情
export async function fetchHotEmoji(lang: AVAILABLE_LOCALES) {
  try {
    const hotPrepare = db
      .select({
        fullCode: emojiLanguage.fullCode,
        name: emojiLanguage.name,
        code: emoji.code,
        baseCode: emoji.baseCode,
      })
      .from(emojiLanguage)
      .innerJoin(emoji, eq(emojiLanguage.fullCode, emoji.fullCode))
      .where(and(eq(emojiLanguage.language, lang), eq(emoji.hot, 1)))
      .prepare();

    const hotEmoji = await hotPrepare.execute();

    return {
      success: true,
      data: hotEmoji
    };
  } catch (error) {
    console.error("Error fetching hot emoji:", error);
    return {
      success: false,
      error: "Failed to fetch hot emoji"
    };
  }
}

// 随机查找10个关键词
export async function fetchRandomKeywords(lang: AVAILABLE_LOCALES) {
  const keywords = db
    .select({
      content: emojiKeywords.content
    })
    .from(emojiKeywords)
    .where(eq(emojiKeywords.language, lang))
    .orderBy(sql`RANDOM()`)
    .limit(10)
    .prepare();

  const result = await keywords.execute();

  const resultData = result.map((item) => item.content);

  console.log(resultData);

  return {
    success: true,
    data: resultData
  };
}
