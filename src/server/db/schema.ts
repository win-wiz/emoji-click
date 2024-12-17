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
	}
});

export const emojiKeywords = sqliteTable("emojiKeywords", {
	id: integer("id"),
	baseCode: text("baseCode"),
	language: text("language"),
	tag: numeric("tag"),
	content: text("content"),
	display: integer("display"),
	createdAt: numeric("createdAt"),
},
(table) => {
	return {
		baseCode: index("emojiKeywords_baseCode").on(table.baseCode),
	}
});

export const emojiLanguage = sqliteTable("emojiLanguage", {
	id: integer("id"),
	fullCode: text("fullCode"),
	language: text("language"),
	name: text("name"),
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
	}
});

export const emojiType = sqliteTable("emojiType", {
	id: integer("id"),
	type: integer("type"),
	language: text("language"),
	name: text("name"),
	icon: text("icon"),
	createdAt: numeric("createdAt"),
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