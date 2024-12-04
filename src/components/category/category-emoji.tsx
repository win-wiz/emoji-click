'use client'

import { Trans } from '@lingui/macro'
import { useState, useRef } from 'react'
import SingleEmoji from '../single-emoji'
import CategoryModal from './category-modal'
import { Category } from '@/types/category'
import CategoryNav from './category-nav'
import { AVAILABLE_LOCALES } from '@/locales/config'

const categories: Category[] = [
  {
    id: 'faces',
    icon: '😀',
    name: <Trans>表情符号</Trans>,
    emojis: [
      { emoji: '😀', description: <Trans>开心笑</Trans> },
      { emoji: '😃', description: <Trans>大笑</Trans> },
      { emoji: '😄', description: <Trans>笑眼</Trans> },
      { emoji: '😁', description: <Trans>露齿笑</Trans> },
      { emoji: '😅', description: <Trans>尴尬笑</Trans> },
      { emoji: '😂', description: <Trans>笑哭</Trans> },
    ]
  },
  {
    id: 'emotions',
    icon: '🥰',
    name: <Trans>情感</Trans>,
    emojis: [
      { emoji: '🥰', description: <Trans>喜欢</Trans> },
      { emoji: '😍', description: <Trans>爱心眼</Trans> },
      { emoji: '🤩', description: <Trans>星星眼</Trans> },
      { emoji: '😘', description: <Trans>飞吻</Trans> },
      { emoji: '😗', description: <Trans>亲亲</Trans> },
    ]
  },
  {
    id: 'hands',
    icon: '👋',
    name: '手势',
    emojis: [
      { emoji: '👋', description: '挥手' },
      { emoji: '', description: '举手' },
      { emoji: '✋', description: '手掌' },
      { emoji: '🖐️', description: '张开手' },
      { emoji: '👌', description: 'OK' },
    ]
  },
  {
    id: 'animals',
    icon: '🐶',
    name: '动物',
    emojis: [
      { emoji: '🐶', description: '狗' },
      { emoji: '🐱', description: '猫' },
      { emoji: '🐭', description: '老鼠' },
      { emoji: '🐹', description: '仓鼠' },
      { emoji: '🐰', description: '兔子' },
    ]
  },
  {
    id: 'food',
    icon: '🍎',
    name: '食物',
    emojis: [
      { emoji: '🍎', description: '苹果' },
      { emoji: '🍕', description: '披萨' },
      { emoji: '🍔', description: '汉堡' },
      { emoji: '🍟', description: '薯条' },
      { emoji: '🍜', description: '面条' },
    ]
  },
  {
    id: 'activities',
    icon: '⚽',
    name: '活动',
    emojis: [
      { emoji: '⚽', description: '足球' },
      { emoji: '🏀', description: '篮球' },
      { emoji: '🎮', description: '游戏' },
      { emoji: '🎨', description: '艺术' },
      { emoji: '🎭', description: '表演' },
    ]
  },
  {
    id: 'travel',
    icon: '✈️',
    name: '旅行',
    emojis: [
      { emoji: '✈️', description: '飞机' },
      { emoji: '🚗', description: '车' },
      { emoji: '🏖️', description: '海滩' },
      { emoji: '⛰️', description: '山脉' },
      { emoji: '🗺️', description: '地图' },
    ]
  },
  {
    id: 'objects',
    icon: '💡',
    name: '物品',
    emojis: [
      { emoji: '💡', description: '灯泡' },
      { emoji: '📱', description: '手机' },
      { emoji: '💻', description: '电脑' },
      { emoji: '⌚', description: '手表' },
      { emoji: '📚', description: '书本' },
    ]
  },
  {
    id: 'symbols',
    icon: '❤️',
    name: '符号',
    emojis: [
      { emoji: '❤️', description: '红心' },
      { emoji: '💫', description: '星星' },
      { emoji: '✨', description: '闪烁' },
      { emoji: '💥', description: '爆炸' },
      { emoji: '💯', description: '100分' },
    ]
  },
  {
    id: 'weather',
    icon: '🌞',
    name: '天气',
    emojis: [
      { emoji: '🌞', description: '太阳' },
      { emoji: '⛅', description: '多云' },
      { emoji: '🌧️', description: '下雨' },
      { emoji: '⛈️', description: '雷雨' },
      { emoji: '🌈', description: '彩虹' },
    ]
  },
  {
    id: 'plants',
    icon: '🌸',
    name: '植物',
    emojis: [
      { emoji: '🌸', description: '樱花' },
      { emoji: '🌹', description: '玫' },
      { emoji: '🌵', description: '仙人掌' },
      { emoji: '🌲', description: '松树' },
      { emoji: '🍀', description: '四叶草' },
    ]
  },
  {
    id: 'celebration',
    icon: '🎉',
    name: '庆祝',
    emojis: [
      { emoji: '🎉', description: '庆祝' },
      { emoji: '🎊', description: '礼花' },
      { emoji: '🎈', description: '气球' },
      { emoji: '🎂', description: '蛋糕' },
      { emoji: '🎁', description: '礼物' },
    ]
  },
  {
    id: 'love',
    icon: '💖',
    name: '爱心',
    emojis: [
      { emoji: '💖', description: '闪亮爱心' },
      { emoji: '💗', description: '跳动爱心' },
      { emoji: '💓', description: '心动' },
      { emoji: '💝', description: '礼物心' },
      { emoji: '💘', description: '丘比特之心' },
    ]
  },
  {
    id: 'fantasy',
    icon: '🦄',
    name: '幻想',
    emojis: [
      { emoji: '🦄', description: '独角兽' },
      { emoji: '🧚', description: '小精灵' },
      { emoji: '🧜‍♀️', description: '美人鱼' },
      { emoji: '🧙', description: '魔法师' },
      { emoji: '🔮', description: '水晶球' },
    ]
  },
  {
    id: 'music',
    icon: '🎵',
    name: '音乐',
    emojis: [
      { emoji: '🎵', description: '音符' },
      { emoji: '🎸', description: '吉他' },
      { emoji: '🎹', description: '钢琴' },
      { emoji: '🎺', description: '小号' },
      { emoji: '🎼', description: '乐谱' },
    ]
  },
  {
    id: 'space',
    icon: '🚀',
    name: '太空',
    emojis: [
      { emoji: '🚀', description: '火箭' },
      { emoji: '🌍', description: '地球' },
      { emoji: '🌠', description: '流星' },
      { emoji: '👨‍🚀', description: '宇航员' },
      { emoji: '🛸', description: '飞碟' },
    ]
  },
  {
    id: 'sea',
    icon: '🌊',
    name: '海洋',
    emojis: [
      { emoji: '🌊', description: '海浪' },
      { emoji: '🐋', description: '鲸鱼' },
      { emoji: '🐠', description: '热带鱼' },
      { emoji: '🦈', description: '鲨鱼' },
      { emoji: '🐚', description: '贝壳' },
    ]
  },
  {
    id: 'sports',
    icon: '🏃',
    name: '运动',
    emojis: [
      { emoji: '🏃', description: '跑步' },
      { emoji: '🏊', description: '游泳' },
      { emoji: '🚴', description: '骑行' },
      { emoji: '⛹️', description: '打球' },
      { emoji: '🏋️', description: '举重' },
    ]
  },
  {
    id: 'tech',
    icon: '💻',
    name: '科技',
    emojis: [
      { emoji: '💻', description: '电脑' },
      { emoji: '🤖', description: '机器人' },
      { emoji: '📱', description: '手机' },
      { emoji: '🎮', description: '游戏' },
      { emoji: '🔋', description: '电池' },
    ]
  },
  {
    id: 'time',
    icon: '⌛',
    name: '时间',
    emojis: [
      { emoji: '⌛', description: '沙漏' },
      { emoji: '⏰', description: '闹钟' },
      { emoji: '🕐', description: '一点' },
      { emoji: '📅', description: '日历' },
      { emoji: '⌚', description: '手表' },
    ]
  },
  {
    id: 'magic',
    icon: '✨',
    name: '魔法',
    emojis: [
      { emoji: '✨', description: '闪耀' },
      { emoji: '🌟', description: '星星' },
      { emoji: '🪄', description: '魔杖' },
      { emoji: '🎭', description: '魔术' },
      { emoji: '🎪', description: '马戏团' },
    ]
  },
  {
    id: 'jobs',
    icon: '👨‍💼',
    name: <Trans>职业</Trans>,
    emojis: [
      { emoji: '👨‍💼', description: <Trans>上班族</Trans> },
      { emoji: '👨‍⚕️', description: <Trans>医生</Trans> },
      { emoji: '👨‍🏫', description: <Trans>老师</Trans> },
      { emoji: '👨‍🍳', description: <Trans>厨师</Trans> },
      { emoji: '👨‍🎨', description: <Trans>艺术家</Trans> },
    ]
  }
]

