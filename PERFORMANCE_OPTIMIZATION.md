# 数据库性能优化文档

## 🚀 优化成果

### 1. 查询性能优化

**优化前问题：**
- `emojiKeywords` 表查询读取 **148.91k** 行数据（全表扫描）
- 多个查询读取 20k+ 行数据
- 使用 `LOWER()` 函数导致无法使用索引

**优化方案：**

#### A. 数据库索引优化
已添加以下索引（已执行）：

```sql
-- emojiKeywords 表
CREATE INDEX emojiKeywords_language ON emojiKeywords(language);

-- emojiLanguage 表
CREATE INDEX emojiLanguage_language ON emojiLanguage(language);

-- emoji 表
CREATE INDEX emoji_type ON emoji(type);
CREATE INDEX emoji_hot ON emoji(hot);
CREATE INDEX emoji_diversity ON emoji(diversity);
CREATE INDEX emoji_type_diversity ON emoji(type, diversity);

-- emojiType 表
CREATE INDEX emojiType_language ON emojiType(language);
CREATE INDEX emojiType_type_language ON emojiType(type, language);
```

#### B. 查询优化
- 使用 `contentLower` 和 `nameLower` 预计算字段替代 `LOWER()` 函数
- 减少 LIMIT 从 100 降至 50，减少数据库负载
- 利用复合索引优化搜索性能

**预期效果：**
- `emojiKeywords` 查询：从 148.91k 行降至索引扫描（预计 < 1k 行）
- 查询延迟：从 129ms 降至 < 30ms
- 数据库负载降低 **80%+**

---

### 2. 缓存策略优化

**优化前：**
- 首页数据缓存 1 小时
- 热门表情缓存 1 小时
- 随机关键词缓存 5 分钟

**优化后（已应用）：**

| 数据类型 | 缓存时长 | 理由 |
|---------|---------|------|
| **分类数据** (`emojiByGroup`) | 7 天 | 表情分类数据基本不变，长期缓存 |
| **热门表情** (`hotEmoji`) | 1 天 | 每天轮换一次，保持新鲜感 |
| **随机关键词** (`randomKeywords`) | 1 小时 | 每小时轮换，提供多样性 |

**缓存架构：**
- **L1 缓存（内存）**：1 分钟，极速访问
- **L2 缓存（KV）**：上述时长，持久化存储
- **双层缓存命中率预计 > 95%**

---

## 📊 性能监控

### 查看查询计划（验证索引使用）

```sql
-- 查看是否使用索引
EXPLAIN QUERY PLAN 
SELECT baseCode FROM emojiKeywords 
WHERE language = 'en' AND contentLower LIKE '%smile%';

-- 预期输出应包含 "USING INDEX"
```

### Cloudflare D1 Analytics
- 访问 Cloudflare Dashboard → D1 → aiEmoji
- 查看 "Queries per second" 和 "Query duration"
- 优化后应看到查询量下降和延迟降低

---

## 🔧 维护建议

### 定期检查
1. **每月检查 KV 缓存命中率**
   ```bash
   # 在 Cloudflare Workers Analytics 查看
   # KV Read/Write Operations
   ```

2. **监控数据库慢查询**
   - 查看 D1 Dashboard 的 Query Duration P99
   - 如果 P99 > 100ms，需要进一步优化

### 数据更新场景
当需要更新表情数据时：

```typescript
// 清除特定缓存
import { deleteCachedByPrefix } from '@/utils/kv-cache';

// 清除所有语言的分类缓存
await deleteCachedByPrefix('emojiByGroup', '');

// 清除特定语言的缓存
await deleteCached('hotEmoji', 'en');
```

---

## 📈 优化效果预估

### 数据库查询减少

| 场景 | 优化前 | 优化后 | 改善 |
|-----|-------|-------|------|
| 首页加载 | 每次查询 DB | 7 天内 0 查询 | **-100%** |
| 热门表情 | 每小时查询 | 每天 1 次查询 | **-96%** |
| 搜索关键词 | 每 5 分钟 | 每小时 1 次 | **-92%** |

### 成本节省
- D1 免费额度：1000 万次读取/天
- 优化后预计节省 **80%+ 查询次数**
- 每天可节省 **数百万次** 读取操作

### 用户体验提升
- 首页加载速度：从 200ms 降至 **< 50ms**
- 搜索响应速度：从 130ms 降至 **< 30ms**
- CDN 边缘缓存命中率：**> 95%**

---

## 🎯 下一步优化方向

### 1. 查询结果缓存
针对高频搜索词添加缓存：
```typescript
// 在 /api/search 中
const cacheKey = `search:${lang}:${q.toLowerCase()}`;
await getOrSetCached('search', cacheKey, fetcher, 3600);
```

### 2. 预热缓存
部署后自动预热所有语言的首页数据：
```typescript
// 部署钩子中执行
for (const lang of AVAILABLE_LOCALES) {
  await fetchEmojiByGroup(lang);
  await fetchHotEmoji(lang);
}
```

### 3. 增量更新
使用版本号机制，只更新变化的数据：
```typescript
// 添加版本字段
const version = await getDataVersion();
if (cachedVersion === version) {
  return cache;
}
```

---

## ✅ 执行清单

- [x] 添加数据库索引
- [x] 优化缓存时长
- [x] 减少查询 LIMIT
- [x] 使用预计算字段
- [ ] 监控生产环境性能
- [ ] 根据实际数据调整缓存策略
- [ ] 考虑添加搜索结果缓存

---

**最后更新：** 2025-12-30
**执行状态：** ✅ 已完成核心优化
