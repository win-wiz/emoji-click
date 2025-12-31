-- 数据库性能优化：添加索引
-- 解决全表扫描问题，提升查询性能

-- 1. emojiKeywords 表优化
-- 更新索引为覆盖索引 (Covering Index) 以支持 SELECT baseCode
DROP INDEX IF EXISTS emojiKeywords_language_contentLower;
CREATE INDEX IF NOT EXISTS emojiKeywords_language_contentLower ON emojiKeywords(language, contentLower, baseCode);

-- 2. emojiLanguage 表优化
-- 更新索引为覆盖索引 (Covering Index) 以支持 SELECT fullCode
DROP INDEX IF EXISTS emojiLanguage_language_nameLower;
CREATE INDEX IF NOT EXISTS emojiLanguage_language_nameLower ON emojiLanguage(language, nameLower, fullCode);

-- 3. emoji 表优化
-- 添加常用查询字段索引
CREATE INDEX IF NOT EXISTS emoji_type ON emoji(type);
CREATE INDEX IF NOT EXISTS emoji_hot ON emoji(hot);
CREATE INDEX IF NOT EXISTS emoji_diversity ON emoji(diversity);
CREATE INDEX IF NOT EXISTS emoji_type_diversity ON emoji(type, diversity);

-- 4. emojiType 表优化
-- 添加常用查询字段索引
CREATE INDEX IF NOT EXISTS emojiType_language ON emojiType(language);
CREATE INDEX IF NOT EXISTS emojiType_type_language ON emojiType(type, language);

-- 5. emojiSearchTips 表优化
-- 已有索引：emojiSearchTips_language（已在 schema 中定义）

-- 6. emojiGame 表优化（新增）
-- 添加游戏查询字段索引
CREATE INDEX IF NOT EXISTS emojiGame_language ON emojiGame(language);
CREATE INDEX IF NOT EXISTS emojiGame_code ON emojiGame(code);
CREATE INDEX IF NOT EXISTS emojiGame_language_code ON emojiGame(language, code);

-- 性能分析提示：
-- 使用 EXPLAIN QUERY PLAN 来分析查询是否使用了索引
-- 例如：
-- EXPLAIN QUERY PLAN 
-- SELECT * FROM emojiKeywords 
-- WHERE language = 'en' AND contentLower LIKE '%smile%';
