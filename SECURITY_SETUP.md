# 🔒 防爬虫安全配置指南

## 已实施的代码级防护

### 1. API接口防护 ✅

**位置**: `src/app/[lang]/api/search/route.ts`

**功能**:
- ✅ IP限流：每分钟最多20次请求
- ✅ 小时限制：每小时最多200次请求
- ✅ AI搜索限制：每分钟最多5次AI调用
- ✅ 自动封禁：超过限制封禁1小时
- ✅ User-Agent检测：拦截已知爬虫
- ✅ 请求缓存：5-30分钟缓存减少服务器压力
- ✅ 输入验证：防止恶意输入

### 2. 全局中间件防护 ✅

**位置**: `src/middleware.ts`

**功能**:
- ✅ 全局限流：每分钟100次请求
- ✅ 滥用检测：5分钟超过300次自动封禁
- ✅ API路径特别保护
- ✅ 爬虫识别和拦截

### 3. 性能优化 ✅

**功能**:
- ✅ 数据库查询优化（并行查询）
- ✅ 结果缓存（多级缓存）
- ✅ AI调用超时控制（8秒）
- ✅ 防抖延迟增加到800ms

---

## 🛡️ Cloudflare 额外防护配置

### 第一步：启用 Cloudflare WAF（Web应用防火墙）

1. 登录 Cloudflare Dashboard
2. 选择你的域名
3. 进入 **Security** > **WAF**
4. 启用以下规则：

```
规则1: 阻止已知恶意爬虫
- Expression: (cf.client.bot) and not (cf.verified_bot_category in {"Search Engine Crawler"})
- Action: Block

规则2: 限制API访问频率
- Expression: (http.request.uri.path contains "/api/search")
- Action: Rate Limit (20 requests per minute)

规则3: 阻止可疑User-Agent
- Expression: (http.user_agent contains "python" or http.user_agent contains "curl" or http.user_agent contains "wget")
- Action: Challenge (CAPTCHA)

规则4: 保护搜索接口
- Expression: (http.request.uri.path eq "/api/search" and http.request.method eq "POST")
- Action: Rate Limit (10 requests per minute per IP)
```

### 第二步：配置 Rate Limiting

进入 **Security** > **Rate Limiting**，创建规则：

```yaml
名称: API搜索限流
条件: 
  - URI Path contains "/api/search"
  - Method equals "POST"
限制:
  - 10 requests per 1 minute per IP
  - 100 requests per 1 hour per IP
操作: Block for 1 hour
```

### 第三步：启用 Bot Fight Mode

1. 进入 **Security** > **Bots**
2. 启用 **Bot Fight Mode** (免费版) 或 **Super Bot Fight Mode** (付费版)
3. 配置选项：
   - ✅ Definitely automated: Block
   - ✅ Likely automated: Challenge
   - ✅ Verified bots: Allow (搜索引擎)

### 第四步：配置缓存规则

进入 **Rules** > **Page Rules**，添加：

```
URL: *example.com/*/api/search*
Settings:
  - Cache Level: Standard
  - Edge Cache TTL: 5 minutes
  - Browser Cache TTL: 5 minutes
```

### 第五步：启用 DDoS 防护

1. 进入 **Security** > **DDoS**
2. 确保启用了 **HTTP DDoS Attack Protection**
3. 设置敏感度为 **Medium** 或 **High**

---

## 📊 监控和告警

### Cloudflare Analytics

1. 进入 **Analytics & Logs** > **Security**
2. 监控以下指标：
   - 被阻止的请求数
   - 质询（CAPTCHA）数量
   - 速率限制触发次数
   - 已知爬虫访问量

### 设置告警

进入 **Notifications**，创建告警：

```
告警1: 流量激增
- 触发条件: 请求数超过平时的 200%
- 通知方式: Email + Webhook

告警2: 高封禁率
- 触发条件: 每小时被封禁IP超过100个
- 通知方式: Email

告警3: DDoS攻击
- 触发条件: 检测到DDoS攻击
- 通知方式: Email + SMS
```

---

## 🔍 日志和调试

### 查看被拦截的请求

在代码中已添加日志，在 Cloudflare Dashboard 查看：

```bash
# 在服务器日志中搜索
[Middleware] 爬虫拦截
[Middleware] 限流拦截
检测到爬虫访问
限流拦截
```

### Cloudflare Logs (需要企业版)

如果有企业版，可以使用 Logpush：
1. 进入 **Analytics & Logs** > **Logs**
2. 配置 Logpush 到你的日志服务（如AWS S3, Google Cloud Storage）

---

## 🚨 紧急情况处理

### 如果正在遭受攻击

**立即措施**:

1. **启用 I'm Under Attack Mode**
   ```
   Security > Settings > Security Level
   选择 "I'm Under Attack"
   ```

2. **临时阻止所有API访问**（紧急情况）
   ```javascript
   // 在 middleware.ts 中添加
   if (pathname.includes('/api/')) {
     return new NextResponse('Service Temporarily Unavailable', { status: 503 });
   }
   ```

3. **添加IP白名单**（如果知道合法用户IP范围）
   ```
   WAF Rule:
   - Expression: (ip.src in {1.2.3.4 5.6.7.8}) and (http.request.uri.path contains "/api/")
   - Action: Allow
   ```

---

## 📈 性能预期

实施后的预期效果：

| 指标 | 优化前 | 优化后 | 改进 |
|------|--------|--------|------|
| 爬虫请求占比 | 80%+ | <10% | **90%↓** |
| 合法用户受影响 | 较大 | 最小 | **大幅改善** |
| 服务器负载 | 高 | 低 | **70%↓** |
| API响应时间 | 慢 | 快 | **60%↑** |
| Cloudflare费用 | 可能超额 | 正常 | **节省成本** |

---

## ⚙️ 配置调整建议

根据实际情况调整：

### 如果误拦截率高
```typescript
// 在 route.ts 中调整
const MAX_REQUESTS_PER_MINUTE = 30; // 从20增加到30
const AI_RATE_LIMIT = 10; // 从5增加到10
```

### 如果攻击仍然严重
```typescript
// 更严格的限制
const MAX_REQUESTS_PER_MINUTE = 10; // 从20降到10
const BAN_DURATION = 60 * 60 * 1000 * 24; // 封禁24小时
```

### 允许特定搜索引擎
```typescript
// 在 security.ts 中
export const GOOD_BOTS = [
  /googlebot/i,
  /bingbot/i,
  /baiduspider/i,
  // 添加更多...
];
```

---

## ✅ 检查清单

实施后请确认：

- [ ] Cloudflare WAF 已启用
- [ ] Rate Limiting 规则已配置
- [ ] Bot Fight Mode 已开启
- [ ] 缓存规则已设置
- [ ] 告警通知已配置
- [ ] 代码已部署到生产环境
- [ ] 监控仪表板可用
- [ ] 测试合法用户访问正常
- [ ] 测试爬虫被成功拦截
- [ ] 日志记录正常工作

---

## 📞 支持和反馈

如果遇到问题：
1. 检查 Cloudflare Analytics 中的安全事件
2. 查看服务器日志中的安全警告
3. 调整限流参数
4. 考虑添加 IP 白名单

**重要**: 定期审查被拦截的请求，确保没有误杀合法用户！
