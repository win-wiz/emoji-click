import { db } from "@/server/db";
import { emoji, emojiLanguage, emojiSearchTips, emojiType } from "@/server/db/schema";
import { eq, sql, and, inArray } from "drizzle-orm";
import { AVAILABLE_LOCALES } from "@/locales/config";
import { supportLang } from "@/utils";
import { getOrSetCached } from "@/utils/kv-cache";

// 分类查找表情
export async function fetchEmojiByGroup(initLang: AVAILABLE_LOCALES) {
  const lang = supportLang.includes(initLang) ? initLang : 'en';
  
  // 使用KV缓存 - 7天缓存，首页数据基本不变
  return await getOrSetCached(
    'emojiByGroup',
    lang,
    async () => {
      // 优化：并行查询三个表，在内存中聚合，避免 JOIN 产生的高 Read Rows
      const [categories, emojis, names] = await Promise.all([
        // 1. 获取分类
        db
          .select({
            id: emojiType.type,
            name: emojiType.name,
            language: emojiType.language,
            icon: emojiType.icon,
          })
          .from(emojiType)
          .where(eq(emojiType.language, lang))
          .execute(),

        // 2. 获取基础表情 (diversity=0)
        db
          .select({
            id: emoji.id,
            code: emoji.code,
            fullCode: emoji.fullCode,
            baseCode: emoji.baseCode,
            type: emoji.type,
            sort: emoji.sort,
            related: emoji.related,
            hot: emoji.hot,
            emotion: emoji.emotion,
          })
          .from(emoji)
          .where(eq(emoji.diversity, 0))
          .execute(),

        // 3. 获取语言包名称
        db
          .select({
            fullCode: emojiLanguage.fullCode,
            name: emojiLanguage.name,
          })
          .from(emojiLanguage)
          .where(eq(emojiLanguage.language, lang))
          .execute()
      ]);

      // 4. 在内存中构建映射
      const nameMap = new Map(names.map(n => [n.fullCode, n.name]));
      
      const emojisByType = new Map<number, any[]>();
      
      // 5. 将表情分配到分类
      for (const e of emojis) {
        if (e.type === null) continue;
        
        // 组合数据
        const emojiData = {
          ...e,
          name: nameMap.get(e.fullCode!) || ''
        };

        if (!emojisByType.has(e.type)) {
          emojisByType.set(e.type, []);
        }
        emojisByType.get(e.type)!.push(emojiData);
      }

      // 6. 组装最终结果
      const formattedResult = categories.map(cat => ({
        id: cat.id,
        name: cat.name,
        language: cat.language,
        icon: cat.icon,
        // 获取该分类下的表情，并按 sort 排序(如果数据库未排序)
        emojis: (emojisByType.get(cat.id!) || []).sort((a, b) => (a.sort || 0) - (b.sort || 0))
      }));

      return {
        success: true,
        data: formattedResult
      };
    },
    86400 * 7 // 7天缓存 - 首页分类数据基本不变
  ).catch(error => {
    // 优化数据库表不存在的报错信息
    if (error?.message?.includes('no such table')) {
      console.error('Database Error: Table not found. Please run "npm run db:migrate:local" to initialize the database.');
    } else {
      console.error("Error fetching emoji by group:", error);
    }
    return {
      success: false,
      data: [],
      error: "Failed to fetch emoji by group"
    };
  });
}


// 查找热门表情
export async function fetchHotEmoji(initLang: AVAILABLE_LOCALES) {
  const lang = supportLang.includes(initLang) ? initLang : 'en';
  
  // 使用KV缓存 - 1天缓存，热门表情可以定期轮换
  return await getOrSetCached(
    'hotEmoji',
    lang,
    async () => {
      // 1. 从 emoji 表中获取热门表情 (使用索引)
      // 限制 100 个候选，避免 JOIN 带来的全表扫描
      const hotCandidates = await db
        .select({
          fullCode: emoji.fullCode,
          code: emoji.code,
          baseCode: emoji.baseCode,
        })
        .from(emoji)
        .where(eq(emoji.hot, 1))
        .limit(100)
        .execute();

      if (!hotCandidates.length) {
        return { success: true, data: [] };
      }

      // 2. 在应用层随机打乱，选取 50 个
      const shuffledCandidates = hotCandidates.sort(() => Math.random() - 0.5).slice(0, 50);
      // 过滤掉可能的 null 值，确保类型安全
      const fullCodes = shuffledCandidates
        .map(c => c.fullCode)
        .filter((c): c is string => c !== null);

      if (fullCodes.length === 0) {
        return { success: true, data: [] };
      }

      // 3. 批量获取语言详情 (使用 IN 查询)
      const details = await db
        .select({
          fullCode: emojiLanguage.fullCode,
          name: emojiLanguage.name,
        })
        .from(emojiLanguage)
        .where(and(
          eq(emojiLanguage.language, lang),
          inArray(emojiLanguage.fullCode, fullCodes)
        ))
        .execute();

      // 4. 合并结果
      const hotEmoji = shuffledCandidates.map(c => {
        const detail = details.find(d => d.fullCode === c.fullCode);
        return {
          ...c,
          name: detail?.name || ''
        };
      }).filter(item => item.name); // 过滤掉没有翻译的(理论上不应该发生)

      return {
        success: true,
        data: hotEmoji
      };
    },
    86400 // 1天缓存 - 热门表情每天轮换一次
  ).catch(error => {
    // 优化数据库表不存在的报错信息
    if (error?.message?.includes('no such table')) {
      console.error('Database Error: Table not found. Please run "npm run db:migrate:local" to initialize the database.');
    } else {
      console.error("Error fetching hot emoji:", error);
    }
    return {
      success: false,
      data: [],
      error: "Failed to fetch hot emoji"
    };
  });
}

// 随机查找10个关键词
export async function fetchRandomKeywords(initLang: AVAILABLE_LOCALES) {
  const lang = supportLang.includes(initLang) ? initLang : 'en';
  
  // 使用KV缓存 - 1小时缓存，搜索提示词可以更频繁轮换
  return await getOrSetCached(
    'randomKeywords',
    lang,
    async () => {
      const keywords = db
        .select({
          content: emojiSearchTips.content
        })
        .from(emojiSearchTips)
        .where(eq(emojiSearchTips.language, lang))
        .limit(50) // 限制数量，减少 CPU 消耗
        .prepare();

      const keywordsResult = await keywords.execute();
      
      // 在应用层随机打乱，避免数据库 RANDOM() 消耗 CPU
      const shuffled = keywordsResult.sort(() => Math.random() - 0.5).slice(0, 10);
      const result = shuffled;

      return {
        success: true,
        data: result
      };
    },
    3600 // 1小时缓存 - 随机关键词每小时轮换
  ).catch((error) => {
    // 优化数据库表不存在的报错信息
    if (error?.message?.includes('no such table')) {
      console.error('Database Error: Table not found. Please run "npm run db:migrate:local" to initialize the database.');
    }
    return {
      success: true,
      data: []
    };
  });
}
