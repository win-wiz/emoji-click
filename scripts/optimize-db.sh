#!/bin/bash

# 数据库性能优化脚本
# 用途：为 D1 数据库添加索引，提升查询性能

# 颜色定义
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}=== D1 数据库性能优化 ===${NC}"
echo ""

# 从 wrangler.toml 读取数据库 ID
DATABASE_ID="1ca657d9-0436-4a6c-ae43-5fef6103944e"

echo -e "${YELLOW}数据库 ID: ${DATABASE_ID}${NC}"
echo ""

# 执行优化 SQL
echo -e "${GREEN}步骤 1: 添加数据库索引...${NC}"

# 读取 SQL 文件并执行
SQL_FILE="scripts/optimize-db-indexes.sql"

if [ ! -f "$SQL_FILE" ]; then
    echo -e "${RED}错误: 找不到 SQL 文件 $SQL_FILE${NC}"
    exit 1
fi

# 执行 SQL（使用 wrangler d1 execute）
echo -e "${YELLOW}执行索引优化...${NC}"
npx wrangler d1 execute aiEmoji --remote --file="$SQL_FILE"

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ 索引添加成功！${NC}"
else
    echo -e "${RED}✗ 索引添加失败，请检查错误信息${NC}"
    exit 1
fi

echo ""
echo -e "${GREEN}=== 优化完成 ===${NC}"
echo ""
echo -e "${YELLOW}优化效果说明：${NC}"
echo "1. emojiKeywords 查询：从全表扫描降低到索引查询"
echo "2. emojiLanguage 查询：利用复合索引提升搜索性能"
echo "3. emoji 表联合查询：通过复合索引优化 JOIN 性能"
echo "4. emojiType 分类查询：添加索引加速分类数据加载"
echo ""
echo -e "${YELLOW}建议：${NC}"
echo "- 首页数据已添加 7 天 KV 缓存，基本无数据库查询"
echo "- 热门表情数据已添加 1 天 KV 缓存"
echo "- 搜索关键词已添加 1 小时 KV 缓存"
echo "- 定期检查 Cloudflare Analytics 监控查询性能"