// 确保 categories 数组不为空
if (categories.length === 0) {
  throw new Error('Categories array cannot be empty')
}

// 定义一个默认类别 ID
const DEFAULT_CATEGORY_ID = 'faces'

export default function CategoryEmoji({
  lang,
}: {
  lang: AVAILABLE_LOCALES 
}) {
  const [selectedCategory, setSelectedCategory] = useState<string>(DEFAULT_CATEGORY_ID)

  const currentCategory = categories.find(c => c.id === selectedCategory) ?? categories[0]


  return (
    <div className="relative -mx-6 sm:-mx-12 md:-mx-24 lg:-mx-32">
      <div className="absolute inset-0 bg-white" />

      <div className="relative container mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* 标题和更多按钮 */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <span className="text-3xl">🎯</span>
            <h2 className="text-xl font-medium text-gray-900">
              <Trans>表情分类</Trans>
            </h2>
          </div>
          <CategoryModal
            categories={categories}
            onChange={(selectNav: string) => {
              setSelectedCategory(selectNav);
            }}
            choicedCategory={selectedCategory}
          />
        </div>


        <CategoryNav
          categories={categories}
          selectedCategory={selectedCategory}
          onChange={(categoryId: string) => {
            setSelectedCategory(categoryId);
          }}
        />

        {/* 表情网格 */}
        {currentCategory && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 sm:gap-4">
            {currentCategory.emojis.map((item, index) => (
              <SingleEmoji
                key={index}
                emojiItem={item}
                lang={lang}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}