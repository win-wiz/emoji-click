'use client'

import { Trans } from '@lingui/macro'
import { useState, useRef } from 'react'

interface EmojiCategory {
  id: string
  icon: string
  name: React.ReactNode
  emojis: Array<{
    emoji: string
    description: React.ReactNode
  }>
}

const categories: EmojiCategory[] = [
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

export default function CategoryEmoji() {
  const [selectedCategory, setSelectedCategory] = useState<string>(DEFAULT_CATEGORY_ID)
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)
  const [showAllCategories, setShowAllCategories] = useState(false)
  const categoriesRef = useRef<HTMLDivElement>(null)

  // 处理滚动
  const handleScroll = (direction: 'left' | 'right') => {
    if (categoriesRef.current) {
      const scrollAmount = 300
      const newScrollLeft = direction === 'left' 
        ? categoriesRef.current.scrollLeft - scrollAmount
        : categoriesRef.current.scrollLeft + scrollAmount
      
      categoriesRef.current.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth'
      })
    }
  }

  const handleCopy = async (emoji: string, index: number) => {
    try {
      await navigator.clipboard.writeText(emoji)
      setCopiedIndex(index)
      setTimeout(() => {
        setCopiedIndex(null)
      }, 1500)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const currentCategory = categories.find(c => c.id === selectedCategory) ?? categories[0]

  // 计算需要显示的位置
  const scrollToCategory = (categoryId: string) => {
    const element = document.getElementById(`category-${categoryId}`)
    if (element && categoriesRef.current) {
      const container = categoriesRef.current
      const elementRect = element.getBoundingClientRect()
      const containerRect = container.getBoundingClientRect()
      
      // 计算元素右边缘到容器右边缘的距离
      const distanceToRight = containerRect.right - elementRect.right
      
      // 如果元素右边缘接近或超出容器右边缘，自动滚动以显示下一个元素
      if (distanceToRight < 100) { // 100px 是阈值，可以根据需要调整
        const nextScrollPosition = container.scrollLeft + elementRect.width + 16 // 16px 是间距
        container.scrollTo({
          left: nextScrollPosition,
          behavior: 'smooth'
        })
      } else if (elementRect.left < containerRect.left + 100) {
        // 如果元素左边缘接近或超出容器左边缘，向左滚动
        const prevScrollPosition = container.scrollLeft - elementRect.width - 16
        container.scrollTo({
          left: prevScrollPosition,
          behavior: 'smooth'
        })
      }
    }
  }

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
          <button
            onClick={() => setShowAllCategories(true)}
            className="group flex items-center gap-2 px-4 py-2 text-sm text-gray-500 hover:text-gray-900 hover:bg-gray-50 rounded-full transition-all duration-300"
          >
            <span><Trans>全部分类</Trans></span>
            <span className="px-1.5 py-0.5 text-xs bg-gray-100 text-gray-600 rounded-full">
              {categories.length}
            </span>
            <svg className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>

        {/* 类别选择器 */}
        <div className="relative mb-12">
          {/* 左侧导航区域 */}
          <div className="absolute -left-2 top-0 bottom-0 flex items-center z-20">
            <button 
              onClick={() => handleScroll('left')}
              className="relative group p-2 hover:bg-gray-100/80 rounded-full transition-all duration-300 focus:outline-none backdrop-blur-sm"
            >
              {/* 悬浮时的光晕效果 */}
              <div className="absolute inset-0 rounded-full bg-gray-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <svg 
                className="relative w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          </div>

          {/* 右侧导航区域 */}
          <div className="absolute -right-2 top-0 bottom-0 flex items-center z-20">
            <button 
              onClick={() => handleScroll('right')}
              className="relative group p-2 hover:bg-gray-100/80 rounded-full transition-all duration-300 focus:outline-none backdrop-blur-sm"
            >
              {/* 悬浮时的光晕效果 */}
              <div className="absolute inset-0 rounded-full bg-gray-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <svg 
                className="relative w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* 渐变遮罩 - 调整透明度和宽度 */}
          <div className="pointer-events-none absolute left-8 top-0 bottom-0 w-12 bg-gradient-to-r from-white/80 via-white/50 to-transparent z-10" />
          <div className="pointer-events-none absolute right-8 top-0 bottom-0 w-12 bg-gradient-to-l from-white/80 via-white/50 to-transparent z-10" />

          {/* 类别列表 */}
          <div ref={categoriesRef} className="overflow-auto scrollbar-hide mx-8">
            <div className="flex gap-4 px-3">
              {categories.map((category, index) => (
                <button
                  key={category.id}
                  id={`category-${category.id}`}
                  onClick={() => {
                    setSelectedCategory(category.id)
                    scrollToCategory(category.id)
                  }}
                  className={`group relative flex flex-col items-center min-w-[76px] p-3 rounded-xl transition-all duration-300 ${
                    selectedCategory === category.id
                      ? 'bg-gray-100 shadow-sm scale-105 transform'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  {/* 表情数量徽章 - 改为右上角定位 */}
                  <div className="absolute -top-1 -right-1 z-10">
                    <span className={`inline-flex items-center justify-center min-w-[20px] h-5 px-1 text-[10px] font-medium rounded-full transition-colors ${
                      selectedCategory === category.id
                        ? 'bg-purple-100 text-purple-700'
                        : 'bg-gray-100 text-gray-500 group-hover:bg-gray-200 group-hover:text-gray-700'
                    }`}>
                      {category.emojis.length}
                    </span>
                  </div>

                  {/* 图标和文字 */}
                  <span className={`text-2xl mb-1.5 transition-transform duration-300 ${
                    selectedCategory === category.id ? 'scale-110' : ''
                  }`}>
                    {category.icon}
                  </span>
                  <span className={`text-xs font-medium whitespace-nowrap transition-colors ${
                    selectedCategory === category.id
                      ? 'text-gray-900'
                      : 'text-gray-400 group-hover:text-gray-600'
                  }`}>
                    <Trans>{category.name}</Trans>
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 全部分类弹出层 */}
        {showAllCategories && (
          <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[80vh] overflow-auto p-8">
              <div className="flex items-center gap-3 mb-8">
                <span className="text-3xl">🎯</span>
                <h3 className="text-xl font-medium text-gray-900">
                  <Trans>全部表情分类</Trans>
                  <span className="ml-3 px-2 py-0.5 text-sm bg-gray-100 text-gray-600 rounded-full">
                    {categories.length} <Trans>种</Trans>
                    <span className="ml-1 text-gray-400">
                      ({categories.reduce((sum, category) => sum + category.emojis.length, 0)} <Trans>个表情</Trans>)
                    </span>
                  </span>
                </h3>
                <button
                  onClick={() => setShowAllCategories(false)}
                  className="ml-auto p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <svg className="w-5 h-5 text-gray-400 hover:text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {categories.map(category => (
                  <button
                    key={category.id}
                    onClick={() => {
                      setSelectedCategory(category.id)
                      setShowAllCategories(false)
                      const element = document.getElementById(`category-${category.id}`)
                      if (element) {
                        element.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
                      }
                    }}
                    className={`flex items-center gap-3 p-4 rounded-xl transition-all duration-300 ${
                      selectedCategory === category.id
                        ? 'bg-gray-100 shadow-sm'
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    <span className="text-2xl transform group-hover:scale-110 transition-transform duration-300">
                      {category.icon}
                    </span>
                    <div className="flex flex-col items-start">
                      <span className={`font-medium ${
                        selectedCategory === category.id
                          ? 'text-gray-900'
                          : 'text-gray-500 group-hover:text-gray-700'
                      }`}>
                        <Trans>{category.name}</Trans>
                      </span>
                      <span className="text-xs text-gray-400">
                        {category.emojis.length} <Trans>个表情</Trans>
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 表情网格 */}
        {currentCategory && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 sm:gap-4">
            {currentCategory.emojis.map((item, index) => (
              <div
                key={index}
                className="group relative flex flex-col items-center p-3 sm:p-4 rounded-lg bg-white hover:bg-gray-50 border border-gray-100 transition-all duration-300"
              >
                {/* 主要内容区域 - 点击跳转到详情页 */}
                <button
                  onClick={() => {
                    // TODO: 添加跳转逻辑
                    // router.push(`/emoji/${item.emoji}`)
                  }}
                  className="flex flex-col items-center flex-1 w-full cursor-pointer"
                >
                  <span className="text-4xl sm:text-5xl mb-2 transform group-hover:scale-110 transition-transform duration-300">
                    {item.emoji}
                  </span>
                  <span className="text-xs sm:text-sm text-gray-600 group-hover:text-gray-800 transition-colors">
                    <Trans>{item.description}</Trans>
                  </span>
                </button>

                {/* 复制按钮 */}
                <div className="absolute top-2 right-2">
                  <button
                    onClick={() => handleCopy(item.emoji, index)}
                    className="p-1.5 rounded-full opacity-0 group-hover:opacity-100 hover:bg-gray-100 transition-all duration-300"
                  >
                    <svg 
                      className="w-4 h-4 text-gray-400 hover:text-gray-600" 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" 
                      />
                    </svg>
                  </button>
                </div>

                {/* 复制成功提示 */}
                {copiedIndex === index && (
                  <div className="absolute inset-0 flex items-center justify-center animate-fade-in">
                    <div className="relative flex items-center scale-90 sm:scale-100">
                      <div className="absolute inset-0 bg-green-400/20 blur-xl rounded-full animate-pulse-slow" />
                      <div className="relative flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-white border border-gray-200/50 rounded-full shadow-lg animate-scale-up backdrop-blur-sm">
                        <div className="w-4 sm:w-5 h-4 sm:h-5 rounded-full bg-green-500 flex items-center justify-center animate-check-mark">
                          <svg 
                            className="w-2.5 sm:w-3 h-2.5 sm:h-3 text-white" 
                            fill="none" 
                            viewBox="0 0 24 24" 
                            stroke="currentColor"
                          >
                            <path 
                              strokeLinecap="round" 
                              strokeLinejoin="round" 
                              strokeWidth={3} 
                              d="M5 13l4 4L19 7" 
                            />
                          </svg>
                        </div>
                        <span className="text-xs sm:text-sm font-medium bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                          <Trans>已复制</Trans>
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}