'use client'

import { Trans } from '@lingui/macro'
import { useState, useCallback, useMemo, useEffect, memo } from 'react'
import SingleEmoji from '@/components/single-emoji'
import CategoryModal from './category-modal'
import CategoryNav from './category-nav'
import { AVAILABLE_LOCALES } from '@/locales/config'
import { motion, AnimatePresence } from 'framer-motion'
import { debounce } from '@/utils'
import { EmojiType } from '@/types/category'

const ITEMS_PER_PAGE = 30
const SCROLL_THRESHOLD = 800  // 增大滚动触发阈值，提前加载更多内容

// 分类状态接口
interface CategoryState {
  page: number;
  hasMore: boolean;
  loading: boolean;
  items: any[];
}

// 简化的动画配置
const containerVariants = {
  enter: (direction: number) => ({
    x: direction * 100, // 减小移动距离
    opacity: 0
  }),
  center: {
    x: 0,
    opacity: 1
  },
  exit: (direction: number) => ({
    x: direction * -100,
    opacity: 0
  })
}

// 记忆化单个表情项组件
const MemoizedEmojiItem = memo(function EmojiItem({ 
  item, 
  index, 
  lang 
}: { 
  item: any; 
  index: number; 
  lang: AVAILABLE_LOCALES 
}) {
  return (
    <div
      className="opacity-0 animate-[fadeIn_0.3s_ease-in-out_forwards]"
      style={{
        animationDelay: `${Math.min(index * 0.05, 0.5)}s`
      }}
    >
      <SingleEmoji
        emojiItem={item}
        lang={lang}
      />
    </div>
  )
}, (prevProps, nextProps) => {
  // 自定义比较函数，只在必要时重新渲染
  return (
    prevProps.item.id === nextProps.item.id &&
    prevProps.lang === nextProps.lang
  )
})

export default function CategoryEmoji({
  lang,
  categories = []
}: {
  lang: AVAILABLE_LOCALES 
  categories: Record<string, any>[]
}) {
  // 使用 useMemo 获取默认分类 ID
  const defaultCategoryId = useMemo(() => {
    return categories[0]?.id || 'faces'
  }, [categories])

  const [selectedCategory, setSelectedCategory] = useState<string>(() => defaultCategoryId)
  const [direction, setDirection] = useState(0)
  
  // 修改初始状态设置，使用 defaultCategoryId
  const [categoryStates, setCategoryStates] = useState(() => {
    const initialStates = new Map<string, CategoryState>()
    categories.forEach(category => {
      initialStates.set(category.id, {
        page: 1,
        hasMore: category.emojis.length > ITEMS_PER_PAGE,
        loading: false,
        items: category.emojis.slice(0, ITEMS_PER_PAGE)
      })
    })
    return initialStates
  })

  // 获取当前分类数据
  const currentCategory = useMemo(() => 
    categories.find(c => c.id === selectedCategory) ?? categories[0],
    [categories, selectedCategory]
  )

  // 获取当前分类状态
  const currentState = useMemo(() => {
    const state = categoryStates.get(selectedCategory)
    if (!state && currentCategory) {
      return {
        page: 1,
        hasMore: currentCategory.emojis.length > ITEMS_PER_PAGE,
        loading: false,
        items: currentCategory.emojis.slice(0, ITEMS_PER_PAGE)
      }
    }
    return state || { page: 1, hasMore: false, loading: false, items: [] }
  }, [categoryStates, selectedCategory, currentCategory])

  // 加载更多数据
  const loadMore = useCallback(() => {
    if (!currentCategory?.emojis || currentState.loading) return

    const nextPage = currentState.page + 1
    const end = ITEMS_PER_PAGE * nextPage
    const hasMoreItems = currentCategory.emojis.length > end

    if (!hasMoreItems) return

    setCategoryStates(prev => {
      const newStates = new Map(prev)
      newStates.set(selectedCategory, {
        page: nextPage,
        loading: false,
        hasMore: hasMoreItems,
        items: currentCategory.emojis.slice(0, end)
      })
      return newStates
    })
  }, [currentCategory?.emojis, currentState.loading, currentState.page, selectedCategory])

  // 处理滚动
  const handleScroll = useCallback(() => {
    if (currentState.loading) return

    const scrollHeight = document.documentElement.scrollHeight
    const scrollTop = window.scrollY
    const clientHeight = window.innerHeight
    const remainingSpace = scrollHeight - scrollTop - clientHeight

    // 当距离底部 SCROLL_THRESHOLD 像素时触发加载
    if (remainingSpace < SCROLL_THRESHOLD && currentState.hasMore) {
      loadMore()
    }
  }, [currentState.loading, currentState.hasMore, loadMore])

  // 优化渲染列表
  const renderEmojiList = useMemo(() => (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 sm:gap-4">
      {currentState.items.map((item: Record<string, any>, index: number) => (
        <MemoizedEmojiItem
          key={item.id || index}
          item={item}
          index={index}
          lang={lang}
        />
      ))}
    </div>
  ), [currentState.items, lang])

  // 优化加载指示器
  const LoadingIndicator = useMemo(() => (
    currentState.loading && (
      <div className="py-4 flex justify-center">
        <div className="flex items-center gap-2 text-primary/70">
          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
          <span><Trans>加载中...</Trans></span>
        </div>
      </div>
    )
  ), [currentState.loading])

  // 优化滚动处理
  const debouncedScroll = useMemo(
    () => debounce(handleScroll, 150),
    [handleScroll]
  )

  useEffect(() => {
    window.addEventListener('scroll', debouncedScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', debouncedScroll)
      debouncedScroll.cancel?.() // 清理防抖函数
    }
  }, [debouncedScroll])

  // 分类切换时检查
  useEffect(() => {
    handleScroll()
  }, [selectedCategory, handleScroll])

  // 处理分类切换
  const handleCategoryChange = useCallback((newCategoryId: string) => {
    const currentIndex = categories.findIndex(c => c.id === selectedCategory)
    const newIndex = categories.findIndex(c => c.id === newCategoryId)
    setDirection(newIndex > currentIndex ? 1 : -1)
    setSelectedCategory(newCategoryId)
  }, [categories, selectedCategory])

  return (
    <div className="relative -mx-6 sm:-mx-12 md:-mx-24 lg:-mx-32">
      <div className="absolute inset-0 bg-white" />

      <div className="relative container mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* 标题和导航部分 */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <span className="text-3xl">🎯</span>
            <h2 className="text-xl font-medium text-gray-900">
              <Trans>表情分类</Trans>
            </h2>
          </div>
          <CategoryModal
            categories={categories}
            onChange={handleCategoryChange}
            choicedCategory={selectedCategory}
          />
        </div>

        <CategoryNav
          categories={categories as EmojiType[]}
          selectedCategory={selectedCategory}
          onChange={handleCategoryChange}
        />

        {/* 表情网格区域 */}
        <div className="relative overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedCategory}
              custom={direction}
              variants={containerVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                duration: 0.3, // 固定动画时长
                ease: "easeInOut" // 使用简单的缓动函数
              }}
              className="w-full"
            >
              {currentCategory && (
                <div className="space-y-8">
                  {renderEmojiList}
                  {LoadingIndicator}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
