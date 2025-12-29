# Cloudflare KV 缓存设置指南

## 🚀 快速开始

### 1. 创建 KV Namespace

在 Cloudflare Dashboard 中创建 KV 命名空间：

```bash
# 使用 wrangler CLI 创建
wrangler kv:namespace create "EMOJI_CACHE"

# 输出示例：
# 🌀 Creating namespace with title "emoji-click-EMOJI_CACHE"
# ✨ Success!
# Add the following to your configuration file in your kv_namespaces array:
# { binding = "EMOJI_CACHE", id = "abc123..." }
```

### 2. 创建生产环境 KV

```bash
wrangler kv:namespace create "EMOJI_CACHE" --env production

# 输出示例中会得到生产环境的 namespace ID
```

### 3. 创建开发环境 KV

```bash
wrangler kv:namespace create "EMOJI_CACHE" --env development

# 输出示例中会得到开发环境的 namespace ID
```

### 4. 更新 wrangler.toml

将上面获得的 ID 填入 `wrangler.toml`:

```toml
[[kv_namespaces]]
binding = "EMOJI_CACHE"
id = "实际的KV_ID"  # 从步骤1获取

[env.production]
[[env.production.kv_namespaces]]
binding = "EMOJI_CACHE"
id = "实际的生产环境KV_ID"  # 从步骤2获取

[[env.development.kv_namespaces]]
binding = "EMOJI_CACHE"
id = "实际的开发环境KV_ID"  # 从步骤3获取
```

---

## 📝 KV 缓存结构

### 命名空间说明

KV 中的数据按以下命名空间组织：

| 命名空间 | 说明 | TTL | 示例 Key |
|---------|------|-----|----------|
| `search` | 搜索结果缓存 | 300秒 (5分钟) | `search:zh:笑脸` |
| `ai` | AI搜索结果 | 1800秒 (30分钟) | `ai:en:happy` |
| `keywords` | 随机关键词 | 300秒 (5分钟) | `keywords:zh` |
| `emojiByGroup` | 分类表情 | 3600秒 (1小时) | `emojiByGroup:en` |
| `hotEmoji` | 热门表情 | 3600秒 (1小时) | `hotEmoji:zh` |
| `randomKeywords` | 随机关键词 | 300秒 (5分钟) | `randomKeywords:fr` |

### 数据格式

所有缓存数据格式：

```typescript
{
  "data": any,        // 实际数据
  "timestamp": number, // 创建时间戳
  "ttl": number       // 过期时间(毫秒)
}
```

---

## 🔧 本地开发

### 使用 wrangler dev

```bash
# 启动本地开发服务器（会自动连接KV）
npx wrangler dev

# 或使用 Next.js dev（需要配置）
pnpm dev
```

### 查看 KV 数据

```bash
# 列出所有 keys
wrangler kv:key list --namespace-id=your-namespace-id

# 获取特定 key 的值
wrangler kv:key get "search:zh:笑脸" --namespace-id=your-namespace-id

# 删除特定 key
wrangler kv:key delete "search:zh:笑脸" --namespace-id=your-namespace-id
```

---

## 📊 性能对比

### 内存缓存 vs KV 缓存

| 特性 | 内存缓存 | KV 缓存 |
|------|---------|---------|
| 速度 | 极快 (~1ms) | 快 (~10-50ms) |
| 持久化 | ❌ Worker重启丢失 | ✅ 持久化存储 |
| 全局共享 | ❌ 每个Worker独立 | ✅ 全球共享 |
| 容量限制 | Worker内存限制 | 1GB (免费版) |
| 成本 | 免费 | 读取:$0.50/10M, 写入:$5/10M |

### 双层缓存策略

代码实现了智能双层缓存：

1. **L1缓存（内存）**: 快速访问，1分钟TTL
2. **L2缓存（KV）**: 持久化，5-60分钟TTL

```
请求 → 内存缓存 (命中返回) → KV缓存 (命中返回) → 数据库 → 写入缓存
```

---

## 💰 成本估算

### 免费额度（每天）

- **读取**: 100,000 次
- **写入**: 1,000 次
- **删除**: 1,000 次
- **列表**: 1,000 次
- **存储**: 1 GB

### 典型使用场景成本

假设每天：
- 搜索请求: 10,000 次
- 缓存命中率: 80%

**KV操作**:
- 读取: 10,000 次（免费额度内）
- 写入: 2,000 次（超出1,000次，额外$0.001）

**总成本**: ~$0.001/天 = ~$0.03/月

---

## 🔍 监控和调试

### 查看缓存统计

在代码中已集成统计功能：

```typescript
import { getCacheStats } from '@/utils/kv-cache';

const stats = getCacheStats();
console.log('内存缓存大小:', stats.memorySize);
```

### Cloudflare Dashboard

1. 进入 `Workers & Pages` > 你的项目
2. 点击 `KV` 标签
3. 选择 `EMOJI_CACHE` 命名空间
4. 可以查看和管理所有 keys

---

## 🛠️ 故障排查

### 问题1: KV 未绑定

**错误**: `KV namespace not available`

**解决**:
1. 检查 `wrangler.toml` 配置是否正确
2. 确认已创建 KV namespace
3. 重启开发服务器

### 问题2: 本地开发无法访问 KV

**解决**:
```bash
# 使用 wrangler dev 而不是 next dev
npx wrangler dev
```

### 问题3: 缓存不生效

**检查**:
1. 查看响应中的 `cached` 字段
2. 检查 KV Dashboard 是否有数据
3. 确认 TTL 未过期

---

## 🚀 部署

### 部署到 Cloudflare Pages

```bash
# 构建项目
pnpm build

# 部署（自动使用生产环境KV）
npx wrangler pages deploy
```

### 验证部署

```bash
# 检查 KV 绑定
wrangler pages deployment list

# 查看日志
wrangler pages deployment tail
```

---

## 📈 优化建议

### 1. 调整 TTL

根据实际情况调整缓存时间：

```typescript
// 在 kv-cache.ts 或调用处修改
await setCached('search', key, data, 600); // 增加到10分钟
```

### 2. 预热缓存

在应用启动时预加载常用数据：

```typescript
// 预热热门表情
await fetchHotEmoji('en');
await fetchHotEmoji('zh');
```

### 3. 监控缓存命中率

在日志中记录命中情况：

```typescript
if (cachedResult) {
  console.log('[Cache Hit] KV cache hit for:', key);
}
```

---

## ✅ 检查清单

部署前确认：

- [ ] 已创建 KV namespaces
- [ ] wrangler.toml 中填入了正确的 ID
- [ ] 本地测试通过
- [ ] 缓存逻辑正常工作
- [ ] 成本预估可接受
- [ ] 监控已配置

---

## 📞 支持

遇到问题？

1. 查看 Cloudflare KV 文档: https://developers.cloudflare.com/kv/
2. 检查 wrangler 日志
3. 在 Cloudflare Dashboard 查看 KV 数据
4. 使用 `getCacheStats()` 查看内存缓存状态

---

## 🎉 预期效果

使用 KV 缓存后：

- ✅ 缓存命中率: 80-95%
- ✅ 响应时间: 减少 60-80%
- ✅ 数据库查询: 减少 80-90%
- ✅ AI调用: 减少 95%+
- ✅ 成本: 极低（免费额度内）
- ✅ 可靠性: 显著提升（持久化缓存）
