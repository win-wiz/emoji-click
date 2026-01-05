import { sql } from "drizzle-orm";
import { 
  sqliteTable,
  AnySQLiteColumn, 
  uniqueIndex, 
  integer, 
  text, 
  numeric, 
  index 
} from "drizzle-orm/sqlite-core"
  
// import { sql } from "drizzle-orm"

// import { relations } from "drizzle-orm/relations";

export const emoji = sqliteTable("emoji", {
	id: integer("id"),
	code: text("code"),
	fullCode: text("fullCode"),
	baseCode: text("baseCode"),
	diversity: integer("diversity"),
	skinCode: text("skinCode"),
	type: integer("type"),
	sort: integer("sort"),
	related: text("related"),
	hot: integer("hot"),
	emotion: integer("emotion"),
	createdAt: numeric("createdAt"),
},
(table) => {
	return {
		fullCode: uniqueIndex("emoji_fullCode").on(table.fullCode),
		// Add indexes for performance optimization
		type: index("emoji_type_idx").on(table.type),
		hot: index("emoji_hot_idx").on(table.hot),
		code: index("emoji_code_idx").on(table.code),
		codeFullCode: index("emoji_code_fullCode_idx").on(table.code, table.fullCode),
		diversity: index("emoji_diversity_idx").on(table.diversity),
		typeDiversity: index("emoji_type_diversity_idx").on(table.type, table.diversity),
		// Covering index for fetchEmojiByGroup to reduce rows read
		diversityCovering: index("emoji_diversity_covering_idx").on(table.diversity, table.type, table.sort, table.fullCode, table.code),
	}
});

export const emojiKeywords = sqliteTable("emojiKeywords", {
	id: integer("id"),
	baseCode: text("baseCode"),
	language: text("language"),
	tag: numeric("tag"),
	content: text("content"),
	contentLower: text("contentLower"), // 添加小写内容字段用于搜索优化
	display: integer("display"),
	createdAt: numeric("createdAt"),
},
(table) => {
	return {
		baseCode: index("emojiKeywords_baseCode").on(table.baseCode),
		// 添加复合索引优化搜索性能
		languageContentLower: index("emojiKeywords_language_contentLower").on(table.language, table.contentLower, table.baseCode),
	}
});

export const emojiLanguage = sqliteTable("emojiLanguage", {
	id: integer("id"),
	fullCode: text("fullCode"),
	language: text("language"),
	name: text("name"),
	nameLower: text("nameLower"), // 添加小写name字段用于搜索优化
	meaning: text("meaning"),
	usageExample: text("usageExample"),
	searchTips: text("searchTips"),
	crossCulturalUsage: text("crossCulturalUsage"),
	easterCulturalUsage: text("easterCulturalUsage"),
	westernCulturalUsage: text("westernCulturalUsage"),
	socialSetting: text("socialSetting"),
	workSetting: text("workSetting"),
	createdAt: numeric("createdAt"),
},
(table) => {
	return {
		fullCode: index("emojiLanguage_fullCode").on(table.fullCode),
		// 添加复合索引优化搜索性能
		languageNameLower: index("emojiLanguage_language_nameLower").on(table.language, table.nameLower, table.fullCode),
		// Covering index for fetchEmojiByGroup
		languageFullCodeName: index("emojiLanguage_language_fullCode_name_idx").on(table.language, table.fullCode, table.name),
		fullCodeLanguage: uniqueIndex("emojiLanguage_fullCode_language_idx").on(table.fullCode, table.language),
	}
});

export const emojiType = sqliteTable("emojiType", {
	id: integer("id"),
	type: integer("type"),
	language: text("language"),
	name: text("name"),
	icon: text("icon"),
	createdAt: numeric("createdAt"),
},
(table) => {
	return {
		languageType: index("emojiType_language_type_idx").on(table.language, table.type),
	}
});

export const emojiSearchTips = sqliteTable("emojiSearchTips", {
	id: integer("id").primaryKey({ autoIncrement: true }).notNull(),
	language: text("language").notNull(),
	content: text("content").notNull(),
	createdAt: numeric("createdAt").default(sql`(CURRENT_TIMESTAMP)`).notNull(),
},
(table) => {
	return {
		language: index("emojiSearchTips_language").on(table.language),
	}
});

export const emojiGame = sqliteTable("emojiGame", {
	id: integer("id").primaryKey({ autoIncrement: true }).notNull(),
	language: text("language").notNull(),
	name: text("name").notNull(),
	code: text("code").notNull(),
	coverImageUrl: text("coverImageUrl"),
	iframeUrl: text("iframeUrl"),
	starting: text("starting"),
	briefDesc: text("briefDesc"),
	detailDesc: text("detailDesc"),
	basicRule: text("basicRule"),
	advancedSkills: text("advancedSkills"),
	benefits: text("benefits"),
	features: text("features"),
	levelDesc: text("levelDesc"),
	gameSecret: text("gameSecret"),
	faq: text("faq"),
	createdAt: numeric("createdAt").default(sql`(CURRENT_TIMESTAMP)`).notNull(),
});